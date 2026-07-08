/* Launchpad — College Application Organizer
 * Buildless vanilla JS. Data in localStorage. Claude via user's own API key (browser-direct). */

'use strict';

const STORAGE_KEY = 'launchpad_data_v1';
const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_DATA = {
  version: 1,
  profile: { name: '', gradYear: '', major: '', notes: '' },
  settings: { apiKey: '', model: 'claude-opus-4-8' },
  schools: [],
  essays: [],
  opportunities: [],
  activities: [],
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return Object.assign(structuredClone(DEFAULT_DATA), parsed);
  } catch (e) {
    console.error('Load failed', e);
    return structuredClone(DEFAULT_DATA);
  }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- Utilities ---------- */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T23:59:59');
  if (isNaN(d)) return null;
  return Math.ceil((d - new Date()) / 86400000);
}
function urgencyPill(days) {
  if (days === null) return '';
  const cls = days < 0 ? 'soon' : days <= 21 ? 'soon' : days <= 60 ? 'mid' : 'far';
  const label = days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`;
  return `<span class="pill ${cls}">${label}</span>`;
}
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.hidden = true, 2600);
}

/* ---------- Tabs ---------- */
document.getElementById('tabs').addEventListener('click', e => {
  const btn = e.target.closest('button[data-tab]');
  if (!btn) return;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + btn.dataset.tab));
  renderAll();
});

/* ---------- Claude connector (browser-direct) ---------- */
async function callClaude(userText, system, maxTokens = 2048) {
  const { apiKey, model } = state.settings;
  if (!apiKey) throw new Error('No API key set. Add your Anthropic key in Settings.');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-opus-4-8',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userText }],
    }),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch (_) {}
    throw new Error(`Claude API error ${res.status}${detail ? ': ' + detail : ''}`);
  }
  const data = await res.json();
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

function profileContext() {
  const p = state.profile;
  return `Student profile:\n- Name: ${p.name || 'N/A'}\n- Graduation year: ${p.gradYear || 'N/A'}\n- Intended major(s): ${p.major || 'N/A'}\n- Context/notes: ${p.notes || 'none provided'}`;
}

/* Runs an async AI task, showing a spinner in the target element. */
async function runAI(targetEl, fn) {
  const prev = targetEl.innerHTML;
  targetEl.classList.remove('muted');
  targetEl.innerHTML = '<span class="spinner"></span> Thinking…';
  try {
    const out = await fn();
    targetEl.textContent = out || '(no response)';
  } catch (e) {
    targetEl.textContent = '⚠ ' + e.message;
  }
}

/* ---------- Render: Dashboard ---------- */
function renderDashboard() {
  const submitted = state.schools.filter(s => s.status === 'submitted' || s.status === 'accepted').length;
  const stats = [
    { num: state.schools.length, lbl: 'Schools' },
    { num: submitted, lbl: 'Apps submitted' },
    { num: state.essays.length, lbl: 'Essays' },
    { num: state.opportunities.filter(o => o.status !== 'done').length, lbl: 'Open opportunities' },
  ];
  document.getElementById('statRow').innerHTML = stats.map(s =>
    `<div class="stat"><div class="num">${s.num}</div><div class="lbl">${esc(s.lbl)}</div></div>`).join('');

  // Merge deadlines from schools + opportunities
  const items = [];
  state.schools.forEach(s => { if (s.deadline && s.status !== 'submitted' && s.status !== 'accepted') items.push({ name: s.name, kind: s.round || 'App', date: s.deadline }); });
  state.opportunities.forEach(o => { if (o.deadline && o.status !== 'done') items.push({ name: o.name, kind: o.type, date: o.deadline }); });
  items.sort((a, b) => new Date(a.date) - new Date(b.date));

  const list = document.getElementById('deadlineList');
  list.innerHTML = items.length ? items.slice(0, 12).map(i => {
    const d = daysUntil(i.date);
    return `<div class="list-item"><div><div class="when">${esc(i.name)}</div><div class="muted" style="font-size:12px">${esc(i.kind)} · ${fmtDate(i.date)}</div></div>${urgencyPill(d)}</div>`;
  }).join('') : '<div class="muted">No upcoming deadlines yet. Add schools and opportunities to see them here.</div>';
}

document.getElementById('coachBtn').addEventListener('click', () => {
  const out = document.getElementById('coachOut');
  runAI(out, () => {
    const summary = {
      schools: state.schools.map(s => ({ name: s.name, round: s.round, deadline: s.deadline, status: s.status, supplements: s.supplements, recs: s.recs })),
      essays: state.essays.map(e => ({ title: e.title, promptType: e.promptType, status: e.status, words: (e.text || '').trim().split(/\s+/).filter(Boolean).length })),
      opportunities: state.opportunities.map(o => ({ name: o.name, type: o.type, deadline: o.deadline, status: o.status })),
      activities: state.activities.map(a => ({ title: a.title, category: a.category, status: a.status })),
    };
    const sys = `You are a sharp, encouraging college admissions coach. Today is ${new Date().toISOString().slice(0, 10)}. Given a student's profile and their current application data, produce a prioritized, specific action list. Lead with the single most time-sensitive thing. Flag missing pieces (thin extracurriculars, unstarted essays, missing recommenders, approaching fly-in/scholarship deadlines). Be concrete and concise — a numbered list of at most 7 items, each one sentence. No preamble.`;
    return callClaude(`${profileContext()}\n\nApplication data (JSON):\n${JSON.stringify(summary, null, 2)}`, sys, 1500);
  });
});

