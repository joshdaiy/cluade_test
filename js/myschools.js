/* Josh's college list — pre-populated with deep, tailored research.
 * Profile assumed: NY resident, semiconductor device physics / microelectronics EE
 * focus, need-based aid matters. Load via the "Load my college list" button on
 * the Schools tab. Research is baked in (readable offline); regenerate any entry
 * with the 🔬 button once you've added an API key.
 *
 * Deadlines are for the 2026–2027 cycle (Fall 2027 entry), researched July 2026.
 * They shift year to year and some are rolling/priority — the `notes` field says which.
 * ALWAYS confirm on the official site before relying on a date. Selectivity is approximate. */
window.MY_SCHOOLS = [
  {
    name: 'Cornell University', platform: 'Common App', round: 'ED', deadline: '2026-11-01',
    url: 'https://www.engineering.cornell.edu/', recs: '2 teachers + counselor',
    notes: 'ED deadline Nov 1, 2026. ⚠ See endowed-college tuition NOTE in research — no NY in-state discount for Engineering.',
    research:
`FIT (semiconductor/EE): ECE plus the Cornell NanoScale Facility (CNF) — a national-scale cleanroom that undergrads can actually get into; deep benches in nanoelectronics, devices, and photonics. If you lean device physics/materials, Applied & Engineering Physics (AEP) is a strong alternate major to weigh.
CULTURE: Large, rigorous, "any person, any study." Engineering is its own college; collaborative but intense.
SELECTIVITY (approx): ~7–8% overall. ED is your single biggest lever — using it here (as planned) is the right call.
POSITION / WHY-US: Name CNF and a specific nanoelectronics faculty/lab; tie to a concrete device project you've built or want to. Cornell's "why this college/major" essay rewards specificity over prestige.
WHAT ADMITS TEND TO SHOW: real hands-on building/research, intellectual specificity, and fit with a named program — not generic "top engineering school."
⚠ NOTE: Cornell Engineering is an ENDOWED (private) college — NY residency does NOT give an in-state tuition discount (that only applies to the statutory colleges: CALS, ILR, Human Ecology). Your "in-state" edge is really aid + familiarity, not sticker price. Run Cornell's need-based Net Price Calculator early.`,
  },
  {
    name: 'Carnegie Mellon University (CMU)', platform: 'Common App', round: 'RD', deadline: '2027-01-01',
    url: 'https://www.ece.cmu.edu/', recs: '',
    notes: 'RD deadline Jan 1, 2027 (ED I Nov 3 / ED II Jan 1 also available). Reach.',
    research:
`FIT (semiconductor/EE): Top-tier ECE. Flagship strength skews toward systems, embedded, CS-adjacent, and hardware/software co-design more than pure device fabrication — but the department is elite and device/nano work exists. Be clear-eyed that CMU is a "great ECE program" fit more than a "device-physics-specialist" fit.
CULTURE: Intense, pre-professional, collaborative-nerdy. Apply directly to the College of Engineering.
SELECTIVITY (approx): ~11% overall, engineering lower. Demonstrated interest and fit matter.
POSITION / WHY-US: If you apply, connect your interests to hardware systems / chip design as well as devices, and cite specific ECE research thrusts. A one-note "I only want fab" pitch fits CMU less well than Purdue/UIUC.
WHAT ADMITS TEND TO SHOW: technical depth plus building things end-to-end; strong quantitative record.`,
  },
  {
    name: 'The Cooper Union', platform: 'Common App', round: 'RD', deadline: '2027-01-05',
    url: 'https://cooper.edu/engineering', recs: '',
    notes: 'RD deadline ~Jan 5, 2027 — verify. ⚠ See cost NOTE (no longer free).',
    research:
`FIT (semiconductor/EE): Small, elite, NYC. Strong, hands-on EE with famously close faculty access. Not a big-cleanroom research machine — the draw is rigor, small classes, and location, not national fab infrastructure.
CULTURE: Tiny (~900 undergrads), studio/lab intensive, self-selecting and intense.
SELECTIVITY (approx): Very selective (engineering often <15%), and it evaluates math/physics preparation hard.
POSITION / WHY-US: Show serious math/physics chops and why the small, maker-dense environment fits you specifically.
⚠ NOTE: Cooper Union is NO LONGER free — it moved off the full-tuition model and now gives roughly half-tuition scholarships to all admitted students, with need-based aid on top. Since aid matters to you, model the net cost; it can still be competitive but is not free.`,
  },
  {
    name: 'Olin College of Engineering', platform: 'Common App', round: 'RD', deadline: '2027-01-01',
    url: 'https://www.olin.edu/', recs: '',
    notes: 'RD deadline Jan 1, 2027 (ED Nov 1). Admission includes a Candidates\' Weekend interview. ⚠ See fit NOTE.',
    research:
`FIT (semiconductor/EE): Honest flag — Olin is a project-based, interdisciplinary engineering school with NO traditional departments, NO cleanroom, and NO semiconductor-fab research infrastructure. It is superb for hands-on, human-centered engineering and design, but it is the WEAKEST fit on your list for device physics specifically.
CULTURE: ~350 students, collaborative, no grades-obsession, "do-learn," heavy teamwork.
SELECTIVITY (approx): Very selective and highly self-selecting; a "Candidates' Weekend" interview is part of admission.
POSITION / WHY-US: Only worth pursuing if the project-based culture genuinely excites you (not the semiconductor angle). If it makes the cut, lead with collaborative building and design, not fab research.
⚠ NOTE: Reconsider whether this belongs on a device-physics-focused list — it may be a values fit but not a research fit.`,
  },
  {
    name: 'Boston University (BU)', platform: 'Common App', round: 'RD', deadline: '2027-01-04',
    url: 'https://www.bu.edu/eng/', recs: '',
    notes: 'RD deadline Jan 4, 2027 (ED I Nov 1 / ED II Jan 4).',
    research:
`FIT (semiconductor/EE): Solid ECE with real strengths in photonics, materials, and micro/nano — the Photonics Center and cleanroom facilities support undergrad research. A dependable, strong-but-not-elite-reach fit.
CULTURE: Large, urban (Boston), pre-professional, research-active.
SELECTIVITY (approx): ~11–14%.
POSITION / WHY-US: Cite photonics/materials research and Boston's device/semiconductor ecosystem; connect to a concrete interest.
WHAT ADMITS TEND TO SHOW: strong academics + clear "why engineering / why BU" narrative.`,
  },
  {
    name: 'Rochester Institute of Technology (RIT)', platform: 'Common App', round: 'RD', deadline: '2027-01-15',
    url: 'https://www.rit.edu/study/microelectronic-engineering-bs', recs: '',
    notes: 'RD deadline Jan 15, 2027. Non-binding EA Nov 1 gives an earlier answer — recommended. Standout fit — see research.',
    research:
`FIT (semiconductor/EE): One of your BEST-fit schools. RIT has a dedicated Microelectronic Engineering BS — a genuine rarity at the undergrad level — plus the Semiconductor & Microsystems Fabrication Laboratory (SMFL), a real teaching cleanroom students run chips through. Mandatory co-op means paid semiconductor-industry experience baked into the degree.
CULTURE: Hands-on, career-focused, less prestige-driven, very strong industry pipeline.
SELECTIVITY (approx): Moderately selective (~65%+ overall; the microE program is smaller/self-selecting) — a likely/target for you.
POSITION / WHY-US: This is where your device-physics + fab passion shines. Name the Microelectronic Engineering BS, SMFL, and specific co-op ambitions. Concrete, technical, and about doing the work.
WHAT ADMITS TEND TO SHOW: clear career direction and hands-on interest — exactly your profile.`,
  },
  {
    name: 'Worcester Polytechnic Institute (WPI)', platform: 'Common App', round: 'RD', deadline: '2027-02-01',
    url: 'https://www.wpi.edu/academics/departments/electrical-computer-engineering', recs: '',
    notes: 'RD deadline Feb 1, 2027 (EA/ED I Nov 1, EA/ED II Jan 5).',
    research:
`FIT (semiconductor/EE): Project-based ECE with strong microelectronics/materials work; the required project sequence (IQP/MQP) can be a real device or fab project. Good hands-on fit, less national-scale fab than Purdue/UIUC.
CULTURE: Project-heavy, term-based (7-week terms), collaborative, no class rank obsession.
SELECTIVITY (approx): ~55–60% — a target/likely for you.
POSITION / WHY-US: Lead with the project culture and a specific MQP-style device project you'd want to do.
WHAT ADMITS TEND TO SHOW: builders who thrive in hands-on, team project settings.`,
  },
  {
    name: 'Rose-Hulman Institute of Technology', platform: 'Common App', round: 'RD', deadline: '2027-02-01',
    url: 'https://www.rose-hulman.edu/academics/academic-departments/electrical-and-computer-engineering/', recs: '',
    notes: 'RD deadline Feb 1, 2027. Non-binding EA Nov 1 recommended. Likely/safety with real cleanroom.',
    research:
`FIT (semiconductor/EE): Excellent undergrad-only fit — genuine cleanroom access for undergrads (rare at a school this teaching-focused), top-ranked undergraduate engineering, and faculty who actually teach. Your "likely/safety" with real device capability.
CULTURE: Small, undergrad-focused, tight-knit, rigorous but supportive; superb placement.
SELECTIVITY (approx): ~60% — a likely for a strong applicant.
POSITION / WHY-US: Emphasize wanting undergrad research + cleanroom access from year one and small-cohort teaching. Genuine, non-prestige-driven interest reads well here.
WHAT ADMITS TEND TO SHOW: strong math/science + authentic fit with a small technical college.`,
  },
  {
    name: 'Northeastern University', platform: 'Common App', round: 'RD', deadline: '2027-01-01',
    url: 'https://www.ece.northeastern.edu/', recs: '',
    notes: 'RD deadline Jan 1, 2027. ⚠ RD admit rate is ~5% — apply EA or ED I (Nov 1) if you possibly can.',
    research:
`FIT (semiconductor/EE): Strong ECE with a legendary co-op program (up to 18 months of paid industry work) and solid nano/materials research. Great if you value industry experience alongside the degree.
CULTURE: Urban (Boston), co-op-defined, global, pre-professional.
SELECTIVITY (approx): ~5–7% and dropping — genuinely a reach, and RD is the hardest round. If you can shift to EA and aren't over-committed, do it.
POSITION / WHY-US: Make co-op central — name target semiconductor employers and how a device-physics track + co-op compounds. Generic "great school" essays sink here.
WHAT ADMITS TEND TO SHOW: demonstrated interest, co-op motivation, strong stats.`,
  },
  {
    name: 'University of Illinois Urbana-Champaign (UIUC)', platform: 'Common App', round: 'RD', deadline: '2027-01-05',
    url: 'https://ece.illinois.edu/', recs: '',
    notes: 'RD deadline Jan 5, 2027 (EA Nov 1). Apply to ECE directly — the major, not undeclared. OOS ECE is a reach.',
    research:
`FIT (semiconductor/EE): Elite — a top-3 ECE program and arguably the strongest pure device/semiconductor fit here. The Holonyak Micro & Nanotechnology Lab (HMNTL) is world-class (the LED was invented here). If you get in, it's a dream device-physics environment.
CULTURE: Large, rigorous, research-saturated, Midwest engineering powerhouse.
SELECTIVITY (approx): ECE is admitted directly and is one of the most selective majors in the country for out-of-state students — treat as a reach.
POSITION / WHY-US: Be specific about HMNTL, named research thrusts (compound semiconductors, photonics, nanoelectronics), and your own device work. UIUC ECE rewards demonstrated technical depth over polish.
WHAT ADMITS TEND TO SHOW: standout math/physics, real projects/research, laser-focused ECE interest.`,
  },
  {
    name: 'Georgia Institute of Technology', platform: 'Common App', round: 'EA', deadline: '2026-10-15',
    url: 'https://admission.gatech.edu/first-year/deadlines', recs: '',
    notes: '⚠ GT offers NO Regular Decision for non-Georgia students — only Early Action, deadline ~mid-October 2026. This is your EARLIEST mainland deadline. Verify the exact date NOW.',
    research:
`FIT (semiconductor/EE): Elite and a superb device fit — huge ECE, the Institute for Electronics & Nanotechnology (IEN) and the Marcus Nanotechnology cleanroom, strong compound-semiconductor and RF/device research.
CULTURE: Large, intense, pre-professional, strong industry ties in the Southeast semiconductor corridor.
SELECTIVITY (approx): Out-of-state admission is very selective (OOS reach); GT limits OOS share.
POSITION / WHY-US: Name IEN/Marcus cleanroom and specific device research; emphasize hands-on fab interest. GT values demonstrated technical follow-through.
WHAT ADMITS TEND TO SHOW: rigor, projects, clear engineering trajectory.
⚠ NOTE: GT's out-of-state deadline is Early Action in mid-October — months before your other RD apps. If you procrastinate on one school, don't let it be this one.`,
  },
  {
    name: 'University of Michigan', platform: 'Common App', round: 'RD', deadline: '2027-02-01',
    url: 'https://ece.engin.umich.edu/', recs: '',
    notes: 'RD deadline Feb 1, 2027 (EA Nov 1). ⚠ OOS cost is high and OOS need aid is limited — see NOTE.',
    research:
`FIT (semiconductor/EE): Elite ECE with the Lurie Nanofabrication Facility (LNF) — one of the best university cleanrooms in the U.S., heavily used and undergrad-accessible. Excellent device/nano fit.
CULTURE: Large, spirited, research-heavy, strong alumni network.
SELECTIVITY (approx): OOS is very selective; Michigan is deliberate about OOS admits.
POSITION / WHY-US: Cite LNF and specific solid-state/device research; connect to your fab experience. Michigan's essays reward community + intellectual specificity.
⚠ NOTE: Out-of-state cost of attendance is among the highest on your list and Michigan's OOS need-based aid is limited — model net price before committing energy here.`,
  },
  {
    name: 'Purdue University', platform: 'Common App', round: 'RD', deadline: '2027-01-15',
    url: 'https://engineering.purdue.edu/ECE', recs: '',
    notes: 'RD deadline Jan 15, 2027. EA Nov 1 recommended (helps). Your anchor — see research.',
    research:
`FIT (semiconductor/EE): Your strongest anchor, and rightly so. Purdue is arguably the best accessible device-physics environment in the country: the Birck Nanotechnology Center (Discovery Park) with a major cleanroom, the SURF undergraduate research program, and SCALE (national defense-microelectronics workforce program). It is a semiconductor school to its core.
CULTURE: Large, engineering-first, hands-on, huge and well-funded, strong industry pipeline.
SELECTIVITY (approx): Selective for ECE OOS but meaningfully more attainable than UIUC/GT/Michigan — a strong target with reach-caliber resources.
POSITION / WHY-US: Go deep and specific: Birck, SURF, SCALE, named device research (power electronics, wide-bandgap, nanoelectronics). This is the essay where your fab passion should be loudest.
WHAT ADMITS TEND TO SHOW: clear ECE focus, hands-on/research interest, quantitative strength. Apply EA if you can — it helps.`,
  },
  {
    name: 'Virginia Tech', platform: 'Common App', round: 'RD', deadline: '2027-01-15',
    url: 'https://ece.vt.edu/', recs: '',
    notes: 'RD deadline Jan 15, 2027 (ED Nov 1 / EA Dec 1 also available).',
    research:
`FIT (semiconductor/EE): Solid ECE with real strength in power electronics (CPES — Center for Power Electronics Systems is nationally known) and micro/nano. If power devices / wide-bandgap interest you, CPES is a genuine hook.
CULTURE: Large, collaborative ("Ut Prosim"), hands-on, strong school spirit.
SELECTIVITY (approx): ~55–60% overall, ECE more competitive — a target.
POSITION / WHY-US: Lead with CPES and power-device interest; it differentiates you from generic "I like EE" applicants.
WHAT ADMITS TEND TO SHOW: fit with the community-service ethos + technical direction.`,
  },
  {
    name: 'University of Pittsburgh', platform: 'Common App', round: 'RD', deadline: '2026-11-01',
    url: 'https://www.engineering.pitt.edu/departments/electrical-computer/', recs: '',
    notes: '⚠ Pitt uses ROLLING admission — apply by early November for the best odds and scholarship consideration. Date shown is a priority target, not a hard cutoff.',
    research:
`FIT (semiconductor/EE): Solid ECE; strengths in microsystems, sensors, and materials, less of a national fab flagship than Purdue/UIUC/Michigan. A dependable target with good research access for undergrads.
CULTURE: Urban (Pittsburgh, a growing tech/robotics hub), collaborative, strong regional ties.
SELECTIVITY (approx): Rolling; earlier applications fare better — apply early.
POSITION / WHY-US: Cite specific microsystems/sensors research and the Pittsburgh tech ecosystem.
⚠ NOTE: Because admission is rolling, submitting early materially improves your odds and aid consideration.`,
  },
  {
    name: 'Stony Brook University', platform: 'Common App', round: 'RD', deadline: '2026-11-01',
    url: 'https://www.stonybrook.edu/commcms/ece/', recs: '',
    notes: 'Priority deadline Nov 1, 2026 for Honors College / WISE / scholarships; regular review is rolling. Apply by Nov 1. NY in-state value + Brookhaven fit.',
    research:
`FIT (semiconductor/EE): Strong niche fit and excellent value for you as a NY resident. Real strength in wide-bandgap materials and electronic materials, and its proximity to Brookhaven National Laboratory (NSLS-II synchrotron, CFN nanoscience) opens rare undergrad access to national-lab-grade characterization.
CULTURE: Large NY public, research-active (AAU member), diverse, commuter+residential mix.
SELECTIVITY (approx): Moderately selective — a target/likely with strong stats, and in-state tuition makes it a financial safety-with-upside.
POSITION / WHY-US: Name wide-bandgap materials research and the Brookhaven connection specifically — few applicants know to do this, and it signals real fit. Apply to WISE (Women in Science & Engineering) or the Honors College by the Nov 1 priority date if eligible.
WHAT ADMITS TEND TO SHOW: solid academics; the research-fit angle is your differentiator. Great aid math as an in-state student.`,
  },
  {
    name: 'CCNY / Macaulay Honors', platform: 'Proprietary', round: 'RD', deadline: '2026-11-16',
    url: 'https://www.ccny.cuny.edu/engineering', recs: '',
    notes: '⚠ Macaulay Honors deadline ~Nov 16, 2026 (early round ~Oct 26) via the CUNY/Macaulay app — NOT the Common App. This is an early calendar item — do it FIRST.',
    research:
`FIT (semiconductor/EE): Best value on the list and a real safety with upside. CCNY's Grove School of Engineering has legitimate EE and an active research culture in NYC; the CUNY ASRC (Advanced Science Research Center) adds nanoscience/photonics facilities. Macaulay Honors adds full-tuition (for NY residents), an honors community, and a stipend/opportunities fund.
CULTURE: Urban, diverse, commuter-heavy, strong upward-mobility mission.
SELECTIVITY (approx): CCNY is accessible; Macaulay Honors is selective and merit-driven — the honors piece is the reach within the safety.
POSITION / WHY-US: For Macaulay, emphasize intellectual drive, NYC engagement, and how the honors resources amplify your semiconductor goals.
⚠ NOTE: This uses the CUNY/Macaulay application, NOT the Common App, and Macaulay's deadline (~mid-November) is much earlier than RD. Put this on your calendar first.`,
  },
  {
    name: 'North Carolina State University', platform: 'Common App', round: 'RD', deadline: '2027-01-15',
    url: 'https://www.ece.ncsu.edu/', recs: '',
    notes: 'RD deadline Jan 15, 2027. Non-binding EA Nov 1 recommended (earlier answer + scholarship consideration). Wide-bandgap bullseye — see research.',
    research:
`FIT (semiconductor/EE): One of the best wide-bandgap / power-device fits in the country — a direct match to your Stony Brook interest. Wolfspeed (formerly Cree), the SiC & GaN power-device leader, spun out of NC State, and the college anchors the NSF FREEDM Systems Center and PowerAmerica (power electronics). Strong ECE + materials with a real nanofabrication facility.
CULTURE: Large NC public, hands-on, deeply industry-connected, less prestige-driven.
SELECTIVITY (approx): Moderately selective OOS (~40–45%); Engineering more competitive — a solid target.
POSITION / WHY-US: Name the Wolfspeed lineage, FREEDM, PowerAmerica, and wide-bandgap power-device interest explicitly. Almost no applicant connects these dots — you can, and should.
WHAT ADMITS TEND TO SHOW: strong STEM record + specific, credible engineering focus.
⚠ NOTE: EA (Nov 1) is non-binding — apply early for the earlier answer and merit/scholarship consideration.`,
  },
  {
    name: 'Rensselaer Polytechnic Institute (RPI)', platform: 'Common App', round: 'RD', deadline: '2027-01-15',
    url: 'https://ecse.rpi.edu/', recs: '',
    notes: 'RD deadline Jan 15, 2027 (EA/ED I Nov 1, ED II Dec 15). Apply early + pursue merit — see research.',
    research:
`FIT (semiconductor/EE): Serious microelectronics with a full cleanroom and deep roots in materials, photonics, and devices. Upstate NY — closer and familiar for you — and notably MERIT-GENEROUS, which matters given your aid needs.
CULTURE: Tech-focused private, rigorous, project/lab-heavy, strong industry placement.
SELECTIVITY (approx): ~60–65% — a target, and real merit money is attainable for strong applicants.
POSITION / WHY-US: Cite the cleanroom plus a specific device/materials interest; RPI rewards clear technical direction and demonstrated interest. Apply EA (Nov 1).
WHAT ADMITS TEND TO SHOW: technical depth, math/science rigor, genuine fit.
⚠ NOTE: RPI's merit awards (e.g. Rensselaer Medal / merit scholarships) can put its net price well below sticker — apply early and chase merit. A strong aid-friendly alternative to the pricier privates on your list.`,
  },
  {
    name: 'University at Buffalo (SUNY)', platform: 'Common App', round: 'RD', deadline: '2026-11-01',
    url: 'https://engineering.buffalo.edu/electrical.html', recs: '',
    notes: 'ROLLING admission — apply by the ~Nov 1 priority date for Honors College + scholarship consideration. NY in-state value.',
    research:
`FIT (semiconductor/EE): NY in-state — so your aid math actually works — with legitimate electronic-materials, integrated-photonics, and device research and an active nanofab. A second affordable in-state option beside Stony Brook and CCNY, with real research access for undergrads.
CULTURE: Large SUNY, research-active (AAU member), diverse, practical.
SELECTIVITY (approx): Accessible (~50–65%) — a likely/target and a genuine financial safety as a NY resident.
POSITION / WHY-US: Name specific photonics / electronic-materials research groups and apply by the Nov 1 priority date for the Honors College and scholarships.
WHAT ADMITS TEND TO SHOW: solid academics; your in-state fit + specific research interest is the edge.
⚠ NOTE: Rolling admission — earlier is better. Nov 1 is the priority date for best scholarship and Honors consideration, not a hard cutoff.`,
  },
];
