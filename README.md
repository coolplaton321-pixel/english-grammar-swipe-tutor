# English tutoring

Static English practice app and student knowledge boards, published from `main` at:
https://coolplaton321-pixel.github.io/english-grammar-swipe-tutor/

## Navigation

- `#practice`: existing grammar drills, speaking, reading and hints.
- `#students`: Taras, Marina and Anton. Marina and Anton are placeholders only.
- `#students/taras`: Taras’s C1 grammar knowledge board.

Taras has 49 topics in four columns: Tenses & time (15), Conditionals & unreal time (10), Advanced structures (12), and Modals & precision (12). Tenses are the leftmost column on desktop and the first column on smaller screens.

Each topic includes a purpose, structure, original example, teaching focus and grammar reference. Ratings are grey (Not assessed), red (Needs support), yellow (Developing) and green (Confident), matching the maths tutoring board. Topics start unassessed.

Ratings persist in this browser’s local storage under `english-grammar-tutor:taras:c1:knowledge:v1`. They do not sync between devices. No student assessments are stored in the repository or sent to a server. Stable topic IDs in `students.js` preserve ratings when titles change. Rating controls support arrow keys, Home and End; native dialogs support Escape and return focus to the topic opener.

## Curriculum references

This is a tutor’s teaching checklist, not an official fixed CEFR grammar syllabus. Foundational forms are included to assess accurate, flexible use at C1; a grammar-only board does not assess a learner’s whole CEFR proficiency.

- [British Council C1 grammar](https://learnenglish.britishcouncil.org/free-resources/grammar/c1): advanced present forms, conditionals with inversion, unreal time, passives, reporting verbs, emphasis, modals, participle clauses and cohesion.
- [Third and mixed conditionals](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-third-mixed): distinguish past–present and present–past time relationships.
- [Cambridge English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/English): foundational and broader grammar references.
- [Cambridge C1 Advanced format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/): grammar and vocabulary are assessed as part of wider reading, writing, listening and speaking competence.

Research checked on 6 October 2026. Examples and teaching notes are original.

## Run locally

Serve the repository with a static web server (for example `python3 -m http.server 8765`) and open `http://127.0.0.1:8765/`. No build or dependencies are required. Keep `index.html`, `students.css` and `students.js` together.
