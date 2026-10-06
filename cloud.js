/* Account-private English colours; shares the maths teacher login, not its data. */
(() => {
  'use strict';
  const PROJECT_URL = 'https://iljziesnhngxpbcrjvww.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_65bqQ6CDWHdJcRps4yy-ag_fBqnGg0H';
  const TABLE = 'english_student_topic_ratings';
  const board = window.englishBoard;
  const topicIds = new Set(board.topicIds);
  const studentIds = new Set(board.students.map(student => student.id));
  const validRatings = new Set(board.levels.map(([value]) => value));
  const $ = id => document.getElementById(id);
  const state = {ownerId:null,user:null,ready:false,loading:false,pending:{},epoch:0,busy:false,error:'',revision:0};
  let client, guestSnapshot;
  let authBusy = false, refreshBusy = false, authRevision = 0;
  let initEpoch = null;
  const IMPORT_KEY = 'english-grammar-tutor:guest-import-owner:v1';
  const read = (key,fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch (_) {return fallback;}};
  const write = (key,value) => {try {localStorage.setItem(key,JSON.stringify(value));return true;} catch (_) {return false;}};
  const queueKey = () => `english-grammar-tutor:${state.ownerId}:pending:v1`;
  const validRow = row => row && studentIds.has(row.student_id) && topicIds.has(row.topic_id) && validRatings.has(row.rating);
  const rowKey = row => `${row.student_id}/${row.topic_id}`;
  const pendingCount = () => Object.keys(state.pending).length;
  function readPending() {
    const saved = read(queueKey(),{});
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.values(saved).filter(row => validRow(row) && row.owner_id === state.ownerId && typeof row.revision === 'string').map(row => [rowKey(row),row]));
  }
  function message() {
    if (!state.ownerId) return 'Colours saved on this device. Sign in to sync.';
    if (state.error) return state.error;
    if (state.loading) return 'Loading your cloud colours…';
    if (pendingCount()) return navigator.onLine ? 'Saving colours to your account…' : 'Offline — colours will sync when you reconnect.';
    return 'Colours saved to your account.';
  }
  function updateStatus() {
    $('cloudStatus').textContent = message();
    $('accountButton').textContent = state.ownerId ? 'Teacher account' : 'Teacher sign in';
    $('cloudRetry').hidden = !state.ownerId || (!state.error && !pendingCount());
    $('cloudRetry').disabled = state.busy || state.loading && !state.error;
    if ($('topicDialog').open) $('ratingMessage').textContent = message();
    board.syncOptions();
  }
  function install(rows) {
    const values = Object.fromEntries(board.students.map(student => [student.id,{}]));
    rows.filter(validRow).forEach(row => {values[row.student_id][row.topic_id] = row.rating;});
    Object.values(state.pending).filter(validRow).forEach(row => {values[row.student_id][row.topic_id] = row.rating;});
    board.install(values);
  }
  async function fetchRows(owner) {
    const {data,error} = await client.from(TABLE).select('student_id,topic_id,rating').eq('owner_id',owner);
    if (error) throw error;
    return data || [];
  }
  async function initialiseOwner(epoch) {
    if (initEpoch === epoch) return;
    initEpoch = epoch;
    const owner = state.ownerId;
    try {
      const remote = await fetchRows(owner);
      if (epoch !== state.epoch) return;
      const existing = new Set(remote.filter(validRow).map(rowKey));
      const importedBy = read(IMPORT_KEY,null);
      const useGuest = !importedBy || importedBy === owner;
      const missing = [];
      board.students.forEach(student => {
        const seed = useGuest ? guestSnapshot[student.id] : board.freshProfile(student.id);
        board.topicIds.forEach(topic => {
          if (!existing.has(`${student.id}/${topic}`)) missing.push({owner_id:owner,student_id:student.id,topic_id:topic,rating:validRatings.has(seed?.[topic]) ? seed[topic] : 'grey'});
        });
      });
      if (missing.length) {
        // A fresh device imports only missing topics; cloud colours always win.
        const {error} = await client.from(TABLE).upsert(missing,{onConflict:'owner_id,student_id,topic_id',ignoreDuplicates:true});
        if (error) throw error;
      }
      if (epoch !== state.epoch) return;
      const rows = missing.length ? await fetchRows(owner) : remote;
      if (epoch !== state.epoch) return;
      if (!importedBy) write(IMPORT_KEY,owner);
      install(rows);
      state.ready = true;
      state.loading = false;
      state.error = '';
      updateStatus();
      void flush();
    } catch (_) {
      if (epoch !== state.epoch) return;
      state.loading = true;
      state.error = navigator.onLine ? 'Could not load cloud colours. Retry sync.' : 'Offline — reconnect to load cloud colours.';
      updateStatus();
    } finally {if (initEpoch === epoch) initEpoch = null;}
  }
  function updateAccount() {
    $('accountForm').hidden = Boolean(state.ownerId);
    $('signOutButton').hidden = !state.ownerId;
    $('accountMessage').textContent = state.ownerId ? `Signed in as ${state.user?.email || 'teacher'}.` : '';
  }
  function acceptSession(session) {
    const owner = session?.user?.is_anonymous ? null : session?.user?.id || null;
    if (owner === state.ownerId) {state.user = session?.user || null;updateAccount();return;}
    if (!state.ownerId) guestSnapshot = board.snapshotGuest();
    state.epoch++;
    state.ownerId = owner;
    state.user = session?.user || null;
    state.ready = false;
    state.loading = Boolean(owner);
    state.busy = false;
    state.error = '';
    state.pending = owner ? readPending() : {};
    board.setOwner(owner);
    updateAccount();
    updateStatus();
    if (owner) void initialiseOwner(state.epoch);
  }
  async function flush() {
    if (state.busy || !state.ready || !state.ownerId || !navigator.onLine || !pendingCount()) {updateStatus();return;}
    const epoch = state.epoch;
    state.busy = true;
    state.error = '';
    updateStatus();
    try {
      while (epoch === state.epoch && pendingCount()) {
        const batch = Object.values(state.pending).slice(0,100);
        const rows = batch.map(({revision,...row}) => row);
        const {error} = await client.from(TABLE).upsert(rows,{onConflict:'owner_id,student_id,topic_id'});
        if (error) throw error;
        if (epoch !== state.epoch) return;
        // Merge other tabs' queued work, and never clear a newer colour change.
        const latest = {...state.pending,...readPending()};
        batch.forEach(row => {if (latest[rowKey(row)]?.revision === row.revision) delete latest[rowKey(row)];});
        state.pending = latest;
        write(queueKey(),state.pending);
      }
    } catch (_) {
      if (epoch === state.epoch) state.error = 'Not synced yet. Your changes are saved on this device; retry sync.';
    } finally {if (epoch === state.epoch) {state.busy=false;updateStatus();}}
  }
  async function refreshCloud() {
    if (!state.ownerId || !state.ready || refreshBusy || state.busy || pendingCount() || !navigator.onLine) return;
    const epoch = state.epoch, revision = state.revision;
    refreshBusy = true;
    try {
      const rows = await fetchRows(state.ownerId);
      if (epoch === state.epoch && revision === state.revision && !pendingCount() && !state.busy) {install(rows);state.error='';updateStatus();}
    } catch (_) {
      if (epoch === state.epoch) {state.error='Could not refresh cloud colours. Retry sync.';updateStatus();}
    } finally {refreshBusy=false;}
  }
  function save(student,topic,rating) {
    if (!state.ownerId || !state.ready || !validRow({student_id:student,topic_id:topic,rating})) return;
    const row = {owner_id:state.ownerId,student_id:student,topic_id:topic,rating,revision:crypto.randomUUID()};
    state.revision++;
    state.pending = {...state.pending,...readPending(),[rowKey(row)]:row};
    const durable = write(queueKey(),state.pending);
    updateStatus();
    if (!durable) $('cloudStatus').textContent = 'Keep this page open until colours finish syncing; browser storage is unavailable.';
    void flush();
  }
  window.englishCloud = {get ownerId(){return state.ownerId;},get loading(){return state.loading;},save,message};

  function authControls(busy) {authBusy=busy;$('signInButton').disabled=busy;$('signOutButton').disabled=busy;}
  $('accountButton').onclick = () => {updateAccount();$('accountPassword').value='';$('accountDialog').showModal();};
  $('closeAccount').onclick = () => $('accountDialog').close();
  $('accountDialog').addEventListener('close',() => {$('accountPassword').value='';$('accountButton').focus();});
  $('accountForm').onsubmit = async event => {
    event.preventDefault();
    if (authBusy || !client) return;
    authControls(true);
    $('accountMessage').textContent='Signing in…';
    try {
      const {data,error} = await client.auth.signInWithPassword({email:$('accountEmail').value.trim(),password:$('accountPassword').value});
      if (error) throw error;
      authRevision++;
      acceptSession(data.session);
      $('accountDialog').close();
    } catch (error) {$('accountMessage').textContent=error.message || 'Could not sign in. Please try again.';}
    finally {authControls(false);}
  };
  $('signOutButton').onclick = async () => {
    if (authBusy || !client) return;
    if (pendingCount()) {$('accountMessage').textContent='Some colours are waiting to sync. Retry sync before signing out.';return;}
    authControls(true);
    try {
      const {error} = await client.auth.signOut({scope:'local'});
      if (error) throw error;
      authRevision++;
      acceptSession(null);
      $('accountDialog').close();
    } catch (error) {$('accountMessage').textContent=error.message || 'Could not sign out. Please try again.';}
    finally {authControls(false);}
  };
  function retry() {
    if (!state.ownerId) return;
    state.error='';
    if (!state.ready) {updateStatus();void initialiseOwner(state.epoch);}
    else {void flush();void refreshCloud();}
  }
  $('cloudRetry').onclick = retry;
  window.addEventListener('online',retry);
  window.addEventListener('offline',updateStatus);
  window.addEventListener('focus',() => {void refreshCloud();});
  document.addEventListener('visibilitychange',() => {if(document.visibilityState==='visible') void refreshCloud();});
  window.addEventListener('storage',event => {
    if (!state.ownerId || event.key !== queueKey()) return;
    state.pending = readPending();
    state.revision++;
    if (pendingCount()) void flush(); else void refreshCloud();
    updateStatus();
  });
  window.addEventListener('beforeunload',event => {if(pendingCount()) {event.preventDefault();event.returnValue='';}});
  setInterval(() => {if(pendingCount()) void flush();else void refreshCloud();},30000);
  try {
    if (!window.supabase) throw new Error('Sign-in service unavailable. Refresh the page.');
    client = window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY,{db:{timeout:15000,retry:false},auth:{storageKey:'plato-maths-school:auth:v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    client.auth.onAuthStateChange((_event,session) => {
      const revision = ++authRevision;
      // Defer all API work until after Supabase releases its auth lock.
      setTimeout(() => {if(revision===authRevision) acceptSession(session);},0);
    });
    const revision = authRevision;
    void client.auth.getSession().then(({data,error}) => {
      if(error) throw error;
      if(revision===authRevision) acceptSession(data.session);
    }).catch(() => {$('cloudStatus').textContent='Could not restore sign-in. Your device colours are still available.';});
  } catch (error) {
    $('cloudStatus').textContent='Cloud sign-in unavailable. Colours are still saved on this device.';
    $('accountMessage').textContent=error.message;
  }
})();
