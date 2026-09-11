(() => {
  'use strict';
  const root = document.documentElement;
  const opening = document.querySelector('#home');
  const film = document.querySelector('#worldFilm');
  const intro = document.querySelector('.hero-intro');
  const outro = document.querySelector('.hero-outro');
  const motionButton = document.querySelector('#motionBtn');
  const watchButton = document.querySelector('#watchFilmBtn');
  const dialog = document.querySelector('#filmDialog');
  const fullFilm = document.querySelector('#fullFilm');
  const closeButton = document.querySelector('#closeFilmBtn');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = motionPreference.matches;
  let userChoseMotion = false;
  let inView = true;
  let scrollFrame = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  const smooth = (from, to, value) => { const n=clamp((value-from)/(to-from)); return n*n*(3-2*n); };

  function paintControls() {
    const chinese = root.dataset.lang === 'zh';
    root.dataset.motion = userPaused ? 'paused' : 'running';
    motionButton.setAttribute('aria-pressed', String(userPaused));
    motionButton.setAttribute('aria-label', chinese ? (userPaused ? '播放背景动画' : '暂停背景动画') : (userPaused ? 'Play background film' : 'Pause background film'));
    motionButton.title = motionButton.getAttribute('aria-label');
    motionButton.querySelector('[data-motion-label]').textContent = chinese ? (userPaused ? '播放' : '暂停') : (userPaused ? 'Play' : 'Pause');
    closeButton.setAttribute('aria-label', chinese ? '关闭完整动画' : 'Close film');
  }
  function syncPlayback() {
    if (userPaused || !inView || document.hidden || dialog.open) film.pause();
    else if (film.paused) film.play().catch(error => {
      if (error.name === 'AbortError') return;
      userPaused=true;
      paintControls();
    });
  }
  function paintTime() {
    const seconds = Math.floor(film.currentTime || 0);
    document.querySelector('#filmTime').textContent = `00:${String(seconds).padStart(2,'0')}`;
    const length = Number.isFinite(film.duration) ? film.duration : 24;
    document.querySelector('#filmProgress').style.transform = `scaleX(${clamp(film.currentTime / length)})`;
  }
  function updateJourney() {
    scrollFrame = 0;
    const bounds = opening.getBoundingClientRect();
    const progress = clamp(-bounds.top / Math.max(1,bounds.height-innerHeight));
    const enter = 1-smooth(.32,.5,progress), exit=smooth(.53,.71,progress);
    intro.style.opacity = enter;
    intro.style.transform = motionPreference.matches ? 'none' : `translateY(${-32*(1-enter)}px)`;
    intro.inert = enter < .05;
    intro.setAttribute('aria-hidden', String(enter < .05));
    intro.style.pointerEvents = enter > .4 ? '' : 'none';
    outro.style.opacity = exit;
    outro.style.transform = motionPreference.matches ? 'none' : `translateY(${24*(1-exit)}px)`;
    outro.inert = exit < .05;
    outro.setAttribute('aria-hidden', String(exit < .05));
    outro.style.pointerEvents = exit > .4 ? '' : 'none';
  }
  watchButton.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('film-open');
    film.pause();
    fullFilm.currentTime = 0;
    fullFilm.play().catch(() => {});
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    fullFilm.pause();
    document.body.classList.remove('film-open');
    syncPlayback();
    watchButton.focus({preventScroll:true});
  });
  motionButton.addEventListener('click', () => {
    userChoseMotion = true;
    userPaused = !userPaused;
    paintControls();syncPlayback();
  });
  motionPreference.addEventListener('change', event => {
    if (!userChoseMotion) userPaused = event.matches;
    paintControls();updateJourney();syncPlayback();
  });
  new MutationObserver(paintControls).observe(root,{attributes:true,attributeFilter:['data-lang']});
  new IntersectionObserver(([entry]) => { inView=entry.isIntersecting;syncPlayback(); }).observe(document.querySelector('.observatory'));
  document.addEventListener('visibilitychange', () => { syncPlayback();if(document.hidden) fullFilm.pause(); });
  addEventListener('scroll', () => { if(!scrollFrame) scrollFrame=requestAnimationFrame(updateJourney); },{passive:true});
  addEventListener('resize', updateJourney,{passive:true});
  film.addEventListener('canplay',syncPlayback);
  film.addEventListener('timeupdate',paintTime);
  film.addEventListener('loadedmetadata',paintTime);
  film.muted = true;
  paintControls();updateJourney();syncPlayback();
})();
