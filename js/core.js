'use strict';
/* =========================================================
   CSALÁDI VAKÁCIÓ – alapok: vászon, rajzoló segédek, betűk, hang, bemenet
   ========================================================= */
const APP_VERSION='2.13.1';
const W=480,H=270,PX=70,ROADT=194,ROADB=262,LANE=[212,232,252];
const TAU=Math.PI*2;
let SC=2,LOWQ=false;
try{if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2){SC=1.5;LOWQ=true;}}catch(e){}
var MG=null;const cv=document.getElementById('c'),ctx=cv.getContext('2d',{alpha:false})||cv.getContext('2d');
cv.width=W*SC;cv.height=H*SC;
function setSC(v){SC=v;cv.width=Math.round(W*SC);cv.height=Math.round(H*SC);if(typeof onSC==='function')onSC();}
const isTouch=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
function resize(){const iw=window.innerWidth,ih=window.innerHeight,s=Math.min(iw/W,ih/H),cw=Math.round(W*s),ch=Math.round(H*s);
 cv.style.width=cw+'px';cv.style.height=ch+'px';
 // tablet / 16:10 / 4:3: ha alul legalább 60 px hely marad, a kép felülre kerül, a kezelőgombok a sávba
 const wrap=document.getElementById('wrap'),top=isTouch&&ih-ch>=60;document.body&&document.body.classList.toggle('tab',top);if(wrap){wrap.style.alignItems=top?'flex-start':'center';wrap.style.paddingTop=top?'env(safe-area-inset-top)':'0';}
 document.documentElement.style.setProperty('--gameb',Math.max(0,ih-(top?ch:(ih+ch)/2))+'px');
 document.getElementById('rot').style.display=(isTouch&&ih>iw)?'flex':'none';}
window.addEventListener('resize',resize);resize();

/* ---------- segédfüggvények ---------- */
function mk(w,h,sc){sc=sc||1;const c=document.createElement('canvas');c.width=Math.round(w*sc);c.height=Math.round(h*sc);const g=c.getContext('2d');g.setTransform(sc,0,0,sc,0,0);return [c,g];}
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
/* betűk gyorsítótára: minden betű színenként és méretenként egyszer rajzolódik pontokból, utána csak bemásolódik */
const GLC=new Map();
function glyphImg(ch,col,s){const k=ch+'|'+col+'|'+s+'|'+SC;let c=GLC.get(k);if(c)return c;if(GLC.size>1500)GLC.clear();
 const w=Math.ceil(6*s+1),h=Math.ceil(10*s+1);c=document.createElement('canvas');c.width=Math.ceil(w*SC);c.height=Math.ceil(h*SC);const x=c.getContext('2d');x.setTransform(SC,0,0,SC,0,0);x.fillStyle=col;glyph(x,ch,0,s*3,s);c.lw=w;c.lh=h;GLC.set(k,c);return c;}
// teljes feliratok gyorsítótára: egy felirat egyetlen képmásolással rajzolódik ki
const STC=new Map();
function text(g,str,x,y,col,s,align,sh){s=s||1;str=String(str).toUpperCase();const w=textW(str,s);if(align==='center')x-=w/2;else if(align==='right')x-=w;x=Math.round(x);y=Math.round(y);
 // a változó (számot tartalmazó) feliratok betűnként, a már kész betűképekből rajzolódnak: így nem keletkezik másodpercenként sok új vászon
 if(typeof col==='string'&&str.length>1&&!/[0-9]/.test(str)){const k=str+'|'+col+'|'+s+'|'+sh+'|'+SC;let c=STC.get(k);
  if(!c){if(STC.size>500)STC.delete(STC.keys().next().value);const cw=Math.ceil(w+s*2+2),chh=Math.ceil(10*s+2);c=document.createElement('canvas');c.width=Math.ceil(cw*SC);c.height=Math.ceil(chh*SC);const x2=c.getContext('2d');x2.setTransform(SC,0,0,SC,0,0);textRaw(x2,str,0,s*3,col,s,sh);c.lw=cw;c.lh=chh;STC.set(k,c);}
  g.drawImage(c,x,y-s*3,c.lw,c.lh);return;}
 textRaw(g,str,x,y,col,s,sh);}
const GLWARM='ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÖŐÚÜŰ0123456789.,:-/%+()!?';
function warmGlyphs(){const cols=['#ffffff','#9fb0c2','#cfd6df','#ffd84a','rgba(10,12,20,0.85)','#ffb347','#7cd99c','#9fd8ff','#9cff9c'],todo=[];for(const c of cols)for(const ch of GLWARM)todo.push([ch,c]);
 const step=dl=>{let n=0;while(todo.length&&(dl?dl.timeRemaining()>2:n<40)){const [ch,c]=todo.pop();glyphImg(ch,c,1);n++;}if(todo.length)idle(step);};idle(step);}
