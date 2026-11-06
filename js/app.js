'use strict';
/* =========================================================
   APP – natív menük, haptika, kezelőszervek, telepítés, megosztás,
   frissítés százalékkal, offline működés
   ========================================================= */
const $=id=>document.getElementById(id);
const haptic=(ms)=>{try{if(navigator.vibrate)navigator.vibrate(ms||12);}catch(e){}};
holdBtn('bGas','gas');holdBtn('bBr','brake');holdBtn('bFlash','flash');
tapBtn('bUp',()=>K.upP=true);tapBtn('bDn',()=>K.dnP=true);holdBtn('bHonk','horn');tapBtn('bHaz',()=>K.hazP=true);tapBtn('bPause',()=>K.pauseP=true);
tapBtn('bLight',()=>K.lightP=true);tapBtn('bFog',()=>K.fogP=true);tapBtn('bDoor',()=>K.doorP=true);tapBtn('bRadio',()=>K.radioP=true);tapBtn('bHb',()=>K.hbP=true);
function goHome(){if(G.state!=='play')return;if(MG)endMini();if(P)save(P.dist);G.paused=false;closeLedger&&G.ledger&&closeLedger();G.state='title';G.st=0;G.menu=0;engine(0,0);MENU_SIG='?';
 toast('Játékállás elmentve: '+fmt(G.trip.km,1)+' km, '+fmt(G.trip.money)+' Ft. A Folytatás gombbal innen indulsz tovább.',3600);}
function autoSave(){try{if(G.state==='play'&&P)save(P.dist);}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)autoSave();});window.addEventListener('pagehide',autoSave);
tapBtn('bHome',goHome);
{const el=$('bCruise');let tm=null,long=false;const down=e=>{e.preventDefault();e.stopPropagation();initAudio();long=false;el.classList.add('on');tm=setTimeout(()=>{long=true;haptic(25);const b=$('cruiseBar');b.style.display=b.style.display==='flex'?'none':'flex';},450);};
 const up=e=>{e.preventDefault();clearTimeout(tm);el.classList.remove('on');if(!long){haptic(12);K.cruiseTap=true;$('cruiseBar').style.display='none';}};
 el.addEventListener('touchstart',down,{passive:false});el.addEventListener('touchend',up,{passive:false});el.addEventListener('mousedown',down);el.addEventListener('mouseup',up);}
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
async function doInstall(){if(isStandalone()){toast('A játék már telepítve van.');return;}if(location.protocol.startsWith('http')){openInstall();return;}
 if(deferredPrompt){deferredPrompt.prompt();try{const r=await deferredPrompt.userChoice;if(r.outcome==='accepted')toast('Telepítés folyamatban...');}catch(e){}deferredPrompt=null;return;}
 const ios=/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)&&'ontouchend' in document;
 toast(ios?'iPhone / iPad: Safari Megosztás gomb, majd „Főképernyőhöz adás”':'Böngésző menü (⋮), majd „Alkalmazás telepítése”',6000);}

/* ---- telepítési ablak: megosztott linkről azonnal, böngészőből minden indításkor felajánlja ---- */
const UA=navigator.userAgent,IOS=/iphone|ipad|ipod/i.test(UA)||(/macintosh/i.test(UA)&&'ontouchend' in document),IPAD=/ipad/i.test(UA)||(/macintosh/i.test(UA)&&'ontouchend' in document),
 INAPP=/FBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|TikTok|Snapchat|MicroMessenger|; wv\)/i.test(UA),ANDROID=/android/i.test(UA);
