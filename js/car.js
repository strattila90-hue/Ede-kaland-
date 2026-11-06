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
function person(g,x,gy,who,t,mode){const f=FAM[who],kid=who==='anna'||who==='petra',s=kid?(who==='petra'?0.62:0.75):1;
 const walk=mode==='walk',wave=mode==='wave',work=mode==='work';const st=walk?Math.sin(t*0.25)*1.6*s:0,hop=wave&&((t>>4)&1)?1.5:0;gy-=hop;
 ell(g,'rgba(0,0,0,0.25)',x+2.5*s,gy+hop+0.5,4*s,1.1);
 const lh=7*s,bh=8*s;
 line(g,f.pants,x+1.4*s,gy-lh,x+1.4*s+st,gy,1.7*s);line(g,f.pants,x+3.4*s,gy-lh,x+3.4*s-st,gy,1.7*s);
 frr(g,f.shirt,x,gy-lh-bh,5*s,bh+0.6,1.6*s);
 if(wave)line(g,f.skin,x+4.5*s,gy-lh-bh+1.5*s,x+7*s,gy-lh-bh-3*s-((t>>3)&1)*1.2,1.3*s);
 else if(work)line(g,f.skin,x+4*s,gy-lh-bh+2*s,x+8*s,gy-lh-bh+5*s+Math.sin(t*0.4)*1.2,1.3*s);
 else line(g,f.skin,x+2.5*s,gy-lh-bh+1.5*s,x+2.5*s-st*0.6,gy-lh-1*s,1.3*s);
 headSide(g,x+2.5*s,gy-lh-bh-3.4*s,who,t,s*1.05);
 if(who==='anya'&&mode!=='work'){frr(g,'#fff1a8',x+3*s,gy-lh-bh+1.5*s,4.5,4,1.5);headSide(g,x+5.4*s,gy-lh-bh+1.6*s,'atti',t,0.85);}}

/* ---- kerék ---- */
function wheel(g,cx,cy,ang,flat,r){r=r||WR;g.save();g.translate(cx,cy);if(flat){g.translate(0,r*0.16);g.scale(1.1,0.82);}
 disc(g,'#14171b',0,0,r);g.strokeStyle='#2c3138';g.lineWidth=r*0.1;g.beginPath();g.arc(0,0,r*0.84,0,TAU);g.stroke();
 g.strokeStyle='rgba(255,255,255,0.1)';g.lineWidth=r*0.06;g.beginPath();g.arc(0,0,r*0.93,Math.PI*1.1,Math.PI*1.6);g.stroke();
 const q=r*0.72;g.fillStyle=rg(g,-q*0.3,-q*0.3,q*0.1,q*1.2,[[0,'#f6f8fa'],[1,'#8d98a3']]);g.beginPath();g.arc(0,0,q,0,TAU);g.fill();
 disc(g,'#262c33',0,0,q*0.86);disc(g,'#59616a',0,0,q*0.56);
 g.rotate(ang);g.fillStyle='#e3e8ec';for(let i=0;i<6;i++){g.rotate(TAU/6);g.fillRect(q*0.2,-q*0.17,q*0.68,q*0.1);g.fillRect(q*0.2,q*0.07,q*0.68,q*0.1);}
 disc(g,'#cfd6dc',0,0,q*0.24);disc(g,'#7f8a95',0,0,q*0.09);g.restore();
 if(flat)ell(g,'#14171b',cx,cy+r*0.98,r*1.18,r*0.17);}

/* ---- oldalnézet ---- */
function bodyPath(g){g.beginPath();g.moveTo(9,48.6);g.bezierCurveTo(4,48.6,2.2,46.4,2.1,42.5);g.lineTo(2,30.5);g.bezierCurveTo(2,21.5,4.5,15.6,9.5,12.6);
 g.bezierCurveTo(13.5,10.3,19.5,9.7,27.5,9.6);g.lineTo(61,9.8);g.bezierCurveTo(70,10.1,76.5,12.4,83,16.8);g.lineTo(95.6,26.4);
 g.bezierCurveTo(99.6,28.6,104.6,29.8,108.2,32.4);g.bezierCurveTo(111.4,35,112.3,39.4,111.6,43.6);g.bezierCurveTo(111.1,47.2,109.2,48.6,105,48.6);g.closePath();}
