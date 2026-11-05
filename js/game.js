'use strict';
/* =========================================================
   JÁTÉKMENET – vezetés, futómű, fogyasztás, készletek, események,
   tankolás, kerékcsere, képernyők
   ========================================================= */
const G={state:'title',leg:0,t:0,st:0,menu:0,paused:false,shake:0,flash:0,thunder:0,bolt:0,banner:0,save:null,trip:null,msg:null};
let P=null,LEG=null,ents=[],parts=[],drops=[],lights=[];
function newTrip(){return {km:0,fuel:38,fuelUsed:0,money:500000,vig:{},noVig:{},earned:0,food:85,baby:90,spare:true,mood:5,spentFuel:0,spentShop:0,fines:0,photos:0};}
function loadSave(){try{return JSON.parse(localStorage.getItem('csaladi-vakacio-v2')||'null');}catch(e){return null;}}
function save(){try{localStorage.setItem('csaladi-vakacio-v2',JSON.stringify({leg:G.leg,trip:G.trip}));}catch(e){}}
G.save=loadSave();
const WHO=['apa','anya','anna','petra','atti'],WHO_X={apa:68,anya:63,anna:42,petra:33,atti:27};
function say(txt,who){P.bub={txt:txt,who:who||'anna',t:170};}
function flash(msg,col,dur){G.msg={txt:msg,col:col||'#ffd84a',t:dur||200};}
function seg(){return segAtIn(LEG.segs,P.dist+PX+40);}
function legKm(){return Math.min(LEGS[G.leg].km,P.dist*LEG.kmPerPx);}
function distStr(km){return km<1?fmt(km*1000)+' m':fmt(km,1)+' km';}

/* ---------- indulás ---------- */
function startLeg(i){G.leg=i;LEG=buildLeg(i);const L=LEGS[i];
 P={dist:0,kmh:0,lane:i===0?0:1,y:LANE[i===0?0:1],ang:0,blink:0,inv:0,haz:false,lightsOn:L.time!=='day'||['rain','storm','fog','snow'].includes(L.weather),fog:['fog','snow','storm'].includes(L.weather),
  yF:0,vF:0,yR:0,vR:0,wF:0,wR:0,flat:null,sub:'drive',fix:0,pump:null,ev:null,evCD:1400,chat:300,bub:null,arriving:false,arriveT:0,door:0,hide:{},walk:[],stopT:0,
  boarding:i===0?0:-1,instCons:0,avgKm:0,avgL:0,lastSeg:null,hungerT:0,brake:false,gasF:0,engineOff:false};
 if(i===0){P.hide={apa:1,anya:1,anna:1,petra:1,atti:1};P.door=1;
  P.walk=[{w:'apa',x:PX+30,y:ROADT+6,tx:PX+60,t:0},{w:'anya',x:PX+20,y:ROADT+4,tx:PX+52,t:0},{w:'anna',x:PX+8,y:ROADT+8,tx:PX+40,t:0},{w:'petra',x:PX-2,y:ROADT+7,tx:PX+32,t:0}];}
 ents=[];parts=[];G.state='play';G.banner=240;G.paused=false;G.flash=0;G.msg=null;nextSpawn=500;
 drops=[];if(['rain','storm','snow'].includes(L.weather)){const n=L.weather==='storm'?190:L.weather==='rain'?130:110;for(let k=0;k<n;k++)drops.push({x:rnd(0,W+80),y:rnd(-H,H),v:L.weather==='snow'?rnd(0.6,1.4):rnd(6,9),ph:rnd(0,7)});}}
let nextSpawn=0;

/* ---------- út profil a futóműhöz ---------- */
function vnoise(x){const i=Math.floor(x),f=x-i,a=hsh(i*7+3),b=hsh(i*7+10);const u=f*f*(3-2*f);return a+(b-a)*u-0.5;}
const QAMP={good:0.12,medium:0.55,bad:1.35,cobble:0.5};
function roadH(x){const s=segAtIn(LEG.segs,x),A=QAMP[s.q];let h=vnoise(x/14)*A*1.4+vnoise(x/5)*A*0.5;if(s.q==='cobble')h+=Math.sin(x*1.4)*0.32;return h;}

/* ---------- forgalom és akadályok ---------- */
function spawnAt(x){const s=segAtIn(LEG.segs,x),L=LEGS[G.leg],r=Math.random(),lane=(Math.random()*3)|0;
 for(const st of LEG.stations)if(Math.abs(x-st-80)<220)return;
 if(x>LEG.len-400)return;
 const trafP=s.type==='motorway'?0.55:s.type==='town'?0.35:0.3;
 if(r<trafP){if(ents.some(e=>e.kind==='traffic'&&e.lane===lane&&Math.abs(e.x-x)<200))return;
  const types=s.type==='motorway'?['hatch','truck','van','hatch','bus','camper']:s.type==='town'?['hatch','van','bus','hatch']:s.type==='village'?['tractor','hatch','van']:['hatch','van','truck','tractor'];
  const tp=pick(types),lim=s.limit,kmh=tp==='tractor'?25:tp==='truck'?Math.min(85,lim*0.8):lim*rnd(0.7,0.95);
  ents.push({kind:'traffic',tp:tp,x:x,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW[tp],h:TH[tp],kmh:kmh,base:kmh,col:pick(TCOLS)});return;}
 const holeP=s.q==='bad'?0.75:s.q==='medium'?0.35:s.q==='cobble'?0.2:0.06;
 if(Math.random()<holeP){const wet=L.weather==='rain'||L.weather==='storm';ents.push({kind:wet&&Math.random()<0.4?'puddle':'hole',x:x,lane:lane,y:LANE[lane],w:24});return;}
 if((s.type==='village'||s.type==='country')&&Math.random()<0.18){const tp=L.time==='night'||L.region==='alps'?'deer':pick(['sheep','cow']);ents.push({kind:'animal',tp:tp,x:x+120,y:ROADT+2,vy:tp==='cow'?0.28:tp==='deer'?0.5:0.36,w:tp==='cow'?32:22,step:0});}}

function drawObstacle(g,e,sx,t){const gy=e.y;let x=sx,y=gy;if(e.fly){x+=e.fx;y+=e.fz;}
 if(e.kind==='cone'){ell(g,'rgba(0,0,0,0.25)',x+7,gy,7,1.8);frr(g,'#e8661c',x,y-2,14,2,0.8);g.fillStyle=lg(g,x,0,x+14,0,[[0,'#ff9a4a'],[1,'#d8551a']]);g.beginPath();g.moveTo(x+3,y-2);g.lineTo(x+6.4,y-15);g.quadraticCurveTo(x+7,y-16,x+7.6,y-15);g.lineTo(x+11,y-2);g.closePath();g.fill();frr(g,'#fff',x+4.4,y-8,5.2,2,0.6);frr(g,'#fff',x+5.4,y-12,3.2,1.2,0.5);}
 else if(e.kind==='hole'){ell(g,'#2a2c31',x+12,gy,12,3);ell(g,'#141519',x+12,gy+0.6,9,2);ell(g,'rgba(255,255,255,0.08)',x+12,gy-1.6,10,0.8);}
 else if(e.kind==='puddle'){ell(g,'#4f7fae',x+12,gy,13,3);ell(g,'rgba(200,225,250,0.6)',x+9,gy-1,5,0.8);}
 else if(e.kind==='sign'){line(g,'#7d858d',x+6,gy,x+6,gy-16,1.2);g.fillStyle='#ffcc00';g.beginPath();g.moveTo(x+6,gy-30);g.lineTo(x+14,gy-17);g.lineTo(x-2,gy-17);g.closePath();g.fill();g.strokeStyle='#d32f2f';g.lineWidth=1.2;g.stroke();text(g,'!',x+4.6,gy-26,'#111',0.7,'left',null);}}
function drawAnimal(g,e,sx,t){const gy=e.y,x=sx,st=Math.sin((e.step||0)*0.25)*1.4;
 if(e.tp==='sheep'){ell(g,'rgba(0,0,0,0.22)',x+9,gy,9,1.8);line(g,'#2a2a2a',x+4,gy-5,x+4+st,gy,1.6);line(g,'#2a2a2a',x+13,gy-5,x+13-st,gy,1.6);disc(g,'#f2f2ee',x+8,gy-10,6);disc(g,'#f2f2ee',x+3.6,gy-9,4);disc(g,'#f2f2ee',x+12.4,gy-9,4);frr(g,'#2a2a2a',x+14,gy-14.6,5.4,5,2);disc(g,'#fff',x+17,gy-13,0.5);}
 else if(e.tp==='cow'){ell(g,'rgba(0,0,0,0.22)',x+15,gy,15,2.6);frr(g,'#f4f1ea',x+2,gy-20,25,12,4);disc(g,'#2a2a2a',x+9,gy-16,3);disc(g,'#2a2a2a',x+20,gy-12,2.6);
  for(const lx of [4,9,19,24])line(g,'#e8e3d6',x+lx,gy-9,x+lx+(lx<12?st:-st),gy,2);frr(g,'#f4f1ea',x+25,gy-25,8,8,2.5);frr(g,'#f3a7b0',x+29,gy-20,4.4,3.4,1.5);disc(g,'#2a2a2a',x+28,gy-22.6,0.5);}
 else{ell(g,'rgba(0,0,0,0.22)',x+12,gy,12,2);frr(g,'#9a6a3c',x+2,gy-17,20,8,4);for(const lx of [4,8,16,20])line(g,'#7a5230',x+lx,gy-10,x+lx+(lx<12?st:-st),gy,1.3);
  line(g,'#9a6a3c',x+19,gy-14,x+23,gy-22,3);frr(g,'#9a6a3c',x+21,gy-25,6,4.4,2);disc(g,'#ffffff',x+3,gy-14,1.4);
  line(g,'#5a3d22',x+22,gy-25,x+20,gy-31,0.7);line(g,'#5a3d22',x+24,gy-25,x+26,gy-31,0.7);
  disc(g,LEGS[G.leg].time==='night'?'#fff8a8':'#1a1a1a',x+25,gy-23.6,0.6);if(LEGS[G.leg].time==='night')glow(g,x+25,gy-23.6,4,'rgba(255,250,170,0.9)');}}
