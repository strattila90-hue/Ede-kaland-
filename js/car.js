'use strict';
/* =========================================================
   A CSALÁDI AUTÓ – saját tervezésű, 7 üléses 1.8 benzines egyterű
   Vektoros rajz minden nézetből: oldal, elöl, hátul, felül
   ========================================================= */
const CAR={name:'Családi egyterű 1.8 16V benzin',hp:125,torque:170,tank:60,urban:11.3,extra:6.1,comb:8.0,top:185,acc100:13.4,mass:1510,seats:7,len:4.59,wheelbase:2.728,tyre:'205/65 R15'};
const CP={hl:'#d6e0ea',l:'#adbccb',m:'#8a9bad',d:'#68798c',dd:'#47535f',tl:'#c62a35',amb:'#ffaa22',hd:'#fff3c4',led:'#ffffff',proj:'#cfeeff'};
const PALETTES={'Kékesszürke':['#dbe4ee','#aebdcc','#8a9bad','#66778a','#44505c'],'Pezsgőarany':['#f4ead0','#dccb98','#bfa972','#9a8553','#6c5c39'],
 'Piros':['#f6a59b','#dc5a4f','#b83a32','#8e2a25','#5f1c19'],'Fehér':['#ffffff','#eef1f4','#d6dce2','#b3bcc5','#7d8792'],
 'Éjkék':['#9fb6e0','#5a79b2','#3f5c92','#2d4570','#1d2c4b'],'Fekete':['#8a929c','#4a525c','#363c45','#262b32','#16191e']};
let carColor='Kékesszürke';
function setColor(name){if(!PALETTES[name])return;carColor=name;const p=PALETTES[name];CP.hl=p[0];CP.l=p[1];CP.m=p[2];CP.d=p[3];CP.dd=p[4];try{localStorage.setItem('csaladi-vakacio-szin',name);}catch(e){}}
try{const s=localStorage.getItem('csaladi-vakacio-szin');if(s&&PALETTES[s])setColor(s);}catch(e){}

/* ---- a család ---- */
const FAM={apa:{skin:'#efc29a',hair:'#5a3b22',shirt:'#3f7fd9',pants:'#2c3e50',name:'Apa'},anya:{skin:'#f3caa5',hair:'#a5522a',shirt:'#e05a8a',pants:'#4a4a7a',name:'Anya'},
 anna:{skin:'#f6d0ae',hair:'#6b4423',shirt:'#9c6bff',pants:'#35507a',name:'Anna'},petra:{skin:'#f8d6b6',hair:'#f2d16b',shirt:'#ffb13b',pants:'#d8433b',name:'Petra'},
 atti:{skin:'#fbdcc2',hair:'#d9b47a',shirt:'#7fd1ff',pants:'#7fd1ff',name:'kis Atti'}};
function crewHas(w){if(w==='apa'||!w)return true;const c=typeof G!=='undefined'&&G.trip&&G.trip.crew;return !c||!!c[w];}
const EYEC={apa:'#6b4a2b',anya:'#3e8a5a',anna:'#3b74c4',petra:'#4f8fd8',atti:'#5a9be0'};
/* szem oldalnézetből: mandulavágású fehér, színes írisz, pupilla, csillanás, szempilla */
function eyeSide(g,ex,ey,r,col,big,lash){const w=r*(0.2+big*0.12),h=r*(0.17+big*0.14);
 g.fillStyle='#ffffff';g.beginPath();g.ellipse(ex,ey,w,h,0,0,TAU);g.fill();
 const ir=Math.min(w,h)*0.92,ix=ex+w*0.3;disc(g,col,ix,ey+h*0.06,ir);disc(g,'#121212',ix+ir*0.15,ey+h*0.06,ir*0.55);disc(g,'#ffffff',ix-ir*0.22,ey-h*0.32,ir*0.32);
 g.strokeStyle='#2a1d14';g.lineWidth=r*0.07;g.beginPath();g.ellipse(ex,ey,w,h,0,Math.PI*1.08,Math.PI*1.95);g.stroke();
 if(lash){g.lineWidth=r*0.05;g.beginPath();g.moveTo(ex+w*0.75,ey-h*0.65);g.lineTo(ex+w*1.15,ey-h*1.05);g.moveTo(ex+w*0.35,ey-h*0.95);g.lineTo(ex+w*0.55,ey-h*1.4);g.stroke();}}
const WHEELS=[24,89],WR=9.4,WCY=55.5-9.4,ARCH=12.4;
/* fej oldalnézetből (jobbra néz) – cx,cy a fej közepe */
function headSide(g,cx,cy,who,t,s,sc){s=s||1;sc=sc||0;const f=FAM[who];const r=(who==='anna'?2.7:who==='petra'?2.4:who==='atti'?2.1:3.2)*s;
 if(who==='anya'){g.fillStyle=f.hair;g.beginPath();g.ellipse(cx-r*0.5,cy+r*0.4,r*0.9,r*1.4,0,0,TAU);g.fill();}
 // nyak és fej, finom árnyékkal
 R(g,shade(f.skin,0.85),cx-r*0.3,cy+r*0.7,r*0.6,r*0.6);
 g.fillStyle=lg(g,cx-r,cy,cx+r,cy,[[0,shade(f.skin,0.88)],[0.6,f.skin],[1,shade(f.skin,1.04)]]);g.beginPath();g.arc(cx,cy,r,0,TAU);g.fill();
 // orr, áll
 g.fillStyle=f.skin;g.beginPath();g.ellipse(cx+r*0.96,cy+r*0.12,r*0.22,r*0.2,0,0,TAU);g.fill();
 // fül
 disc(g,shade(f.skin,0.86),cx-r*0.18,cy+r*0.12,r*0.24);
 // haj
 g.fillStyle=f.hair;g.beginPath();g.arc(cx-r*0.1,cy-r*0.1,r*1.02,Math.PI*0.95,Math.PI*1.9);g.closePath();g.fill();
 if(who==='petra'){disc(g,f.hair,cx-r*1.05,cy+r*0.2,r*0.45);}
 if(who==='anna'){g.fillStyle=f.hair;g.beginPath();g.ellipse(cx-r*0.7,cy+r*0.6,r*0.5,r*1.0,0.3,0,TAU);g.fill();disc(g,'#ff5a9a',cx-r*0.2,cy-r*0.95,r*0.3);}
 const ex=cx+r*0.56,ey=cy-r*0.12,blink=!sc&&((t+(who.length*37))%233)<5;
 // szem: csukott (pislogás) ív, nyitva mandulaszem írisszel; ijedten nagyra nyílik
 if(blink){g.strokeStyle='#2a1d14';g.lineWidth=r*0.09;g.lineCap='round';g.beginPath();g.arc(ex,ey-r*0.08,r*0.17,0.25,Math.PI-0.25);g.stroke();}
 else eyeSide(g,ex,ey,r,EYEC[who]||'#5a3b22',Math.max(0,sc-0.15),who==='anya'||who==='anna'||who==='petra');
 // szemöldök (Apánál vastagabb), Apa napszemüvege a feje búbján
 if(who!=='atti')line(g,shade(f.hair,0.75),ex-r*0.22,ey-r*(0.34+sc*0.22),ex+r*0.2,ey-r*(0.4+sc*0.24),r*(who==='apa'?0.13:0.09));
 if(who==='apa'){g.fillStyle='#14171c';rrect(g,cx-r*0.05,cy-r*0.98,r*0.85,r*0.3,r*0.12);g.fill();R(g,'rgba(255,255,255,0.4)',cx+r*0.08,cy-r*0.94,r*0.28,r*0.07);}
 // száj: semleges vonal, ijedten nyitott „O”
 const mx=cx+r*0.7,my=cy+r*0.48;
 if(sc>0.3){g.fillStyle='#5a1f1f';g.beginPath();g.ellipse(mx,my+r*0.05,r*(0.13+sc*0.08),r*(0.14+sc*0.16),0,0,TAU);g.fill();}
 else line(g,shade(f.skin,0.62),mx-r*0.16,my,mx+r*0.12,my-r*0.02,r*0.08);
 if(who==='atti'&&!sc&&((t>>5)&1))disc(g,'#ffffff',cx+r*0.95,cy+r*0.5,r*0.25);
 // pír
 if(who!=='apa')disc(g,'rgba(255,120,120,0.22)',cx+r*0.5,cy+r*0.3,r*0.2);}
/* fej szemből */
function headFront(g,cx,cy,who,s){s=s||1;const f=FAM[who];const r=(who==='apa'||who==='anya'?3.6:who==='atti'?2.2:2.8)*s;
 if(who==='anya'){g.fillStyle=f.hair;g.beginPath();g.ellipse(cx,cy+r*0.5,r*1.25,r*1.5,0,0,TAU);g.fill();}
 disc(g,f.skin,cx,cy,r);g.fillStyle=f.hair;g.beginPath();g.arc(cx,cy-r*0.05,r*1.03,Math.PI*1.05,Math.PI*1.95);g.closePath();g.fill();
 if(who==='petra'){disc(g,f.hair,cx-r*1.1,cy,r*0.45);disc(g,f.hair,cx+r*1.1,cy,r*0.45);}
 for(const sx of [-1,1]){const ex=cx+sx*r*0.36,ey=cy+r*0.02;g.fillStyle='#ffffff';g.beginPath();g.ellipse(ex,ey,r*0.2,r*0.17,0,0,TAU);g.fill();
  disc(g,EYEC[who]||'#5a3b22',ex,ey+r*0.02,r*0.13);disc(g,'#121212',ex,ey+r*0.02,r*0.07);disc(g,'#ffffff',ex-r*0.04,ey-r*0.04,r*0.04);
  g.strokeStyle='#2a1d14';g.lineWidth=r*0.06;g.beginPath();g.ellipse(ex,ey,r*0.2,r*0.17,0,Math.PI*1.1,Math.PI*1.9);g.stroke();
  if(who!=='atti')line(g,shade(f.hair,0.75),ex-r*0.17,ey-r*0.3,ex+r*0.17,ey-r*(0.33+(sx>0?0.03:0)),r*(who==='apa'?0.11:0.07));}
 if(who==='apa'){g.fillStyle='#14171c';rrect(g,cx-r*0.6,cy-r*1.0,r*1.2,r*0.28,r*0.12);g.fill();}
 if(who!=='apa')disc(g,'rgba(255,120,120,0.25)',cx-r*0.55,cy+r*0.3,r*0.16),disc(g,'rgba(255,120,120,0.25)',cx+r*0.55,cy+r*0.3,r*0.16);
 g.strokeStyle='#a0524a';g.lineWidth=0.45*s;g.beginPath();g.arc(cx,cy+r*0.3,r*0.3,0.2,Math.PI-0.2);g.stroke();}
/* gyalogos családtag (kiszállás, tankolás, kerékcsere) */
/* ---- emberalak valós arányokkal (1 m = MPX képpont): Apa 177, Anya 174, Anna 110, Petra 96 cm ----
   módok: walk, wave, stand, kneel (térdel, a kéz a hand pontra nyúl), carry (kerékkel), pump (emelőt pumpál), work (tankol) */
const HCM={apa:177,anya:174,anna:110,petra:96};
function limb(g,c,ax,ay,bx,by,cx,cy,w){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(ax,ay);g.lineTo(bx,by);g.lineTo(cx,cy);g.stroke();}
function person(g,x,gy,who,t,mode,o){o=o||{};const f=FAM[who],H=(HCM[who]||170)/100*(112/CAR.len),kid=who==='anna'||who==='petra';
 const hr=kid?H/(who==='petra'?10:11):H/15,cx=x+H*0.06,dir=o.dir||1;g.save();if(dir<0){g.translate(cx*2,0);g.scale(-1,1);}
 const walk=mode==='walk'||mode==='carry',kneel=mode==='kneel'||mode==='pump',ph=t*0.22,sw=walk?Math.sin(ph):0;
 const hop=mode==='wave'&&((t>>4)&1)?H*0.03:0;gy-=hop;
 ell(g,'rgba(0,0,0,0.25)',cx,gy+hop+0.6,H*0.13,H*0.025);
 const legW=H*0.07,armW=H*0.05,shoe='#2a2420',pants=f.pants,shirt=f.shirt,skin=f.skin;
 let hipX=cx,hipY=gy-H*0.49,lean=0;
 if(kneel){hipY=gy-H*0.3;lean=0.28;
  // hátsó láb: térd a földön, lábfej hátra
  limb(g,shade(pants,0.85),hipX,hipY,hipX-H*0.02,gy-H*0.03,hipX-H*0.24,gy-H*0.02,legW);R(g,shoe,hipX-H*0.3,gy-H*0.05,H*0.07,H*0.05);
  // első láb: comb előre, lábszár le
  limb(g,pants,hipX,hipY,hipX+H*0.21,hipY-H*0.02,hipX+H*0.2,gy-H*0.02,legW);frr(g,shoe,hipX+H*0.17,gy-H*0.04,H*0.11,H*0.045,1);}
 else{const kb=walk?H*0.05:0;for(const [k,sg] of [[0,1],[1,-1]]){const a=sw*sg*0.42,ka=a+(walk?Math.max(0,-sw*sg)*0.5:0);
   const kx=hipX+Math.sin(a)*H*0.25,ky=hipY+Math.cos(a)*H*0.25,fx=kx+Math.sin(ka-0.1)*H*0.24,fy=Math.min(gy-H*0.02,ky+Math.cos(ka)*H*0.24);
   limb(g,k?pants:shade(pants,0.85),hipX,hipY,kx+kb*0,ky,fx,fy,legW);frr(g,shoe,fx-H*0.03,fy-H*0.025,H*0.11,H*0.045,1);}}
 // törzs (kissé dőlve térdelésnél)
 const tl=H*(kid?0.3:0.33),shX=hipX+Math.sin(lean)*tl,shY=hipY-Math.cos(lean)*tl;
 g.save();g.translate(hipX,hipY);g.rotate(lean);frr(g,lg(g,-H*0.08,0,H*0.08,0,[[0,shade(shirt,0.8)],[0.6,shirt],[1,shade(shirt,1.1)]]),-H*0.075,-tl-H*0.02,H*0.15,tl+H*0.05,H*0.05);g.restore();
 // fej
 const r0=who==='anna'?2.7:who==='petra'?2.4:3.2;headSide(g,shX+H*0.01,shY-hr*1.15,who,t,hr/r0);
 // karok
 const arm=H*0.37,ua=arm*0.5;let hx,hy,ex,ey;
 if(mode==='wave'){ex=shX+ua*0.5;ey=shY-ua*0.6;hx=ex+ua*0.3+Math.sin(t*0.3)*H*0.04;hy=ey-ua*0.9;}
 else if(kneel&&o.hand){hx=o.hand[0]-(dir<0?0:0);hy=o.hand[1];if(mode==='pump')hy+=Math.sin(t*0.35)*H*0.07;ex=(shX+hx)/2-H*0.02;ey=(shY+hy)/2+H*0.06;}
 else if(mode==='carry'){ex=shX+ua*0.6;ey=shY+ua*0.6;hx=ex+ua*0.8;hy=ey-ua*0.1;}
 else if(mode==='work'){ex=shX+ua*0.7;ey=shY+ua*0.55;hx=ex+ua*0.85;hy=ey+ua*0.15+Math.sin(t*0.4)*1;}
 else{const a=-sw*0.5;ex=shX+Math.sin(a)*ua;ey=shY+Math.cos(a)*ua;hx=ex+Math.sin(a+0.3)*ua;hy=ey+Math.cos(a+0.3)*ua;}
 const d=Math.hypot(hx-shX,hy-shY);if(d>arm){const k=arm/d;hx=shX+(hx-shX)*k;hy=shY+(hy-shY)*k;}
 limb(g,shirt,shX,shY+H*0.01,(shX+ex)/2,(shY+ey)/2,(shX+ex)/2,(shY+ey)/2,armW*1.25);limb(g,skin,(shX+ex)/2,(shY+ey)/2,ex,ey,hx,hy,armW);disc(g,skin,hx,hy,armW*0.6);
 if(who==='anya'&&mode!=='work'&&!kneel&&!o.noBaby&&crewHas('atti')){frr(g,'#fff1a8',shX+H*0.02,shY+H*0.05,H*0.11,H*0.1,2);headSide(g,shX+H*0.08,shY+H*0.05,'atti',t,0.9);}
 g.restore();return {hx:hx,hy:hy};}
