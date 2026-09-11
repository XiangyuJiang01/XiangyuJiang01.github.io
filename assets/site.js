(() => {
  'use strict';
  const root = document.documentElement;
  const langButton = document.querySelector('#langBtn');
  const themeButton = document.querySelector('#themeBtn');
  const menuButton = document.querySelector('#menuBtn');
  const menu = document.querySelector('#mobileMenu');
  const header = document.querySelector('#siteHeader');
  const rail = document.querySelector('.chapter-nav');
  const progress = document.querySelector('#readingProgress');
  const darkPreference = matchMedia('(prefers-color-scheme: dark)');
  let themeChosen = false;
  try { themeChosen = !!localStorage.getItem('theme'); } catch {}

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }

  function paintControls() {
    const chinese = root.dataset.lang === 'zh';
    const dark = root.dataset.theme === 'dark';
    langButton.textContent = chinese ? 'EN' : '中文';
    langButton.setAttribute('aria-label', chinese ? 'Switch to English' : '切换为中文');
    langButton.title = chinese ? 'Switch to English' : '切换为中文';
    themeButton.setAttribute('aria-label', chinese ? (dark ? '切换为浅色' : '切换为深色') : (dark ? 'Switch to light theme' : 'Switch to dark theme'));
    themeButton.title = themeButton.getAttribute('aria-label');
    menuButton.setAttribute('aria-label', chinese ? (menu.hidden ? '打开菜单' : '关闭菜单') : (menu.hidden ? 'Open menu' : 'Close menu'));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#102431' : '#e4f0f5';
  }

  langButton.addEventListener('click', () => {
    root.dataset.lang = root.dataset.lang === 'en' ? 'zh' : 'en';
    root.lang = root.dataset.lang === 'zh' ? 'zh-CN' : 'en';
    save('lang', root.dataset.lang);
    paintControls();
    updateScroll();
  });
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeChosen = true;
    save('theme', root.dataset.theme);
    paintControls();
  });
  darkPreference.addEventListener('change', event => {
    if (!themeChosen) {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      paintControls();
    }
  });

  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    paintControls();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !menu.contains(event.target) && !header.contains(event.target)) setMenu(false);
  });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  const chapters = [...rail.querySelectorAll('a')].map(link => ({link, section: document.querySelector(link.getAttribute('href'))}));
  const desktopLinks = [...document.querySelectorAll('.desktop-nav a')];
  let scrollQueued = false;
  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? y / distance : 0})`;
    header.classList.toggle('is-scrolled', y > 60);
    let active = chapters[0];
    for (const chapter of chapters) {
      if (chapter.section.getBoundingClientRect().top <= innerHeight * .45) active = chapter;
    }
    for (const chapter of chapters) {
      const current = chapter === active;
      chapter.link.classList.toggle('is-current', current);
      if (current) chapter.link.setAttribute('aria-current', 'location');
      else chapter.link.removeAttribute('aria-current');
    }
    rail.classList.toggle('on-dark', active.section.id === 'research');
    for (const link of desktopLinks) {
      if (link.getAttribute('href') === '#' + active.section.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function scheduleScroll() {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }
  addEventListener('scroll', scheduleScroll, {passive: true});
  addEventListener('resize', scheduleScroll, {passive: true});
  addEventListener('load', updateScroll);
  document.querySelectorAll('.research-item').forEach(item => item.addEventListener('toggle', scheduleScroll));
  document.querySelector('#year').textContent = new Date().getFullYear();
  const portrait = document.querySelector('.portrait img');
  portrait.addEventListener('error', () => { portrait.hidden = true; });
  paintControls();
  updateScroll();
})();
