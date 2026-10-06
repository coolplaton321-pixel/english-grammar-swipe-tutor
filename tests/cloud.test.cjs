const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {randomUUID} = require('node:crypto');
const source = fs.readFileSync(require('node:path').join(__dirname,'../cloud.js'),'utf8');
const settle = async () => {for(let i=0;i<10;i++) await new Promise(resolve => setImmediate(resolve));};
const session = id => ({user:{id,email:`${id}@example.test`,is_anonymous:false}});
const key = row => `${row.owner_id}/${row.student_id}/${row.topic_id}`;

function harness({owner='teacher',remote=[],storage=new Map(),guest,holdRead,holdWrite}={}) {
  const elements = new Map();
  const element = id => {
    if(!elements.has(id)) elements.set(id,{textContent:'',value:'',hidden:false,disabled:false,open:false,addEventListener(){},focus(){},showModal(){this.open=true;},close(){this.open=false;}});
    return elements.get(id);
  };
  const events = new Map(), rows = new Map(remote.map(row => [key(row),{...row}]));
  let authCallback, currentOwner, installed, writes=0;
  const navigator = {onLine:true};
  const board = {
    students:['taras','marina','anton'].map(id => ({id})),topicIds:['present','past'],
    levels:['grey','red','yellow','green'].map(value => [value]),
    freshProfile:id => id==='taras'?{}:{present:'yellow',past:'red'},
    snapshotGuest:() => guest || {taras:{present:'red'},marina:{present:'yellow',past:'green'},anton:{present:'green',past:'red'}},
    setOwner:id => {currentOwner=id;installed=null;},
    install:values => {installed=JSON.parse(JSON.stringify(values));},syncOptions(){}
  };
  const client = {
    from(table) {
      assert.equal(table,'english_student_topic_ratings');
      return {
        select:() => ({eq:async (_,id) => {if(holdRead) await holdRead(id);return {data:[...rows.values()].filter(row=>row.owner_id===id),error:null};}}),
        upsert:async (batch,options) => {
          writes++;
          if(holdWrite) await holdWrite(batch,options);
          for(const row of batch) if(!options.ignoreDuplicates || !rows.has(key(row))) rows.set(key(row),{...row});
          return {error:null};
        }
      };
    },
    auth:{onAuthStateChange:callback=>{authCallback=callback;},getSession:async()=>({data:{session:owner?session(owner):null}}),signOut:async()=>({error:null})}
  };
  const window = {englishBoard:board,supabase:{createClient:()=>client},addEventListener:(name,callback)=>events.set(name,callback)};
  vm.runInNewContext(source,{window,document:{getElementById:element,addEventListener(){}},navigator,crypto:{randomUUID},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},setTimeout:fn=>setImmediate(fn),setInterval(){}});
  return {window,navigator,rows,storage,element,events,get installed(){return installed;},get owner(){return currentOwner;},get writes(){return writes;},auth:id=>authCallback('SIGNED_IN',id?session(id):null)};
}

test('cloud colours win; imports only missing rows from the existing device',async()=>{
  const h=harness({remote:[{owner_id:'teacher',student_id:'taras',topic_id:'present',rating:'green'}]});
  await settle();
  assert.equal(h.installed.taras.present,'green');
  assert.equal(h.installed.marina.past,'green');
  assert.equal(h.rows.size,6);
  assert.equal(h.window.englishCloud.loading,false);
  assert.equal(h.element('cloudStatus').textContent,'Colours saved to your account.');
});

test('offline edits survive reload and sync after reconnect',async()=>{
  const h=harness();await settle();h.navigator.onLine=false;
  h.window.englishCloud.save('marina','present','red');
  await settle();
  assert.equal(h.rows.get('teacher/marina/present').rating,'yellow');
  assert.match(h.window.englishCloud.message(),/Offline/);
  const reloaded=harness({remote:[...h.rows.values()],storage:h.storage});
  await settle();
  assert.equal(reloaded.installed.marina.present,'red');
  assert.equal(reloaded.rows.get('teacher/marina/present').rating,'red');
  assert.equal(reloaded.storage.get('english-grammar-tutor:teacher:pending:v1'),'{}');
});

test('a newer edit made during a save is not discarded',async()=>{
  let release,blocked=false;
  const h=harness({holdWrite:async (_,options)=>{if(!options.ignoreDuplicates && !blocked){blocked=true;await new Promise(resolve=>{release=resolve;});}}});
  await settle();
  h.window.englishCloud.save('taras','present','yellow');await settle();
  h.window.englishCloud.save('taras','present','green');
  release();await settle();
  assert.equal(h.rows.get('teacher/taras/present').rating,'green');
  assert.equal(h.storage.get('english-grammar-tutor:teacher:pending:v1'),'{}');
});

test('failed saving keeps a durable queue and retry sends it',async()=>{
  let fail=true;
  const h=harness({holdWrite:async(_,options)=>{if(!options.ignoreDuplicates && fail) throw new Error('network');}});
  await settle();h.window.englishCloud.save('anton','past','green');await settle();
  assert.match(h.window.englishCloud.message(),/Not synced yet/);
  assert.notEqual(h.storage.get('english-grammar-tutor:teacher:pending:v1'),'{}');
  fail=false;h.events.get('online')();await settle();
  assert.equal(h.rows.get('teacher/anton/past').rating,'green');
  assert.equal(h.element('cloudStatus').textContent,'Colours saved to your account.');
});

test('switching accounts ignores stale reads and never imports another account’s device colours',async()=>{
  let release;
  const h=harness({holdRead:async id=>{if(id==='teacher') await new Promise(resolve=>{release=resolve;});}});
  await settle();h.auth('other');await settle();release();await settle();
  assert.equal(h.owner,'other');
  assert.equal(h.installed.taras.present,'red');
  h.auth('third');await settle();
  assert.equal(h.installed.taras.present,'grey');
  assert.equal(h.installed.marina.present,'yellow');
  assert.equal(h.rows.has('teacher/taras/present'),false);
});

test('a failed initial load blocks editing until a successful retry',async()=>{
  let fail=true;
  const h=harness({holdRead:async()=>{if(fail) throw new Error('offline');}});
  await settle();assert.equal(h.window.englishCloud.loading,true);
  h.window.englishCloud.save('taras','past','red');
  assert.equal(h.writes,0);
  fail=false;h.element('cloudRetry').onclick();await settle();
  assert.equal(h.window.englishCloud.loading,false);
  assert.equal(h.rows.size,6);
});