function wheel(g,cx,cy,ang,flat,r,bent){r=r||WR;g.save();g.translate(cx,cy);
 if(bent>0.02){g.rotate(bent*0.2);g.scale(1-bent*0.32,1);}// elgörbült futómű: a kerék megdől (kerékdőlés), oldalról keskenyebbnek látszik
 if(flat){g.translate(0,r*0.34);// a felni lejjebb ül, a gumi alul szétnyomódik
  const w=Math.sin(ang*3)*r*0.03;g.fillStyle='#14171b';g.beginPath();g.arc(0,0,r,Math.PI*1.08,Math.PI*1.92);g.bezierCurveTo(r*1.02,-r*0.1,r*1.2+w,r*0.3,r*1.02,r*0.62);g.lineTo(-r*1.02,r*0.62);g.bezierCurveTo(-r*1.2-w,r*0.3,-r*1.02,-r*0.1,Math.cos(Math.PI*1.08)*r,Math.sin(Math.PI*1.08)*r);g.closePath();g.fill();
  g.strokeStyle='rgba(255,255,255,0.12)';g.lineWidth=r*0.05;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(k*r*0.45,r*0.36);g.quadraticCurveTo(k*r*0.45+r*0.12,r*0.5,k*r*0.45,r*0.6);g.stroke();}}
 else disc(g,'#14171b',0,0,r);g.strokeStyle='#2c3138';g.lineWidth=r*0.1;g.beginPath();g.arc(0,0,r*0.84,0,TAU);g.stroke();
 g.strokeStyle='rgba(255,255,255,0.1)';g.lineWidth=r*0.06;g.beginPath();g.arc(0,0,r*0.93,Math.PI*1.1,Math.PI*1.6);g.stroke();
 const q=r*0.72;g.fillStyle=rg(g,-q*0.3,-q*0.3,q*0.1,q*1.2,[[0,'#f6f8fa'],[1,'#8d98a3']]);g.beginPath();g.arc(0,0,q,0,TAU);g.fill();
 disc(g,'#262c33',0,0,q*0.86);disc(g,'#59616a',0,0,q*0.56);
 g.rotate(ang);g.fillStyle='#e3e8ec';for(let i=0;i<6;i++){g.rotate(TAU/6);g.fillRect(q*0.2,-q*0.17,q*0.68,q*0.1);g.fillRect(q*0.2,q*0.07,q*0.68,q*0.1);}
 disc(g,'#cfd6dc',0,0,q*0.24);disc(g,'#7f8a95',0,0,q*0.09);if(bent>0.25){g.rotate(-ang);g.strokeStyle='rgba(10,12,14,0.85)';g.lineWidth=r*0.12;g.beginPath();g.arc(0,0,r*0.7,-0.5,0.4);g.stroke();line(g,'rgba(255,255,255,0.4)',r*0.5,-r*0.35,r*0.62,r*0.2,r*0.05);}g.restore();}

/* ---- oldalnézet ---- */
/* függőleges hátsó lámpa a hátsó oszlop ívén (saját forma: karcsú, lekerekített, három vízszintes LED-csíkkal) */
function tailPath(g,ox,oy){ox=ox||0;oy=oy||0;g.beginPath();g.moveTo(ox+2.35,oy+31.2);g.lineTo(ox+2.25,oy+24.5);g.bezierCurveTo(ox+2.4,oy+20,ox+3.6,oy+16.9,ox+6.1,oy+15.0);
 g.quadraticCurveTo(ox+7.1,oy+14.5,ox+7.0,oy+15.8);g.bezierCurveTo(ox+6.3,oy+18.4,ox+6.0,oy+21.5,ox+6.0,oy+24.6);g.lineTo(ox+6.0,oy+29.6);g.quadraticCurveTo(ox+6.0,oy+31.6,ox+4.4,oy+31.7);g.closePath();}
function bodyPath(g){g.beginPath();g.moveTo(9,48.6);g.bezierCurveTo(4,48.6,2.2,46.4,2.1,42.5);g.lineTo(2,30.5);g.bezierCurveTo(2,21.5,4.5,15.6,9.5,12.6);
 g.bezierCurveTo(13.5,10.3,19.5,9.7,27.5,9.6);g.lineTo(61,9.8);g.bezierCurveTo(70,10.1,76.5,12.4,83,16.8);g.lineTo(95.6,26.4);
 g.bezierCurveTo(99.6,28.6,104.6,29.8,108.2,32.4);g.bezierCurveTo(111.4,35,112.3,39.4,111.6,43.6);g.bezierCurveTo(111.1,47.2,109.2,48.6,105,48.6);g.closePath();}
function glassPath(g){g.beginPath();g.moveTo(7.2,26.3);g.bezierCurveTo(6.9,19.4,8.7,15.2,13,13.3);g.bezierCurveTo(15.2,12.7,18.2,12.5,22,12.5);g.lineTo(61,12.7);
 g.bezierCurveTo(68.5,12.9,74,14.7,79.2,18.1);g.lineTo(92.6,27.6);g.lineTo(62,27.1);g.lineTo(7.4,26.6);g.closePath();}
const SEATS=[['apa',68,17.7],['anya',63.4,18.5],['anna',42.6,19.8],['petra',33.4,20.6]];
/* ---- a családi autó állandó részei képként (telefonon kevesebb rajzolási művelet) ---- */
const CARC=new Map();
function carLayer(g,key,draw){const tr=g.getTransform(),zs=Math.max(1,Math.round(Math.hypot(tr.a,tr.b)*4)/4);/* a tényleges nagyításon készül, hogy nagyban se legyen elmosódott */
 const ck=key+'|'+zs;let c=CARC.get(ck);if(c){CARC.delete(ck);CARC.set(ck,c);}
 else{if(CARC.size>=10){const k0=CARC.keys().next().value;freeCv(CARC.get(k0));CARC.delete(k0);}const r=mk(128,56,zs);r[1].translate(4,3);draw(r[1]);c=r[0];CARC.set(ck,c);}
 g.drawImage(c,-4,-3,128,56);}
