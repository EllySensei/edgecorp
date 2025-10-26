document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const header = document.querySelector('.top-bar');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const offset = 8; // extra spacing if you want some gap
      const top = window.pageYOffset + target.getBoundingClientRect().top - headerHeight - offset;

      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
    });
  });

  // Add mouse wheel/trackpad snapping behavior between main sections
  const sections = Array.from(document.querySelectorAll('.first-page, .about-us'));
  let isAutoScrolling = false;
  let wheelLockTimer = null;
  const lockDuration = 800; // ms - prevents multiple triggers while animating

  function scrollToSection(targetEl) {
    if (!targetEl) return;
    const header = document.querySelector('.top-bar');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const offset = 8;
    const top = targetEl === document.querySelector('.first-page')
      ? 0
      : targetEl.offsetTop - headerHeight - offset;

    isAutoScrolling = true;
    window.scrollTo({ top, behavior: 'smooth' });

    clearTimeout(wheelLockTimer);
    wheelLockTimer = setTimeout(() => {
      isAutoScrolling = false;
    }, lockDuration);
  }

  function getCurrentSectionIndex() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    let idx = 0;
    let minDist = Infinity;
    sections.forEach((s, i) => {
      const dist = Math.abs(s.offsetTop - scrollY);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    });
    return idx;
  }

  window.addEventListener('wheel', (e) => {
    // only intercept if vertical scroll is significant and not currently auto scrolling
    if (isAutoScrolling) {
      e.preventDefault();
      return;
    }
    const deltaY = e.deltaY;
    if (Math.abs(deltaY) < 20) return; // ignore tiny scrolls

    const current = getCurrentSectionIndex();
    const targetIndex = deltaY > 0 ? Math.min(current + 1, sections.length - 1) : Math.max(current - 1, 0);

    if (targetIndex !== current) {
      // prevent native scroll while we animate
      e.preventDefault();
      scrollToSection(sections[targetIndex]);
    }
  }, { passive: false });
});