/* ---------- Render: Schools ---------- */
const ROUNDS = ['ED', 'ED II', 'EA', 'REA', 'RD', 'Rolling'];
const PLATFORMS = ['Common App', 'Coalition', 'UC App', 'ApplyTexas', 'Proprietary'];
const APP_STATUS = ['not-started', 'in-progress', 'submitted', 'accepted', 'waitlisted', 'rejected'];

function renderSchools() {
  const body = document.getElementById('schoolBody');
  if (!state.schools.length) { body.innerHTML = '<tr><td colspan="9" class="muted">No schools yet. Click “Add school”.</td></tr>'; return; }
  const rows = [...state.schools].sort((a, b) => (a.deadline || '9999') > (b.deadline || '9999') ? 1 : -1);
  body.innerHTML = rows.map(s => {
    const suppDone = (s.supplements || []).filter(x => x.status === 'done').length;
    const supp = (s.supplements || []).length;
    return `<tr>
      <td><strong>${esc(s.name)}</strong>${s.url ? ` <a href="${esc(s.url)}" target="_blank" rel="noopener" style="color:var(--accent)">↗</a>` : ''}</td>
      <td>${esc(s.platform || '—')}</td>
      <td>${esc(s.round || '—')}</td>
      <td>${fmtDate(s.deadline)} ${urgencyPill(daysUntil(s.deadline))}</td>
      <td>${supp ? `${suppDone}/${supp}` : '—'}</td>
      <td>${esc(s.recs || '—')}</td>
      <td>${esc(s.finaid || '—')}</td>
      <td><span class="badge ${s.status}">${esc((s.status || '').replace('-', ' '))}</span></td>
      <td><div class="row-actions">
        <button class="btn ghost small" data-research-school="${s.id}" title="Deep research & strategy">🔬${s.research ? ' ✓' : ''}</button>
        <button class="btn ghost small" data-edit-school="${s.id}">Edit</button>
        <button class="btn ghost small" data-del-school="${s.id}">✕</button>
      </div></td>
    </tr>`;
  }).join('');
}

