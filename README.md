# English tutoring

Static English practice app and student knowledge boards, published from `main` at:
https://coolplaton321-pixel.github.io/english-grammar-swipe-tutor/

## Navigation

- `#practice`: existing grammar drills, speaking, reading and hints.
- `#students`: Taras, Marina and Anton.
- `#students/taras`, `#students/marina`, `#students/anton`: individual grammar knowledge boards.

Practice includes 100 Present Perfect drills (40 form exercises, 30 past-participle prompts, 15 corrections and 15 sentence builds), 50 verb-form drills and the unchanged 112 mixed-tense drills. The added verb forms include eat/eaten, drink/drunk, swim/swum, ride/ridden, drive/driven, wear/worn and read/read, with original example sentences and a pronunciation note for read. The sidebar counts are calculated from the actual question banks.

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