function idle(fn){if(window.requestIdleCallback)requestIdleCallback(fn,{timeout:1500});else setTimeout(()=>fn(null),60);}
function textRaw(g,str,x,y,col,s,sh){
 if(typeof col!=='string'){if(sh!==null){g.fillStyle=sh||'rgba(10,12,20,0.85)';for(let i=0;i<str.length;i++)glyph(g,str[i],x+i*6*s+s*0.6,y+s*0.6,s);}g.fillStyle=col;for(let i=0;i<str.length;i++)glyph(g,str[i],x+i*6*s,y,s);return;}
 const shc=sh===null?null:(sh||'rgba(10,12,20,0.85)');
 for(let i=0;i<str.length;i++){const ch=str[i];if(ch===' ')continue;const gx=x+i*6*s;
  if(shc){const c=glyphImg(ch,shc,s);g.drawImage(c,gx+s*0.6,y+s*0.6-s*3,c.lw,c.lh);}
  const c=glyphImg(ch,col,s);g.drawImage(c,gx,y-s*3,c.lw,c.lh);}}

/* ---------- hang ---------- */
let AC=null,master=null,musicOn=true,mStep=0,mNext=0;
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return;}try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=0.5;master.connect(AC.destination);}catch(e){AC=null;}}
function tone(f,d,type,v,t0,slide){if(!AC)return;const t=AC.currentTime+(t0||0);const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.linearRampToValueAtTime(Math.max(20,f+slide),t+d);
 g.gain.setValueAtTime(v||0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.02);}
function noise(d,v,t0,lp){if(!AC)return;const n=Math.max(1,AC.sampleRate*d|0),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
 const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp||1200;const g=AC.createGain();g.gain.value=v||0.3;s.connect(f);f.connect(g);g.connect(master);s.start(AC.currentTime+(t0||0));}

/* valódi autóduda: két tárcsás kürt (kb. 420 és 510 Hz, kis terc), torzítással és sávszűrővel, nyomva tartva szól */
let HORN=null;
function hornSet(on){if(!AC)return;const now=AC.currentTime;
 if(on&&!HORN){const out=AC.createGain();out.gain.setValueAtTime(0.0001,now);out.gain.exponentialRampToValueAtTime(0.32,now+0.012);
  const ws=AC.createWaveShaper(),cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/511.5-1;cv[i]=Math.tanh(x*3.2)/Math.tanh(3.2);}ws.curve=cv;
  const bp=AC.createBiquadFilter();bp.type='peaking';bp.frequency.value=2400;bp.Q.value=1.2;bp.gain.value=7;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=250;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;
  const pre=AC.createGain();pre.gain.value=0.55;ws.connect(bp);bp.connect(hp);hp.connect(lp);lp.connect(out);out.connect(master);const osc=[];
  for(const [f,v] of [[418,0.5],[421.5,0.25],[507,0.45],[510.5,0.22]]){const o=AC.createOscillator(),gg=AC.createGain();o.type='sawtooth';o.frequency.value=f;gg.gain.value=v;o.connect(gg);gg.connect(pre);o.start(now);osc.push(o);}
  pre.connect(ws);HORN={out:out,osc:osc,t0:now};}
 else if(!on&&HORN){const h=HORN;HORN=null;const end=Math.max(now,h.t0+0.24);h.out.gain.setValueAtTime(0.32,end);h.out.gain.exponentialRampToValueAtTime(0.0001,end+0.06);h.osc.forEach(o=>o.stop(end+0.08));}}
/* gyerek sikoltás: magas, vibráló hang formánsszűrővel */
function scream(f0,d,t0){if(!AC)return;const t=AC.currentTime+(t0||0);const o=AC.createOscillator(),lfo=AC.createOscillator(),lg2=AC.createGain(),g=AC.createGain(),f1=AC.createBiquadFilter(),f2=AC.createBiquadFilter();
 o.type='sawtooth';o.frequency.setValueAtTime(f0*0.8,t);o.frequency.linearRampToValueAtTime(f0*1.12,t+0.18);o.frequency.linearRampToValueAtTime(f0*0.92,t+d);lfo.frequency.value=7.5;lg2.gain.value=f0*0.05;lfo.connect(lg2);lg2.connect(o.frequency);
 f1.type='bandpass';f1.frequency.value=f0*2.1;f1.Q.value=3;f2.type='bandpass';f2.frequency.value=3200;f2.Q.value=2;
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.22,t+0.06);g.gain.setValueAtTime(0.22,t+d*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
 o.connect(f1);o.connect(f2);f1.connect(g);f2.connect(g);g.connect(master);o.start(t);lfo.start(t);o.stop(t+d+0.05);lfo.stop(t+d+0.05);}
