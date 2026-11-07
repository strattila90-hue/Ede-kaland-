'use strict';
/* =========================================================
   CSALÁDI VAKÁCIÓ – alapok: vászon, rajzoló segédek, betűk, hang, bemenet
   ========================================================= */
const APP_VERSION='2.31.1';
const W=480,H=270,PX=70,ROADT=194,ROADB=262,LANE=[212,232,252];
const TAU=Math.PI*2;
let SC=2,LOWQ=false;
try{if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2){SC=1.5;LOWQ=true;}}catch(e){}
/* ---- HIBANAPLÓ: hibák, váratlan leállások, fontos események; a főmenüben megnézhető és elküldhető ---- */
const ELOG={k:'cv-log',max:250,list:[]};try{ELOG.list=JSON.parse(localStorage.getItem(ELOG.k)||'[]')||[];}catch(e){ELOG.list=[];}
function elogCtx(){try{const g=typeof G!=='undefined'?G:null,p=typeof P!=='undefined'?P:null;return (g?g.state:'?')+(g&&g.state==='play'?' sz'+(g.leg+1)+(p?' '+p.sub+' '+Math.round(p.kmh||0)+'km/h':''):'')+' SC'+SC+(typeof QT!=='undefined'&&QT!==null?' Q'+QT:'');}catch(e){return '?';}}
let ELOG_T=0;function elogSave(){clearTimeout(ELOG_T);ELOG_T=setTimeout(()=>{try{localStorage.setItem(ELOG.k,JSON.stringify(ELOG.list.slice(-ELOG.max)));}catch(e){}},300);}
function elog(kind,msg,now){const last=ELOG.list[ELOG.list.length-1];msg=String(msg).slice(0,400);
 if(last&&last.m===msg&&last.k===kind&&Date.now()-last.t<60000){last.n=(last.n||1)+1;last.t=Date.now();}else ELOG.list.push({t:Date.now(),k:kind,m:msg,c:elogCtx(),v:APP_VERSION});
 if(ELOG.list.length>ELOG.max)ELOG.list.splice(0,ELOG.list.length-ELOG.max);if(now){try{localStorage.setItem(ELOG.k,JSON.stringify(ELOG.list));}catch(e){}}else elogSave();}
window.addEventListener('error',e=>{elog('hiba',(e.message||'ismeretlen hiba')+(e.filename?' @ '+String(e.filename).split('/').pop()+':'+e.lineno+':'+e.colno:'')+(e.error&&e.error.stack?' | '+String(e.error.stack).split('\n').slice(1,3).join(' ').trim():''),true);});
window.addEventListener('unhandledrejection',e=>{const r=e.reason;elog('hiba','Kezeletlen ígéret: '+(r&&(r.message||r))+'',true);});
/* szívverés: ha a játék úgy ér véget, hogy nem a felhasználó zárta be (pl. a telefon kevés memória miatt leállította), a következő indításkor kiderül */
{let hb=null;try{hb=JSON.parse(localStorage.getItem('cv-hb')||'null');}catch(e){}const clean=(()=>{try{return localStorage.getItem('cv-clean');}catch(e){return '1';}})();
 if(hb&&clean!=='1'&&Date.now()-hb.t<6*3600e3){elog(hb.vis?'leállás':'info',(hb.vis?'VÁRATLAN LEÁLLÁS játék közben (a rendszer bezárta vagy összeomlott)':'A játékot a háttérben zárta be a rendszer')+': utolsó jel '+Math.round((Date.now()-hb.t)/1000)+' mp-e, '+Math.round(hb.up/60)+' perc futás után, állapot: '+hb.c+(hb.mem?', memória: '+hb.mem+' MB':'')+(hb.cv?', képtárak: '+hb.cv:''),true);}
 let nt='';try{nt=(performance.getEntriesByType('navigation')[0]||{}).type||'';}catch(e){}
 elog('info','Indulás v'+APP_VERSION+(nt?' ('+({navigate:'megnyitás',reload:'újratöltés',back_forward:'vissza/előre'}[nt]||nt)+')':'')+' | '+(navigator.userAgent.match(/Android[^;)]*|iPhone OS [\d_]+|iPad|Windows NT [\d.]+|Mac OS X [\d_]+/)||[''])[0]+' | '+(navigator.userAgent.match(/(Chrome|Firefox|Safari|SamsungBrowser|MiuiBrowser)\/[\d.]+/)||[''])[0]+' | képernyő '+screen.width+'x'+screen.height+' @'+(window.devicePixelRatio||1)+(navigator.deviceMemory?' | RAM '+navigator.deviceMemory+' GB':'')+(navigator.hardwareConcurrency?' | '+navigator.hardwareConcurrency+' mag':'')+(matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches?' | telepített':' | böngésző'),true);
 try{localStorage.setItem('cv-clean','0');}catch(e){}
 const t0=Date.now();const beat=()=>{let mem=0;try{if(performance.memory)mem=Math.round(performance.memory.usedJSHeapSize/1048576);}catch(e){}
  let cvs='';try{cvs=(typeof GLC!=='undefined'?'betűatlasz '+GLC.size:'')+(typeof STC!=='undefined'?', felirat '+STC.size:'')+(typeof SPR!=='undefined'?', tárgy '+SPR.size:'')+(typeof LTC!=='undefined'?', sáv '+LTC.size:'');}catch(e){}
  try{localStorage.setItem('cv-hb',JSON.stringify({t:Date.now(),up:(Date.now()-t0)/1000,c:elogCtx(),vis:!document.hidden,mem:mem,cv:cvs}));}catch(e){}};
 setInterval(beat,4000);beat();
 window.addEventListener('pagehide',e=>{beat();elog('info','Az oldal bezárult vagy leállt (pagehide'+(e.persisted?', megőrizve':'')+(document.hidden?', háttérben':', előtérben!')+')',true);try{localStorage.setItem('cv-clean','1');}catch(_){}});
 document.addEventListener('freeze',()=>{elog('info','A rendszer lefagyasztotta a háttérben (energiatakarékos)',true);});document.addEventListener('resume',()=>{elog('info','A rendszer visszaengedte (resume)');});
 document.addEventListener('visibilitychange',()=>{beat();elog('info',document.hidden?'Háttérbe került':'Előtérbe jött');});}