function triangle(g,x,gy){line(g,'#555',x,gy,x+2,gy-2,0.6);g.strokeStyle='#e53935';g.lineWidth=1.3;g.beginPath();g.moveTo(x-4,gy-1);g.lineTo(x+4,gy-1);g.lineTo(x,gy-8);g.closePath();g.stroke();}

/* ---------- események ---------- */
const EVDEF={
 baby:{msg:'Kis Atti sír, éhes! Állj meg a szélső sávban!',who:'anya',stop:180,time:1700,out:['anya','atti']},
 sick:{msg:'Petrának rossz! Gyorsan állj meg a szélső sávban!',who:'anya',stop:240,time:1000,out:['petra','anya']},
 pee:{msg:'Annának pisilni kell! Állj meg a szélső sávban vagy a kútnál!',who:'anna',stop:150,time:2000,out:['anna','apa']}};
function startEvent(){const s=seg(),L=LEGS[G.leg],r=Math.random();let type;
 if(r<0.18)type='baby';else if(r<0.29)type='sick';else if(r<0.43)type='pee';else if(r<0.56)type='police';else if(r<0.72)type='help';else if(r<0.8&&s.type==='motorway')type='jam';else if(r<0.9)type='works';else type='baby';
 if(type==='baby'||type==='sick'||type==='pee'){const d=EVDEF[type];P.ev={type:type,t:d.time,stopT:0};say(type==='baby'?'Atti nagyon sír!':type==='sick'?'Anya, rosszul vagyok...':'Apa, pisilni kell!',d.who);if(type==='baby')SFX.cry();return;}
 if(type==='police'){const x=P.dist+W+60;ents.push({kind:'traffic',tp:'police',x:x,lane:0,y:LANE[0]-3,ty:LANE[0]-3,w:TW.police,h:TH.police,kmh:0,base:0,col:'#ffffff',parked:true,radar:true});P.ev={type:'police',t:99999,x:x};return;}
 if(type==='jam'){const x=P.dist+W+80;for(let k=0;k<12;k++){const tp=pick(['hatch','van','truck','hatch']),lane=k%3;ents.push({kind:'traffic',tp:tp,x:x+Math.floor(k/3)*(TW[tp]+30)+lane*12,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW[tp],h:TH[tp],kmh:12,base:12,col:pick(TCOLS),jam:true});}
  P.ev={type:'jam',t:900};flash('Dugó az autópályán! Lassíts!','#ffb347');say('Jaj, dugó...','apa');return;}
 if(type==='help'){const kind=Math.random()<0.5?'jump':'truck',x=P.dist+W+80,tp=kind==='jump'?pick(['hatch','van']):'truck';ents.push({kind:'traffic',tp:tp,x:x,lane:0,y:LANE[0]-3,ty:LANE[0]-3,w:TW[tp],h:TH[tp],kmh:0,base:0,col:pick(TCOLS),parked:true,help:kind});
  P.ev={type:'help',kind:kind,x:x,t:99999};flash(kind==='jump'?'Lerobbant autó az út szélén! Állj meg mögötte a szélső sávban és segíts!':'Egy kamionosnak leesett a rakománya! Állj meg mögötte a szélső sávban!','#7fd1ff',300);return;}
 if(type==='works'){const x=P.dist+W+60;ents.push({kind:'sign',x:x-60,lane:-1,y:ROADT+6,w:0});for(let k=0;k<10;k++)for(const ln of [0,1])ents.push({kind:'cone',x:x+k*26,lane:ln,y:LANE[ln],w:14});P.ev={type:'works',t:900};flash('Útépítés! Két sáv lezárva, menj az alsó sávba!','#ffb347');}}
function evFail(){const d=EVDEF[P.ev.type];G.trip.mood--;flash(P.ev.type==='baby'?'Atti egész úton sírt... (-1 kedv)':P.ev.type==='sick'?'Petra rosszul lett az autóban... (-1 kedv)':'Nem bírta ki... (-1 kedv)','#ff8a8a');P.ev=null;checkMood();}
function evDone(){const ty=P.ev.type;if(ty==='baby'){G.trip.baby=Math.max(0,G.trip.baby-20);flash(G.trip.baby>0?'Atti jóllakott és elaludt. Csend van!':'Elfogyott a bébiétel! Vegyél a kútnál!','#7cff7c');}
 else if(ty==='sick')flash('Petra jobban van, mehetünk tovább.','#7cff7c');else flash('Mindenki megkönnyebbült!','#7cff7c');
 for(const w of EVDEF[ty].out)P.hide[w]=0;P.ev=null;G.trip.photos++;}
function checkMood(){if(G.trip.mood<=0){G.state='over';G.st=0;}}

/* ---------- ütközés ---------- */
function hit(msg,who){if(P.inv>0)return false;vib(180);G.trip.mood--;P.inv=100;G.shake=8;SFX.hit();say(msg||pick(['Jaj!','Vigyázz!','Apaaa!']),who||'anya');P.vF-=2.5;P.vR-=1.5;
 for(let k=0;k<8;k++)parts.push({type:'star',x:P.dist+105,y:P.y-22,vx:rnd(-1,2),vy:rnd(-3,-1),life:30,max:30,col:pick(['#ffeb3b','#ffffff','#ff9800']),world:true});checkMood();return true;}
function flatTire(){if(P.flat)return;P.flat=Math.random()<0.5?'f':'r';SFX.pop();say('Defektet kaptunk!','apa');flash(G.trip.spare?'Defekt! Állj meg a szélső sávban a kerékcseréhez!':'Defekt, és nincs pótkerék! Állj meg a szélső sávban!','#ff8a8a',260);}

/* ---------- fogyasztás (l/100 km) ---------- */
function consumption(v,type,gas){if(v<3)return 0;let c=2.9+0.00033*v*v;if(type==='town'||type==='village')c+=4.0;if(gas>0)c+=10*gas*(1-v/185);
 const s=seg();if(s.q==='bad'||s.q==='cobble')c+=0.3;if(LEGS[G.leg].weather==='snow')c+=0.6;if(LEGS[G.leg].region==='alps')c+=0.4;return c;}