/* gumicsikorgás */
function screech(v){if(!AC)return;const t=AC.currentTime;for(const f of [1480,1555]){const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f+Math.random()*60,t);o.frequency.linearRampToValueAtTime(f-80,t+0.16);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.045*v,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.17);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.2);}
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
 while(mNext<AC.currentTime+0.25){const n=MEL[mStep%MEL.length],d=mNext-AC.currentTime;if(n)tone(mf(n),0.13,'square',0.03,d);if(mStep%2===0)tone(mf(BAS[(mStep>>1)%BAS.length]),0.26,'triangle',0.07,d);mNext+=spb;mStep++;}}
function toggleMusic(){initAudio();musicOn=!musicOn;}

/* ---------- bemenet ---------- */
const K={horn:false,cruiseP:false,cruiseSet:null,hbP:false,flash:false,doorP:false,revP:false,radioP:false,gas:false,brake:false,pump:false,upP:false,dnP:false,honkP:false,enterP:false,pauseP:false,lightP:false,fogP:false,hazP:false,num:0};
window.addEventListener('keydown',e=>{initAudio();const k=e.key;
 if(k==='ArrowRight'||k==='d'||k==='D')K.gas=true;else if(k==='ArrowLeft'||k==='a'||k==='A')K.brake=true;
 else if(k==='ArrowUp'||k==='w'||k==='W'){if(!e.repeat)K.upP=true;}else if(k==='ArrowDown'||k==='s'||k==='S'){if(!e.repeat)K.dnP=true;}
 else if(k===' '){K.pump=true;if(!e.repeat)K.brakeTap=true;}else if(k==='h'||k==='H'){if(!e.repeat){K.honkP=true;K.horn=true;}}
 else if(k==='Enter'){K.enterP=true;K.enterKey=true;}else if(k==='p'||k==='P'||k==='Escape'){K.pauseP=true;}else if(k==='m'||k==='M'){toggleMusic();}
 else if(k==='l'||k==='L'){K.lightP=true;}else if(k==='f'||k==='F'){K.fogP=true;}else if(k==='v'||k==='V'){K.hazP=true;}
 else if(k==='k'||k==='K'){K.flash=true;}else if(k==='o'||k==='O'){K.doorP=true;}else if(k==='b'||k==='B'){K.hbP=true;}else if(k==='t'||k==='T'){K.cruiseP=true;}else if(k==='e'||k==='E'){K.stopP=true;}else if(k==='n'||k==='N'){K.logP=true;}else if(k==='r'||k==='R'){K.revP=true;}else if(k==='g'||k==='G'){if(!e.repeat&&typeof G!=='undefined'&&(G.state==='play'||G.state==='map'))K.gpsP=true;}else if(k==='q'||k==='Q'||k==='c'||k==='C'){K.radioP=true;}
 else if(k>='1'&&k<='9'){K.num=+k;}
 if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault();});
window.addEventListener('keyup',e=>{const k=e.key;if(k==='ArrowRight'||k==='d'||k==='D')K.gas=false;else if(k==='ArrowLeft'||k==='a'||k==='A')K.brake=false;else if(k===' ')K.pump=false;else if(k==='k'||k==='K')K.flash=false;else if(k==='h'||k==='H')K.horn=false;});
function holdBtn(id,key){const el=document.getElementById(id);const on=e=>{e.preventDefault();e.stopPropagation();initAudio();K[key]=true;el.classList.add('on');};const off=e=>{e.preventDefault();K[key]=false;el.classList.remove('on');};
 el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off,{passive:false});el.addEventListener('touchcancel',off,{passive:false});
 el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);}
function tapBtn(id,fn){const el=document.getElementById(id);const go=e=>{e.preventDefault();e.stopPropagation();initAudio();try{navigator.vibrate&&navigator.vibrate(10);}catch(_){}fn();el.classList.add('on');setTimeout(()=>el.classList.remove('on'),120);};
 el.addEventListener('touchstart',go,{passive:false});el.addEventListener('mousedown',go);}
let TAP=null,HOLD=null,TAPD=null;
cv.addEventListener('pointerdown',e=>{initAudio();const r=cv.getBoundingClientRect();TAP={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};TAPD={x:TAP.x,y:TAP.y};HOLD={x:TAP.x,y:TAP.y};if(!(typeof G!=='undefined'&&(G.state==='title'||G.paused)))K.enterP=true;});
cv.addEventListener('pointerup',()=>{HOLD=null;});cv.addEventListener('pointercancel',()=>{HOLD=null;});
function inRect(p,r){return p&&p.x>=r[0]&&p.x<=r[0]+r[2]&&p.y>=r[1]&&p.y<=r[1]+r[3];}
