/* Kingdomapps — comportamento único da base institucional (idêntico nas 3 skins) */
(function () {
  var doc = document, body = doc.body;
  // menu mobile
  var toggle = doc.querySelector('.nav-toggle'), nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      body.classList.toggle('nav-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); body.classList.remove('nav-open'); }
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) { toggle.setAttribute('aria-expanded', 'false'); body.classList.remove('nav-open'); toggle.focus(); }
    });
  }
  // cabeçalho compacto + botão flutuante do WhatsApp após o hero
  var hero = doc.getElementById('topo');
  function onScroll() {
    var y = window.scrollY || 0;
    body.classList.toggle('scrolled', y > 24);
    var past = hero ? y > hero.offsetHeight * 0.6 : y > 400;
    body.classList.toggle('show-float', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // abas do cardápio (ARIA tabs)
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('.menu-tabs [role="tab"]'));
  function select(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var p = doc.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });
  // selo "Aberto agora" — só com horário confirmado (fuso de São Paulo)
  try {
    var hours = JSON.parse(body.getAttribute('data-hours') || '{}');
    var unknown = JSON.parse(body.getAttribute('data-hours-unknown') || '[]');
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
    var day = String(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday));
    var h = (parseInt(map.hour, 10) % 24) + parseInt(map.minute, 10) / 60;
    if (unknown.indexOf(day) === -1) {
      var open = (hours[day] || []).some(function (r) { return h >= r[0] && h < r[1]; });
      if (open) doc.querySelectorAll('[data-open-badge]').forEach(function (el) { el.textContent = 'Aberto agora'; el.hidden = false; });
    }
  } catch (e) {}
})();