/* ---------- frissítés ---------- */
function updPlay(){const L=LEGS[G.leg],t=G.t,T=G.trip;if(K.pauseP&&!MG)G.paused=!G.paused;if(G.paused)return;
 if(MG){updMini();engine(0,0);return;}
 const s=seg();
 if(s!==P.lastSeg){segLeave(P.lastSeg);P.lastSeg=s;segEnter(s);const nm=s.type==='motorway'?s.name+' autópálya':s.type==='country'?'Országút':(s.name||'')+(s.type==='town'?' (város)':' (falu)');G.segInfo={txt:nm+' - '+QNAME[s.q]+' - '+s.limit+' km/h',t:220};}
 // beszállás az indulásnál
 if(P.boarding>=0){P.boarding++;let all=true;for(const w of P.walk){w.t++;if(w.x<w.tx){w.x+=0.6;all=false;}else if(w.y<P.y+3){w.y+=0.4;all=false;}}
  if(P.boarding===20)say('Mindenki beszáll! Indulunk nyaralni!','apa');
  if(all&&P.walk.length){P.walk=[];P.hide={};SFX.clunk();}if(!P.walk.length){P.door=Math.max(0,P.door-0.05);if(P.door<=0){P.boarding=-1;say('Kösd be magad, Anna!','anya');G.banner=200;}}
  susp(0,0);return;}
 if(P.sub==='pump'){updPump();susp(0,0);return;}
 if(P.sub==='fix'){updFix();susp(0,0);return;}
 // lámpák, kapcsolók
 if(K.lightP){P.lightsOn=!P.lightsOn;SFX.click();}if(K.fogP){P.fog=!P.fog;SFX.click();}if(K.hazP){P.haz=!P.haz;SFX.click();}
 // gáz / fék / sebesség
 const brake=K.brake||K.pump,gas=K.gas&&!P.engineOff&&!P.arriving;let a=0;
 if(P.arriving){P.kmh=Math.max(0,P.kmh-1.2);P.arriveT++;}
 else{if(gas){a=0.17*(1-Math.pow(P.kmh/CAR.top,2))*(P.flat?0.5:1)*(L.weather==='snow'?0.7:1);P.kmh+=a;}
  else P.kmh-=0.012+0.0000035*P.kmh*P.kmh;
  if(brake)P.kmh-=L.weather==='snow'?0.3:L.weather==='rain'||L.weather==='storm'?0.38:0.5;
  if(P.flat)P.kmh=Math.min(P.kmh,38);P.kmh=clamp(P.kmh,0,CAR.top);}
 P.brake=brake&&P.kmh>0.5||P.arriving&&P.kmh>0.5;P.gasF=gas?a/0.17:0;
 const pxf=P.kmh/30;P.dist+=pxf;P.ang+=pxf/WR;
 // km, benzin, kaja
 const dkm=pxf*LEG.kmPerPx;T.km+=dkm;P.avgKm+=dkm;
 const c=consumption(P.kmh,s.type,P.gasF);P.instCons=c;let dl=c/100*dkm;if(P.kmh<3&&!P.engineOff)dl=0.00004;
 if(!P.engineOff){T.fuel=Math.max(0,T.fuel-dl);T.fuelUsed+=dl;P.avgL+=dl;}
 if(T.fuel<=0&&!P.engineOff){P.engineOff=true;flash('Kifogyott a benzin! Autómentő hozzon 10 litert: 25 000 Ft (Enter / érintés)','#ff8a8a',99999);say('Elfogyott a benzin...','apa');}
 if(P.engineOff&&K.enterP){T.money-=25000;T.spentShop+=25000;T.fuel=10;P.engineOff=false;G.msg=null;flash('Megjött a segítség: 10 liter a tankban.','#7cff7c');SFX.cash();}
 if(T.fuel<7&&t%600===0&&!P.engineOff){flash('Tartalék! Kevés a benzin, tankolj a következő kútnál!','#ffb347');tone(660,0.2,'square',0.05);}
 T.food=Math.max(0,T.food-dkm*0.07-0.0011);T.baby=Math.max(0,T.baby-0.0004);
 if(T.food<=0){if(++P.hungerT%1500===0){T.mood--;say('Éhesek vagyunk!','petra');flash('Elfogyott a kaja! A család éhes (-1 kedv). Vásárolj a kútnál!','#ff8a8a');checkMood();}}
 // motorhang
 const gears=[0,20,38,60,90,125,186];let gi=1;while(gi<gears.length-1&&P.kmh>gears[gi])gi++;const rpm=P.engineOff?0:900+(P.kmh-gears[gi-1])/(gears[gi]-gears[gi-1])*4600;engine(rpm,P.gasF);P.rpm=rpm;P.gear=P.kmh<1?'N':gi;
 // sávváltás
 if(!P.arriving){if(K.upP&&P.lane>0){P.lane--;P.blink=60;}if(K.dnP&&P.lane<2){P.lane++;P.blink=60;}
  if(K.honkP){SFX.honk();for(const e of ents){const d=e.x-(P.dist+110);if(e.kind==='animal'&&d<260&&d>-60&&!e.flee){e.flee=true;e.tp==='cow'?SFX.moo():SFX.baa();}}}}
 const ty=LANE[P.lane],dy=ty-P.y,grip=L.weather==='snow'?0.55:(L.weather==='rain'||L.weather==='storm')?0.7:1;P.y+=clamp(dy*0.14*grip,-2*grip,2*grip);if(Math.abs(dy)<0.3)P.y=ty;
 if(P.blink>0)P.blink--;if(P.inv>0)P.inv--;
 // futómű
 susp(P.gasF,brake?1:0);
 // forgalom, akadályok
 while(!P.arriving&&nextSpawn<P.dist+W+150){spawnAt(nextSpawn);const sn=segAtIn(LEG.segs,nextSpawn);nextSpawn+=sn.type==='motorway'?rnd(110,200):rnd(150,260);}
 updEnts();
 // közlekedési lámpák
 for(const l of LEG.lights){const front=P.dist+112;if(!l.passed&&front>l.x){l.passed=true;if(front-l.x<8&&lightState(l,t)==='red'&&P.kmh>5){T.money-=30000;T.fines+=30000;T.mood--;SFX.siren();flash('Piros lámpán hajtottál át! Bírság: 30 000 Ft, -1 kedv','#ff8a8a',260);say('Ez piros volt!','anya');checkMood();}}}
 // benzinkút
 for(const st of LEG.stations){const flapX=P.dist+13.6;for(const q of [st+40,st+104])if(P.lane===0&&Math.abs(q+12-flapX)<30&&P.kmh<1&&!P.flat&&!P.arriving){P.sub='pump';P.pump={step:'nozzle',liters:0,q:q,msg:'',start:T.fuel};P.hide.apa=1;SFX.click();
  if(P.ev&&P.ev.type==='pee'){P.ev=null;flash('Anna elszaladt a mosdóba. Megkönnyebbült!','#7cff7c');}return;}}
 // megállós események
 if(P.ev){const d=EVDEF[P.ev.type];
  if(d){P.ev.t--;if(P.lane===0&&P.kmh<1){P.ev.stopT++;if(P.ev.stopT===1)for(const w of d.out)P.hide[w]=1;if(P.ev.stopT>=d.stop)evDone();}
   else if(P.ev.stopT>0){for(const w of d.out)P.hide[w]=0;P.ev.stopT=0;}
   if(P.ev&&P.ev.t<=0)evFail();}
  else if(P.ev.type==='help'){const front=P.dist+112;if(P.lane===0&&P.kmh<1&&front<P.ev.x&&P.ev.x-front<70){const kind=P.ev.kind,ex=P.ev.x;P.hide.apa=1;P.ev=null;startMini(kind,{onEnd:r=>{P.hide.apa=0;for(const e of ents)if(e.help&&e.x===ex){e.help=null;e.parked=false;e.kmh=e.base=60;}flash(r?'Köszönjük! Kaptál '+fmt(r)+' Ft-ot.':'Legalább megpróbáltad.',r?'#7cff7c':'#ffb347');if(r){G.trip.mood=Math.min(5,G.trip.mood+1);say('Apa egy hős!','anna');}}});return;}
   if(front>P.ev.x+40)P.ev=null;}
  else if(P.ev.type==='police'){if(P.dist+112>P.ev.x+20){const lim=s.limit;if(P.kmh>lim+5){const fine=Math.round((10000+(P.kmh-lim)*1500)/1000)*1000;T.money-=fine;T.fines+=fine;SFX.siren();flash('Traffipax! '+Math.round(P.kmh)+' km/h a '+lim+'-es táblánál. Bírság: '+fmt(fine)+' Ft','#ff8a8a',300);say('Mondtam, hogy lassíts!','anya');}
    else{flash('Rendőri ellenőrzés: szabályos sebesség, jó utat!','#7cff7c');}P.ev=null;}}
  else{P.ev.t--;if(P.ev.t<=0){if(P.ev.type==='jam'){for(const e of ents)if(e.jam){e.kmh=e.base=95;e.jam=false;}flash('Feloldódott a dugó.','#7cff7c');}P.ev=null;}}}
 else if(!P.arriving&&--P.evCD<=0){startEvent();P.evCD=rnd(1500,2600)|0;}
 // defekt: kerékcsere megállva
 if(P.flat&&P.lane===0&&P.kmh<1&&!P.arriving){P.sub='fix';P.fix=0;P.hide.apa=1;}
 if(P.flat&&P.kmh>3&&t%Math.max(5,Math.round(30/Math.max(1,P.kmh/10)))===0)tone(70,0.06,'square',0.07);
 // részecskék
 if(t%8===0&&P.kmh>1&&!P.engineOff)parts.push({type:'puff',x:P.dist+2,y:P.y-6,vx:-0.3,vy:-0.2,life:40,max:40,col:'rgba(200,205,212,0.45)',world:true});
 if((L.weather==='rain'||L.weather==='storm'||L.weather==='snow')&&P.kmh>40&&t%2===0)for(const wx of WHEELS)parts.push({type:'dot',x:P.dist+wx-6,y:P.y-2,vx:rnd(-2,-0.5),vy:rnd(-2,-0.6),life:18,max:18,col:L.weather==='snow'?'#ffffff':'#a8c8e8',world:true});
 for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(p.type!=='puff'&&p.type!=='text')p.vy+=0.15;p.life--;}parts=parts.filter(p=>p.life>0);
 weatherUpd(L,t);
 // fecsegés
 if(P.bub){P.bub.t--;if(P.bub.t<=0)P.bub=null;}
 if(--P.chat<=0){chatter();P.chat=rnd(500,900)|0;}
 if(G.banner>0)G.banner--;if(G.shake>0)G.shake--;if(G.msg&&G.msg.t<99999)G.msg.t--;if(G.msg&&G.msg.t<=0)G.msg=null;if(G.segInfo&&--G.segInfo.t<=0)G.segInfo=null;
 // érkezés
 if(!P.arriving&&P.dist>=LEG.len){P.arriving=true;P.arriveT=0;ents=[];say('Megérkeztünk!','apa');SFX.win();}
 if(P.arriving){if(P.arriveT%6===0)for(let k=0;k<4;k++)parts.push({type:'conf',x:rnd(0,W),y:-5,vx:rnd(-0.5,0.5),vy:rnd(0.5,1.5),life:200,max:200,col:pick(['#ff5a7a','#ffd54f','#4fc3f7','#81c784','#ba68c8']),world:false});
  if(P.kmh<0.5&&P.arriveT>=90&&P.door<1)P.door=Math.min(1,P.door+0.05);
  if(P.arriveT>=110&&P.walk.length<4&&(P.arriveT-110)%16===0){const w=['apa','anya','anna','petra'][P.walk.length];P.walk.push({w:w,x:PX+(w==='apa'||w==='anya'?60:36),y:P.y+4,tx:PX+150+P.walk.length*15,t:0,out:true});P.hide[w]=1;if(w==='anya')P.hide.atti=1;}
  for(const w of P.walk){w.t++;if(w.x<w.tx)w.x+=0.8;}
  if(P.arriveT===230)say('Juhééé! Itt vagyunk!','anna');if(P.arriveT>340){G.state='postcard';G.st=0;arriveRefill();}}}
const VIG={HU:{price:6400,label:'Magyarország: heti e-matrica (D1)',fine:14875},AT:{price:5200,label:'Ausztria: 10 napos matrica (12,80 EUR)',fine:48000}};
const TOLL={IT:32,FR:40};
function segEnter(s){if(!s||s.type!=='motorway'||!s.cc)return;const T=G.trip,v=VIG[s.cc];
 if(v&&!T.vig[s.cc]&&!(T.noVig&&T.noVig[s.cc]))startMini('vignette',{cc:s.cc,price:v.price,label:v.label});
 if(TOLL[s.cc])flash('Fizetős autópálya ('+s.cc+'): az útdíjat a kapunál fizeted.','#7fd1ff');}
function segLeave(s){if(!s||s.type!=='motorway'||!s.cc)return;const T=G.trip,km=(s.x1-s.x0)*LEG.kmPerPx;
 if(TOLL[s.cc]){const c=Math.round(km*TOLL[s.cc]/10)*10;T.money-=c;T.spentShop+=c;SFX.cash();flash('Fizetőkapu: útdíj '+fmt(c)+' Ft ('+fmt(km)+' km)','#7fd1ff',240);}
 const v=VIG[s.cc];if(v&&!T.vig[s.cc]&&Math.random()<0.35){T.money-=v.fine;T.fines+=v.fine;SFX.siren();flash('Matrica nélkül hajtottál az autópályán! Pótdíj: '+fmt(v.fine)+' Ft','#ff8a8a',300);}}
/* ---------- élő időjárás (Open-Meteo, valós idő) ---------- */
function wxMap(code,isDay,hour){let w='sun';if([3].includes(code))w='cloudy';else if([45,48].includes(code))w='fog';else if((code>=51&&code<=67)||(code>=80&&code<=82))w='rain';else if((code>=71&&code<=77)||code===85||code===86)w='snow';else if(code>=95)w='storm';
 let tm='day';if(!isDay)tm='night';else if(hour>=18)tm='sunset';else if(hour<7)tm='dusk';if(tm==='night'&&w==='sun')w='clear';return [w,tm];}
