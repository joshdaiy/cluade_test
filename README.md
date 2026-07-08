# Essay Coach

A Claude Code workspace that turns Claude into a relentless writing coach — an
adversarial editor looking over your shoulder, grilling every decision, and
refusing to bless a draft until it has survived a real pass.

The point is **not** to have Claude write your essays. It's to make *you* a
sharper writer by never letting a weak claim, a buried lead, or a dodged
counterargument slide.

## How to use it

Open this folder in Claude Code and just start writing/talking. `CLAUDE.md` sets
the standing behavior, so Claude is already in coach mode. For focused pushes,
use the slash-command modes:

| Command | When to use it |
|---|---|
| `/draft <topic or messy notes>` | Starting out. Socratic partner: finds the narrow moment and what it reveals before a word of prose. |
| `/grill <paragraph>` | Mid-writing. One hard question at a time, starting with "so what does this reveal about me?" |
| `/sniff-test <passage>` | Authenticity check. Does this sound like *you*, or performed / adult / AI / cliché? Reads your `voice/` samples. |
| `/lineedit <passage>` | Polishing. Flags telling-not-showing, padding, AI-polish, the tidy bow — but makes you do the rewrite. |
| `/ship-check <full draft>` | The gate. Nothing submits until it clears — voice, reveal, specificity, opening, ending, prompt+limit, memorability. |

Paste text directly after the command, or point Claude at a `.md` file you're
drafting in this folder.

## A workflow that actually works

The most effective way people use an LLM for writing is as an **editor and
sparring partner, never a ghostwriter** — because the moment it writes for you,
the thinking (and your voice) leaves the room. A loop that works:

0. **Add your voice samples** to `voice/` (see that folder's README) so the coach
   knows what *you* sound like.
1. **Find the window.** Brain-dump in `drafts/` (copy `notes.template.md`). Run
   `/draft` to pressure-test it into one narrow moment and what it reveals about you.
2. **Write the draft yourself.** Your words. Ugly is fine.
3. **`/grill` the risky parts** paragraph by paragraph. Answer the questions in
   writing — half your best sentences will come out of defending yourself.
4. **`/sniff-test` the whole thing** to catch anything that stops sounding like you
   or leans on a cliché.
5. **`/lineedit`** once the substance is sound — never polish prose about to be cut.
6. **`/ship-check`** before it goes anywhere. Overrule the verdict only knowingly.

## Why "don't write it for me" matters

- Your voice survives. Coach mode caps example phrasing at one disposable
  sentence, so the words stay yours.
- You build the skill, not a dependency. The questions Claude asks become the
  questions you start asking yourself.
- It's honest. If you submit AI prose as your own, you learn nothing and risk a
  lot. If you submit prose you defended against a hostile editor, it's yours and
  it's better.

## Customizing

- Edit `CLAUDE.md` to change the coach's standards or persona (e.g. tune it to a
  specific rubric, professor, or publication's style).
- Edit any file in `.claude/commands/` to reshape a mode, or add your own
  (`.claude/commands/<name>.md` → `/<name>`).
</content>
