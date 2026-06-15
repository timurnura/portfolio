const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });
  function animateCursor(){
    ringX += (mouseX - ringX) * .16;
    ringY += (mouseY - ringY) * .16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a,button,.tilt-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ ring.style.width='72px'; ring.style.height='72px'; ring.style.borderColor='rgba(255,99,51,.7)'; });
    el.addEventListener('mouseleave',()=>{ ring.style.width='42px'; ring.style.height='42px'; ring.style.borderColor='rgba(17,17,15,.35)'; });
  });
}

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=> card.style.transform='');
});

document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove', e=>{
    const r=el.getBoundingClientRect();
    el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.16}px, ${(e.clientY-r.top-r.height/2)*.16}px)`;
  });
  el.addEventListener('mouseleave',()=> el.style.transform='');
});

const strip = document.querySelector('.photo-strip');
if(strip){
  let down=false,startX,scrollLeft;
  strip.addEventListener('mousedown',e=>{down=true;startX=e.pageX-strip.offsetLeft;scrollLeft=strip.scrollLeft;});
  strip.addEventListener('mouseleave',()=>down=false);
  strip.addEventListener('mouseup',()=>down=false);
  strip.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();const x=e.pageX-strip.offsetLeft;strip.scrollLeft=scrollLeft-(x-startX)*1.6;});
}


// Premium loader + scroll progress
(function(){
  document.body.classList.add('is-loading');
  const loader = document.getElementById('site-loader');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  function hideLoader(){
    if(!loader) return document.body.classList.remove('is-loading');
    setTimeout(()=>{
      loader.classList.add('loader-hidden');
      document.body.classList.remove('is-loading');
      setTimeout(()=>loader.remove(),900);
    }, 900);
  }
  if(document.readyState === 'complete' || document.readyState === 'interactive') hideLoader();
  else document.addEventListener('DOMContentLoaded', hideLoader, {once:true});
  window.addEventListener('load', hideLoader, {once:true});
  setTimeout(hideLoader, 2200);

  function updateProgress(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, {passive:true});
})();

// Extra soft parallax for blur and hero objects
(function(){
  const movers = document.querySelectorAll('.blur-orb,.photo-badge,.project-media img,.featured-card img');
  if(!movers.length) return;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    movers.forEach((el,i)=>{
      const speed = (i % 4 + 1) * 0.018;
      el.style.setProperty('--scroll-shift', `${y * speed}px`);
      if(el.classList.contains('blur-orb')) el.style.transform = `translateY(${y * speed}px)`;
    });
  }, {passive:true});
})();

// === All-in responsive motion pack ===
(function(){
  const body = document.body;

  // Mobile: alleen de onderste dock-navigatie gebruiken, geen hamburger-menu.
  document.querySelectorAll('.mobile-menu-toggle,.mobile-menu').forEach(el=>el.remove());
  body.classList.remove('menu-open');

  if(!document.querySelector('.mobile-dock')){
    const dock = document.createElement('nav');
    dock.className = 'mobile-dock';
    const isProjects = body.classList.contains('projects-page');
    dock.innerHTML = isProjects
      ? `<a href="index.html"><i class="fa-solid fa-house"></i><span>Home</span></a><a class="active" href="projects.html"><i class="fa-solid fa-layer-group"></i><span>Projecten</span></a><a href="#darkrealm"><i class="fa-solid fa-gamepad"></i><span>Game</span></a><a href="index.html#contact"><i class="fa-solid fa-paper-plane"></i><span>Contact</span></a>`
      : `<a class="active" href="#home"><i class="fa-solid fa-house"></i><span>Home</span></a><a href="projects.html"><i class="fa-solid fa-layer-group"></i><span>Projecten</span></a><a href="#work"><i class="fa-solid fa-code"></i><span>Vaard.</span></a><a href="#contact"><i class="fa-solid fa-paper-plane"></i><span>Contact</span></a>`;
    document.body.appendChild(dock);
  }

  if(!document.querySelector('.kinetic-bg')){
    const k = document.createElement('div');
    k.className = 'kinetic-bg';
    k.textContent = body.classList.contains('projects-page') ? 'PROJECTEN' : 'PORTFOLIO';
    document.body.appendChild(k);
  }

  // Extra reveal timing for rich staggered entrance
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
  });

  // Add animated-border to cards/buttons for glow details
  document.querySelectorAll('.project-card,.contact-card,.featured-card,.project-media').forEach(el=>el.classList.add('animated-border'));

  // Scroll-linked movement: text/images drift at different speeds on desktop and mobile
  const driftItems = [
    ...document.querySelectorAll('.mega-title,.section-intro h2,.contact-title,.hero-visual,.featured-card,.project-card,.time-item,.project-media')
  ];
  let ticking = false;
  function motionScroll(){
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 1;
    driftItems.forEach((el, index)=>{
      const rect = el.getBoundingClientRect();
      if(rect.bottom < -200 || rect.top > vh + 200) return;
      const center = rect.top + rect.height / 2;
      const distance = (center - vh / 2) / vh;
      const speed = window.innerWidth < 800 ? 6 : 26;
      const direction = index % 2 === 0 ? 1 : -1;
      const rotate = window.innerWidth < 800 ? 0 : distance * direction * 1.2;
      el.style.transform = `translate3d(0, ${distance * speed * direction}px, 0) rotate(${rotate}deg)`;
    });
    ticking = false;
  }
  function requestMotion(){
    if(!ticking){ requestAnimationFrame(motionScroll); ticking = true; }
  }
  window.addEventListener('scroll', requestMotion, {passive:true});
  window.addEventListener('resize', requestMotion);
  requestMotion();

  // Active mobile dock highlighting
  const dockLinks = document.querySelectorAll('.mobile-dock a[href^="#"]');
  const sections = [...dockLinks].map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(sections.length){
    const activeObs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          dockLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    },{rootMargin:'-45% 0px -45% 0px',threshold:0});
    sections.forEach(s=>activeObs.observe(s));
  }

  // Touch-friendly card press effect
  document.querySelectorAll('.project-card,.featured-card,.contact-card,.pill').forEach(el=>{
    el.addEventListener('touchstart',()=>el.classList.add('is-pressed'),{passive:true});
    el.addEventListener('touchend',()=>el.classList.remove('is-pressed'),{passive:true});
  });
})();


// === Premium percentage loader ===
(function(){
  const loader=document.getElementById('site-loader');
  if(!loader) return;
  const content=loader.querySelector('.loader-content');
  if(content && !loader.querySelector('.loader-percent')){
    const pct=document.createElement('div'); pct.className='loader-percent'; pct.textContent='0%'; content.appendChild(pct);
    let n=0; const timer=setInterval(()=>{ n=Math.min(100,n+Math.floor(Math.random()*13)+4); pct.textContent=n+'%'; if(n>=100) clearInterval(timer); },90);
  }
})();

// === Scroll storytelling words ===
(function(){
  const story=document.querySelector('.scroll-story');
  const words=[...document.querySelectorAll('.story-words span')];
  if(!story || !words.length) return;
  function update(){
    const r=story.getBoundingClientRect();
    const total=Math.max(1,r.height-window.innerHeight);
    const progress=Math.min(1,Math.max(0,-r.top/total));
    const active=Math.min(words.length-1,Math.floor(progress*words.length));
    words.forEach((w,i)=>w.classList.toggle('active',i===active));
  }
  window.addEventListener('scroll',update,{passive:true}); update();
})();

// === Animated skill counters ===
(function(){
  const meters=document.querySelectorAll('.skill-meter');
  if(!meters.length) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el=entry.target, value=Number(el.dataset.value||0), bar=el.querySelector('i'), num=el.querySelector('strong');
      if(bar) bar.style.width=value+'%';
      let cur=0; const step=()=>{cur+=Math.max(1,Math.ceil((value-cur)/8)); if(cur>value) cur=value; if(num) num.textContent=cur+'%'; if(cur<value) requestAnimationFrame(step);}; step();
      obs.unobserve(el);
    });
  },{threshold:.35});
  meters.forEach(m=>obs.observe(m));
})();

// === Bento light follows pointer ===
(function(){
  document.querySelectorAll('.bento-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(); card.style.setProperty('--mx',(e.clientX-r.left-r.width/2)+'px'); card.style.setProperty('--my',(e.clientY-r.top-r.height/2)+'px');});
  });
})();

// === Easter egg: type darkrealm ===
(function(){
  let typed='';
  const toast=document.createElement('div'); toast.className='easter-toast'; toast.textContent='Developer Mode Activated — Dark Realm'; document.body.appendChild(toast);
  window.addEventListener('keydown',e=>{
    typed=(typed+e.key.toLowerCase()).slice(-9);
    if(typed.includes('darkrealm')){
      toast.classList.add('show'); document.body.classList.add('konami-pulse');
      setTimeout(()=>toast.classList.remove('show'),2400); setTimeout(()=>document.body.classList.remove('konami-pulse'),2300); typed='';
    }
  });
})();

// Extra floating atmosphere elements
(function(){
  if(document.querySelector('.float-sprite')) return;
  ['one','two'].forEach(c=>{const s=document.createElement('span');s.className='float-sprite '+c;document.body.appendChild(s);});
})();


// === Professional polish: page transitions, counters, ambience ===
(function(){
  if(!document.querySelector('.page-transition')){
    const t=document.createElement('div'); t.className='page-transition'; document.body.appendChild(t);
  }
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target==='_blank') return;
    a.addEventListener('click',e=>{
      e.preventDefault(); document.body.classList.add('page-leaving');
      setTimeout(()=>{ window.location.href=href; },420);
    });
  });
})();

(function(){
  const nums=document.querySelectorAll('[data-count]');
  if(!nums.length) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el=entry.target, target=Number(el.dataset.count||0); let cur=0;
      const step=()=>{ cur += Math.max(1, Math.ceil((target-cur)/10)); if(cur>target) cur=target; el.textContent= target===100 ? cur+'%' : cur+'+'; if(cur<target) requestAnimationFrame(step); };
      step(); obs.unobserve(el);
    });
  },{threshold:.35});
  nums.forEach(n=>obs.observe(n));
})();

(function(){
  const btn=document.querySelector('.ambience-toggle');
  if(!btn || !window.AudioContext) return;
  let ctx,osc,gain,on=false;
  btn.addEventListener('click',()=>{
    on=!on; btn.classList.toggle('is-on',on); btn.textContent=on?'Sfeer uit':'Sfeer aan';
    if(on){
      ctx=new AudioContext(); osc=ctx.createOscillator(); gain=ctx.createGain();
      osc.type='sine'; osc.frequency.value=82; gain.gain.value=.018;
      osc.connect(gain); gain.connect(ctx.destination); osc.start();
    }else if(ctx){
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+.25); setTimeout(()=>{try{osc.stop();ctx.close()}catch(e){}},280);
    }
  });
})();
