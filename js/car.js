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
const WHEELS=[24,89],WCY=45,WR=10.6;
/* fej oldalnézetből (jobbra néz) – cx,cy a fej közepe */
function headSide(g,cx,cy,who,t,s){s=s||1;const f=FAM[who];const r=(who==='anna'?2.7:who==='petra'?2.4:who==='atti'?2.1:3.2)*s;
 if(who==='anya'){g.fillStyle=f.hair;g.beginPath();g.ellipse(cx-r*0.5,cy+r*0.4,r*0.9,r*1.4,0,0,TAU);g.fill();}
 disc(g,f.skin,cx,cy,r);g.fillStyle=f.skin;g.beginPath();g.ellipse(cx+r*0.95,cy+r*0.15,r*0.28,r*0.22,0,0,TAU);g.fill();
 g.fillStyle=f.hair;g.beginPath();g.arc(cx-r*0.1,cy-r*0.1,r*1.02,Math.PI*0.95,Math.PI*1.9);g.closePath();g.fill();
 if(who==='petra'){disc(g,f.hair,cx-r*1.05,cy+r*0.2,r*0.45);}
 if(who==='anna'){g.fillStyle=f.hair;g.beginPath();g.ellipse(cx-r*0.7,cy+r*0.6,r*0.5,r*1.0,0.3,0,TAU);g.fill();disc(g,'#ff5a9a',cx-r*0.2,cy-r*0.95,r*0.3);}
 if(who==='apa'){g.fillStyle='#14171c';rrect(g,cx+r*0.15,cy-r*0.25,r*0.95,r*0.38,r*0.12);g.fill();}
 else disc(g,'#1a1a1a',cx+r*0.55,cy-r*0.1,r*0.17);
 if(who==='atti'&&((t>>5)&1))disc(g,'#ffffff',cx+r*0.95,cy+r*0.5,r*0.25);}
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
  for(const cx of WHEELS)disc(g,'#101215',cx,WCY,13.1);
  g.fillStyle=lg(g,0,43,0,49,[[0,'#3d434c'],[1,'#20242a']]);g.fillRect(0,43.6,120,6);
  g.strokeStyle='#2b3037';g.lineWidth=1.7;for(const cx of WHEELS){g.beginPath();g.arc(cx,WCY,13.8,Math.PI*1.03,Math.PI*1.97);g.stroke();}
  g.fillStyle=lg(g,0,9,0,30,[[0,'rgba(255,255,255,0.28)'],[1,'rgba(255,255,255,0)']]);g.fillRect(0,9,120,21);
  g.lineWidth=0.9;g.strokeStyle='rgba(255,255,255,0.6)';g.beginPath();g.moveTo(5,28.6);g.bezierCurveTo(40,28.1,80,28.7,101,30.8);g.stroke();
  g.lineWidth=0.7;g.strokeStyle='rgba(0,0,0,0.25)';g.beginPath();g.moveTo(10,37.6);g.bezierCurveTo(40,36.5,75,36.3,104,37.3);g.stroke();
  g.strokeStyle='rgba(255,255,255,0.25)';g.beginPath();g.moveTo(10,38.5);g.bezierCurveTo(40,37.4,75,37.2,104,38.2);g.stroke();
  // ajtóvonalak
  g.strokeStyle='rgba(18,22,28,0.6)';g.lineWidth=0.55;g.beginPath();g.moveTo(22.9,27);g.lineTo(22.7,31.6);g.moveTo(50.2,27);g.bezierCurveTo(50.4,36,50.4,40,50.2,43.6);
  g.moveTo(76.6,27.4);g.bezierCurveTo(77.4,32,77,35,75.4,37.2);g.moveTo(22.9,43.6);g.lineTo(75,43.6);g.stroke();
 g.restore();
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
  if(!hide.atti){frr(g,'#3b4a63',23.6,15.6,6.4,10.4,2.4);headSide(g,27.2,19.4+bob,'atti',t);}
  for(const [w,hx,hy] of SEATS)if(!hide[w])headSide(g,hx,hy+(w==='petra'||w==='anna'?bob:0),w,t);
  if(!hide.petra)frr(g,'#d8433b',30,22.6,7,3.6,1.4);
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
 g.restore();
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
 if(o.lightsOn||o.high){frr(g,'#ffffff',x+98,by+30.2,9,1.2,0.6);glow(g,x+106,by+32.6,o.high?9:6,o.high?'rgba(220,235,255,0.95)':'rgba(255,255,230,0.9)');if(lights)lights.push({cone:true,high:!!o.high,x:x+108,y:by+32,g:wy+55});}}
function drawDoors(g,x,y,a,t,hide){for(const [x0,x1] of [[22.9,50.2],[50.6,76.6]]){const Lw=x1-x0,pl=x0+Lw*a,pr=x1+Lw*0.3*a;
  g.save();g.translate(x,y);
  g.fillStyle='#2a2420';g.fillRect(x0,13,pl-x0,14.2);g.fillStyle=lg(g,0,27,0,44,[[0,'#a39280'],[1,'#7a6a5a']]);g.fillRect(x0,27,pl-x0,16.6);
  if(pl-x0>7){frr(g,'#3d4f6a',x0+3,14.5,7,13,1.8);frr(g,'#3d4f6a',x0+3,26,12,4.2,1.4);frr(g,'rgba(255,255,255,0.12)',x0+3.6,15,6,2,1);}
  g.fillStyle=lg(g,0,12,0,44,[[0,CP.l],[0.6,CP.m],[1,CP.d]]);rrect(g,pl,12.6,pr-pl,31,1.6);g.fill();
  g.fillStyle='#7d8fa3';rrect(g,pl+0.6,13.2,Math.max(0,pr-pl-1.2),13,1.2);g.fill();
  g.fillStyle='rgba(0,0,0,'+(0.22*a)+')';rrect(g,pl,12.6,pr-pl,31,1.6);g.fill();
  g.strokeStyle='#e6edf2';g.lineWidth=0.5;rrect(g,pl,12.6,pr-pl,31,1.6);g.stroke();g.restore();}}

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