function carBodyBase(g,dirt){
 // tetőbox és tetősín
 frr(g,lg(g,0,2.6,0,9,[[0,'#4c5664'],[1,'#1b2027']]),20,2.8,41,6.4,3.2);frr(g,'rgba(255,255,255,0.22)',25,3.4,26,0.9,0.45);
 g.strokeStyle='#e3e9ee';g.lineWidth=0.9;g.beginPath();g.moveTo(14,9.3);g.bezierCurveTo(30,8.7,50,8.7,67,9.6);g.stroke();
 for(const fx of [15,40,65])frr(g,'#222830',fx-1.3,8.6,2.6,1.7,0.6);
 // karosszéria
 bodyPath(g);g.fillStyle=lg(g,0,10,0,49,[[0,CP.hl],[0.22,CP.l],[0.52,CP.m],[0.8,CP.d],[1,CP.dd]]);g.fill();
 g.save();bodyPath(g);g.clip();
  for(const cx of WHEELS)disc(g,'#101215',cx,WCY,ARCH-0.6);
  g.fillStyle=lg(g,0,43,0,49,[[0,'#3d434c'],[1,'#20242a']]);g.fillRect(0,43.6,120,6);
  g.strokeStyle='#2b3037';g.lineWidth=1.7;for(const cx of WHEELS){g.beginPath();g.arc(cx,WCY,ARCH+0.2,Math.PI*1.03,Math.PI*1.97);g.stroke();}
  g.fillStyle=lg(g,0,9,0,49,[[0,'rgba(255,255,255,0.42)'],[0.3,'rgba(255,255,255,0.12)'],[0.43,'rgba(255,255,255,0.05)'],[0.445,'rgba(20,30,45,0.28)'],[0.6,'rgba(20,30,45,0.1)'],[0.85,'rgba(255,255,255,0.06)'],[1,'rgba(0,0,0,0.25)']]);g.fillRect(0,9,120,40);
  g.fillStyle=lg(g,0,0,120,0,[[0,'rgba(255,255,255,0)'],[0.45,'rgba(255,255,255,0.0)'],[0.55,'rgba(255,255,255,0.22)'],[0.62,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,0)']]);g.fillRect(0,26,120,12);
  g.lineWidth=0.9;g.strokeStyle='rgba(255,255,255,0.6)';g.beginPath();g.moveTo(5,28.6);g.bezierCurveTo(40,28.1,80,28.7,101,30.8);g.stroke();
  g.lineWidth=0.7;g.strokeStyle='rgba(0,0,0,0.25)';g.beginPath();g.moveTo(10,37.6);g.bezierCurveTo(40,36.5,75,36.3,104,37.3);g.stroke();
  g.strokeStyle='rgba(255,255,255,0.25)';g.beginPath();g.moveTo(10,38.5);g.bezierCurveTo(40,37.4,75,37.2,104,38.2);g.stroke();
  if(dirt>0.05){const d=dirt;g.fillStyle=lg(g,0,10,0,49,[[0,'rgba(150,130,100,'+(0.12*d)+')'],[1,'rgba(110,85,55,'+(0.5*d)+')']]);g.fillRect(0,10,120,40);
   for(let k=0;k<10;k++){const mx=6+hsh(k*11)*104,my=40+hsh(k*5)*7;g.fillStyle='rgba(95,70,45,'+(0.55*d*(0.5+hsh(k)))+')';g.beginPath();g.ellipse(mx,my,2+hsh(k*3)*4,1+hsh(k*7)*1.6,0,0,TAU);g.fill();}}
  // ajtóvonalak
  g.strokeStyle='rgba(18,22,28,0.6)';g.lineWidth=0.55;g.beginPath();g.moveTo(22.9,27);g.lineTo(22.7,31.6);g.moveTo(50.2,27);g.bezierCurveTo(50.4,36,50.4,40,50.2,43.6);
  g.moveTo(76.6,27.4);g.bezierCurveTo(77.4,32,77,35,75.4,37.2);g.moveTo(22.9,43.6);g.lineTo(75,43.6);g.stroke();
 g.restore();
 bodyPath(g);g.strokeStyle='#0c0f14';g.lineWidth=1.15;g.stroke();bodyPath(g);g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.4;g.save();g.translate(0,0.5);g.stroke();g.restore();
 // kilincsek, tanksapka
 for(const hx of [28,55.5]){frr(g,'rgba(0,0,0,0.35)',hx,31.5,5.4,0.8,0.4);frr(g,lg(g,0,30.4,0,31.8,[[0,'#ffffff'],[1,'#9aa6b1']]),hx,30.4,5.4,1.4,0.7);}
 g.strokeStyle='rgba(20,24,30,0.55)';g.lineWidth=0.5;g.beginPath();g.arc(13.6,31,2.1,0,TAU);g.stroke();
}
function carBodyFront(g){
 g.strokeStyle='#e6edf2';g.lineWidth=0.75;glassPath(g);g.stroke();
 // tükör
 g.fillStyle=lg(g,0,22,0,26.6,[[0,CP.hl],[1,CP.d]]);g.beginPath();g.ellipse(76.5,24.2,3.4,2.1,-0.15,0,TAU);g.fill();frr(g,'#1a1e24',73.6,25.3,2.2,2.3,0.5);
 // hátsó lámpa (vízszintes, körbeérő LED-sáv)
 tailPath(g);g.fillStyle=lg(g,2,0,7,0,[[0,'#7a1018'],[0.45,'#c9283a'],[1,'#e85a64']]);g.fill();g.strokeStyle='rgba(235,240,245,0.85)';g.lineWidth=0.35;g.stroke();
 for(const ly of [18.6,22.6,26.6])frr(g,'rgba(255,190,190,0.55)',2.9,ly,2.8,0.7,0.35);frr(g,'rgba(255,255,255,0.35)',5.2,17.2,0.5,11,0.25);frr(g,CP.tl,2.2,40.6,3,1.2,0.5);
 // fényszóró (karcsú LED)
 g.fillStyle=lg(g,96,29,108,34,[[0,'#f6f9fb'],[1,'#a3aeb8']]);g.beginPath();g.moveTo(96.6,28.9);g.bezierCurveTo(100.6,29.4,104.8,30.7,108.4,33.1);g.lineTo(107.5,34.7);g.bezierCurveTo(104,33.6,100,32.5,96.2,31.2);g.closePath();g.fill();
 g.strokeStyle='#ffffff';g.lineWidth=0.6;g.beginPath();g.moveTo(97,31.3);g.bezierCurveTo(100.4,32.4,104,33.4,107.4,34.6);g.stroke();disc(g,CP.proj,104.4,32.4,0.9);
 // első alsó légbeömlő és ködlámpa
 frr(g,'#191d22',103.4,39.6,8,4.4,2);frr(g,'#4a525b',104.4,40.8,6,0.5,0.25);}
function drawCarSide(g,x,by,wy,o,lights){
 const t=o.t||0,hide=o.hide||{},ang=o.ang||0,pitch=o.pitch||0,lift=o.lift||0;
 const wyF=(o.wF||0),wyR=(o.wR||0);
 g.save();g.translate(x,by-lift);g.translate(56,45);g.rotate(pitch);g.translate(-56,-45);
 // a karosszéria és az eleje előre megrajzolt kép (színenként, koszosság szerint); az utasok, kerekek, fények élőben
 const useC=!o.live,dq=o.dirt>0.05?Math.round(o.dirt*10)/10:0;
 if(useC)carLayer(g,'b|'+CP.m+'|'+dq,xg=>carBodyBase(xg,dq));else carBodyBase(g,o.dirt||0);
 // üvegfelület az utasokkal
 glassPath(g);g.fillStyle=lg(g,0,12.5,0,27,[[0,'#b4d6e8'],[0.45,'#628aa3'],[1,'#21384a']]);g.fill();
 g.save();glassPath(g);g.clip();
  const bob=o.bounce?Math.sin(t*0.3)*0.3:0;
  // csomagok a 3. sorban
  frr(g,'#d8433b',8.5,19.5,6,7,1.2);frr(g,'#3f7fd9',13.5,17.5,6,9,1.2);frr(g,'#f2c14e',10,15.5,5,4,1);
  // bébiülés kis Attival (menetiránynak háttal)
  const sc=o.scare||0,ln=o.lean||0,jit=w=>sc>0.2&&w!=='apa'?Math.sin(t*1.7+w.length)*0.35*sc:0;
  if(o.inner)o.inner(g,t);
  if(!hide.atti&&crewHas('atti')){frr(g,'#3b4a63',23.6,15.6,6.4,10.4,2.4);headSide(g,27.2+ln*0.4+jit('atti'),19.4+bob,'atti',t,1,sc);}
  for(const [w,hx,hy] of SEATS)if(!hide[w]&&crewHas(w))headSide(g,hx+ln*(w==='apa'?0.6:1)+jit(w),hy+(w==='petra'||w==='anna'?bob:0)+ln*0.15,w,t,1,w==='apa'?sc*0.6:sc);
  if(!hide.petra&&crewHas('petra'))frr(g,'#d8433b',30,22.6,7,3.6,1.4);
  if(o.airbag)drawAirbag(g,o.airbag);
  g.fillStyle='rgba(16,34,52,0.3)';g.fillRect(0,0,120,30);
  g.fillStyle='rgba(255,255,255,0.15)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(4+k*17,28);g.lineTo(12+k*17,12);g.lineTo(16+k*17,12);g.lineTo(8+k*17,28);g.closePath();g.fill();}
  g.fillStyle='#13171c';rrect(g,20.8,11,2.8,17,1.2);g.fill();rrect(g,48.7,11,3.2,17,1.2);g.fill();
  g.strokeStyle='#13171c';g.lineWidth=2.7;g.beginPath();g.moveTo(74.6,27.4);g.lineTo(78.4,16.8);g.stroke();
  g.fillStyle='rgba(255,255,255,0.13)';g.beginPath();g.moveTo(76,27.4);g.lineTo(79.8,17.6);g.lineTo(92.6,27.6);g.closePath();g.fill();
 g.restore();
 if(useC)carLayer(g,'f|'+CP.m,xg=>carBodyFront(xg));else carBodyFront(g);
 disc(g,o.fog?'#ffffff':'#e8e2c4',108.6,42.2,0.95);
 if(o.dmg)drawDamage(g,o.dmg,t,o.spd||0,o.dz);
 g.restore();
 if(o.dmg)drawSmoke(g,x+100,by+28,o.dmg,t);
 // kerekek (a felfüggesztés miatt külön mozognak)
 for(const [k,cx] of [['r',WHEELS[0]],['f',WHEELS[1]]]){if(o.noWheels)break;const dy=k==='f'?wyF:wyR,wx=x+cx,wcy=wy+WCY+dy;
  if(o.noWheel===k){frr(g,'#7d858d',wx-1.2,wcy-2,2.4,11,0.8);continue;}
  if(o.lostW===k){// kiszakadt kerék: csak a féktárcsa és a kerékagy, az úton csúszik
   const hy=wy+55.5-5.4;disc(g,'#4a4f56',wx,hy,5.4);disc(g,'#7d858d',wx,hy,4.2);disc(g,'#2b3037',wx,hy,1.6);for(let i=0;i<5;i++){const a=i*TAU/5+ang*0.2;disc(g,'#c9d1db',wx+Math.cos(a)*2.8,hy+Math.sin(a)*2.8,0.5);}
   frr(g,'#c62a35',wx+2.2,hy-3.8,3.2,4.4,1);continue;}
  const zd=o.dz?(o.dz[k]||0):0;wheel(g,wx,wcy,ang,o.flat===k,undefined,o.dmg?clamp((zd-0.62)/0.38,0,1):0);}
 if(o.jack){const jx=x+(o.jack==='f'?WHEELS[1]-13:WHEELS[0]+13),gy=wy+55.5;frr(g,'#c62a35',jx-4,gy-3,8,3,1);frr(g,'#8e1c24',jx-1.2,gy-6-lift,2.4,6+lift,0.8);}
 // nyitott ajtók
 if(o.door>0)drawDoors(g,x,by-lift,o.door,t,hide);
 if(o.flap){frr(g,'#16191d',x+11.6,by+29,4,4,2);frr(g,lg(g,0,28,0,34,[[0,CP.hl],[1,CP.d]]),x+7,by+28.6,4.4,4.8,1.8);}
 const L=(dx,dy)=>[x+dx,by+dy];
 if(o.wiping){const a=(Math.sin(t*0.14)+1)/2;line(g,'#14171c',x+86,by+25,x+86-6-a*4,by+25-6-a*6,0.8);}
 const fogF=o.fogF||o.fog,fogR=o.fogR,pos=o.pos||o.lightsOn||o.high;
 if(pos){glow(g,x+106,by+31.6,4,'rgba(255,250,230,0.85)');for(const ly of [18.6,22.6,26.6])frr(g,'rgba(255,80,80,0.98)',x+2.9,by+ly,2.8,0.9,0.45);glow(g,x+3.6,by+22.6,6,'rgba(255,40,40,0.5)');if(lights)lights.push({x:x+3,y:by+23,r:9});}
 if(fogF){disc(g,'#ffffff',x+108.6,by+42.2,1);glow(g,x+108.6,by+42.2,6,'rgba(255,255,230,0.9)');if(lights)lights.push({x:x+112,y:by+44,r:16});}
 if(fogR){frr(g,'#ff2a2a',x+2,by+38.8,3,1.8,0.8);glow(g,x+3,by+39.6,7,'rgba(255,30,30,0.85)');if(lights)lights.push({x:x+2,y:by+40,r:12});}
 if(o.rev){frr(g,'#ffffff',x+2,by+35.6,3,1.6,0.8);glow(g,x+3,by+36.4,9,'rgba(255,255,255,0.95)');if(lights)lights.push({x:x,y:by+40,r:26});}
 if(o.brake){tailPath(g,x,by);g.fillStyle='#ff3b3b';g.fill();for(const ly of [18.6,22.6,26.6])frr(g,'#ffd0d0',x+2.9,by+ly,2.8,0.8,0.4);glow(g,x+3.6,by+20,8,'rgba(255,40,40,0.6)');glow(g,x+3.6,by+27,8,'rgba(255,40,40,0.6)');if(lights)lights.push({x:x+3,y:by+23,r:16});}
 if(o.blink){disc(g,CP.amb,x+110.6,by+37.6,1.1);glow(g,x+110.6,by+37.6,5,'rgba(255,170,30,0.8)');frr(g,CP.amb,x+2.8,by+28.6,3,1.6,0.6);glow(g,x+3.8,by+29.4,4,'rgba(255,170,30,0.7)');frr(g,CP.amb,x+74,by+24.6,4,0.9,0.45);}
 if((o.lightsOn||o.high)&&!(o.dmg>0.6)){frr(g,'#ffffff',x+98,by+30.2,9,1.2,0.6);glow(g,x+106,by+32.6,o.high?9:6,o.high?'rgba(220,235,255,0.95)':'rgba(255,255,230,0.9)');if(lights)lights.push({cone:true,high:!!o.high,x:x+108,y:by+32,g:wy+55});}}

/* ---- sérülés: d = 0 (ép) ... 1 (totálkár), zónák (dz.f eleje, dz.s oldala, dz.r hátulja), az autó saját koordinátáiban ---- */
function drawDamage(g,d,t,spd,dz){if(d<0.05)return;const F=dz?dz.f||0:d,S=dz?dz.s||0:0,Rr=dz?dz.r||0:0;
 const dent=(x,y,rx,ry,a)=>{g.fillStyle=lg(g,x-rx,y-ry,x+rx,y+ry,[[0,'rgba(0,0,0,0.34)'],[0.55,'rgba(0,0,0,0.12)'],[1,'rgba(255,255,255,0.2)']]);g.beginPath();g.ellipse(x,y,rx,ry,a||0,0,TAU);g.fill();};
 const scratch=(x0,x1,y0,y1,n,seed)=>{g.strokeStyle='rgba(235,240,245,0.7)';g.lineWidth=0.3;g.beginPath();for(let k=0;k<n;k++){const x=x0+hsh(seed+k*7)*(x1-x0),y=y0+hsh(seed+k*13)*(y1-y0),l=2+hsh(seed+k)*6;g.moveTo(x,y);g.lineTo(x+l,y+(hsh(seed+k*3)-0.5)*2.2);}g.stroke();};
 const rust=(x,y,r)=>{disc(g,'rgba(60,40,28,0.55)',x,y,r);disc(g,'rgba(150,150,155,0.6)',x+0.3,y-0.2,r*0.55);};
 g.save();bodyPath(g);g.clip();
 // ELEJE: karcok, horpadások a sárvédőn
 if(F>0.04){scratch(84,104,31,41,Math.min(10,Math.ceil(F*14)),1);for(let k=0;k<Math.ceil(F*5);k++)dent(88+hsh(k*31)*16,33+hsh(k*17)*8,2.6+F*2,1.6+F,0.3);if(F>0.5)rust(97,38,1.3);}
 // OLDALA: ajtók behorpadva, gyűrt ajtóél, lepattant fényezés, kilincs
 if(S>0.04){const k=Math.min(1,S);scratch(24,76,30,42,Math.ceil(k*16),40);
  for(let i=0;i<Math.ceil(k*4);i++)dent(30+hsh(i*19+3)*42,34+hsh(i*23)*6,3+k*4,1.6+k*1.6,(hsh(i)-0.5)*0.5);
  if(k>0.3){g.strokeStyle='rgba(10,12,16,0.65)';g.lineWidth=0.5;g.beginPath();g.moveTo(26,36);for(let i=0;i<=10;i++)g.lineTo(26+i*5,36+(i%2?1.3:-0.9)*k*2);g.stroke();
   g.strokeStyle='rgba(255,255,255,0.32)';g.lineWidth=0.35;g.beginPath();g.moveTo(26,37);for(let i=0;i<=10;i++)g.lineTo(26+i*5,37+(i%2?1.3:-0.9)*k*2);g.stroke();
   for(let i=0;i<4;i++){const x=32+hsh(i*41)*38,y=33+hsh(i*43)*7;g.fillStyle='rgba(185,190,196,0.85)';g.beginPath();g.moveTo(x,y);g.lineTo(x+2.2,y-0.6);g.lineTo(x+3,y+1);g.lineTo(x+0.6,y+1.6);g.closePath();g.fill();}}
  if(k>0.6){g.fillStyle='rgba(0,0,0,0.28)';g.beginPath();g.moveTo(50.4,28);g.lineTo(54,30);g.lineTo(51.6,43.4);g.lineTo(50.2,43.4);g.closePath();g.fill();rust(42,40,1.2);rust(64,41,1);}}
 // HÁTULJA: gyűrt csomagtérajtó, behorpadt hátsó lökhárító
 if(Rr>0.04){const k=Math.min(1,Rr);scratch(2,20,30,44,Math.ceil(k*10),80);for(let i=0;i<Math.ceil(k*4);i++)dent(6+hsh(i*29+5)*12,34+hsh(i*37)*8,2.2+k*2.4,1.4+k*1.2,0.6);
  if(k>0.35){g.fillStyle=CP.d;g.beginPath();g.moveTo(2,31);for(let i=0;i<=6;i++)g.lineTo(2+(i%2?2.4*k:0),31+i*2);g.lineTo(0,43);g.lineTo(0,31);g.closePath();g.fill();
   g.strokeStyle='#0c0f14';g.lineWidth=0.55;g.beginPath();g.moveTo(2,31);for(let i=0;i<=6;i++)g.lineTo(2+(i%2?2.4*k:0),31+i*2);g.stroke();}}
 g.restore();
 // ELEJE: repedt fényszóró, gyűrt motorháztető, pókhálós szélvédő
 if(F>0.25){g.strokeStyle='rgba(40,40,40,0.8)';g.lineWidth=0.35;g.beginPath();g.moveTo(101,30.4);g.lineTo(103.4,32.6);g.lineTo(102.4,33.4);g.moveTo(103.4,32.6);g.lineTo(106.6,33.2);g.moveTo(103.4,32.6);g.lineTo(104.6,31);g.stroke();}
 if(F>0.4){const k=Math.min(1,(F-0.4)/0.4);g.fillStyle=CP.d;g.beginPath();g.moveTo(86,28.4);for(let i=0;i<=6;i++){const x=86+i*3.6,y=28.6+i*0.55-(i%2?2.2*k:0);g.lineTo(x,y);}g.lineTo(108,33);g.lineTo(86,30.6);g.closePath();g.fill();
  g.strokeStyle='#0c0f14';g.lineWidth=0.6;g.beginPath();g.moveTo(86,28.4);for(let i=0;i<=6;i++)g.lineTo(86+i*3.6,28.6+i*0.55-(i%2?2.2*k:0));g.stroke();
  const cx=84.6,cy=22.2;g.strokeStyle='rgba(255,255,255,0.85)';g.lineWidth=0.3;g.beginPath();for(let a=0;a<7;a++){const an=a*0.9+0.3,r=3+hsh(a*5)*3;g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r*0.8);}g.stroke();
  g.beginPath();g.arc(cx,cy,1.6,0,TAU);g.stroke();g.beginPath();g.arc(cx,cy,3.2,0.4,2.6);g.stroke();}
 // OLDALA: betört oldalablak (szilánkos)
 if(S>0.45){const cx=58,cy=20;g.strokeStyle='rgba(255,255,255,0.8)';g.lineWidth=0.28;g.beginPath();for(let a=0;a<8;a++){const an=a*0.8,r=2.4+hsh(a*9+1)*4;g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r*0.7);}g.stroke();g.beginPath();g.arc(cx,cy,1.4,0,TAU);g.stroke();
  if(S>0.75){g.fillStyle='rgba(20,30,40,0.45)';g.beginPath();g.moveTo(54,15);g.lineTo(62,14.6);g.lineTo(60,19);g.lineTo(56.4,21.6);g.closePath();g.fill();}}
 // HÁTULJA: törött hátsó lámpa, lelógó hátsó lökhárító
 if(Rr>0.25){g.fillStyle='rgba(30,10,12,0.7)';g.beginPath();g.moveTo(2.6,22);g.lineTo(6,19.6);g.lineTo(5.8,25.4);g.lineTo(3.2,27);g.closePath();g.fill();
  g.strokeStyle='rgba(255,220,220,0.8)';g.lineWidth=0.3;g.beginPath();g.moveTo(4.2,23);g.lineTo(2.4,20.4);g.moveTo(4.2,23);g.lineTo(6,26.6);g.moveTo(4.2,23);g.lineTo(6.2,21);g.stroke();}
 if(Rr>0.4){const sw=-(0.18+Rr*0.32+Math.sin(t*0.27)*(0.04+Math.min(1,spd/80)*0.09));R(g,'#16191d',0,40.2,11,4.6);
  g.save();g.translate(11.6,40.6);g.rotate(sw);frr(g,lg(g,0,0,0,5,[[0,CP.l],[1,CP.dd]]),-12.6,0,12.6,4.4,1.6);g.strokeStyle='#0c0f14';g.lineWidth=0.5;rrect(g,-12.6,0,12.6,4.4,1.6);g.stroke();g.restore();}
 // ELEJE: gyűrődési redők a sárvédőn (hullámos, árnyékolt hajtások), elcsúszott ajtórés
 if(F>0.45){const k=Math.min(1,(F-0.45)/0.45);g.save();bodyPath(g);g.clip();for(let i=0;i<3+Math.round(k*3);i++){const x=88+i*3.4;
   g.strokeStyle='rgba(8,10,14,'+(0.35+k*0.35).toFixed(2)+')';g.lineWidth=0.6;g.beginPath();for(let j=0;j<=5;j++)g.lineTo(x+(j%2?1.4:-1.4)*k,30+j*2.6);g.stroke();
   g.strokeStyle='rgba(255,255,255,'+(0.2+k*0.2).toFixed(2)+')';g.lineWidth=0.35;g.beginPath();for(let j=0;j<=5;j++)g.lineTo(x+0.9+(j%2?1.4:-1.4)*k,30+j*2.6);g.stroke();}
  if(F>0.6){g.fillStyle='rgba(0,0,0,0.55)';g.beginPath();g.moveTo(79.6,28);g.lineTo(81.6+k*1.6,28.4);g.lineTo(80.4+k*1.2,44);g.lineTo(79,44);g.closePath();g.fill();}g.restore();}
 if(S>0.55||Rr>0.55){const k=Math.min(1,(Math.max(S,Rr)-0.55)/0.45);g.save();bodyPath(g);g.clip();g.fillStyle='rgba(0,0,0,0.5)';g.beginPath();g.moveTo(25.6,28.6);g.lineTo(27+k*1.8,29);g.lineTo(26.6+k*1.4,44);g.lineTo(25.4,44);g.closePath();g.fill();g.restore();}
 // csöpögő folyadékok a sérült motortérből (olaj, hűtőfolyadék) és a hátsó tankból (benzin)
 if(F>0.55){const n=F>0.8?3:2;for(let i=0;i<n;i++){const ph=((t*0.035+i*0.37)%1),c=i===1?'rgba(70,200,100,0.85)':'rgba(40,28,16,0.9)',dx=96+i*4;disc(g,c,dx,46+ph*9,0.55+(1-ph)*0.25);}
  if(spd<2){ell(g,'rgba(30,22,14,0.55)',99,55.6,4+F*4,0.8);ell(g,'rgba(70,200,100,0.35)',104,55.7,2+F*2,0.5);}}
 if(Rr>0.7){const ph=(t*0.03)%1;disc(g,'rgba(210,200,130,0.7)',26,47+ph*8,0.5);if(spd<2)ell(g,'rgba(210,200,130,0.3)',26,55.7,3+Rr*3,0.6);}
 // ELEJE: lógó, lengő első lökhárító
 if(F>0.25){const sw=0.22+F*0.35+Math.sin(t*0.25)*(0.05+Math.min(1,spd/80)*0.1);R(g,'#16191d',100,40.2,12.6,4.6);
  g.save();g.translate(100.4,40.6);g.rotate(sw);frr(g,lg(g,0,0,0,5,[[0,CP.l],[1,CP.dd]]),0,0,13.6,4.4,1.6);frr(g,'#191d22',3,1.2,7,2,1);g.strokeStyle='#0c0f14';g.lineWidth=0.5;rrect(g,0,0,13.6,4.4,1.6);g.stroke();g.restore();}
 // lelógó visszapillantó tükör (oldalütközéstől is)
 if(F>0.55||S>0.3){R(g,'#1a1e24',74,24.2,1.4,1.6);const a=Math.sin(t*0.2)*0.25;g.save();g.translate(74.6,25.6);g.rotate(1.1+a);g.fillStyle=CP.m;g.beginPath();g.ellipse(2.6,0,3.2,1.9,0,0,TAU);g.fill();g.restore();line(g,'#111',74.6,25.6,75.4,28,0.4);}
 // ha a lökhárító majdnem leesik, szikrázik az úton
 if(spd>15&&((t>>1)&1)){if(F>0.75){for(let k=0;k<3;k++)disc(g,'#ffd27a',110+hsh(t*3+k)*4,48+hsh(t*7+k)*3,0.5);glow(g,111,49,4,'rgba(255,200,120,0.8)');}
  if(Rr>0.75){for(let k=0;k<3;k++)disc(g,'#ffd27a',-2+hsh(t*5+k)*4,48+hsh(t*9+k)*3,0.5);glow(g,0,49,4,'rgba(255,200,120,0.8)');}}}
