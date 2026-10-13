/* Verifica partilha nativa da apresentação sem perder a ativação do clique. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const storage = new Map();
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aOcAAAAASUVORK5CYII=';
const elements = {
  '[data-pres="share"]': { disabled: true },
  '#lecas-presentation-status': { textContent: '' },
  '#lecas-presentation-version': { value: '1', addEventListener(type, fn) { this.onchange = fn; } }
};
const dialog = {
  isConnected: false, style: {}, innerHTML: '',
  setAttribute() {}, addEventListener(type, fn) { this['on' + type] = fn; },
  querySelector(selector) { return elements[selector]; },
  showModal() {}, close() { this.isConnected = false; }, remove() {}
};
const document = {
  createElement(tag) {
    if (tag === 'dialog') return dialog;
    if (tag === 'canvas') return { getContext: () => ({ fillRect() {}, drawImage() {} }), toDataURL: () => png };
    throw Error('Elemento inesperado: ' + tag);
  },
  body: { append(node) { node.isConnected = true; } }
};
let activeClick = false, lastShare = null;
const navigator = {
  canShare: ({ files }) => files.length === 1 && files[0].type === 'text/html',
  share(args) {
    assert(activeClick, 'navigator.share foi chamado fora do evento de clique');
    lastShare = args;
    return Promise.resolve();
  }
};
const context = {
  window: null, document, navigator, File, Date, Intl, Math, JSON, Number, Error, console,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) }
};
context.window = context;
vm.runInNewContext(fs.readFileSync('js/presentation/editorial.js', 'utf8'), context);
const editorial = context.LecasEditorial;
const design = { id: 'share-test', name: 'Conceito partilhável', fit: 'oversized', color: 'white',
  front: { art: 'art1', x: .5, y: .5, scale: 1 }, back: { art: 'art2', x: .5, y: .5, scale: 1 } };
const helpers = {
  renderFace: async () => ({}),
  sourceArt: async id => 'data:image/jpeg;base64,' + fs.readFileSync('assets/artwork/' +
    (id === 'art1' ? 'arte-01-original.jpeg' : 'arte-02-original.jpeg')).toString('base64'),
  getArtwork: id => ({ title: id }), fitName: () => 'Oversized', colorName: () => 'Branco'
};
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(done => setImmediate(done)); };
async function tapShare() {
  activeClick = true;
  const pending = dialog.onclick({ target: { closest: () => ({ dataset: { pres: 'share' } }) } });
  activeClick = false;
  await pending;
}
(async () => {
  editorial.saveRevision(design);
  editorial.openUi(design, helpers);
  assert(dialog.innerHTML.includes('data-pres="share"'));
  await settle();
  assert.equal(elements['[data-pres="share"]'].disabled, false);
  await tapShare();
  assert(lastShare && lastShare.files.length === 1);
  assert(lastShare.files[0].name.endsWith('.html'));
  let html = await lastShare.files[0].text();
  assert.equal((html.match(/<section class="sheet /g) || []).length, 5);
  assert(html.includes('data:image/jpeg;base64'));
  design.front.art = 'art2';
  editorial.saveRevision(design);
  dialog.isConnected = false;
  editorial.openUi(design, helpers);
  elements['#lecas-presentation-version'].value = '2';
  elements['#lecas-presentation-version'].onchange();
  await settle();
  lastShare = null;
  await tapShare();
  assert(lastShare);
  html = await lastShare.files[0].text();
  assert.equal((html.match(/<section class="sheet /g) || []).length, 5);
  console.log('OK: partilha nativa por clique com HTML autónomo e revisão correta');
})().catch(err => { console.error(err); process.exitCode = 1; });
