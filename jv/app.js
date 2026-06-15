
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const glow=$('.cursor-glow');
window.addEventListener('pointermove',e=>{ if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}; $$('.cardx').forEach(card=>{const r=card.getBoundingClientRect(); card.style.setProperty('--mx',`${e.clientX-r.left}px`); card.style.setProperty('--my',`${e.clientY-r.top}px`);});});
$('#menuBtn')?.addEventListener('click',()=>$('#navlinks')?.classList.toggle('open'));
const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible'); entry.target.querySelectorAll('.skillbar span').forEach(b=>b.style.width=b.dataset.width||'80%')}}),{threshold:.16});
$$('.reveal,.cardx,.time-item').forEach(el=>{el.classList.add('reveal');io.observe(el)});
$$('.magnetic').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2; const y=e.clientY-r.top-r.height/2; btn.style.transform=`translate(${x*.12}px,${y*.12}px) translateY(-4px)`}); btn.addEventListener('mouseleave',()=>btn.style.transform='')});
const words=['Programmeur in opleiding','Creatieve problem solver','C# / SQL / Webdesign','Thomas More student'];let wi=0,ci=0,del=false;const tw=$('#typewriter');function type(){if(!tw)return;const w=words[wi];tw.textContent=w.slice(0,ci); if(!del&&ci<w.length)ci++; else if(del&&ci>0)ci--; else{del=!del;if(!del)wi=(wi+1)%words.length} setTimeout(type,del?45:80)} type();
const pages=[['Home','index.html','Welkom, skills, opleiding en projecten'],['Over mij','overmij.html','Persoonlijke introductie en motivatie'],['Opleiding','opleiding.html','Studietraject en tijdlijn'],['CV','cv.html','Gegevens, talen, eigenschappen en skills'],['Hobbies','hobbies.html','Fotografie, natuur en architectuur'],['Contact','contact.html','Contactformulier, telefoon en social media']];
const searchBtn=$('#searchBtn'), panel=$('#searchPanel'), input=$('#siteSearch'), results=$('#searchResults');
searchBtn?.addEventListener('click',()=>{panel.classList.toggle('open'); input?.focus()});
input?.addEventListener('input',()=>{const q=input.value.toLowerCase(); results.innerHTML=''; pages.filter(p=>p.join(' ').toLowerCase().includes(q)).forEach(p=>{const a=document.createElement('a');a.href=p[1];a.className='result';a.innerHTML=`<strong>${p[0]}</strong><br><small>${p[2]}</small>`;results.appendChild(a)}); if(!q)results.innerHTML='<span class="result">Typ bv. skills, contact, opleiding...</span>';});