function drawSmoke(g,x,y,d,t){if(d<0.45)return;const n=d>0.75?7:4,dark=d>0.75;for(let k=0;k<n;k++){const ph=((t*0.6+k*23)%60)/60;
 disc(g,dark?'rgba(40,40,44,'+(0.45*(1-ph))+')':'rgba(220,224,228,'+(0.4*(1-ph))+')',x+ph*10+Math.sin(k+t*0.05)*2,y-ph*26,2+ph*6);}}
function drawAirbag(g,ab){// ab: 0..1 felfúvódás, 2 = leeresztett, lelógó
 if(!ab)return;if(ab>=2){g.fillStyle='rgba(245,245,240,0.95)';g.beginPath();g.moveTo(71,20);g.quadraticCurveTo(76,22,74,27);g.quadraticCurveTo(71,28,70,24);g.closePath();g.fill();return;}
 const r=1+ab*5.2;g.fillStyle=rg(g,72.6,18.4,0.5,r,[[0,'#ffffff'],[1,'#d8dcdf']]);g.beginPath();g.ellipse(73.2,20,r*0.85,r,0,0,TAU);g.fill();}
function doorClip(g,x0,x1){bodyPath(g);g.clip();g.beginPath();g.rect(x0,12.4,x1-x0,31.4);g.clip();
 g.beginPath();g.rect(-20,-10,160,80);for(const cx of WHEELS){g.moveTo(cx+ARCH,WCY);g.arc(cx,WCY,ARCH,0,TAU);}g.clip('evenodd');}
function drawDoors(g,x,y,a,t,hide){for(const [x0,x1] of [[22.9,50.2],[50.6,76.6]]){const w=x1-x0;
  g.save();g.translate(x,y);doorClip(g,x0,x1);
  // utastér a nyílásban
  g.fillStyle='#231d19';g.fillRect(x0,12.4,w,14.6);g.fillStyle=lg(g,0,27,0,44,[[0,'#a39280'],[1,'#6e5f50']]);g.fillRect(x0,27,w,17);
  frr(g,'#3d4f6a',x0+3,14,7,14,2);frr(g,'#4d6284',x0+3,14,7,2,1);frr(g,'#3d4f6a',x0+3,26.5,w-8,4.6,1.6);frr(g,'rgba(0,0,0,0.25)',x0+3,31,w-8,1,0.5);
  g.fillStyle='rgba(255,230,170,'+(0.18*a)+')';g.fillRect(x0,12.4,w,8);
  // az ajtólap a zsanér felé fordul
  g.translate(x1,0);g.scale(Math.max(0.1,1-0.88*a),1);g.translate(-x1,0);
  g.fillStyle=lg(g,0,12,0,44,[[0,CP.hl],[0.35,CP.l],[0.7,CP.m],[1,CP.d]]);g.fillRect(x0,12.4,w,31.4);
  g.fillStyle=lg(g,0,12,0,27,[[0,'#b4d6e8'],[1,'#2b4558']]);g.fillRect(x0+1.2,13.2,w-2.4,13.4);
  g.fillStyle='rgba(0,0,0,'+(0.32*a)+')';g.fillRect(x0,12.4,w,31.4);
  g.strokeStyle='#e6edf2';g.lineWidth=0.6;g.strokeRect(x0+1.2,13.2,w-2.4,13.4);g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.strokeRect(x0,12.4,w,31.4);
  frr(g,'#dfe6ec',x0+5,30.4,5.4,1.4,0.7);
  g.restore();}}
/* ---- elölnézet (72 széles, talaj y=55.5) ---- */
function drawFront(g,x,y,o){g.save();g.translate(x,y);const t=o.t||0;
 frr(g,'#14171b',6.5,43,12,12.5,3.5);frr(g,'#14171b',53.5,43,12,12.5,3.5);
 frr(g,lg(g,0,1,0,7,[[0,'#4c5664'],[1,'#1b2027']]),19,1.2,34,5.4,2.6);frr(g,'#262c34',17.6,6,3,1.6,0.6);frr(g,'#262c34',51.4,6,3,1.6,0.6);
 g.beginPath();g.moveTo(9,29);g.lineTo(16.4,9.6);g.quadraticCurveTo(17.6,7,21,7);g.lineTo(51,7);g.quadraticCurveTo(54.4,7,55.6,9.6);g.lineTo(63,29);g.closePath();g.fillStyle=lg(g,0,7,0,29,[[0,CP.hl],[1,CP.l]]);g.fill();
 const ws=()=>{g.beginPath();g.moveTo(12.6,27);g.lineTo(18.7,10.7);g.quadraticCurveTo(19.4,9.3,21.6,9.3);g.lineTo(50.4,9.3);g.quadraticCurveTo(52.6,9.3,53.3,10.7);g.lineTo(59.4,27);g.closePath();};
 ws();g.fillStyle=lg(g,0,9,0,27,[[0,'#b4d6e8'],[0.5,'#628aa3'],[1,'#22394a']]);g.fill();
 g.save();ws();g.clip();headFront(g,31.5,16.5,'anna');headFront(g,40.5,16.8,'petra');headFront(g,23.5,19,'anya');headFront(g,48.5,19,'apa');
  g.fillStyle='rgba(16,34,52,0.28)';g.fillRect(0,0,72,30);g.fillStyle='rgba(255,255,255,0.16)';g.beginPath();g.moveTo(17,27);g.lineTo(25,9);g.lineTo(30,9);g.lineTo(22,27);g.closePath();g.fill();
 g.restore();g.strokeStyle='#e6edf2';g.lineWidth=0.6;ws();g.stroke();
 const wa=(o.wipe||0)*1.3;g.save();line(g,'#14171c',24,26.4,24-Math.cos(0.15+wa)*-15,26.4-Math.sin(0.15+wa)*15,0.8);line(g,'#14171c',44,26.4,44-Math.cos(0.15+wa)*-15,26.4-Math.sin(0.15+wa)*15,0.8);g.restore();
 frr(g,lg(g,0,26,0,49,[[0,CP.l],[0.5,CP.m],[1,CP.dd]]),4,26.4,64,22.4,8);g.strokeStyle='rgba(255,255,255,0.5)';g.lineWidth=0.7;g.beginPath();g.moveTo(9,28.4);g.lineTo(63,28.4);g.stroke();
 const hl=()=>{g.fillStyle=lg(g,7,30,24,35,[[0,'#f6f9fb'],[1,'#9aa6b1']]);g.beginPath();g.moveTo(6.8,30.4);g.quadraticCurveTo(16,30.5,25.6,32.2);g.lineTo(24.7,35.3);g.quadraticCurveTo(15.6,34.6,7.6,34.3);g.closePath();g.fill();
  g.strokeStyle='#fff';g.lineWidth=0.6;g.beginPath();g.moveTo(8,34.1);g.quadraticCurveTo(16,34.5,24.4,35.1);g.stroke();disc(g,CP.proj,12,32.3,1);disc(g,CP.proj,18.4,32.9,1);
  if(o.blink){disc(g,CP.amb,7.6,31.6,1);glow(g,7.6,31.6,4,'rgba(255,170,30,0.8)');}
  if(o.lightsOn)glow(g,13,32.6,7,'rgba(255,255,220,0.8)');};
 hl();g.save();g.translate(72,0);g.scale(-1,1);hl();g.restore();
 frr(g,'#15191e',26,31.4,20,4.2,2.1);g.strokeStyle='#6b747e';g.lineWidth=0.35;g.beginPath();g.moveTo(27.5,32.7);g.lineTo(44.5,32.7);g.moveTo(27.5,34.1);g.lineTo(44.5,34.1);g.stroke();
 frr(g,'#15191e',17,38.4,38,6,3);for(let i=0;i<9;i++)disc(g,'#3a424b',20+i*4,41.4,0.6);
 disc(g,o.fog?'#ffffff':'#e8e2c4',11.4,41,1.7);disc(g,o.fog?'#ffffff':'#e8e2c4',60.6,41,1.7);
 frr(g,'#f4f4f4',29,44.2,14,4.2,0.8);frr(g,'#2a4bb0',29,44.2,2.2,4.2,0.6);text(g,'CSV',32.4,45,'#222',0.45,'left',null);
 for(const mx of [2.6,69.4]){g.fillStyle=lg(g,0,21,0,26,[[0,CP.hl],[1,CP.d]]);g.beginPath();g.ellipse(mx,23.4,3.6,2.4,0,0,TAU);g.fill();}
 g.restore();}
/* ---- hátulnézet ---- */
function drawRear(g,x,y,o){g.save();g.translate(x,y);const t=o.t||0;
 frr(g,'#14171b',6.5,43,12,12.5,3.5);frr(g,'#14171b',53.5,43,12,12.5,3.5);
 frr(g,lg(g,0,1,0,7,[[0,'#4c5664'],[1,'#1b2027']]),19,1.2,34,5.4,2.6);
 g.beginPath();g.moveTo(9,30);g.lineTo(16.4,9.6);g.quadraticCurveTo(17.6,7,21,7);g.lineTo(51,7);g.quadraticCurveTo(54.4,7,55.6,9.6);g.lineTo(63,30);g.closePath();g.fillStyle=lg(g,0,7,0,30,[[0,CP.hl],[1,CP.l]]);g.fill();
 frr(g,'#1b2027',16,6.4,40,3,1.5);frr(g,o.brake?'#ff4040':'#7a1820',29,7.3,14,1.1,0.5);
 const tg=()=>{g.beginPath();g.moveTo(15.6,23.4);g.lineTo(19,10.8);g.quadraticCurveTo(19.6,10,21,10);g.lineTo(51,10);g.quadraticCurveTo(52.4,10,53,10.8);g.lineTo(56.4,23.4);g.closePath();};
 tg();g.fillStyle=lg(g,0,10,0,24,[[0,'#9cc2d8'],[1,'#22394a']]);g.fill();
 g.save();tg();g.clip();frr(g,'#d8433b',19,17,8,7,1.4);frr(g,'#3f7fd9',45,16,8,8,1.4);frr(g,'#f2c14e',27,18.6,6,5,1.2);
  disc(g,FAM.anna.hair,32,13.5,2.8);disc(g,FAM.petra.hair,41,14,2.5);g.fillStyle='rgba(16,34,52,0.3)';g.fillRect(0,0,72,30);
  g.fillStyle='rgba(255,255,255,0.15)';g.beginPath();g.moveTo(20,23);g.lineTo(26,10);g.lineTo(30,10);g.lineTo(24,23);g.closePath();g.fill();g.restore();
 const a=-(o.wipe||0)*2.2;line(g,'#14171c',36,22.6,36-Math.cos(a)*10,22.6+Math.sin(a)*10,0.8);
 frr(g,lg(g,0,26,0,49,[[0,CP.l],[0.55,CP.m],[1,CP.dd]]),4,25.6,64,23.2,8);
 frr(g,lg(g,0,24.6,0,28.4,[[0,o.brake?'#ff7070':'#ff5a5a'],[1,o.brake?'#ff2020':'#8e1c24']]),4.6,24.6,62.8,3.8,1.9);if(o.brake){glow(g,10,26.5,8,'rgba(255,40,40,0.6)');glow(g,62,26.5,8,'rgba(255,40,40,0.6)');}
 frr(g,'rgba(255,220,220,0.7)',6,25.3,60,0.7,0.35);
 if(o.blink){disc(g,CP.amb,7,26.4,1.1);disc(g,CP.amb,65,26.4,1.1);glow(g,7,26.4,4,'rgba(255,170,30,0.8)');glow(g,65,26.4,4,'rgba(255,170,30,0.8)');}
 frr(g,'#eef3f7',29.6,30.4,12.8,1,0.5);frr(g,'#f4f4f4',29,33.4,14,4.2,0.8);frr(g,'#2a4bb0',29,33.4,2.2,4.2,0.6);text(g,'CSV',32.4,34.2,'#222',0.45,'left',null);
 frr(g,lg(g,0,40,0,49,[[0,CP.d],[1,CP.dd]]),5,40,62,8.4,3.6);frr(g,CP.tl,7,42,5,1.1,0.5);frr(g,CP.tl,60,42,5,1.1,0.5);if(o.fog){frr(g,'#ff3030',7,42,5,1.1,0.5);glow(g,9.5,42.5,4,'rgba(255,40,40,0.8)');}
 frr(g,'#2a2f36',50,46.8,4.4,2,1);g.restore();}
/* ---- felülnézet ---- */
function drawTop(g,x,y,o){g.save();g.translate(x,y);
 for(const [wx,wy2] of [[18,3.6],[18,48.4],[83,3.6],[83,48.4]])frr(g,'#14171b',wx,wy2,13,4,1.6);
 g.beginPath();g.moveTo(10,7.6);g.lineTo(88,7.6);g.bezierCurveTo(100,7.6,108,14,108,28);g.bezierCurveTo(108,42,100,48.4,88,48.4);g.lineTo(10,48.4);g.bezierCurveTo(4,48.4,1.6,44,1.6,38);g.lineTo(1.6,18);g.bezierCurveTo(1.6,12,4,7.6,10,7.6);g.closePath();
 g.fillStyle=lg(g,0,7.6,0,48.4,[[0,CP.d],[0.2,CP.l],[0.5,CP.hl],[0.8,CP.l],[1,CP.d]]);g.fill();
 g.fillStyle=lg(g,0,10,0,46,[[0,'#7fa6be'],[0.5,'#9cc2d8'],[1,'#7fa6be']]);g.beginPath();g.moveTo(70,11.5);g.lineTo(84,10.4);g.quadraticCurveTo(88,28,84,45.6);g.lineTo(70,44.5);g.closePath();g.fill();
 frr(g,lg(g,0,12,0,44,[[0,'#2d4a5e'],[0.5,'#4f7690'],[1,'#2d4a5e']]),12,12.6,56,30.8,6);
 g.fillStyle='rgba(255,255,255,0.14)';for(let k=0;k<4;k++){g.beginPath();g.moveTo(16+k*13,42);g.lineTo(24+k*13,14);g.lineTo(28+k*13,14);g.lineTo(20+k*13,42);g.closePath();g.fill();}
 g.strokeStyle='#e3e9ee';g.lineWidth=0.9;g.beginPath();g.moveTo(13,11.2);g.lineTo(66,11.2);g.moveTo(13,44.8);g.lineTo(66,44.8);g.stroke();
 frr(g,lg(g,0,18,0,38,[[0,'#2a313a'],[0.5,'#4c5664'],[1,'#2a313a']]),20,18,40,20,6);
 g.fillStyle=CP.m;g.beginPath();g.ellipse(71,6,3.4,2,0,0,TAU);g.fill();g.beginPath();g.ellipse(71,50,3.4,2,0,0,TAU);g.fill();
 frr(g,'#eef3f8',101,13,5,6,2.4);frr(g,'#eef3f8',101,37,5,6,2.4);frr(g,CP.tl,1.6,11,2.4,34,1.2);
 if(o.blink){for(const [bx,by2] of [[104,11],[104,45],[2.6,9.6],[2.6,46.4]])glow(g,bx,by2,4,'rgba(255,170,30,0.9)');}
 g.restore();}

