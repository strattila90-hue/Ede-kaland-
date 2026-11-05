'use strict';
/* =========================================================
   APP – érintőgombok, telepítés (PWA), megosztás, frissítés
   ========================================================= */
holdBtn('bGas','gas');holdBtn('bBr','brake');tapBtn('bUp',()=>K.upP=true);tapBtn('bDn',()=>K.dnP=true);tapBtn('bHonk',()=>K.honkP=true);
tapBtn('bHaz',()=>K.hazP=true);tapBtn('bPause',()=>K.pauseP=true);tapBtn('bMus',toggleMusic);tapBtn('bLight',()=>K.lightP=true);tapBtn('bFog',()=>K.fogP=true);
const $=id=>document.getElementById(id);
$('ver').textContent='Verzió: v'+APP_VERSION;
function toast(msg,ms){const t=$('toast');t.textContent=msg;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,ms||2600);}
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
let deferredPrompt=null,appShown=null,touchShown=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('aInstall').classList.add('new');});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;toast('Telepítve! Megtalálod a kezdőképernyőn.');});
$('aInstall').addEventListener('click',async()=>{initAudio();
 if(isStandalone()){toast('A játék már telepítve van.');return;}
 if(deferredPrompt){deferredPrompt.prompt();try{const r=await deferredPrompt.userChoice;if(r.outcome==='accepted')toast('Telepítés folyamatban...');}catch(e){}deferredPrompt=null;return;}
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 toast(ios?'iPhone: Safari Megosztás gomb, majd „Főképernyőhöz adás”':'Böngésző menü (⋮), majd „Alkalmazás telepítése” vagy „Hozzáadás a kezdőképernyőhöz”',6000);});
$('aShare').addEventListener('click',async()=>{const url=location.href.split('#')[0].split('?')[0];const data={title:'Családi Vakáció',text:'Gyere velünk nyaralni! Családi autós kalandjáték Komáromtól Európán át.',url:url};
 try{if(navigator.share){await navigator.share(data);return;}await navigator.clipboard.writeText(url);toast('A link a vágólapra másolva!');}
 catch(e){if(e&&e.name==='AbortError')return;try{window.prompt('Másold ki a linket:',url);}catch(_){}}});
/* ---- frissítés százalékos betöltéssel ---- */
let updating=false;
function setUpd(p,label){$('aUpdate').querySelector('.fill').style.width=p+'%';if(label)$('aUpdate').querySelector('.lbl').textContent=label;}
function verCmp(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return d;}return 0;}
async function checkUpdate(){if(location.protocol==='file:')return;try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();
 if(verCmp(v.version,APP_VERSION)>0){$('aUpdate').classList.add('new');setUpd(0,'⟳ Új verzió: v'+v.version);toast('Új verzió érhető el: v'+v.version);}}catch(e){}}
$('aUpdate').addEventListener('click',async()=>{if(updating)return;updating=true;
 try{if(location.protocol==='file:'||!('caches' in window)){setUpd(100,'⟳ Újratöltés... 100%');setTimeout(()=>location.reload(),400);return;}
  setUpd(1,'⟳ Ellenőrzés... 1%');const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const v=await r.json();
  const files=v.files||{},names=Object.keys(files),total=names.reduce((s,n)=>s+(files[n]||0),0)||1;let done=0;const cache=await caches.open('csaladi-vakacio');
  for(const n of names){const res=await fetch(n+'?v='+v.version+'&t='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error(n);
   const type=res.headers.get('content-type')||'';let blob;
   if(res.body&&res.body.getReader){const rd=res.body.getReader(),chunks=[];let got=0;
    for(;;){const c=await rd.read();if(c.done)break;chunks.push(c.value);got+=c.value.length;const p=Math.min(99,Math.floor((done+Math.min(got,files[n]))/total*100));setUpd(p,'⟳ Letöltés: '+p+'%');}
    blob=new Blob(chunks,{type:type});}else blob=await res.blob();
   done+=files[n];await cache.put(new Request(n),new Response(blob,{headers:{'content-type':type}}));if(n==='index.html')await cache.put(new Request('./'),new Response(blob,{headers:{'content-type':type}}));}
  if('serviceWorker' in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg){try{await reg.update();}catch(e){}}}
  setUpd(100,'✓ Kész: v'+v.version+' (100%)');toast('Frissítve: v'+v.version+'. Újraindul...');setTimeout(()=>location.reload(),900);}
 catch(e){updating=false;setUpd(0,'⟳ Frissítés');toast('Nem sikerült frissíteni. Van internetkapcsolat?');}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
setTimeout(checkUpdate,1500);
/* a gombsor a főmenüben és szünetben látszik, az érintőgombok vezetés közben */
function appTick(){const show=G.state==='title'||G.paused;if(show!==appShown){appShown=show;$('appbar').style.display=show?'flex':'none';}
 const tch=isTouch&&G.state==='play'&&!G.paused&&!MG&&!(P&&P.sub==='pump');if(tch!==touchShown){touchShown=tch;$('touch').style.display=tch?'block':'none';}}
