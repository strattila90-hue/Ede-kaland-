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
 if(who==='apa'){g.fillStyle='#14171c';rrect(g,cx+r*0.15,cy-r*0.25,r*0.95,r*0.38,r*0.12);g.fill();R(g,'rgba(255,255,255,0.35)',cx+r*0.3,cy-r*0.2,r*0.3,r*0.08);
  if(sc>0.3)line(g,f.hair,cx+r*0.25,cy-r*(0.42+sc*0.25),cx+r*0.9,cy-r*(0.4+sc*0.25),r*0.13);}
 else{// szem: nyugodtan pötty, ijedten nagy fehér szem pupillával
  if(blink)line(g,'#2a1d14',ex-r*0.14,ey,ex+r*0.12,ey,r*0.09);
  else if(sc>0.25){const e=r*(0.2+sc*0.14);disc(g,'#ffffff',ex,ey,e);disc(g,'#1a1a1a',ex+e*0.25,ey,e*0.45);}
  else{disc(g,'#ffffff',ex+r*0.02,ey,r*0.16);disc(g,'#1e1a17',ex+r*0.06,ey,r*0.12);}
  // szemöldök
  if(who!=='atti')line(g,shade(f.hair,0.8),ex-r*0.2,ey-r*(0.32+sc*0.22),ex+r*0.18,ey-r*(0.36+sc*0.24),r*0.09);}
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
 if(who==='apa'){g.fillStyle='#14171c';rrect(g,cx-r*0.85,cy-r*0.15,r*1.7,r*0.4,r*0.15);g.fill();}
 else{disc(g,'#1a1a1a',cx-r*0.35,cy,r*0.13);disc(g,'#1a1a1a',cx+r*0.35,cy,r*0.13);}
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
 if(who==='anya'&&mode!=='work'&&!kneel&&!o.noBaby){frr(g,'#fff1a8',shX+H*0.02,shY+H*0.05,H*0.11,H*0.1,2);headSide(g,shX+H*0.08,shY+H*0.05,'atti',t,0.9);}
 g.restore();return {hx:hx,hy:hy};}
