const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const bankSource = inline.slice(inline.indexOf('const QUESTIONS = ['),inline.indexOf('/* Default explanations'));
const banks = vm.runInNewContext(`${bankSource}\n({mixed:QUESTIONS,verbs:VERB_FORM_QUESTIONS,perfect:PRESENT_PERFECT_QUESTIONS,extra:EXTRA_VERB_FORMS})`);

test('all inline practice code parses',()=>{assert.doesNotThrow(()=>new vm.Script(inline));});

test('Present Perfect is doubled; verb forms expand without changing mixed tenses',()=>{
  assert.equal(banks.perfect.length,100);
  assert.equal(banks.verbs.length,50);
  assert.equal(banks.mixed.length,112);
  const counts={};
  banks.perfect.forEach(question=>{counts[question.task]=(counts[question.task]||0)+1;});
  assert.deepEqual(counts,{'Put the correct form':40,'Write the third form':30,'Fix the mistake':15,'Build the sentence':15});
});

test('expanded decks have unique, complete prompts and valid task types',()=>{
  for(const bank of [banks.perfect,banks.verbs]) {
    assert.equal(new Set(bank.map(question=>question.prompt.toLowerCase().trim())).size,bank.length);
    for(const question of bank) {
      for(const field of ['task','tense','prompt','answer','context']) {
        assert.equal(typeof question[field],'string');
        assert.ok(question[field].trim(),`${field}: ${question.prompt}`);
        assert.doesNotMatch(question[field],/undefined|null/);
      }
      assert.ok(['pr','ps','vf'].includes(question.tense));
      assert.ok(['Put the correct form','Write the third form','Fix the mistake','Build the sentence','Choose V2 and V3'].includes(question.task));
    }
  }
});

test('new participles and their V2 contrasts are correct',()=>{
  const expected={eat:['ate','eaten'],drink:['drank','drunk'],swim:['swam','swum'],run:['ran','run'],ride:['rode','ridden'],fly:['flew','flown'],drive:['drove','driven'],tear:['tore','torn'],read:['read','read'],be:['was/were','been'],cut:['cut','cut'],put:['put','put']};
  for(const [verb,second,third,example] of banks.extra) {
    if(expected[verb]) assert.deepEqual([second,third],expected[verb]);
    assert.ok(example.includes(` ${third} `)||example.includes(` ${third}.`),example);
    const card=banks.verbs.find(question=>question.prompt.startsWith(`${verb} →`));
    assert.equal(card.answer,`${verb} - ${second} - ${third}`);
  }
  assert.match(banks.verbs.find(question=>question.prompt.startsWith('read →')).theory,/'red'/);
  assert.match(banks.perfect.find(question=>question.prompt==='read → V3: ______').theory,/'red'/);
});

test('sidebar counts derive from the actual banks',()=>{
  const buttons=['present-perfect','tenses','verbs'].map(deck=>({dataset:{deck},classList:{toggle(){}},badge:{},querySelector(){return this.badge;}}));
  const syncSource=inline.slice(inline.indexOf('function syncDrillSide(){'),inline.indexOf('function shuffledQuestions(){'));
  vm.runInNewContext(`${bankSource}\nlet drillDeck='verbs';\n${syncSource}\nsyncDrillSide();`,{document:{querySelectorAll:()=>buttons}});
  assert.deepEqual(buttons.map(button=>button.badge.textContent),[100,112,50]);
});