function fetchWeather(i){if(LEGS[i].live||location.protocol==='file:'||!navigator.onLine)return;const c=LIVE_XY[i+1];
 fetch('https://api.open-meteo.com/v1/forecast?latitude='+c[0]+'&longitude='+c[1]+'&current=weather_code,is_day,temperature_2m,wind_speed_10m&timezone=auto').then(r=>r.json()).then(d=>{const cur=d.current;if(!cur)return;
  const hour=+String(cur.time).slice(11,13);const [w,tm]=wxMap(cur.weather_code,cur.is_day,hour);const L=LEGS[i];L.weather=w;L.time=tm;L.temp=cur.temperature_2m;L.wind=cur.wind_speed_10m;L.localTime=String(cur.time).slice(11,16);L.live=true;}).catch(()=>{});}
function arriveRefill(){const T=G.trip,cost=18000;T.money-=cost;T.spentShop+=cost;T.food=100;T.baby=100;T.photos+=3;}
function susp(gas,brake){const xR=P.dist+WHEELS[0],xF=P.dist+WHEELS[1];const k=0.13,c=0.3;
 const tF=-roadH(xF)+brake*0.9-gas*0.4,tR=-roadH(xR)-brake*0.4+gas*0.6;P.wF=-roadH(xF);P.wR=-roadH(xR);
 P.vF+=k*(tF-P.yF)-c*P.vF;P.yF+=P.vF;P.vR+=k*(tR-P.yR)-c*P.vR;P.yR+=P.vR;}
function updEnts(){const pl=P.dist+6,pr=P.dist+112,t=G.t,L=LEGS[G.leg];
 for(const e of ents){
  if(e.kind==='traffic'){if(!e.parked){let v=e.kmh;for(const l of LEG.lights){const st=lightState(l,t);if(st!=='green'&&e.x+e.w<l.x&&l.x-(e.x+e.w)<40)v=0;}
    for(const o of ents)if(o!==e&&o.kind==='traffic'&&o.lane===e.lane&&o.x>e.x&&o.x-(e.x+e.w)<14)v=Math.min(v,o.kmh);
    e.cur=lerp(e.cur===undefined?v:e.cur,v,0.05);e.x+=e.cur/30;}
   e.y+=clamp(e.ty-e.y,-0.8,0.8);}
  else if(e.kind==='animal'){e.step++;if(e.flee){e.y-=1.4;e.x+=0.6;}else e.y+=e.vy;}
  else if(e.fly){e.fx+=e.fvx;e.fz+=e.fvz;e.fvz+=0.3;if(e.fz>40)e.gone=true;}
  if(e.gone||e.fly||e.done)continue;
  if(e.x<pr&&e.x+e.w>pl&&Math.abs(e.y-P.y)<8){
   if(e.kind==='hole'){e.done=true;if(P.kmh>15){P.vF-=1.6*(P.kmh/60);P.vR-=1.2*(P.kmh/60);SFX.bump();vib(40);G.shake=3;const s=seg();const ch=(s.q==='bad'?0.22:0.1)*Math.min(1.5,P.kmh/70);if(Math.random()<ch)flatTire();else if(P.kmh>60&&Math.random()<0.5)say('Hú, de nagy kátyú!','anya');}}
   else if(e.kind==='puddle'){e.done=true;if(P.kmh>20){SFX.splash();P.kmh*=0.92;for(let k=0;k<14;k++)parts.push({type:'dot',x:P.dist+rnd(10,100),y:P.y-2,vx:rnd(-1,1.5),vy:rnd(-3,-1),life:28,max:28,col:'#9cc3e6',world:true});}}
   else if(e.kind==='cone'){if(P.kmh>3&&hit('Elütöttük a bóját!','anna')){e.fly=true;e.fx=0;e.fz=0;e.fvx=3+P.kmh/40;e.fvz=-4;}}
   else if(e.kind==='traffic'){if(P.kmh>(e.cur||0)+2&&hit()){P.kmh=Math.max(0,(e.cur||0)*0.7);}}
   else if(e.kind==='animal'&&!e.flee){if(P.kmh>5&&hit(e.tp==='deer'?'Egy őz!':'Bocsánat!','petra')){e.flee=true;}}}}
 ents=ents.filter(e=>!e.gone&&e.x>P.dist-280&&!(e.kind==='animal'&&(e.y>ROADB+18||e.y<ROADT-40)));}
function weatherUpd(L,t){for(const d of drops){if(L.weather==='snow'){d.y+=d.v;d.x+=Math.sin(t*0.03+d.ph)*0.4-P.kmh/30*0.25*d.v;}else{d.y+=d.v;d.x-=d.v*(L.weather==='storm'?0.55:0.3)+P.kmh/30*0.3;}
  if(d.y>H){d.y=rnd(-30,-5);d.x=rnd(0,W+80);}if(d.x<-10)d.x+=W+80;}
 if(L.weather==='storm'&&G.flash<=0&&Math.random()<1/280){G.flash=12;G.thunder=22;G.bolt=rnd(60,420);}
 if(G.flash>0)G.flash--;if(G.thunder>0&&--G.thunder===0){SFX.thunder();if(Math.random()<0.5)say('Hűha, mennydörgés!','petra');}}
const LINES=[['Apa, mikor érünk oda?','anna'],['Anna elvette a plüssömet!','petra'],['Ott vagyunk már?','petra'],['Csss, Atti elaludt.','anya'],['Nézd, egy tehén!','petra'],
 ['Ki kér szendvicset?','anya'],['Énekeljünk!','anna'],['Gugu-gaga!','atti'],['Hol a térkép?','apa'],['Milyen szép a táj!','anya'],['Unatkozom!','anna'],['Kérek vizet!','petra'],['Ki látja előbb a tengert?','apa'],['Anya, mesélj!','petra']];
function chatter(){const s=seg(),rem=LEGS[G.leg].km-legKm();
 if(P.kmh>s.limit+15&&Math.random()<0.6){say('Lassíts, drágám! Itt csak '+s.limit+'!','anya');return;}
 if(Math.random()<0.2){say('Még '+fmt(Math.max(1,rem))+' km '+LEGS[G.leg].to.split(' ')[0]+'ig!','apa');return;}
 const l=pick(LINES);say(l[0],l[1]);}

/* ---------- tankolás ---------- */
const PUMP_BTN={b95:[262,90,96,24],bd:[364,90,96,24],cancel:[262,120,198,18],fill:[262,150,96,40],done:[364,150,96,40]};
function shopItems(){const T=G.trip,it=[{k:'food',l:'Szendvics, gyümölcs, víz',p:4990,ok:T.food<99},{k:'baby',l:'Bébiétel és pelenka',p:3490,ok:T.baby<99},{k:'ice',l:'Fagyi a gyerekeknek',p:1990,ok:T.mood<5}];
 if(!T.spare)it.push({k:'tyre',l:'Új pótkerék',p:28000,ok:true});it.push({k:'scratch',l:'Kaparós sorsjegy',p:600,ok:true});if(P.pump&&!P.pump.worked)it.push({k:'work',l:'Besegítek a zöldségesnél',p:0,ok:true});return it;}
function updPump(){const pm=P.pump,T=G.trip,L=LEGS[G.leg];
 if(pm.step==='nozzle'){if(K.num===1||inRect(TAP,PUMP_BTN.b95)){pm.step='fill';pm.msg='';SFX.clunk();}
  else if(K.num===2||inRect(TAP,PUMP_BTN.bd)){pm.msg='Állj! Ez benzines autó, rossz pisztoly!';SFX.alarm();}
  else if(K.num===3||inRect(TAP,PUMP_BTN.cancel)){leavePump();}}
 else if(pm.step==='fill'){const pumping=(K.pump||(HOLD&&inRect(HOLD,PUMP_BTN.fill)))&&!pm.full;
  if(pumping){const add=Math.min(0.11,CAR.tank-T.fuel);T.fuel+=add;pm.liters+=add;if(Math.floor(pm.liters*2)!==Math.floor((pm.liters-add)*2))SFX.tick();if(CAR.tank-T.fuel<0.01){pm.full=true;SFX.clunk();pm.msg='KATT! Tele a tank.';}}
  pm.on=pumping;
  if(K.enterP&&!HOLD||inRect(TAP,PUMP_BTN.done)){if(pm.liters>0){const cost=Math.round(pm.liters*L.price);T.money-=cost;T.spentFuel+=cost;pm.cost=cost;SFX.cash();}pm.step='shop';pm.msg='';}}
 else if(pm.step==='shop'){const items=shopItems();for(let i=0;i<items.length;i++){if(K.num===i+1||inRect(TAP,[262,92+i*21,198,18])){const it=items[i];if(!it.ok){pm.msg='Erre most nincs szükség.';continue;}if(T.money<it.p){pm.msg='Nincs elég pénz!';continue;}
    T.money-=it.p;T.spentShop+=it.p;SFX.cash();if(it.k==='food')T.food=Math.min(100,T.food+60);if(it.k==='baby')T.baby=Math.min(100,T.baby+60);if(it.k==='ice'){T.mood=Math.min(5,T.mood+1);say('Fagyiii!','petra');}if(it.k==='tyre')T.spare=true;pm.msg='Megvetted: '+it.l;if(it.k==='scratch'){pm.msg='';startMini('scratch',{onEnd:r=>{pm.msg=r?'Nyeremény: '+fmt(r)+' Ft!':'Nem nyert.';}});}if(it.k==='work'){pm.worked=true;pm.msg='';startMini('sort',{onEnd:r=>{pm.msg='Kerestél '+fmt(r)+' Ft-ot!';}});}}}
  if(MG)return;if(K.enterP&&!TAP||inRect(TAP,[262,92+items.length*21+4,198,20]))leavePump();}}
