'use strict';
/* =========================================================
   APP – natív menük, haptika, kezelőszervek, telepítés, megosztás,
   frissítés százalékkal, offline működés
   ========================================================= */
const $=id=>document.getElementById(id);
const haptic=(ms)=>{try{if(navigator.vibrate)navigator.vibrate(ms||12);}catch(e){}};
holdBtn('bGas','gas');holdBtn('bBr','brake');holdBtn('bFlash','flash');
tapBtn('bUp',()=>K.upP=true);tapBtn('bDn',()=>K.dnP=true);tapBtn('bHonk',()=>K.honkP=true);tapBtn('bHaz',()=>K.hazP=true);tapBtn('bPause',()=>K.pauseP=true);
tapBtn('bLight',()=>K.lightP=true);tapBtn('bFog',()=>K.fogP=true);tapBtn('bDoor',()=>K.doorP=true);tapBtn('bRev',()=>K.revP=true);tapBtn('bRadio',()=>K.radioP=true);tapBtn('bHb',()=>K.hbP=true);
tapBtn('bCruise',()=>{const b=$('cruiseBar');b.style.display=b.style.display==='flex'?'none':'flex';});
document.querySelectorAll('#cruiseBar button').forEach(b=>{const go=e=>{e.preventDefault();haptic(12);K.cruiseSet=+b.dataset.v;$('cruiseBar').style.display='none';};b.addEventListener('touchstart',go,{passive:false});b.addEventListener('mousedown',go);});
document.querySelectorAll('#touch .ctl').forEach(el=>{el.addEventListener('touchstart',()=>haptic(10),{passive:true});});
function toast(msg,ms){const t=$('toast');t.textContent=msg;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,ms||2600);}
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
/* teljes képernyő és fekvő tájolás (ahol a rendszer engedi) */
let fsTried=false;
function goFullscreen(){if(fsTried||!isTouch)return;fsTried=true;const el=document.documentElement;
 try{const p=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen?el.webkitRequestFullscreen():null;
  if(p&&p.then)p.then(()=>{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}).catch(()=>{});}catch(e){}}
window.addEventListener('pointerdown',()=>{if(!isStandalone())goFullscreen();},{once:false,passive:true});
document.addEventListener('gesturestart',e=>e.preventDefault());document.addEventListener('dblclick',e=>e.preventDefault());
/* telepítés */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;MENU_SIG='?';});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;toast('Telepítve! Megtalálod a kezdőképernyőn.');});
async function doInstall(){if(isStandalone()){toast('A játék már telepítve van.');return;}
 if(deferredPrompt){deferredPrompt.prompt();try{const r=await deferredPrompt.userChoice;if(r.outcome==='accepted')toast('Telepítés folyamatban...');}catch(e){}deferredPrompt=null;return;}
 const ios=/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)&&'ontouchend' in document;
 toast(ios?'iPhone / iPad: Safari Megosztás gomb, majd „Főképernyőhöz adás”':'Böngésző menü (⋮), majd „Alkalmazás telepítése”',6000);}
async function doShare(){const url=location.href.split('#')[0].split('?')[0];const data={title:'Családi Vakáció',text:'Gyere velünk Európa körútra! Családi autós kalandjáték.',url:url};
 try{if(navigator.share){await navigator.share(data);return;}await navigator.clipboard.writeText(url);toast('A link a vágólapra másolva!');}
 catch(e){if(e&&e.name==='AbortError')return;try{window.prompt('Másold ki a linket:',url);}catch(_){}}}
/* frissítés százalékkal */
let updating=false,updPct=0,updLabel='Frissítés',newVer=null;
function verCmp(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return d;}return 0;}
function setUpd(p,l){updPct=p;if(l)updLabel=l;const b=document.querySelector('[data-a="update"]');if(b){b.querySelector('.fill').style.width=p+'%';b.querySelector('.lbl').textContent=updLabel;}}
async function checkUpdate(){if(location.protocol==='file:'||!navigator.onLine)return;try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();
 if(verCmp(v.version,APP_VERSION)>0){newVer=v.version;updLabel='Új verzió: v'+v.version;MENU_SIG='?';toast('Új verzió érhető el: v'+v.version);}}catch(e){}}
