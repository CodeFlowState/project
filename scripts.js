document.addEventListener('DOMContentLoaded', ()=>{
  const nav = document.querySelector('nav');
  const navlinks = Array.from(document.querySelectorAll('nav .navlink'));
  const sections = Array.from(document.querySelectorAll('main section'));

  // Hamburger menu
  const menuBtn = document.querySelector('.menu-btn');
  if(menuBtn){
    menuBtn.addEventListener('click', ()=>{
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });

    // Close menu when a nav link is clicked
    navlinks.forEach(a=> a.addEventListener('click', ()=>{
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));

    // Close on Escape
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // Active link on scroll
  function setActive(index){
    navlinks.forEach((a,i)=>{
      const active = i === index;
      a.classList.toggle('active', active);
      if(active) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
    });
  }

  function onScroll(){
    const y = window.scrollY + 120;
    let idx = sections.findIndex(s => s.offsetTop + s.offsetHeight > y);
    if(idx === -1) idx = sections.length - 1;
    setActive(idx);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Keyboard nav (left/right)
  nav.addEventListener('keydown', e => {
    const focused = document.activeElement;
    const idx = navlinks.indexOf(focused);
    if(idx === -1) return;
    if(e.key === 'ArrowRight'){
      e.preventDefault(); const next = navlinks[idx+1] || navlinks[0]; next.focus();
    }
    if(e.key === 'ArrowLeft'){
      e.preventDefault(); const prev = navlinks[idx-1] || navlinks[navlinks.length-1]; prev.focus();
    }
  });

  // Skip link fix for older browsers
  const skip = document.querySelector('.skip');
  if(skip) skip.addEventListener('click', ()=>{
    const target = document.querySelector(skip.getAttribute('href'));
    if(target) target.setAttribute('tabindex','-1');
  });

  // New Back-to-top behaviour
  const backToTop = document.getElementById('backToTop');
  if(backToTop){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateBtt = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 10;
      const threshold = Math.min(420, Math.floor(window.innerHeight * 0.4));
      if(isScrollable && window.scrollY > threshold){
        backToTop.classList.add('visible');
        backToTop.removeAttribute('aria-hidden');
      } else {
        backToTop.classList.remove('visible');
        backToTop.setAttribute('aria-hidden','true');
      }
    };
    window.addEventListener('scroll', updateBtt, {passive:true});
    window.addEventListener('resize', updateBtt);
    updateBtt();

    backToTop.addEventListener('click', (ev) => {
      ev.preventDefault();
      if(prefersReduced){
        window.scrollTo(0,0);
      } else {
        window.scrollTo({top:0,behavior:'smooth'});
      }
      backToTop.blur();
    });

    backToTop.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); backToTop.click();
      }
    });
  }

  // Ripple effect on elements with .ripple
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('.ripple');
    if(!el) return;
    // opt-out: allow disabling ripple via `.no-ripple`
    if(el.classList.contains('no-ripple')) return;

    const rect = el.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple-effect';

    // size: proportional to element but clamped so it doesn't grow off-screen
    const base = Math.max(rect.width, rect.height);
    const size = Math.min(Math.max(48, Math.round(base * 1.4)), 160);
    circle.style.width = circle.style.height = size + 'px';

    // position using percentage coordinates and clamp to keep the origin away from edges
    const toPct = (v, total) => (v / total) * 100;
    let xPct = toPct(e.clientX - rect.left, rect.width);
    let yPct = toPct(e.clientY - rect.top, rect.height);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    xPct = clamp(xPct, 18, 82);
    yPct = clamp(yPct, 18, 82);
    circle.style.setProperty('--rx', xPct + '%');
    circle.style.setProperty('--ry', yPct + '%');

    el.appendChild(circle);
    setTimeout(()=> circle.remove(), 700);
  });

  // Scroll reveal using IntersectionObserver
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !prefersReduced){
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },{threshold: 0.12});
    revealEls.forEach(el => io.observe(el));
  } else {
    // If no support or reduced motion, make reveals visible
    document.querySelectorAll('.reveal').forEach(el=> el.classList.add('visible'));
  }

});
