/* iyan-nekib — the command bar.
   The boot gate lives inline in index.html so it cannot be stranded
   by a failed request for this file. Everything here is progressive
   enhancement: with JS off the prompt is hidden and the nav/social
   rows are plain links. */

(function () {
  'use strict';

  var out, cmd, hint;

  /* each command's echo and output share one .entry, so consecutive
     commands stay visually separate instead of running together */
  var current = null;

  function newEntry() {
    current = document.createElement('div');
    current.className = 'entry';
    out.appendChild(current);
  }

  function go(href) { window.location.href = href; }
  function openTab(href) { window.open(href, '_blank', 'noopener'); }

  function reboot() {
    try { sessionStorage.removeItem('ink.booted'); } catch (e) { /* non-fatal */ }
    window.location.reload();
  }

  /* one property per command — /help reads this, so it can never
     fall out of sync, and adding a command is a single line */
  var CMDS = {
    home:     { d: 'Start here',                  run: function () { go('./'); } },
    about:    { d: 'Background and skills',       run: function () { go('about.html'); } },
    projects: { d: 'What I have built',           run: function () { go('projects.html'); } },
    resume:   { d: 'Download the PDF',            run: function () { go('resume.html'); } },
    github:   { d: 'github.com/IyanekiB',         run: function () { openTab('https://github.com/IyanekiB'); } },
    linkedin: { d: 'in/iyan-nekib',               run: function () { openTab('https://www.linkedin.com/in/iyan-nekib/'); } },
    help:     { d: 'List every command',          run: printHelp },
    clear:    { d: 'Clear the output',            run: function () { out.replaceChildren(); current = null; } },
    reboot:   { d: 'Replay the opening sequence', run: reboot }
  };

  var NAMES = Object.keys(CMDS);

  /* textContent only — never innerHTML, so typed input can never
     introduce markup */
  function print(text, cls) {
    var el = document.createElement('div');
    el.className = cls || 'line-out';
    el.textContent = text;
    (current || out).appendChild(el);
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

    newEntry();
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

  /* Character displacement on hover, in the style of patrickheng.com.
     Decorative, so it is off for touch and for reduced-motion. For SVG
     <use> elements a CSS translate of 1px equals one user unit, which
     is why both paths share the same unit string. */
  function initJitter() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* split marked labels into per-character spans once; spaces stay
       bare text nodes so inline-block cannot collapse them */
    [].forEach.call(document.querySelectorAll('.jt'), function (el) {
      var frag = document.createDocumentFragment();
      el.textContent.split('').forEach(function (ch) {
        if (ch === ' ') { frag.appendChild(document.createTextNode(ch)); return; }
        var s = document.createElement('span');
        s.className = 'jc';
        s.textContent = ch;
        frag.appendChild(s);
      });
      el.replaceChildren(frag);
    });

    function wire(host, parts, amp) {
      var timer = null;
      function set(p, x, y) {
        p.style.setProperty('--jx', x + 'px');
        p.style.setProperty('--jy', y + 'px');
      }
      function tick() {
        [].forEach.call(parts, function (p) {
          set(p, ((Math.random() - 0.5) * 2 * amp).toFixed(2),
                 ((Math.random() - 0.5) * 2 * amp).toFixed(2));
        });
      }
      function stop() {
        clearInterval(timer);
        timer = null;
        [].forEach.call(parts, function (p) { set(p, 0, 0); });
      }
      host.addEventListener('pointerenter', function () {
        if (timer) return;
        tick();
        timer = setInterval(tick, 90);
      });
      host.addEventListener('pointerleave', stop);
    }

    [].forEach.call(document.querySelectorAll('.jitter'), function (el) {
      wire(el, el.querySelectorAll('.jl'), 0.5);
    });
    [].forEach.call(document.querySelectorAll('.jt'), function (el) {
      wire(el, el.querySelectorAll('.jc'), 1.2);
    });
  }

  /* Proximity highlight: each word brightens by how near the pointer
     is. The page carries ~500 words, so the per-frame pass culls by
     container bounding box first and only measures words that could
     possibly be lit. Positions are cached in DOCUMENT space, which
     means scrolling needs no re-measure at all. */
  function initProx() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var PROSE = '.bio p, .item-note, .item-list li, .item-title, .item-role, .tags';
    var R = 150;
    var boxes = [];

    /* split text nodes in place so <strong> and .hl survive; their own
       text is left alone, since .pw would otherwise override the
       emphasis colour they exist to apply */
    function split(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);

      nodes.forEach(function (tn) {
        if (!tn.nodeValue.trim()) return;
        if (tn.parentNode.closest('.hl, strong')) return;

        var frag = document.createDocumentFragment();
        tn.nodeValue.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (!tok.trim()) { frag.appendChild(document.createTextNode(tok)); return; }
          var w = document.createElement('span');
          w.className = 'pw';
          w.textContent = tok;
          frag.appendChild(w);
        });
        tn.parentNode.replaceChild(frag, tn);
      });
    }

    [].forEach.call(document.querySelectorAll(PROSE), split);

    function measure() {
      var sx = window.scrollX, sy = window.scrollY;
      boxes = [].map.call(document.querySelectorAll(PROSE), function (el) {
        var r = el.getBoundingClientRect();
        return {
          l: r.left + sx, t: r.top + sy, r: r.right + sx, b: r.bottom + sy,
          lit: false,
          words: [].map.call(el.querySelectorAll('.pw'), function (w) {
            var q = w.getBoundingClientRect();
            return { el: w, x: q.left + q.width / 2 + sx, y: q.top + q.height / 2 + sy, p: 0 };
          })
        };
      });
    }

    var queued = false, px = -9999, py = -9999;

    function paint() {
      queued = false;
      var x = px + window.scrollX, y = py + window.scrollY;

      for (var i = 0; i < boxes.length; i++) {
        var b = boxes[i];
        var dx = x < b.l ? b.l - x : (x > b.r ? x - b.r : 0);
        var dy = y < b.t ? b.t - y : (y > b.b ? y - b.b : 0);

        if (dx > R || dy > R) {
          if (b.lit) {
            for (var k = 0; k < b.words.length; k++) {
              if (b.words[k].p) { b.words[k].p = 0; b.words[k].el.style.setProperty('--p', '0'); }
            }
            b.lit = false;
          }
          continue;
        }

        b.lit = true;
        for (var j = 0; j < b.words.length; j++) {
          var w = b.words[j];
          var ex = w.x - x, ey = w.y - y;
          var d = Math.sqrt(ex * ex + ey * ey);
          /* 1 - (d/R)^2 holds near full strength through the middle
             of the pool and softens only at its edge. The previous
             (1 - d/R)^1.5 fell away immediately from the centre, which
             is why the effect read as barely there. */
          var t = d / R;
          var v = d >= R ? 0 : Math.round((1 - t * t) * 100) / 100;
          if (v !== w.p) { w.p = v; w.el.style.setProperty('--p', v); }
        }
      }
    }

    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    }

    window.addEventListener('pointermove', function (e) {
      px = e.clientX; py = e.clientY;
      schedule();
    }, { passive: true });

    /* the pointer holds still while the page moves under it. Two
       settle passes: the first catches the new scroll position, the
       second runs after any section reveal has finished moving its
       own content, which would otherwise leave cached word centres
       off by the reveal's own translate. */
    var settle = null, settleLate = null;
    window.addEventListener('scroll', function () {
      schedule();
      clearTimeout(settle);
      clearTimeout(settleLate);
      settle = setTimeout(function () { measure(); schedule(); }, 200);
      settleLate = setTimeout(function () { measure(); schedule(); }, 2600);
    }, { passive: true });

    window.addEventListener('resize', function () { measure(); schedule(); });

    measure();
    if (document.fonts) document.fonts.ready.then(function () { measure(); schedule(); });
  }

  function init() {
    initJitter();
    initProx();

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
        if (m.hits.length > 1) {
          newEntry();
          print(m.hits.map(function (n) { return '/' + n; }).join('   '));
        }
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