var MG=null;const cv=document.getElementById('c'),ctx=cv.getContext('2d',{alpha:false})||cv.getContext('2d');
cv.width=W*SC;cv.height=H*SC;
/* a kidobott vásznak grafikus memóriáját azonnal visszaadja (nem vár a böngésző takarítójára) */
/* Androidon a Chrome memóriahiánykor elveheti a vásznak tartalmát (contextlost), majd ÜRESEN adja vissza (contextrestored).
   Ilyenkor minden előre megrajzolt kép (betűk, autó, táj, műszerfal) üres lenne: mindet eldobjuk és újrarajzoljuk. */
let CVLOST=0,CVLOSTN=0;
function cvLost(){CVLOST=CVLOST||1;}
function watchCv(c){try{c.addEventListener('contextlost',cvLost);c.addEventListener('contextrestored',()=>{CVLOST=2;});}catch(e){}return c;}
function ctxLost(x){try{return !!(x&&x.isContextLost&&x.isContextLost());}catch(e){return false;}}
function flushCaches(why){freeMap(GLC,a=>a.c);freeMap(STC);if(typeof SPR!=='undefined')freeMap(SPR,e=>e.c);if(typeof LTC!=='undefined')freeMap(LTC);if(typeof CARC!=='undefined')freeMap(CARC);if(typeof TRC!=='undefined')freeMap(TRC);
 if(typeof onSC==='function')onSC();CVLOSTN++;if(typeof elog==='function')elog('info','Képtárak újrarajzolva ('+why+'), '+CVLOSTN+'. alkalom');}
/* képkockánként olcsó: ha jelzés jött, vagy (másodpercenként) egy minta-vászon elveszett, és már nincs elveszve, mindent újrarajzolunk */
function cvCheck(frm){if(!CVLOST&&frm%60===0){let lost=false;for(const a of GLC.values()){if(ctxLost(a.x)){lost=true;break;}}if(!lost&&typeof CARC!=='undefined')for(const c of CARC.values()){if(ctxLost(c.getContext('2d'))){lost=true;break;}}if(lost)CVLOST=1;}
 if(CVLOST&&!ctxLost(ctx)){const w=CVLOST===2?'visszaadott vászon':'elveszett vászon';CVLOST=0;flushCaches(w);}}
watchCv(cv);
function freeCv(c){try{if(c&&c.width){c.width=0;c.height=0;}}catch(e){}}
function freeMap(m,get){try{for(const v of m.values())freeCv(get?get(v):v);m.clear();}catch(e){}}
function setSC(v){if(v!==SC){freeMap(GLC,a=>a.c);freeMap(STC);if(typeof SPR!=='undefined')freeMap(SPR,e=>e.c);if(typeof LTC!=='undefined')freeMap(LTC);if(typeof CARC!=='undefined')freeMap(CARC);if(typeof TRC!=='undefined')freeMap(TRC);}SC=v;cv.width=Math.round(W*SC);cv.height=Math.round(H*SC);if(typeof onSC==='function')onSC();}
const isTouch=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
function resize(){const iw=window.innerWidth,ih=window.innerHeight,s=Math.min(iw/W,ih/H),cw=Math.round(W*s),ch=Math.round(H*s);
 cv.style.width=cw+'px';cv.style.height=ch+'px';
 // tablet / 16:10 / 4:3: ha alul legalább 60 px hely marad, a kép felülre kerül, a kezelőgombok a sávba
 const wrap=document.getElementById('wrap'),top=isTouch&&ih-ch>=60;document.body&&document.body.classList.toggle('tab',top);if(wrap){wrap.style.alignItems=top?'flex-start':'center';wrap.style.paddingTop=top?'env(safe-area-inset-top)':'0';}
 document.documentElement.style.setProperty('--gameb',Math.max(0,ih-(top?ch:(ih+ch)/2))+'px');
 document.getElementById('rot').style.display=(isTouch&&ih>iw)?'flex':'none';}
window.addEventListener('resize',resize);resize();

