const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const inline=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const source=inline.slice(inline.indexOf('const READING_CARDS = ['),inline.indexOf('const MARKERS = ['));
const {stories,timelines}=vm.runInNewContext(`${source}\n({stories:READING_CARDS,timelines:READING_TIMELINES})`);

test('five stories are added to the existing twenty-five with matching timelines',()=>{
  assert.equal(stories.length,30);
  assert.equal(timelines.length,stories.length);
  assert.equal(stories[0].title,'The morning the old cafe changed');
  assert.equal(stories[24].title,'The boat beside the empty beach');
  assert.equal(new Set(stories.map(s=>s.title)).size,30);
  for(const [i,story] of stories.entries()){
    assert.equal(story.text.length,3);
    assert.ok(story.writePrompt.trim());
    assert.ok(story.speakPrompt.trim());
    assert.equal(timelines[i].length,5);
    for(const event of timelines[i]){
      for(const key of ['time','subject','action']) assert.ok(event[key].trim());
    }
  }
});

test('new readings include dialogue, tense contrasts and local accessible illustrations',()=>{
  for(const story of stories.slice(25)){
    const text=story.text.join(' ');
    assert.match(text,/\b(have|has)\b/);
    assert.match(text,/\b(Last|Yesterday|yesterday|last)\b/);
    assert.match(text,/'Have you|'Has anyone|'I've/);
    assert.match(text,/'[^']+\?'/);
    assert.ok(text.split(/\s+/).length>=200);
    assert.ok(story.image.alt.length>30);
    assert.ok(story.image.caption.trim());
    assert.match(story.image.src,/^assets\/stories\/[a-z]+\.svg$/);
    const svg=fs.readFileSync(path.join(root,story.image.src),'utf8');
    assert.match(svg,/viewBox="0 0 960 400"/);
    assert.match(svg,/<title/);
    assert.doesNotMatch(svg,/<script|<foreignObject|https?:\/\/(?!www\.w3\.org)/);
  }
});

test('image markup is optional, escaped and cannot initiate a native image drag',()=>{
  const escapeSource=inline.slice(inline.indexOf('function escapeHtml(text){'),inline.indexOf('/* ---------------- state'));
  const imageSource=inline.slice(inline.indexOf('function renderStoryImage(image){'),inline.indexOf('function renderStoryTimeline(events){'));
  const render=vm.runInNewContext(`${escapeSource}\n${imageSource}\nrenderStoryImage`);
  assert.equal(render(undefined),'');
  assert.match(render(stories[25].image),/draggable="false"/);
  assert.match(render(stories[25].image),/width="960" height="400"/);
  assert.doesNotMatch(render({src:'x" onerror="alert(1)',alt:'<unsafe>',caption:'<script>'}),/src="x" onerror=|<unsafe>|<script>/);
});

test('story picker preserves notes, resets to Read, and uses the current story count',()=>{
  assert.match(inline,/READING_CARDS\.map\(\(story,i\)/);
  assert.match(inline,/card\.querySelector\('#storySelect'\)\.onchange = e => \{\s*saveReadingNote\(\);\s*rIdx = Number\(e\.currentTarget\.value\);\s*rStep = 0;\s*renderReading\(\);/);
  assert.match(inline,/renderStoryImage\(q\.image\)/);
});
