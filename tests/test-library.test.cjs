const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=fs.readFileSync(path.join(root,'test-library.js'),'utf8');

function setup(){
  const elements=new Map();
  const get=id=>{if(!elements.has(id))elements.set(id,{hidden:false,attrs:{},loads:0,set src(value){this.attrs.src=value;this.loads++;},get src(){return this.attrs.src;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}});return elements.get(id);};
  const classes=new Map(),window={};
  vm.runInNewContext(source,{window,document:{getElementById:get,body:{classList:{toggle:(name,value)=>classes.set(name,value)}}}});
  return {app:window.englishTests,get,classes};
}

test('test routes open the correct local document and unload it when leaving',()=>{
  const {app,get,classes}=setup();
  app.show('#tests');
  assert.equal(get('testsView').hidden,false);
  assert.equal(get('testLibrary').hidden,false);
  assert.equal(get('testPlayer').hidden,true);
  app.show('#tests/present-perfect');
  assert.equal(get('testFrame').src,'tests-content/present-perfect-test.html');
  assert.equal(get('testFrame').title,'Present perfect test');
  assert.equal(get('testStandalone').href,get('testFrame').src);
  assert.equal(get('testLibrary').hidden,true);
  assert.equal(classes.get('test-player-open'),true);
  app.show('#tests/present-perfect');
  assert.equal(get('testFrame').loads,1,'same route must not reset an active test');
  app.show('#tests/ielts-reading-b2');
  assert.equal(get('testFrame').src,'tests-content/ielts-reading-b2-test.html');
  assert.equal(get('testFrame').title,'IELTS-style reading · B2');
  app.show(null);
  assert.equal(get('testsView').hidden,true);
  assert.equal(get('testFrame').src,undefined,'unload to stop the hidden test timer');
  assert.equal(classes.get('test-player-open'),false);
});

test('unknown test routes show the library without requesting an arbitrary URL',()=>{
  const {app,get}=setup();
  app.show('#tests/present-perfect');
  app.show('#tests/unknown');
  assert.equal(app.isTest('#tests/unknown'),false);
  assert.equal(app.title('#tests/unknown'),'Tests & homework');
  assert.equal(get('testLibrary').hidden,false);
  assert.equal(get('testFrame').src,undefined);
});

test('both hosted tests have forty questions, separate saved attempts, and valid answer keys',()=>{
  const keys=[];
  for(const filename of ['present-perfect-test.html','ielts-reading-b2-test.html']){
    const text=fs.readFileSync(path.join(root,'tests-content',filename),'utf8');
    const core=text.match(/<script id="test-core">([\s\S]*?)<\/script>/)[1];
    const ctx=vm.createContext({});vm.runInContext(core,ctx);
    assert.equal(vm.runInContext('DATA.questions.length',ctx),40);
    assert.equal(vm.runInContext('DATA.questions.every(q=>gradeQuestion(q,q.answer))',ctx),true);
    assert.equal(vm.runInContext('DATA.questions.every(q=>!gradeQuestion(q,""))',ctx),true);
    keys.push(text.match(/const KEY='([^']+)'/)[1]);
    assert.doesNotMatch(text,/<p class="hint">/);
    for(const script of text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
  }
  assert.equal(new Set(keys).size,2,'attempts must not overwrite one another');
});

test('menu, hub and previous PDF links point to packaged resources',()=>{
  for(const route of ['#tests','#tests/present-perfect','#tests/ielts-reading-b2'])assert.ok(html.includes(`href="${route}"`));
  assert.ok(html.indexOf('src="test-library.js')<html.indexOf('src="students.js'));
  const links=[...html.matchAll(/href="(materials\/[^"]+)"/g)].map(m=>m[1]);
  assert.equal(links.length,3);
  for(const file of links)assert.equal(fs.readFileSync(path.join(root,file)).subarray(0,5).toString(),'%PDF-');
  new vm.Script(fs.readFileSync(path.join(root,'students.js'),'utf8'));
});