/* ---------- segédfüggvények ---------- */
function mk(w,h,sc){sc=sc||1;const c=watchCv(document.createElement('canvas'));c.width=Math.round(w*sc);c.height=Math.round(h*sc);const g=c.getContext('2d');g.setTransform(sc,0,0,sc,0,0);return [c,g];}
function hsh(n){n=n|0;n=Math.imul(n^(n>>>16),0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);n=n^(n>>>16);return (n>>>0)/4294967296;}
function rnd(a,b){return a+Math.random()*(b-a);}
function pick(a){return a[Math.random()*a.length|0];}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function lerp(a,b,t){return a+(b-a)*t;}
function hex2(h){const n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function rgb(a){return 'rgb('+(a[0]|0)+','+(a[1]|0)+','+(a[2]|0)+')';}
function mix(a,b,t){const A=hex2(a),B=hex2(b);return rgb([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t]);}
function shade(h,f){return rgb(hex2(h).map(v=>clamp(v*f,0,255)));}
function R(g,c,x,y,w,h){g.fillStyle=c;g.fillRect(x,y,w,h);}
function disc(g,c,cx,cy,r){if(r<=0)return;g.fillStyle=c;g.beginPath();g.arc(cx,cy,r+0.4,0,TAU);g.fill();}
function ell(g,c,cx,cy,rx,ry){g.fillStyle=c;g.beginPath();g.ellipse(cx,cy,Math.max(0.5,rx+0.4),Math.max(0.5,ry+0.4),0,0,TAU);g.fill();}
function poly(g,c,pts,ox,oy){ox=ox||0;oy=oy||0;g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(ox+p[0],oy+p[1]):g.moveTo(ox+p[0],oy+p[1]));g.closePath();g.fill();}
function line(g,c,x0,y0,x1,y1,w){g.strokeStyle=c;g.lineWidth=w||1;g.lineCap='round';g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();}
function rrect(g,x,y,w,h,r){if(w<0){x+=w;w=-w;}if(h<0){y+=h;h=-h;}r=Math.max(0,Math.min(r||0,w/2,h/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function frr(g,c,x,y,w,h,r){if(w<0){x+=w;w=-w;}if(h<0){y+=h;h=-h;}r=Math.max(0,Math.min(r||0,w/2,h/2));g.fillStyle=c;rrect(g,x,y,w,h,r);g.fill();}
function lg(g,x0,y0,x1,y1,stops){const gr=g.createLinearGradient(x0,y0,x1,y1);for(const s of stops)gr.addColorStop(s[0],s[1]);return gr;}
function rg(g,x,y,r0,r1,stops){const gr=g.createRadialGradient(x,y,r0,x,y,r1);for(const s of stops)gr.addColorStop(s[0],s[1]);return gr;}
function glow(g,x,y,r,col){if(LOWQ&&r<5)return;g.fillStyle=rg(g,x,y,0,r,[[0,col],[1,'rgba(0,0,0,0)']]);g.fillRect(x-r,y-r,r*2,r*2);}
function fmt(n,dec){dec=dec||0;const s=Math.abs(n).toFixed(dec).split('.');let i=s[0],o='';while(i.length>3){o=' '+i.slice(-3)+o;i=i.slice(0,-3);}return (n<0?'-':'')+i+o+(dec?','+s[1]:'');}

/* ---------- pixel betűkészlet (magyar ékezetekkel) ---------- */
const FONT={A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[14,17,16,16,16,17,14],D:[30,17,17,17,17,17,30],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],
G:[14,17,16,23,17,17,15],H:[17,17,17,31,17,17,17],I:[14,4,4,4,4,4,14],J:[7,2,2,2,2,18,12],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],
N:[17,25,21,19,17,17,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],Q:[14,17,17,17,21,18,13],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],
U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,21,10],X:[17,17,10,4,10,17,17],Y:[17,17,10,4,4,4,4],Z:[31,1,2,4,8,16,31],
'0':[14,17,19,21,25,17,14],'1':[4,12,4,4,4,4,14],'2':[14,17,1,2,4,8,31],'3':[30,1,1,14,1,1,30],'4':[2,6,10,18,31,2,2],'5':[31,16,30,1,1,17,14],'6':[6,8,16,30,17,17,14],
'7':[31,1,2,4,8,8,8],'8':[14,17,17,14,17,17,14],'9':[14,17,17,15,1,2,12],' ':[0,0,0,0,0,0,0],'.':[0,0,0,0,0,12,12],'·':[0,0,0,4,0,0,0],',':[0,0,0,0,12,4,8],'!':[4,4,4,4,4,0,4],
'?':[14,17,1,2,4,0,4],':':[0,12,12,0,12,12,0],'-':[0,0,0,31,0,0,0],'/':[1,1,2,4,8,16,16],'+':[0,4,4,31,4,4,0],'>':[8,4,2,1,2,4,8],'<':[2,4,8,16,8,4,2],
'(':[2,4,8,8,8,4,2],')':[8,4,2,2,2,4,8],"'":[4,4,8,0,0,0,0],'♥':[0,10,31,31,14,4,0],'*':[0,21,14,31,14,21,0],'%':[24,25,2,4,8,19,3],'Ø':[1,14,19,21,25,14,16],
'=':[0,0,31,0,31,0,0],'"':[10,10,0,0,0,0,0]};
const ACC={'Á':['A',1],'É':['E',1],'Í':['I',1],'Ó':['O',1],'Ú':['U',1],'Ö':['O',2],'Ü':['U',2],'Ő':['O',3],'Ű':['U',3]};
function glyph(g,ch,x,y,s){let a=0;if(ACC[ch]){a=ACC[ch][1];ch=ACC[ch][0];}const d=FONT[ch];if(!d)return;
 for(let r=0;r<7;r++){const row=d[r];if(!row)continue;for(let c=0;c<5;c++)if(row&(16>>c))g.fillRect(x+c*s,y+r*s,s,s);}
 if(a===1){g.fillRect(x+3*s,y-3*s,s,s);g.fillRect(x+2*s,y-2*s,s,s);}
 else if(a===2){g.fillRect(x+s,y-2*s,s,s);g.fillRect(x+3*s,y-2*s,s,s);}
 else if(a===3){g.fillRect(x+2*s,y-3*s,s,s);g.fillRect(x+s,y-2*s,s,s);g.fillRect(x+4*s,y-3*s,s,s);g.fillRect(x+3*s,y-2*s,s,s);}}