async function doUpdate(){if(updating)return;updating=true;
 try{if(location.protocol==='file:'||!('caches' in window)){setUpd(100,'Újratöltés... 100%');setTimeout(()=>location.reload(),400);return;}
  if(!navigator.onLine){updating=false;toast('Nincs internet. A játék offline is működik.');return;}
  setUpd(1,'Ellenőrzés... 1%');const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();
  const files=v.files||{},names=Object.keys(files),total=names.reduce((s,n)=>s+(files[n]||0),0)||1;let done=0;const cache=await caches.open('csaladi-vakacio');
  for(const n of names){const res=await fetch(n+'?v='+v.version+'&t='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error(n);const type=res.headers.get('content-type')||'';let blob;
   if(res.body&&res.body.getReader){const rd=res.body.getReader(),ch=[];let got=0;for(;;){const c=await rd.read();if(c.done)break;ch.push(c.value);got+=c.value.length;const p=Math.min(99,Math.floor((done+Math.min(got,files[n]))/total*100));setUpd(p,'Letöltés: '+p+'%');}blob=new Blob(ch,{type:type});}
   else blob=await res.blob();done+=files[n];await cache.put(new Request(n),new Response(blob,{headers:{'content-type':type}}));if(n==='index.html')await cache.put(new Request('./'),new Response(blob,{headers:{'content-type':type}}));}
  if('serviceWorker' in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg){try{await reg.update();}catch(e){}}}
  setUpd(100,'Kész: v'+v.version+' (100%)');haptic([20,40,20]);toast('Frissítve: v'+v.version+'. Újraindul...');if(P&&G.state==='play')save(P.dist);setTimeout(()=>location.reload(),900);}
 catch(e){updating=false;setUpd(0,'Frissítés');toast('Nem sikerült frissíteni. Van internetkapcsolat?');}}
/* offline működés automatikusan */
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
window.addEventListener('offline',()=>toast('Offline mód: a játék internet nélkül is fut.'));window.addEventListener('online',()=>{toast('Újra van internet.');checkUpdate();});
setTimeout(checkUpdate,1500);
/* menük */
function titleAct(a){const opts=titleOpts();const i=opts.findIndex(o=>o.a===a);if(i>=0){G.menu=i;K.enterP=true;}}
function menuDef(){const s=G.state;
 if(G.paused&&s==='play')return {cls:'center',title:'Szünet',items:[{a:'resume',l:'Folytatás',ic:'▶',c:'primary'},{a:'radio',l:'Rádió: '+(radio.on?STATIONS[radio.idx].name:'ki'),ic:'📻'},{a:'quit',l:'Mentés és kilépés a főmenübe',ic:'⌂'},{a:'update',l:updLabel,ic:'⟳',fill:1}]};
 if(s==='title'){const it=[];if(G.save&&(G.save.leg>0||G.save.dist>0))it.push({a:'cont',l:titleOpts().find(o=>o.a==='cont').l,ic:'▶',c:'primary'});
  it.push({a:'new',l:'Új utazás Komáromból',ic:'🚐',c:it.length?'':'primary'},{a:'color',l:'Autó színe: '+carColor,ic:'🎨'},{a:'ts',l:'Utazás: '+(TS_OPTS.find(q=>q[0]===G.ts)||TS_OPTS[0])[1],ic:'⏱'},{a:'specs',l:'Az autó adatai',ic:'ℹ'});
  if(!isStandalone())it.push({a:'install',l:'Telepítés',ic:'⬇',c:deferredPrompt?'new':''});
  it.push({a:'share',l:'Megosztás',ic:'↗'},{a:'update',l:updLabel,ic:'⟳',fill:1,c:newVer?'new':''},{a:'music',l:'Zene: '+(musicOn?'be':'ki'),ic:'♪'});
  return {cls:'',title:'',items:it,ver:true};}
 if(s==='map')return {cls:'bottom',items:[{a:'go',l:'Indulás',ic:'▶',c:'primary'},{a:'home',l:'Főmenü',ic:'⌂'}]};
 if(s==='specs')return {cls:'bottom',items:[{a:'go',l:'Vissza',ic:'◀'}]};
 if(s==='postcard')return {cls:'bottom',items:[{a:'go',l:'Tovább',ic:'▶',c:'primary'}]};
 if(s==='over')return {cls:'bottom',items:[{a:'go',l:'Újrakezdés',ic:'⟳',c:'primary'}]};
 if(s==='win')return {cls:'bottom',items:[{a:'go',l:'Főmenü',ic:'⌂',c:'primary'}]};
 return null;}
