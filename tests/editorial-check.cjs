/* Smoke tests for Lecas-Merch editorial engine; Node built-ins only. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const storage = new Map();
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aOcAAAAASUVORK5CYII=';
const context = { localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v) },
  document: { createElement: () => ({getContext: () => ({fillRect(){},drawImage(){}}),toDataURL: () => png}) },
  Date, Intl, Math, JSON, Number, Error, console };
context.window = context;
vm.runInNewContext(fs.readFileSync('js/presentation/editorial.js','utf8'), context);
const engine = context.LecasEditorial;
const base={id:'ci-1',name:'Conceito <teste>',fit:'oversized',color:'white',
front:{art:'art1',x:0.5,y:0.51,scale:1},back:{art:'art2',x:0.5,y:0.51,scale:1}};
const one=engine.saveRevision(base);
base.front.art='art2';
const two=engine.saveRevision(base);
assert.equal(one.revision,1);
assert.equal(two.revision,2);
assert.equal(one.design.front.art,'art1');
assert.equal(engine.history('ci-1').length,2);
const artId = id => 'data:image/jpeg;base64,'+fs.readFileSync('assets/artwork/'+(id==='art1'?'arte-01-original.jpeg':'arte-02-original.jpeg')).toString('base64');
const helpers={renderFace:async()=>({}),sourceArt:async id=>artId(id),getArtwork:id=>({title:id}),fitName:()=> 'Oversized',colorName:()=> 'Branco'};
(async()=>{
const html=await engine.buildHTML(one,helpers);
assert.equal((html.match(/<section class="sheet /g)||[]).length,5);
assert(html.includes('data:image/jpeg;base64,') && html.includes('data:image/png;base64,'));
assert(!html.includes('<teste>') && html.includes('&lt;teste&gt;'));
assert(!html.includes('src="https://'));
assert(html.includes('@page{size:A4 landscape;margin:0}'));
assert.equal(html,await engine.buildHTML(engine.history('ci-1').find(x=>x.revision===1),helpers));
assert.notEqual(html,await engine.buildHTML(two,helpers));
console.log('OK: 5 sections, images embedded, escaped input, immutable revisions, A4 print CSS');
})().catch(e=>{console.error(e);process.exit(1)});