function textW(str,s){s=s||1;return String(str).length*6*s-s;}
/* betűk gyorsítótára ATLASZBAN: színenként és méretenként EGY kép, benne a betűk rácsban (nem betűnként külön vászon).
   Telefonon minden külön vászon külön grafikus memóriát foglal; ezer fölötti kis vászon miatt a rendszer leállíthatja a játékot. */
const GLC=new Map(),ACOLS=16,AROWS=8;
function quantCol(col){const m=/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/.exec(col);return m?'rgba('+m[1]+','+m[2]+','+m[3]+','+(Math.round(+m[4]*20)/20)+')':col;}
function glyphAtlas(col,s){const k=col+'|'+s+'|'+SC;let a=GLC.get(k);if(a){GLC.delete(k);GLC.set(k,a);return a;}
 if(GLC.size>=40){const k0=GLC.keys().next().value;freeCv(GLC.get(k0).c);GLC.delete(k0);}
 const cw=Math.ceil(6*s+1),ch=Math.ceil(10*s+1),pw=Math.ceil(cw*SC)+2,ph=Math.ceil(ch*SC)+2,c=watchCv(document.createElement('canvas'));c.width=pw*ACOLS;c.height=ph*AROWS;
 a={c:c,x:c.getContext('2d'),cw:cw,ch:ch,pw:pw,ph:ph,map:new Map(),n:0,col:col,s:s};GLC.set(k,a);return a;}
function glyphCell(a,chr){let i=a.map.get(chr);if(i!==undefined)return i;if(a.n>=ACOLS*AROWS)return -1;i=a.n++;
 a.x.setTransform(SC,0,0,SC,(i%ACOLS)*a.pw+1,((i/ACOLS)|0)*a.ph+1);a.x.fillStyle=a.col;glyph(a.x,chr,0,a.s*3,a.s);a.map.set(chr,i);return i;}
function drawGlyph(g,chr,col,s,dx,dy){const a=glyphAtlas(col,s),i=glyphCell(a,chr);
 if(i<0){g.fillStyle=col;glyph(g,chr,dx,dy+s*3,s);return;}
 g.drawImage(a.c,(i%ACOLS)*a.pw+1,((i/ACOLS)|0)*a.ph+1,a.pw-2,a.ph-2,dx,dy,a.cw,a.ch);}
// teljes feliratok gyorsítótára: egy felirat egyetlen képmásolással rajzolódik ki
const STC=new Map();
function text(g,str,x,y,col,s,align,sh){s=Math.round((s||1)*20)/20||0.05;str=String(str).toUpperCase();const w=textW(str,s);if(align==='center')x-=w/2;else if(align==='right')x-=w;x=Math.round(x);y=Math.round(y);
 // a változó (számot tartalmazó) feliratok betűnként, a már kész betűképekből rajzolódnak: így nem keletkezik másodpercenként sok új vászon
 if(typeof col==='string'&&str.length>1&&!/[0-9]/.test(str)){const k=str+'|'+col+'|'+s+'|'+sh+'|'+SC;let c=STC.get(k);
  if(!c){if(STC.size>80){const k0=STC.keys().next().value;freeCv(STC.get(k0));STC.delete(k0);}const cw=Math.ceil(w+s*2+2),chh=Math.ceil(10*s+2);c=watchCv(document.createElement('canvas'));c.width=Math.ceil(cw*SC);c.height=Math.ceil(chh*SC);const x2=c.getContext('2d');x2.setTransform(SC,0,0,SC,0,0);textRaw(x2,str,0,s*3,col,s,sh);c.lw=cw;c.lh=chh;STC.set(k,c);}
  g.drawImage(c,x,y-s*3,c.lw,c.lh);return;}
 textRaw(g,str,x,y,col,s,sh);}
const GLWARM='ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÖŐÚÜŰ0123456789.,:-/%+()!?';
function warmGlyphs(){const cols=['#ffffff','#9fb0c2','#cfd6df','#ffd84a','rgba(10,12,20,0.85)','#ffb347','#7cd99c','#9fd8ff','#9cff9c'],todo=[];for(const c of cols)for(const ch of GLWARM)todo.push([ch,c]);
 const step=dl=>{let n=0;while(todo.length&&(dl?dl.timeRemaining()>2:n<40)){const [ch,c]=todo.pop();glyphCell(glyphAtlas(c,1),ch);n++;}if(todo.length)idle(step);};idle(step);}
function idle(fn){if(window.requestIdleCallback)requestIdleCallback(fn,{timeout:1500});else setTimeout(()=>fn(null),60);}
function textRaw(g,str,x,y,col,s,sh){
 if(typeof col!=='string'){if(sh!==null){g.fillStyle=sh||'rgba(10,12,20,0.85)';for(let i=0;i<str.length;i++)glyph(g,str[i],x+i*6*s+s*0.6,y+s*0.6,s);}g.fillStyle=col;for(let i=0;i<str.length;i++)glyph(g,str[i],x+i*6*s,y,s);return;}
 const ga=g.globalAlpha,sp=sh===null?null:splitA(sh||'rgba(10,12,20,0.85)'),cp=splitA(col);
 for(let i=0;i<str.length;i++){const ch=str[i];if(ch===' ')continue;const gx=x+i*6*s;
  if(sp){g.globalAlpha=ga*sp[1];drawGlyph(g,ch,sp[0],s,gx+s*0.6,y+s*0.6-s*3);}
  g.globalAlpha=ga*cp[1];drawGlyph(g,ch,cp[0],s,gx,y-s*3);}g.globalAlpha=ga;}