const SHARE_SVG='<svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="#7fb2ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="10" width="14" height="11" rx="2.5" fill="none" stroke="#7fb2ff" stroke-width="2"/></svg>';
const ADD_SVG='<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#7fb2ff" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="#7fb2ff" stroke-width="2.2" stroke-linecap="round"/></svg>';
function instSteps(list){const el=$('instSteps');el.innerHTML=list.map((s,i)=>'<div class="st"><b>'+(i+1)+'</b>'+(s[1]||'')+'<span>'+s[0]+'</span></div>').join('');el.classList.add('on');}
function openInstall(){if(isStandalone()||location.protocol==='file:')return;const go=$('instGo'),arrow=$('instArrow');arrow.classList.remove('on');$('instSteps').classList.remove('on');go.style.display='';
 if(INAPP){$('instSub').textContent='Ez egy alkalmazáson belüli böngésző (pl. Messenger, Facebook), itt nem lehet telepíteni. Nyisd meg a linket a rendes böngészőben!';
  go.textContent=ANDROID?'Megnyitás Chrome-ban':'Link másolása';instSteps(IOS?[['Koppints a jobb felső ⋯ menüre'],['Válaszd: „Megnyitás Safariban” / „Megnyitás böngészőben”'],['Ott koppints a telepítésre']]:[['Koppints a „Megnyitás Chrome-ban” gombra'],['A Chrome-ban jóváhagyod a telepítést']]);}
 else if(IOS){$('instSub').textContent='iPhone-on és iPaden az Apple nem engedi az automatikus telepítést, de három koppintás az egész:';go.style.display='none';
  instSteps([['Koppints a <b style="display:inline;background:none;width:auto">Megosztás</b> gombra'+(IPAD?' (fent)':' (lent középen; ha nem látod, előbb a ⋯ gombra)'),SHARE_SVG],['Görgess le: „Főképernyőhöz adás”',ADD_SVG],['Jobb fent: „Hozzáadás”. Kész, az ikon a kezdőképernyőn van!']]);
  arrow.textContent=IPAD?'⬆':'⬇';arrow.style.cssText=IPAD?'top:6px;right:120px':'bottom:6px;left:calc(50% - 12px)';arrow.classList.add('on');}
 else{$('instSub').textContent='Egy érintés, és úgy fut, mint egy igazi alkalmazás.';go.textContent='⬇ Telepítés most';
  if(!deferredPrompt&&!('install' in navigator))instSteps([['Ha nem jön fel az ablak: böngésző menü (⋮ vagy ⋯)'],['„Alkalmazás telepítése” vagy „Hozzáadás a kezdőképernyőhöz”']]);}
 $('inst').classList.add('open');}
