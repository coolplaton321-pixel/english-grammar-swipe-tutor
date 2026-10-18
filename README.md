# English tutoring

Static English practice app and student knowledge boards, published from `main` at:
https://coolplaton321-pixel.github.io/english-grammar-swipe-tutor/

## Navigation

- `#practice`: existing grammar drills, speaking, reading and hints.
- `#students`: Taras, Marina and Anton.
- `#students/taras`, `#students/marina`, `#students/anton`: individual grammar knowledge boards.

Practice includes 100 Present Perfect drills (40 form exercises, 30 past-participle prompts, 15 corrections and 15 sentence builds), 80 verb-form drills and the unchanged 112 mixed-tense drills. The latest 30 verb additions include 15 regular verbs (including try/tried, plan/planned and stop/stopped) and 15 irregular verbs (including forget/forgot/forgotten and steal/stole/stolen). Every new card has V2/V3 answers, a form explanation, and an original Present Perfect example. Existing examples and the pronunciation note for read are preserved. The sidebar counts are calculated from the actual question banks.

Reading includes 30 stories, with a story picker as well as swipe navigation. The five newest stories (26-30) focus on Present Perfect versus Past Simple through direct dialogue: a Dublin weekend, a Cork book club, a Galway market, a coastal train journey, and a Wicklow photography walk. Each includes an original, locally hosted SVG location illustration with alt text and a caption, an action timeline, writing practice, and a speaking/role-play prompt. Illustrations are not photographs of actual shops or routes; no external image service is required. Existing stories and the Read / Write / Speak workflow are unchanged. Written notes are preserved when switching stories.

Present Perfect usage was checked against the [British Council reference](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-perfect). Exercise sentences are original, not copied from the reference.

Taras has 49 topics in four columns: Tenses & time (15), Conditionals & unreal time (10), Advanced structures (12), and Modals & precision (12). Tenses are the leftmost column on desktop and the first column on smaller screens.

Each topic includes a purpose, structure, original example, teaching focus and grammar reference. Ratings are grey (Not assessed), red (Needs support), yellow (Developing) and green (Confident), matching the maths tutoring board. Taras preserves existing device colours, otherwise starts unassessed. Marina and Anton receive random sample starting colours once; their boards are labelled as samples, not genuine assessments. All colours can be edited.

Stable topic IDs in `students.js` preserve ratings when titles change. Rating controls support arrow keys, Home and End; native dialogs support Escape and return focus to the topic opener.

## Colour sync

Choose **Teacher sign in** and use the existing maths tutoring teacher account. Both apps share the existing Supabase project and browser auth session; English ratings are kept in their own `public.english_student_topic_ratings` table. Maths data is not changed. Only the public publishable key is in the client. Row-level security allows non-anonymous authenticated users to read and write only their own ratings.

Existing device colours are imported for missing topics on the first account used on that browser. Existing cloud colours always take precedence. Other accounts receive fresh starting profiles, not another account’s guest colours. Guest/device caches and account-specific caches remain separate. The old Taras storage key is retained for compatibility. Signed-in changes queue durably on the device and retry on reconnect, every 30 seconds, or with **Retry sync**. Initial cloud loading disables edits to prevent accidental overwrites. A refresh checks for other-device changes every 30 seconds and on focus. Sign-out is blocked while changes are waiting to sync.

The applied schema is documented in `database/schema.sql`. It uses a composite primary key `(owner_id, student_id, topic_id)`, constrained colour values, explicit authenticated grants, and separate SELECT/INSERT/UPDATE RLS policies. Anonymous access has no grants. Grey resets are upserts rather than deletes. No real student ratings are committed to the repository.

Project security check: the existing project has leaked-password protection disabled. See [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); this unrelated account setting was not changed.

## Curriculum references

This is a tutor’s teaching checklist, not an official fixed CEFR grammar syllabus. Foundational forms are included to assess accurate, flexible use at C1; a grammar-only board does not assess a learner’s whole CEFR proficiency.

- [British Council C1 grammar](https://learnenglish.britishcouncil.org/free-resources/grammar/c1): advanced present forms, conditionals with inversion, unreal time, passives, reporting verbs, emphasis, modals, participle clauses and cohesion.
- [Third and mixed conditionals](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-third-mixed): distinguish past–present and present–past time relationships.
- [Cambridge English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/English): foundational and broader grammar references.
- [Cambridge C1 Advanced format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/): grammar and vocabulary are assessed as part of wider reading, writing, listening and speaking competence.

Research checked on 6 October 2026. Examples and teaching notes are original.

## Run locally

Serve the repository with a static web server (for example `python3 -m http.server 8765`) and open `http://127.0.0.1:8765/`. The checked-in `vendor/supabase.js` makes deployment fully static. To regenerate the pinned vendor asset, run `npm ci --ignore-scripts` then `npm run build`. Run client sync tests with `npm test`.