function glassPath(g){g.beginPath();g.moveTo(7.2,26.3);g.bezierCurveTo(6.9,19.4,8.7,15.2,13,13.3);g.bezierCurveTo(15.2,12.7,18.2,12.5,22,12.5);g.lineTo(61,12.7);
 g.bezierCurveTo(68.5,12.9,74,14.7,79.2,18.1);g.lineTo(92.6,27.6);g.lineTo(62,27.1);g.lineTo(7.4,26.6);g.closePath();}
const SEATS=[['apa',68,18.6],['anya',63.4,18.2],['anna',42.6,19.8],['petra',33.4,20.6]];
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
 frr(g,lg(g,0,20.4,0,24.2,[[0,'#ff6b6b'],[1,'#8e1c24']]),1.8,20.4,10.4,3.8,1.9);frr(g,'rgba(255,200,200,0.7)',2.6,21.2,8,0.7,0.35);frr(g,CP.tl,2.2,40.6,3,1.2,0.5);
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
 if(pos){glow(g,x+106,by+31.6,4,'rgba(255,250,230,0.85)');frr(g,'rgba(255,70,70,0.95)',x+1.8,by+21,10.4,2.4,1.2);glow(g,x+4,by+22,6,'rgba(255,40,40,0.5)');if(lights)lights.push({x:x+4,y:by+22,r:9});}
 if(fogF){disc(g,'#ffffff',x+108.6,by+42.2,1);glow(g,x+108.6,by+42.2,6,'rgba(255,255,230,0.9)');if(lights)lights.push({x:x+112,y:by+44,r:16});}
 if(fogR){frr(g,'#ff2a2a',x+2,by+38.8,3,1.8,0.8);glow(g,x+3,by+39.6,7,'rgba(255,30,30,0.85)');if(lights)lights.push({x:x+2,y:by+40,r:12});}
 if(o.rev){frr(g,'#ffffff',x+2,by+35.6,3,1.6,0.8);glow(g,x+3,by+36.4,9,'rgba(255,255,255,0.95)');if(lights)lights.push({x:x,y:by+40,r:26});}
 if(o.brake){frr(g,'#ff3b3b',x+1.8,by+20.4,10.4,3.8,1.9);glow(g,x+5,by+22,10,'rgba(255,40,40,0.6)');if(lights)lights.push({x:x+4,y:by+22,r:16});}
 if(o.blink){disc(g,CP.amb,x+110.6,by+37.6,1.1);glow(g,x+110.6,by+37.6,5,'rgba(255,170,30,0.8)');disc(g,CP.amb,x+2.6,by+24.6,0.9);glow(g,x+2.6,by+24.6,4,'rgba(255,170,30,0.7)');frr(g,CP.amb,x+74,by+24.6,4,0.9,0.45);}
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
 else if(e.tp==='bus'){frr(g,vpaint(g,c,-80,-6),0,-80,L,74,8);g.beginPath();rrect(g,0,-80,L,74,8);outline(g);for(let i=0;i<10;i++)frr(g,glass,10+i*26,-70,22,22,3);
  frr(g,'#2c333c',L-50,-70,14,58,2);frr(g,glass,L-24,-72,20,30,3);for(let i=0;i<7;i++)disc(g,i%2?'#f0c39a':'#c99a6e',22+i*30,-58,3.6);R(g,shade(c,0.7),0,-34,L,3);
  frr(g,'#fff3c4',L-4,-22,3,4,1.4);frr(g,CP.tl,1,-28,2.4,8,1);wheel(g,52,-12,ang,false,12);wheel(g,L-52,-12,ang,false,12);}
 else if(e.tp==='truck'){const cab=96;frr(g,lg(g,0,-98,0,-14,[[0,'#f4f6f8'],[0.5,'#dde2e7'],[1,'#b8c0c8']]),0,-98,L-cab-4,84,3);g.beginPath();rrect(g,0,-98,L-cab-4,84,3);outline(g);
  R(g,c,0,-60,L-cab-4,6);for(let k=24;k<L-cab;k+=48)R(g,'rgba(0,0,0,0.08)',k,-98,1,84);
  vpath(g,[[L-cab,-12],[L-cab,-92],[L-28,-92],[L-8,-62],[L,-50],[L,-12]]);g.fillStyle=vpaint(g,c,-92,-12);g.fill();outline(g);
  vpath(g,[[L-58,-86],[L-30,-86],[L-12,-62],[L-58,-62]]);g.fillStyle=glass;g.fill();head(L-40,-74,1);frr(g,'#2c333c',L-cab-8,-26,10,8,1);frr(g,'#fff3c4',L-4,-24,3,5,1.4);
  for(const wx of [24,50,76])wheel(g,wx,-12,ang,false,12);wheel(g,L-cab+24,-12,ang,false,12);wheel(g,L-24,-12,ang,false,12);}
 else if(e.tp==='tractor'){frr(g,lg(g,0,-34,0,-14,[[0,'#5fd16a'],[1,'#2f7d37']]),6,-34,L-12,20,4);g.beginPath();rrect(g,6,-34,L-12,20,4);outline(g);
  frr(g,'rgba(160,200,220,0.35)',8,-68,40,34,3);g.strokeStyle='#2c333c';g.lineWidth=2;rrect(g,8,-68,40,34,3);g.stroke();head(28,-52,1);frr(g,'#d9b24a',22,-59,12,2,1);frr(g,'#555',L-24,-46,3,12,1);
  wheel(g,26,-22,ang*0.5,false,22);wheel(g,L-18,-11,ang,false,11);}
 else if(e.tp==='moto'){line(g,'#2c333c',10,-9,L-10,-9,2);vpath(g,[[14,-14],[34,-20],[44,-16],[38,-10],[16,-10]]);g.fillStyle=vpaint(g,c,-20,-10);g.fill();outline(g);
  line(g,'#9aa4ae',L-10,-9,L-14,-24,1.6);frr(g,'#1b1f26',16,-17,14,3,1.5);person(g,22,-14,'apa',t,'ride');frr(g,'#1b1f26',22,-38,7,6,3);wheel(g,9,-8,ang,false,8);wheel(g,L-9,-8,ang,false,8);frr(g,'#fff3c4',L-12,-24,3,2.4,1);}
 if(e.wreck){disc(g,'rgba(120,120,120,0.4)',L*0.8,-TH[e.tp]-8-Math.sin(t*0.05)*3,8);disc(g,'rgba(150,150,150,0.3)',L*0.7,-TH[e.tp]-18-Math.sin(t*0.04)*4,10);}
 g.restore();if(lightsOn&&lights)lights.push({x:sx+e.w,y:gy-18,r:20});}
