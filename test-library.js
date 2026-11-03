/* The original standalone tests stay self-contained, including their saved attempts. */
(() => {
  const tests = {
    '#tests/present-perfect': {title:'Present perfect test',src:'tests-content/present-perfect-test.html'},
    '#tests/ielts-reading-b2': {title:'IELTS-style reading · B2',src:'tests-content/ielts-reading-b2-test.html'}
  };
  const $ = id => document.getElementById(id);
  let current = null;
  window.englishTests = {
    isTest: hash => Boolean(tests[hash]),
    title: hash => tests[hash]?.title || 'Tests & homework',
    show(hash) {
      const active = Boolean(hash);
      const test = tests[hash];
      $('testsView').hidden = !active;
      $('testLibrary').hidden = Boolean(test);
      $('testPlayer').hidden = !test;
      $('testsView').setAttribute('aria-labelledby',test ? 'testPlayerTitle' : 'testsTitle');
      document.body.classList.toggle('test-player-open',Boolean(test));
      if (test) {
        $('testPlayerTitle').textContent = test.title;
        $('testStandalone').href = test.src;
        $('testFrame').title = test.title;
        if (current !== hash) $('testFrame').src = test.src;
        current = hash;
      } else if (current) {
        // Unload the document so its timer stops and pagehide saves the attempt.
        $('testFrame').removeAttribute('src');
        current = null;
      }
    }
  };
})();
