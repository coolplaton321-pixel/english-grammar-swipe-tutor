(() => {
  'use strict';
  const BC = 'https://learnenglish.britishcouncil.org/free-resources/grammar/';
  const CAMBRIDGE = 'https://dictionary.cambridge.org/grammar/british-grammar/English';
  const ref = slug => BC + 'c1/' + slug;
  // Stable IDs preserve assessments if a topic is renamed or reordered.
  // Each entry is [id, title, purpose, structure, original example, teaching focus, reference].
  const STRANDS = [
    {title:'Tenses & time',color:'#3C6E9F',topics:[
      ['present-simple','Present simple','Express facts, routines and states.','Subject + base verb / verb-s; do/does + base verb','The report argues that remote work improves productivity.','Use the present simple for commentary and reporting what a text says.',ref('advanced-present-simple-continuous')],
      ['present-continuous','Present continuous','Describe temporary or changing situations and arrangements.','am/is/are + verb-ing','We are gradually becoming less dependent on printed materials.','Choose between a state and a temporary behaviour: he is rude / he is being rude.',ref('advanced-present-simple-continuous')],
      ['present-perfect','Present perfect simple','Connect past events or continuing states to the present.','have/has + past participle','The committee has revised the policy three times this year.','Explain the current result; distinguish unfinished time from a finished past time.',CAMBRIDGE],
      ['present-perfect-continuous','Present perfect continuous','Emphasise duration, repeated activity or recent activity.','have/has been + verb-ing','I have been comparing the two proposals all morning.','Choose activity or duration rather than a completed quantity; handle stative verbs.',CAMBRIDGE],
      ['past-simple','Past simple','Describe completed events, sequences and past states.','Past verb; did + base verb in questions and negatives','The panel rejected the first proposal and requested more evidence.','Keep finished events distinct from present relevance; control irregular forms.',CAMBRIDGE],
      ['past-continuous','Past continuous','Set a past scene or describe an activity in progress.','was/were + verb-ing','While we were reviewing the figures, a new issue emerged.','Combine background and foreground actions without making every past action continuous.',CAMBRIDGE],
      ['past-perfect','Past perfect simple','Show that one event happened before another past reference point.','had + past participle','By the time Taras arrived, the discussion had already begun.','Make the sequence clear; avoid unnecessary past perfect when chronology is obvious.',CAMBRIDGE],
      ['past-perfect-continuous','Past perfect continuous','Describe an ongoing activity leading up to a past moment.','had been + verb-ing','She was exhausted because she had been negotiating all day.','Distinguish duration or cause from a completed past result.',CAMBRIDGE],
      ['future-will-going-to','Future: will & going to','Express predictions, intentions and decisions.','will + base verb / am/is/are going to + base verb','We are going to revise the schedule; I will email everyone now.','Match the form to the intention and evidence rather than treating future forms as interchangeable.',CAMBRIDGE],
      ['future-present-forms','Future: present forms','Use present forms for timetables and arrangements.','Present simple for schedules; present continuous for arrangements','The workshop starts at nine, and I am meeting Taras beforehand.','Use present forms in future time clauses: once we finish, not once we will finish.',CAMBRIDGE],
      ['future-continuous','Future continuous','Describe activity in progress at a future time.','will be + verb-ing','At this time tomorrow, we will be discussing the results.','Use it for expected activity and tactful enquiries about someone’s plans.',CAMBRIDGE],
      ['future-perfect','Future perfect simple','Describe completion before a future reference point.','will have + past participle','By Friday, we will have reviewed every application.','Distinguish completion by a deadline from activity continuing until a time.',CAMBRIDGE],
      ['future-perfect-continuous','Future perfect continuous','Look back from a future point at the duration of an activity.','will have been + verb-ing','By June, Taras will have been studying here for two years.','Make the future reference point and duration explicit.','https://dictionary.cambridge.org/grammar/british-grammar/future-perfect-continuous'],
      ['future-in-past','Future in the past','Describe plans and expectations from a past viewpoint.','would + base verb / was/were going to + base verb','We thought the new system would reduce delays, but it did not.','Keep the viewpoint consistent; distinguish an expectation from an abandoned intention.',CAMBRIDGE],
      ['narrative-habits','Narrative sequencing & past habits','Combine past forms naturally and describe former habits.','Past simple / continuous / perfect; used to + verb; would + action verb','I used to live nearby; every Friday, I would walk to the library.','Use would for repeated actions, not generally for past states; maintain a coherent narrative timeline.',CAMBRIDGE]
    ]},
    {title:'Conditionals & unreal time',color:'#C98A2B',topics:[
      ['zero-conditional','Zero conditional','Describe regular consequences and general relationships.','if/when + present, present','If an argument lacks evidence, readers question its credibility.','Distinguish a general rule from one specific future possibility.',BC+'b1-b2/conditionals-zero-first-second'],
      ['first-conditional','First conditional','Discuss realistic future possibilities.','if + present, will/can/may + base verb or imperative','If the proposal is approved, we can start next month.','Use a modal or instruction when the meaning calls for it; avoid automatic will in the if-clause.',BC+'b1-b2/conditionals-zero-first-second'],
      ['second-conditional','Second conditional','Imagine unlikely or unreal present and future situations.','if + past form, would/could/might + base verb','If I had more time, I would examine the evidence in detail.','The past form signals distance from reality, not necessarily past time.',BC+'b1-b2/conditionals-zero-first-second'],
      ['third-conditional','Third conditional','Imagine an alternative past and its past result.','if + had + past participle, would/could/might have + past participle','If we had checked the figures, we could have avoided the error.','Keep both clauses in the past and distinguish certainty from possibility.',BC+'b1-b2/conditionals-third-mixed'],
      ['mixed-past-present','Mixed: past → present','Connect an unreal past condition with a present consequence.','if + past perfect, would + base verb','If I had accepted that job, I would live abroad now.','Explain which clause refers to the past and which refers to the present.',BC+'b1-b2/conditionals-third-mixed'],
      ['mixed-present-past','Mixed: present → past','Connect an unreal general situation with a past consequence.','if + past form, would have + past participle','If I were more organised, I would not have missed yesterday’s deadline.','Make sure the present characteristic logically explains the past result.',BC+'b1-b2/conditionals-third-mixed'],
      ['conditional-inversion','Inverted conditionals','Use formal conditional clauses without if.','Should + subject + verb; Were + subject + to-infinitive; Had + subject + past participle','Had we received the data earlier, we could have completed the review.','Choose the correct time and possibility. With be: Were I in charge… . Put not after the subject.',ref('inversion-conditionals')],
      ['conditional-alternatives','Unless, provided, otherwise & alternatives','Express conditions, limits and alternatives precisely.','unless / provided (that) / as long as + clause; otherwise + result','You may quote the report provided that you acknowledge the source.','Distinguish unless from if not; in case expresses a precaution rather than the same condition.',CAMBRIDGE],
      ['wish-if-only','Wish & if only','Express unreal wishes, regrets or desired changes.','wish + past form / past perfect / would + verb','I wish I had asked for clarification before signing.','Choose present dissatisfaction, past regret or a desired change; do not use would for every wish.',ref('unreal-time')],
      ['unreal-time','Would rather, it’s time & as if','Use past forms to express distance from reality.','would rather + subject + past; it’s time + subject + past; as if + clause','I would rather you explained the reasoning before giving the answer.','Distinguish same-subject would rather + base verb from a different-subject past clause.',ref('unreal-time')]
    ]},
    {title:'Advanced structures',color:'#2E8B77',topics:[
      ['passive-forms','Passive forms & focus','Shift attention from the agent to the action or result.','be + past participle; modal + be / have been + past participle','The results should have been checked before publication.','Control perfect, continuous and modal passives and choose an appropriate information focus.',ref('advanced-passives-review')],
      ['reporting-passives','Reporting passives','Report beliefs and claims in a formal style.','It is said that… / subject + is said + to be / to have + past participle','The painting is believed to have been stolen during the night.','Select a simple, continuous or perfect infinitive to express the correct time relationship.',ref('advanced-passives-review')],
      ['causative','Have/get something done','Describe arranging for someone else to do a task.','have/get + object + past participle','We had the contract reviewed by an independent adviser.','Distinguish arranging a service from doing it yourself and from experiencing an unwanted event.',CAMBRIDGE],
      ['relative-clauses','Defining & non-defining relatives','Identify a noun or add extra information about it.','who/which/that/whose/where + clause; commas for extra information','The proposal, which had been revised twice, was finally accepted.','Control punctuation, omission of object pronouns and preposition placement.',CAMBRIDGE],
      ['reduced-relatives','Reduced & sentential relatives','Compress relative clauses or comment on an entire clause.','noun + -ing / past participle; whole clause + , which…','The documents submitted yesterday were incomplete, which delayed the decision.','Recognise whether which refers to a noun or the whole preceding idea.',CAMBRIDGE],
      ['participle-clauses','Participle clauses','Link actions economically in formal writing.','-ing / past participle / having + past participle + clause','Having compared the alternatives, Taras recommended the cheaper option.','Keep the understood subject consistent and make the time relationship clear.',ref('participle-clauses')],
      ['gerunds-infinitives','Gerunds & infinitives','Choose verb patterns that preserve the intended meaning.','verb + -ing / to-infinitive; preposition + -ing','I stopped to check the map, then stopped worrying about the route.','Explain meaning changes with remember, stop, try and regret; avoid guessing by translation.',CAMBRIDGE],
      ['complex-infinitives','Perfect, continuous & passive infinitives','Express time, activity and voice after another verb.','to have done / to be doing / to be done / to have been done','He seems to have misunderstood the instructions.','Distinguish earlier events, simultaneous activity and passive meaning.',CAMBRIDGE],
      ['reporting-verbs','Reported speech & reporting verbs','Report messages accurately with varied verb patterns.','verb + that / to-infinitive / object + to-infinitive / preposition + -ing','The supplier admitted sending the wrong items and promised to replace them.','Control backshift when needed, indirect question order and verb-specific complements.',ref('patterns-reporting-verbs')],
      ['negative-inversion','Inversion for emphasis','Use negative and restrictive openings for emphasis.','negative/restrictive adverbial + auxiliary + subject + verb','Only after reading the appendix did I understand the conclusion.','Use do-support when necessary; distinguish no sooner…than from hardly…when.',ref('inversion-after-negative-adverbials')],
      ['clefts','Cleft sentences & emphatic auxiliaries','Highlight the information the listener should focus on.','It is/was…that/who…; What…is…; do/does/did + base verb','What matters most is the quality of the evidence.','Use emphasis where it serves the argument and fits the register.',ref('emphasis-cleft-sentences-inversion-auxiliaries')],
      ['subjunctive','Formal demands & the subjunctive','Express formal recommendations and requirements.','suggest/insist that + subject + base verb; should + base verb','The panel recommended that the decision be reconsidered.','Recognise the mandative subjunctive and the should construction. Distinguish insisting on a demand from insisting that a claim is true.',CAMBRIDGE]
    ]},
    {title:'Modals & precision',color:'#8B6BA0',topics:[
      ['modals-probability','Modals: probability & deduction','Express different degrees of certainty.','must / may / might / could / can’t + verb; be likely/bound to','The delay might well affect the final outcome.','Distinguish a logical deduction from a possibility and choose the right strength.',ref('modals-probability')],
      ['modals-past','Modals: past deductions & regrets','Evaluate past events and unreal alternatives.','modal + have + past participle','They must have overlooked the final page; we should have checked it.','Separate deduction, criticism and unreal possibility instead of treating perfect modals alike.',CAMBRIDGE],
      ['modals-obligation','Obligation, permission & necessity','Express requirements and freedom from requirements.','must / have to / should / may; needn’t / don’t have to','You need not submit a printed copy, but you must sign the form.','Distinguish prohibition from lack of obligation, and needn’t have done from didn’t need to do.',CAMBRIDGE],
      ['articles','Articles, reference & generalisation','Choose a/an, the or no article to signal meaning.','a/an + singular count noun; the + identified noun; zero article','Research can inform policy, but the research in this report is limited.','Control abstract nouns, general statements and shared or first-time reference.',CAMBRIDGE],
      ['determiners','Quantifiers & determiners','Express amounts and scope accurately.','few/a few; little/a little; each/every; all/most/some of…','Few participants objected, but a few requested more time.','Handle countability, agreement and the change in meaning created by a.',CAMBRIDGE],
      ['noun-modifiers','Possession & noun modifiers','Build clear, precise noun phrases.','possessive ’s / of-phrase; noun + noun; adjective modifiers','The project’s revised training budget covers a three-day workshop.','Choose modifier order and possessive form; keep meaning clear in long noun phrases.',ref('possession-noun-modifiers')],
      ['comparison','Advanced comparison & degree','Compare and qualify ideas with precision.','far/slightly + comparative; not nearly as…as; the more…, the…','The revised version is considerably clearer than the original.','Use degree modifiers and proportional comparisons without redundant comparatives.',CAMBRIDGE],
      ['contrast','Concession & contrast','Acknowledge an opposing point and connect ideas.','although + clause; despite + noun/-ing; whereas + clause','Despite having limited time, we checked every source.','Match the connector to its complement and distinguish concession from direct contrast.',ref('contrasting-ideas')],
      ['cohesion','Ellipsis & substitution','Avoid repetition when the missing meaning is clear.','auxiliary substitution; so/not; one/ones; omitted repeated words','I have reviewed the draft, and Taras has too.','Keep references unambiguous and choose natural omissions for speech or writing.',ref('ellipsis')],
      ['nominalisation','Nominalisation & academic style','Turn actions into noun phrases when this helps organise formal writing.','verb/adjective → noun phrase; noun phrase + of…','The implementation of the policy requires careful planning.','Use an appropriate formal style while avoiding overloaded, unclear noun phrases.',CAMBRIDGE],
      ['agreement','Agreement & complex subjects','Keep verb agreement accurate in longer sentences.','subject head + matching verb; each/every + singular verb','Each of the proposed changes has a clear justification.','Identify the head of the subject rather than agreeing with the nearest noun.',CAMBRIDGE],
      ['phrasal-prepositions','Phrasal verbs & dependent prepositions','Use verb–particle and preposition patterns accurately.','separable verb + object + particle; preposition + noun/-ing','We put the meeting off, but we could not put it off again.','Place pronoun objects correctly and distinguish separable from inseparable patterns.',ref('word-order-phrasal-verbs')]
    ]}
  ];
  const LEVELS = [['grey','Not assessed'],['red','Needs support'],['yellow','Developing'],['green','Confident']];
  const STUDENTS = [{id:'taras',name:'Taras'},{id:'marina',name:'Marina'},{id:'anton',name:'Anton'}];
  const topicIds = new Set(STRANDS.flatMap(strand => strand.topics.map(topic => topic[0])));
  const $ = id => document.getElementById(id);
  let ratings = {};
  let storageAvailable = true;
  let selectedId = null;
  let opener = null;
  let activeStudent = STUDENTS[0];
  let ownerId = null;
  const profiles = new Map();

  function storageKey(student,owner = ownerId) {
    return owner ? `english-grammar-tutor:${owner}:${student.id}:c1:knowledge:v1` : `english-grammar-tutor:${student.id}:c1:knowledge:v1`;
  }
  function cleanRatings(saved) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id,level]) => topicIds.has(id) && LEVELS.some(([value]) => value === level)));
  }
  function freshProfile(studentId) {
    if (studentId === 'taras') return {};
    return Object.fromEntries([...topicIds].map((id,index) => [id,LEVELS[index < 4 ? index : Math.floor(Math.random()*4)][0]]));
  }
  function readRatings(student = activeStudent,owner = ownerId) {
    try {
      const raw = localStorage.getItem(storageKey(student,owner));
      if (raw !== null) return cleanRatings(JSON.parse(raw));
    } catch (_) { return {}; }
    const initial = owner ? {} : freshProfile(student.id);
    try {localStorage.setItem(storageKey(student,owner),JSON.stringify(initial));} catch (_) {}
    return initial;
  }
  function loadProfiles() {
    STUDENTS.forEach(student => profiles.set(student.id,readRatings(student)));
    ratings = profiles.get(activeStudent.id);
  }
  loadProfiles();
  const ratingFor = id => ratings[id] || 'grey';
  const labelFor = level => LEVELS.find(([value]) => value === level)[1];

  function updateBoard() {
    let assessed = 0, confident = 0;
    document.querySelectorAll('.topic-row').forEach(button => {
      const rating = ratingFor(button.dataset.topic);
      button.querySelector('.topic-dot').dataset.rating = rating;
      button.setAttribute('aria-label', `${button.dataset.title}: ${labelFor(rating)}. Open topic details.`);
      button.title = labelFor(rating);
      if (rating !== 'grey') assessed++;
      if (rating === 'green') confident++;
    });
    $('topicTotal').textContent = topicIds.size;
    $('topicAssessed').textContent = assessed;
    $('topicConfident').textContent = confident;
  }
  function syncOptions() {
    document.querySelectorAll('.rating-option').forEach(button => {
      const checked = button.dataset.rating === ratingFor(selectedId);
      button.setAttribute('aria-checked', String(checked));
      button.tabIndex = checked ? 0 : -1;
      button.disabled = Boolean(window.englishCloud?.loading);
    });
  }
  function setRating(level) {
    if (!selectedId || window.englishCloud?.loading) return;
    ratings[selectedId] = level;
    try {
      localStorage.setItem(storageKey(activeStudent), JSON.stringify(ratings));
      storageAvailable = true;
    } catch (_) { storageAvailable = false; }
    syncOptions();
    updateBoard();
    if (window.englishCloud?.ownerId) window.englishCloud.save(activeStudent.id,selectedId,level);
    else $('ratingMessage').textContent = storageAvailable
      ? `${labelFor(level)} · saved on this device. Sign in to sync.`
      : `${labelFor(level)} · browser storage is unavailable; this change lasts for this session.`;
  }

  LEVELS.forEach(([value,label]) => {
    const legendItem = document.createElement('span');
    legendItem.innerHTML = `<i class="topic-dot" data-rating="${value}" aria-hidden="true"></i>${label}`;
    $('knowledgeLegend').appendChild(legendItem);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rating-option';
    button.dataset.rating = value;
    button.setAttribute('role','radio');
    button.innerHTML = `<i class="topic-dot" data-rating="${value}" aria-hidden="true"></i>${label}`;
    button.onclick = () => setRating(value);
    button.onkeydown = event => {
      const offset = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft','ArrowUp'].includes(event.key) ? -1 : 0;
      if (!offset && !['Home','End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...$('ratingOptions').children];
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (buttons.indexOf(button)+offset+buttons.length)%buttons.length;
      buttons[index].focus();
      setRating(buttons[index].dataset.rating);
    };
    $('ratingOptions').appendChild(button);
  });

  STRANDS.forEach((strand,index) => {
    const section = document.createElement('section');
    section.className = 'topic-column';
    section.style.setProperty('--strand-color',strand.color);
    section.innerHTML = `<header><small>${String(index+1).padStart(2,'0')} / ${strand.topics.length} topics</small><h2>${strand.title}</h2></header><div class="topic-list"></div>`;
    strand.topics.forEach(([id,title,purpose,structure,example,focus,reference]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-row';
      button.dataset.topic = id;
      button.dataset.title = title;
      button.setAttribute('aria-haspopup','dialog');
      button.innerHTML = '<i class="topic-dot" aria-hidden="true"></i><span class="topic-title"></span><span class="row-chevron" aria-hidden="true">›</span>';
      button.querySelector('.topic-title').textContent = title;
      button.onclick = () => {
        selectedId = id;
        opener = button;
        $('dialogStrand').textContent = strand.title;
        $('dialogTitle').textContent = title;
        $('dialogDescription').textContent = purpose;
        $('dialogStructure').textContent = structure;
        $('dialogExample').textContent = example;
        $('dialogFocus').textContent = focus;
        $('dialogReference').href = reference;
        $('ratingMessage').textContent = window.englishCloud?.message() || `${labelFor(ratingFor(id))} · choose a colour to update this topic.`;
        syncOptions();
        $('topicDialog').showModal();
      };
      section.querySelector('.topic-list').appendChild(button);
    });
    $('topicBoard').appendChild(section);
  });

  const closeMenu = () => { $('menuPanel').hidden = true; $('menuToggle').setAttribute('aria-expanded','false'); };
  $('menuToggle').onclick = () => {
    const open = $('menuPanel').hidden;
    $('menuPanel').hidden = !open;
    $('menuToggle').setAttribute('aria-expanded',String(open));
  };
  document.addEventListener('click', event => { if (!event.target.closest('.app-menu')) closeMenu(); });
  $('menuPanel').addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('menuPanel').hidden) { closeMenu(); $('menuToggle').focus(); }
  });
  $('closeTopic').onclick = $('doneTopic').onclick = () => $('topicDialog').close();
  $('topicDialog').addEventListener('close', () => {
    if (opener && !$('studentsView').hidden) opener.focus();
  });
  $('topicDialog').addEventListener('click', event => {
    if (event.target !== $('topicDialog')) return;
    const rect = $('topicDialog').getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('topicDialog').close();
  });
  function showView(moveFocus = false) {
    const studentsActive = location.hash === '#students' || location.hash.startsWith('#students/');
    const student = STUDENTS.find(profile => location.hash === `#students/${profile.id}`);
    const boardActive = Boolean(student);
    if ($('topicDialog').open) $('topicDialog').close();
    $('practiceView').hidden = studentsActive;
    $('studentsView').hidden = !studentsActive;
    $('studentDirectory').hidden = boardActive;
    $('studentBoard').hidden = !boardActive;
    if (student) {
      activeStudent = student;
      ratings = profiles.get(student.id);
      $('studentName').textContent = student.name;
      $('sampleTag').hidden = student.id === 'taras';
      $('progressSummary').setAttribute('aria-label',`${student.name}’s progress`);
      $('knowledgeHeading').textContent = `${student.name}’s knowledge level`;
      $('ratingOptions').setAttribute('aria-label',`${student.name}’s knowledge level`);
      updateBoard();
    }
    $('studentsView').setAttribute('aria-labelledby',boardActive ? 'studentName' : 'studentsTitle');
    document.body.classList.toggle('drill-mode', !studentsActive && mode === 'drill');
    document.body.classList.toggle('hints-open', !studentsActive && !$('globalHints').hidden);
    if (studentsActive) stopTimer();
    [['studentsNav',studentsActive],['practiceNav',!studentsActive]].forEach(([id,active]) => {
      if (active) $(id).setAttribute('aria-current','page');
      else $(id).removeAttribute('aria-current');
    });
    document.title = boardActive ? `${student.name} · Grammar board — English tutoring` : studentsActive ? 'Students — English tutoring' : 'Practice — English tutoring';
    closeMenu();
    if (moveFocus) {
      window.scrollTo(0,0);
      if (studentsActive) $(boardActive ? 'studentName' : 'studentsTitle').focus({preventScroll:true});
      else $('menuToggle').focus({preventScroll:true});
    }
  }
  window.addEventListener('hashchange', () => showView(true));
  window.addEventListener('storage', event => {
    if (event.key !== null && !STUDENTS.some(student => event.key === storageKey(student))) return;
    loadProfiles();
    updateBoard();
    if ($('topicDialog').open) {
      syncOptions();
      $('ratingMessage').textContent = 'Knowledge colours updated from another tab.';
    }
  });
  window.englishBoard = {
    students:STUDENTS,topicIds:[...topicIds],levels:LEVELS,
    freshProfile,
    snapshotGuest:() => Object.fromEntries(STUDENTS.map(student => [student.id,readRatings(student,null)])),
    setOwner(owner) {
      if ($('topicDialog').open) $('topicDialog').close();
      ownerId = owner;
      loadProfiles();
      updateBoard();
      syncOptions();
    },
    install(values) {
      STUDENTS.forEach(student => {
        const cleaned = cleanRatings(values[student.id]);
        profiles.set(student.id,cleaned);
        try {localStorage.setItem(storageKey(student),JSON.stringify(cleaned));} catch (_) {}
      });
      ratings = profiles.get(activeStudent.id);
      updateBoard();
      syncOptions();
    },
    syncOptions
  };
  updateBoard();
  showView();
})();