function wheel(g,cx,cy,ang,flat,r){r=r||WR;g.save();g.translate(cx,cy);
 if(flat){g.translate(0,r*0.34);// a felni lejjebb ül, a gumi alul szétnyomódik
  const w=Math.sin(ang*3)*r*0.03;g.fillStyle='#14171b';g.beginPath();g.arc(0,0,r,Math.PI*1.08,Math.PI*1.92);g.bezierCurveTo(r*1.02,-r*0.1,r*1.2+w,r*0.3,r*1.02,r*0.62);g.lineTo(-r*1.02,r*0.62);g.bezierCurveTo(-r*1.2-w,r*0.3,-r*1.02,-r*0.1,Math.cos(Math.PI*1.08)*r,Math.sin(Math.PI*1.08)*r);g.closePath();g.fill();
  g.strokeStyle='rgba(255,255,255,0.12)';g.lineWidth=r*0.05;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(k*r*0.45,r*0.36);g.quadraticCurveTo(k*r*0.45+r*0.12,r*0.5,k*r*0.45,r*0.6);g.stroke();}}
 else disc(g,'#14171b',0,0,r);g.strokeStyle='#2c3138';g.lineWidth=r*0.1;g.beginPath();g.arc(0,0,r*0.84,0,TAU);g.stroke();
 g.strokeStyle='rgba(255,255,255,0.1)';g.lineWidth=r*0.06;g.beginPath();g.arc(0,0,r*0.93,Math.PI*1.1,Math.PI*1.6);g.stroke();
 const q=r*0.72;g.fillStyle=rg(g,-q*0.3,-q*0.3,q*0.1,q*1.2,[[0,'#f6f8fa'],[1,'#8d98a3']]);g.beginPath();g.arc(0,0,q,0,TAU);g.fill();
 disc(g,'#262c33',0,0,q*0.86);disc(g,'#59616a',0,0,q*0.56);
 g.rotate(ang);g.fillStyle='#e3e8ec';for(let i=0;i<6;i++){g.rotate(TAU/6);g.fillRect(q*0.2,-q*0.17,q*0.68,q*0.1);g.fillRect(q*0.2,q*0.07,q*0.68,q*0.1);}
 disc(g,'#cfd6dc',0,0,q*0.24);disc(g,'#7f8a95',0,0,q*0.09);g.restore();}

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
function drawCarSide(g,x,by,wy,o,lights){
 const t=o.t||0,hide=o.hide||{},ang=o.ang||0,pitch=o.pitch||0,lift=o.lift||0;
 const wyF=(o.wF||0),wyR=(o.wR||0);
 g.save();g.translate(x,by-lift);g.translate(56,45);g.rotate(pitch);g.translate(-56,-45);
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
  if(o.dirt>0.05){const d=o.dirt;g.fillStyle=lg(g,0,10,0,49,[[0,'rgba(150,130,100,'+(0.12*d)+')'],[1,'rgba(110,85,55,'+(0.5*d)+')']]);g.fillRect(0,10,120,40);
   for(let k=0;k<10;k++){const mx=6+hsh(k*11)*104,my=40+hsh(k*5)*7;g.fillStyle='rgba(95,70,45,'+(0.55*d*(0.5+hsh(k)))+')';g.beginPath();g.ellipse(mx,my,2+hsh(k*3)*4,1+hsh(k*7)*1.6,0,0,TAU);g.fill();}}
  // ajtóvonalak
  g.strokeStyle='rgba(18,22,28,0.6)';g.lineWidth=0.55;g.beginPath();g.moveTo(22.9,27);g.lineTo(22.7,31.6);g.moveTo(50.2,27);g.bezierCurveTo(50.4,36,50.4,40,50.2,43.6);
  g.moveTo(76.6,27.4);g.bezierCurveTo(77.4,32,77,35,75.4,37.2);g.moveTo(22.9,43.6);g.lineTo(75,43.6);g.stroke();
 g.restore();
 bodyPath(g);g.strokeStyle='#0c0f14';g.lineWidth=1.15;g.stroke();bodyPath(g);g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.4;g.save();g.translate(0,0.5);g.stroke();g.restore();
 // kilincsek, tanksapka
 for(const hx of [28,55.5]){frr(g,'rgba(0,0,0,0.35)',hx,31.5,5.4,0.8,0.4);frr(g,lg(g,0,30.4,0,31.8,[[0,'#ffffff'],[1,'#9aa6b1']]),hx,30.4,5.4,1.4,0.7);}
 g.strokeStyle='rgba(20,24,30,0.55)';g.lineWidth=0.5;g.beginPath();g.arc(13.6,31,2.1,0,TAU);g.stroke();
 // üvegfelület az utasokkal
 glassPath(g);g.fillStyle=lg(g,0,12.5,0,27,[[0,'#b4d6e8'],[0.45,'#628aa3'],[1,'#21384a']]);g.fill();
 g.save();glassPath(g);g.clip();
  const bob=o.bounce?Math.sin(t*0.3)*0.3:0;
  // csomagok a 3. sorban
  frr(g,'#d8433b',8.5,19.5,6,7,1.2);frr(g,'#3f7fd9',13.5,17.5,6,9,1.2);frr(g,'#f2c14e',10,15.5,5,4,1);
  // bébiülés kis Attival (menetiránynak háttal)
  const sc=o.scare||0,ln=o.lean||0,jit=w=>sc>0.2&&w!=='apa'?Math.sin(t*1.7+w.length)*0.35*sc:0;
  if(!hide.atti){frr(g,'#3b4a63',23.6,15.6,6.4,10.4,2.4);headSide(g,27.2+ln*0.4+jit('atti'),19.4+bob,'atti',t,1,sc);}
  for(const [w,hx,hy] of SEATS)if(!hide[w])headSide(g,hx+ln*(w==='apa'?0.6:1)+jit(w),hy+(w==='petra'||w==='anna'?bob:0)+ln*0.15,w,t,1,w==='apa'?sc*0.6:sc);
  if(!hide.petra)frr(g,'#d8433b',30,22.6,7,3.6,1.4);
  if(o.airbag)drawAirbag(g,o.airbag);
  g.fillStyle='rgba(16,34,52,0.3)';g.fillRect(0,0,120,30);
  g.fillStyle='rgba(255,255,255,0.15)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(4+k*17,28);g.lineTo(12+k*17,12);g.lineTo(16+k*17,12);g.lineTo(8+k*17,28);g.closePath();g.fill();}
  g.fillStyle='#13171c';rrect(g,20.8,11,2.8,17,1.2);g.fill();rrect(g,48.7,11,3.2,17,1.2);g.fill();
  g.strokeStyle='#13171c';g.lineWidth=2.7;g.beginPath();g.moveTo(74.6,27.4);g.lineTo(78.4,16.8);g.stroke();
  g.fillStyle='rgba(255,255,255,0.13)';g.beginPath();g.moveTo(76,27.4);g.lineTo(79.8,17.6);g.lineTo(92.6,27.6);g.closePath();g.fill();
 g.restore();
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
 frr(g,'#191d22',103.4,39.6,8,4.4,2);frr(g,'#4a525b',104.4,40.8,6,0.5,0.25);disc(g,o.fog?'#ffffff':'#e8e2c4',108.6,42.2,0.95);
 if(o.dmg)drawDamage(g,o.dmg,t,o.spd||0);
 g.restore();
 if(o.dmg)drawSmoke(g,x+100,by+28,o.dmg,t);
 // kerekek (a felfüggesztés miatt külön mozognak)
 for(const [k,cx] of [['r',WHEELS[0]],['f',WHEELS[1]]]){const dy=k==='f'?wyF:wyR,wx=x+cx,wcy=wy+WCY+dy;
  if(o.noWheel===k){frr(g,'#7d858d',wx-1.2,wcy-2,2.4,11,0.8);continue;}
  wheel(g,wx,wcy,ang,o.flat===k);}
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

/* ---- sérülés: d = 0 (ép) ... 1 (totálkár), az autó saját koordinátáiban ---- */
function drawDamage(g,d,t,spd){if(d<0.08)return;
 // karcok és horpadások az első sárvédőn és az ajtón
 g.save();bodyPath(g);g.clip();
 g.strokeStyle='rgba(235,240,245,0.75)';g.lineWidth=0.35;for(let k=0;k<Math.min(9,Math.ceil(d*14));k++){const x=84+hsh(k*7)*20,y=31+hsh(k*13)*10;g.beginPath();g.moveTo(x,y);g.lineTo(x+3+hsh(k)*5,y+(hsh(k*3)-0.5)*2);g.stroke();}
 for(let k=0;k<Math.ceil(d*5);k++){const x=88+hsh(k*31)*16,y=33+hsh(k*17)*8;g.fillStyle=lg(g,x-3,y,x+3,y,[[0,'rgba(0,0,0,0.28)'],[1,'rgba(255,255,255,0.18)']]);g.beginPath();g.ellipse(x,y,2.6+d*2,1.6+d,0.3,0,TAU);g.fill();}
 if(d>0.55){g.fillStyle='rgba(0,0,0,0.22)';g.beginPath();g.ellipse(64,37,6,3,0,0,TAU);g.fill();line(g,'rgba(255,255,255,0.3)',59,35,68,39,0.4);}
 g.restore();
 // repedt fényszóró
 if(d>0.25){g.strokeStyle='rgba(40,40,40,0.8)';g.lineWidth=0.35;g.beginPath();g.moveTo(101,30.4);g.lineTo(103.4,32.6);g.lineTo(102.4,33.4);g.moveTo(103.4,32.6);g.lineTo(106.6,33.2);g.moveTo(103.4,32.6);g.lineTo(104.6,31);g.stroke();}
 // gyűrődött motorháztető, felpattant élekkel
 if(d>0.4){const k=Math.min(1,(d-0.4)/0.4);g.fillStyle=CP.d;g.beginPath();g.moveTo(86,28.4);for(let i=0;i<=6;i++){const x=86+i*3.6,y=28.6+i*0.55-(i%2?2.2*k:0);g.lineTo(x,y);}g.lineTo(108,33);g.lineTo(86,30.6);g.closePath();g.fill();
  g.strokeStyle='#0c0f14';g.lineWidth=0.6;g.beginPath();g.moveTo(86,28.4);for(let i=0;i<=6;i++)g.lineTo(86+i*3.6,28.6+i*0.55-(i%2?2.2*k:0));g.stroke();
  // repedt szélvédő (pókháló)
  const cx=84.6,cy=22.2;g.strokeStyle='rgba(255,255,255,0.85)';g.lineWidth=0.3;g.beginPath();for(let a=0;a<7;a++){const an=a*0.9+0.3,r=3+hsh(a*5)*3;g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r*0.8);}g.stroke();
  g.beginPath();g.arc(cx,cy,1.6,0,TAU);g.stroke();g.beginPath();g.arc(cx,cy,3.2,0.4,2.6);g.stroke();}
 // lógó, lengő első lökhárító (egyik oldalon leszakadt)
 if(d>0.25){const sw=0.22+d*0.35+Math.sin(t*0.25)*(0.05+Math.min(1,spd/80)*0.1);R(g,'#16191d',100,40.2,12.6,4.6);
  g.save();g.translate(100.4,40.6);g.rotate(sw);frr(g,lg(g,0,0,0,5,[[0,CP.l],[1,CP.dd]]),0,0,13.6,4.4,1.6);frr(g,'#191d22',3,1.2,7,2,1);g.strokeStyle='#0c0f14';g.lineWidth=0.5;rrect(g,0,0,13.6,4.4,1.6);g.stroke();g.restore();}
 // lelógó visszapillantó tükör
 if(d>0.55){R(g,'#1a1e24',74,24.2,1.4,1.6);const a=Math.sin(t*0.2)*0.25;g.save();g.translate(74.6,25.6);g.rotate(1.1+a);g.fillStyle=CP.m;g.beginPath();g.ellipse(2.6,0,3.2,1.9,0,0,TAU);g.fill();g.restore();line(g,'#111',74.6,25.6,75.4,28,0.4);}
 // ha a lökhárító majdnem leesik, szikrázik az úton
 if(d>0.75&&spd>15&&((t>>1)&1)){for(let k=0;k<3;k++)disc(g,'#ffd27a',110+hsh(t*3+k)*4,48+hsh(t*7+k)*3,0.5);glow(g,111,49,4,'rgba(255,200,120,0.8)');}}
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
function drawTraffic(g,e,sx,lights,lightsOn,t){const gy=e.y,c=e.col,ang=e.x/8,L=e.w,glass='#5f88a2';g.save();g.translate(sx,gy);if(e.wreck)g.rotate(e.wreck===1?-0.06:0.04);
 g.fillStyle=rg(g,L/2,0,2,L/2+6,[[0,'rgba(0,0,0,0.35)'],[1,'rgba(0,0,0,0)']]);g.save();g.scale(1,0.08);g.beginPath();g.arc(L/2,0,L/2+6,0,TAU);g.fill();g.restore();
 const head=(x,y,s)=>headSide(g,x,y,'apa',t,s||0.8);
 if(e.tp==='hatch'||e.tp==='police'){const P2=[[3,-8],[2,-22],[6,-30],[22,-31],[34,-38],[64,-38],[74,-30],[L-6,-24],[L-1,-17],[L,-9],[L-2,-6],[4,-6]];
  vpath(g,P2);g.fillStyle=e.tp==='police'?vpaint(g,'#e9eef3',-38,-6):vpaint(g,c,-38,-6);g.fill();outline(g);
  vpath(g,[[34,-35.5],[44,-35.5],[44,-29],[26,-29]]);g.fillStyle=glass;g.fill();vpath(g,[[46,-35.5],[62,-35.5],[71,-29],[46,-29]]);g.fill();head(54,-31.5);
  if(e.tp==='police'){R(g,'#1e4fb5',3,-21,L-6,4);text(g,'RENDŐRSÉG',16,-20.4,'#ffffff',0.55,'left',null);const on=((t>>3)&1);frr(g,on?'#3b7bff':'#ff3b3b',44,-41,7,3,1);frr(g,on?'#ff3b3b':'#3b7bff',52,-41,7,3,1);
   glow(g,on?47:56,-40,9,on?'rgba(60,120,255,0.85)':'rgba(255,60,60,0.85)');if(lights)lights.push({x:sx+50,y:gy-40,r:26});}
  frr(g,'#fff3c4',L-5,-22,4,3,1.4);frr(g,CP.tl,2,-23,2.4,5,1);wheel(g,20,-8,ang,false,8);wheel(g,L-20,-8,ang,false,8);}
 else if(e.tp==='van'||e.tp==='camper'||e.tp==='ambulance'){const top=-TH[e.tp];vpath(g,[[2,-8],[2,top+3],[6,top],[L-34,top],[L-20,top+22],[L-4,top+28],[L,-12],[L-2,-6],[4,-6]]);
  g.fillStyle=e.tp==='ambulance'?vpaint(g,'#f4f6f8',top,-6):vpaint(g,c,top,-6);g.fill();outline(g);
  if(e.tp==='camper'){frr(g,'rgba(0,0,0,0.12)',4,top+28,L-40,3,1);frr(g,glass,14,top+10,22,12,2);frr(g,glass,46,top+10,16,12,2);frr(g,'#ffffff',L-60,top-8,30,10,4);}
  if(e.tp==='ambulance'){R(g,'#d32f2f',2,top+30,L-10,5);R(g,'#ffcf33',2,top+36,L-10,3);g.fillStyle='#d32f2f';g.fillRect(40,top+10,10,4);g.fillRect(43,top+7,4,10);const on=((t>>3)&1);frr(g,on?'#3b7bff':'#1b3a8a',L-46,top-3,10,3,1);if(on){glow(g,L-41,top-2,10,'rgba(60,120,255,0.85)');if(lights)lights.push({x:sx+L-41,y:gy+top,r:28});}}
  vpath(g,[[L-33,top+3],[L-21,top+21],[L-33,top+21]]);g.fillStyle=glass;g.fill();head(L-27,top+15);frr(g,'#fff3c4',L-4,-22,3,3,1.4);frr(g,CP.tl,2,top+10,2.4,8,1);
  wheel(g,22,-8,ang,false,8.5);wheel(g,L-24,-8,ang,false,8.5);if(e.tp==='camper')wheel(g,44,-8,ang,false,8.5);}
 else if(e.tp==='bus'){const T=-80,B=-11;
  // karosszéria: lekerekített tető, ívelt homlok
  g.beginPath();g.moveTo(2,B);g.lineTo(2,T+9);g.quadraticCurveTo(2,T,11,T);g.lineTo(L-30,T);g.quadraticCurveTo(L-9,T,L-5,T+16);g.lineTo(L-1,T+42);g.quadraticCurveTo(L+0.5,B-3,L-4,B);g.closePath();
  g.fillStyle=lg(g,0,T,0,B,[[0,'#ffffff'],[0.5,'#eef1f4'],[1,'#c3cad2']]);g.fill();outline(g);
  // színes csík (lendületes ív a busz hátulja felé)
  g.fillStyle=lg(g,0,-40,0,-18,[[0,shade(c,1.15)],[1,shade(c,0.75)]]);g.beginPath();g.moveTo(2,-40);g.bezierCurveTo(L*0.35,-40,L*0.55,-22,L-2,-26);g.lineTo(L-1.5,-17);g.lineTo(2,-17);g.closePath();g.fill();
  R(g,shade(c,0.6),2,-17,L-5,1.2);
  // tetőklíma
  frr(g,lg(g,0,T-6,0,T,[[0,'#f4f6f8'],[1,'#b9c1c9']]),L*0.3,T-5,70,6,3);g.strokeStyle='#0c0f14';g.lineWidth=0.6;rrect(g,L*0.3,T-5,70,6,3);g.stroke();
  // sötétített ablaksor utasokkal
  const wy=T+9,wh=26;frr(g,'#1d2a36',10,wy,L-48,wh,3);
  for(let k=0;k<11;k++){const px=22+k*23;if(px>L-44)break;disc(g,['#f0c39a','#c99a6e','#e8b48a','#a8754e'][k%4],px,wy+16,3.2);R(g,['#3f7fd9','#e05a8a','#5bd06a','#ffcf33'][k%4],px-4,wy+19,8,7);}
  for(let k=10;k<L-40;k+=34)R(g,'#0c0f14',k,wy,2,wh);g.fillStyle='rgba(255,255,255,0.14)';for(let k=0;k<7;k++){g.beginPath();g.moveTo(16+k*40,wy+wh);g.lineTo(30+k*40,wy);g.lineTo(38+k*40,wy);g.lineTo(24+k*40,wy+wh);g.closePath();g.fill();}
  // ajtók
  for(const dx of [L*0.48,L-50]){frr(g,'#24313c',dx,T+8,17,B-T-9,2);R(g,'#0c0f14',dx+8.2,T+8,0.8,B-T-9);frr(g,'rgba(160,200,225,0.45)',dx+1.5,T+10,6,30,1);frr(g,'rgba(160,200,225,0.45)',dx+9.5,T+10,6,30,1);}
  // szélvédő, sofőr, viszonylatjelző
  g.beginPath();g.moveTo(L-30,T+5);g.quadraticCurveTo(L-12,T+5,L-8,T+18);g.lineTo(L-4,T+44);g.lineTo(L-26,T+44);g.closePath();g.fillStyle=lg(g,L-30,T,L,T+40,[[0,'#9cc8e0'],[1,'#3b5d75']]);g.fill();head(L-18,T+30,1);
  frr(g,'#111',L-30,T+2,24,6,1.5);text(g,(LEGS[G.leg]?LEGS[G.leg].to.split(' (')[0]:'').slice(0,8),L-18,T+3,'#ffb02e',0.5,'center',null);
  // tükör „nyúlfül”
  g.strokeStyle='#1b1f26';g.lineWidth=1.4;g.beginPath();g.moveTo(L-6,T+10);g.quadraticCurveTo(L+6,T+6,L+5,T+20);g.stroke();frr(g,'#1b1f26',L+2,T+18,5,9,1.5);
  // lámpák, kerékívek, kerekek
  frr(g,'#ffffff',L-9,-27,7,2.4,1.2);glow(g,L-3,-26,4,'rgba(255,250,220,0.7)');frr(g,'#d32f2f',2,T+22,2.6,20,1);frr(g,'#2c333c',L-14,B-3,13,4,1.5);
  for(const wx of [52,L-62]){disc(g,'#14171b',wx,B,16);wheel(g,wx,-12,ang,false,12);}}
 else if(e.tp==='truck'){const cab=68,tl=L-cab-6,T=-98,B=-20;
  // pótkocsi: ponyvás, feszítőhevederekkel
  frr(g,lg(g,0,T,0,B,[[0,'#f6f7f8'],[0.5,'#e3e7eb'],[1,'#c4cbd2']]),0,T,tl,B-T,3);g.beginPath();rrect(g,0,T,tl,B-T,3);outline(g);
  for(let k=22;k<tl-4;k+=24){R(g,'rgba(0,0,0,0.07)',k-5,T+2,5,B-T-4);R(g,'#8a939c',k,T+2,1.2,B-T-4);frr(g,'#5b636d',k-1,B-5,3.2,3,0.6);}
  R(g,shade(c,0.95),0,T+4,tl,5);text(g,'TRANS EURÓPA',tl/2,T+28,shade(c,0.85),2,'center',null);text(g,'LOGISZTIKA',tl/2,T+48,'#7d858d',1,'center',null);
  R(g,'#2a2f36',0,B,tl,6);frr(g,'#3b4149',2,B+6,tl*0.52,5,1);for(let k=6;k<tl*0.5;k+=8)R(g,'#ffd84a',k,B+7,3,2);// oldalsó aláfutásgátló, fényvisszaverők
  R(g,'#b8c0c8',tl-60,B+6,3,9);R(g,'#5b636d',tl-62,B+14,7,1.6);// támasztóláb
  frr(g,'#d32f2f',0,B-14,3,10,1);frr(g,'#1b1f26',2,B+6,7,8,1);
  // vontató fülke: tetőterelő, napellenző, hűtőrács
  const cx=L-cab;g.beginPath();g.moveTo(cx,B+4);g.lineTo(cx,T+8);g.quadraticCurveTo(cx+6,T-6,cx+34,T-4);g.lineTo(L-14,T+4);g.quadraticCurveTo(L-6,T+6,L-4,T+26);g.lineTo(L,B-6);g.lineTo(L-2,B+4);g.closePath();
  g.fillStyle=vpaint(g,c,T-4,B+4);g.fill();outline(g);
  g.beginPath();g.moveTo(cx+2,T+10);g.quadraticCurveTo(cx+8,T-2,cx+34,T-1);g.lineTo(cx+34,T+6);g.lineTo(cx+2,T+16);g.closePath();g.fillStyle='rgba(255,255,255,0.18)';g.fill();
  frr(g,'#1b1f26',L-26,T+10,22,4,1.5);// napellenző
  g.beginPath();g.moveTo(L-26,T+15);g.lineTo(L-7,T+15);g.lineTo(L-4,T+40);g.lineTo(L-26,T+40);g.closePath();g.fillStyle=lg(g,L-26,T+15,L,T+40,[[0,'#a6d0e6'],[1,'#3b5d75']]);g.fill();head(L-16,T+28,1.05);
  frr(g,'rgba(0,0,0,0.25)',cx+8,T+18,26,46,2);g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=0.6;rrect(g,cx+8,T+18,26,46,2);g.stroke();frr(g,'#c9ced4',cx+28,T+46,5,1.6,0.8);// ajtó, kilincs
  for(let k=0;k<5;k++)R(g,'#2a2f36',L-12,B-30+k*4,10,2);frr(g,'#c9ced4',L-14,B-6,14,6,1.5);frr(g,'#ffffff',L-5,B-12,4,3,1.2);glow(g,L-2,B-10,4,'rgba(255,250,220,0.7)');
  frr(g,'#9aa3ad',cx+4,B+2,24,9,4.5);R(g,'rgba(255,255,255,0.4)',cx+6,B+3,20,1.4);// üzemanyagtartály
  frr(g,'#1b1f26',cx+8,B-2,8,3,1);frr(g,'#1b1f26',cx+8,B+3,8,2,1);// lépcső
  g.strokeStyle='#1b1f26';g.lineWidth=1.4;g.beginPath();g.moveTo(L-4,T+18);g.lineTo(L+4,T+20);g.stroke();frr(g,'#1b1f26',L+2,T+18,4,12,1.5);
  for(const wx of [44,70,96])wheel(g,wx,-12,ang,false,12);wheel(g,cx+18,-12,ang,false,12);wheel(g,L-20,-12,ang,false,12);
  for(const mx of [tl-2,cx+30])frr(g,'#1b1f26',mx-2,B+4,4,10,1);}
 else if(e.tp==='tractor'){frr(g,lg(g,0,-34,0,-14,[[0,'#5fd16a'],[1,'#2f7d37']]),6,-34,L-12,20,4);g.beginPath();rrect(g,6,-34,L-12,20,4);outline(g);
  frr(g,'rgba(160,200,220,0.35)',8,-68,40,34,3);g.strokeStyle='#2c333c';g.lineWidth=2;rrect(g,8,-68,40,34,3);g.stroke();head(28,-52,1);frr(g,'#d9b24a',22,-59,12,2,1);frr(g,'#555',L-24,-46,3,12,1);
  wheel(g,26,-22,ang*0.5,false,22);wheel(g,L-18,-11,ang,false,11);}
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
/* ---- tréler (platós autómentő): x = a plató hátsó vége, gy = talaj, tilt = plató dőlése ---- */
function drawTowTruck(g,x,gy,tilt,t,lights){const bedTop=gy-25,c='#ff8f1f';
 // alváz és hidraulika
 frr(g,'#262b32',x+14,gy-19,170,7,1.5);if(tilt<-0.01){line(g,'#9aa3ad',x+120,gy-17,x+126,bedTop+2,3);line(g,'#d9dde1',x+122,gy-17,x+127,bedTop,1.2);}
 // plató oldalsó korláttal, hátul fényvisszaverő csíkokkal, elöl csörlővel
 g.save();g.translate(x+150,bedTop);g.rotate(tilt);
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