function leavePump(){P.sub='drive';P.hide.apa=0;P.pump=null;P.lane=1;P.blink=60;say('Indulás!','apa');}
function drawPumpUI(g){const pm=P.pump,T=G.trip,L=LEGS[G.leg];frr(g,'rgba(12,15,24,0.9)',250,40,222,226,6);g.strokeStyle='#2e7d4f';g.lineWidth=1.5;rrect(g,250,40,222,226,6);g.stroke();
 text(g,'Benzinkút',262,58,'#7cd99c',1.4);text(g,'95: '+L.price+' Ft/l',462,60,'#ffffff',1,'right');
 const btn=(r,l,col,on)=>{frr(g,on?shade(col,1.3):col,r[0],r[1],r[2],r[3],4);text(g,l,r[0]+r[2]/2,r[1]+r[3]/2-3.5,'#ffffff',1,'center');};
 if(pm.step==='nozzle'){text(g,'Válassz töltőpisztolyt:',262,76,'#ffffff');btn(PUMP_BTN.b95,'1: Benzin 95','#2e8b57');btn(PUMP_BTN.bd,'2: Diesel','#2a2f36');btn(PUMP_BTN.cancel,'3: Mégse','#555c66');}
 else if(pm.step==='fill'){frr(g,'#0b1a12',262,74,198,62,3);text(g,'Liter',270,80,'#7cd99c');text(g,fmt(pm.liters,2),452,80,'#b7ffcf',2,'right');text(g,'Fizetendő',270,104,'#7cd99c');text(g,fmt(pm.liters*L.price)+' Ft',452,104,'#b7ffcf',2,'right');
  text(g,'Tank: '+fmt(T.fuel,1)+' / '+CAR.tank+' l',270,124,'#ffffff');R(g,'#2a2f3a',370,124,82,6);R(g,'#5bd06a',371,125,80*T.fuel/CAR.tank,4);
  btn(PUMP_BTN.fill,isTouch?'Tartsd: tankolás':'Space: tankolás','#2e8b57',pm.on);btn(PUMP_BTN.done,'Fizetés','#1d5fb8');
  text(g,isTouch?'Tartsd nyomva a gombot!':'Tartsd lenyomva a Space-t',361,196,'#9fb0c2',1,'center');}
 else{text(g,'Pénztár és bolt',262,74,'#ffffff');if(pm.cost)text(g,'Benzin: '+fmt(pm.liters,2)+' l = '+fmt(pm.cost)+' Ft',262,84,'#b7ffcf');
  const items=shopItems();items.forEach((it,i)=>{const r=[262,92+i*21,198,18];frr(g,it.ok?'#2a3446':'#1e232c',r[0],r[1],r[2],r[3],3);text(g,(i+1)+': '+it.l,r[0]+4,r[1]+2,it.ok?'#ffffff':'#7a8594');text(g,it.p?fmt(it.p)+' Ft':'pénzt kapsz',r[0]+r[2]-4,r[1]+10.5,it.p?'#ffd84a':'#7cff7c',1,'right');});
  const r=[262,92+items.length*21+4,198,20];frr(g,'#1d5fb8',r[0],r[1],r[2],r[3],4);text(g,'Enter: Indulás',r[0]+r[2]/2,r[1]+7,'#ffffff',1,'center');}
 text(g,'Pénz: '+fmt(T.money)+' Ft   Kaja: '+Math.round(T.food)+'%   Baba: '+Math.round(T.baby)+'%',361,246,'#cfd6df',1,'center');
 if(pm.msg)text(g,pm.msg,361,234,pm.msg.startsWith('Állj')||pm.msg.startsWith('Nincs')?'#ff8a8a':'#7cff7c',1,'center');}

/* ---------- kerékcsere ---------- */
function updFix(){const T=G.trip;P.fix++;P.haz=true;const f=P.fix;
 if(!T.spare){if(f===1)flash('Nincs pótkerék! Autómentő: 40 000 Ft (Enter / érintés)','#ff8a8a',99999);
  if(f>1&&K.enterP&&!P.tow){P.tow=f;T.money-=40000;T.spentShop+=40000;SFX.siren();G.msg=null;flash('Jön az autómentő...','#ffb347',200);}
  if(P.tow&&f-P.tow>200){P.flat=null;P.sub='drive';P.hide.apa=0;P.tow=0;P.haz=false;flash('Megjavították a kereket. Mehetünk!','#7cff7c');}return;}
 if(f===10)say('Kicserélem a kereket, maradjatok bent!','apa');
 if(f===110||f===180||f===250)noise(0.15,0.25,0,1800);
 if(f>=380){P.flat=null;P.sub='drive';P.hide.apa=0;P.haz=false;T.spare=false;say('Kész is! Mehetünk!','apa');flash('Kicserélve! Vegyél új pótkereket a következő kútnál.','#7cff7c',260);SFX.pick();}}
function fixPose(){const f=P.fix,k=P.flat,wx=PX+(k==='f'?WHEELS[1]:WHEELS[0]);let px=PX+60,mode='walk',tri=null,lift=0,noWheel=null,spareX=null;
 if(f<40){px=PX+60+(wx+14-PX-60)*f/40;}
 else if(f<100){const u=(f-40)/60;px=wx+14-(wx+14-(PX-40))*(u<0.5?u*2:2-u*2);tri=u>=0.5?PX-40:null;mode=u<0.5?'walk':'walk';if(u>=0.5)tri=PX-40;}
 else{px=wx+14;mode='work';tri=PX-40;lift=f<130?(f-100)/30*3:f<330?3:Math.max(0,3-(f-330)/20*3);if(f>=150&&f<230)noWheel=k;if(f>=150&&f<230)spareX=wx+26;if(f>=340){tri=f<360?PX-40:null;px=f<360?wx+14:PX+60;}}
 return {px:px,mode:mode,tri:tri,lift:lift,noWheel:noWheel,spareX:spareX};}

/* ---------- rajzolás: játék ---------- */
const [DK,dg]=mk(W,H,SC);
function darkness(g,L){let a=0;if(L.time==='night')a=0.62;else if(L.time==='dusk')a=0.26;else if(L.weather==='storm')a=0.3;else if(L.time==='sunset')a=0.05;
 if(L.time==='dusk'||L.time==='sunset')R(g,'rgba(255,130,60,0.1)',0,0,W,H);if(a<=0)return;
 dg.setTransform(SC,0,0,SC,0,0);dg.globalCompositeOperation='source-over';dg.clearRect(0,0,W,H);dg.fillStyle='rgba(8,12,38,'+a+')';dg.fillRect(0,0,W,H);dg.globalCompositeOperation='destination-out';
 for(const l of lights){if(l.cone){const gr=dg.createLinearGradient(l.x,0,l.x+180,0);gr.addColorStop(0,'rgba(0,0,0,0.95)');gr.addColorStop(1,'rgba(0,0,0,0)');dg.fillStyle=gr;dg.beginPath();dg.moveTo(l.x,l.y-2);dg.lineTo(l.x+180,l.y-26);dg.lineTo(l.x+180,l.g+10);dg.lineTo(l.x,l.y+3);dg.closePath();dg.fill();}
  else{dg.fillStyle=rg(dg,l.x,l.y,0,l.r,[[0,'rgba(0,0,0,0.9)'],[1,'rgba(0,0,0,0)']]);dg.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2);}}
 dg.globalCompositeOperation='source-over';g.drawImage(DK,0,0,W,H);}
function drawWeather(g,L,t){if(L.weather==='rain'||L.weather==='storm'){R(g,'rgba(40,60,90,0.12)',0,0,W,H);g.strokeStyle='rgba(190,215,240,0.7)';g.lineWidth=0.6;g.beginPath();for(const d of drops){g.moveTo(d.x,d.y);g.lineTo(d.x-1.4,d.y+5);}g.stroke();}
 else if(L.weather==='snow'){g.fillStyle='#ffffff';for(const d of drops){g.beginPath();g.arc(d.x,d.y,d.v>1.1?1.1:0.7,0,TAU);g.fill();}}
 else if(L.weather==='fog'){R(g,'rgba(225,230,236,0.22)',0,0,W,H);for(let i=0;i<6;i++){const x=((hsh(i)*W*2-t*(0.3+i*0.1)-P.dist*0.3)%(W+200)+W+200)%(W+200)-100;ell(g,'rgba(240,244,248,0.2)',x,150+hsh(i*7)*90,90,12);}}
 if(G.flash>0){if(G.flash>8){let x=G.bolt,y=0;g.strokeStyle='#ffffff';g.lineWidth=1.3;g.beginPath();g.moveTo(x,y);for(let k=0;k<9;k++){x+=rnd(-12,12);y+=14;g.lineTo(x,y);}g.stroke();}R(g,'rgba(255,255,255,'+(G.flash/18)+')',0,0,W,H);}}
function drawPlayer(g,t){const gy=P.y,body=gy-55.5+(P.yF+P.yR)/2,pitch=Math.atan2(P.yF-P.yR,65),fp=P.sub==='fix'?fixPose():null;
 g.fillStyle=rg(g,PX+57,gy,4,60,[[0,'rgba(0,0,0,0.38)'],[1,'rgba(0,0,0,0)']]);g.save();g.translate(PX+57,gy);g.scale(1,0.07);g.beginPath();g.arc(0,0,60,0,TAU);g.fill();g.restore();
 if(P.inv>0&&((t>>2)&1))g.globalAlpha=0.55;
 const blinkOn=((t>>4)&1)===1;
 drawCarSide(g,PX,body,gy-55.5,{t:t,ang:P.ang,pitch:pitch,wF:P.wF,wR:P.wR,hide:P.hide,door:P.door,brake:P.brake||P.sub!=='drive',blink:(P.blink>0||P.haz||P.flat||P.sub==='fix')&&blinkOn,
  lightsOn:P.lightsOn,fog:P.fog,flat:P.flat&&!(fp&&fp.noWheel===null&&P.fix>=230)?P.flat:null,noWheel:fp?fp.noWheel:null,jack:fp&&P.fix>=100&&P.fix<350?P.flat:null,lift:fp?fp.lift:0,
  flap:P.sub==='pump',wiping:['rain','storm','snow'].includes(LEGS[G.leg].weather),bounce:P.kmh>1},lights);
 g.globalAlpha=1;
 if(fp){if(fp.tri)triangle(g,fp.tri,gy+2);if(fp.spareX)wheel(g,fp.spareX,gy-10,0,P.fix<190);person(g,fp.px,gy+4,'apa',t,fp.mode);}
 if(P.sub==='pump'&&P.pump){const q=P.pump.q-P.dist+PX;person(g,PX-10,gy+4,'apa',t,'work');g.strokeStyle='#1b1f2a';g.lineWidth=1;g.beginPath();g.moveTo(q+13,ROADT-14);g.quadraticCurveTo((q+PX+13)/2,gy-6,PX+13.6,body+31);g.stroke();frr(g,'#2e8b57',PX+11.6,body+29.6,4,2.4,1);}
 if(P.ev&&EVDEF[P.ev.type]&&P.ev.stopT>0){const out=EVDEF[P.ev.type].out;let k=0;for(const w of out)if(w!=='atti')person(g,PX+40+k++*12,gy+5,w,t,'wave');}}