/* ---- más járművek valós méretarányban (1 m = 24,4 képpont, mint a családi autónál) ---- */
const MPX=112/CAR.len;
const TW={hatch:Math.round(4.0*MPX),police:Math.round(4.6*MPX),ambulance:Math.round(5.9*MPX),van:Math.round(5.2*MPX),camper:Math.round(7.0*MPX),bus:Math.round(12*MPX),truck:Math.round(16.5*MPX),tractor:Math.round(4.4*MPX),moto:Math.round(2.1*MPX)};
const TH={hatch:37,police:38,ambulance:62,van:56,camper:74,bus:80,truck:98,tractor:70,moto:34};
const TCOLS=['#d64545','#3f7fd9','#f2c14e','#4caf6a','#e8e8e8','#8e5cc4','#f08a3c','#3a3f47','#2a6a8a'];
function vpath(g,pts){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();}
function vpaint(g,c,top,bot){return lg(g,0,top,0,bot,[[0,shade(c,1.3)],[0.3,shade(c,1.08)],[0.45,c],[0.47,shade(c,0.8)],[1,shade(c,0.55)]]);}
function outline(g){g.strokeStyle='#0c0f14';g.lineWidth=1;g.stroke();}
/* ---- élethűbb forgalmi járművek (v2.28): a karosszéria egyszer, előre rajzolódik (TRC tár), menet közben csak a kerék, a vezető és a villogók ---- */
const TRC=new Map();
function trLayer(g,key,L,H,draw){const tr=g.getTransform(),zs=Math.max(1,Math.round(Math.hypot(tr.a,tr.b)*4)/4),ck=key+'|'+zs;let c=TRC.get(ck);
 if(c){TRC.delete(ck);TRC.set(ck,c);}else{if(TRC.size>=24){const k0=TRC.keys().next().value;freeCv(TRC.get(k0));TRC.delete(k0);}const r=mk(L+12,H+14,zs);r[1].translate(6,H+10);draw(r[1]);c=r[0];TRC.set(ck,c);}
 g.drawImage(c,-6,-H-10,L+12,H+14);}
function tvBodyG(g,c,top,bot){return lg(g,0,top,0,bot,[[0,shade(c,1.4)],[0.16,shade(c,1.15)],[0.42,c],[0.47,shade(c,0.84)],[1,shade(c,0.58)]]);}
function tvGlassG(g,top,bot){return lg(g,0,top,0,bot,[[0,'#26343f'],[0.5,'#5a7f96'],[1,'#1f2b35']]);}
function tvArch(g,x,y,r){g.fillStyle='#101317';g.beginPath();g.arc(x,y,r,Math.PI,TAU);g.lineTo(x+r,y+3);g.lineTo(x-r,y+3);g.closePath();g.fill();
 g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=1.2;g.beginPath();g.arc(x,y,r+0.6,Math.PI*1.05,Math.PI*1.95);g.stroke();}
function tvGlass(g,pts,top,bot){g.save();vpath(g,pts);g.clip();g.fillStyle=tvGlassG(g,top,bot);g.fill();
 g.fillStyle='rgba(255,255,255,0.16)';const x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0]));for(let x=x0+4;x<x1;x+=17){g.beginPath();g.moveTo(x,bot);g.lineTo(x+7,top);g.lineTo(x+11,top);g.lineTo(x+4,bot);g.closePath();g.fill();}
 g.restore();vpath(g,pts);g.strokeStyle='#14181e';g.lineWidth=0.9;g.stroke();}
function tvSeam(g,pts){g.strokeStyle='rgba(0,0,0,0.32)';g.lineWidth=0.6;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();}
function tvHandle(g,x,y){frr(g,'rgba(0,0,0,0.38)',x,y,4.2,1.4,0.7);frr(g,'rgba(255,255,255,0.35)',x+0.4,y,3.4,0.5,0.25);}
function tvHeadL(g,pts,cx,cy){vpath(g,pts);g.fillStyle=lg(g,cx-4,cy-2,cx+4,cy+2,[[0,'#cfd9e2'],[1,'#ffffff']]);g.fill();g.strokeStyle='#3a434d';g.lineWidth=0.5;g.stroke();disc(g,'#fffbe8',cx,cy,1.3);}
function tvTailL(g,pts){vpath(g,pts);g.fillStyle=lg(g,0,Math.min(...pts.map(p=>p[1])),0,Math.max(...pts.map(p=>p[1])),[[0,'#ff6a5a'],[0.5,'#d0201a'],[1,'#7a0d0a']]);g.fill();g.strokeStyle='#4a0806';g.lineWidth=0.5;g.stroke();}
function tvShoulder(g,x0,y0,x1,y1){g.strokeStyle='rgba(255,255,255,0.42)';g.lineWidth=0.9;g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo((x0+x1)/2,Math.min(y0,y1)-0.6,x1,y1);g.stroke();
 g.strokeStyle='rgba(0,0,0,0.16)';g.lineWidth=1;g.beginPath();g.moveTo(x0,y0+1.3);g.quadraticCurveTo((x0+x1)/2,Math.min(y0,y1)+0.7,x1,y1+1.3);g.stroke();}
/* személyautó: 0 ferdehátú, 1 kombi, 2 kis városi terepjáró; rendőrautó: szedán */
const CARV=[{wr:8.2,wy:-8.2,ar:10.4},{wr:8.2,wy:-8.2,ar:10.4},{wr:9,wy:-9,ar:11.4}];
function drawCarBody(g,L,c,v,police){const hi=v===2?4:0;
 if(police){vpath(g,[]);g.beginPath();g.moveTo(3,-7);g.lineTo(1.5,-13);g.quadraticCurveTo(0.5,-21,2.5,-24);g.lineTo(16,-25.6);g.quadraticCurveTo(22,-26,26,-29);g.lineTo(33,-35);g.quadraticCurveTo(36,-37,42,-37.2);g.lineTo(63,-37.2);g.quadraticCurveTo(68,-37,71,-34.5);
  g.lineTo(80,-26.8);g.quadraticCurveTo(94,-25.4,104,-23);g.quadraticCurveTo(110,-21.4,111.4,-17);g.lineTo(112,-11);g.quadraticCurveTo(112,-7,109,-6.5);g.lineTo(5,-6.5);g.closePath();}
 else if(v===0){g.beginPath();g.moveTo(3,-7);g.lineTo(1.2,-13);g.quadraticCurveTo(0,-20,2,-24.5);g.lineTo(8.5,-31.5);g.quadraticCurveTo(12,-36,18,-36.3);g.lineTo(49,-36.8);g.quadraticCurveTo(55,-36.8,58.5,-34);
  g.lineTo(68,-26.8);g.quadraticCurveTo(80,-25.2,90,-22.8);g.quadraticCurveTo(96,-21.2,97.4,-17);g.lineTo(98,-11);g.quadraticCurveTo(98,-7,95,-6.5);g.lineTo(5,-6.5);g.closePath();}
 else{const R0=-36.6-hi;g.beginPath();g.moveTo(3,-7-hi*0.5);g.lineTo(1,-13-hi*0.5);g.quadraticCurveTo(0,-21-hi,1.5,-27-hi);g.lineTo(3.2,-33.5-hi);g.quadraticCurveTo(4.5,R0,9,R0);g.lineTo(50,R0-0.2);g.quadraticCurveTo(55.5,R0-0.2,58.5,R0+2.6);
  g.lineTo(68,-27-hi*0.6);g.quadraticCurveTo(80,-25.6-hi*0.5,90,-23.2-hi*0.4);g.quadraticCurveTo(96,-21.6-hi*0.3,97.4,-17-hi*0.2);g.lineTo(98,-11);g.quadraticCurveTo(98,-7-hi*0.5,95,-6.5-hi*0.5);g.lineTo(5,-6.5-hi*0.5);g.closePath();}
 const top=police?-37:-37-hi;g.fillStyle=tvBodyG(g,c,top,-6);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.stroke();
 const W=police?[22,L-22]:[20,L-20],cv=CARV[police?0:v];
 if(v===2&&!police){// műanyag kerékív-szegély és küszöb
  g.fillStyle='#2a2e35';g.beginPath();g.moveTo(4,-8);g.lineTo(L-3,-8);g.lineTo(L-3,-12);g.lineTo(4,-12);g.closePath();g.fill();for(const x of W){g.beginPath();g.arc(x,cv.wy,cv.ar+2.2,Math.PI,TAU);g.lineTo(x+cv.ar,cv.wy);g.arc(x,cv.wy,cv.ar,TAU,Math.PI,true);g.closePath();g.fill();}}
 for(const x of W)tvArch(g,x,cv.wy,cv.ar);
 // üvegezés és oszlopok
 if(police){tvGlass(g,[[29,-30],[34.5,-34.6],[42,-35.2],[63,-35.2],[68,-33.4],[77,-26.9],[27,-26.6]],-35,-26);frr(g,'#1a1f26',47,-35.3,3.4,8.8,0.6);
  vpath(g,[[22,-26.4],[33,-35.3],[30,-26.5]]);g.fillStyle=tvBodyG(g,'#eef2f6',-37,-6);g.fill();}
 else if(v===0){tvGlass(g,[[9.5,-30.6],[13,-34.3],[18,-34.6],[49,-35],[55,-34.2],[65.6,-26.9],[11,-26.5]],-35,-26);frr(g,'#1a1f26',37,-35,3.4,8.6,0.6);
  vpath(g,[[9.6,-30.6],[13,-34.3],[22,-34.5],[19,-26.5],[11,-26.5]]);g.fillStyle=tvBodyG(g,c,-37,-6);g.fill();tvSeam(g,[[3,-25],[9.4,-31.4]]);}
 else{const y0=-35-hi,yb=-26.5-hi*0.6;tvGlass(g,[[4.6,yb-3],[6,y0+0.8],[9.5,y0],[50,y0-0.2],[55.5,y0+0.6],[65.6,yb+0.2],[5,yb]],y0,yb);frr(g,'#1a1f26',37,y0,3.4,yb-y0+0.4,0.6);frr(g,'#1a1f26',17.5,y0,3,yb-y0+0.4,0.6);
  R(g,'#2c3138',10,y0-3.4,40,1.4);R(g,'#2c3138',12,y0-2.6,1.6,1.6);R(g,'#2c3138',46,y0-2.6,1.6,1.6);}// tetősín
 // ajtók, kilincsek, tükör, váll-él
 const by=police?-26.6:-26.6-hi*0.6;
 if(police){tvSeam(g,[[50,by],[50,-8]]);tvSeam(g,[[78,by+0.2],[80,-16],[80,-9]]);tvSeam(g,[[28,by],[33,-15],[33,-9]]);tvHandle(g,53,by+4.6);tvHandle(g,36,by+4.6);}
 else{tvSeam(g,[[39,by],[39,-8]]);tvSeam(g,[[65.6,by+0.2],[67,-16],[67.5,-10]]);tvSeam(g,[[18,by],[26,-15],[29.6,-9.5]]);tvHandle(g,42,by+4.4);tvHandle(g,23,by+4.4);}
 const mx=police?75:63;vpath(g,[[mx,by-1.4],[mx+5,by-3],[mx+6,by-0.2],[mx+1,by+1.1]]);g.fillStyle=police?'#1a1f26':shade(c,0.9);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.5;g.stroke();
 tvShoulder(g,4,by+3.6,L-6,by+5.6);
 // lökhárítók, küszöb
 frr(g,'rgba(0,0,0,0.2)',8,-10.4-(v===2&&!police?hi*0.5:0),L-16,2.2,1);
 frr(g,'#1b1f26',L-11,-11.6,9.4,3,1.2);for(let k=0;k<3;k++)R(g,'rgba(255,255,255,0.12)',L-10,-11+k,7.6,0.4);disc(g,'#cfd9e2',L-4,-13.6,0.9);
 frr(g,'rgba(0,0,0,0.25)',1.5,-12.5,8,2,0.8);R(g,'#8b1a1a',2.2,-14.2,3,1.2);
 // lámpák
 const hy=police?-22.4:v===2?-23.6:-22;tvHeadL(g,[[L-12,hy],[L-2.6,hy+1.8],[L-1.2,hy+4.4],[L-10,hy+3.4]],L-5,hy+2.6);
 tvTailL(g,police?[[1.4,-23.6],[9,-24.6],[8.5,-21],[1.2,-20.4]]:v===0?[[1.6,-24.4],[7,-25],[6.4,-20.6],[1,-20.2]]:[[1.4,-31-hi],[4.6,-31.5-hi],[4.2,-21],[1,-21]]);
 if(police){R(g,'#1e4fb5',2,-21.4,L-4.4,6.4);R(g,'#ffffff',2,-15,L-4.4,0.8);text(g,'RENDŐRSÉG',30,-19.6,'#ffffff',0.62,'left',null);frr(g,'#2c3138',42,-39.6,22,2.6,1);}}
/* kisbusz (0 zárt, 1 utas), mentő és lakóautó: közös orr és vezetőfülke */
function vanNose(g,L){g.lineTo(L-31,-52);g.lineTo(L-19,-33.5);g.quadraticCurveTo(L-12,-31,L-6,-28.4);g.quadraticCurveTo(L-0.8,-26.4,L,-20);g.lineTo(L,-11);g.quadraticCurveTo(L,-7,L-3,-6.5);g.lineTo(5,-6.5);g.lineTo(3,-7);g.closePath();}
function vanCab(g,L,c){tvGlass(g,[[L-46,-49.5],[L-32.6,-49.5],[L-22.6,-34.6],[L-46,-34.6]],-50,-34);tvSeam(g,[[L-48,-51],[L-48,-8]]);tvSeam(g,[[L-21.8,-33.4],[L-20,-16],[L-20,-10]]);tvHandle(g,L-44,-30.6);
 vpath(g,[[L-25,-38],[L-18.6,-40],[L-17.6,-33.4],[L-24,-32.6]]);g.fillStyle='#1a1f26';g.fill();
 frr(g,'#1b1f26',L-12,-12,11,4.6,1.4);for(let k=0;k<4;k++)R(g,'rgba(255,255,255,0.1)',L-3,-25+k*2.6,2.4,1.2);
 tvHeadL(g,[[L-11,-27.6],[L-2.4,-25.4],[L-1.2,-21.4],[L-10,-23.2]],L-5,-24.2);disc(g,'#cfd9e2',L-5,-14,1);}
function drawVanBody(g,L,c,tp,v){const amb=tp==='ambulance',T=amb?-62:-56;
 g.beginPath();g.moveTo(3,-7);g.lineTo(2,-12);g.lineTo(2,T+4);g.quadraticCurveTo(2,T,7,T);g.lineTo(L-40,T);if(amb){g.quadraticCurveTo(L-33,T,L-33,T+5);g.lineTo(L-33,-53);}else g.quadraticCurveTo(L-35,T,L-31.5,-52.6);vanNose(g,L);
 const col=amb?'#f4f6f8':c;g.fillStyle=tvBodyG(g,col,T,-6);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.stroke();
 R(g,'rgba(0,0,0,0.28)',3,-18.6,L-8,2.6);R(g,'rgba(255,255,255,0.18)',3,-18.6,L-8,0.6);
 for(const x of [22,L-24])tvArch(g,x,-8.5,11);
 if(v===1&&!amb){const n=3,x0=10,x1=L-54,w=(x1-x0)/n;for(let i=0;i<n;i++)tvGlass(g,[[x0+i*w+1.6,-49.5],[x0+(i+1)*w-1.6,-49.5],[x0+(i+1)*w-1.6,-37],[x0+i*w+1.6,-37]],-50,-37);}
 tvSeam(g,[[L-82,-52],[L-82,-8]]);R(g,'rgba(0,0,0,0.35)',20,-44.6,L-70,0.8);tvHandle(g,L-79,-30.6);tvSeam(g,[[9,T+3],[9,-8]]);
 vanCab(g,L,c);
 tvTailL(g,[[1.4,-31],[4.6,-31],[4.6,-15],[1.4,-15]]);R(g,'#ffb02e',1.6,-24,2.8,3);
 if(amb){for(let x=3,k=0;x<L-24;x+=8,k++){R(g,k%2?'#ffd400':'#1f8a3a',x,-28,Math.min(8,L-24-x),5);R(g,k%2?'#1f8a3a':'#ffd400',x,-23,Math.min(8,L-24-x),5);}
  R(g,'#d32f2f',2,T+8,L-36,3);text(g,'MENTŐ',20,T+15,'#1e4fb5',0.95,'left',null);
  g.fillStyle='#1e4fb5';for(let a=0;a<3;a++){g.save();g.translate(L-64,T+20);g.rotate(a*Math.PI/3);g.fillRect(-1.6,-6,3.2,12);g.restore();}disc(g,'#ffffff',L-64,T+20,1.2);
  frr(g,'#2c3138',L-50,T-3.4,14,3.4,1);}}