/* rgba(r,g,b,a) -> [átlátszatlan szín, a]: így egy áttűnő felirat nem kér minden átlátszósági fokhoz új betűatlaszt */
const SPLA=new Map();function splitA(col){let r=SPLA.get(col);if(r)return r;const m=/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/.exec(col);
 r=m?['rgb('+m[1]+','+m[2]+','+m[3]+')',Math.round(Math.min(1,+m[4])*20)/20]:[col,1];if(SPLA.size>400)SPLA.clear();SPLA.set(col,r);return r;}

/* ---------- hang ---------- */
let AC=null,master=null,musicOn=true,mStep=0,mNext=0;
/* hangerők: zene, motor, rádió, hanghatások (duda is) – külön csatornák, a beállításokban állíthatók */
let VOL={music:1,eng:1,radio:1,sfx:1,voice:1};try{Object.assign(VOL,JSON.parse(localStorage.getItem('cv-vol')||'{}'));}catch(e){}
let BUS=null;
function setVol(k,v){VOL[k]=clamp(+v||0,0,1);try{localStorage.setItem('cv-vol',JSON.stringify(VOL));}catch(e){}if(BUS&&BUS[k])BUS[k].gain.setTargetAtTime(VOL[k],AC.currentTime,0.05);}
/* ---- felolvasás: az utasok mondatait a készülék saját magyar hangja olvassa fel (Web Speech API, offline is megy, ha a telefonon van magyar hang)
   Nemek szerint külön hang: ha van férfi és női magyar hang, Apa és kis Atti a férfit, Anya, Anna és Petra a nőit kapja.
   Ha csak egy hang van (sok telefonon így van), a hangmagasság választja el őket: Apa mély, Anya közepes, a gyerekek magasak. */
const TTS={ok:typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined',m:null,f:null,hu:0,on:false,last:'',lastT:0};
const V_M=/szabolcs|tam[aá]s|\bmale\b|f[eé]rfi|\bman\b|-hub-|-hud-/i,V_F=/no[eé]mi|mariska|t[uü]nde|krisztina|eszter|female|\bn[oő]i\b|woman|-kfl-|-hue-/i;
function ttsVoices(){if(!TTS.ok)return;let vs=[];try{vs=speechSynthesis.getVoices()||[];}catch(e){}const hu=vs.filter(v=>/^hu/i.test(v.lang||''));TTS.hu=hu.length;
 TTS.m=hu.find(v=>V_M.test(v.name+' '+v.voiceURI))||null;TTS.f=hu.find(v=>v!==TTS.m&&V_F.test(v.name+' '+v.voiceURI))||hu.find(v=>v!==TTS.m)||null;}
if(TTS.ok){try{ttsVoices();speechSynthesis.addEventListener('voiceschanged',ttsVoices);}catch(e){}try{document.addEventListener('visibilitychange',()=>{if(document.hidden){try{speechSynthesis.cancel();}catch(e){}TTS.on=false;}});window.addEventListener('pagehide',()=>{try{speechSynthesis.cancel();}catch(e){}});}catch(e){}}
const VOICE_OF={apa:{g:'m',p:0.9,lp:0.55,r:1},anya:{g:'f',p:1.05,r:1.02},anna:{g:'f',p:1.3,r:1.07},petra:{g:'f',p:1.5,r:1.1},atti:{g:'m',p:1.75,lp:1.85,r:1.14,kid:1}};
function ttsClean(t){return String(t).replace(/[\u{1F000}-\u{1FFFF}☀-➿️‍]/gu,'').replace(/(\d)\s*km\/h/gi,'$1 kilométer per óra').replace(/km\/h/gi,'kilométer per óra')
 .replace(/(\d)\s*km\b/gi,'$1 kilométer').replace(/(\d)\s*Ft\b/g,'$1 forint').replace(/(\d)\s*m\b/g,'$1 méter').replace(/\s+/g,' ').trim();}
/* Android-alkalmazásban (APK) a beépített böngésző nem tud felolvasni: a telefon saját hangja szól a CVNative hídon át */
const NTV=(typeof window!=='undefined'&&window.CVNative)||null;
function speakNative(t,who){try{const pr=VOICE_OF[who]||VOICE_OF.anna,p=Math.min(2,pr.g==='m'&&pr.lp?pr.lp:pr.p);if(NTV.speak(t,p,pr.r,clamp(VOL.voice,0,1))){TTS.on=true;ttsDuck(true);}}catch(e){TTS.on=false;}}
if(NTV){try{elog('info','Android-alkalmazásként fut (APK '+NTV.version()+')');}catch(e){}}
if(typeof window!=='undefined')window.ttsNativeDone=()=>{TTS.on=false;ttsDuck(false);};
if(NTV){try{document.addEventListener('visibilitychange',()=>{if(document.hidden&&TTS.on){try{NTV.stopSpeak();}catch(e){}TTS.on=false;ttsDuck(false);}});}catch(e){}}
function ttsStop(){if(NTV){if(TTS.on){try{NTV.stopSpeak();}catch(e){}TTS.on=false;ttsDuck(false);}return;}if(!TTS.ok||!TTS.on)return;TTS.on=false;try{speechSynthesis.cancel();}catch(e){}ttsDuck(false);}
function ttsDuck(on){try{if(typeof radio!=='undefined'&&radio.bus&&AC)radio.bus.gain.setTargetAtTime(on?0.2:0.55,AC.currentTime,0.12);}catch(e){}}
function speak(txt,who,game){if(!(VOL.voice>0)||(!TTS.ok&&!NTV))return;const t=ttsClean(txt);if(!t)return;const now=Date.now();if(t===TTS.last&&now-TTS.lastT<4000)return;TTS.last=t;TTS.lastT=now;
 if(NTV){TTS.game=!!game;speakNative(t,who);return;}
 try{if(!TTS.m&&!TTS.f)ttsVoices();const pr=VOICE_OF[who]||VOICE_OF.anna,u=new SpeechSynthesisUtterance(t);u.lang='hu-HU';
  let v=pr.g==='m'?TTS.m:TTS.f,low=false;if(!v){v=TTS.f||TTS.m;low=pr.g==='m';}if(pr.kid&&!TTS.m){v=TTS.f;}if(v)u.voice=v;
  u.pitch=Math.min(2,low&&pr.lp?pr.lp:pr.p);u.rate=pr.r;u.volume=clamp(VOL.voice,0,1);
  u.onstart=()=>ttsDuck(true);u.onend=u.onerror=()=>{if(!speechSynthesis.speaking){TTS.on=false;ttsDuck(false);}};
  speechSynthesis.cancel();TTS.on=true;TTS.game=!!game;speechSynthesis.speak(u);}catch(e){TTS.on=false;}}
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return;}try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=0.5;master.connect(AC.destination);
 BUS={};for(const k of ['music','eng','radio','sfx']){const g=AC.createGain();g.gain.value=VOL[k];g.connect(master);BUS[k]=g;}}catch(e){AC=null;}}