function closeInstall(later){$('inst').classList.remove('open');if(later){try{sessionStorage.setItem('cv-inst-later','1');}catch(e){}}}
$('instLater').addEventListener('click',e=>{e.stopPropagation();haptic(10);closeInstall(true);});
$('instGo').addEventListener('click',async e=>{e.stopPropagation();haptic(15);
 if(INAPP){const url=location.href.split('#')[0];if(ANDROID){location.href='intent://'+url.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end';}else{try{await navigator.clipboard.writeText(url);toast('Link másolva! Illeszd be a Safariba.');}catch(_){window.prompt('Másold ki a linket:',url);}}return;}
 try{if('install' in navigator&&typeof navigator.install==='function'){await navigator.install();closeInstall(false);return;}}catch(err){if(err&&err.name==='AbortError'){closeInstall(true);return;}}
 if(deferredPrompt){deferredPrompt.prompt();try{const r=await deferredPrompt.userChoice;closeInstall(r.outcome!=='accepted');if(r.outcome==='accepted')toast('Telepítés folyamatban...');}catch(_){}deferredPrompt=null;return;}
 instSteps([['Böngésző menü (⋮ vagy ⋯) jobb fent'],['„Alkalmazás telepítése” vagy „Hozzáadás a kezdőképernyőhöz”']]);toast('A böngésző menüjéből telepítheted.',3500);});
$('inst').addEventListener('pointerdown',e=>e.stopPropagation());
window.addEventListener('appinstalled',()=>closeInstall(false));
{const viaLink=/[?&]install=1/.test(location.search);let later=false;try{later=sessionStorage.getItem('cv-inst-later')==='1';}catch(e){}
 if(!isStandalone()&&location.protocol.startsWith('http')&&(viaLink||!later))window.addEventListener('load',()=>setTimeout(()=>{if(!isStandalone())openInstall();},viaLink?900:2200));}
async function doShare(){const url=location.href.split('#')[0].split('?')[0]+'?install=1';const data={title:'Családi Vakáció',text:'Gyere velünk Európa körútra! Családi autós kalandjáték.',url:url};
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
/* automatikus offline: minden fájl letöltése a háttérben, új verzió csendes letöltése */
async function autoOffline(){if(!('caches' in window)||!location.protocol.startsWith('http')||!navigator.onLine)return;
 try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();const names=Object.keys(v.files||{});const cache=await caches.open('csaladi-vakacio');
  const newer=verCmp(v.version,APP_VERSION)>0;let got=0;
  for(const n of names){const have=await cache.match(n,{ignoreSearch:true});if(have&&!newer)continue;const res=await fetch(n+'?v='+v.version,{cache:'no-store'});if(!res.ok)continue;
   const b=await res.blob(),h={headers:{'content-type':res.headers.get('content-type')||''}};await cache.put(new Request(n),new Response(b,h));if(n==='index.html')await cache.put(new Request('./'),new Response(b,h));got++;}
  let first=false;try{first=!localStorage.getItem('cv-offline');localStorage.setItem('cv-offline',v.version);}catch(e){}
  if(newer){newVer=v.version;updLabel='Újraindítás: v'+v.version;MENU_SIG='?';toast('Új verzió letöltve (v'+v.version+'). A következő indításkor érvényes, vagy koppints a frissítésre.',4200);}
  else if(first)toast('Offline mód kész: a játék internet nélkül is fut.',3200);}catch(e){}}
window.addEventListener('load',()=>setTimeout(autoOffline,2500));
window.addEventListener('offline',()=>toast('Offline mód: a játék internet nélkül is fut.'));window.addEventListener('online',()=>{toast('Újra van internet.');autoOffline();});
setTimeout(checkUpdate,1500);
/* menük */
function titleAct(a){const opts=titleOpts();const i=opts.findIndex(o=>o.a===a);if(i>=0){G.menu=i;K.enterP=true;}}
function menuDef(){const s=G.state;if(G.ledger)return null;
 if(G.paused&&s==='play')return {cls:'center',title:'Szünet',items:[{a:'resume',l:'Folytatás',ic:'▶',c:'primary'},{a:'log',l:'Költségnapló: '+fmt(G.trip.money)+' Ft',ic:'📒'},{a:'radio',l:'Rádió: '+(radio.on?STATIONS[radio.idx].name:'ki'),ic:'📻'},{a:'quit',l:'Mentés és kilépés a főmenübe',ic:'⌂'},{a:'update',l:updLabel,ic:'⟳',fill:1}]};
 if(s==='title'){const it=[];if(G.save&&(G.save.leg>0||G.save.dist>0))it.push({a:'cont',l:titleOpts().find(o=>o.a==='cont').l,ic:'▶',c:'primary'});
  it.push({a:'new',l:'Új utazás Komáromból',ic:'🚐',c:it.length?'':'primary'},{a:'color',l:'Autó színe: '+carColor,ic:'🎨'},{a:'ts',l:'Utazás: '+(TS_OPTS.find(q=>q[0]===G.ts)||TS_OPTS[0])[1],ic:'⏱'},{a:'specs',l:'Az autó adatai',ic:'ℹ'});
  if(!isStandalone())it.push({a:'install',l:'Telepítés',ic:'⬇',c:deferredPrompt?'new':''});
  it.push({a:'share',l:'Megosztás',ic:'↗'},{a:'update',l:updLabel,ic:'⟳',fill:1,c:newVer?'new':''},{a:'music',l:'Zene: '+(musicOn?'be':'ki'),ic:'♪'});
  if(introT()<150)return null;
  // filmes elrendezés: nagy főgombok, alattuk csempék
  for(const x of it){if(x.a==='cont'||x.a==='new'){x.c=(x.c==='primary'?'hero':'hero2');const m=x.l.match(/^(.*?) \((.*)\)$/);if(m){x.l=m[1];x.sub=m[2];}else if(x.a==='new')x.sub='Komárom, Táncsics Mihály utca';}
   else{x.tile=1;const m=x.l.match(/^(.*?): (.*)$/);if(m){x.l=m[1];x.sub=m[2];}}}
  return {cls:'cine',title:'',items:it,ver:true};}
 if(s==='map')return {cls:'bottom',items:[{a:'go',l:'Indulás',ic:'▶',c:'primary'},{a:'log',l:'Napló',ic:'📒'},{a:'home',l:'Főmenü',ic:'⌂'}]};
 if(s==='specs')return {cls:'bottom',items:[{a:'go',l:'Vissza',ic:'◀'}]};
 if(s==='postcard')return {cls:'bottom',items:[{a:'go',l:'Tovább',ic:'▶',c:'primary'}]};
 if(s==='over')return {cls:'bottom',items:[{a:'go',l:'Újrakezdés',ic:'⟳',c:'primary'},{a:'log',l:'Napló',ic:'📒'}]};
 if(s==='win')return {cls:'bottom',items:[{a:'go',l:'Főmenü',ic:'⌂',c:'primary'},{a:'log',l:'Napló',ic:'📒'}]};
 return null;}

/* ---- költségnapló ---- */
let LEDGER_F='all';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function openLedger(from){if(!G.trip)return;G.ledger=from||'menu';if(from==='play')G.paused=true;haptic(12);renderLedger();$('ledger').classList.add('open');MENU_SIG='?';}
function closeLedger(){if(!G.ledger)return;const f=G.ledger;G.ledger=null;$('ledger').classList.remove('open');if(f==='play'&&G.state==='play')G.paused=false;MENU_SIG='?';}
function renderLedger(){const T=G.trip,log=T.log||[],tot=ledgerTotals(T);let out=0,inc=0,nOut=0;for(const e of log){if(e.c==='start')continue;if(e.a<0){out-=e.a;nOut++;}else inc+=e.a;}
 const start=log.length&&log[0].c==='start'?log[0].a:500000,ok=start-out+inc===T.money&&tot.sum===T.money;
 let h='<div><div class="card"><div class="row"><span>Egyenleg</span></div><div class="bal '+(T.money<0?'neg':'')+'">'+fmt(T.money)+' Ft</div>'+
  '<div class="row"><span>Kezdő keret</span><b>'+fmt(start)+' Ft</b></div><div class="row"><span>Kiadások ('+nOut+' tétel)</span><b class="neg">−'+fmt(out)+' Ft</b></div>'+
  '<div class="row"><span>Bevételek, nyeremények</span><b class="pos">+'+fmt(inc)+' Ft</b></div><div class="row tot"><span>Egyenleg</span><b>'+fmt(start-out+inc)+' Ft</b></div>'+
  '<span class="ok '+(ok?'':'bad')+'">'+(ok?'✓ Forintra pontosan egyezik':'Eltérés: '+fmt(T.money-(start-out+inc))+' Ft')+'</span></div>';
 const cats=Object.entries(tot.cats).filter(([c,v])=>v<0).sort((a,b)=>a[1]-b[1]);
 h+='<div class="card" style="margin-top:12px"><div class="row"><span>Mire ment el a pénz?</span></div>';
 if(!cats.length)h+='<div class="empty">Még nem költöttünk semmit.</div>';
 for(const [c,v] of cats){const cd=CATS[c]||CATS.other,pc=out?-v/out*100:0;h+='<div class="cat"><div class="t"><span><i class="dot" style="background:'+cd[1]+'"></i>'+esc(cd[0])+'</span><span>'+fmt(-v)+' Ft <span style="color:#8a96a6">('+fmt(pc,0)+'%)</span></span></div><div class="barw"><i style="width:'+pc.toFixed(1)+'%;background:'+cd[1]+'"></i></div></div>';}
 const incs=Object.entries(tot.cats).filter(([c,v])=>v>0);for(const [c,v] of incs){const cd=CATS[c]||CATS.income;h+='<div class="cat"><div class="t"><span><i class="dot" style="background:'+cd[1]+'"></i>'+esc(cd[0])+'</span><span class="pos">+'+fmt(v)+' Ft</span></div></div>';}
 h+='<div class="row" style="margin-top:10px"><span>Tankolt benzin</span><b>'+fmt(T.fuelUsed,1)+' l elfogyott</b></div></div></div>';
 h+='<div><div class="tabs">'+[['all','Mind'],['out','Kiadások'],['in','Bevételek']].map(([k,l])=>'<button data-f="'+k+'" class="'+(LEDGER_F===k?'on':'')+'">'+l+'</button>').join('')+'</div>';
 const list=log.filter(e=>e.c!=='start'&&(LEDGER_F==='all'||(LEDGER_F==='out'?e.a<0:e.a>0)));
 if(!list.length)h+='<div class="empty">Nincs ilyen tétel.</div>';
 let leg=-1;for(let i=list.length-1;i>=0;i--){const e=list[i];if(e.leg!==leg){leg=e.leg;const L=LEGS[leg];h+='<h4>'+(leg+1)+'. szakasz: '+esc(L?L.from.split(',')[0]+' → '+L.to:'')+'</h4>';}
  const cd=CATS[e.c]||CATS.other;h+='<div class="e"><i class="dot" style="background:'+cd[1]+'"></i><div class="m"><div class="l">'+esc(e.l)+'</div><div class="s">'+esc(cd[0])+' · '+fmt(e.km,1)+' km'+(e.d?' · '+esc(e.d):'')+'</div></div>'+
  '<div class="a '+(e.a<0?'neg':'pos')+'">'+(e.a<0?'−':'+')+fmt(Math.abs(e.a))+' Ft<small>marad: '+fmt(e.b)+' Ft</small></div></div>';}
 h+='</div>';const b=document.querySelector('#ledger .body');const sc=b.scrollTop;b.innerHTML=h;b.scrollTop=sc;
 b.querySelectorAll('.tabs button').forEach(x=>x.addEventListener('click',ev=>{ev.stopPropagation();LEDGER_F=x.dataset.f;haptic(8);SFX.click();renderLedger();}));}
$('ledger').addEventListener('click',e=>{if(e.target.id==='ledger'){closeLedger();SFX.click();}});
document.querySelector('#ledger .x').addEventListener('click',e=>{e.stopPropagation();haptic(10);SFX.click();closeLedger();});
['pointerdown','touchstart'].forEach(ev=>$('ledger').addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
window.addEventListener('keydown',e=>{if(G.ledger&&(e.key==='Escape'||e.key==='n'||e.key==='N')){e.stopImmediatePropagation();closeLedger();}},true);
let MENU_SIG='?',MENU_KIND='';
function renderMenu(){const d=menuDef(),m=$('menu');const sig=d?JSON.stringify(d):'none';if(sig===MENU_SIG)return;MENU_SIG=sig;
 if(!d){m.style.display='none';MENU_KIND='';return;}const kind=G.state+'|'+(d.cls||'')+'|'+(d.title||'');m.className=(d.cls||'')+(kind!==MENU_KIND?' anim':'');MENU_KIND=kind;m.innerHTML='';m.style.display='flex';let grid=null,idx=0;if(d.title){const h=document.createElement('h2');h.textContent=d.title;m.appendChild(h);}
 for(const it of d.items){const b=document.createElement('button');b.className='mb '+(it.c||'');b.dataset.a=it.a;b.innerHTML=(it.fill?'<span class="fill" style="width:'+updPct+'%"></span>':'')+'<span class="ic"></span><span class="lbl"></span>';
  b.querySelector('.ic').textContent=it.ic||'';b.querySelector('.lbl').textContent=it.l;if(it.sub){const sb=document.createElement('span');sb.className='sub';sb.textContent=it.sub;b.querySelector('.lbl').appendChild(sb);}b.style.setProperty('--i',idx++);if(it.tile)b.classList.add('tile');
  b.addEventListener('click',e=>{e.stopPropagation();haptic(12);initAudio();SFX.click();menuAction(it.a);});if(it.tile){if(!grid){grid=document.createElement('div');grid.className='grid';m.appendChild(grid);}grid.appendChild(b);}else m.appendChild(b);}
 if(d.ver){const v=document.createElement('div');v.className='ver';v.textContent='Verzió: v'+APP_VERSION+(navigator.onLine?'':'  •  offline');m.appendChild(v);}}
function menuAction(a){
 if(a==='resume'){G.paused=false;}else if(a==='quit'){goHome();}
 else if(a==='log'){openLedger(G.state==='play'?'pause':'menu');}else if(a==='radio'){radioNext();}else if(a==='install')doInstall();else if(a==='share')doShare();else if(a==='update')doUpdate();
 else if(a==='music'){toggleMusic();}else if(a==='home'){G.state='title';G.st=0;}
 else if(a==='go'){K.enterP=true;G.st=Math.max(G.st,99);}
 else titleAct(a);
 MENU_SIG='?';}
const setT=(id,v)=>{const el=$(id);if(el&&el.textContent!==v)el.textContent=v;};
const setC=(id,cls,on)=>{const el=$(id);if(el&&el.classList.contains(cls)!==!!on)el.classList.toggle(cls,!!on);};
let touchShown=null;
function appTick(){{const bl=G.state==='play'&&P&&!G.paused?Math.round(((G.drowsy||0)*0.6+(G.eyelid||0)*0.4)*4)/4:0,v=bl>0.05?'blur('+bl.toFixed(2)+'px)':'';if(appTick.f!==v){appTick.f=v;document.getElementById('c').style.filter=v;}}
appTick.n=(appTick.n||0)+1;if(G.state==='title'&&(appTick.n%20===0||!G.menuR)){const m=$('menu');if(m.style.display!=='none'&&m.offsetWidth){const r=m.getBoundingClientRect(),c=document.getElementById('c').getBoundingClientRect();if(c.width)G.menuR=clamp((r.right-c.left)/c.width*W,0,W*0.6);}}
{const tb=G.state==='play'&&!G.paused&&!MG&&!G.ledger&&!(P&&(P.sub==='pump'||P.sub==='shop'||P.sub==='wash'));const el=$('topbar');if(el.dataset.v!==String(tb)){el.dataset.v=tb;el.style.display=tb?'flex':'none';}}
 if(P&&G.state==='play'){const st=clamp((LANE[P.lane]-P.y)*2.2,-40,40);const v=st.toFixed(0)+'deg';if(appTick.st!==v){appTick.st=v;$('bHonk').style.setProperty('--steer',v);}}
if(G.ledger&&G.ledger==='play'&&!G.paused)closeLedger();if(G.ledger&&G.state==='title')closeLedger();if(G.t%4===0||MENU_SIG==='?')renderMenu();
 const tch=isTouch&&G.state==='play'&&!G.paused&&!MG&&!(P&&(P.sub==='pump'||P.sub==='shop'||P.sub==='wash'));if(tch!==touchShown){touchShown=tch;$('touch').style.display=tch?'block':'none';if(!tch)$('cruiseBar').style.display='none';}
 if(tch&&P){setC('bLight','act',P.lightMode>=1);setT('lLight',['KI','HELYZ','TOMP','REFL'][P.lightMode]);setC('bLight','blue',P.lightMode===3);
  setC('bFog','act',P.fogF||P.fogR);setT('lFog',P.fogR?'KÖD 2':P.fogF?'KÖD 1':'KÖD');setC('bFlash','blue',P.flashOn);setC('bHaz','warn',P.haz);
  setC('bDoor','warn',P.doorsOpen);setC('bRev','act',P.rev);setC('bRadio','act',radio.on);setC('bCruise','blue',!!P.cruise);setT('lCruise',P.cruise?String(P.cruise):'TEMPO');if(appTick.cr!==P.cruise){appTick.cr=P.cruise;document.querySelectorAll('#cruiseBar button').forEach(b=>b.classList.toggle('on',+b.dataset.v===(P.cruise||0)));}setC('bHb','warn',P.hb);}}