let MENU_SIG='?';
function renderMenu(){const d=menuDef(),m=$('menu');const sig=d?JSON.stringify(d):'none';if(sig===MENU_SIG)return;MENU_SIG=sig;
 if(!d){m.style.display='none';return;}m.className=d.cls||'';m.innerHTML='';m.style.display='flex';if(d.title){const h=document.createElement('h2');h.textContent=d.title;m.appendChild(h);}
 for(const it of d.items){const b=document.createElement('button');b.className='mb '+(it.c||'');b.dataset.a=it.a;b.innerHTML=(it.fill?'<span class="fill" style="width:'+updPct+'%"></span>':'')+'<span class="ic"></span><span class="lbl"></span>';
  b.querySelector('.ic').textContent=it.ic||'';b.querySelector('.lbl').textContent=it.l;
  b.addEventListener('click',e=>{e.stopPropagation();haptic(12);initAudio();SFX.click();menuAction(it.a);});m.appendChild(b);}
 if(d.ver){const v=document.createElement('div');v.className='ver';v.textContent='Verzió: v'+APP_VERSION+(navigator.onLine?'':'  •  offline');m.appendChild(v);}}
function menuAction(a){
 if(a==='resume'){G.paused=false;}else if(a==='quit'){if(P)save(P.dist);G.paused=false;G.state='title';G.st=0;engine(0,0);}
 else if(a==='radio'){radioNext();}else if(a==='install')doInstall();else if(a==='share')doShare();else if(a==='update')doUpdate();
 else if(a==='music'){toggleMusic();}else if(a==='home'){G.state='title';G.st=0;}
 else if(a==='go'){K.enterP=true;G.st=Math.max(G.st,99);}
 else titleAct(a);
 MENU_SIG='?';}
const setC=(id,cls,on)=>{const el=$(id);if(el&&el.classList.contains(cls)!==!!on)el.classList.toggle(cls,!!on);};
let touchShown=null;
function appTick(){renderMenu();
 const tch=isTouch&&G.state==='play'&&!G.paused&&!MG&&!(P&&(P.sub==='pump'||P.sub==='shop'));if(tch!==touchShown){touchShown=tch;$('touch').style.display=tch?'block':'none';if(!tch)$('cruiseBar').style.display='none';}
 if(tch&&P){setC('bLight','act',P.lightMode>=1);$('lLight').textContent=['KI','HELYZ','TOMP','REFL'][P.lightMode];setC('bLight','blue',P.lightMode===3);
  setC('bFog','act',P.fogF||P.fogR);$('lFog').textContent=P.fogR?'KÖD 2':P.fogF?'KÖD 1':'KÖD';setC('bFlash','blue',P.flashOn);setC('bHaz','warn',P.haz);
  setC('bDoor','warn',P.doorsOpen);setC('bRev','act',P.rev);setC('bRadio','act',radio.on);setC('bCruise','blue',!!P.cruise);$('lCruise').textContent=P.cruise?P.cruise+'':'TEMPO';document.querySelectorAll('#cruiseBar button').forEach(b=>b.classList.toggle('on',+b.dataset.v===(P.cruise||0)));setC('bHb','warn',P.hb);}}
