/* Sleepfunctie: Game Boy (.gb) en muziekspeler (.mp) zijn vrij te verplaatsen.
   - Muis/pen: sleep aan een vrij stukje van het apparaat (niet op knoppen, schuifje of tracklijst).
   - Touch: sleep aan het greepje bovenaan het apparaat (zo blijft scrollen op je telefoon werken).
   - Toetsenbord: Tab naar het greepje, dan pijltjestoetsen (Shift = grotere stappen).
   De plek wordt onthouden in localStorage. */
(()=>{
'use strict';
const KEY='tamangotchi-kat-layout';
const INTERACTIVE='button,input,label,li,a,#mbar,.grip';
const devices=[...document.querySelectorAll('.gb,.mp')];
let pos={},top=10;
try{pos=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){pos={}}

const id=el=>el.classList.contains('gb')?'gb':'mp';
const num=v=>typeof v==='number'&&isFinite(v)?v:0;

/* Houd het apparaat binnen de pagina: niet links/boven eruit, niet buiten de breedte. */
function clamp(el,x,y){
 const r=el.getBoundingClientRect(),cx=num(el._x),cy=num(el._y);
 const nl=r.left+scrollX-cx,nt=r.top+scrollY-cy;           /* natuurlijke plek zonder verschuiving */
 const maxW=document.documentElement.clientWidth;
 const maxH=Math.max(innerHeight,document.body.offsetHeight);
 x=Math.min(Math.max(x,-nl),maxW-nl-r.width);
 y=Math.min(Math.max(y,-nt),maxH-nt-r.height);
 return [Math.round(x),Math.round(y)];
}
function place(el,x,y,keep){
 [x,y]=clamp(el,x,y);
 el._x=x;el._y=y;
 el.style.transform=x||y?`translate(${x}px,${y}px)`:'';
 el.classList.toggle('moved',!!(x||y));
 if(!keep){pos[id(el)]={x,y};try{localStorage.setItem(KEY,JSON.stringify(pos))}catch(e){}}
 syncReset();
}
function toFront(el){el.style.zIndex=++top}

const rb=document.getElementById('resetpos');
function syncReset(){if(rb)rb.hidden=!devices.some(d=>d.classList.contains('moved'))}
if(rb)rb.onclick=()=>{devices.forEach(d=>place(d,0,0));pos={};try{localStorage.removeItem(KEY)}catch(e){}syncReset()};

devices.forEach(el=>{
 el._x=0;el._y=0;
 const name=el.classList.contains('gb')?'Game Boy':'muziekspeler';

 /* greepje */
 const g=document.createElement('button');
 g.type='button';g.className='grip';
 g.setAttribute('aria-label','Verplaats '+name+' (sleep, of gebruik de pijltjestoetsen)');
 g.title='Sleep om te verplaatsen';
 g.innerHTML='<i></i><i></i><i></i>';
 el.appendChild(g);

 let d=null;
 const down=e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  const onGrip=e.target.closest('.grip');
  if(!onGrip){
   if(e.pointerType==='touch')return;                      /* touch: alleen via greepje */
   if(e.target.closest(INTERACTIVE))return;                /* knoppen blijven gewoon knoppen */
  }
  d={px:e.clientX,py:e.clientY,x:el._x,y:el._y,id:e.pointerId};
  toFront(el);el.classList.add('drag');
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
 };
 const move=e=>{
  if(!d||e.pointerId!==d.id)return;
  place(el,d.x+e.clientX-d.px,d.y+e.clientY-d.py);
 };
 const up=e=>{
  if(!d||e.pointerId!==d.id)return;
  d=null;el.classList.remove('drag');
  try{el.releasePointerCapture(e.pointerId)}catch(_){}
 };
 el.addEventListener('pointerdown',down);
 el.addEventListener('pointermove',move);
 el.addEventListener('pointerup',up);
 el.addEventListener('pointercancel',up);
 g.addEventListener('dblclick',()=>place(el,0,0));

 /* toetsenbord */
 g.addEventListener('keydown',e=>{
  const s=e.shiftKey?40:10,m={ArrowLeft:[-s,0],ArrowRight:[s,0],ArrowUp:[0,-s],ArrowDown:[0,s]}[e.key];
  if(e.key==='Escape'||e.key==='Home'){place(el,0,0);e.preventDefault();e.stopPropagation();return}
  if(!m)return;
  toFront(el);place(el,el._x+m[0],el._y+m[1]);
  e.preventDefault();e.stopPropagation();                  /* niet ook de Game Boy bedienen */
 });
});

/* opgeslagen plekken terugzetten */
devices.forEach(el=>{const p=pos[id(el)];if(p)place(el,num(p.x),num(p.y),true)});
addEventListener('resize',()=>devices.forEach(el=>place(el,el._x,el._y)));
addEventListener('load',()=>devices.forEach(el=>place(el,el._x,el._y)));
syncReset();
})();