function drawCamperBody(g,L,c){const T=-72;
 g.beginPath();g.moveTo(3,-7);g.lineTo(2,-12);g.lineTo(2,T+5);g.quadraticCurveTo(2,T,8,T);g.lineTo(L-44,T);g.quadraticCurveTo(L-20,T,L-21,T+10);g.quadraticCurveTo(L-21,-54,L-31,-52.4);vanNose(g,L);
 g.fillStyle=lg(g,0,T,0,-6,[[0,'#ffffff'],[0.6,'#eceee9'],[1,'#bfc4c0']]);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.stroke();
 // dekorcsíkok
 g.fillStyle=shade(c,1.05);g.beginPath();g.moveTo(2,-30);g.bezierCurveTo(L*0.35,-30,L*0.5,-46,L-46,-48);g.lineTo(L-44,-44);g.bezierCurveTo(L*0.5,-42,L*0.35,-25,2,-25);g.closePath();g.fill();
 g.fillStyle=shade(c,0.7);g.beginPath();g.moveTo(2,-24);g.bezierCurveTo(L*0.35,-24,L*0.5,-40,L-44,-42.6);g.lineTo(L-43,-40.4);g.bezierCurveTo(L*0.5,-37,L*0.35,-21.5,2,-21.5);g.closePath();g.fill();
 R(g,'#3a3f47',3,-13,L-26,4);
 for(const x of [22,44,L-24])tvArch(g,x,-8.5,11);
 // ablakok redőnnyel, ajtó, alkóv ablak, tetőklíma
 const win=(x,y,w,h)=>{frr(g,'#2a2f36',x-1.2,y-1.2,w+2.4,h+2.4,2.4);tvGlass(g,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],y,y+h);R(g,'rgba(240,230,210,0.55)',x,y,w,h*0.3);};
 win(14,-58,26,14);win(78,-58,22,14);win(L-52,-67,18,7);
 frr(g,'rgba(0,0,0,0.08)',52,-66,19,54,2);tvSeam(g,[[52,-66],[71,-66],[71,-12],[52,-12],[52,-66]]);win(56,-60,11,13);tvHandle(g,66,-38);frr(g,'#9aa3ad',55,-11,13,2,1);
 frr(g,'#e8ebe6',60,T-6,24,6,2);g.strokeStyle='#8a929c';g.lineWidth=0.6;rrect(g,60,T-6,24,6,2);g.stroke();
 vanCab(g,L,c);tvTailL(g,[[1.4,-34],[4.6,-34],[4.6,-16],[1.4,-16]]);R(g,'#ffb02e',1.6,-27,2.8,3);}
function drawTractorBody(g,L){const G1='#4fbf5a',G2='#2a7a33';
 // motorház
 vpath(g,[[40,-24],[40,-42],[46,-45],[L-12,-44],[L-4,-40],[L-2,-28],[L-4,-22],[40,-22]]);g.fillStyle=lg(g,0,-45,0,-22,[[0,shade(G1,1.25)],[0.5,G1],[1,G2]]);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.stroke();
 for(let k=0;k<5;k++)R(g,'rgba(0,0,0,0.28)',56+k*5,-38,1.6,10);frr(g,'#1b1f26',L-5,-39,3,15,1);for(let k=0;k<5;k++)R(g,'#5a636d',L-4.6,-37.6+k*2.8,2.2,1);
 tvHeadL(g,[[L-10,-43],[L-4,-41.6],[L-4,-38.6],[L-10,-39.6]],L-7,-41);frr(g,'#2c3138',L-30,-62,3,18,1);frr(g,'#1b1f26',L-31,-64,5,3,1);
 // fülke
 const cx0=8,cx1=46,cT=-70;frr(g,G2,cx0-2,cT-3,cx1-cx0+6,4,2);
 tvGlass(g,[[cx0+2,cT+2],[cx1,cT+2],[cx1+2,-42],[cx0+2,-42]],cT,-42);for(const x of [cx0,cx1-1])frr(g,'#1f242b',x,cT,2.4,30,1);frr(g,'#1f242b',cx0+20,cT+2,1.6,28,0.6);
 frr(g,'#ffb02e',cx0+16,cT-6,6,3,1.2);
 // sárvédők
 g.fillStyle=lg(g,0,-50,0,-30,[[0,shade(G1,1.2)],[1,G2]]);g.beginPath();g.arc(26,-22,26,Math.PI*1.02,Math.PI*1.98);g.arc(26,-22,23,Math.PI*1.98,Math.PI*1.02,true);g.closePath();g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.7;g.stroke();
 g.beginPath();g.arc(L-18,-11,14,Math.PI*1.1,Math.PI*1.9);g.arc(L-18,-11,12,Math.PI*1.9,Math.PI*1.1,true);g.closePath();g.fill();
 R(g,'#3a3f47',8,-26,40,3);frr(g,'#3a3f47',44,-20,10,2,1);frr(g,'#3a3f47',44,-14,10,2,1);tvTailL(g,[[3,-40],[6,-40],[6,-34],[3,-34]]);}
function drawTraffic(g,e,sx,lights,lightsOn,t){const gy=e.y,c=e.col,ang=e.x/8,L=e.w,glass='#5f88a2';g.save();g.translate(sx,gy);if(e.wreck)g.rotate(e.wreck===1?-0.06:0.04);
 g.fillStyle=rg(g,L/2,0,2,L/2+6,[[0,'rgba(0,0,0,0.35)'],[1,'rgba(0,0,0,0)']]);g.save();g.scale(1,0.08);g.beginPath();g.arc(L/2,0,L/2+6,0,TAU);g.fill();g.restore();
 const head=(x,y,s)=>headSide(g,x,y,'apa',t,s||0.8);
 if(e.tp==='hatch'||e.tp==='police'){const pol=e.tp==='police';if(e.sty===undefined)e.sty=pol?0:(Math.random()*3)|0;const v=pol?0:e.sty,cv=CARV[v];
  trLayer(g,(pol?'pol':'car'+v)+c,L,TH[e.tp]+(v===2?4:0),gg=>drawCarBody(gg,L,pol?'#eef2f6':c,v,pol));
  head(pol?60:52,pol?-30.6:-30.6-(v===2?3:0));
  if(pol){const on=((t>>3)&1);frr(g,on?'#3b7bff':'#1b3a8a',44,-42.4,8,3,1.2);frr(g,on?'#8a1b1b':'#ff3b3b',53,-42.4,8,3,1.2);glow(g,on?48:57,-41,9,on?'rgba(60,120,255,0.85)':'rgba(255,60,60,0.85)');if(lights)lights.push({x:sx+52,y:gy-41,r:26});}
  const W=pol?[22,L-22]:[20,L-20];wheel(g,W[0],cv.wy,ang,false,cv.wr);wheel(g,W[1],cv.wy,ang,false,cv.wr);}
 else if(e.tp==='van'||e.tp==='ambulance'){const amb=e.tp==='ambulance';if(e.sty===undefined)e.sty=(Math.random()*2)|0;
  trLayer(g,(amb?'amb':'van'+e.sty)+c,L,amb?62:56,gg=>drawVanBody(gg,L,c,e.tp,e.sty));head(L-38,-41.5);
  if(amb){const on=((t>>3)&1);frr(g,on?'#3b7bff':'#1b3a8a',L-50,-67,6,3,1);frr(g,on?'#1b3a8a':'#3b7bff',L-42,-67,6,3,1);glow(g,on?L-47:L-39,-66,10,'rgba(60,120,255,0.85)');if(lights)lights.push({x:sx+L-44,y:gy-66,r:28});}
  wheel(g,22,-8.5,ang,false,8.8);wheel(g,L-24,-8.5,ang,false,8.8);}
 else if(e.tp==='camper'){trLayer(g,'camp'+c,L,80,gg=>drawCamperBody(gg,L,c));head(L-38,-41.5);wheel(g,22,-8.5,ang,false,8.8);wheel(g,44,-8.5,ang,false,8.8);wheel(g,L-24,-8.5,ang,false,8.8);}
 else if(e.tp==='bus'){trLayer(g,'bus'+c,L,86,gg=>drawBusBody(gg,L,c));head(L-16,-52,1);
  frr(g,'#111',L-30,-79,24,6,1.5);text(g,(LEGS[G.leg]?LEGS[G.leg].to.split(' (')[0]:'').slice(0,8),L-18,-78,'#ffb02e',0.5,'center',null);
  for(const wx of [50,74,L-58])twheel(g,wx,-12,12,ang);}
 else if(e.tp==='truck'){const cx=L-70;if(e.sty===undefined)e.sty=(Math.random()*3)|0;trLayer(g,'trk'+e.sty+c,L,100,gg=>drawTruckBody(gg,L,c,e.sty));head(L-18,-66,1.05);
  for(const wx of [36,62,88])twheel(g,wx,-12,12,ang);twheel(g,cx+14,-12,12,ang);twheel(g,L-19,-12,12,ang);}
 else if(e.tp==='tractor'){trLayer(g,'trac',L,76,gg=>drawTractorBody(gg,L));head(28,-55,1);wheel(g,26,-22,ang*0.5,false,22);wheel(g,L-18,-11,ang,false,11);}
 else if(e.tp==='moto'){const r=8.5,rx=9,fx=L-9,wy=-r;
  // váz, kipufogó, villa
  line(g,'#2c333c',rx,wy,fx-8,wy-6,2.2);line(g,'#9aa3ad',fx,wy,fx-6,wy-20,1.8);frr(g,lg(g,0,wy-3,0,wy+1,[[0,'#e6eaee'],[1,'#7d858d']]),rx-2,wy-4,24,3.4,1.6);
  // idom, tank, ülés
  g.beginPath();g.moveTo(fx-16,wy-6);g.quadraticCurveTo(fx-4,wy-8,fx-3,wy-17);g.quadraticCurveTo(fx-6,wy-25,fx-12,wy-24);g.lineTo(fx-20,wy-15);g.closePath();g.fillStyle=vpaint(g,c,wy-25,wy-6);g.fill();outline(g);
  frr(g,'rgba(160,210,235,0.8)',fx-10,wy-28,5,6,2);// plexi
  g.beginPath();g.moveTo(rx+10,wy-12);g.quadraticCurveTo(rx+16,wy-19,rx+26,wy-18);g.lineTo(fx-18,wy-15);g.lineTo(fx-20,wy-9);g.lineTo(rx+12,wy-8);g.closePath();g.fillStyle=vpaint(g,c,wy-19,wy-8);g.fill();outline(g);
  frr(g,'#1b1f26',rx+2,wy-15,14,3.4,1.6);frr(g,vpaint(g,c,wy-18,wy-12),rx-3,wy-17,8,4,2);frr(g,'#d32f2f',rx-4,wy-15,2,2,0.8);
  // motoros: bukósisak, dzseki, előredőlve
  const jc=shade(c,0.55);g.fillStyle='#2a2f36';g.beginPath();g.moveTo(rx+12,wy-14);g.lineTo(rx+20,wy-14);g.lineTo(rx+24,wy-6);g.lineTo(rx+20,wy-5);g.closePath();g.fill();
  g.fillStyle=jc;g.beginPath();g.moveTo(rx+9,wy-15);g.quadraticCurveTo(rx+12,wy-30,rx+22,wy-31);g.lineTo(rx+25,wy-26);g.lineTo(rx+18,wy-15);g.closePath();g.fill();
  line(g,jc,rx+22,wy-28,fx-10,wy-22,2.4);disc(g,'#1b1f26',fx-10,wy-22,1.3);
  disc(g,'#f4f6f8',rx+25,wy-34,5);g.fillStyle='#1b1f26';g.beginPath();g.arc(rx+26.5,wy-33.5,3.6,-0.6,0.9);g.closePath();g.fill();R(g,shade(c,1),rx+20.5,wy-36,8,1.4);
  frr(g,'#fff3c4',fx-5,wy-19,3,2.4,1);wheel(g,rx,wy,ang,false,r);wheel(g,fx,wy,ang,false,r);disc(g,'#9aa3ad',fx,wy,3);}
 if(e.wreck){disc(g,'rgba(120,120,120,0.4)',L*0.8,-TH[e.tp]-8-Math.sin(t*0.05)*3,8);disc(g,'rgba(150,150,150,0.3)',L*0.7,-TH[e.tp]-18-Math.sin(t*0.04)*4,10);}
 g.restore();if(lightsOn&&lights)lights.push({x:sx+e.w,y:gy-18,r:20});}
/* nagy jármű kereke (acélfelni, kevés rajzolási művelet) */
function twheel(g,cx,cy,r,ang){disc(g,'#15181c',cx,cy,r);disc(g,'#2a2f36',cx,cy,r*0.86);disc(g,'#a9b2bb',cx,cy,r*0.6);disc(g,'#6a737c',cx,cy,r*0.44);
 const a=ang*0.8,c=Math.cos(a)*r*0.44,s=Math.sin(a)*r*0.44;line(g,'#d3dae1',cx-c,cy-s,cx+c,cy+s,r*0.11);line(g,'#d3dae1',cx+s,cy-c,cx-s,cy+c,r*0.11);disc(g,'#e4e9ee',cx,cy,r*0.17);}