function drawBubble(g){if(!P.bub)return;const b=P.bub,txt=b.txt.toUpperCase(),w=textW(txt)+8,hx=WHO_X[b.who]||40;
 const ax=PX+hx,top=P.y-55.5-18;let bx=clamp(ax-w/2,2,W-w-2);frr(g,'#ffffff',bx,top,w,11,3);g.strokeStyle='#1b1f2a';g.lineWidth=0.6;rrect(g,bx,top,w,11,3);g.stroke();
 poly(g,'#ffffff',[[-3,0],[3,0],[0,5]],ax,top+10.5);text(g,txt,bx+4,top+2.4,'#1b1f2a',1,'left',null);}
function drawHUD(g){const L=LEGS[G.leg],T=G.trip,s=seg();frr(g,'rgba(10,13,22,0.72)',0,0,W,34,0);
 for(let i=0;i<5;i++)text(g,'♥',4+i*7,3,i<T.mood?'#ff4d6d':'#4a4f5c');
 text(g,LEGS[G.leg].from.split(',')[0]+' > '+L.to,W/2,3,'#ffd84a',1,'center');text(g,fmt(T.money)+' Ft',W-4,3,T.money<0?'#ff8a8a':'#b7ffcf',1,'right');
 const km=legKm(),pr=Math.min(1,P.dist/LEG.len);text(g,distStr(km)+' / '+fmt(L.km)+' km',4,13,'#ffffff');
 const x0=130,x1=350;frr(g,'#2a2f3a',x0,15,x1-x0,3,1.5);frr(g,'#4fc3f7',x0,15,(x1-x0)*pr,3,1.5);for(const st of LEG.stations)disc(g,'#5bd06a',x0+(x1-x0)*st/LEG.len,16.5,1.6);disc(g,'#ffd84a',x1,16.5,2);
 frr(g,CP.m,x0+(x1-x0)*pr-4,12,8,4,1.5);text(g,'Össz: '+fmt(T.km,1)+' km',W-4,13,'#cfd6df',1,'right');
 const over=P.kmh>s.limit+5;text(g,Math.round(P.kmh)+' km/h',4,24,over?'#ff6b6b':'#ffffff',1);disc(g,'#d32f2f',54,27,5.4);disc(g,'#ffffff',54,27,4);text(g,String(s.limit),54.3,25,'#111',s.limit>=100?0.4:0.5,'center',null);
 text(g,(P.gear||'N')+'.fok',63,24,'#9fb0c2');
 const fl=T.fuel/CAR.tank;text(g,fmt(T.fuel,1)+' l',100,24,T.fuel<7?'#ff6b6b':'#ffffff');frr(g,'#2a2f3a',136,25,26,5,2);frr(g,fl>0.25?'#5bd06a':fl>0.12?'#ffcf33':'#ff4d4d',136.6,25.6,24.8*fl,3.8,1.6);
 const avg=P.avgKm>0.5?P.avgL/P.avgKm*100:0;text(g,'Átl. '+(avg?fmt(avg,1):'-')+' l/100',168,24,'#cfd6df');text(g,'Most '+(P.kmh>3?fmt(P.instCons,1):'-'),262,24,'#9fb0c2');
 if(L.live)text(g,fmt(L.temp,0)+' fok',W/2,35,'#9fd8ff',1,'center');text(g,'Kaja '+Math.round(T.food)+'%',322,24,T.food<20?'#ff6b6b':'#ffffff');text(g,'Baba '+Math.round(T.baby)+'%',W-4,24,T.baby<20?'#ff6b6b':'#ffffff',1,'right');
 // ikonok
 let ix=4;const icon=(on,col,lbl)=>{if(!on)return;frr(g,'rgba(10,13,22,0.7)',ix,36,textW(lbl)+6,10,3);text(g,lbl,ix+3,37.5,col,1,'left',null);ix+=textW(lbl)+9;};
 icon(P.lightsOn,'#7fd1ff','Lámpa');icon(P.fog,'#9cff9c','Köd');icon(P.haz||P.flat,'#ffaa22','Vészvillogó');icon(!T.spare,'#ff8a8a','Nincs pótkerék');icon(P.flat,'#ff6b6b','Defekt');
 // jelzések
 let y=50;if(G.segInfo){text(g,G.segInfo.txt,W/2,y,'#ffffff',1,'center');y+=11;}
 if(G.msg){text(g,G.msg.txt,W/2,y,G.msg.col,1,'center');y+=11;}
 if(P.ev&&EVDEF[P.ev.type]){const d=EVDEF[P.ev.type];text(g,d.msg,W/2,y,'#ffb347',1,'center');const pr2=P.ev.stopT/d.stop;frr(g,'#2a2f3a',W/2-60,y+9,120,4,2);frr(g,P.ev.stopT?'#5bd06a':'#ff8a5a',W/2-60,y+9,120*(P.ev.stopT?pr2:P.ev.t/d.time),4,2);y+=16;}
 for(const st of LEG.stations){const d=st-P.dist;if(d>0&&d<900&&P.sub==='drive'){text(g,'Benzinkút '+distStr(d*LEG.kmPerPx)+' múlva - állj meg a szélső (felső) sávban a kútnál',W/2,y,'#7cd99c',1,'center');y+=11;break;}}
 if(P.flat&&P.sub==='drive')text(g,'Defekt! Állj meg a szélső (felső) sávban!',W/2,y,'#ff6b6b',1,'center');
 if(G.banner>0&&G.banner<230&&P.boarding<0){const a=Math.min(1,G.banner/30);g.globalAlpha=a;frr(g,'rgba(10,13,22,0.78)',70,92,340,48,6);text(g,L.from+' > '+L.to,W/2,100,'#ffd84a',1.4,'center');
  text(g,fmt(L.km)+' km  -  '+WNAME[L.weather]+TNAME[L.time]+'  -  benzin: '+L.price+' Ft/l',W/2,118,'#ffffff',1,'center');text(g,'Gáz: jobbra nyíl / GÁZ gomb',W/2,129,'#9fb0c2',1,'center');g.globalAlpha=1;}
 if(G.paused){R(g,'rgba(10,12,20,0.6)',0,0,W,H);text(g,'Szünet',W/2,110,'#ffffff',3,'center');text(g,'P / II: folytatás',W/2,140,'#cfd6df',1,'center');}}
function drawParts(g,world){for(const p of parts){if(!!p.world!==world)continue;const x=p.world?p.x-P.dist+PX:p.x,y=p.y;
 if(p.type==='puff'){disc(g,p.col,x,y,1+(1-p.life/p.max)*4);}else frr(g,p.col,x,y,2,2,1);}}
function drawPlay(g){const L=LEGS[G.leg],t=G.t;lights=[];const s=seg();
 g.save();if(G.shake>0)g.translate(rnd(-1.5,1.5),rnd(-1.5,1.5));
 const rough=P.kmh>10?(QAMP[s.q]*P.kmh/400):0;if(rough>0.05)g.translate(0,rnd(-rough,rough));
 drawSky(g,L,t);drawClouds(g,L,P.dist,t);drawFar(g,L,s,P.dist,lights);drawMid(g,L,LEG,P.dist,lights);
 if(L.weather==='fog')R(g,'rgba(222,228,234,0.55)',0,0,W,ROADT);
 if(G.leg===0&&P.dist<400){house(g,PX+14-P.dist,ROADT-8,'#f2e2b8','#b5452b',L.time==='night',lights,false,'12');roadSign(g,PX-66-P.dist,ROADT-4,'Táncsics Mihály utca','town');}
 drawNear(g,L,LEG,P.dist,lights,t);drawRoad(g,L,LEG,P.dist,t);
 for(const st of LEG.stations)drawStation(g,st-P.dist+PX,L,lights);
 const dsx=LEG.len+260-P.dist+PX;if(dsx<W+150&&dsx>-200){const txt=(G.leg===7?'Isten hozott itthon, Komárom!':'Üdvözöl: '+L.to).toUpperCase(),w=textW(txt)+16;line(g,'#6b4a2b',dsx+6,ROADT-8,dsx+6,ROADT-70,2.4);line(g,'#6b4a2b',dsx+w-6,ROADT-8,dsx+w-6,ROADT-70,2.4);frr(g,'#ffffff',dsx,ROADT-88,w,24,2);frr(g,'#2e7d4f',dsx+2,ROADT-86,w-4,20,2);text(g,txt,dsx+8,ROADT-79,'#ffffff',1,'left',null);}
 for(const l of LEG.lights)drawTrafficLight(g,l,P.dist,t);
 const list=ents.map(e=>({y:e.y,e:e}));list.push({y:P.y+0.01,e:null});list.sort((a,b)=>a.y-b.y);
 for(const it of list){const e=it.e;if(!e){drawPlayer(g,t);continue;}const ex=e.x-P.dist+PX;if(ex<-140||ex>W+20)continue;
  if(e.kind==='traffic'){drawTraffic(g,e,ex,lights,P.lightsOn,t);if(e.help){if((t>>4)&1){glow(g,ex+e.w-1,e.y-14,6,'rgba(255,170,30,0.9)');glow(g,ex+1,e.y-16,6,'rgba(255,170,30,0.9)');}
   if(e.help==='truck')for(let k=0;k<5;k++)frr(g,['#b07a42','#c8955a','#8a5a2b'][k%3],ex-30+k*9,e.y-(k%2?16:8),8,8,1);person(g,ex-12,e.y+4,'apa',t,'wave');triangle(g,ex-48,e.y+2);}}else if(e.kind==='animal')drawAnimal(g,e,ex,t);else drawObstacle(g,e,ex,t);}
 for(const w of P.walk)person(g,w.x,w.y,w.w,w.t+(w.out?0:0),w.out&&w.x>=w.tx?'wave':'walk');
 drawParts(g,true);drawWeather(g,L,t);darkness(g,L);drawBubble(g);g.restore();drawParts(g,false);drawHUD(g);if(P.sub==='pump')drawPumpUI(g);if(MG)drawMini(g);}

