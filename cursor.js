// Custom cursor: exact-tracking dot + trailing ring that grows over clickable things.
(function () {
  var mq = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq || !mq.matches) return;
  function init() {
    var root = document.documentElement, body = document.body;
    var dot = document.createElement('div'); dot.className = 'cursor-dot'; dot.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.setAttribute('aria-hidden', 'true');
    body.appendChild(dot); body.appendChild(ring);
    root.classList.add('has-cursor', 'cursor-hide');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0, seen = false;
    var HIT = 'a,button,summary,input,textarea,select,label,[role=button]';
    function loop() {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) raf = requestAnimationFrame(loop); else raf = 0;
    }
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!seen) { seen = true; ring.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; root.classList.remove('cursor-hide'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    window.addEventListener('mouseover', function (e) { root.classList.toggle('cursor-hover', !!(e.target.closest && e.target.closest(HIT))); });
    window.addEventListener('mousedown', function () { root.classList.add('cursor-down'); });
    window.addEventListener('mouseup', function () { root.classList.remove('cursor-down'); });
    document.addEventListener('mouseleave', function () { root.classList.add('cursor-hide'); });
    document.addEventListener('mouseenter', function () { root.classList.remove('cursor-hide'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
