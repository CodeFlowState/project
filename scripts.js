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

    // show back-to-top
    const btt = document.querySelector('.back-to-top');
    if(btt){
      if(window.scrollY > 420) btt.style.display = 'flex'; else btt.style.display = 'none';
    }
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

  // Back to top
  const btt = document.querySelector('.back-to-top');
  if(btt){
    btt.addEventListener('click', ()=>{
      window.scrollTo({top:0,behavior: 'smooth'});
      btt.blur();
    });
  }

  // Ripple effect on elements with .ripple
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('.ripple');
    if(!el) return;
    const rect = el.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size/2) + 'px';
    circle.style.top = (e.clientY - rect.top - size/2) + 'px';
    el.appendChild(circle);
    setTimeout(()=> circle.remove(), 650);
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