/* ---------- képernyők ---------- */
const VIEWS=['side','front','sideR','rear','top'],VNAMES=['Bal oldal','Elölnézet','Jobb oldal','Hátulnézet','Felülnézet'];
const TITLE_L={region:'hu',weather:'sun',time:'day'},TITLE_LEG={segs:[{type:'village',name:'Komárom',q:'good',x0:-1e9,x1:1e9,limit:50}]};
function drawView(g,v,t,ph){const o={t:t,ang:t*0.09,door:(v==='side'||v==='sideR')?Math.max(0,Math.min(1,(ph-0.35)*8,(0.8-ph)*8)):0,blink:((t>>4)&1)===1,brake:((t>>5)&3)===0,wipe:(Math.sin(t*0.08)+1)/2,lightsOn:true,bounce:true,
 wF:Math.sin(t*0.12)*0.6,wR:Math.sin(t*0.12-1)*0.6,pitch:Math.sin(t*0.06)*0.01};
 if(v==='side'||v==='sideR')drawCarSide(g,0,0,0,o,null);else if(v==='front')drawFront(g,20,0,o);else if(v==='rear')drawRear(g,20,0,o);else drawTop(g,2,0,o);}
function titleOpts(){const o=[{l:'Új utazás Komáromból',a:'new'}];if(G.save&&G.save.leg>0)o.push({l:'Folytatás ('+LEGS[G.save.leg].from.split(',')[0]+' > '+LEGS[G.save.leg].to+')',a:'cont'});
 o.push({l:'Autó színe: '+carColor,a:'color'});o.push({l:'Az autó adatai',a:'specs'});return o;}
function drawTitle(g){const t=G.t;drawSky(g,TITLE_L,t);drawClouds(g,TITLE_L,t*0.6,t);drawFar(g,TITLE_L,TITLE_LEG.segs[0],t*0.6,null);drawMid(g,TITLE_L,TITLE_LEG,t*0.6,null);drawNear(g,TITLE_L,TITLE_LEG,t*0.6,null,t);drawRoad(g,TITLE_L,TITLE_LEG,t*0.6,t);
 const per=220,vi=Math.floor(t/per)%VIEWS.length,ph=(t%per)/per,v=VIEWS[vi];let sx=1;if(ph<0.08)sx=ph/0.08;else if(ph>0.92)sx=(1-ph)/0.08;sx=Math.max(0.02,sx);
 const cx=W/2,gy=204,sc=1.8;g.fillStyle=rg(g,cx,gy,4,110,[[0,'rgba(0,0,0,0.4)'],[1,'rgba(0,0,0,0)']]);g.save();g.translate(cx,gy);g.scale(sx,0.07);g.beginPath();g.arc(0,0,110,0,TAU);g.fill();g.restore();
 g.save();g.translate(cx,gy-55.5*sc);g.scale(sc*sx*(v==='sideR'?-1:1),sc);g.translate(v==='top'?-55:-56,0);drawView(g,v,t,ph);g.restore();
 frr(g,'rgba(10,13,22,0.5)',0,0,W,62,0);text(g,'Családi Vakáció',W/2,14,'#ffd84a',3,'center','#7a3b12');text(g,'Komárom, Táncsics Mihály utca - indul a nagy nyaralás',W/2,44,'#ffffff',1,'center');
 frr(g,'rgba(10,13,22,0.6)',W/2-58,gy+2,116,11,3);text(g,'Nézet: '+VNAMES[vi],W/2,gy+4.5,'#ffffff',1,'center');
 const opts=titleOpts();frr(g,'rgba(10,13,22,0.7)',0,218,W,52,0);
 opts.forEach((s,i)=>text(g,(G.menu===i?'> ':'  ')+s.l+(G.menu===i?' <':'  '),W/2,226+i*10,G.menu===i?'#ffd84a':'#cfd6df',1,'center'));
 text(g,'v'+APP_VERSION,W-4,262,'#6f7d8c',1,'right');}
function drawSpecs(g){R(g,'#141a26',0,0,W,H);g.save();g.translate(250,40);g.scale(1.8,1.8);drawCarSide(g,0,0,0,{t:G.t,ang:G.t*0.05,lightsOn:true},null);g.restore();
 text(g,'Az autó adatai',20,16,'#ffd84a',2);const rows=[['Típus','7 üléses egyterű'],['Motor','1.8 16V benzin'],['Teljesítmény',CAR.hp+' LE'],['Nyomaték',CAR.torque+' Nm'],['Végsebesség',CAR.top+' km/h'],['0-100 km/h',fmt(CAR.acc100,1)+' s'],
  ['Fogyasztás városban',fmt(CAR.urban,1)+' l/100 km'],['Fogyasztás országúton',fmt(CAR.extra,1)+' l/100 km'],['Vegyes fogyasztás',fmt(CAR.comb,1)+' l/100 km'],['Tank',CAR.tank+' l'],['Saját tömeg',fmt(CAR.mass)+' kg'],['Hossz',fmt(CAR.len,2)+' m'],['Gumiméret',CAR.tyre],['Ülések',CAR.seats+' (3. sor: csomagok)']];
 rows.forEach((r,i)=>{text(g,r[0],20,44+i*14,'#9fb0c2');text(g,r[1],150,44+i*14,'#ffffff');});
 text(g,'Utasok: Apa, Anya, Anna (5), Petra (3), kis Atti (10 hónapos)',20,248,'#ffd84a');text(g,isTouch?'Érintsd meg: vissza':'Enter: vissza',W-10,258,'#6f7d8c',1,'right');}
function drawMap(g){const t=G.st,i=G.leg,L=LEGS[i];g.fillStyle=lg(g,0,0,0,H,[[0,'#3c80d8'],[1,'#2a64b8']]);g.fillRect(0,0,W,H);
 g.fillStyle=lg(g,0,20,0,250,[[0,'#9bd68a'],[1,'#7cbf66']]);g.beginPath();[[60,40],[200,22],[330,28],[470,40],[470,252],[340,252],[300,200],[292,236],[268,196],[240,188],[214,232],[120,230],[96,190],[112,150],[70,122],[84,84]].forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
 g.fillStyle='#b9c4d2';for(let k=0;k<10;k++){g.beginPath();g.moveTo(222+k*8,138);g.lineTo(226+k*8,128-(k%2)*3);g.lineTo(230+k*8,138);g.fill();}ell(g,'#5aa9e6',333,141,8,2);line(g,'#5aa9e6',300,100,350,108,1.4);
 text(g,'Útiterv',W/2,8,'#ffffff',2,'center');
 for(let k=0;k<CITY_XY.length-1;k++){if(k>i)break;const a=CITY_XY[k],b=CITY_XY[k+1],f=k<i?1:Math.min(1,t/90);g.strokeStyle=k<i?'#ffd84a':'#ffffff';g.lineWidth=1.4;g.setLineDash([3,3]);g.beginPath();g.moveTo(a[1],a[2]);g.lineTo(a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f);g.stroke();g.setLineDash([]);}
 CITY_XY.forEach((c,k)=>{if(k===8)return;disc(g,k<=i?'#ff4d4d':'#ffffff',c[1],c[2],2);text(g,c[0],c[1]+5,c[2]-3,'#10131c',1,'left',null);});
 const a=CITY_XY[i],b=CITY_XY[i+1],f=Math.min(1,t/90);g.save();g.translate(a[1]+(b[1]-a[1])*f-8,a[2]+(b[2]-a[2])*f-10);g.scale(0.15,0.15);drawCarSide(g,0,0,0,{t:0,ang:0},null);g.restore();
 frr(g,'rgba(10,13,22,0.8)',0,H-56,W,56,0);text(g,(i+1)+'. szakasz: '+L.from+' > '+L.to,W/2,H-50,'#ffd84a',1.2,'center');
 text(g,fmt(L.km)+' km  -  '+(L.live?'élő: '+L.to.split(' ')[0]+' most '+L.localTime+', '+fmt(L.temp,0)+' fok, ':'')+WNAME[L.weather]+TNAME[L.time]+'  -  benzin '+L.price+' Ft/l',W/2,H-36,'#ffffff',1,'center');
 const T=G.trip;text(g,'Tank: '+fmt(T.fuel,1)+' l   Pénz: '+fmt(T.money)+' Ft   Kaja: '+Math.round(T.food)+'%   Baba: '+Math.round(T.baby)+'%',W/2,H-25,'#cfd6df',1,'center');
 if(t>25&&((t>>4)&1))text(g,isTouch?'Érintsd meg: indulás!':'Enter: indulás!',W/2,H-12,'#9fb0c2',1,'center');}
