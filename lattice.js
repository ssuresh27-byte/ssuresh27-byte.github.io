// Interactive quantum surface-code lattice — site-wide fixed background.
(function () {
  function init() {
    var c = document.querySelector('.lattice');
    if (!c || !c.getContext) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = c.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var GAP = 46, R = 160, cols = 0, rows = 0, nodes = [], mx = -9999, my = -9999, on = false;
    var base = [135, 134, 127], hot = [209, 68, 36];

    function parse(s) {
      s = (s || '').trim();
      if (s[0] === '#') { var h = s.slice(1); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
      var m = s.match(/\d+/g); return m ? [+m[0], +m[1], +m[2]] : [135, 134, 127];
    }
    function theme() {
      var cs = getComputedStyle(document.documentElement);
      base = parse(cs.getPropertyValue('--text-3'));
      hot = parse(cs.getPropertyValue('--accent'));
    }
    function mix(a, b, t) { return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
    function rgba(col, al) { return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + al + ')'; }
    function build() {
      var w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
      c.width = Math.round(w * DPR); c.height = Math.round(h * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cols = Math.ceil(w / GAP) + 2; rows = Math.ceil(h / GAP) + 2; nodes = new Array(cols * rows);
      for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) nodes[i * rows + j] = { x: i * GAP, y: j * GAP, g: 0 };
    }
    function edge(a, b) { var g = Math.max(a.g, b.g); var col = mix(base, hot, g); ctx.strokeStyle = rgba(col, 0.05 + g * 0.33); ctx.lineWidth = 0.7 + g * 0.7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    function nodesEdges(withGlow) {
      for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) { var a = nodes[i * rows + j]; if (i + 1 < cols) edge(a, nodes[(i + 1) * rows + j]); if (j + 1 < rows) edge(a, nodes[i * rows + (j + 1)]); }
      for (var k = 0; k < nodes.length; k++) { var n = nodes[k], g = withGlow ? n.g : 0, col = g > 0.002 ? mix(base, hot, g) : base; ctx.fillStyle = rgba(col, 0.17 + g * 0.6); ctx.beginPath(); ctx.arc(n.x, n.y, 1.2 + g * 2.4, 0, 6.2832); ctx.fill(); }
    }
    function draw() {
      var w = c.clientWidth, h = c.clientHeight; ctx.clearRect(0, 0, w, h);
      for (var k = 0; k < nodes.length; k++) { var n = nodes[k], tg = 0; if (on) { var dx = n.x - mx, dy = n.y - my, d2 = dx * dx + dy * dy; if (d2 < R * R) tg = 1 - Math.sqrt(d2) / R; } n.g += (tg - n.g) * 0.14; }
      nodesEdges(true);
      requestAnimationFrame(draw);
    }
    function staticDraw() { ctx.clearRect(0, 0, c.clientWidth, c.clientHeight); nodesEdges(false); }
    function move(e) { mx = e.clientX; my = e.clientY; on = true; }

    theme(); build();
    if (reduce) { staticDraw(); window.addEventListener('resize', function () { build(); staticDraw(); }); return; }
    draw();
    window.addEventListener('resize', build);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('blur', function () { on = false; });
    if (window.MutationObserver) new MutationObserver(theme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