function archDark(g,x,r){g.fillStyle='#101317';g.beginPath();g.arc(x,-12,r,Math.PI,TAU);g.lineTo(x+r,-8);g.lineTo(x-r,-8);g.closePath();g.fill();}
/* távolsági busz (előre megrajzolt kép: karosszéria, utasok, ablakok) */
function drawBusBody(g,L,c){const T=-80,B=-12;
 const body=()=>{g.beginPath();g.moveTo(2,B);g.lineTo(2,T+10);g.quadraticCurveTo(2,T,12,T);g.lineTo(L-30,T);g.quadraticCurveTo(L-7,T,L-3.5,T+20);g.lineTo(L-0.5,B-10);g.quadraticCurveTo(L,B,L-7,B);g.closePath();};
 body();g.fillStyle=lg(g,0,T,0,B,[[0,'#ffffff'],[0.42,'#f1f4f7'],[0.62,'#dfe5eb'],[1,'#b7c0c9']]);g.fill();
 g.save();body();g.clip();
 // lendületes festés: alsó színes mező, előre felfutó ív, vékony díszcsík
 g.fillStyle=lg(g,0,-44,0,B,[[0,shade(c,1.22)],[0.5,c],[1,shade(c,0.62)]]);g.beginPath();g.moveTo(0,-30);g.bezierCurveTo(L*0.4,-30,L*0.62,-26,L*0.78,-46);g.quadraticCurveTo(L*0.86,-58,L+4,-60);g.lineTo(L+4,B+4);g.lineTo(0,B+4);g.closePath();g.fill();
 g.strokeStyle=shade(c,1.5);g.lineWidth=1.4;g.beginPath();g.moveTo(0,-34);g.bezierCurveTo(L*0.4,-34,L*0.6,-30,L*0.76,-50);g.quadraticCurveTo(L*0.84,-62,L+4,-64);g.stroke();
 R(g,'rgba(255,255,255,0.55)',0,T+1.5,L,1.2);g.restore();body();outline(g);
 // tetőklíma, tetőablak
 frr(g,lg(g,0,T-6,0,T,[[0,'#f6f8fa'],[1,'#b5bec7']]),L*0.32,T-5,74,6,3);g.strokeStyle='#0c0f14';g.lineWidth=0.6;rrect(g,L*0.32,T-5,74,6,3);g.stroke();R(g,'rgba(0,0,0,0.25)',L*0.32+6,T-3,62,0.8);
 // panoráma ablaksor sötétített üveggel, utasokkal
 const wy=T+10,wh=27,wx0=10,wx1=L-46;frr(g,lg(g,0,wy,0,wy+wh,[[0,'#24323f'],[0.55,'#3a5468'],[1,'#17212b']]),wx0,wy,wx1-wx0,wh,4);
 const SK=['#f0c39a','#c99a6e','#e8b48a','#a8754e','#f6d0ae'],SH=['#3f7fd9','#e05a8a','#5bd06a','#ffcf33','#9c6bff','#f08a3c'],HR=['#3a2a1c','#6b4423','#f2d16b','#1b1b1b','#a5522a'];
 for(let k=0;k<12;k++){const px=20+k*21.5;if(px>wx1-8)break;if(hsh(k*13+5)<0.18)continue;const hy=wy+15+hsh(k*7)*2;
  R(g,SH[k%SH.length],px-4.5,hy+3,9,wh-15);disc(g,SK[(k*3)%SK.length],px,hy,3.4);g.fillStyle=HR[(k*2)%HR.length];g.beginPath();g.arc(px-0.4,hy-0.6,3.6,Math.PI*0.95,Math.PI*2.05);g.fill();
  disc(g,'#14171c',px+1.4,hy-0.2,0.55);}
 R(g,'rgba(20,28,36,0.35)',wx0,wy,wx1-wx0,wh);for(let k=wx0+30;k<wx1-6;k+=31)R(g,'#0c0f14',k,wy,2.4,wh);
 g.fillStyle='rgba(255,255,255,0.16)';for(let k=0;k<8;k++){g.beginPath();g.moveTo(14+k*34,wy+wh);g.lineTo(28+k*34,wy);g.lineTo(36+k*34,wy);g.lineTo(22+k*34,wy+wh);g.closePath();g.fill();}
 R(g,'rgba(255,255,255,0.35)',wx0+2,wy+1,wx1-wx0-4,0.8);
 // csomagtérajtók
 for(let k=0;k<3;k++){const x=78+k*44;g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=0.7;rrect(g,x,-36,40,20,2);g.stroke();frr(g,'rgba(0,0,0,0.3)',x+17,-22,6,1.6,0.8);}
 // ajtók (első és középső)
 for(const dx of [L-48,L*0.5]){frr(g,'#22303b',dx,T+9,17,B-T-11,2.5);frr(g,'rgba(150,195,222,0.5)',dx+1.6,T+11,6.2,36,1.4);frr(g,'rgba(150,195,222,0.5)',dx+9.2,T+11,6.2,36,1.4);R(g,'#0c0f14',dx+8.1,T+9,0.8,B-T-11);R(g,'rgba(255,255,255,0.3)',dx+2,T+12,1,30);}
 // szélvédő (ívelt, nagy), napellenző, ablaktörlő
 g.beginPath();g.moveTo(L-30,T+5);g.quadraticCurveTo(L-11,T+5,L-6.5,T+20);g.lineTo(L-3.5,T+46);g.lineTo(L-28,T+46);g.closePath();g.fillStyle=lg(g,L-30,T,L,T+46,[[0,'#b2d7ea'],[0.5,'#6f9bb5'],[1,'#2f4b60']]);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.8;g.stroke();
 g.fillStyle='rgba(255,255,255,0.28)';g.beginPath();g.moveTo(L-24,T+44);g.lineTo(L-16,T+8);g.lineTo(L-11,T+9);g.lineTo(L-19,T+44);g.closePath();g.fill();
 line(g,'#1b1f26',L-20,T+45,L-9,T+33,0.9);
 // homlokfal: fényszóró, lökhárító, hűtőrács
 frr(g,lg(g,L-10,-30,L,-24,[[0,'#dfe7ee'],[1,'#ffffff']]),L-10,-30,8.5,4.6,2);disc(g,'#fffbe8',L-4,-27.7,1.4);
 frr(g,'#2c333c',L-16,B-4,16,5,2);for(let k=0;k<3;k++)R(g,'rgba(0,0,0,0.4)',L-12,-21+k*2.4,9,1);
 // hátul: lámpasor, motorrács, létra nélküli sima hát
 frr(g,lg(g,0,T+24,0,T+52,[[0,'#ff6a5a'],[1,'#8a110c']]),1.5,T+24,3.4,28,1.4);frr(g,'#ffaa22',1.5,T+54,3.4,4,1);
 for(let k=0;k<5;k++)R(g,'rgba(0,0,0,0.3)',6,-30+k*3,16,1.2);
 // felirat
 text(g,'TÚRA EXPRESSZ',L*0.36,-27,'#ffffff',1,'center',null);
 // kerékívek
 for(const wx of [50,74,L-58])archDark(g,wx,15);
 // „nyúlfül” tükör
 g.strokeStyle='#1b1f26';g.lineWidth=1.6;g.beginPath();g.moveTo(L-6,T+10);g.quadraticCurveTo(L+6,T+5,L+5,T+20);g.stroke();frr(g,"#1b1f26",L+1,T+18,4.5,10,1.5);}
/* nyerges kamion: 0 ponyvás, 1 hűtős doboz, 2 tartályos; előre megrajzolt kép */
function drawTruckBody(g,L,c,sty){const cab=70,cx=L-cab,tl=cx-8,T=-98,B=-24;
 // alváz, nyeregszerkezet, kipufogó
 R(g,'#1d2228',0,B,cx+cab-20,5);frr(g,'#2a3038',cx-14,B-4,20,5,1.5);
 if(sty===2){// tartály: lekerekített henger, járópálca, létra, veszélyjel
  const tT=-84;frr(g,'#2a3038',0,B-6,tl,8,1);g.fillStyle=lg(g,0,tT,0,B-4,[[0,'#f4f7f9'],[0.25,'#c9d1d9'],[0.5,'#8e99a4'],[0.75,'#c9d1d9'],[1,'#6f7a85']]);rrect(g,2,tT,tl-4,B-4-tT,(B-4-tT)/2);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=1;g.stroke();
  for(let k=40;k<tl-30;k+=56){R(g,'rgba(0,0,0,0.18)',k,tT+1,1.6,B-tT-6);}R(g,'#59616a',20,tT-4,tl-40,2);for(let k=24;k<tl-20;k+=16)R(g,'#59616a',k,tT-4,1,4);
  for(let k=0;k<6;k++)R(g,'#59616a',tl-30,tT+4+k*7,9,1.2);R(g,'#59616a',tl-30,tT+2,1.2,44);R(g,'#59616a',tl-22,tT+2,1.2,44);
  frr(g,'#ff8f1f',tl/2-12,tT+20,24,14,1);g.strokeStyle='#111';g.lineWidth=0.8;rrect(g,tl/2-12,tT+20,24,14,1);g.stroke();R(g,'#111',tl/2-12,tT+26.6,24,0.8);
  text(g,'ÜZEMANYAG',tl/2,tT+40,'#3a434d',1,'center',null);}
 else{// doboz
  const white=sty===1,bc=white?'#f4f6f8':'#eef1f4';g.fillStyle=lg(g,0,T,0,B,[[0,'#ffffff'],[0.4,bc],[1,'#c0c8d0']]);rrect(g,0,T,tl,B-T,3);g.fill();outline(g);
  if(sty===0){// ponyva: feszítőhevederek, enyhe redők, színes sáv, logó
   for(let k=14;k<tl-6;k+=26){g.fillStyle='rgba(0,0,0,0.06)';g.fillRect(k-8,T+3,7,B-T-6);R(g,'#7d868f',k,T+3,1.3,B-T-6);frr(g,'#4a525b',k-1.2,B-7,3.8,3.4,0.7);}
   g.fillStyle=lg(g,0,T+4,0,T+16,[[0,shade(c,1.15)],[1,shade(c,0.8)]]);g.fillRect(0,T+4,tl,10);
   text(g,'TRANS EURÓPA',tl/2,T+30,shade(c,0.8),2,'center',null);text(g,'LOGISZTIKA',tl/2,T+50,'#6d7680',1,'center',null);}
  else{// hűtős: sima panelek, hűtőgép elöl, hópehely
   for(let k=40;k<tl-10;k+=40)R(g,'rgba(0,0,0,0.12)',k,T+2,0.8,B-T-4);R(g,'rgba(0,0,0,0.1)',0,T+3,tl,0.8);
   frr(g,lg(g,tl,T+8,tl+8,T+8,[[0,'#d6dde4'],[1,'#8f9aa5']]),tl-1,T+8,9,30,2);for(let k=0;k<5;k++)R(g,'#59616a',tl+1,T+12+k*5,5,1.4);
   const sx=tl*0.22,sy=T+36;g.strokeStyle='#3b8be0';g.lineWidth=2;g.lineCap='round';g.beginPath();for(let k=0;k<3;k++){const a=k*Math.PI/3;g.moveTo(sx-Math.cos(a)*11,sy-Math.sin(a)*11);g.lineTo(sx+Math.cos(a)*11,sy+Math.sin(a)*11);}g.stroke();
   text(g,'FRISS ÁRU',tl*0.58,T+28,shade(c,0.75),2,'center',null);text(g,'HŰTÖTT SZÁLLÍTÁS',tl*0.58,T+48,'#6d7680',1,'center',null);
   R(g,shade(c,0.9),0,B-8,tl,4);}
  // hátsó ajtókeret, kontúrjelölés (sárga-piros csíkok)
  R(g,'#9aa3ad',0,T,2.4,B-T);for(let k=4;k<tl-4;k+=10)R(g,(k/10|0)%2?'#ffd84a':'#e53935',k,B-3.6,6,1.6);}
 // oldalsó aláfutásgátló, oldalsó jelzőfények, támasztóláb, pótkerék
 R(g,'#4a525b',108,B+7,tl-150,1.8);R(g,'#4a525b',108,B+12,tl-150,1.8);for(let k=108;k<tl-40;k+=36)R(g,'#3a4048',k,B+5,1.6,9);
 for(let k=20;k<tl-10;k+=48){disc(g,'#ffaa22',k,B+1.5,1.3);}
 R(g,'#b8c0c8',tl-58,B+5,3,12);R(g,'#5b636d',tl-60,B+16,7,1.6);
 disc(g,'#15181c',tl-30,B+9,6);disc(g,'#6a737c',tl-30,B+9,3);
 frr(g,'#c62a35',0.5,B-12,3,9,1);frr(g,'#ffaa22',0.5,B-3,3,3,1);frr(g,'#1b1f26',0,B+4,9,11,1);// hátsó lámpa, sárvédő gumi
 // kipufogó kémény a fülke mögött
 frr(g,lg(g,cx-5,0,cx-1,0,[[0,'#f0f3f6'],[1,'#7d868f']]),cx-5,-90,4,58,1.5);frr(g,'#2a3038',cx-5.5,-92,5,3,1);
 // fülke (fülke-motor fölött), tetőterelő
 g.beginPath();g.moveTo(cx+1,-22);g.lineTo(cx+1,-80);g.quadraticCurveTo(cx+1,-86,cx+7,-86);g.lineTo(L-9,-86);g.quadraticCurveTo(L-3.5,-86,L-3,-79);g.lineTo(L-0.5,-30);g.quadraticCurveTo(L,-22,L-6,-22);g.closePath();
 g.fillStyle=lg(g,0,-86,0,-22,[[0,shade(c,1.35)],[0.12,shade(c,1.12)],[0.5,c],[0.53,shade(c,0.85)],[1,shade(c,0.6)]]);g.fill();outline(g);
 g.beginPath();g.moveTo(cx+4,-86);g.quadraticCurveTo(cx+6,-99,cx+18,-99.5);g.lineTo(L-34,-97);g.quadraticCurveTo(L-20,-92,L-14,-86);g.closePath();g.fillStyle=lg(g,0,-100,0,-86,[[0,shade(c,1.25)],[1,shade(c,0.8)]]);g.fill();outline(g);
 for(let k=0;k<4;k++)disc(g,'#ffaa22',L-30+k*6,-87.5,1);// tetőlámpák
 // napellenző, oldalablak, ajtó, kilincs, lépcső
 frr(g,'#1b1f26',L-30,-83,28,3.4,1.5);
 g.beginPath();g.moveTo(cx+30,-79);g.lineTo(L-9,-79);g.lineTo(L-6,-57);g.lineTo(cx+30,-57);g.closePath();g.fillStyle=lg(g,0,-79,0,-57,[[0,'#b2d7ea'],[0.55,'#5f88a2'],[1,'#2a4255']]);g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.9;g.stroke();
 g.fillStyle='rgba(255,255,255,0.25)';g.beginPath();g.moveTo(cx+36,-57);g.lineTo(cx+44,-79);g.lineTo(cx+49,-79);g.lineTo(cx+41,-57);g.closePath();g.fill();
 g.strokeStyle='rgba(0,0,0,0.4)';g.lineWidth=0.7;g.beginPath();g.moveTo(cx+27,-81);g.lineTo(cx+27,-28);g.lineTo(L-6,-28);g.stroke();frr(g,'#d0d6dc',cx+31,-52,7,1.8,0.9);
 g.fillStyle=lg(g,0,-50,0,-38,[[0,shade(c,0.7)],[1,shade(c,0.5)]]);g.fillRect(cx+2,-47,L-cx-4,6);text(g,'EURO',cx+40,-46,'#ffffff',0.6,'center',null);
 for(let k=0;k<2;k++)frr(g,'#22272e',cx+29,-24+k*4,16,2.4,0.8);
 // homlok: hűtőrács, fényszóró, lökhárító
 for(let k=0;k<5;k++)R(g,'#1d2228',L-4,-54+k*4,3.5,2);frr(g,lg(g,L-12,-36,L,-30,[[0,'#d8e0e8'],[1,'#ffffff']]),L-11,-36,10,5.5,2);disc(g,'#fffbe8',L-4,-33.3,1.6);
 frr(g,'#2c333c',L-30,-27,30,7,2);frr(g,'#ffaa22',L-3,-40,2.6,3,1);
 // tükör karral
 g.strokeStyle='#1b1f26';g.lineWidth=1.4;g.beginPath();g.moveTo(L-5,-76);g.lineTo(L+5,-73);g.stroke();frr(g,"#1b1f26",L+1.5,-79,4,15,1.5);frr(g,"#9fc6dc",L+2.2,-77.6,2.6,6,1);
 // üzemanyagtartály, oldalburkolat a fülke alatt
 frr(g,lg(g,0,-34,0,-22,[[0,'#f3f6f9'],[0.5,'#b9c2cb'],[1,'#7a858f']]),cx+24,-33,24,12,5);
 // sárvédők
 for(const wx of [cx+14,L-19]){g.fillStyle='#1b1f26';g.beginPath();g.arc(wx,-12,15,Math.PI*1.02,TAU*0.99);g.lineTo(wx+15,-12);g.lineTo(wx+13,-12);g.arc(wx,-12,13,TAU*0.99,Math.PI*1.02,true);g.closePath();g.fill();}
 archDark(g,L-19,13.5);}
