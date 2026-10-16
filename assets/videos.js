/* Vídeos recentes: lê assets/videos.json (gerado pela GitHub Action), mostra miniaturas "lite" e só carrega o
   iframe youtube-nocookie depois do clique (nenhum cookie do YouTube antes disso). Falha/JSON vazio -> fallback. */
(function () {
  var box = document.querySelector('[data-yt]'); if (!box) return;
  var list = box.querySelector('.yt-grid'), fb = box.querySelector('.yt-fallback'), ld = box.querySelector('.yt-loading');
  function fail() { if (ld) ld.hidden = true; list.hidden = true; fb.hidden = false; }
  function fmt(s) { var d = new Date(s); return isNaN(d) ? '' : d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }); }
  if (!window.fetch) return fail();
  fetch(box.getAttribute('data-src'), { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
    var v = (j && j.videos) || []; list.innerHTML = '';
    v.slice(0, 6).forEach(function (x) {
      if (!x || !/^[\w-]{11}$/.test(x.id)) return;
      var li = document.createElement('li'); li.className = 'yt-item';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'yt-lite'; b.setAttribute('aria-label', 'Reproduzir vídeo: ' + (x.title || ''));
      var img = document.createElement('img'); img.src = 'https://i.ytimg.com/vi/' + x.id + '/hqdefault.jpg'; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 480; img.height = 360;
      var pl = document.createElement('span'); pl.className = 'yt-play'; pl.setAttribute('aria-hidden', 'true');
      b.appendChild(img); b.appendChild(pl);
      b.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + x.id + '?autoplay=1&rel=0';
        f.title = x.title || 'Vídeo do YouTube';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
        var w = document.createElement('div'); w.className = 'yt-frame'; w.appendChild(f); b.replaceWith(w);
      });
      var t = document.createElement('p'); t.className = 'yt-title'; t.textContent = x.title || '';
      var dt = document.createElement('p'); dt.className = 'yt-date'; dt.textContent = fmt(x.date);
      li.appendChild(b); li.appendChild(t); li.appendChild(dt); list.appendChild(li);
    });
    if (!list.children.length) return fail();
    if (ld) ld.hidden = true; list.hidden = false;
  }).catch(fail);
})();
