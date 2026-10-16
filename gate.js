(function () {
  var PIN = '4272';
  var KEY = 'kingdomapps_casaleao_gate';

  var lockEl = document.getElementById('lock');
  var galleryEl = document.getElementById('gallery');
  var form = document.getElementById('pin-form');
  var input = document.getElementById('pin-input');
  var err = document.getElementById('pin-err');
  var cardsRoot = document.getElementById('cards');
  var logoutBtn = document.getElementById('logout');

  // Version paths/names exist ONLY in this script — not in locked DOM
  var VERSIONS = [
    {
      id: 'v1',
      path: 'v1/',
      title: 'Versão 1 — E05 Balcão em blocos',
      blurb: "Grelha em blocos de cor e fotografia, do início ao rodapé."
    },
    {
      id: 'v2',
      path: 'v2/',
      title: 'Versão 2 — E09 Pôster suíço',
      blurb: "Cartaz em grelha suíça: títulos fortes, numeração e muito espaço em branco."
    }
  ];

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function setUnlocked(on) {
    try {
      if (on) sessionStorage.setItem(KEY, '1');
      else sessionStorage.removeItem(KEY);
    } catch (e) {}
  }

  function renderCards() {
    cardsRoot.innerHTML = '';
    VERSIONS.forEach(function (v) {
      var card = document.createElement('article');
      card.className = 'card';

      var preview = document.createElement('div');
      preview.className = 'card-preview';
      var iframe = document.createElement('iframe');
      iframe.src = v.path;
      iframe.title = 'Pré-visualização: ' + v.title;
      iframe.loading = 'lazy';
      iframe.setAttribute('tabindex', '-1');
      preview.appendChild(iframe);

      var body = document.createElement('div');
      body.className = 'card-body';
      body.innerHTML =
        '<h2></h2><p></p><div class="card-actions"></div>';
      body.querySelector('h2').textContent = v.title;
      body.querySelector('p').textContent = v.blurb;
      var actions = body.querySelector('.card-actions');
      var open = document.createElement('a');
      open.className = 'open';
      open.href = v.path;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Abrir num novo separador';
      actions.appendChild(open);

      card.appendChild(preview);
      card.appendChild(body);
      cardsRoot.appendChild(card);
    });
  }

  function showGallery() {
    lockEl.classList.add('hidden');
    galleryEl.classList.remove('hidden');
    renderCards();
  }

  function showLock() {
    galleryEl.classList.add('hidden');
    lockEl.classList.remove('hidden');
    cardsRoot.innerHTML = '';
    if (input) input.value = '';
    if (err) err.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').replace(/\D/g, '');
      if (val === PIN) {
        setUnlocked(true);
        err.textContent = '';
        showGallery();
      } else {
        err.textContent = 'Código incorreto. Tente novamente.';
        input.focus();
        input.select();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      setUnlocked(false);
      showLock();
    });
  }

  if (unlocked()) showGallery();
  else showLock();
})();