const sfxOut=()=>BUS?BUS.sfx:master;
function tone(f,d,type,v,t0,slide,dest){if(!AC)return;const t=AC.currentTime+(t0||0);const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.linearRampToValueAtTime(Math.max(20,f+slide),t+d);
 g.gain.setValueAtTime(v||0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(dest||sfxOut());o.start(t);o.stop(t+d+0.02);}
function noise(d,v,t0,lp){if(!AC)return;const n=Math.max(1,AC.sampleRate*d|0),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
 const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp||1200;const g=AC.createGain();g.gain.value=v||0.3;s.connect(f);f.connect(g);g.connect(sfxOut());s.start(AC.currentTime+(t0||0));}

/* valódi autóduda: két tárcsás kürt (kb. 420 és 510 Hz, kis terc), torzítással és sávszűrővel, nyomva tartva szól */
let HORN=null;
function hornSet(on){if(!AC)return;const now=AC.currentTime;
 if(on&&!HORN){const out=AC.createGain();out.gain.setValueAtTime(0.0001,now);out.gain.exponentialRampToValueAtTime(0.32,now+0.012);
  const ws=AC.createWaveShaper(),cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/511.5-1;cv[i]=Math.tanh(x*3.2)/Math.tanh(3.2);}ws.curve=cv;
  const bp=AC.createBiquadFilter();bp.type='peaking';bp.frequency.value=2400;bp.Q.value=1.2;bp.gain.value=7;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=250;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;
  const pre=AC.createGain();pre.gain.value=0.55;ws.connect(bp);bp.connect(hp);hp.connect(lp);lp.connect(out);out.connect(sfxOut());const osc=[];
  for(const [f,v] of [[418,0.5],[421.5,0.25],[507,0.45],[510.5,0.22]]){const o=AC.createOscillator(),gg=AC.createGain();o.type='sawtooth';o.frequency.value=f;gg.gain.value=v;o.connect(gg);gg.connect(pre);o.start(now);osc.push(o);}
  pre.connect(ws);HORN={out:out,osc:osc,t0:now};}
 else if(!on&&HORN){const h=HORN;HORN=null;const end=Math.max(now,h.t0+0.24);h.out.gain.setValueAtTime(0.32,end);h.out.gain.exponentialRampToValueAtTime(0.0001,end+0.06);h.osc.forEach(o=>o.stop(end+0.08));}}
/* gyerek sikoltás: magas, vibráló hang formánsszűrővel */
function scream(f0,d,t0){if(!AC)return;const t=AC.currentTime+(t0||0);const o=AC.createOscillator(),lfo=AC.createOscillator(),lg2=AC.createGain(),g=AC.createGain(),f1=AC.createBiquadFilter(),f2=AC.createBiquadFilter();
 o.type='sawtooth';o.frequency.setValueAtTime(f0*0.8,t);o.frequency.linearRampToValueAtTime(f0*1.12,t+0.18);o.frequency.linearRampToValueAtTime(f0*0.92,t+d);lfo.frequency.value=7.5;lg2.gain.value=f0*0.05;lfo.connect(lg2);lg2.connect(o.frequency);
 f1.type='bandpass';f1.frequency.value=f0*2.1;f1.Q.value=3;f2.type='bandpass';f2.frequency.value=3200;f2.Q.value=2;
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.22,t+0.06);g.gain.setValueAtTime(0.22,t+d*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
 o.connect(f1);o.connect(f2);f1.connect(g);f2.connect(g);g.connect(sfxOut());o.start(t);lfo.start(t);o.stop(t+d+0.05);lfo.stop(t+d+0.05);}
