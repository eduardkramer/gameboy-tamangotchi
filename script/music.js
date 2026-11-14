/* Tamangotchi Tunes - mp3 speler
   Voeg je nummers toe in de lijst hieronder en zet de .mp3 bestanden in de map "music".
   Voorbeelden (haal de // weg en pas aan):
     {title:'Pixel Meadow', file:'music/pixel-meadow.mp3'},
     'music/neon-circuit.mp3',            <- kort: titel wordt uit de bestandsnaam gehaald
*/
const TRACKS=[
 // {title:'Pixel Meadow', file:'music/pixel-meadow.mp3'},
    {title:'Mood Mode', file: 'music/moodmode.mp3'}
];

(()=>{
'use strict';
const $=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0');
const T=TRACKS.map(t=>typeof t==='string'
 ?{file:t,title:decodeURIComponent(t.split('/').pop()).replace(/\.mp3$/i,'').replace(/[-_]+/g,' ')}
 :{file:t.file,title:t.title||t.file});
const au=new Audio();au.preload='none';
let cur=0,loaded=false,state='stop',err='';
const VK='tamangotchi-kat-vol';
try{const v=parseFloat(localStorage.getItem(VK));au.volume=isFinite(v)?Math.max(0,Math.min(1,v)):.7}catch(e){au.volume=.7}
$('mvol').value=au.volume;

const fmt=s=>isFinite(s)&&s>=0?pad(Math.floor(s/60))+':'+pad(Math.floor(s%60)):'--:--';

function load(i){
 cur=(i+T.length)%T.length;err='';
 au.src=T[cur].file;loaded=true;
 render();
}
function play(){
 if(!T.length)return;
 if(!loaded)load(cur);
 err='';
 au.play().then(()=>{state='play';render()}).catch(e=>{if(e.name!=='AbortError'){err='FILE NOT FOUND';state='stop';render()}});
}
function pause(){
 if(state!=='play')return;
 au.pause();state='pause';render();
}
function stop(){
 if(!loaded)return;
 au.pause();try{au.currentTime=0}catch(e){}
 state='stop';render();
}
function go(d){
 if(!T.length)return;
 load(cur+d);play();
}

au.addEventListener('ended',()=>go(1));
au.addEventListener('error',()=>{if(loaded){err='FILE NOT FOUND';state='stop';render()}});
au.addEventListener('timeupdate',tick);
au.addEventListener('loadedmetadata',tick);

function tick(){
 const d=au.duration,c=au.currentTime||0;
 $('mtime').textContent=fmt(c)+' / '+fmt(d);
 $('mfill').style.width=(isFinite(d)&&d>0?Math.min(100,c/d*100):0)+'%';
}

function render(){
 const empty=!T.length;
 $('mst').textContent=empty?'NO DISC':err?'ERROR':state==='play'?'> PLAY':state==='pause'?'|| PAUSE':'[] STOP';
 $('mno').textContent=empty?'--/--':pad(cur+1)+'/'+pad(T.length);
 $('mt').textContent=empty?'ADD MP3 TO MUSIC/':err||T[cur].title;
 $('mplay').classList.toggle('act',state==='play');
 $('mpause').classList.toggle('act',state==='pause');
 $('mstop').classList.toggle('act',loaded&&state==='stop');
 $('mscr').classList.toggle('empty',empty);
 if(!empty)[...$('ml').children].forEach((li,i)=>{
  const on=i===cur&&loaded;
  li.classList.toggle('sel',on);
  li.firstChild.textContent=on?(state==='play'?'> ':state==='pause'?'| ':'. '):'  ';
 });
 tick();
}

/* lijst opbouwen */
const ml=$('ml');
if(!T.length){
 const li=document.createElement('li');li.className='none';
 li.textContent='Lijst is leeg. Zet .mp3 bestanden in de map music en voeg ze toe in script/music.js';
 ml.appendChild(li);
}
T.forEach((t,i)=>{
 const li=document.createElement('li');
 li.appendChild(document.createTextNode('  '));
 li.appendChild(document.createTextNode(pad(i+1)+' '+t.title));
 li.tabIndex=0;li.setAttribute('role','button');
 const pick=()=>{if(i===cur&&loaded&&state==='play')return;if(i!==cur||!loaded)load(i);play()};
 li.onclick=pick;
 li.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}};
 ml.appendChild(li);
});

/* knoppen */
$('mplay').onclick=()=>{if(state==='play')return;play()};
$('mpause').onclick=pause;
$('mstop').onclick=stop;
$('mprev').onclick=()=>go(-1);
$('mnext').onclick=()=>go(1);
$('mvol').oninput=e=>{au.volume=+e.target.value;try{localStorage.setItem(VK,au.volume)}catch(_){}};
$('mbar').onclick=e=>{
 if(!loaded||!isFinite(au.duration))return;
 const r=e.currentTarget.getBoundingClientRect();
 au.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*au.duration;
};

render();
})();