function drawLandmark(g,i,x,y,w,h){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.translate(x,y);const night=i===5;
 g.fillStyle=lg(g,0,0,0,h,[[0,night?'#0e1440':'#6ab8ee'],[1,night?'#2a3a70':'#cdeeff']]);g.fillRect(0,0,w,h);if(night)for(let k=0;k<30;k++)R(g,'#fff',hsh(k)*w,hsh(k+5)*h*0.6,0.8,0.8);
 if(i===0||i===1){g.fillStyle='#6aa35a';g.beginPath();g.moveTo(0,110);g.quadraticCurveTo(60,80,156,96);g.lineTo(156,120);g.lineTo(0,120);g.fill();g.fillStyle=lg(g,0,115,0,h,[[0,'#4fa3e0'],[1,'#2a6db0']]);g.fillRect(0,115,w,h);
  poly(g,'#ffffff',[[70,142],[70,112],[90,142]]);frr(g,'#8a5a2b',62,142,34,4,2);glow(g,125,30,30,'rgba(255,240,180,0.7)');disc(g,'#fff3b0',125,30,10);if(i===1){frr(g,'#f2e6c8',8,72,50,30,1);g.fillStyle='#8a3a2a';g.beginPath();g.moveTo(4,72);g.lineTo(33,56);g.lineTo(62,72);g.fill();}}
 else if(i===2){g.fillStyle='#8fb07a';g.fillRect(0,150,w,h);g.strokeStyle='#c62a35';g.lineWidth=1.4;g.beginPath();g.arc(78,80,50,0,TAU);g.stroke();for(let k=0;k<16;k++){const a=k*Math.PI/8+G.t*0.01;line(g,'#c62a35',78,80,78+Math.cos(a)*50,80+Math.sin(a)*50,0.8);frr(g,'#c62a35',75+Math.cos(a)*50,78+Math.sin(a)*50,6,5,1.5);}
  line(g,'#5a5f69',78,80,50,150,2);line(g,'#5a5f69',78,80,106,150,2);disc(g,'#5a5f69',78,80,3);}
 else if(i===3){g.fillStyle=lg(g,0,30,0,160,[[0,'#8fa0c0'],[1,'#5f7092']]);g.beginPath();g.moveTo(-20,160);g.quadraticCurveTo(50,50,78,30);g.quadraticCurveTo(110,50,176,160);g.fill();g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(78,30);g.quadraticCurveTo(92,44,100,60);g.lineTo(88,56);g.lineTo(78,64);g.lineTo(66,56);g.lineTo(56,60);g.quadraticCurveTo(64,44,78,30);g.fill();R(g,'#eef3f7',0,150,w,h);house(g,90,160,'#9a6a3e','#5a3d22',false,null,true);pine(g,20,160,40,true);}
 else if(i===4){frr(g,'#e7c9a0',0,40,40,120,1);frr(g,'#d7a3a0',116,30,40,130,1);for(let k=0;k<3;k++){frr(g,'#5f6f7f',8+k*10,60,6,14,3);frr(g,'#5f6f7f',122+k*10,52,6,14,3);}g.fillStyle=lg(g,0,140,0,h,[[0,'#3a8fb8'],[1,'#21607f']]);g.fillRect(0,140,w,h);
  g.fillStyle='#151515';g.beginPath();g.moveTo(30,140);g.quadraticCurveTo(75,152,124,140);g.lineTo(116,146);g.quadraticCurveTo(75,152,34,146);g.closePath();g.fill();line(g,'#151515',97,146,99,118,1.2);person(g,92,146,'apa',0,'work');}
 else if(i===5){g.fillStyle='#1d2a3f';g.fillRect(0,160,w,h);g.fillStyle='#7a6a48';g.beginPath();g.moveTo(50,160);g.quadraticCurveTo(70,120,74,60);g.lineTo(78,20);g.lineTo(82,60);g.quadraticCurveTo(86,120,106,160);g.lineTo(96,160);g.quadraticCurveTo(78,130,60,160);g.closePath();g.fill();
  R(g,'#ffd77a',64,100,28,1.5);R(g,'#ffd77a',71,60,14,1.5);glow(g,78,90,40,'rgba(255,215,120,0.25)');}
 else if(i===6){g.fillStyle='#9c6bff';g.fillRect(0,120,w,h);for(let k=0;k<10;k++)poly(g,k%2?'#7a4fd8':'#b38cff',[[78,116],[k*18-8,190],[k*18+8,190]]);glow(g,30,50,30,'rgba(255,220,140,0.7)');disc(g,'#ffcf6b',30,50,12);house(g,90,120,'#f2e2b8','#c2552f',false,null,false);}
 else{g.fillStyle='#7cbf66';g.fillRect(0,150,w,h);house(g,50,160,'#f2e2b8','#b5452b',false,null,false,'12');roadSign(g,10,170,'Komárom','town');}
 g.restore();}
function drawPostcard(g){const L=LEGS[G.leg],T=G.trip;g.fillStyle=lg(g,0,0,0,H,[[0,'#24314d'],[1,'#141b2c']]);g.fillRect(0,0,W,H);
 for(let k=0;k<40;k++)frr(g,['#ff5a7a','#ffd54f','#4fc3f7','#81c784'][k%4],(hsh(k)*W+G.t*0.3*(k%3+1))%W,(hsh(k+40)*H+G.t*(0.4+hsh(k)*0.6))%H,3,3,1);
 frr(g,'#1b1f2a',58,26,366,220,4);frr(g,'#f5ecd7',60,28,362,216,4);frr(g,'#e8dcc0',64,32,354,208,3);frr(g,'#f5ecd7',66,34,350,204,3);
 drawLandmark(g,G.leg,74,42,156,188);R(g,'#c9b994',238,44,1,186);
 frr(g,'#c62a35',384,40,30,36,2);frr(g,'#f5ecd7',386,42,26,32,1);text(g,'2026',399,60,'#c62a35',1,'center',null);disc(g,'#c62a35',399,51,4);
 text(g,'Üdvözlet',246,46,'#c62a35',2);text(g,L.to,246,70,'#1b1f2a',L.to.length<=10?2:1,'left',null);
 const rows=['Megtett út: '+fmt(L.km)+' km','Összesen: '+fmt(T.km,0)+' km','Benzin: '+fmt(T.fuelUsed,1)+' l ('+(T.km>1?fmt(T.fuelUsed/T.km*100,1):'-')+' l/100)','Pénz: '+fmt(T.money)+' Ft','Szállás és bevásárlás: 18 000 Ft','Kaja és bébicsomag feltöltve!','Puszi: Apa, Anya, Anna,','Petra és kis Atti'];
 rows.forEach((r,k)=>{R(g,'#d9cba8',246,100+k*15,166,0.6);text(g,r,248,92+k*15,'#3a4a6a',1,'left',null);});
 if(G.st>40&&((G.t>>4)&1))text(g,isTouch?'Érintsd meg: tovább':'Enter: tovább',W/2,252,'#ffffff',1,'center');}
function drawOver(g){drawPlay(g);R(g,'rgba(10,13,22,0.78)',0,0,W,H);text(g,'Elfogyott a jókedv...',W/2,96,'#ff8a8a',2,'center');text(g,'A család pihen egyet a szálláson, aztán újra nekivág.',W/2,128,'#ffffff',1,'center');
 if(G.st>50&&((G.t>>4)&1))text(g,isTouch?'Érintsd meg: újra':'Enter: újrakezdés',W/2,156,'#ffd84a',1,'center');}
function drawWin(g){const t=G.t,T=G.trip;drawSky(g,LEGS[7],t);drawClouds(g,LEGS[7],t*0.4,t);drawFar(g,LEGS[7],TITLE_LEG.segs[0],t*0.4,null);drawRoad(g,LEGS[7],TITLE_LEG,0,t);
 house(g,150,ROADT-8,'#f2e2b8','#b5452b',false,null,false,'12');drawCarSide(g,W/2-30,232-55.5,232-55.5,{t:t,ang:0,door:1,hide:{apa:1,anya:1,anna:1,petra:1,atti:1}},null);
 ['apa','anya','anna','petra'].forEach((w,k)=>person(g,110+k*16,240,w,t,'wave'));
 for(let k=0;k<50;k++)frr(g,['#ff5a7a','#ffd54f','#4fc3f7','#81c784','#ba68c8'][k%5],hsh(k)*W+Math.sin(t*0.02+k)*20,(hsh(k+50)*H+t*(0.5+hsh(k)))%H,3,3,1);
 frr(g,'rgba(10,13,22,0.65)',40,20,400,130,6);text(g,'Hazaértünk Komáromba!',W/2,30,'#ffd84a',2,'center','#7a3b12');
 const r=['Megtett út: '+fmt(T.km,0)+' km','Elfogyott benzin: '+fmt(T.fuelUsed,1)+' l  (átlag '+(T.km>1?fmt(T.fuelUsed/T.km*100,1):'-')+' l/100 km)','Benzinre költve: '+fmt(T.spentFuel)+' Ft','Boltban, szálláson: '+fmt(T.spentShop)+' Ft','Bírságok: '+fmt(T.fines)+' Ft','Mellékesen keresett: '+fmt(T.earned||0)+' Ft','Maradt: '+fmt(T.money)+' Ft'];
 r.forEach((s,k)=>text(g,s,W/2,56+k*12,'#ffffff',1,'center'));if(G.st>60&&((t>>4)&1))text(g,isTouch?'Érintsd meg: főmenü':'Enter: főmenü',W/2,134,'#cfd6df',1,'center');}

/* ---------- fő frissítés ---------- */
function update(){G.t++;G.st++;updateMusic(G.paused||G.state!=='play'&&G.state!=='title'&&G.state!=='map');if(G.state!=='play')engine(0,0);
 if(G.state==='title'){const opts=titleOpts(),n=opts.length;if(G.menu>=n)G.menu=0;if(K.upP)G.menu=(G.menu+n-1)%n,SFX.click();if(K.dnP)G.menu=(G.menu+1)%n,SFX.click();
  if(TAP){const i=Math.floor((TAP.y-224)/10);if(i>=0&&i<n)G.menu=i;}
  if(K.enterP){SFX.click();const a=opts[G.menu].a;if(a==='color'){const ns=Object.keys(PALETTES);setColor(ns[(ns.indexOf(carColor)+1)%ns.length]);}
   else if(a==='specs'){G.state='specs';G.st=0;}
   else{if(a==='cont'){G.leg=G.save.leg;G.trip=G.save.trip;}else{G.leg=0;G.trip=newTrip();}G.state='map';G.st=0;}}}
 else if(G.state==='specs'){if(K.enterP&&G.st>10){G.state='title';SFX.click();}}
 else if(G.state==='map'){if(G.st===1)fetchWeather(G.leg);if(K.enterP&&G.st>25){SFX.click();startLeg(G.leg);}}
 else if(G.state==='play')updPlay();
 else if(G.state==='postcard'){for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.life--;}parts=parts.filter(p=>p.life>0);
  if(K.enterP&&G.st>40){SFX.click();G.leg++;if(G.leg>=LEGS.length){G.state='win';G.st=0;SFX.win();try{localStorage.removeItem('csaladi-vakacio-v2');}catch(e){}G.save=null;}else{save();G.save={leg:G.leg,trip:G.trip};G.state='map';G.st=0;}}}
 else if(G.state==='over'){if(K.enterP&&G.st>50){SFX.click();G.trip.mood=3;startLeg(G.leg);}}
 else if(G.state==='win'){if(K.enterP&&G.st>60){SFX.click();G.state='title';G.menu=0;}}
 K.upP=K.dnP=K.honkP=K.enterP=K.pauseP=K.lightP=K.fogP=K.hazP=false;K.num=0;TAP=null;}
function render(){ctx.setTransform(SC,0,0,SC,0,0);ctx.imageSmoothingEnabled=true;
 if(G.state==='title')drawTitle(ctx);else if(G.state==='specs')drawSpecs(ctx);else if(G.state==='map')drawMap(ctx);else if(G.state==='play')drawPlay(ctx);
 else if(G.state==='postcard')drawPostcard(ctx);else if(G.state==='over')drawOver(ctx);else if(G.state==='win')drawWin(ctx);
 if(typeof appTick==='function')appTick();}
let last=performance.now(),acc=0;const STEP=1000/60;
function frame(now){acc+=Math.min(200,now-last);last=now;while(acc>=STEP){update();acc-=STEP;}render();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
