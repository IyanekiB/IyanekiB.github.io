/* iyan-nekib — the command bar.
   The boot gate lives inline in index.html so it cannot be stranded
   by a failed request for this file. Everything here is progressive
   enhancement: with JS off the prompt is hidden and the nav/social
   rows are plain links. */

(function () {
  'use strict';

  var out, cmd, hint;

  function go(href) { window.location.href = href; }
  function openTab(href) { window.open(href, '_blank', 'noopener'); }

  function reboot() {
    try { sessionStorage.removeItem('ink.booted'); } catch (e) { /* non-fatal */ }
    window.location.reload();
  }

  /* one property per command — /help reads this, so it can never
     fall out of sync, and adding a command is a single line */
  var CMDS = {
    home:     { d: 'Start here',                  run: function () { go('index.html'); } },
    about:    { d: 'Background and skills',       run: function () { go('about.html'); } },
    projects: { d: 'What I have built',           run: function () { go('projects.html'); } },
    resume:   { d: 'Download the PDF',            run: function () { go('resume.html'); } },
    github:   { d: 'github.com/IyanekiB',         run: function () { openTab('https://github.com/IyanekiB'); } },
    linkedin: { d: 'in/iyan-nekib',               run: function () { openTab('https://www.linkedin.com/in/iyan-nekib/'); } },
    help:     { d: 'List every command',          run: printHelp },
    clear:    { d: 'Clear the output',            run: function () { out.replaceChildren(); } },
    reboot:   { d: 'Replay the opening sequence', run: reboot }
  };

  var NAMES = Object.keys(CMDS);

  /* textContent only — never innerHTML, so typed input can never
     introduce markup */
  function print(text, cls) {
    var el = document.createElement('div');
    el.className = cls || 'line-out';
    el.textContent = text;
    out.appendChild(el);
  }

  function printHelp() {
    print('Commands:');
    NAMES.forEach(function (n) {
      print('  /' + n + ' '.repeat(Math.max(1, 12 - n.length)) + CMDS[n].d);
    });
  }

  function normalise(raw) {
    return raw.trim().replace(/^\/+/, '').toLowerCase();
  }

  function submit(raw) {
    var name = normalise(raw);
    if (!name) return;

    print('> ' + raw.trim(), 'line-echo');

    if (Object.prototype.hasOwnProperty.call(CMDS, name)) {
      CMDS[name].run();
    } else {
      print('Unknown command: ' + name, 'line-err');
      print('Type /help to list what is available.');
    }
  }

  /* longest common prefix of the matching command names */
  function complete(value) {
    var frag = normalise(value);
    var hits = NAMES.filter(function (n) { return n.indexOf(frag) === 0; });
    if (!hits.length) return null;

    var shared = hits.reduce(function (a, b) {
      var i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return a.slice(0, i);
    });

    return { hits: hits, shared: shared };
  }

  function size() {
    cmd.style.width = cmd.value.length + 'ch';
    hint.hidden = cmd.value.length > 0;
  }

  function init() {
    var form = document.getElementById('prompt');
    out = document.getElementById('out');
    cmd = document.getElementById('cmd');
    hint = document.getElementById('hint');
    if (!form || !cmd) return;

    var history = [];
    var cursor = 0;

    size();
    cmd.addEventListener('input', size);

    form.addEventListener('click', function (e) {
      if (e.target.tagName !== 'INPUT') cmd.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = cmd.value;
      if (!raw.trim()) return;
      history.push(raw);
      cursor = history.length;
      cmd.value = '';
      size();
      submit(raw);
    });

    cmd.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var m = complete(cmd.value);
        if (!m) return;
        cmd.value = '/' + m.shared;
        size();
        if (m.hits.length > 1) print(m.hits.map(function (n) { return '/' + n; }).join('   '));
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (!history.length) return;
        e.preventDefault();
        cursor += (e.key === 'ArrowUp' ? -1 : 1);
        cursor = Math.max(0, Math.min(history.length, cursor));
        cmd.value = history[cursor] || '';
        size();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
