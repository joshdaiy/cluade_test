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
| `/draft <topic or messy notes>` | Starting out. Socratic partner: forces a real thesis and structure before a word of prose. |
| `/grill <claim or paragraph>` | Mid-writing. One hard question at a time, starting with the load-bearing weakness. |
| `/steelman <thesis or draft>` | Before you commit. Builds the strongest case *against* you so you're never blindsided. |
| `/lineedit <passage>` | Polishing. Flags hedging, passive voice, padding, AI-mush — but makes you do the rewrite. |
| `/ship-check <full draft>` | The gate. Nothing submits until it clears — thesis, evidence, counterargument, structure, prose, reader test. |

Paste text directly after the command, or point Claude at a `.md` file you're
drafting in this folder.

## A workflow that actually works

The most effective way people use an LLM for writing is as an **editor and
sparring partner, never a ghostwriter** — because the moment it writes for you,
the thinking (and your voice) leaves the room. A loop that works:

1. **Think out loud first.** Brain-dump your take in `notes.md`. Run `/draft` to
   pressure-test it into an arguable thesis and a structure.
2. **Write the draft yourself.** Your words. Ugly is fine.
3. **`/grill` the risky parts** paragraph by paragraph. Answer the questions in
   writing — half your best sentences will come out of defending yourself.
4. **`/steelman` the whole thing** so you know what you're up against.
5. **`/lineedit`** once the argument is sound — never polish prose that's about
   to be cut.
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