/* ---- tréler (platós autómentő): x = a plató hátsó vége, gy = talaj, tilt = plató dőlése ---- */
/* billenő plató: a hátsó alvázvégen fekszik fel, rakodáskor hátracsúszik és lebillen, így nem megy át a tréler kerekein */
const TOW_TILT=-0.24;
function towBed(X,gy,tilt){const p=clamp(tilt/TOW_TILT,0,1);return {sx:X+14,sy:gy-21,a:tilt,dr:lerp(14,20/Math.sin(-TOW_TILT),p)};}
function drawTowTruck(g,x,gy,tilt,t,lights){const bedTop=gy-25,c='#ff8f1f',B=towBed(x,gy,tilt);
 // alváz és hidraulika
 frr(g,'#262b32',x+14,gy-19,170,7,1.5);if(tilt<-0.01){const bx=B.sx+40*Math.cos(B.a),by=B.sy+40*Math.sin(B.a);line(g,'#9aa3ad',x+64,gy-17,bx,by,3);line(g,'#d9dde1',x+66,gy-17,bx+1,by,1.2);}
 // plató oldalsó korláttal, hátul fényvisszaverő csíkokkal, elöl csörlővel
 g.save();g.translate(B.sx,B.sy);g.rotate(B.a);g.translate(150-B.dr,-4);
  frr(g,lg(g,0,-5,0,5,[[0,'#dfe3e7'],[0.5,'#a7afb7'],[1,'#6b737c']]),-150,-5,156,9,1.5);g.strokeStyle='#0c0f14';g.lineWidth=0.8;rrect(g,-150,-5,156,9,1.5);g.stroke();
  for(let k=-144;k<4;k+=12)R(g,'#5b636d',k,-5,1,9);R(g,'#5b636d',-150,-9,156,1.4);for(let k=-148;k<6;k+=26)R(g,'#5b636d',k,-9,1.4,4);
  for(let k=0;k<4;k++){g.fillStyle=k%2?'#ffffff':'#e8351e';g.beginPath();g.moveTo(-150+k*4,-5);g.lineTo(-146+k*4,-5);g.lineTo(-150+k*4,4);g.lineTo(-154+k*4,4);g.closePath();g.fill();}
  frr(g,'#3b4149',-2,-15,8,10,1.5);disc(g,'#9aa3ad',2,-10,2.4);line(g,'#1b1f26',2,-10,-30,-6,0.5);
 g.restore();
 // fülke: lekerekített, krómlökhárító, megkülönböztető fényhíd
 const cx=x+158;g.beginPath();g.moveTo(cx,gy-12);g.lineTo(cx,gy-56);g.quadraticCurveTo(cx,gy-62,cx+8,gy-62);g.lineTo(cx+30,gy-62);g.quadraticCurveTo(cx+38,gy-61,cx+44,gy-46);g.lineTo(cx+50,gy-34);g.quadraticCurveTo(cx+52,gy-20,cx+50,gy-12);g.closePath();
 g.fillStyle=lg(g,0,gy-62,0,gy-12,[[0,'#ffb35c'],[0.45,c],[0.47,'#d96b12'],[1,'#9c4a08']]);g.fill();outline(g);
 g.beginPath();g.moveTo(cx+30,gy-58);g.quadraticCurveTo(cx+36,gy-57,cx+41,gy-45);g.lineTo(cx+46,gy-36);g.lineTo(cx+30,gy-36);g.closePath();g.fillStyle=lg(g,cx+30,gy-58,cx+46,gy-36,[[0,'#a6d0e6'],[1,'#3b5d75']]);g.fill();headSide(g,cx+36,gy-44,'apa',t,1);
 frr(g,'rgba(0,0,0,0.22)',cx+6,gy-56,20,36,2);frr(g,'rgba(166,208,230,0.85)',cx+8,gy-54,16,14,2);R(g,'#ffffff',cx,gy-30,52,2);R(g,'#1b5fbf',cx,gy-27,52,1.4);
 text(g,'AUTÓMENTŐ',cx+24,gy-24,'#ffffff',0.5,'center',null);text(g,'0-24 ÓRA',cx+24,gy-20,'#1b1f26',0.45,'center',null);
 frr(g,lg(g,0,gy-14,0,gy-8,[[0,'#f4f6f8'],[1,'#8f979f']]),cx+40,gy-15,14,6,2);frr(g,'#ffffff',cx+47,gy-24,4,3,1.2);glow(g,cx+50,gy-22,4,'rgba(255,250,220,0.7)');
 g.strokeStyle='#1b1f26';g.lineWidth=1.2;g.beginPath();g.moveTo(cx+44,gy-46);g.lineTo(cx+52,gy-48);g.stroke();frr(g,'#1b1f26',cx+50,gy-50,3,8,1);
 // fényhíd a tetőn
 const on=(t>>3)&1;frr(g,'#1b1f26',cx+6,gy-66,30,4,1.5);for(let k=0;k<4;k++){const lit=(k%2)===on;frr(g,lit?'#ffcc33':'#8a6a14',cx+7+k*7,gy-69,6,3.4,1.2);if(lit){glow(g,cx+10+k*7,gy-68,9,'rgba(255,200,40,0.75)');if(lights&&k<2)lights.push({x:cx+10+k*7,y:gy-68,r:24});}}
 for(const wx of [40,66])wheel(g,x+wx,gy-11,0,false,11);wheel(g,cx+34,gy-11,0,false,11);for(const wx of [53])frr(g,'#1b1f26',x+wx-14,gy-26,28,4,2);}

/* ---------- HAJTÁSLÁNC ÉS BELSŐ SZERKEZET (a karosszéria alatti réteg) ----------
   Rétegsorrend hátulról előre: utastér (ülések, műszerfal) -> alváz -> hátsó futómű -> benzintank -> kipufogó -> váltó -> féltengely -> motor -> hűtő -> akkumulátor;
   erre jön rá a karosszéria (a roncsoló műhelyben és a töréstesztben a lyukakon, leszakadt részeken át, vagy röntgennézetben látszik).
   s: állapot 0..1 (1 = ép, 0 = tönkrement), s.run: jár-e a motor, s.shA: a törött féltengely lengése, s.engDrop: a motor lesüllyedése (törött motortartó).
   mode: 'static' (csak az álló részek, gyorsítótárba), 'dyn' (forgó szíj, ventilátor, lengő tengely), 'all' (mindkettő). Autó-helyi koordináták. */
function dtState(){return {eng:1,gb:1,sh:1,ex:1,rad:1,tank:1,bat:1,ax:1,fr:1,run:false,shA:0,engDrop:0,exGone:false,engOut:false};}
function drawDrivetrain(g,s,t,mode,grp){const st=mode!=='dyn',dy=mode!=='static',run=s.run&&s.eng>0,ed=s.engDrop||0,soft=grp!=='rigid',rigid=grp!=='soft';
 /* a motortér a motorháztető vonala alatt (a szélvédő aljától, u=95, az orrig, u=110); minden a karosszéria körvonalához vágva (bodyPath), hogy semmi ne lógjon ki */
 g.save();bodyPath(g);g.clip();
 if(st&&soft){
  // utastér: ülések háttámlával, padló, műszerfal, kormány
  for(const [u,w] of [[31,9],[45,11],[64,11]]){frr(g,'#3a3f4a',u,20,4,17,1.6);frr(g,'#444a56',u+1,35,w,5,1.5);R(g,'rgba(255,255,255,0.08)',u+0.6,21,1,15);}
  R(g,'#2e333b',12,43,74,1.6);frr(g,'#2b3038',76,24,10,6,1.5);g.strokeStyle='#1f2329';g.lineWidth=1.1;g.beginPath();g.ellipse(74.6,24.8,1.2,3.2,0.2,0,TAU);g.stroke();
  // tűzfal (az utastér és a motortér között)
  R(g,'#24282e',92,26,1.2,18);
  // alváz: hossztartó kereszttartókkal (erős ütésnél megtörik)
  const kink=s.fr<0.5?(0.5-s.fr)*6:0;g.fillStyle='#2a2d32';g.beginPath();g.moveTo(5,44.6);g.lineTo(56,44.6+kink);g.lineTo(108,44.6);g.lineTo(108,47.2);g.lineTo(56,47.2+kink);g.lineTo(5,47.2);g.closePath();g.fill();
  for(const u of [14,36,58,80,104])R(g,'#3a3e45',u,43.8,1.6,4.2);
  // hátsó futómű: csatolt lengőkar, tekercsrugó, lengéscsillapító (eltörve a rugó két darab)
  frr(g,'#30343a',17,44,14,3.4,1.2);line(g,'#59606a',33.5,36,33.5,44,1.2);g.strokeStyle='#b8392f';g.lineWidth=0.9;g.beginPath();
  if(s.ax>0){for(let j=0;j<=8;j++)g.lineTo(28+(j%2?1.6:-1.6),36.5+j*1);g.stroke();}else{for(let j=0;j<=3;j++)g.lineTo(28+(j%2?1.6:-1.6),36.5+j*1);g.stroke();g.beginPath();for(let j=0;j<=3;j++)g.lineTo(27.4+(j%2?1.6:-1.6),41.6+j*0.8);g.stroke();}
  // benzintank (a hátsó ülés alatt)
  frr(g,'#1e2226',35,39,19,7.4,2);R(g,'#4a4f56',38,38.6,1,8);R(g,'#4a4f56',50,38.6,1,8);if(s.tank<0.6){disc(g,'#0b0c0e',41,42,0.8);disc(g,'#0b0c0e',47,43.4,0.7);}
  // kipufogó: leömlő a motor elejéről, katalizátor, középdob, hátsó dob, kipufogócső (leszakadva hiányzik)
  if(!s.exGone){g.strokeStyle='#6d6258';g.lineWidth=1.3;g.beginPath();g.moveTo(101,45.6);g.lineTo(92,47.6);g.lineTo(23,47.6);g.stroke();
   frr(g,'#8b8f94',70,46,8,3.2,1.4);frr(g,'#7c8086',46,46.2,7,2.8,1.2);frr(g,s.ex<0.5?'#6b6056':'#8a8e94',8,44.6,14,4.8,2);line(g,'#6d6258',8,47,1.5,47.6,1.2);
   if(s.ex<0.5){disc(g,'#121316',12,46,0.8);disc(g,'#121316',17,47.3,0.6);g.strokeStyle='rgba(0,0,0,0.5)';g.lineWidth=0.4;g.beginPath();g.moveTo(10,45);g.lineTo(13,47);g.stroke();}}
  // hűtő a hűtőrács mögött, lamellákkal, csövek a motorhoz (sérülve elgörbült lamellák, összetörve összenyomódik)
  const rw=s.rad>0?3:1.8;frr(g,'#9aa3ad',106.4,34,rw,11,0.8);g.strokeStyle='rgba(40,45,52,0.55)';g.lineWidth=0.35;g.beginPath();for(let k=0;k<10;k++){const y=34.8+k*1.05;g.moveTo(106.6,y);g.lineTo(106.2+rw,y+(s.rad<0.5&&k%3===0?0.7:0));}g.stroke();
  line(g,'#20242a',106.4,35,104.6,33,0.8);line(g,'#20242a',106.4,44,104.6,45,0.8);if(s.rad<0.5){disc(g,'#2a2f35',107.6,37,0.7);disc(g,'#2a2f35',108,42,0.55);}
  // akkumulátor a motortér hátsó, felső sarkában (tönkrement: megrepedt ház, olvadt saruk)
  frr(g,'#1b1d21',93.2,28.4,4.6,3.6,0.6);disc(g,s.bat>0?'#d33a2a':'#5a2a20',94.2,28.3,0.5);disc(g,s.bat>0?'#2b2f35':'#3a3a3a',96.8,28.3,0.5);if(s.bat<=0)line(g,'#3a3e45',94.6,29.4,96,31.4,0.35);}
 if(rigid){g.save();g.translate(0,ed);
  if(st){// váltó: alumínium harangház bordákkal, differenciálmű (a motor mellett, részben mögötte; eltörve: rés a házon, kilátszanak a fogaskerekek)
   g.fillStyle='#b4bac2';g.beginPath();g.moveTo(95,36);g.lineTo(90,37);g.lineTo(87.6,40);g.lineTo(87.6,44.6);g.lineTo(90,46.4);g.lineTo(95,46.4);g.closePath();g.fill();
   for(const u of [89.6,91.8,93.8])R(g,'rgba(0,0,0,0.18)',u,38,0.5,8);disc(g,'#9aa1aa',92.4,44.4,1.8);
   if(s.gb<0.5){g.strokeStyle='#2a2d32';g.lineWidth=0.45;g.beginPath();g.moveTo(91,37.4);g.lineTo(92.2,40.4);g.lineTo(91.2,43);g.stroke();}
   if(s.gb<=0){R(g,'#1d2025',91.2,37.4,1.6,8.6);for(const [cx,cy,r] of [[90,40.6,1.6],[93.2,43.2,1.2]]){disc(g,'#8a9097',cx,cy,r);g.strokeStyle='#5a5f66';g.lineWidth=0.4;g.beginPath();for(let k=0;k<10;k++){const a=k*TAU/10;g.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);g.lineTo(cx+Math.cos(a)*(r+0.5),cy+Math.sin(a)*(r+0.5));}g.stroke();}}
   // motor: blokk, hengerfej, piros szelepfedél a motorháztető alatt, olajteknő, szívócső a tűzfal felé (sérülve korom, repedés, végül kilyukadt blokk kilógó hajtókarral)
   if(!s.engOut){frr(g,'#6f767f',94.2,35,10.8,9.6,1.2);frr(g,'#3a3f47',94.6,32.6,10,2.6,0.8);frr(g,s.eng>0?'#b7322c':'#5a2420',95,30.8,9.2,2,0.9);
    for(let k=0;k<4;k++)disc(g,'#d9d4c8',96.6+k*2.2,31.8,0.35);frr(g,'#2b2f35',95.4,44.4,8.4,2.6,1);
    g.strokeStyle='#59606a';g.lineWidth=0.8;g.beginPath();for(let k=0;k<3;k++){g.moveTo(96+k*2.4,32.6);g.quadraticCurveTo(93.6+k*0.3,34,93.6,38);}g.stroke();
    for(let k=0;k<3;k++)R(g,'rgba(0,0,0,0.15)',94.4,37.2+k*2.4,10.4,0.5);
    if(s.eng<0.6){disc(g,'rgba(15,15,15,0.45)',99,38,2.4);disc(g,'rgba(15,15,15,0.35)',101.6,34,1.8);}
    if(s.eng<0.3){g.strokeStyle='#15171a';g.lineWidth=0.45;g.beginPath();g.moveTo(96,35.4);g.lineTo(97.6,38);g.lineTo(96.8,40.4);g.lineTo(98.8,43.4);g.stroke();}
    if(s.eng<=0){disc(g,'#121316',99.4,39.6,1.8);line(g,'#c9ced4',99.4,39.6,102.6,43,0.8);disc(g,'#9aa1aa',103,43.3,0.8);}}}
  if(dy&&!s.engOut){const ph=run?t*0.5:0;
   // ékszíj a főtengely és a generátor tárcsáján, ventilátor a hűtő mögött (járó motornál forog)
   g.strokeStyle='#15171a';g.lineWidth=0.6;g.beginPath();g.moveTo(103,43.6);g.lineTo(103.6,34.8);g.lineTo(104.8,35.6);g.lineTo(104.4,43.4);g.stroke();
   for(const [cx,cy,r] of [[103.6,43,1.5],[104,35.4,1]]){disc(g,'#c9ced4',cx,cy,r);line(g,'#59606a',cx,cy,cx+Math.cos(ph)*r*0.9,cy+Math.sin(ph)*r*0.9,0.3);}
   g.save();g.translate(105.6,39.4);g.scale(0.3,1);g.rotate(ph*1.6);g.fillStyle='rgba(60,64,70,0.85)';for(let k=0;k<5;k++){g.rotate(TAU/5);g.beginPath();g.ellipse(0,-2.4,0.9,2.2,0,0,TAU);g.fill();}g.restore();}
  g.restore();}
 g.restore();
 // féltengely a differenciálműtől a kerékagyig, csuklóvédő gumikkal (törve a külső fele lóg és leng; a kontúron kívül is lóghat)
 if(dy&&rigid){const tear=s.sh<0.5;if(s.sh>0){line(g,'#4a4f56',92.4,44.6+ed,89,46.1,1.2);for(const [cx,cy] of [[91.6,44.9+ed],[89.8,45.8]])frr(g,tear?'#3a2a2a':'#15171a',cx-0.9,cy-0.8,1.8,1.6,0.7);if(tear){disc(g,'#3a3226',90.6,47,0.35);disc(g,'#3a3226',91.2,47.6,0.3);}}
  else{line(g,'#4a4f56',92.4,44.6+ed,91,45.2+ed,1.2);g.save();g.translate(89,46.1);g.rotate(0.9+(s.shA||0));line(g,'#4a4f56',0,0,-3,0,1.2);frr(g,'#3a2a2a',-1.4,-0.8,1.8,1.6,0.7);g.restore();}}}