/* gumicsikorgás */
function screech(v){if(!AC)return;const t=AC.currentTime;for(const f of [1480,1555]){const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f+Math.random()*60,t);o.frequency.linearRampToValueAtTime(f-80,t+0.16);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.045*v,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.17);o.connect(g);g.connect(sfxOut());o.start(t);o.stop(t+0.2);}
 noise(0.16,0.06*v,0,3500);}
/* irányjelző relé: kattanás és visszakattanás */
function blinkTick(on){tone(on?2100:1500,0.012,'square',0.05);tone(on?380:300,0.02,'triangle',0.05);}
const SFX={honk(){hornSet(true);setTimeout(()=>{if(!K.horn)hornSet(false);},60);},
 pick(){[523,659,784,1046].forEach((f,i)=>tone(f,0.08,'square',0.07,i*0.05));},hit(){noise(0.3,0.45,0,900);tone(180,0.25,'sawtooth',0.12,0,-120);},
 bump(){noise(0.09,0.25,0,350);},thunder(){noise(1.6,0.7,0,260);},splash(){noise(0.25,0.18,0,2600);},pop(){noise(0.45,0.4,0,3000);},
 win(){[523,659,784,1046,784,1046].forEach((f,i)=>tone(f,0.14,'square',0.09,i*0.12));},moo(){tone(140,0.5,'sawtooth',0.12,0,-30);},baa(){tone(330,0.35,'sawtooth',0.06,0,-40);},
 click(){tone(880,0.05,'square',0.05);},clunk(){noise(0.06,0.35,0,700);tone(120,0.08,'square',0.08);},cash(){tone(1200,0.08,'square',0.06);tone(1600,0.12,'square',0.06,0.09);},
 cry(){for(let i=0;i<3;i++)tone(700,0.35,'sawtooth',0.04,i*0.45,250);},siren(){for(let i=0;i<4;i++){tone(720,0.25,'square',0.05,i*0.5);tone(960,0.25,'square',0.05,i*0.5+0.25);}},
 tick(){tone(1800,0.02,'square',0.03);},alarm(){tone(880,0.15,'square',0.07);tone(660,0.15,'square',0.07,0.17);}};
const MEL=[72,0,76,79,76,0,72,74,76,76,74,72,74,0,67,0,72,0,76,79,81,79,76,72,74,76,74,71,72,0,0,0,77,0,77,76,74,0,72,74,76,0,76,74,72,0,67,0,69,71,72,74,76,77,79,0,79,77,76,74,72,0,0,0];
const BAS=[48,55,52,55,50,57,53,57,48,55,52,55,43,50,47,50,53,60,57,60,48,55,52,55,45,52,48,52,43,50,47,50];
const mf=n=>440*Math.pow(2,(n-69)/12);
function updateMusic(paused){if(!AC||!musicOn||paused)return;const spb=0.15;if(mNext<AC.currentTime)mNext=AC.currentTime+0.05;
 while(mNext<AC.currentTime+0.25){const n=MEL[mStep%MEL.length],d=mNext-AC.currentTime;if(n)tone(mf(n),0.13,'square',0.03,d,0,BUS&&BUS.music);if(mStep%2===0)tone(mf(BAS[(mStep>>1)%BAS.length]),0.26,'triangle',0.07,d,0,BUS&&BUS.music);mNext+=spb;mStep++;}}
function toggleMusic(){initAudio();musicOn=!musicOn;}

/* ---------- bemenet ---------- */
const K={horn:false,cruiseP:false,cruiseSet:null,hbP:false,flash:false,doorP:false,revP:false,radioP:false,gas:false,brake:false,pump:false,upP:false,dnP:false,honkP:false,enterP:false,pauseP:false,lightP:false,fogP:false,hazP:false,num:0};
/* ---- billentyűzet: két kiosztás (Klasszikus / Autós), plusz kiegészítő gombok ---- */
let KEYMAP='a';try{KEYMAP=localStorage.getItem('cv-keys')==='b'?'b':'a';}catch(e){}
function setKeymap(m){KEYMAP=m==='b'?'b':'a';try{localStorage.setItem('cv-keys',KEYMAP);}catch(e){}}
function kRole(e){const c=e.code||'',k=e.key;const inPlay=typeof G!=='undefined'&&G.state==='play'&&!G.paused&&!MG&&!G.gps&&!G.ledger;
 const up=c==='ArrowUp'||c==='KeyW'||c==='Numpad8',dn=c==='ArrowDown'||c==='KeyS'||c==='Numpad2',lf=c==='ArrowLeft'||c==='KeyA'||c==='Numpad4',rt=c==='ArrowRight'||c==='KeyD'||c==='Numpad6';
 if(!inPlay){if(up)return 'up';if(dn)return 'dn';if(rt)return 'gas';if(lf)return 'brake';}
 else if(KEYMAP==='b'){if(up)return 'gas';if(dn)return 'brake';if(lf)return 'up';if(rt)return 'dn';}
 else{if(rt)return 'gas';if(lf)return 'brake';if(up)return 'up';if(dn)return 'dn';}
 if(k===' '||c==='Numpad0')return 'pump';if(c==='KeyH'||c==='ShiftLeft'||c==='ShiftRight'||c==='NumpadAdd')return 'horn';
 if(k==='Enter'||c==='NumpadEnter')return 'enter';if(c==='KeyP'||k==='Escape'||c==='Pause')return 'pause';if(c==='KeyM')return 'music';
 if(c==='KeyL')return 'light';if(c==='KeyF')return 'fog';if(c==='KeyV')return 'haz';if(c==='KeyK')return 'flash';if(c==='KeyO')return 'door';
 if(c==='KeyB'||c==='KeyX'||c==='Numpad5')return 'hb';if(c==='KeyT')return 'cruise';if(c==='KeyE')return 'stop';if(c==='KeyN'||c==='Tab')return 'log';if(c==='KeyR')return 'rev';
 if(c==='KeyG')return 'gps';if(c==='KeyQ'||c==='KeyC')return 'radio';if(c==='KeyI'||k==='F1'||k==='?')return 'help';if(k==='F3')return 'perf';
 if(/^Digit[0-9]$/.test(c))return 'num'+c.slice(5);if(/^Numpad[1-9]$/.test(c)&&!up&&!dn&&!lf&&!rt)return 'num'+c.slice(6);
 return null;}
