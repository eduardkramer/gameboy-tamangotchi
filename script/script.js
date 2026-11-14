const INK='#0f380f',BG='#9bbc0f',KEY='tamangotchi-kat-v1',PICK=['cat','dog','tux','dragon'],SP={
cat:{n:'CAT',def:'Kitty',baby:'kitten',desc:'A curious cat.',snd:['Purr...','Meow!','*headbutt*'],evil:'Scratching the couch!',types:['Naughty stray cat','Regular housecat','Well-behaved housecat']},
dog:{n:'DOG',def:'Rex',baby:'puppy',desc:'A loyal, playful dog.',snd:['Woof!','*wags tail*','Bark bark!'],evil:'Chewing your shoe!',types:['Wild stray dog','Regular dog','Well-trained guide dog']},
tux:{n:'LINUX',def:'Linux',baby:'chick',desc:'Linux the penguin. Waddles and types.',snd:['Pip pip!','sudo pip...','*waddle*'],evil:'Typing rm -rf /!',types:['Rebel hacker','Regular sysadmin','Polite maintainer']},
dragon:{n:'MYSTERY EGG',def:'Mystery',baby:'hatchling',desc:'What is inside? A surprise...',snd:['Rrrr!','*tiny puff of fire*','Roar!'],evil:'Setting the curtains on fire!',types:['Wild fire dragon','Regular dragon','Wise dragon']}};
const cv=document.getElementById('c'),x=cv.getContext('2d'),$=i=>document.getElementById(i),cl=v=>Math.max(0,Math.min(100,v));
function fresh(){return{sp:'cat',stage:'egg',name:'Kitty',t:Date.now(),w:60,d:60,l:60,prog:0,hatch:0,h:70,g:70,e:80,n:80,disc:30,grow:0,poop:0,sleep:false,evil:0,evilT:0,type:1,msg:'An egg! Keep it warm and turn it.',mt:5}}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.stage)return Object.assign(fresh(),j)}catch(e){}return fresh()}
function save(){try{S.t=Date.now();localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
let S=load(),f=0,A={k:'',t:0},rc=0,sel=0,mode='title',pick=0,tsel=0,psel=0,ft=0;
function say(t,s){S.msg=t;S.mt=s||4}
function R(a,b,w,h,c){x.fillStyle=c||INK;x.fillRect(a,b,w,h)}
function E(cx,cy,rx,ry,c){for(let j=Math.floor(cy-ry);j<=cy+ry;j++)for(let i=Math.floor(cx-rx);i<=cx+rx;i++)if(((i-cx)/rx)**2+((j-cy)/ry)**2<=1)R(i,j,1,1,c)}
function ring(cx,cy,r){for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const d=i*i+j*j;if(d<=r*r&&d>(r-1)*(r-1))R(cx+i,cy+j,1,1)}}
function heart(a,b){R(a+1,b,1,1);R(a+3,b,1,1);R(a,b+1,5,1);R(a+1,b+2,3,1);R(a+2,b+3,1,1)}

function status(){const s=S;return s.sleep?'Zzz...':s.evil?SP[s.sp].evil+' Train it!':s.h<25?'I am hungry!':(s.poop||s.n<25)?'It smells in here...':s.e<20?'I am tired...':s.g<25?'I am bored...':SP[s.sp].snd[Math.random()*3|0]}

function tick(){
 const s=S;s.mt--;
 if(s.stage==='egg'){
  s.w=cl(s.w-.9);s.d=cl(s.d-.6);s.l=cl(s.l-.5);
  if(s.hatch>0){if(--s.hatch===0){s.stage='kitten';s.grow=0;s.h=s.g=s.n=70;s.e=90;if(s.sp==='dragon'&&s.name==='Mystery'){s.name='Dragon';$('nm').value=s.name}say(s.sp==='dragon'?'Surprise! A baby dragon!':'The egg has hatched!',6)}return}
  if(s.w>30&&s.d>30&&s.l>30)s.prog++;else if(s.w<10)s.prog=Math.max(0,s.prog-.5);
  if(s.prog>=50){s.hatch=4;say('The egg is cracking!',5);return}
  if(s.mt<=0)say(s.w<30?'Brr, the egg is cold!':s.d<30?'Turn the egg over!':s.l<30?'The egg wants attention.':'You feel something moving...',3);
  return}
 const sl=s.sleep;
 s.h=cl(s.h-(sl?.15:.5));s.g=cl(s.g-(sl?.1:.4));s.n=cl(s.n-.2-s.poop*.2);s.e=cl(s.e+(sl?2.5:-.3));
 if(sl&&s.e>=100){s.sleep=false;say('Good morning! *stretch*',5)}
 if(!sl){
  if(Math.random()<.012)s.poop=Math.min(3,s.poop+1);
  if(!s.evil&&Math.random()<(s.stage==='kitten'?.03:.012)){s.evil=1;s.evilT=15;say(SP[s.sp].evil+' Train it!',8)}
  else if(s.evil&&--s.evilT<=0){s.evil=0;s.disc=cl(s.disc-12);s.g=cl(s.g-5);say('Oops, that was naughty...',5)}
 }
 s.grow+=Math.min(s.h,s.g,s.e,s.n)<15?.3:1;
 if(s.stage==='kitten'&&s.grow>=180){s.stage='adult';s.type=s.disc>=60?2:s.disc>=30?1:0;say('Fully grown! It is a '+SP[s.sp].types[s.type]+'!',10)}
 if(s.mt<=0)say(status(),3)
}

function go(k){
 const s=S;A={k:'',t:0};
 if(s.stage==='egg'){
  if(k==='w'){s.w=cl(s.w+35);say('Nice and warm!');A={k:'heat',t:8}}
  if(k==='d'){s.d=cl(s.d+40);say('Egg turned.');A={k:'turn',t:8}}
  if(k==='l'){s.l=cl(s.l+35);say('The egg wobbles happily.');A={k:'love',t:8}}
 }else if(k==='z'){s.sleep=!s.sleep;say(s.sleep?'Good night...':'Awake!')}
 else if(s.sleep)say('Zzz... let it sleep.',3);
 else if(k==='f'){
  if(s.h>90){s.g=cl(s.g-3);say('I am not hungry.')}
  else{s.h=cl(s.h+30);if(Math.random()<.4)s.poop=Math.min(3,s.poop+1);say('Yum yum!');A={k:'food',t:8}}
 }else if(k==='p'){
  if(s.e<15)say('Too tired to play...');
  else{s.g=cl(s.g+30);s.e=cl(s.e-12);s.h=cl(s.h-6);say('Wheee! Toys!');A={k:'play',t:8}}
 }else if(k==='k'){s.g=cl(s.g+12);say(SP[s.sp].snd[0]);A={k:'love',t:8}}
 else if(k==='b'){s.poop=0;s.n=cl(s.n+45);say('Squeaky clean!');A={k:'wash',t:8}}
 else if(k==='t'){
  s.e=cl(s.e-5);
  if(s.evil){s.evil=0;s.disc=cl(s.disc+22);say('No! Good job, it listened.',5);A={k:'train',t:8}}
  else{s.disc=cl(s.disc+6);s.g=cl(s.g-4);say('Sit! Practice makes perfect.');A={k:'train',t:8}}
 }
 ui();draw();save()
}

function titleItems(){let h=false;try{h=!!JSON.parse(localStorage.getItem(KEY)).stage}catch(e){}return h?['START','CONTINUE']:['START']}
function pauseItems(){return S.stage==='egg'?['RESUME','MAIN MENU']:['RESUME',S.sleep?'WAKE UP':'SLEEP','MAIN MENU']}
function menu(){return S.stage==='egg'?[['w','WARM'],['d','TURN'],['l','PET']]:[['f','FEED'],['p','PLAY'],['k','CUDDLE'],['t','TRAIN'],['b','WASH']]}
function nav(d){if(mode==='title'){const n=titleItems().length;tsel=(tsel+d+n)%n}else if(mode==='pick')pick=(pick+d+PICK.length)%PICK.length;else if(mode==='pause'){const n=pauseItems().length;psel=(psel+d+n)%n}else{const m=menu();sel=(sel+d+m.length)%m.length}ui()}
function begin(){S=fresh();S.sp=PICK[pick];S.name=SP[S.sp].def;mode='play';sel=0;A={k:'',t:0};$('nm').value=S.name;bsync();save();ui();draw()}
function resume(){S=load();const n=Math.min(Math.floor((Date.now()-S.t)/4000),150);for(let i=0;i<n;i++)tick();mode='play';sel=0;A={k:'',t:0};$('nm').value=S.name;save();ui();draw()}
function bsync(){}
function press(){if(mode==='pause'){const it=pauseItems()[psel];if(it==='RESUME'){mode='play';ui()}else if(it==='MAIN MENU'){save();mode='title';tsel=0;ui()}else{mode='play';go('z')}}else if(mode==='title'){if(titleItems()[tsel]==='CONTINUE')resume();else{mode='pick';pick=0;ui()}}else if(mode==='pick')begin();else go(menu()[sel][0])}
function bBtn(){if(mode==='pick'){mode='title';ui()}else if(mode==='pause'){mode='play';ui()}else if(mode==='play')go(S.stage==='egg'?'l':'k')}
function startBtn(){if(mode==='play'){mode='pause';psel=0;ui();draw()}else if(mode==='pause'){mode='play';ui()}else press()}
function newGame(){if(mode!=='play')return;if(rc){mode='pick';pick=0;rc=0;ui()}else{rc=1;say('Press SELECT again for a new egg.',3);ui();setTimeout(()=>{rc=0},3000)}}
function ui(){
 const s=S,l=$('mn');$('scr').classList.toggle('solo',mode==='title'||mode==='pick');
 if(mode==='title'||mode==='pick'){
  $('nm').style.display='none';$('st').innerHTML='';
  if(mode==='title'){$('inf').textContent='TAMANGOTCHI';$('msg').textContent='Something is wobbling inside...';l.className='list';l.innerHTML=titleItems().map((t,i)=>`<div class="${i===tsel?'sel':''}">${i===tsel?'> ':''}${t}</div>`).join('')}
  else{const k=PICK[pick];l.className='';$('inf').textContent='PICK YOUR EGG';$('msg').textContent=SP[k].desc;l.textContent='< '+SP[k].n+' >'}
  return}
 $('nm').style.display='';l.className='';
 const eg=s.stage==='egg',m=menu();if(sel>=m.length)sel=0;
 const rows=eg?[['Warmth',s.w],['Turn',s.d],['Love',s.l]]:[['Food',s.h],['Joy',s.g],['Energy',s.e],['Clean',s.n],['Manners',s.disc]];
 $('st').innerHTML=rows.map(([a,v])=>{const n=Math.round(v/20);return `<span>${a}</span><b>${[0,1,2,3,4].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</b>`}).join('');
 $('inf').textContent=eg?`${s.sp==='dragon'?'MYSTERY ':''}EGG ${Math.min(100,Math.round(s.prog/.5))}%`:s.stage==='kitten'?`${SP[s.sp].baby.toUpperCase()} ${Math.min(100,Math.round(s.grow/1.8))}%`:SP[s.sp].types[s.type].toUpperCase();
 $('msg').textContent=s.msg;
 if(mode==='pause'){l.className='list';l.innerHTML=pauseItems().map((t,i)=>`<div class="${i===psel?'sel':''}">${i===psel?'> ':''}${t}</div>`).join('');$('msg').textContent='PAUSED'}else l.textContent='< '+m[sel][1]+' >';
}

function egg(sp,ox,crack,need){
 E(16+ox,17,9,11);E(16+ox,17,7,9,BG);
 if(sp==='dog'){E(16+ox,20,3,2);R(11+ox,15,2,3);R(14+ox,13,2,3);R(17+ox,13,2,3);R(20+ox,15,2,3)}
 else if(sp==='tux'){E(16+ox,17,7,9);E(16+ox,20,4,6,BG);R(12+ox,11,2,2,BG);R(18+ox,11,2,2,BG);R(14+ox,13,4,2,BG)}
 else if(sp==='dragon'){R(13+ox,10,6,2);R(18+ox,12,2,3);R(15+ox,15,4,2);R(15+ox,17,2,2);R(15+ox,21,2,2)}
 else{R(13+ox,12,2,2);R(18+ox,15,3,2);R(12+ox,20,2,2);R(17+ox,22,2,1);R(15+ox,10,2,1)}
 if(crack){for(let k=0;k<9;k++)R(8+k*2+ox,16+(k%2),2,1,BG);R(15+ox,8,1,2,BG);R(23+ox,17,2,3,BG)}
 if(need){if(S.w<30){R(4,3,1,5);R(2,5,5,1);R(3,4,1,1);R(5,6,1,1)}R(27,3,2,5);R(27,10,2,2)}
}
function eyes(cx,cy,Ad,mood){const e1=cx-(Ad?5:4),e2=cx+(Ad?3:2),ey=cy-1;
 [e1,e2].forEach(ex=>{if(mood==='s')R(ex,ey+1,3,1,BG);else if(mood==='h'){R(ex,ey+1,1,1,BG);R(ex+1,ey,1,1,BG);R(ex+2,ey+1,1,1,BG)}else if(mood==='x'){R(ex,ey,2,2,BG);R(ex,ey+3,1,1,BG)}else R(ex,ey,2,3,BG)})}

function creature(){
 const s=S,sp=s.sp,Ad=s.stage==='adult',sl=s.sleep,bob=f%2&&!sl?1:0,tw=(!sl&&f%2)?0:1;
 const avg=(s.h+s.g+s.e+s.n)/4,low=Math.min(s.h,s.g,s.e,s.n);
 const mood=sl?'s':(A.k==='love'||A.k==='play'||avg>70)?'h':low<25?'x':'n';
 const rx=sp==='tux'?(Ad?7:6):sp==='dragon'?7:(Ad?8:7),ry=((sp==='dragon'&&Ad)||(sp==='tux'&&!Ad))?5:6;
 const cx=16,cy=(Ad?10:14)+bob;
 const legs=()=>{if(Ad){R(9,26,4,3);R(19,26,4,3)}else{R(12,26,3,3);R(18,26,3,3)}};
 const body=()=>Ad?E(16,21,9,6):E(16,23,5,4);
 if(sp==='cat'){
  body();legs();
  if(Ad){R(25,22,3,2);R(27,17+tw,2,6);R(26,16+tw,1,1)}else{R(21,24,3,2);R(23,20+tw,2,5)}
  E(cx,cy,rx,ry);
  const ty=cy-ry-2;for(let i=0;i<(Ad?5:4);i++){R(cx-rx+1,ty+i,i+1,1);R(cx+rx-1-i,ty+i,i+1,1)}
  eyes(cx,cy,Ad,mood);R(15,cy+2,2,1,BG);
  if(A.k==='food')R(15,cy+3,2,2,BG);
  else if(mood==='x'){R(14,cy+4,1,1,BG);R(17,cy+4,1,1,BG);R(15,cy+3,2,1,BG)}
  else{R(14,cy+3,1,1,BG);R(17,cy+3,1,1,BG);R(15,cy+4,2,1,BG)}
  R(cx-rx-4,cy+2,4,1);R(cx+rx+1,cy+2,4,1);R(cx-rx-3,cy+4,3,1);R(cx+rx+1,cy+4,3,1);
  if(Ad){R(15,cy-5,1,2,BG);R(17,cy-5,1,2,BG);R(12,18,1,3,BG);R(16,17,1,3,BG);R(20,18,1,3,BG);if(s.type===0)R(cx-rx+1,ty,1,2,BG)}else R(15,cy-5,2,1,BG);
 }else if(sp==='dog'){
  body();legs();
  if(Ad){R(25,19,2,2);R(27,15+tw*2,2,6);R(11,17,4,3,BG)}else{R(21,22,2,2);R(23,19+tw*2,2,4)}
  E(cx,cy,rx,ry);R(cx-rx-3,cy-4,3,9);R(cx+rx+1,cy-4,3,9);
  eyes(cx,cy,Ad,mood);E(cx,cy+3,4,3,BG);R(15,cy+2,2,2);
  if(mood==='x')R(15,cy+4,3,1);else R(14,cy+4,5,1);
  if(mood==='h'||A.k==='food')R(15,cy+5,2,1);
 }else if(sp==='tux'){
  if(Ad){R(8,28,6,2);R(18,28,6,2);E(16,21,9,8);R(5,15+tw,3,9);R(24,15+tw,3,9);E(16,22,5,6,BG)}
  else{R(10,28,4,2);R(18,28,4,2);E(16,22,7,6);R(8,19+tw,2,6);R(22,19+tw,2,6);E(16,24,4,4,BG)}
  E(cx,cy,rx,ry);eyes(cx,cy,Ad,mood);
  R(Ad?13:14,cy+1,Ad?6:4,2,BG);
  if(A.k==='food')R(Ad?14:15,cy+3,Ad?4:2,1,BG);
 }else{
  const fx=cx+rx+1;
  if(Ad){for(let i=0;i<8;i++){R(24,12+i-tw,8-i,1);R(i,12+i-tw,8-i,1)}}
  else{for(let i=0;i<5;i++){R(21,18+i-tw,5-i,1);R(6+i,18+i-tw,5-i,1)}}
  body();legs();
  if(Ad){R(24,22,3,2);R(26,19+tw,2,5);R(25,18+tw,1,1);R(13,20,6,1,BG);R(13,22,6,1,BG);R(13,24,6,1,BG)}
  else{R(21,24,3,2);R(23,21+tw,2,4);R(24,20+tw,1,1)}
  E(cx,cy,rx,ry);
  if(Ad){R(10,2,2,4);R(20,2,2,4);R(10,1,1,1);R(21,1,1,1);R(15,cy-7,2,2)}else{R(11,5,2,4);R(19,5,2,4)}
  eyes(cx,cy,Ad,mood);
  R(14,cy+2,1,2,BG);R(17,cy+2,1,2,BG);
  const my=cy+(Ad?4:5);
  if(A.k==='food')R(14,my-2,4,3,BG);
  else if(mood==='x')R(14,my,4,1,BG);
  else{R(13,my,6,1,BG);if(mood==='h'){R(12,my-1,1,1,BG);R(19,my-1,1,1,BG)}}
  if(A.k==='play'||A.k==='train'){R(fx,cy+3,2,2);R(fx+2,cy+2,3,4)}
 }
 if(Ad&&s.type===2){R(cx-5,cy+ry-1,11,1,BG);R(15,cy+ry,2,2,BG)}
 if(Ad&&s.type===0)R(cx+3,cy-3,1,3,BG);
 for(let k=0;k<s.poop;k++){R(k*5+1,30,4,2);R(k*5+2,29,2,1)}
 if(s.evil&&f%2){R(27,3,2,5);R(27,10,2,2);R(2,12,1,5);R(4,12,1,5)}
 if(sl){const o=f%2;R(24,3+o,3,1);R(26,4+o,1,1);R(25,5+o,1,1);R(24,6+o,3,1)}
}

function draw(){
 R(0,0,32,32,BG);
 if(mode==='title'||mode==='pick'){const t=mode==='title';egg(t?'cat':PICK[pick],t?[0,-1,1,-1,1,0,1,-1][ft%8]:[0,0,0,-1,1,0][ft%6],false,false);
  if(t){if(ft%6<3){R(5,5,1,3);R(4,6,3,1)}else{R(26,8,1,3);R(25,9,3,1)}}return}
 if(S.stage==='egg'){const nd=S.w<30||S.d<30||S.l<30;egg(S.sp,S.hatch>0?(f%2?-1:1):(nd&&f%2?1:0),S.prog>=25||S.hatch>0,nd)}else creature();
 const k=A.k;
 if(A.t>0){
  if(k==='love')heart(24,4-f%2);
  if(k==='heat'){R(25,4,3,3);R(26,2,1,1);R(26,8,1,1);R(23,5,1,1);R(29,5,1,1)}
  if(k==='turn'){ring(5,5,3);ring(27,27,3)}
  if(k==='food'){R(21,24,5,3);R(26,23,1,1);R(26,27,1,1);R(22,25,1,1,BG)}
  if(k==='play')E(5,[24,20,17,20][f%4],2,2);
  if(k==='wash'){const o=f%2;ring(6,8+o,3);ring(25,10-o,2);ring(11,4+o,2)}
  if(k==='train'){R(4,6,1,3);R(3,7,3,1);R(26,5,1,3);R(25,6,3,1)}
 }
 if(S.sleep){x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,0,32,32)}
}

$('nm').value=S.name;$('nm').oninput=e=>{S.name=e.target.value;save()};
const KM={ArrowLeft:'l',ArrowUp:'u',ArrowRight:'r',ArrowDown:'d',z:'a',' ':'a',x:'b',Enter:'st'};
addEventListener('keyup',()=>document.querySelectorAll('button.on').forEach(b=>b.classList.remove('on')));
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||(e.target.closest&&e.target.closest('.mp')))return;const kb=document.querySelector('[data-k="'+KM[e.key]+'"]');if(kb)kb.classList.add('on');const k=e.key;
 if(k==='ArrowLeft'||k==='ArrowUp')nav(-1);else if(k==='ArrowRight'||k==='ArrowDown')nav(1);
 else if(k==='z'||k===' ')press();else if(k==='x')bBtn();else if(k==='Enter')startBtn();else return;e.preventDefault()});
ui();draw();
setInterval(()=>{if(mode==='play'){tick();save()}ui()},1000);
setInterval(()=>{f++;if(A.t>0)A.t--;if(mode==='play'||mode==='pause')draw()},250);
setInterval(()=>{if(mode==='title'||mode==='pick'){ft++;draw()}},110);