/* ---- tréler (platós autómentő): x = a plató hátsó vége, gy = talaj, tilt = plató dőlése ---- */
function drawTowTruck(g,x,gy,tilt,t,lights){const bedTop=gy-24;
 // fülke és alváz
 frr(g,'#2a2f36',x+10,gy-16,200,6,1.5);
 frr(g,lg(g,0,gy-52,0,gy-12,[[0,'#ff9a3c'],[1,'#d96b12']]),x+160,gy-52,46,40,5);frr(g,'#9cc4dc',x+180,gy-48,22,14,2);R(g,'#ffffff',x+160,gy-28,46,3);
 g.fillStyle='#ffffff';text(g,'AUTÓMENTŐ',x+183,gy-23,'#1b1f26',0.55,'center',null);frr(g,'#ffd84a',x+203,gy-22,4,3,1);frr(g,'#1b1f26',x+200,gy-16,8,5,1);
 // sárga villogó a tetőn
 const on=(t>>3)&1;frr(g,'#1b1f26',x+172,gy-56,22,4,1);frr(g,on?'#ffcc33':'#9a7a1a',x+174,gy-59,7,3,1);frr(g,on?'#9a7a1a':'#ffcc33',x+185,gy-59,7,3,1);
 if(on){glow(g,x+177,gy-58,10,'rgba(255,200,40,0.8)');if(lights)lights.push({x:x+177,y:gy-58,r:22});}else{glow(g,x+188,gy-58,10,'rgba(255,200,40,0.8)');if(lights)lights.push({x:x+188,y:gy-58,r:22});}
 // plató (a forgáspont körül billen)
 g.save();g.translate(x+150,bedTop);g.rotate(tilt);frr(g,lg(g,0,-4,0,4,[[0,'#c9ced4'],[1,'#7d858d']]),-150,-4,154,7,1.5);for(let k=-146;k<0;k+=10)R(g,'#6b737c',k,-4,1,7);frr(g,'#ffd84a',-150,-4,4,7,1);g.restore();
 // kerekek
 for(const wx of [40,66,184])wheel(g,x+wx,gy-11,t*0.0,false);}