/* ---- más járművek (lekerekített, vektoros) ---- */
const TW={hatch:56,van:66,bus:114,truck:124,tractor:50,police:58,camper:80},TH={hatch:30,van:40,bus:48,truck:50,tractor:40,police:30,camper:44};
const TCOLS=['#d64545','#3f7fd9','#f2c14e','#4caf6a','#e8e8e8','#8e5cc4','#f08a3c','#3a3f47'];
function drawTraffic(g,e,sx,lights,lightsOn,t){const gy=e.y,c=e.col,ang=e.x/6.5;g.save();g.translate(sx,gy);
 ell(g,'rgba(0,0,0,0.28)',e.w/2,0,e.w/2+2,2.6);
 const body=(pts)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();};
 const paint=(top,bot)=>lg(g,0,top,0,bot,[[0,shade(c,1.25)],[0.4,c],[1,shade(c,0.6)]]);
 const glass='#5f88a2';
 if(e.tp==='hatch'||e.tp==='police'){body([[2,-7],[1,-17],[6,-21],[16,-22],[22,-30],[38,-30.5],[46,-22],[53,-19],[56,-13],[55,-7]]);g.fillStyle=e.tp==='police'?lg(g,0,-31,0,-7,[[0,'#ffffff'],[1,'#c9d1d8']]):paint(-31,-7);g.fill();
  if(e.tp==='police'){R(g,'#1e4fb5',2,-17,53,3);text(g,'RENDŐRSÉG',8,-16.4,'#ffffff',0.5,'left',null);const on=((t>>3)&1);frr(g,on?'#3b7bff':'#ff3b3b',26,-33,6,2.4,1);frr(g,on?'#ff3b3b':'#3b7bff',32,-33,6,2.4,1);glow(g,on?29:35,-32,6,on?'rgba(60,120,255,0.8)':'rgba(255,60,60,0.8)');}
  body([[17,-21],[23,-28.5],[29,-28.5],[29,-21]]);g.fillStyle=glass;g.fill();body([[31,-21],[31,-28.5],[37.5,-28.5],[44,-21]]);g.fill();
  headSide(g,35,-24,'apa',t,0.8);frr(g,'#fff3c4',52,-17,3.6,2.4,1.2);frr(g,CP.tl,1,-18,2,4,1);wheel(g,13,-6.4,ang,false,6.4);wheel(g,44,-6.4,ang,false,6.4);}
 else if(e.tp==='van'||e.tp==='camper'){const L=e.w;body([[1,-7],[1,-38],[4,-40],[L-22,-40],[L-12,-28],[L-2,-24],[L,-14],[L-1,-7]]);g.fillStyle=paint(-40,-7);g.fill();
  if(e.tp==='camper'){R(g,'#7a8fa8',4,-22,L-30,3);frr(g,glass,10,-34,14,8,1.5);frr(g,glass,30,-34,10,8,1.5);}
  body([[L-21,-37],[L-13,-28],[L-21,-28]]);g.fillStyle=glass;g.fill();headSide(g,L-17,-31,'apa',t,0.8);frr(g,'#fff3c4',L-3,-21,2.6,2.6,1.2);
  wheel(g,14,-6.4,ang,false,6.4);wheel(g,L-14,-6.4,ang,false,6.4);}
 else if(e.tp==='bus'){frr(g,paint(-48,-7),0,-48,112,41,5);for(let i=0;i<7;i++)frr(g,glass,6+i*14,-42,11,12,2);frr(g,'#2c333c',92,-42,8,30,1.5);frr(g,glass,102,-42,9,16,2);
  for(let i=0;i<5;i++)disc(g,i%2?'#f0c39a':'#c99a6e',11+i*20,-35,2.4);frr(g,'#fff3c4',109,-18,3,3,1.2);wheel(g,20,-7,ang,false,7);wheel(g,90,-7,ang,false,7);}
 else if(e.tp==='truck'){frr(g,lg(g,0,-50,0,-10,[[0,'#f4f6f8'],[1,'#c4cad1']]),0,-50,92,40,3);R(g,c,0,-30,92,3);
  body([[94,-9],[94,-40],[112,-40],[121,-25],[123,-9]]);g.fillStyle=paint(-40,-9);g.fill();body([[106,-37],[112,-37],[118,-26],[106,-26]]);g.fillStyle=glass;g.fill();
  headSide(g,110,-31,'apa',t,0.8);frr(g,'#2c333c',88,-12,8,4,1);wheel(g,14,-7,ang,false,7);wheel(g,30,-7,ang,false,7);wheel(g,106,-7,ang,false,7);}
 else if(e.tp==='tractor'){frr(g,lg(g,0,-26,0,-14,[[0,'#4fc35a'],[1,'#2f7d37']]),4,-26,42,13,3);frr(g,'rgba(160,200,220,0.35)',8,-45,18,20,2);g.strokeStyle='#2c333c';g.lineWidth=1.4;rrect(g,8,-45,18,20,2);g.stroke();
  headSide(g,17,-35,'apa',t,0.9);frr(g,'#d9b24a',13,-40.6,8,1.6,0.8);frr(g,'#555',39,-34,2.4,8,1);wheel(g,15,-12,ang*0.6,false,12);wheel(g,41,-7,ang,false,7);}
 g.restore();if(lightsOn&&lights)lights.push({x:sx+e.w,y:gy-16,r:18});}