window.addEventListener('keydown',e=>{initAudio();const r=kRole(e);if(!r)return;const rep=e.repeat;if(e.code)KHELD.add(e.code);
 if(r==='gas'||r==='brake')kPedals();else if(r==='up'){if(!rep)K.upP=true;}else if(r==='dn'){if(!rep)K.dnP=true;}
 else if(r==='pump'){K.pump=true;if(!rep)K.brakeTap=true;}else if(r==='horn'){if(!rep){K.honkP=true;K.horn=true;}}
 else if(r==='enter'){K.enterP=true;K.enterKey=true;}else if(r==='pause'){if(typeof G!=='undefined'&&G.keysOpen){if(typeof closeKeys==='function')closeKeys();}else if(typeof G!=='undefined'&&G.albumOpen)closeAlbum();else if(typeof G!=='undefined'&&G.setOpen)closeSettings();else K.pauseP=true;}else if(r==='music'){toggleMusic();}
 else if(r==='light')K.lightP=true;else if(r==='fog')K.fogP=true;else if(r==='haz')K.hazP=true;else if(r==='flash')K.flash=true;else if(r==='door')K.doorP=true;
 else if(r==='hb'){if(!rep)K.hbP=true;}else if(r==='cruise')K.cruiseP=true;else if(r==='stop')K.stopP=true;else if(r==='log')K.logP=true;else if(r==='rev')K.revP=true;
 else if(r==='gps'){if(!rep&&typeof G!=='undefined'&&(G.state==='play'||G.state==='map'))K.gpsP=true;}else if(r==='radio')K.radioP=true;
 else if(r==='help'){if(!rep&&typeof toggleKeys==='function')toggleKeys();}
 else if(r==='perf'){if(!rep&&typeof PERF!=='undefined'){PERF.on=!PERF.on;try{localStorage.setItem('cv-perf',PERF.on?'1':'0');}catch(_){}}}
 else if(r.startsWith('num')){const n=+r.slice(3);
  // menet közben a számok a tempomatot állítják (1=50 ... 5=130, 0=ki); boltban, minijátékban választanak
  if(typeof G!=='undefined'&&G.state==='play'&&typeof P!=='undefined'&&P&&P.sub==='drive'&&!MG&&!G.paused){const v=[0,50,70,90,110,130][n];if(n===0||v)K.cruiseSet=n===0?0:v;}else if(n>0)K.num=n;}
 if(['pump','gas','brake','up','dn','log','help','perf'].includes(r)||r.startsWith('num'))e.preventDefault();});
const KHELD=new Set();
function kPedals(){const A=KEYMAP==='b'?{g:['ArrowUp','KeyW','Numpad8'],b:['ArrowDown','KeyS','Numpad2']}:{g:['ArrowRight','KeyD','Numpad6'],b:['ArrowLeft','KeyA','Numpad4']};
 K.gas=A.g.some(c=>KHELD.has(c));K.brake=A.b.some(c=>KHELD.has(c));}
window.addEventListener('keyup',e=>{const r=kRole(e);KHELD.delete(e.code);kPedals();
 if(r==='pump')K.pump=false;else if(r==='flash')K.flash=false;else if(r==='horn')K.horn=false;});
window.addEventListener('blur',()=>{KHELD.clear();K.gas=K.brake=K.pump=K.flash=K.horn=false;});
function holdBtn(id,key){const el=document.getElementById(id);const on=e=>{e.preventDefault();e.stopPropagation();initAudio();K[key]=true;el.classList.add('on');};const off=e=>{e.preventDefault();K[key]=false;el.classList.remove('on');};
 el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off,{passive:false});el.addEventListener('touchcancel',off,{passive:false});
 el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);}
function tapBtn(id,fn){const el=document.getElementById(id);const go=e=>{e.preventDefault();e.stopPropagation();initAudio();try{navigator.vibrate&&navigator.vibrate(10);}catch(_){}fn();el.classList.add('on');setTimeout(()=>el.classList.remove('on'),120);};
 el.addEventListener('touchstart',go,{passive:false});el.addEventListener('mousedown',go);}
let TAP=null,HOLD=null,TAPD=null;
cv.addEventListener('pointerdown',e=>{initAudio();const r=cv.getBoundingClientRect();TAP={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};TAPD={x:TAP.x,y:TAP.y};HOLD={x:TAP.x,y:TAP.y};if(!(typeof G!=='undefined'&&(G.state==='title'||G.paused)))K.enterP=true;});
cv.addEventListener('pointerup',()=>{HOLD=null;});cv.addEventListener('pointercancel',()=>{HOLD=null;});
function inRect(p,r){return p&&p.x>=r[0]&&p.x<=r[0]+r[2]&&p.y>=r[1]&&p.y<=r[1]+r[3];}