function schoolForm(s) {
  s = s || {};
  const supp = (s.supplements || []);
  return `
  <div class="form-grid">
    <label>School name <input id="f_name" value="${esc(s.name)}" /></label>
    <label>Website URL <input id="f_url" value="${esc(s.url)}" placeholder="https://" /></label>
    <label>Platform <select id="f_platform">${PLATFORMS.map(p => `<option ${p === s.platform ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
    <label>Round <select id="f_round">${ROUNDS.map(r => `<option ${r === s.round ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
    <label>Deadline <input id="f_deadline" type="date" value="${esc(s.deadline)}" /></label>
    <label>Status <select id="f_status">${APP_STATUS.map(x => `<option value="${x}" ${x === s.status ? 'selected' : ''}>${x.replace('-', ' ')}</option>`).join('')}</select></label>
    <label>Recommenders <input id="f_recs" value="${esc(s.recs)}" placeholder="e.g. 2 teachers + counselor" /></label>
    <label>Financial aid <input id="f_finaid" value="${esc(s.finaid)}" placeholder="CSS + FAFSA" /></label>
  </div>
  <label>Supplement prompts (one per line — mark done by starting the line with a tick, e.g. "✓ Why us")
    <textarea id="f_supp" rows="4" placeholder="Why us? (250 words)&#10;Community essay (300 words)">${esc(supp.map(x => (x.status === 'done' ? '✓ ' : '') + x.prompt).join('\n'))}</textarea>
  </label>
  <label>Notes <textarea id="f_notes" rows="2">${esc(s.notes)}</textarea></label>`;
}

function saveSchoolFromForm(id) {
  const suppLines = document.getElementById('f_supp').value.split('\n').map(l => l.trim()).filter(Boolean);
  const supplements = suppLines.map(l => {
    const done = /^(✓|\[x\]|x )/i.test(l);
    return { prompt: l.replace(/^(✓|\[x\]|x )\s*/i, ''), status: done ? 'done' : 'todo' };
  });
  const rec = {
    id: id || uid(),
    name: document.getElementById('f_name').value.trim(),
    url: document.getElementById('f_url').value.trim(),
    platform: document.getElementById('f_platform').value,
    round: document.getElementById('f_round').value,
    deadline: document.getElementById('f_deadline').value,
    status: document.getElementById('f_status').value,
    recs: document.getElementById('f_recs').value.trim(),
    finaid: document.getElementById('f_finaid').value.trim(),
    supplements,
    notes: document.getElementById('f_notes').value.trim(),
  };
  if (!rec.name) { toast('School needs a name'); return false; }
  const existing = state.schools.find(x => x.id === id);
  if (existing && existing.research) rec.research = existing.research; // preserve saved research
  const idx = state.schools.findIndex(x => x.id === id);
  if (idx >= 0) state.schools[idx] = rec; else state.schools.push(rec);
  save(); return true;
}

/* Deep research on a specific school (Claude-generated background + strategy). */
function openResearch(id) {
  const s = state.schools.find(x => x.id === id);
  if (!s) return;
  const bodyHtml = `
    <p class="hint">Claude-generated background and application strategy for <strong>${esc(s.name)}</strong>, tailored to your profile. This synthesizes public knowledge about the school and general patterns in what admitted students emphasize — it does <em>not</em> reproduce anyone's actual essays.</p>
    <div class="ai-out" id="research-out">${s.research ? esc(s.research) : '<span class="muted">No research yet. Click Generate.</span>'}</div>`;
  openModal('🔬 Deep research: ' + s.name, bodyHtml, [
    { label: s.research ? 'Regenerate' : 'Generate', primary: true, onClick: () => generateResearch(id) },
  ]);
}
async function generateResearch(id) {
  const s = state.schools.find(x => x.id === id);
  const out = document.getElementById('research-out');
  const sys = `You are a knowledgeable, honest college admissions advisor. Produce concise, genuinely useful research on ONE specific college for an applicant. Use clear sections with these headers exactly:
1) Academic strengths & standout programs
2) Culture & what they value in students
3) Selectivity & context (state that figures are approximate)
4) How to position THIS application — specific "Why us" angles tied to real programs, traditions, or opportunities at the school
5) What admitted students tend to emphasize — general themes and traits only
Rules: be specific to this school, not generic; tailor point 4 to the student's profile; do NOT fabricate or reproduce any real applicant's essay; flag anything you are unsure about. Keep it tight and skimmable.`;
  const user = `${profileContext()}\n\nSchool: ${s.name}${s.url ? ' (' + s.url + ')' : ''}\nApplication round I'm considering: ${s.round || 'undecided'}`;
  await runAI(out, async () => {
    const text = await callClaude(user, sys, 2500);
    s.research = text;
    save();
    renderSchools(); // refresh the ✓ marker
    return text;
  });
}
document.getElementById('schoolBody').addEventListener('click', e => {
  const r = e.target.closest('[data-research-school]');
  if (r) openResearch(r.dataset.researchSchool);
});

document.getElementById('loadSchoolsBtn').addEventListener('click', () => {
  const existing = new Set(state.schools.map(s => (s.name || '').toLowerCase()));
  let added = 0;
  (window.MY_SCHOOLS || []).forEach(s => {
    if (existing.has((s.name || '').toLowerCase())) return;
    state.schools.push(Object.assign({ id: uid(), status: 'not-started', supplements: [] }, s));
    added++;
  });
  save(); renderAll();
  toast(added ? `Added ${added} school${added > 1 ? 's' : ''} with research — verify deadlines` : 'Already loaded — no duplicates added');
});
document.getElementById('addSchoolBtn').addEventListener('click', () => {
  openModal('Add school', schoolForm(), [{ label: 'Save', primary: true, onClick: () => { if (saveSchoolFromForm(null)) { closeModal(); renderAll(); } } }]);
});
document.getElementById('schoolBody').addEventListener('click', e => {
  const edit = e.target.closest('[data-edit-school]');
  const del = e.target.closest('[data-del-school]');
  if (edit) {
    const s = state.schools.find(x => x.id === edit.dataset.editSchool);
    openModal('Edit school', schoolForm(s), [{ label: 'Save', primary: true, onClick: () => { if (saveSchoolFromForm(s.id)) { closeModal(); renderAll(); } } }]);
  } else if (del) {
    if (confirm('Delete this school?')) { state.schools = state.schools.filter(x => x.id !== del.dataset.delSchool); save(); renderAll(); }
  }
});

/* Extract requirements from pasted page text */
document.getElementById('extractBtn').addEventListener('click', () => {
  openModal('Extract requirements with Claude',
    `<p class="hint">Paste the text from a school's admissions / application-requirements page. Claude will pull out the deadlines, supplements, and recommendation requirements into a new school entry for you to review.</p>
     <label>School name (optional hint) <input id="ex_name" placeholder="e.g. Rice University" /></label>
     <label>Pasted page text <textarea id="ex_text" rows="8" placeholder="Paste requirements text here…"></textarea></label>
     <div id="ex_out" class="ai-out" hidden></div>`,
    [{ label: 'Extract', primary: true, onClick: extractRequirements }]);
});
async function extractRequirements() {
  const text = document.getElementById('ex_text').value.trim();
  const hint = document.getElementById('ex_name').value.trim();
  const out = document.getElementById('ex_out');
  if (!text) { toast('Paste some text first'); return; }
  out.hidden = false; out.innerHTML = '<span class="spinner"></span> Extracting…';
  const sys = `You extract structured college application requirements from pasted webpage text. Return ONLY minified JSON (no markdown fence) matching: {"name":string,"platform":string,"round":string,"deadline":"YYYY-MM-DD or empty","recs":string,"finaid":string,"supplements":[{"prompt":string,"status":"todo"}],"notes":string}. Use "" for unknown fields. platform must be one of: Common App, Coalition, UC App, ApplyTexas, Proprietary. round one of: ED, ED II, EA, REA, RD, Rolling.`;
  try {
    const raw = await callClaude(`School name hint: ${hint || 'unknown'}\n\nPage text:\n${text}`, sys, 1500);
    const json = JSON.parse(raw.replace(/^```json?/i, '').replace(/```$/, '').trim());
    json.id = uid();
    json.status = 'not-started';
    json.supplements = (json.supplements || []).map(s => ({ prompt: s.prompt, status: 'todo' }));
    state.schools.push(json);
    save();
    closeModal(); renderAll();
    toast('Added ' + (json.name || 'school') + ' — review the details');
  } catch (e) {
    out.textContent = '⚠ ' + e.message + '\n\nTip: try pasting cleaner text, or add the school manually.';
  }
}

/* ---------- Render: Essays ---------- */
const PROMPT_TYPES = ['Personal statement', 'Why us', 'Community / diversity', 'Extracurricular', 'Intellectual interest', 'Short answer', 'Other'];
const ESSAY_STATUS = ['brainstorm', 'drafting', 'revising', 'done'];

function wordCount(t) { return (t || '').trim().split(/\s+/).filter(Boolean).length; }

function renderEssays() {
  const wrap = document.getElementById('essayList');
  if (!state.essays.length) { wrap.innerHTML = '<div class="muted">No essays yet. Click “Add essay”.</div>'; return; }
  wrap.innerHTML = state.essays.map(e => `
    <div class="essay-card" data-essay="${e.id}">
      <div class="ec-head">
        <div>
          <h4>${esc(e.title || 'Untitled')}</h4>
          <div class="meta">${esc(e.promptType || '—')} · ${esc(e.status || '')} · ${wordCount(e.text)} words${e.wordLimit ? ' / ' + esc(e.wordLimit) : ''}</div>
        </div>
        <div class="row-actions">
          <button class="btn ghost small" data-edit-essay="${e.id}">Edit</button>
          <button class="btn ghost small" data-del-essay="${e.id}">✕</button>
        </div>
      </div>
      <div class="ec-actions">
        <button class="btn ghost small" data-ai="feedback" data-id="${e.id}">🤖 Feedback</button>
        <button class="btn ghost small" data-ai="brainstorm" data-id="${e.id}">🤖 Brainstorm angles</button>
        <button class="btn ghost small" data-ai="tighten" data-id="${e.id}">🤖 Tighten prose</button>
      </div>
      <div class="ai-out" id="essay-out-${e.id}" hidden></div>
    </div>`).join('');
}

function essayForm(e) {
  e = e || {};
  return `
  <div class="form-grid">
    <label>Title <input id="e_title" value="${esc(e.title)}" placeholder="e.g. Common App personal statement" /></label>
    <label>Prompt type <select id="e_type">${PROMPT_TYPES.map(p => `<option ${p === e.promptType ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
    <label>Status <select id="e_status">${ESSAY_STATUS.map(s => `<option ${s === e.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
    <label>Word limit <input id="e_limit" type="number" value="${esc(e.wordLimit)}" placeholder="650" /></label>
  </div>
  <label>Prompt <textarea id="e_prompt" rows="2" placeholder="The actual essay prompt…">${esc(e.prompt)}</textarea></label>
  <label>Your draft <textarea id="e_text" rows="10" placeholder="Write or paste your draft here…">${esc(e.text)}</textarea></label>`;
}
function saveEssayFromForm(id) {
  const rec = {
    id: id || uid(),
    title: document.getElementById('e_title').value.trim(),
    promptType: document.getElementById('e_type').value,
    status: document.getElementById('e_status').value,
    wordLimit: document.getElementById('e_limit').value,
    prompt: document.getElementById('e_prompt').value.trim(),
    text: document.getElementById('e_text').value,
  };
  if (!rec.title) { toast('Essay needs a title'); return false; }
  const idx = state.essays.findIndex(x => x.id === id);
  if (idx >= 0) state.essays[idx] = rec; else state.essays.push(rec);
  save(); return true;
}
document.getElementById('addEssayBtn').addEventListener('click', () => {
  openModal('Add essay', essayForm(), [{ label: 'Save', primary: true, onClick: () => { if (saveEssayFromForm(null)) { closeModal(); renderAll(); } } }]);
});
document.getElementById('essayList').addEventListener('click', e => {
  const edit = e.target.closest('[data-edit-essay]');
  const del = e.target.closest('[data-del-essay]');
  const ai = e.target.closest('[data-ai]');
  if (edit) {
    const es = state.essays.find(x => x.id === edit.dataset.editEssay);
    openModal('Edit essay', essayForm(es), [{ label: 'Save', primary: true, onClick: () => { if (saveEssayFromForm(es.id)) { closeModal(); renderAll(); } } }]);
  } else if (del) {
    if (confirm('Delete this essay?')) { state.essays = state.essays.filter(x => x.id !== del.dataset.delEssay); save(); renderAll(); }
  } else if (ai) {
    essayAI(ai.dataset.id, ai.dataset.ai);
  }
});

function essayAI(id, mode) {
  const es = state.essays.find(x => x.id === id);
  const out = document.getElementById('essay-out-' + id);
  out.hidden = false;
  const draft = es.text || '';
  let sys, user;
  if (mode === 'brainstorm') {
    sys = `You are a college essay coach helping a student brainstorm. Given the prompt and any existing draft, suggest 5 distinct, specific, authentic angles the student could take — rooted in their profile. Avoid clichés. Each angle: one bold phrase + one sentence of why it could work. No preamble.`;
    user = `${profileContext()}\n\nPrompt type: ${es.promptType}\nPrompt: ${es.prompt || 'N/A'}\nExisting draft (may be empty):\n${draft || '(none)'}`;
  } else if (mode === 'tighten') {
    if (!draft.trim()) { out.textContent = 'Add a draft first, then I can tighten it.'; return; }
    sys = `You are a precise line editor for college essays. Return a tightened version of the student's draft that preserves their voice and meaning but cuts filler and sharpens sentences. Then add a short "What I changed" note (2-3 bullets). Do not invent facts.`;
    user = `Word limit: ${es.wordLimit || 'none'}\nPrompt: ${es.prompt || 'N/A'}\n\nDraft:\n${draft}`;
  } else {
    if (!draft.trim()) { out.textContent = 'Add a draft first, then I can give feedback.'; return; }
    sys = `You are an experienced admissions reader giving constructive feedback on a college essay. Give: (1) a one-line first impression, (2) what's working, (3) the 3 highest-leverage improvements, (4) one honest risk. Specific, kind, direct. Don't rewrite it — coach it. No preamble.`;
    user = `${profileContext()}\n\nPrompt type: ${es.promptType}\nPrompt: ${es.prompt || 'N/A'}\nWord limit: ${es.wordLimit || 'none'}\n\nDraft:\n${draft}`;
  }
  runAI(out, () => callClaude(user, sys, 2000));
}

/* ---------- Render: Opportunities ---------- */
const OPP_TYPES = ['Fly-in', 'Scholarship', 'Summer program', 'Other'];
const OPP_STATUS = ['researching', 'applying', 'applied', 'done'];

function renderOpportunities() {
  const body = document.getElementById('oppBody');
  if (!state.opportunities.length) { body.innerHTML = '<tr><td colspan="7" class="muted">No opportunities yet. Click “Add opportunity”.</td></tr>'; return; }
  const rows = [...state.opportunities].sort((a, b) => (a.deadline || '9999') > (b.deadline || '9999') ? 1 : -1);
  body.innerHTML = rows.map(o => `<tr>
    <td><strong>${esc(o.name)}</strong>${o.url ? ` <a href="${esc(o.url)}" target="_blank" rel="noopener" style="color:var(--accent)">↗</a>` : ''}</td>
    <td>${esc(o.type || '—')}</td>
    <td>${esc(o.org || '—')}</td>
    <td>${fmtDate(o.deadline)} ${urgencyPill(daysUntil(o.deadline))}</td>
    <td>${esc(o.amount || '—')}</td>
    <td>${esc(o.status || '')}</td>
    <td><div class="row-actions">
      <button class="btn ghost small" data-edit-opp="${o.id}">Edit</button>
      <button class="btn ghost small" data-del-opp="${o.id}">✕</button>
    </div></td>
  </tr>`).join('');
}
function oppForm(o) {
  o = o || {};
  return `<div class="form-grid">
    <label>Name <input id="o_name" value="${esc(o.name)}" /></label>
    <label>Type <select id="o_type">${OPP_TYPES.map(t => `<option ${t === o.type ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>Organization <input id="o_org" value="${esc(o.org)}" /></label>
    <label>Deadline <input id="o_deadline" type="date" value="${esc(o.deadline)}" /></label>
    <label>Amount / notes <input id="o_amount" value="${esc(o.amount)}" placeholder="e.g. All expenses paid, $5000" /></label>
    <label>Status <select id="o_status">${OPP_STATUS.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
    <label>URL <input id="o_url" value="${esc(o.url)}" placeholder="https://" /></label>
  </div>`;
}
function saveOppFromForm(id) {
  const rec = {
    id: id || uid(),
    name: document.getElementById('o_name').value.trim(),
    type: document.getElementById('o_type').value,
    org: document.getElementById('o_org').value.trim(),
    deadline: document.getElementById('o_deadline').value,
    amount: document.getElementById('o_amount').value.trim(),
    status: document.getElementById('o_status').value,
    url: document.getElementById('o_url').value.trim(),
  };
  if (!rec.name) { toast('Opportunity needs a name'); return false; }
  const idx = state.opportunities.findIndex(x => x.id === id);
  if (idx >= 0) state.opportunities[idx] = rec; else state.opportunities.push(rec);
  save(); return true;
}
document.getElementById('addOppBtn').addEventListener('click', () => {
  openModal('Add opportunity', oppForm(), [{ label: 'Save', primary: true, onClick: () => { if (saveOppFromForm(null)) { closeModal(); renderAll(); } } }]);
});
document.getElementById('oppBody').addEventListener('click', e => {
  const edit = e.target.closest('[data-edit-opp]');
  const del = e.target.closest('[data-del-opp]');
  if (edit) {
    const o = state.opportunities.find(x => x.id === edit.dataset.editOpp);
    openModal('Edit opportunity', oppForm(o), [{ label: 'Save', primary: true, onClick: () => { if (saveOppFromForm(o.id)) { closeModal(); renderAll(); } } }]);
  } else if (del) {
    if (confirm('Delete this opportunity?')) { state.opportunities = state.opportunities.filter(x => x.id !== del.dataset.delOpp); save(); renderAll(); }
  }
});
document.getElementById('loadFlyinsBtn').addEventListener('click', () => {
  const existing = new Set(state.opportunities.map(o => (o.name || '').toLowerCase()));
  let added = 0;
  (window.FLYIN_2026 || []).forEach(f => {
    if (existing.has((f.name || '').toLowerCase())) return;
    state.opportunities.push(Object.assign({ id: uid(), type: 'Fly-in', status: 'researching' }, f));
    added++;
  });
  save(); renderAll();
  toast(added ? `Added ${added} fly-in program${added > 1 ? 's' : ''} — verify each date on its official site` : 'Already loaded — no duplicates added');
});
document.getElementById('matchBtn').addEventListener('click', () => {
  openModal('Match opportunities to me',
    `<p class="hint">Paste a list of fly-in programs / scholarships (names, deadlines, eligibility). Claude will flag which ones fit your profile and rank by deadline urgency. Then add the good ones manually.</p>
     <label>Pasted opportunities <textarea id="m_text" rows="8" placeholder="Paste a list…"></textarea></label>
     <div id="m_out" class="ai-out" hidden></div>`,
    [{ label: 'Analyze', primary: true, onClick: () => {
      const text = document.getElementById('m_text').value.trim();
      const out = document.getElementById('m_out');
      if (!text) { toast('Paste a list first'); return; }
      out.hidden = false;
      const sys = `You help a student triage fly-in programs and scholarships. Today is ${new Date().toISOString().slice(0,10)}. Given the student's profile and a pasted list, return a ranked shortlist: for each promising item give name, deadline, why it fits (or note eligibility concerns), and urgency. Put the soonest deadlines first. Be honest if something is a poor fit. Concise.`;
      runAI(out, () => callClaude(`${profileContext()}\n\nOpportunities:\n${text}`, sys, 2000));
    } }]);
});

/* ---------- Render: Activities ---------- */
const ACT_CATEGORIES = ['Extracurricular', 'Leadership', 'Work / job', 'Volunteer', 'Award / honor', 'Research', 'Sport', 'Art', 'Other'];
const ACT_STATUS = ['idea', 'ongoing', 'past'];

function renderActivities() {
  const wrap = document.getElementById('actList');
  if (!state.activities.length) { wrap.innerHTML = '<div class="muted">No activities yet. Click “Add activity”.</div>'; return; }
  wrap.innerHTML = state.activities.map(a => `
    <div class="essay-card" data-act="${a.id}">
      <div class="ec-head">
        <div>
          <h4>${esc(a.title || 'Untitled')}</h4>
          <div class="meta">${esc(a.category || '—')} · ${esc(a.status || '')}${a.hours ? ' · ' + esc(a.hours) + ' hrs/wk' : ''}</div>
        </div>
        <div class="row-actions">
          <button class="btn ghost small" data-edit-act="${a.id}">Edit</button>
          <button class="btn ghost small" data-del-act="${a.id}">✕</button>
        </div>
      </div>
      ${a.description ? `<div class="meta" style="margin-top:6px">${esc(a.description)}</div>` : ''}
    </div>`).join('');
}
function actForm(a) {
  a = a || {};
  return `<div class="form-grid">
    <label>Title <input id="a_title" value="${esc(a.title)}" /></label>
    <label>Category <select id="a_cat">${ACT_CATEGORIES.map(c => `<option ${c === a.category ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <label>Status <select id="a_status">${ACT_STATUS.map(s => `<option ${s === a.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
    <label>Hours / week <input id="a_hours" type="number" value="${esc(a.hours)}" /></label>
  </div>
  <label>Description (what you did, impact, role) <textarea id="a_desc" rows="3">${esc(a.description)}</textarea></label>`;
}
function saveActFromForm(id) {
  const rec = {
    id: id || uid(),
    title: document.getElementById('a_title').value.trim(),
    category: document.getElementById('a_cat').value,
    status: document.getElementById('a_status').value,
    hours: document.getElementById('a_hours').value,
    description: document.getElementById('a_desc').value.trim(),
  };
  if (!rec.title) { toast('Activity needs a title'); return false; }
  const idx = state.activities.findIndex(x => x.id === id);
  if (idx >= 0) state.activities[idx] = rec; else state.activities.push(rec);
  save(); return true;
}
document.getElementById('addActBtn').addEventListener('click', () => {
  openModal('Add activity', actForm(), [{ label: 'Save', primary: true, onClick: () => { if (saveActFromForm(null)) { closeModal(); renderAll(); } } }]);
});
document.getElementById('actList').addEventListener('click', e => {
  const edit = e.target.closest('[data-edit-act]');
  const del = e.target.closest('[data-del-act]');
  if (edit) {
    const a = state.activities.find(x => x.id === edit.dataset.editAct);
    openModal('Edit activity', actForm(a), [{ label: 'Save', primary: true, onClick: () => { if (saveActFromForm(a.id)) { closeModal(); renderAll(); } } }]);
  } else if (del) {
    if (confirm('Delete this activity?')) { state.activities = state.activities.filter(x => x.id !== del.dataset.delAct); save(); renderAll(); }
  }
});

/* ---------- Settings ---------- */
function bindSettings() {
  const p = state.profile, s = state.settings;
  const map = { profName: ['profile', 'name'], profGradYear: ['profile', 'gradYear'], profMajor: ['profile', 'major'], profNotes: ['profile', 'notes'], apiKey: ['settings', 'apiKey'], model: ['settings', 'model'] };
  for (const [elId, [obj, key]] of Object.entries(map)) {
    const el = document.getElementById(elId);
    el.value = state[obj][key] || '';
    el.addEventListener('change', () => { state[obj][key] = el.value; save(); if (obj === 'profile') renderDashboard(); });
  }
}
document.getElementById('testKeyBtn').addEventListener('click', async () => {
  const out = document.getElementById('testKeyOut');
  out.textContent = ' Testing…';
  try {
    const r = await callClaude('Reply with exactly: OK', 'You are a connection test. Reply with only the word OK.', 20);
    out.textContent = r.includes('OK') ? ' ✅ Connected' : ' ✅ Responded: ' + r;
  } catch (e) { out.textContent = ' ⚠ ' + e.message; }
});
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `launchpad-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Exported');
});
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object') throw new Error('Invalid file');
      if (!confirm('Import will replace your current data. Continue?')) return;
      state = Object.assign(structuredClone(DEFAULT_DATA), data);
      save(); bindSettings(); renderAll(); toast('Imported');
    } catch (err) { toast('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('This erases ALL your data in this browser. Export a backup first if you want to keep it. Continue?')) {
    state = structuredClone(DEFAULT_DATA); save(); bindSettings(); renderAll(); toast('Reset done');
  }
});

/* ---------- Modal ---------- */
function openModal(title, bodyHtml, buttons) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  const foot = document.getElementById('modalFoot');
  foot.innerHTML = '';
  (buttons || []).forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'btn' + (b.primary ? '' : ' ghost');
    btn.textContent = b.label;
    btn.addEventListener('click', b.onClick);
    foot.appendChild(btn);
  });
  document.getElementById('modalBackdrop').hidden = false;
}
function closeModal() { document.getElementById('modalBackdrop').hidden = true; }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); });

/* ---------- Render all ---------- */
function renderAll() {
  renderDashboard();
  renderSchools();
  renderEssays();
  renderOpportunities();
  renderActivities();
}

bindSettings();
renderAll();
