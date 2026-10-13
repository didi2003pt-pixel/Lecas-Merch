/* Lecas-Merch V2 — immutable design revisions and standalone editorial HTML.
 * No third-party dependencies; does not modify source artwork files. */
(function (global) {
  'use strict';
  const STORAGE_KEY = 'lecas-merch-editorial-revisions-v1';
  const MAX_REVISIONS = 120;
  const clone = value => JSON.parse(JSON.stringify(value));
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const safeName = value => String(value || 'conceito').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 48) || 'conceito';
  const key = snapshot => `Lecas-Merch_${safeName(snapshot.design.name)}_v${String(snapshot.revision).padStart(2, '0')}.html`;
  const date = value => { try { return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); } catch (_) { return ''; } };

  function all() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value.filter(v => v && typeof v === 'object' && v.sourceDesignId && v.design) : [];
    } catch (_) { return []; }
  }
  function history(id) { return all().filter(s => s.sourceDesignId === id).sort((a, b) => b.revision - a.revision); }
  function latest(id) { return history(id)[0] || null; }
  function write(items) {
    if (items.length > MAX_REVISIONS) throw Error('Limite de revisões locais atingido. Exporta as apresentações anteriores.');
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch (_) { throw Error('Sem espaço disponível para guardar uma revisão. Liberta espaço ou exporta os projetos.'); }
  }
  function saveRevision(design) {
    if (!design || typeof design.id !== 'string' || !design.id) throw Error('Conceito inválido.');
    const items = all();
    const revision = Math.max(0, ...items.filter(s => s.sourceDesignId === design.id).map(s => Number(s.revision) || 0)) + 1;
    const snapshot = {
      presentationId: (global.crypto && crypto.randomUUID) ? crypto.randomUUID() : `pres-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sourceDesignId: design.id,
      revision,
      createdAt: new Date().toISOString(),
      design: clone(design),
      artworkReferences: [...new Set([design.front?.art, design.back?.art].filter(Boolean))],
      presentationStatus: 'draft'
    };
    items.push(snapshot);
    write(items);
    return clone(snapshot);
  }
  // Older V1 designs have no revision yet. Create a baseline only when requested.
  function ensureRevision(design) { return latest(design.id) || saveRevision(design); }

  function imageData(data) {
    if (!/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(data || '')) {
      throw Error('Um recurso gráfico não pôde ser incorporado na apresentação.');
    }
    return data;
  }
  async function imageFromMockup(image) {
    const canvas = document.createElement('canvas');
    canvas.width = 1440;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Canvas não disponível neste navegador.');
    ctx.fillStyle = '#f2f0eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return imageData(canvas.toDataURL('image/png'));
  }
  const CSS = `
:root{color-scheme:light;--ink:#151515;--quiet:#85827f;--line:#dad8d3;--paper:#f8f7f4;--white:#fff}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#e9e8e5;color:var(--ink);font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}
.presentation-controls{position:sticky;top:0;z-index:5;background:rgba(16,16,16,.97);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px clamp(16px,4vw,60px);font-size:12px;letter-spacing:.1em}
.presentation-controls .controls{display:flex;gap:10px}.presentation-controls button,.presentation-controls a{border:1px solid #8b8b8b;padding:10px 15px;background:transparent;color:#fff;text-decoration:none;font:inherit;cursor:pointer}
.presentation-controls button:hover,.presentation-controls a:hover{background:#fff;color:#000}
.sheet{width:min(100%,1188px);height:840px;margin:24px auto;background:var(--paper);padding:52px 62px 40px;display:flex;flex-direction:column;box-shadow:0 10px 35px rgba(0,0,0,.06);overflow:hidden;position:relative}
.sheet.white{background:#fff}.sheet-header,.sheet-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;font-size:10px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;color:#555}
.sheet-header{padding-bottom:14px;border-bottom:1px solid var(--line)}.sheet-footer{margin-top:auto;padding-top:13px;border-top:1px solid var(--line);color:var(--quiet)}
.sheet-content{min-height:0;flex:1;padding:34px 0;display:flex;flex-direction:column}
h1,h2,h3,p{margin:0}h1{font-weight:300;letter-spacing:-.045em;font-size:clamp(52px,7vw,90px);line-height:1.05}h2{font-weight:300;letter-spacing:-.035em;font-size:50px;line-height:1.08}h3{font-weight:400;font-size:20px}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.21em;color:var(--quiet);text-transform:uppercase}
.lede{font-size:15px;line-height:1.7;color:#77716e;max-width:440px}.muted{font-size:12px;line-height:1.65;color:#77716e}.strong{font-weight:700;color:var(--ink)}
.grid{display:grid;gap:30px;min-height:0;flex:1}.cover-grid{grid-template-columns:1.15fr .9fr;align-items:stretch}.cover-copy{display:flex;flex-direction:column;justify-content:space-between;padding:24px 0 18px}.cover-copy .eyebrow{margin-bottom:22px}.cover-copy .lede{margin-top:28px}.cover-visual{background:#edeae5;display:grid;place-items:center;min-width:0;overflow:hidden}.cover-visual img{width:100%;height:100%;object-fit:contain}
.feature-intro{margin-bottom:22px}.feature-intro .eyebrow{margin-bottom:11px}.feature-grid{grid-template-columns:1.05fr .95fr;min-height:0}.photo{background:#edeae5;min-height:0;display:grid;place-items:center;overflow:hidden}.photo img{width:100%;height:100%;object-fit:contain}
.art-column{display:flex;flex-direction:column;min-height:0;gap:13px}.art-column h3{font-size:30px;font-weight:300}.art-frame{border:1px solid #e7e4df;background:#fff;min-height:0;flex:1;display:grid;place-items:center;overflow:hidden}.art-frame img{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}.art-empty{color:#aaa;font-size:13px;text-align:center;padding:22px}
.meta{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:13px;font-size:10px;letter-spacing:.09em;color:#79736f}.specs{display:flex;gap:24px;flex-wrap:wrap;border-top:1px solid var(--line);padding:13px 0;margin-top:17px;font-size:11px;color:#696460}.specs b{color:#242424}
.showcase-title{margin-bottom:25px}.showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;flex:1;min-height:0}.showcase-item{display:flex;flex-direction:column;gap:14px;min-height:0}.showcase-item .photo{flex:1}.showcase-item .eyebrow{color:#292929}
.final-title{margin-top:22px;margin-bottom:22px}.final-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;min-height:0;flex:1}.final-item{display:flex;flex-direction:column;gap:9px;min-height:0}.final-item .art-frame{flex:1}.final-item .eyebrow{color:#333}.final-notice{padding-top:15px;font-size:12px;color:var(--quiet)}
@media(max-width:760px){body{background:var(--paper)}.presentation-controls{padding:10px 14px;letter-spacing:0}.presentation-controls span{max-width:125px;line-height:1.4}.presentation-controls .controls{flex-wrap:wrap;justify-content:flex-end}.presentation-controls button,.presentation-controls a{font-size:11px;padding:8px}.sheet{height:auto;min-height:0;width:100%;padding:24px 18px 20px;margin:0 auto;box-shadow:none;border-bottom:1px solid #dedbd6;overflow:visible}.sheet-content{padding:22px 0}.cover-grid,.feature-grid,.showcase-grid,.final-grid{grid-template-columns:1fr;gap:18px}.cover-copy{min-height:245px;gap:26px}h1{font-size:52px}h2{font-size:39px}.cover-visual{min-height:320px}.photo{height:350px;flex:initial}.art-frame{height:320px;flex:initial}.final-item .art-frame{height:260px}.meta{flex-wrap:wrap}.specs{gap:10px}.showcase-title{margin-bottom:14px}.sheet-header,.sheet-footer{font-size:9px;letter-spacing:.08em}.final-title{margin-top:10px}}
@page{size:A4 landscape;margin:0}
@media print{html,body{width:297mm!important;margin:0!important;background:#fff!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}.presentation-controls{display:none!important}.sheet{width:297mm!important;height:210mm!important;min-height:210mm!important;margin:0!important;padding:12mm 16mm 10mm!important;box-shadow:none!important;border:0!important;break-inside:avoid!important;page-break-inside:avoid!important;break-after:page!important;page-break-after:always!important;overflow:hidden!important}.sheet:last-child{break-after:auto!important;page-break-after:auto!important}.sheet-content{padding:8mm 0!important}.cover-grid,.feature-grid,.showcase-grid,.final-grid{grid-template-columns:1.05fr .95fr!important}.showcase-grid,.final-grid{grid-template-columns:1fr 1fr!important}.cover-copy{min-height:0!important}.cover-visual{min-height:0!important}.photo,.art-frame{height:auto!important;min-height:0!important}.art-frame{flex:1!important}h1{font-size:61pt!important}h2{font-size:38pt!important}.cover-copy .lede{max-width:90mm}.showcase-title{margin-bottom:6mm!important}.sheet-header,.sheet-footer{font-size:8pt!important}}
`;

  async function buildHTML(snapshot, helpers) {
    if (!snapshot || !snapshot.design) throw Error('Não foi encontrada uma revisão válida.');
    const d = clone(snapshot.design);
    if (!helpers || !helpers.renderFace || !helpers.sourceArt || !helpers.getArtwork) throw Error('Renderizador de apresentação indisponível.');
    const faces = await Promise.all(['front','back'].map(async face => imageFromMockup(await helpers.renderFace(d, face))));
    const art = {};
    for (const id of snapshot.artworkReferences || []) {
      const resource = helpers.getArtwork(id);
      if (!resource) throw Error(`A imagem ${id} já não está disponível neste navegador. Reimporta-a para exportar esta revisão.`);
      art[id] = { title: resource.title, data: imageData(await helpers.sourceArt(id)) };
    }
    const title = escapeHTML(d.name), version = `V${String(snapshot.revision).padStart(2, '0')}`;
    const fit = escapeHTML(helpers.fitName(d.fit)), color = escapeHTML(helpers.colorName(d.color));
    const stamp = `${fit} / ${color}`;
    const src = face => art[d[face]?.art] || null;
    const artFrame = face => src(face)
      ? `<img src="${src(face).data}" alt="${escapeHTML(src(face).title)} — imagem original completa">`
      : '<div class="art-empty">Sem estampagem nesta face</div>';
    const sideLabel = face => face === 'front' ? 'FRENTE' : 'COSTAS';
    const info = face => d[face]?.art ? `Escala conceptual ${Math.round(Number(d[face].scale || 1) * 100)}%` : 'Sem estampagem';
    const page = (number, heading, inner, cls = '') => `<section class="sheet ${cls}"><header class="sheet-header"><span>INDEPENDENTE.MENTE / APRESENTAÇÃO VISUAL</span><span>${heading}</span></header><div class="sheet-content">${inner}</div><footer class="sheet-footer"><span>LECAS-MERCH / ${escapeHTML(version)}</span><span>${String(number).padStart(2, '0')} / 05</span></footer></section>`;
    const html = [
      page(1,'CONCEITO / CAPA',`<div class="grid cover-grid"><div class="cover-copy"><div><p class="eyebrow">CREATIVE FASHION STUDIO / ${version}</p><h1>${title}</h1><p class="lede">Apresentação visual de produto. Um estudo de aplicação das artes na peça, mantendo a identidade original.</p></div><div><p class="eyebrow">T-SHIRT / ESTUDO ILUSTRATIVO</p><p class="muted" style="margin-top:12px">${stamp}<br>Revisão ${snapshot.revision} · ${escapeHTML(date(snapshot.createdAt))}</p></div></div><div class="cover-visual"><img src="${faces[0]}" alt="Mockup ilustrativo da frente"></div></div>`),
      page(2,'REFERÊNCIA / FRENTE',`<div class="feature-intro"><p class="eyebrow">01 / PRIMEIRA APLICAÇÃO</p><h2>Frente.</h2></div><div class="grid feature-grid"><div class="photo"><img src="${faces[0]}" alt="T-shirt vista de frente"></div><div class="art-column"><p class="eyebrow">ARTE ORIGINAL / ${sideLabel('front')}</p><div class="art-frame">${artFrame('front')}</div><div class="meta"><span>${escapeHTML(src('front')?.title || 'SEM ESTAMPAGEM')}</span><span>${info('front')}</span></div></div></div>`,'white'),
      page(3,'REFERÊNCIA / COSTAS',`<div class="feature-intro"><p class="eyebrow">02 / SEGUNDA APLICAÇÃO</p><h2>Costas.</h2></div><div class="grid feature-grid"><div class="art-column"><p class="eyebrow">ARTE ORIGINAL / ${sideLabel('back')}</p><div class="art-frame">${artFrame('back')}</div><div class="meta"><span>${escapeHTML(src('back')?.title || 'SEM ESTAMPAGEM')}</span><span>${info('back')}</span></div></div><div class="photo"><img src="${faces[1]}" alt="T-shirt vista de costas"></div></div>`,'white'),
      page(4,'VISUALIZAÇÃO DE PRODUTO',`<div class="showcase-title"><p class="eyebrow">03 / PRODUCT SHOWCASE</p><h2>Visualização de produto.</h2><p class="muted" style="margin-top:12px">Simulações independentes, com escalas visuais equivalentes.</p></div><div class="showcase-grid"><div class="showcase-item"><div class="photo"><img src="${faces[0]}" alt="Vista frontal"></div><p class="eyebrow">FRENTE</p></div><div class="showcase-item"><div class="photo"><img src="${faces[1]}" alt="Vista traseira"></div><p class="eyebrow">COSTAS</p></div></div>`,'white'),
      page(5,'APRESENTAÇÃO FINAL',`<div class="final-title"><p class="eyebrow">04 / REVISÃO ${snapshot.revision}</p><h2>As artes originais.</h2><p class="muted" style="margin-top:10px">${title} · ${stamp}</p></div><div class="final-grid"><div class="final-item"><div class="art-frame">${artFrame('front')}</div><p class="eyebrow">01 / FRENTE</p></div><div class="final-item"><div class="art-frame">${artFrame('back')}</div><p class="eyebrow">02 / COSTAS</p></div></div><p class="final-notice">Estudo visual ilustrativo. Áreas de estampagem, materiais e resolução de impressão a confirmar com o fornecedor.</p>`)
    ].join('\n');
    return `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${title} — Lecas-Merch ${escapeHTML(version)}</title><style>${CSS}</style></head><body><div class="presentation-controls"><span>INDEPENDENTE.MENTE / ${escapeHTML(version)}</span><div class="controls"><a href="#apresentacao">Ver apresentação</a><button type="button" onclick="window.print()">Imprimir / Guardar PDF</button></div></div><main id="apresentacao">${html}</main></body></html>`;
  }


  function openUi(project, helpers) {
    if (!project || !project.id) throw Error('Não foi selecionado um conceito válido.');
    ensureRevision(project);
    const versions = history(project.id);
    const canShareFiles = typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof File === 'function';
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', 'Apresentação editorial do conceito');
    dialog.style.cssText = 'width:min(570px,calc(100vw - 28px));max-height:90vh;overflow:auto;padding:0;border:1px solid #dedbd4;box-shadow:0 20px 70px #0004;color:#1b1b1b;background:#fbfaf7;font:14px Arial,Helvetica,sans-serif';
    const versionOptions = versions.map(v => '<option value="' + v.revision + '">Versão ' + String(v.revision).padStart(2,'0') + ' · ' + escapeHTML(date(v.createdAt)) + '</option>').join('');
    dialog.innerHTML =
      '<div style="padding:25px 26px;border-bottom:1px solid #e2dfd8">' +
        '<div style="font-size:10px;letter-spacing:.21em;color:#85827f;margin-bottom:12px">INDEPENDENTE.MENTE / LOOKBOOK</div>' +
        '<h2 style="font-size:29px;font-weight:400;margin:0 0 10px">' + escapeHTML(project.name) + '</h2>' +
        '<p style="line-height:1.65;color:#777;margin:0">Gera uma apresentação editorial autónoma de cinco páginas, preservando cada revisão guardada.</p></div>' +
      '<div style="padding:24px 26px"><label for="lecas-presentation-version" style="display:block;font-size:11px;font-weight:bold;letter-spacing:.14em;margin-bottom:9px">VERSÃO A APRESENTAR</label>' +
      '<select id="lecas-presentation-version" style="width:100%;padding:12px;background:#fff;border:1px solid #aaa;margin-bottom:18px;font:inherit">' + versionOptions + '</select>' +
      '<p id="lecas-presentation-status" role="status" aria-live="polite" style="min-height:38px;line-height:1.6;color:#79736f">HTML independente, sem necessidade de ligação à Internet. O PDF utiliza a impressão do navegador.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px">' +
      '<button data-pres="view" style="padding:12px 16px;background:#131313;color:#fff;border:1px solid #131313;cursor:pointer">Ver apresentação</button>' +
      '<button data-pres="download" style="padding:12px 16px;background:#fff;color:#111;border:1px solid #aaa;cursor:pointer">Descarregar HTML</button>' +
      '${canShareFiles ? '<button data-pres="share" disabled style="padding:12px 16px;background:#fff;color:#111;border:1px solid #aaa;cursor:pointer">Partilhar HTML</button>' : ''}<button data-pres="print" style="padding:12px 16px;background:#fff;color:#111;border:1px solid #aaa;cursor:pointer">Guardar PDF</button>' +
      '<button data-pres="close" style="padding:12px 16px;background:none;color:#666;border:1px solid #ccc;cursor:pointer">Fechar</button></div></div>';
    document.body.append(dialog);
    dialog.addEventListener('close', () => dialog.remove(), { once:true });
    dialog.showModal();
    // Build the HTML before the tap: native share requires a synchronous user gesture.
    let preparedShare = null, preparationId = 0;
    async function prepareShare() {
      if (!canShareFiles) return;
      const token = ++preparationId;
      preparedShare = null;
      const shareButton = dialog.querySelector('[data-pres="share"]');
      const status = dialog.querySelector('#lecas-presentation-status');
      shareButton.disabled = true;
      status.textContent = 'A preparar o ficheiro para partilha…';
      const selected = Number(dialog.querySelector('#lecas-presentation-version').value);
      const snapshot = versions.find(v => v.revision === selected);
      try {
        const html = await buildHTML(snapshot, helpers);
        const file = new File([html], key(snapshot), { type: 'text/html' });
        if (token !== preparationId || !dialog.isConnected) return;
        if (navigator.canShare && !navigator.canShare({ files: [file] })) {
          status.textContent = 'Este navegador não permite partilhar ficheiros HTML. Usa «Descarregar HTML».';
          return;
        }
        preparedShare = { revision: selected, file };
        shareButton.disabled = false;
        status.textContent = 'Apresentação preparada. Podes partilhar o HTML ou descarregá-lo.';
      } catch (e) {
        if (token === preparationId && dialog.isConnected) status.textContent = 'Partilha indisponível: ' + e.message;
      }
    }
    dialog.querySelector('#lecas-presentation-version').addEventListener('change', () => { void prepareShare(); });
    void prepareShare();
    dialog.addEventListener('click', async event => {
      const button = event.target.closest('[data-pres]');
      if (!button) return;
      const mode = button.dataset.pres;
      if (mode === 'close') { dialog.close(); return; }
      const snapshot = versions.find(v => v.revision === Number(dialog.querySelector('#lecas-presentation-version').value));
      const status = dialog.querySelector('#lecas-presentation-status');
      if (mode === 'share') {
        if (!preparedShare || preparedShare.revision !== snapshot?.revision) {
          status.textContent = 'Aguarda a preparação da apresentação antes de partilhar.';
          return;
        }
        try {
          // No await before navigator.share: iOS requires a direct user gesture.
          await navigator.share({ files: [preparedShare.file], title: snapshot.design.name });
          status.textContent = 'A apresentação foi entregue ao sistema de partilha.';
        } catch (e) {
          if (e.name !== 'AbortError') status.textContent = 'A partilha não foi concluída: ' + e.message + '. Podes descarregar o HTML.';
        }
        return;
      }
      const popup = mode === 'download' ? null : window.open('', '_blank');
      if (mode !== 'download' && !popup) { status.textContent = 'Permite janelas pop-up neste navegador para visualizar a apresentação.'; return; }
      if (popup) { popup.document.write('<!doctype html><title>A preparar…</title><p style="font:16px Arial;margin:30px">A preparar apresentação editorial…</p>'); popup.document.close(); }
      status.textContent = 'A preparar a apresentação…';
      try {
        const html = await buildHTML(snapshot, helpers);
        if (mode === 'download') {
          const blob = new Blob([html], { type:'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = key(snapshot); document.body.append(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 3000);
          status.textContent = 'HTML descarregado. Pode abrir o ficheiro noutro dispositivo.';
        } else {
          popup.document.open(); popup.document.write(html); popup.document.close();
          if (mode === 'print') setTimeout(() => { try { popup.focus(); popup.print(); } catch (e) { console.warn(e); } }, 700);
          status.textContent = mode === 'print' ? 'Abriu a apresentação para imprimir ou guardar como PDF.' : 'Apresentação aberta numa nova janela.';
        }
      } catch (e) {
        if (popup && !popup.closed) popup.close();
        status.textContent = 'Não foi possível gerar o documento: ' + e.message;
      }
    });
  }
  global.LecasEditorial = Object.freeze({ history, latest, saveRevision, ensureRevision, buildHTML, fileName: key, openUi });
})(window);