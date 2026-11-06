'use strict';
/* =========================================================
   JÁTÉKMENET – vezetés, futómű, fogyasztás, készletek, események,
   tankolás, kerékcsere, képernyők
   ========================================================= */
const G={state:'title',leg:0,t:0,st:0,menu:0,paused:false,shake:0,flash:0,thunder:0,bolt:0,banner:0,save:null,trip:null,msg:null};
let P=null,LEG=null,ents=[],parts=[],drops=[],lights=[];
const CATS={fuel:['Tankolás','#ffcf33'],food:['Élelmiszer, ital','#5bd06a'],baby:['Baba','#7fd1ff'],fun:['Gyerekek, szórakozás','#ff9fc4'],road:['Matrica, útdíj','#9fb0ff'],
 lodging:['Szállás','#c79bff'],service:['Autó, segélyszolgálat','#ffb347'],fine:['Bírság','#ff6b6b'],lottery:['Sorsjegy','#ffd84a'],other:['Egyéb','#cfd6df'],income:['Bevétel','#7cff7c'],start:['Kezdő keret','#ffffff']};
function book(amt,cat,label){const T=G.trip;amt=Math.round(amt);if(!amt)return;T.money=Math.round(T.money+amt);T.log=T.log||[];
 const d=new Date(),pad=n=>String(n).padStart(2,'0');if(T.money<0&&T.money-amt>=0)setTimeout(()=>flash('Elfogyott a pénz: mínuszba mentél (bankkártya-hitel).','#ff8a8a',280),400);G.lastTx={a:amt,t:0};T.log.push({a:amt,c:cat,l:label,b:T.money,km:Math.round(T.km*10)/10,leg:G.leg,d:d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate())+'. '+pad(d.getHours())+':'+pad(d.getMinutes())});
 if(amt<0){if(cat==='fuel')T.spentFuel+=-amt;else if(cat==='fine')T.fines+=-amt;else T.spentShop+=-amt;}else if(cat!=='start')T.earned=(T.earned||0)+amt;
 if(T.log.length>500)T.log.splice(1,T.log.length-500);}
function fixLog(T){T.money=Math.round(T.money);if(!T.log||!T.log.length){T.log=[{a:500000,c:'start',l:'Kezdő keret',b:500000,km:0,leg:0,d:''}];
 const d=T.money-500000;if(d)T.log.push({a:d,c:'other',l:'Korábbi mentés összesítve (régi verzió)',b:T.money,km:Math.round(T.km*10)/10,leg:T.leg||0,d:''});}return T;}
function ledgerTotals(T){const o={};let sum=0;for(const e of T.log||[]){sum+=e.a;if(e.c!=='start')o[e.c]=(o[e.c]||0)+e.a;}return {cats:o,sum:sum};}
function newTrip(){return {log:[{a:500000,c:'start',l:'Kezdő keret',b:500000,km:0,leg:0,d:''}],km:0,fuel:38,fuelUsed:0,money:500000,vig:{},noVig:{},earned:0,food:85,baby:90,spare:true,mood:5,hp:100,airbag:0,spentFuel:0,spentShop:0,fines:0,photos:0};}
function loadSave(){try{return JSON.parse(localStorage.getItem('csaladi-vakacio-v2')||'null');}catch(e){return null;}}
function save(dist){try{localStorage.setItem('csaladi-vakacio-v2',JSON.stringify({leg:G.leg,trip:G.trip,dist:dist||0,ts:G.ts}));G.save=loadSave();}catch(e){}}
G.save=loadSave();G.ts=1;try{G.ts=+localStorage.getItem('csaladi-vakacio-ts')||1;}catch(e){}
const TS_OPTS=[[1,'Valós idő (1x)'],[5,'Gyorsított (5x)'],[20,'Turbó (20x)']];
const WHO=['apa','anya','anna','petra','atti'],WHO_X={apa:68,anya:63,anna:42,petra:33,atti:27};
function say(txt,who){P.bub={txt:txt,who:who||'anna',t:170};}
function flash(msg,col,dur){G.msg={txt:msg,col:col||'#ffd84a',t:dur||200};}
function seg(){return segAtIn(LEG.segs,P.dist+PX+40);}
function legKm(){return Math.min(LEGS[G.leg].km,P.dist*LEG.kmPerPx);}
function distStr(km){return km<1?fmt(km*1000)+' m':fmt(km,1)+' km';}

/* ---------- indulás ---------- */
function startLeg(i,resume){G.leg=i;GPS_HD=null;LEG=buildLeg(i,G.ts);const L=LEGS[i];const dark=L.time!=='day'||['rain','storm','fog','snow'].includes(L.weather);
 P={dist:resume||0,kmh:0,lane:i===0&&!resume?0:1,y:LANE[i===0&&!resume?0:1],ang:0,blink:0,inv:0,haz:false,lightMode:dark?2:1,fogF:['fog','snow'].includes(L.weather),fogR:L.weather==='fog',rev:false,doorsOpen:false,saveT:0,
  yF:0,vF:0,yR:0,vR:0,wF:0,wR:0,flat:null,sub:'drive',fix:0,pump:null,ev:null,evCD:1400,chat:300,bub:null,arriving:false,arriveT:0,door:0,hide:{},walk:[],stopT:0,
  boarding:i===0&&!resume?0:-1,instCons:0,avgKm:0,avgL:0,lastSeg:null,hungerT:0,brake:false,gasF:0,engineOff:false};
 if(i===0&&!resume){P.hide={apa:1,anya:1,anna:1,petra:1,atti:1};P.door=1;
  P.walk=[{w:'apa',x:PX+30,y:ROADT+6,tx:PX+60,t:0},{w:'anya',x:PX+20,y:ROADT+4,tx:PX+52,t:0},{w:'anna',x:PX+8,y:ROADT+8,tx:PX+40,t:0},{w:'petra',x:PX-2,y:ROADT+7,tx:PX+32,t:0}];}
 ents=[];parts=[];G.state='play';G.banner=240;G.paused=false;G.flash=0;G.msg=null;nextSpawn=P.dist+500;if(resume)G.banner=200;
 drops=[];if(['rain','storm','snow'].includes(L.weather)){const n=L.weather==='storm'?190:L.weather==='rain'?130:110;for(let k=0;k<n;k++)drops.push({x:rnd(0,W+80),y:rnd(-H,H),v:L.weather==='snow'?rnd(0.6,1.4):rnd(6,9),ph:rnd(0,7)});}}
let nextSpawn=0;

/* ---------- út profil a futóműhöz ---------- */
function vnoise(x){const i=Math.floor(x),f=x-i,a=hsh(i*7+3),b=hsh(i*7+10);const u=f*f*(3-2*f);return a+(b-a)*u-0.5;}
const QAMP={good:0.12,medium:0.55,bad:1.35,cobble:0.5};
function roadH(x){const s=segAtIn(LEG.segs,x),A=QAMP[s.q];let h=vnoise(x/14)*A*1.4+vnoise(x/5)*A*0.5;if(s.q==='cobble')h+=Math.sin(x*1.4)*0.32;return h;}

/* ---------- forgalom és akadályok ---------- */
function spawnAt(x){const s=segAtIn(LEG.segs,x),L=LEGS[G.leg],r=Math.random(),lane=(Math.random()*3)|0;
 for(const p of LEG.pois)if(p.type!=='veda'&&Math.abs(x-p.x-60)<320)return;
 if(x>LEG.len-400)return;
 const trafP=s.type==='motorway'?0.55:s.type==='town'?0.35:0.3;
 if(r<trafP){if(ents.some(e=>e.kind==='traffic'&&e.lane===lane&&x<e.x+e.w+180&&x+420>e.x))return;
  const types=s.type==='motorway'?['hatch','truck','van','hatch','bus','camper','moto','truck']:s.type==='town'?['hatch','van','bus','hatch','moto']:s.type==='village'?['tractor','hatch','van','moto']:['hatch','van','truck','tractor','moto'];
  const tp=pick(types),lim=s.limit,kmh=tp==='tractor'?25:tp==='truck'?Math.min(85,lim*0.85):tp==='bus'?Math.min(100,lim*0.85):tp==='moto'?lim*rnd(0.9,1.1):lim*rnd(0.72,0.95);
  ents.push({kind:'traffic',tp:tp,x:x,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW[tp],h:TH[tp],kmh:kmh,base:kmh,col:pick(TCOLS)});return;}
 const holeP=s.q==='bad'?0.75:s.q==='medium'?0.35:s.q==='cobble'?0.2:0.06;
 if(Math.random()<holeP){const wet=L.weather==='rain'||L.weather==='storm';ents.push({kind:wet&&Math.random()<0.4?'puddle':'hole',x:x,lane:lane,y:LANE[lane],w:24});return;}
 const dark=L.time==='night'||L.time==='dusk';const wp=s.type==='country'?(dark?0.3:0.17):s.type==='village'?0.14:s.type==='motorway'&&dark?0.025:0;
 if(Math.random()<wp){let tp;if(s.type==='village'&&Math.random()<0.6)tp=pick(['sheep','cow','sheep']);else tp=L.region==='alps'?pick(['deer','deer','fox','hare']):pick(['deer','boar','fox','hare','deer','hare']);
  const fromBottom=Math.random()<0.4&&tp!=='cow';const sp={cow:0.28,sheep:0.36,deer:0.55,boar:0.42,fox:0.6,hare:0.75}[tp];
  ents.push({kind:'animal',tp:tp,x:x+120,y:fromBottom?ROADB+8:ROADT+2,vy:fromBottom?-sp:sp,w:{cow:32,boar:24,deer:24,sheep:22,fox:18,hare:12}[tp],step:0,wild:['deer','boar','fox','hare'].includes(tp),dir:fromBottom?-1:1});}}

function drawObstacle(g,e,sx,t){const gy=e.y;let x=sx,y=gy;if(e.fly){x+=e.fx;y+=e.fz;}
 if(e.kind==='cone'){ell(g,'rgba(0,0,0,0.25)',x+7,gy,7,1.8);frr(g,'#e8661c',x,y-2,14,2,0.8);g.fillStyle=lg(g,x,0,x+14,0,[[0,'#ff9a4a'],[1,'#d8551a']]);g.beginPath();g.moveTo(x+3,y-2);g.lineTo(x+6.4,y-15);g.quadraticCurveTo(x+7,y-16,x+7.6,y-15);g.lineTo(x+11,y-2);g.closePath();g.fill();frr(g,'#fff',x+4.4,y-8,5.2,2,0.6);frr(g,'#fff',x+5.4,y-12,3.2,1.2,0.5);}
 else if(e.kind==='hole'){ell(g,'#2a2c31',x+12,gy,12,3);ell(g,'#141519',x+12,gy+0.6,9,2);ell(g,'rgba(255,255,255,0.08)',x+12,gy-1.6,10,0.8);}
 else if(e.kind==='puddle'){ell(g,'#4f7fae',x+12,gy,13,3);ell(g,'rgba(200,225,250,0.6)',x+9,gy-1,5,0.8);}
 else if(e.kind==='sign'){line(g,'#7d858d',x+6,gy,x+6,gy-16,1.2);g.fillStyle='#ffcc00';g.beginPath();g.moveTo(x+6,gy-30);g.lineTo(x+14,gy-17);g.lineTo(x-2,gy-17);g.closePath();g.fill();g.strokeStyle='#d32f2f';g.lineWidth=1.2;g.stroke();text(g,'!',x+4.6,gy-26,'#111',0.7,'left',null);}}
function drawAnimal(g,e,sx,t){const gy=e.y,x=sx,st=Math.sin((e.step||0)*0.25)*1.4,night=LEGS[G.leg].time==='night'||LEGS[G.leg].time==='dusk';
 const eye=(ex,ey)=>{disc(g,night?'#fff8a8':'#1a1a1a',ex,ey,0.6);if(night&&P.lightMode>=2)glow(g,ex,ey,4,'rgba(255,250,170,0.9)');};
 if(e.tp==='boar'){ell(g,'rgba(0,0,0,0.25)',x+12,gy,13,2);g.fillStyle='#4a3b30';g.beginPath();g.ellipse(x+11,gy-9,11,6.5,0,0,TAU);g.fill();R(g,'#3a2d24',x+3,gy-15,14,2.4);
  for(const lx of [4,8,15,19])line(g,'#2e241d',x+lx,gy-5,x+lx+(lx<12?st:-st),gy,1.5);g.fillStyle='#4a3b30';g.beginPath();g.moveTo(x+19,gy-14);g.lineTo(x+27,gy-8);g.lineTo(x+26,gy-5);g.lineTo(x+18,gy-6);g.closePath();g.fill();
  frr(g,'#6b5446',x+25.4,gy-8,2.4,3,1);line(g,'#f2ede0',x+24,gy-6,x+25.6,gy-8.6,0.7);line(g,'#2e241d',x+19.5,gy-14,x+19,gy-17,1);eye(x+22,gy-11);return;}
 if(e.tp==='fox'){ell(g,'rgba(0,0,0,0.2)',x+9,gy,10,1.5);frr(g,'#d9692a',x+3,gy-10,13,5.4,2.6);for(const lx of [5,8,12,15])line(g,'#2a2018',x+lx,gy-5,x+lx+(lx<10?st:-st),gy,1);
  g.strokeStyle='#d9692a';g.lineWidth=3.2;g.lineCap='round';g.beginPath();g.moveTo(x+3,gy-8);g.quadraticCurveTo(x-4,gy-9,x-6,gy-4);g.stroke();disc(g,'#ffffff',x-6,gy-4,1.4);
  g.fillStyle='#d9692a';g.beginPath();g.moveTo(x+14,gy-11);g.lineTo(x+21,gy-8.5);g.lineTo(x+15,gy-6);g.closePath();g.fill();R(g,'#f6efe4',x+15,gy-8,4,1.6);
  g.fillStyle='#b84f1c';g.beginPath();g.moveTo(x+14,gy-11);g.lineTo(x+15,gy-15);g.lineTo(x+17,gy-11);g.fill();eye(x+17.5,gy-9.6);disc(g,'#1a1a1a',x+21,gy-8.5,0.6);return;}
 if(e.tp==='hare'){const hop=Math.abs(Math.sin((e.step||0)*0.3))*3;ell(g,'rgba(0,0,0,0.2)',x+6,gy,6,1.2);g.fillStyle='#8c7458';g.beginPath();g.ellipse(x+6,gy-4.5-hop,5.4,3.6,0,0,TAU);g.fill();
  disc(g,'#8c7458',x+11,gy-7-hop,2.4);disc(g,'#f2ede0',x+1,gy-5-hop,1.2);g.fillStyle='#7a6248';g.beginPath();g.ellipse(x+10.4,gy-12-hop,0.9,3.6,-0.2,0,TAU);g.fill();g.beginPath();g.ellipse(x+12,gy-12-hop,0.9,3.4,0.15,0,TAU);g.fill();eye(x+12,gy-7.6-hop);return;}
 if(e.tp==='sheep'){ell(g,'rgba(0,0,0,0.22)',x+9,gy,9,1.8);line(g,'#2a2a2a',x+4,gy-5,x+4+st,gy,1.6);line(g,'#2a2a2a',x+13,gy-5,x+13-st,gy,1.6);disc(g,'#f2f2ee',x+8,gy-10,6);disc(g,'#f2f2ee',x+3.6,gy-9,4);disc(g,'#f2f2ee',x+12.4,gy-9,4);frr(g,'#2a2a2a',x+14,gy-14.6,5.4,5,2);disc(g,'#fff',x+17,gy-13,0.5);}
 else if(e.tp==='cow'){ell(g,'rgba(0,0,0,0.22)',x+15,gy,15,2.6);frr(g,'#f4f1ea',x+2,gy-20,25,12,4);disc(g,'#2a2a2a',x+9,gy-16,3);disc(g,'#2a2a2a',x+20,gy-12,2.6);
  for(const lx of [4,9,19,24])line(g,'#e8e3d6',x+lx,gy-9,x+lx+(lx<12?st:-st),gy,2);frr(g,'#f4f1ea',x+25,gy-25,8,8,2.5);frr(g,'#f3a7b0',x+29,gy-20,4.4,3.4,1.5);disc(g,'#2a2a2a',x+28,gy-22.6,0.5);}
 else{ell(g,'rgba(0,0,0,0.22)',x+12,gy,12,2);frr(g,'#9a6a3c',x+2,gy-17,20,8,4);for(const lx of [4,8,16,20])line(g,'#7a5230',x+lx,gy-10,x+lx+(lx<12?st:-st),gy,1.3);
  line(g,'#9a6a3c',x+19,gy-14,x+23,gy-22,3);frr(g,'#9a6a3c',x+21,gy-25,6,4.4,2);disc(g,'#ffffff',x+3,gy-14,1.4);
  line(g,'#5a3d22',x+22,gy-25,x+20,gy-31,0.7);line(g,'#5a3d22',x+24,gy-25,x+26,gy-31,0.7);
  eye(x+25,gy-23.6);}}
function triangle(g,x,gy){g.save();g.translate(x,gy);g.scale(1.4,1.4);g.translate(-x,-gy);triangle0(g,x,gy);g.restore();}
function triangle0(g,x,gy){line(g,'#555',x,gy,x+2,gy-2,0.6);g.strokeStyle='#e53935';g.lineWidth=1.3;g.beginPath();g.moveTo(x-4,gy-1);g.lineTo(x+4,gy-1);g.lineTo(x,gy-8);g.closePath();g.stroke();}

/* ---------- események ---------- */
const EVDEF={
 baby:{msg:'Kis Atti sír, éhes! Állj meg a szélső sávban!',who:'anya',stop:180,time:1700,out:['anya','atti']},
 sick:{msg:'Petrának rossz! Gyorsan állj meg a szélső sávban!',who:'anya',stop:240,time:1000,out:['petra','anya']},
 pee:{msg:'Annának pisilni kell! Állj meg a szélső sávban vagy a kútnál!',who:'anna',stop:150,time:2000,out:['anna','apa']}};
function startEvent(){const s=seg(),L=LEGS[G.leg],r=Math.random();let type;
 if(r<0.18)type='baby';else if(r<0.29)type='sick';else if(r<0.43)type='pee';else if(r<0.56)type='police';else if(r<0.66)type='help';else if(r<0.74)type='crash';else if(r<0.8&&s.type==='motorway')type='jam';else if(r<0.9)type='works';else type='baby';
 if(type==='baby'||type==='sick'||type==='pee'){const d=EVDEF[type];P.ev={type:type,t:d.time,stopT:0};say(type==='baby'?'Atti nagyon sír!':type==='sick'?'Anya, rosszul vagyok...':'Apa, pisilni kell!',d.who);if(type==='baby')SFX.cry();return;}
 if(type==='police'){const x=P.dist+W+60;ents.push({kind:'traffic',tp:'police',x:x,lane:0,y:LANE[0]-3,ty:LANE[0]-3,w:TW.police,h:TH.police,kmh:0,base:0,col:'#ffffff',parked:true,radar:true});P.ev={type:'police',t:99999,x:x};return;}
 if(type==='jam'){const x=P.dist+W+80;for(let k=0;k<12;k++){const tp=pick(['hatch','van','truck','hatch']),lane=k%3;ents.push({kind:'traffic',tp:tp,x:x+Math.floor(k/3)*(TW[tp]+30)+lane*12,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW[tp],h:TH[tp],kmh:12,base:12,col:pick(TCOLS),jam:true});}
  P.ev={type:'jam',t:900};flash('Dugó az autópályán! Lassíts!','#ffb347');say('Jaj, dugó...','apa');return;}
 if(type==='help'){const kind=Math.random()<0.5?'jump':'truck',x=P.dist+W+80,tp=kind==='jump'?pick(['hatch','van']):'truck';ents.push({kind:'traffic',tp:tp,x:x,lane:0,y:LANE[0]-3,ty:LANE[0]-3,w:TW[tp],h:TH[tp],kmh:0,base:0,col:pick(TCOLS),parked:true,help:kind});
  P.ev={type:'help',kind:kind,x:x,t:99999};flash(kind==='jump'?'Lerobbant autó az út szélén! Állj meg mögötte a szélső sávban és segíts!':'Egy kamionosnak leesett a rakománya! Állj meg mögötte a szélső sávban!','#7fd1ff',300);return;}
 if(type==='crash'){const x=P.dist+W+120,lane=Math.random()<0.5?0:1;ents.push({kind:'traffic',tp:'hatch',x:x+130,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW.hatch,h:TH.hatch,kmh:0,base:0,col:pick(TCOLS),parked:true,wreck:1});
  ents.push({kind:'traffic',tp:'van',x:x+250,lane:lane,y:LANE[lane]+1,ty:LANE[lane]+1,w:TW.van,h:TH.van,kmh:0,base:0,col:pick(TCOLS),parked:true,wreck:2});
  ents.push({kind:'traffic',tp:'police',x:x+20,lane:lane,y:LANE[lane]-1,ty:LANE[lane]-1,w:TW.police,h:TH.police,kmh:0,base:0,col:'#ffffff',parked:true});
  ents.push({kind:'traffic',tp:'ambulance',x:x+400,lane:lane,y:LANE[lane],ty:LANE[lane],w:TW.ambulance,h:TH.ambulance,kmh:0,base:0,col:'#ffffff',parked:true});
  for(let k=0;k<5;k++)ents.push({kind:'cone',x:x-90+k*22,lane:lane,y:LANE[lane]+(k%2)*2,w:14});
  P.ev={type:'works',t:1000};flash('Baleset az úton! Lassíts és kerüld ki a lezárt sávot!','#ff8a5a',300);say('Jaj, baleset történt...','anya');SFX.siren();return;}
 if(type==='works'){const x=P.dist+W+60;ents.push({kind:'sign',x:x-60,lane:-1,y:ROADT+6,w:0});for(let k=0;k<10;k++)for(const ln of [0,1])ents.push({kind:'cone',x:x+k*26,lane:ln,y:LANE[ln],w:14});P.ev={type:'works',t:900};flash('Útépítés! Két sáv lezárva, menj az alsó sávba!','#ffb347');}}
function evFail(){const d=EVDEF[P.ev.type];G.trip.mood--;flash(P.ev.type==='baby'?'Atti egész úton sírt... (-1 kedv)':P.ev.type==='sick'?'Petra rosszul lett az autóban... (-1 kedv)':'Nem bírta ki... (-1 kedv)','#ff8a8a');P.ev=null;checkMood();}
function evDone(){const ty=P.ev.type;if(ty==='baby'){G.trip.baby=Math.max(0,G.trip.baby-20);flash(G.trip.baby>0?'Atti jóllakott és elaludt. Csend van!':'Elfogyott a bébiétel! Vegyél a kútnál!','#7cff7c');}
 else if(ty==='sick')flash('Petra jobban van, mehetünk tovább.','#7cff7c');else flash('Mindenki megkönnyebbült!','#7cff7c');
 for(const w of EVDEF[ty].out)P.hide[w]=0;P.ev=null;G.trip.photos++;}
// kíméletes kedvrendszer: nincs újrakezdés; 0 szívnél a család nyűgös lesz, és pihenőt kér
function checkMood(){const T=G.trip;if(T.mood<=0){T.mood=0;if(!P.cranky){P.cranky=true;P.crankyT=0;flash('A család nyűgös! Pihenő, étterem vagy bolt segít.','#ff8a5a',360);say('Elég volt, álljunk meg egy kicsit!','anya');if(!P.hide.anna)scream(1000,0.6);vib([40,30,40]);}}
 else if(T.mood===1&&!P.warn1){P.warn1=true;flash('Már csak 1 szív! Egy fagyi vagy pihenő jót tenne.','#ffcf33',280);}else if(T.mood>1)P.warn1=false;}
function cheerUp(min,msg){const T=G.trip;const was=P.cranky;P.cranky=false;T.mood=Math.min(5,Math.max(T.mood,min));if(was&&msg)flash(msg,'#7cff7c',240);}
function startRest(p){P.sub='rest';P.rest={t:0,x:p.x};P.hide={apa:1,anya:1,anna:1,petra:1,atti:1};P.door=1;SFX.click();vib(15);say('Pihenő! Mindenki ki, nyújtózunk!','apa');}
function updRest(){const r=P.rest;r.t++;if(r.t===40)P.door=0;
 if((r.t>150&&(K.enterP||TAPD))||r.t>=480){const T=G.trip;const was=P.cranky;cheerUp(3);T.mood=Math.min(5,T.mood+1);
  if(P.ev&&['baby','sick','pee'].includes(P.ev.type))evDone();
  P.hide={};P.door=0;P.sub='drive';P.rest=null;P.stopCD=P.dist;T.photos++;T.driveS=0;flash(was?'Kipihentük magunkat! Kedv: '+T.mood+'/5':'Jólesett a pihenő! (+1 kedv)','#7cff7c',220);SFX.clunk();}}
function drawRest(g,t){const r=P.rest,sx=r.x-P.dist+PX,b=ROADT-6,k=Math.min(1,r.t/60);
 const fam=[['apa',sx+118,'wave'],['anya',sx+130,'wave'],['anna',sx+96,(t>>4)&1?'walk':'wave'],['petra',sx+108,'walk']];
 for(const [w,x,m] of fam)person(g,lerp(PX+60,x,k),b+(w==='anna'&&r.t>90?-Math.abs(Math.sin(t*0.08))*6:0),w,t,m);
}

/* ---------- ütközés ---------- */
function setCruise(v){P.cruise=v;SFX.click();vib(12);flash(v?'Tempomat: '+v+' km/h':'Tempomat kikapcsolva','#9fd8ff',100);}
function yieldAhead(why){let n=0;for(const e of ents){if(e.kind!=='traffic'||e.parked||e.jam)continue;const d=e.x-(P.dist+112);if(e.lane===P.lane&&d>-10&&d<320){const opts=[e.lane-1,e.lane+1].filter(l=>l>=0&&l<3&&!ents.some(o=>o!==e&&o.kind==='traffic'&&o.lane===l&&Math.abs(o.x-e.x)<150));if(opts.length){e.lane=pick(opts);e.ty=LANE[e.lane];n++;}}}
 if(n)flash(why==='fény'?'Reflektorral jeleztél: az előtted haladó lehúzódik.':'Dudáltál: az előtted haladó lehúzódik.','#9fd8ff',90);}
/* ---- autó sérülése (HP), légzsák, totálkár, tréler, szerviz ---- */
const hpOf=T=>T.hp===undefined?100:T.hp;
function damage(d,why){const T=G.trip;d=Math.round(d);if(d<=0||P.sub!=='drive')return;const before=hpOf(T);T.hp=Math.max(0,before-d);
 if(d>=22&&!T.airbag&&P.kmh+d>40){T.airbag=1;P.abT=0;SFX.pop();vib([100,50,150]);say('A légzsák kinyílt! Mindenki jól van?','anya');}
 if(T.hp<=0){startTotal();return;}
 flash('Sérült az autó: '+T.hp+'% '+(T.hp<30?'- alig megy, szervizbe kell!':T.hp<50?'- füstöl a motor!':''),T.hp<30?'#ff6b6b':'#ffb347',220);}
function hpMax(){const h=hpOf(G.trip);return h<15?50:h<30?80:h<50?120:CAR.top;}
function startTotal(){const T=G.trip;P.inv=0;P.sub='total';P.kmh=0;P.cruise=0;P.auto=null;P.haz=true;P.rev=false;P.tt=0;P.tw={x:W+60,dx:0,tilt:0};P.carOff={x:0,y:0};
 ents=ents.filter(e=>Math.abs(e.x-P.dist)>W*1.5);SFX.hit();G.shake=14;vib([200,80,200]);say('Totálkár... Szerencsére mindenki jól van.','apa');
 const tow=35000+1500*10;book(-tow,'service','Tréler: totálkáros autó elszállítása a szervizbe (10 km)');flash('TOTÁLKÁR! Jön a tréler: '+fmt(tow)+' Ft','#ff6b6b',300);}
function updTotal(){const f=++P.tt,tw=P.tw,ez=u=>u<0?0:u>1?1:u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
 if(f===80)P.hide={apa:1,anya:1,anna:1,petra:1,atti:1};
 if(f>=90&&f<330){tw.x=lerp(W+60,PX+118,ez((f-90)/240));if(f%30===0)tone(1100,0.12,'square',0.05);}
 else if(f>=330&&f<390)tw.tilt=-0.17*ez((f-330)/60);
 else if(f>=390&&f<570){const u=ez((f-390)/180);P.carOff.x=u*140;P.carOff.y=-25*clamp((u*140-6)/120,0,1);if(f%12===0)noise(0.05,0.05,0,700);}
 else if(f>=570&&f<630)tw.tilt=-0.17*(1-ez((f-570)/60));
 else if(f>=630&&f<800){const dx=Math.pow((f-630)/170,2)*W;tw.dx=dx;P.carOff.x=140+dx;}
 P.fadeA=f>=720?Math.min(1,(f-720)/70):0;
 if(f>=800)startRepair();}
function startRepair(){const T=G.trip,px=10/LEG.kmPerPx;P.dist=Math.max(0,P.dist-px);P.sub='repair';P.tw=null;P.carOff=null;P.rp={t:0};P.ws=P.dist-34;P.inv=0;P.bub=null;P.skids=[];P.lane=0;P.y=LANE[0];P.vy=0;ents=[];nextSpawn=P.dist+900;
 const ab=T.airbag?118000:0,parts=[['Karosszéria-javítás, fényezés',186000],['Fényszóró, lökhárító, tükör csere',46500]];if(ab)parts.push(['Légzsák és övfeszítő csere',ab]);
 for(const [l,c] of parts)book(-c,'service','Szerviz: '+l);P.rp.cost=parts.reduce((a,p)=>a+p[1],0);flash('A tréler 10 km-rel visszavitt a legközelebbi szervizbe. Javítás: '+fmt(P.rp.cost)+' Ft','#ffb347',320);}
function updRepair(){const r=P.rp;r.t++;P.fadeA=Math.max(0,1-r.t/50);if(r.t>60)G.trip.hp=Math.max(G.trip.hp,Math.min(99,Math.round((r.t-60)/300*100)));if(G.trip.hp>60&&G.trip.airbag)G.trip.airbag=0;
 if((r.t>150&&(K.enterP||TAPD))||r.t>=420){const T=G.trip;T.hp=100;T.airbag=0;P.sub='drive';P.rp=null;P.hide={};P.haz=false;P.door=0;P.ws=null;P.stopCD=P.dist;P.fadeA=0;
  flash('Megjavítva, mint az új! Innen folytatjuk az utat.','#7cff7c',260);say('Végre, mehetünk tovább!','anna');SFX.clunk();}}
/* ---- forgókefés automata autómosó ---- */
const WASH_PROGS=[{nm:'Alap',p:2490,ph:['spray','brush','rinse'],d:'Előmosás, kefe, öblítés'},
 {nm:'Prémium',p:3990,ph:['spray','foam','brush','rinse','wax'],d:'+ aktív hab, viasz',mood:1},
 {nm:'Extra',p:5490,ph:['spray','under','foam','brush','rinse','wax','dry','polish'],d:'+ alváz, szárítás, polír',mood:1}];
const WASH_NAME={spray:'Előmosás',under:'Alvázmosás',foam:'Aktív hab',brush:'Forgókefés mosás',rinse:'Öblítés',wax:'Meleg viasz',dry:'Szárítás',polish:'Polírozás'};
function enterWash(p){P.sub='wash';P.kmh=0;P.cruise=0;P.wash={step:'menu',t:0,x:p.x};SFX.click();vib(15);say('Autómosó! Mindenki marad bent, ablakok fel!','apa');}
function washRoof(xr){const gy=P.y;return xr<8?gy-36:xr<20?gy-48:xr<62?gy-55:xr<76?gy-48:xr<95?gy-48+(xr-76)/19*20:gy-27;}
function updWash(){const w=P.wash,T=G.trip;w.t++;
 if(w.step==='menu'){for(let i=0;i<WASH_PROGS.length;i++)if(K.num===i+1||inRect(TAP,cardRect(i))){const pr=WASH_PROGS[i];book(-pr.p,'service','Autómosó: '+pr.nm+' program');SFX.cash();
   Object.assign(w,{step:'run',t:0,prog:i,k:0,gx:PX+140,phase:pr.ph[0],foam:0,foamDir:1,roof:washRoof(140)});P.haz=false;return;}
  if(K.enterKey||inRect(TAP,GO_BTN)){P.sub='drive';P.wash=null;P.stopCD=P.dist;SFX.clunk();}return;}
 if(w.step==='run'){const pr=WASH_PROGS[w.prog],PASS=110,k=Math.floor(w.t/PASS),u=(w.t%PASS)/PASS,ez=u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
  if(k>=pr.ph.length){w.step='done';w.t=0;T.dirt=0;P.sparkle=200;if(pr.mood)T.mood=Math.min(5,T.mood+pr.mood);say(pick(['Csillog-villog!','Olyan, mint az új!','Még egyszer!']),pick(['anna','petra']));SFX.pick();return;}
  w.phase=pr.ph[k];const fwd=k%2===0;w.gx=fwd?lerp(PX+140,PX-28,ez):lerp(PX-28,PX+140,ez);w.roof=washRoof(w.gx-PX);
  if(w.phase==='foam'){w.foam=Math.min(1,w.foam+0.02);w.foamDir=fwd?1:-1;}else if(w.phase==='brush'||w.phase==='rinse'){w.foam=Math.max(0,w.foam-0.012);}
  if(w.phase==='brush'||w.phase==='polish')T.dirt=Math.max(0,(T.dirt||0)*0.985-0.002);
  if((w.phase==='spray'||w.phase==='rinse'||w.phase==='under'||w.phase==='wax')&&w.t%9===0)noise(0.12,0.05,0,3200);
  if((w.phase==='brush'||w.phase==='polish')&&w.t%14===0)noise(0.18,0.06,0,600);if(w.phase==='dry'&&w.t%10===0)noise(0.15,0.07,0,1400);if(w.phase==='foam'&&w.t%12===0)noise(0.1,0.04,0,5000);return;}
 if(w.step==='done'&&w.t>90){P.sub='drive';P.wash=null;P.stopCD=P.dist;flash('Tiszta az autó! Jó utat!','#7cff7c',200);SFX.clunk();}}
function drawWashUI(g){const w=P.wash,r=PANEL,T=G.trip;if(!w||w.step!=='menu')return;
 frr(g,'rgba(12,15,24,0.94)',r[0],r[1],r[2],r[3],10);g.strokeStyle='#1e88e5';g.lineWidth=1.4;rrect(g,r[0],r[1],r[2],r[3],10);g.stroke();frr(g,'#1e88e5',r[0],r[1],r[2],18,10);R(g,'#1e88e5',r[0],r[1]+9,r[2],9);
 text(g,'Forgókefés autómosó',r[0]+10,r[1]+5.5,'#ffffff',1.2,'left',null);text(g,fmt(T.money)+' Ft',r[0]+r[2]-8,r[1]+6,'#b7ffcf',1,'right',null);
 const d=Math.round((T.dirt||0)*100);text(g,'Az autó piszkossága: '+d+'%',r[0]+10,r[1]+25,d>60?'#ffb347':'#cfd6df',1,'left',null);
 WASH_PROGS.forEach((pr,i)=>{const c=cardRect(i);c[2]=94;c[0]=r[0]+8+i*99;c[3]=96;frr(g,'#1f2635',c[0],c[1],c[2],c[3],7);g.strokeStyle=i===1?'#ffd84a':'rgba(255,255,255,0.14)';g.lineWidth=0.8;rrect(g,c[0],c[1],c[2],c[3],7);g.stroke();
  itemIcon(g,'carwash',c[0]+c[2]/2,c[1]+16);text(g,pr.nm,c[0]+c[2]/2,c[1]+32,'#ffffff',1.2,'center',null);text(g,fmt(pr.p)+' Ft',c[0]+c[2]/2,c[1]+45,'#ffd84a',1,'center',null);
  const words=pr.d.split(', ');words.forEach((wd,j)=>text(g,wd,c[0]+c[2]/2,c[1]+58+j*9,'#9fb0c2',1,'center',null));if(!isTouch)text(g,String(i+1),c[0]+5,c[1]+4,'#6f7d8c',1,'left',null);});
 frr(g,'#3b4149',GO_BTN[0],GO_BTN[1],GO_BTN[2],GO_BTN[3],7);text(g,isTouch?'Most nem, tovább':'Enter: most nem, tovább',GO_BTN[0]+GO_BTN[2]/2,GO_BTN[1]+6.5,'#ffffff',1,'center',null);}
function wildHit(e){const big=['deer','boar','cow'].includes(e.tp),sp=P.kmh;G.shake=big?14:8;vib(big?[80,40,120]:[60]);
 if(big&&sp>25){damage(10+sp*0.25,'wild');if(P.sub!=='drive')return;const c=Math.round((25000+sp*400)/1000)*1000;book(-c,'service','Vadbaleset ('+({deer:'őz',boar:'vaddisznó',cow:'tehén'}[e.tp])+'): vadkár-ügyintézés, vontatás nélkül');P.kmh*=0.55;P.scare=1;
  flash('Vadbaleset! Javítás: '+fmt(c)+' Ft. Éjjel és erdő mellett lassíts, dudálj!','#ff8a5a',300);if(sp>70&&Math.random()<0.4)flatTire();if(!P.hide.anna)scream(1080,0.8);}
 else{damage(3,'wild');P.kmh*=0.85;flash('Elütöttünk egy '+({fox:'rókát',hare:'nyulat'}[e.tp]||'állatot')+'... Figyelj jobban!','#ffb347',220);}
 e.dead=true;e.vy=0;}
function hit(msg,who){if(P.inv>0)return false;vib(180);G.trip.mood--;P.inv=100;G.shake=8;SFX.hit();say(msg||pick(['Jaj!','Vigyázz!','Apaaa!']),who||'anya');P.vF-=2.5;P.vR-=1.5;
 for(let k=0;k<8;k++)parts.push({type:'star',x:P.dist+105,y:P.y-22,vx:rnd(-1,2),vy:rnd(-3,-1),life:30,max:30,col:pick(['#ffeb3b','#ffffff','#ff9800']),world:true});checkMood();return true;}
function flatTire(){if(P.flat)return;P.flat=Math.random()<0.5?'f':'r';SFX.pop();say('Defektet kaptunk!','apa');flash(G.trip.spare?'Defekt! Állj meg a szélső sávban a kerékcseréhez!':'Defekt, és nincs pótkerék! Állj meg a szélső sávban!','#ff8a8a',260);}

/* ---------- fogyasztás (l/100 km) ---------- */
function consumption(v,type,gas){if(v<3)return 0;let c=2.9+0.00033*v*v;if(type==='town'||type==='village')c+=4.0;if(gas>0)c+=10*gas*(1-v/185);
 const s=seg();if(s.q==='bad'||s.q==='cobble')c+=0.3;if(LEGS[G.leg].weather==='snow')c+=0.6;if(LEGS[G.leg].region==='alps')c+=0.4;return c;}

/* ---------- frissítés ---------- */
function mapRect(){return G.mapBig?[W-207,52,204,150]:[W-112,52,109,78];}
const MONEY_R=[W-90,2,88,14];
function stopTarget(p){return p.type==='fuel'?p.x+38.4:p.x+(p.type==='hiper'?66:30)-60;}
function stopChips(){const out=[],seen={};if(!LEG||!P)return out;for(const p of LEG.pois){if(p.type==='veda'||seen[p.type])continue;const rem=stopTarget(p)-P.dist;const d=rem*LEG.kmPerPx;if(rem<8||d>2.5)continue;seen[p.type]=1;out.push({p:p,d:d});if(out.length>=3)break;}return out;}
function startAuto(p){P.auto={p:p,tx:stopTarget(p),type:p.type};P.cruise=0;if(P.lane!==0){P.lastLane=P.lane;P.lane=0;P.blink=120;}P.stopCD=undefined;SFX.click();vib(15);
 flash('Megállunk: '+POI_NAME[p.type]+'. Apa lehúzódik a szélső sávba.','#7cd99c',150);}
function autoDrive(){const A=P.auto,L=LEGS[G.leg];const rem=A.tx-P.dist;let lim=seg().limit;
 for(const e of ents)if(e.kind==='traffic'&&!e.chase&&e.lane===0){const gap=e.x-(P.dist+118);if(gap>-4&&gap<A.tx-P.dist+40&&gap<90)lim=Math.min(lim,Math.max(0,(e.cur||0)-2+gap*0.08));}
 let stopAt=rem;for(const l of LEG.lights){const gap=l.x-(P.dist+114);const need=Math.pow(P.kmh*KPX,2)/(2*0.45*KPX)+2;if(gap>need*(lightState(l,G.t)==='yellow'?1:0.6)&&gap<rem&&lightState(l,G.t)!=='green')stopAt=Math.min(stopAt,gap);}
 const dec=0.32*KPX;const vd=Math.sqrt(2*dec*Math.max(0,stopAt))/KPX;return Math.min(lim,vd,stopAt<3?0:999);}
function updPlay(){if(TAPD&&!G.paused&&!MG&&P&&P.sub==='drive'&&inRect(TAPD,mapRect())){G.mapBig=!G.mapBig;SFX.click();}
 if(P&&!G.paused&&!MG&&(K.logP||TAPD&&inRect(TAPD,MONEY_R))){K.logP=false;TAPD=null;if(typeof openLedger==='function')openLedger('play');return;}
 if(P&&!G.paused&&!MG&&P.sub==='drive'&&!P.arriving){if(TAPD){for(const c of (G.chips||[]))if(inRect(TAPD,c.r)){if(c.cancel){P.auto=null;flash('Megállás törölve.','#9fd8ff',80);}else if(!P.flat&&!P.rev)startAuto(c.p);TAPD=null;break;}}
  if(K.stopP){if(P.auto){P.auto=null;flash('Megállás törölve.','#9fd8ff',80);}else{const c=stopChips()[0];if(c)startAuto(c.p);}}}const L=LEGS[G.leg],t=G.t,T=G.trip;if(K.pauseP&&!MG)G.paused=!G.paused;if(G.paused)return;
 if(MG){updMini();engine(P.engineOff?0:850,0);return;}
 const s=seg();
 if(s!==P.lastSeg){segLeave(P.lastSeg);P.lastSeg=s;segEnter(s);const nm=s.type==='motorway'?s.name+' autópálya':s.type==='country'?'Országút':(s.name||'')+(s.type==='town'?' (város)':' (falu)');G.segInfo={txt:nm+' - '+QNAME[s.q]+' - '+s.limit+' km/h',t:220};}
 // beszállás az indulásnál
 if(P.boarding>=0){P.boarding++;let all=true;for(const w of P.walk){w.t++;if(w.x<w.tx){w.x+=0.6;all=false;}else if(w.y<P.y+3){w.y+=0.4;all=false;}}
  if(P.boarding===20)say('Mindenki beszáll! Indulunk nyaralni!','apa');
  if(all&&P.walk.length){P.walk=[];P.hide={};SFX.clunk();}if(!P.walk.length){P.door=Math.max(0,P.door-0.05);if(P.door<=0){P.boarding=-1;say('Kösd be magad, Anna!','anya');G.banner=200;}}
  susp(0,0);return;}
 if(P.sub==='pump'){updPump();engine(850,0);susp(0,0);return;}
 if(P.sub==='shop'){updShop();engine(850,0);susp(0,0);return;}
 if(P.sub==='rest'){updRest();engine(850,0);susp(0,0);return;}
 if(P.sub==='wash'){updWash();engine(P.wash&&P.wash.step==='run'?0:850,0);susp(0,0);return;}
 if(P.sub==='total'){updTotal();engine(0,0);susp(0,0);return;}
 if(P.sub==='repair'){updRepair();engine(850,0);susp(0,0);return;}
 if(P.sub==='fix'){updFix();susp(0,0);return;}
 // lámpák, kapcsolók
 if(K.lightP){P.lightMode=(P.lightMode+1)%4;SFX.click();flash(['Világítás kikapcsolva','Helyzetjelző','Tompított fényszóró','Reflektor (távolsági)'][P.lightMode],'#9fd8ff',90);}
 if(K.fogP){const st=(P.fogF?1:0)+(P.fogR?1:0);const n=(st+1)%3;P.fogF=n>=1;P.fogR=n>=2;SFX.click();flash(['Ködlámpák kikapcsolva','Első ködlámpa','Első és hátsó ködlámpa'][n],'#9cff9c',90);}
 if(K.hazP){P.haz=!P.haz;SFX.click();}
 if(K.radioP){radioNext();}
 if(K.doorP){if(Math.abs(P.kmh)<1){P.doorsOpen=!P.doorsOpen;SFX.clunk();}else flash('Menet közben nem nyitható ajtó!','#ffb347',90);}
 if(K.revP){if(Math.abs(P.kmh)<1){P.rev=!P.rev;SFX.clunk();flash(P.rev?'Hátramenet (R)':'Előremenet','#ffffff',80);}else flash('Előbb állj meg a sebességváltáshoz!','#ffb347',90);}
 const flashing=K.flash;if(flashing&&!P.flashOn)yieldAhead('fény');P.flashOn=flashing;
 P.door=P.doorsOpen?Math.min(1,P.door+0.05):Math.max(0,P.door-0.05);
 // gáz / fék / sebesség
 if(K.hbP){P.hb=!P.hb;SFX.clunk();vib(20);flash(P.hb?'Kézifék behúzva':'Kézifék kiengedve','#ffffff',80);}
 const CRUISE=[0,50,70,90,110,130];
 if(K.cruiseP)K.cruiseTap=true;
 if(K.cruiseSet!==undefined&&K.cruiseSet!==null){setCruise(K.cruiseSet);K.cruiseSet=null;}
 if(K.cruiseTap){K.cruiseTap=false;if(P.cruise)setCruise(0);else if(P.kmh<25)flash('A tempomat 30 km/h felett kapcsolható be.','#9fd8ff',120);else setCruise(clamp(Math.round(P.kmh/5)*5,30,130));}
 const rawB=K.brake||K.pump;
 if(!P.rev&&P.sub==='drive'&&!P.auto&&!P.arriving&&rawB&&Math.abs(P.kmh)<0.2&&!P.hb&&P.boarding<0){P.revT=(P.revT||0)+1;if(P.revT===50){P.rev=true;SFX.click();flash('Hátramenet: fékkel tolatsz, gázzal vissza előremenetbe','#9fd8ff',150);}}else if(!rawB)P.revT=0;
 if(P.rev&&K.gas&&P.kmh>-0.3){P.rev=false;P.revT=-9999;}
 let brake=rawB;let gas=K.gas&&!P.engineOff&&!P.arriving;let a=0;let autoV=-1;
 if(P.auto&&(K.brake||K.upP||K.dnP||K.revP||P.flat||P.sub!=='drive'||P.arriving)){P.auto=null;if(K.brake||K.upP||K.dnP)flash('Megállás törölve.','#9fd8ff',80);}
 if(P.auto){autoV=autoDrive();gas=!P.engineOff&&!P.hb&&P.door<0.05&&P.kmh<autoV-0.6;brake=false;}
 if(brake&&P.cruise){P.cruise=0;flash('Tempomat kikapcsolva (fék)','#9fd8ff',80);}
 if(P.cruise&&!gas&&!P.rev&&!P.hb&&!P.engineOff&&!P.arriving&&P.door<0.05){const tg=Math.min(P.cruise,seg().limit>=P.cruise?P.cruise:P.cruise);if(P.kmh<tg-0.4)gas=true;else if(P.kmh<tg+0.4){P.kmh=lerp(P.kmh,tg,0.05);P.cruiseHold=true;}}
 if(P.hb){if(gas&&t%90===0)flash('Be van húzva a kézifék! (B / KÉZIFÉK)','#ffb347',80);gas=false;if(Math.abs(P.kmh)>0.5){P.kmh+=P.kmh>0?-0.7:0.7;if(t%6===0&&P.kmh>15)noise(0.08,0.12,0,2500);}else P.kmh=0;}
 if(gas&&P.door>0.05){gas=false;if(t%90===0)flash('Csukd be az ajtókat! (O / ajtó gomb)','#ffb347',80);}
 const bk=L.weather==='snow'?0.3:L.weather==='rain'||L.weather==='storm'?0.38:0.5;
 if(P.arriving){P.kmh=Math.max(0,P.kmh-1.2);P.arriveT++;}
 else if(P.rev){const rb=rawB&&!P.hb&&P.door<0.05&&!P.engineOff;if(rb){a=0.06;P.kmh=Math.max(-15,P.kmh-a);}else P.kmh=Math.min(0,P.kmh+0.04);if(K.gas)P.kmh=Math.min(0,P.kmh+bk);}
 else{if(gas){a=0.15*(1-Math.pow(P.kmh/CAR.top,2))*(P.flat?0.5:1)*(L.weather==='snow'?0.7:1);if(P.cruise&&!K.gas)a=Math.min(a,Math.max(0.02,(P.cruise-P.kmh)*0.03));P.kmh+=a;}
  else if(!P.cruiseHold)P.kmh-=0.012+0.0000035*P.kmh*P.kmh;P.cruiseHold=false;
  if(brake)P.kmh-=bk;
  if(P.flat)P.kmh=Math.min(P.kmh,38);P.kmh=clamp(P.kmh,0,CAR.top);const vmx=hpMax();if(P.kmh>vmx)P.kmh=Math.max(vmx,P.kmh-0.3);}
 let autoBrk=false;if(P.auto&&autoV>=0&&P.kmh>autoV){const d=Math.min(0.45,P.kmh-autoV+0.012);P.kmh=Math.max(0,P.kmh-d);autoBrk=d>0.05;}
 let autoEnd=false;if(P.auto){const rem=P.auto.tx-P.dist;if(rem<=0.5||P.kmh*KPX>=rem||(rem<2.5&&P.kmh<1.2)){P.kmh=Math.max(0,rem)/KPX;autoEnd=true;}}
 P.brake=brake||autoBrk||P.arriving&&P.kmh>0.5;if(P.rev)P.brake=K.gas&&P.kmh<-0.3;
 // fáradás: valós idejű folyamatos vezetés (60 képkocka = 1 mp)
 {if(P.sub==='drive'&&Math.abs(P.kmh)>3&&!P.arriving)T.driveS=(T.driveS||0)+1/60;const F=T.driveS||0,D=clamp((F-1800)/900,0,1);
  if(F>=1500&&!P.fw25){P.fw25=true;flash('25 perce vezetsz. Hamarosan tarts pihenőt!','#ffcf33',240);}
  if(F>=1800&&!P.fw30){P.fw30=true;flash('Apa elfáradt: 30 perce vezet! Állj meg pihenni.','#ff8a5a',320);say('Kezdek elálmosodni...','apa');tone(660,0.15,'sine',0.08);tone(520,0.25,'sine',0.08,0.17);}
  if(F<1500){P.fw25=false;P.fw30=false;}
  if(P.ms){P.ms.t++;const u=P.ms.t/P.ms.len;if(u<0.85)P.y+=0.07*(0.4+D)*P.ms.dir;if(P.ms.t>=P.ms.len){P.ms=null;flash('Majdnem elaludtál! Állj meg pihenni!','#ff6b6b',200);vib([60,40,60]);SFX.honk();setTimeout(()=>hornSet(false),10);}}
  else if(D>0&&P.sub==='drive'&&P.kmh>20&&Math.random()<0.0006+D*0.003)P.ms={t:0,len:Math.round(50+D*70),dir:P.lane===0?1:P.lane===2?-1:pick([-1,1])};
  G.drowsy=D;G.eyelid=P.ms?Math.sin(Math.PI*Math.min(1,P.ms.t/P.ms.len)):0;}
 // satufék: féknyom, gumicsikorgás, az utasok előrebillennek, a gyerekek sikítanak
 {const hard=brake&&!P.rev&&P.kmh>45&&P.sub==='drive';P.brakeT=hard?(P.brakeT||0)+1:0;P.skids=P.skids||[];
  if(hard&&P.kmh>50){if(!P.skid||Math.abs(P.skid.y-P.y)>0.8){P.skid={x0:P.dist,x1:P.dist,y:P.y};P.skids.push(P.skid);if(P.skids.length>30)P.skids.shift();}P.skid.x1=P.dist;if(t%8===0)screech(Math.min(1,P.kmh/100));}else P.skid=null;
  if(hard&&P.brakeT===6&&P.kmh>55&&!(P.scareCD>0)){P.scare=1;P.scareCD=300;vib([30,20,60]);if(!P.hide.anna)scream(1080,0.85);if(!P.hide.petra)scream(1320,0.75,0.1);if(!P.hide.atti)scream(900,0.6,0.25);say(pick(['Ááááá!','Apaaa!','Jajj, mi volt ez?!','Hűha!']),pick(['anna','petra','anya']));}
  if(P.scareCD>0)P.scareCD--;P.scare=Math.max(0,(P.scare||0)-0.005);
  const lt=P.rev?0:brake&&P.kmh>3?Math.min(1,P.kmh/45)*2.4:gas?-0.5*Math.min(1,P.kmh/60+0.3):0;P.lean=lerp(P.lean||0,lt,lt>(P.lean||0)?0.22:0.08);}P.gasF=gas?a/0.15:0;
 let pxf=P.kmh*KPX;if(P.dist+pxf<0){pxf=-P.dist;P.kmh=0;}P.dist+=pxf;P.ang+=pxf/WR;
 if(autoEnd){P.dist=P.auto.tx;P.kmh=0;P.auto=null;P.stopCD=undefined;}
 // km, benzin, kaja
 const dkm=Math.abs(pxf)*LEG.kmPerPx;T.km+=dkm;P.avgKm+=dkm;{const wt=L.weather;T.dirt=Math.min(1,(T.dirt||0)+dkm*0.0025*(wt==='snow'?4:wt==='rain'||wt==='storm'?3:1)*(seg().q==='bad'||seg().q==='cobble'?2:1));}
 const c=consumption(Math.abs(P.kmh),s.type,P.gasF);P.instCons=c;let dl=c/100*dkm;if(P.kmh<3&&!P.engineOff)dl=0.00004;
 if(!P.engineOff){T.fuel=Math.max(0,T.fuel-dl);T.fuelUsed+=dl;P.avgL+=dl;}
 if(T.fuel<=0&&!P.engineOff){P.engineOff=true;flash('Kifogyott a benzin! Autómentő hozzon 10 litert: 25 000 Ft (Enter / érintés)','#ff8a8a',99999);say('Elfogyott a benzin...','apa');}
 if(P.engineOff&&K.enterP){book(-25000,'service','Autómentő: 10 liter benzin');T.fuel=10;P.engineOff=false;G.msg=null;flash('Megjött a segítség: 10 liter a tankban.','#7cff7c');SFX.cash();}
 if(T.fuel<7&&t%600===0&&!P.engineOff){flash('Tartalék! Kevés a benzin, tankolj a következő kútnál!','#ffb347');tone(660,0.2,'square',0.05);}
 T.food=Math.max(0,T.food-0.0003*LEG.ts);T.baby=Math.max(0,T.baby-0.00014*LEG.ts);
 if(P.cranky&&P.sub==='drive'){P.crankyT=(P.crankyT||0)+1;if(P.crankyT%540===270){say(pick(['Unatkozom!','Mikor érünk már oda?','Álljunk meg!','Pisilni kell!','Éhes vagyok!']),pick(['anna','petra']));if(!P.hide.atti&&Math.random()<0.5)scream(880,0.5);}}
 if(T.food<=0){if(++P.hungerT%1500===0){T.mood--;say('Éhesek vagyunk!','petra');flash('Elfogyott a kaja! A család éhes (-1 kedv). Vásárolj egy boltban!','#ff8a8a');checkMood();}}
 // motorhang
 const gears=[0,20,38,60,90,125,186];let gi=1;while(gi<gears.length-1&&P.kmh>gears[gi])gi++;const av=Math.abs(P.kmh);let gi2=1;while(gi2<gears.length-1&&av>gears[gi2])gi2++;const rpm=P.engineOff?0:850+(av-gears[gi2-1])/(gears[gi2]-gears[gi2-1])*4600;engine(rpm,P.gasF);P.rpm=rpm;P.gear=P.rev?'R':av<1?'N':gi2;
 // sávváltás
 if(!P.arriving){if(K.upP&&P.lane>0){P.lastLane=P.lane;P.lane--;P.blink=120;}if(K.dnP&&P.lane<2){P.lastLane=P.lane;P.lane++;P.blink=120;}
  if(K.honkP){SFX.honk();yieldAhead('duda');for(const e of ents){const d=e.x-(P.dist+110);if(e.kind==='animal'&&d<260&&d>-60&&!e.flee){e.flee=true;e.tp==='cow'?SFX.moo():SFX.baa();}}}}
 const ty=LANE[P.lane],dy=ty-P.y,grip=L.weather==='snow'?0.55:(L.weather==='rain'||L.weather==='storm')?0.7:1;
 // sima sávváltás: az oldalirányú sebesség fokozatosan nő és csökken (S-görbe), nincs rántás
 {const sp=Math.min(Math.abs(P.kmh),130)/130,vmax=(0.2+0.2*sp)*grip,amax=(0.012+0.01*sp)*grip;const vd=clamp(dy*0.055,-vmax,vmax);P.vy=(P.vy||0)+clamp(vd-(P.vy||0),-amax,amax);P.y+=P.vy;
  if(Math.abs(dy)<0.06&&Math.abs(P.vy)<0.015){P.y=ty;P.vy=0;}}
 if(T.airbag===1){P.abT=(P.abT||0)+1;if(P.abT>150)T.airbag=2;}
 {const bo=(t%40)<20,bl=P.blink>0||P.haz||(P.flat&&P.sub==='drive');if(bl&&bo!==P.lastBo)blinkTick(bo);P.lastBo=bo;}if(P.flat&&P.sub==='drive'&&P.kmh>3){const rr=Math.floor(P.ang/TAU);if(rr!==P.lastRot){P.lastRot=rr;noise(0.07,0.2,0,240);G.shake=Math.max(G.shake||0,1.2);}}
 if(P.blink>0)P.blink--;if(P.inv>0)P.inv--;
 // futómű
 susp(P.gasF,brake?1:0);
 // forgalom, akadályok
 while(!P.arriving&&nextSpawn<P.dist+W+150){spawnAt(nextSpawn);const sn=segAtIn(LEG.segs,nextSpawn);nextSpawn+=sn.type==='motorway'?rnd(260,440):rnd(320,560);}
 updEnts();
 // közlekedési lámpák
 for(const l of LEG.lights){const front=P.dist+112;if(!l.passed&&front>l.x){l.passed=true;if(front-l.x<8&&lightState(l,t)==='red'&&P.kmh>5){book(-30000,'fine','Bírság: áthajtás a piros lámpán');T.mood--;SFX.siren();flash('Piros lámpán hajtottál át! Bírság: 30 000 Ft, -1 kedv','#ff8a8a',260);say('Ez piros volt!','anya');checkMood();}}}
 // benzinkút
 for(const p of LEG.pois){if(p.type!=='veda'||p.passed)continue;const front=P.dist+112;if(front>p.x+8&&front-p.x<400){p.passed=true;const lim=s.limit,over=P.kmh-lim;
   if(over>5){const fine=over<=15?15000:over<=25?30000:over<=35?45000:over<=45?60000:100000;p.flash=14;book(-fine,'fine','Traffipax (VÉDA): '+Math.round(P.kmh)+' km/h, '+lim+' km/h-s szakasz');tone(1800,0.05,'square',0.08);vib(150);flash('Villant a traffipax! '+Math.round(P.kmh)+' km/h a '+lim+'-es szakaszon. Bírság: '+fmt(fine)+' Ft','#ff8a8a',300);say('Ez most villant...','anya');}}}
 const stopOK=Math.abs(P.dist-(P.stopCD===undefined?-1e9:P.stopCD))>260;
 if(stopOK&&!P.auto&&Math.abs(P.kmh)<1&&P.lane===0&&!P.flat&&!P.arriving&&!P.rev)for(const p of LEG.pois){if(p.type==='veda'||p.type==='fuel')continue;const dx=(P.dist+60)-(p.x+(p.type==='hiper'?66:30));
  if(Math.abs(dx)<40){if(p.type==='rest')startRest(p);else if(p.type==='wash')enterWash(p);else enterShop(p.type);return;}}
 for(const st of LEG.stations){const flapX=P.dist+13.6;for(const q of [st+40,st+104])if(stopOK&&!P.auto&&P.lane===0&&Math.abs(q+12-flapX)<30&&Math.abs(P.kmh)<1&&!P.flat&&!P.arriving){P.sub='pump';P.pump={step:'nozzle',liters:0,q:q,msg:'',start:T.fuel,t:0};P.hide.apa=1;SFX.click();vib(15);
  if(P.ev&&P.ev.type==='pee'){P.ev=null;flash('Anna elszaladt a mosdóba. Megkönnyebbült!','#7cff7c');}return;}}
 // megállós események
 if(P.ev){const d=EVDEF[P.ev.type];
  if(d){P.ev.t--;if(P.lane===0&&P.kmh<1){P.ev.stopT++;if(P.ev.stopT===1)for(const w of d.out)P.hide[w]=1;if(P.ev.stopT>=d.stop)evDone();}
   else if(P.ev.stopT>0){for(const w of d.out)P.hide[w]=0;P.ev.stopT=0;}
   if(P.ev&&P.ev.t<=0)evFail();}
  else if(P.ev.type==='help'){const front=P.dist+112;if(P.lane===0&&P.kmh<1&&front<P.ev.x&&P.ev.x-front<70){const kind=P.ev.kind,ex=P.ev.x;P.hide.apa=1;P.ev=null;startMini(kind,{onEnd:r=>{P.hide.apa=0;for(const e of ents)if(e.help&&e.x===ex){e.help=null;e.parked=false;e.kmh=e.base=60;}flash(r?'Köszönjük! Kaptál '+fmt(r)+' Ft-ot.':'Legalább megpróbáltad.',r?'#7cff7c':'#ffb347');if(r){G.trip.mood=Math.min(5,G.trip.mood+1);say('Apa egy hős!','anna');}}});return;}
   if(front>P.ev.x+40)P.ev=null;}
  else if(P.ev.type==='police'){if(P.dist+112>P.ev.x+20){const lim=s.limit;if(P.kmh>lim+5){const fine=Math.round((10000+(P.kmh-lim)*1500)/1000)*1000;book(-fine,'fine','Traffipax (rendőr): '+Math.round(P.kmh)+' km/h, '+lim+' km/h-s szakasz');SFX.siren();flash('Traffipax! '+Math.round(P.kmh)+' km/h a '+lim+'-es táblánál. Bírság: '+fmt(fine)+' Ft','#ff8a8a',300);say('Mondtam, hogy lassíts!','anya');}
    else{flash('Rendőri ellenőrzés: szabályos sebesség, jó utat!','#7cff7c');}P.ev=null;}}
  else{P.ev.t--;if(P.ev.t<=0){if(P.ev.type==='jam'){for(const e of ents)if(e.jam){e.kmh=e.base=95;e.jam=false;}flash('Feloldódott a dugó.','#7cff7c');}P.ev=null;}}}
 else if(!P.arriving&&--P.evCD<=0){startEvent();P.evCD=rnd(2400,5400)|0;}
 if(P.kmh>s.limit+10)P.overT=(P.overT||0)+1;else if(P.overT>0&&t%4===0)P.overT--;
 if(P.chaseCD===undefined)P.chaseCD=rnd(30000,70000)|0;
 if(!P.chase&&!P.arriving&&P.kmh>30&&--P.chaseCD<=0){P.chaseCD=rnd(40000,90000)|0;const c={kind:'traffic',tp:'police',x:P.dist-420,lane:P.lane,y:LANE[P.lane],ty:LANE[P.lane],w:TW.police,h:TH.police,kmh:P.kmh+30,base:P.kmh+30,col:'#ffffff',chase:true};
  ents.push(c);P.chase={e:c,t:0,stopT:0};flash('Rendőr jön utánad villogóval! Húzódj le a szélső (felső) sávba és állj meg!','#7fb2ff',400);say('Apa, a rendőrök minket követnek!','anna');}
 if(P.chase){const ch=P.chase,e=ch.e;ch.t++;if(ch.t%110===1)SFX.siren();e.lane=P.lane;e.ty=LANE[P.lane]-1;
  const gap=P.dist-(e.x+e.w);e.kmh=e.base=gap>40?P.kmh+25:Math.max(0,P.kmh-1);if(gap<12)e.x=P.dist-e.w-12;
  if(P.lane===0&&Math.abs(P.kmh)<1){ch.stopT++;if(ch.stopT===90){const over=P.overT>600;const fine=over?30000:0;if(fine)book(-fine,'fine','Igazoltatás: gyorshajtás');
    flash(over?'Igazoltatás: gyorshajtásért 30 000 Ft bírság. A papírok rendben.':pick(['Igazoltatás: minden rendben, jó utat a családnak!','Ellenőrzés: jogosítvány, forgalmi rendben. Vigyázzanak magukra!','Rutinellenőrzés: rendben, köszönjük a türelmet!']),over?'#ff8a8a':'#7cff7c',320);
    say(over?'Legközelebb lassabban...':'Szerencsére minden rendben.','anya');e.chase=false;e.kmh=e.base=s.limit+15;e.lane=1;e.ty=LANE[1];P.chase=null;}}
  else if(ch.t>2400){book(-50000,'fine','Nem állt meg a rendőri felszólításra');flash('Nem álltál meg a rendőri felszólításra! Bírság: 50 000 Ft','#ff8a8a',320);T.mood--;checkMood();e.chase=false;e.kmh=e.base=s.limit+20;e.lane=1;e.ty=LANE[1];P.chase=null;}}
 if(++P.saveT>=600&&!P.arriving){P.saveT=0;save(P.dist);}
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
const VIG={HU:{price:6400,label:'Magyarország: heti e-matrica (D1)',fine:14875},AT:{price:5200,label:'Ausztria: 10 napos matrica (12,80 EUR)',fine:48000},CZ:{price:4300,label:'Csehország: 10 napos e-matrica (270 CZK)',fine:60000}};
const TOLL={IT:32,FR:40};
function segEnter(s){if(!s||s.type!=='motorway'||!s.cc)return;const T=G.trip,v=VIG[s.cc];
 if(v&&!T.vig[s.cc]&&!(T.noVig&&T.noVig[s.cc]))startMini('vignette',{cc:s.cc,price:v.price,label:v.label});
 if(TOLL[s.cc])flash('Fizetős autópálya ('+s.cc+'): az útdíjat a kapunál fizeted.','#7fd1ff');}
function segLeave(s){if(!s||s.type!=='motorway'||!s.cc)return;const T=G.trip,km=(s.x1-s.x0)*LEG.kmPerPx;
 if(TOLL[s.cc]){const c=Math.round(km*TOLL[s.cc]/10)*10;book(-c,'road','Útdíj '+s.name+' ('+s.cc+'): '+fmt(km)+' km x '+TOLL[s.cc]+' Ft');SFX.cash();flash('Fizetőkapu: útdíj '+fmt(c)+' Ft ('+fmt(km)+' km)','#7fd1ff',240);}
 const v=VIG[s.cc];if(v&&!T.vig[s.cc]&&Math.random()<0.35){book(-v.fine,'fine','Pótdíj: matrica nélkül ('+s.cc+')');SFX.siren();flash('Matrica nélkül hajtottál az autópályán! Pótdíj: '+fmt(v.fine)+' Ft','#ff8a8a',300);}}
/* ---------- élő időjárás (Open-Meteo, valós idő) ---------- */
function wxMap(code,isDay,hour){let w='sun';if([3].includes(code))w='cloudy';else if([45,48].includes(code))w='fog';else if((code>=51&&code<=67)||(code>=80&&code<=82))w='rain';else if((code>=71&&code<=77)||code===85||code===86)w='snow';else if(code>=95)w='storm';
 let tm='day';if(!isDay)tm='night';else if(hour>=18)tm='sunset';else if(hour<7)tm='dusk';if(tm==='night'&&w==='sun')w='clear';return [w,tm];}
function fetchWeather(i){if(LEGS[i].live||location.protocol==='file:'||!navigator.onLine)return;const c=LIVE_XY[i+1];
 fetch('https://api.open-meteo.com/v1/forecast?latitude='+c[0]+'&longitude='+c[1]+'&current=weather_code,is_day,temperature_2m,wind_speed_10m&timezone=auto').then(r=>r.json()).then(d=>{const cur=d.current;if(!cur)return;
  const hour=+String(cur.time).slice(11,13);const [w,tm]=wxMap(cur.weather_code,cur.is_day,hour);const L=LEGS[i];L.weather=w;L.time=tm;L.temp=cur.temperature_2m;L.wind=cur.wind_speed_10m;L.localTime=String(cur.time).slice(11,16);L.live=true;}).catch(()=>{});}
function arriveRefill(){const T=G.trip,cost=18000;T.driveS=0;book(-cost,'lodging','Szállás és bevásárlás: '+LEGS[G.leg].to);T.food=100;T.baby=100;T.photos+=3;}
function susp(gas,brake){const xR=P.dist+WHEELS[0],xF=P.dist+WHEELS[1];const k=0.13,c=0.3;
 const tF=-roadH(xF)+brake*0.9-gas*0.4,tR=-roadH(xR)-brake*0.4+gas*0.6;P.wF=-roadH(xF);P.wR=-roadH(xR);
 P.vF+=k*(tF-P.yF)-c*P.vF;P.yF+=P.vF;P.vR+=k*(tR-P.yR)-c*P.vR;P.yR+=P.vR;}
function updEnts(){const pl=P.dist+6,pr=P.dist+112,t=G.t,L=LEGS[G.leg];
 for(const e of ents){
  if(e.kind==='traffic'){if(!e.parked){let v=e.kmh;for(const l of LEG.lights){const st=lightState(l,t);if(st!=='green'&&e.x+e.w<l.x&&l.x-(e.x+e.w)<40)v=0;}
    for(const o of ents)if(o!==e&&o.kind==='traffic'&&o.lane===e.lane&&o.x>e.x&&o.x-(e.x+e.w)<14)v=Math.min(v,o.kmh);
    e.cur=lerp(e.cur===undefined?v:e.cur,v,0.05);e.x+=e.cur*KPX;}
   {const d=e.ty-e.y,vd=clamp(d*0.05,-0.35,0.35);e.vy=(e.vy||0)+clamp(vd-(e.vy||0),-0.012,0.012);e.y+=e.vy;if(Math.abs(d)<0.06&&Math.abs(e.vy)<0.015){e.y=e.ty;e.vy=0;}}}
  else if(e.kind==='animal'){e.step++;if(e.flee){e.y-=1.4*(e.dir||1);e.x+=0.6;}
   else{if(e.tp==='hare'&&Math.random()<0.012)e.vy*=-1;// a nyúl cikázik
    if(e.tp==='deer'&&!e.froze&&(LEGS[G.leg].time==='night'||LEGS[G.leg].time==='dusk')&&P.lightMode>=2&&e.y>ROADT+12&&e.y<ROADB-6){const d=e.x-(P.dist+112);if(d>0&&d<260){e.froze=90;}}// az őz megbénul a fényszóróban
    if(e.froze>0){e.froze--;if(e.froze===0)e.froze=-1;}else e.y+=e.vy;}}
  else if(e.fly){e.fx+=e.fvx;e.fz+=e.fvz;e.fvz+=0.3;if(e.fz>40)e.gone=true;}
  if(e.gone||e.fly||e.done)continue;
  if(e.x<pr&&e.x+e.w>pl&&Math.abs(e.y-P.y)<8){
   if(e.kind==='hole'){e.done=true;if(P.kmh>15){P.vF-=1.6*(P.kmh/60);P.vR-=1.2*(P.kmh/60);SFX.bump();vib(40);G.shake=3;const s=seg();const ch=(s.q==='bad'?0.22:0.1)*Math.min(1.5,P.kmh/70);if(Math.random()<ch)flatTire();else if(P.kmh>60&&Math.random()<0.5)say('Hú, de nagy kátyú!','anya');}}
   else if(e.kind==='puddle'){e.done=true;if(P.kmh>20){G.trip.dirt=Math.min(1,(G.trip.dirt||0)+0.04);SFX.splash();P.kmh*=0.92;for(let k=0;k<14;k++)parts.push({type:'dot',x:P.dist+rnd(10,100),y:P.y-2,vx:rnd(-1,1.5),vy:rnd(-3,-1),life:28,max:28,col:'#9cc3e6',world:true});}}
   else if(e.kind==='cone'){if(P.kmh>3&&hit('Elütöttük a bóját!','anna')){damage(2,'cone');e.fly=true;e.fx=0;e.fz=0;e.fvx=3+P.kmh/40;e.fvz=-4;}}
   else if(e.kind==='traffic'){if(e.chase)continue;const rel=P.kmh-(e.cur||0);if(rel>2&&hit()){const d=clamp(6+rel*0.55+(rel>70?rel*0.25:0),6,100);P.kmh=Math.max(0,(e.cur||0)*0.7);P.scare=Math.max(P.scare||0,Math.min(1,rel/40));damage(d,'traffic');}}
   else if(e.kind==='animal'&&!e.flee&&!e.dead){if(P.kmh>5&&hit({deer:'Egy őz!',boar:'Vaddisznó!',fox:'Jaj, egy róka!',hare:'Szegény nyuszi!'}[e.tp]||'Bocsánat!','petra')){e.flee=true;wildHit(e);}}}}
 ents=ents.filter(e=>!e.gone&&e.x>P.dist-280&&!(e.kind==='animal'&&(e.y>ROADB+18||e.y<ROADT-40)));}
function weatherUpd(L,t){for(const d of drops){if(L.weather==='snow'){d.y+=d.v;d.x+=Math.sin(t*0.03+d.ph)*0.4-P.kmh*KPX*0.25*d.v;}else{d.y+=d.v;d.x-=d.v*(L.weather==='storm'?0.55:0.3)+P.kmh*KPX*0.3;}
  if(d.y>H){d.y=rnd(-30,-5);d.x=rnd(0,W+80);}if(d.x<-10)d.x+=W+80;}
 if(L.weather==='storm'&&G.flash<=0&&Math.random()<1/280){G.flash=12;G.thunder=22;G.bolt=rnd(60,420);}
 if(G.flash>0)G.flash--;if(G.thunder>0&&--G.thunder===0){SFX.thunder();if(Math.random()<0.5)say('Hűha, mennydörgés!','petra');}}
const LINES=[['Apa, mikor érünk oda?','anna'],['Anna elvette a plüssömet!','petra'],['Ott vagyunk már?','petra'],['Csss, Atti elaludt.','anya'],['Nézd, egy tehén!','petra'],
 ['Ki kér szendvicset?','anya'],['Énekeljünk!','anna'],['Gugu-gaga!','atti'],['Hol a térkép?','apa'],['Milyen szép a táj!','anya'],['Unatkozom!','anna'],['Kérek vizet!','petra'],['Ki látja előbb a tengert?','apa'],['Anya, mesélj!','petra']];
function chatter(){const s=seg(),rem=LEGS[G.leg].km-legKm();
 if(P.kmh>s.limit+15&&Math.random()<0.6){say('Lassíts, drágám! Itt csak '+s.limit+'!','anya');return;}
 if(Math.random()<0.2){say('Még '+fmt(Math.max(1,rem))+' km '+LEGS[G.leg].to.split(' ')[0]+'ig!','apa');return;}
 const l=pick(LINES);say(l[0],l[1]);}

/* ---------- kerékcsere ---------- */
function updFix(){const T=G.trip;P.fix++;P.haz=true;const f=P.fix;
 if(!T.spare){if(f===1)flash('Nincs pótkerék! Autómentő: 40 000 Ft (Enter / érintés)','#ff8a8a',99999);
  if(f>1&&K.enterP&&!P.tow){P.tow=f;book(-40000,'service','Autómentő: defekt, nincs pótkerék');SFX.siren();G.msg=null;flash('Jön az autómentő...','#ffb347',200);}
  if(P.tow&&f-P.tow>200){P.flat=null;P.sub='drive';P.hide.apa=0;P.tow=0;P.haz=false;flash('Megjavították a kereket. Mehetünk!','#7cff7c');}return;}
 // ajtó: kiszállás és visszaszállás
 P.door=f<22?f/22:f<60?Math.max(0,1-(f-40)/20):f>=700&&f<722?(f-700)/22:f>=722?Math.max(0,1-(f-740)/20):0;
 if(f===12)say('Kicserélem a kereket, maradjatok bent!','apa');
 if(f===140){SFX.clunk();say('Kitettem az elakadásjelzőt.','apa');}
 if(f===205)SFX.clunk();
 if((f>=290&&f<340&&f%14===0)||(f>=490&&f<520&&f%12===0)||(f>=565&&f<590&&f%10===0))tone(1400,0.03,'square',0.05);// racsni
 if(f>=350&&f<400&&f%16===0)noise(0.06,0.12,0,900);// emelő
 if(f===410)noise(0.15,0.2,0,1600);if(f===470)SFX.clunk();
 if(f>=760){P.flat=null;P.sub='drive';P.hide.apa=0;P.haz=false;P.door=0;T.spare=false;say('Kész is! Mehetünk!','apa');flash('Kicserélve! Vegyél új pótkereket a következő kútnál.','#7cff7c',260);SFX.pick();}}
function fixPose(){const f=P.fix,k=P.flat,wx=PX+(k==='f'?WHEELS[1]:WHEELS[0]),door=PX+60,rear=PX-10,triX=PX-74,kx=wx-26;
 const ez=u=>u<=0?0:u>=1?1:u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2,mv=(a,b,f0,f1)=>a+(b-a)*ez((f-f0)/(f1-f0));
 const o={px:door,mode:'stand',dir:1,tri:f>=140&&f<680?triX:null,triHand:false,lift:0,noWheel:null,spare:null,old:null,hand:null,wrench:false,jack:f>=345&&f<560};
 if(f<25){o.px=door;o.mode='stand';}
 else if(f<80){o.px=mv(door,rear,25,80);o.mode='walk';o.dir=-1;}
 else if(f<140){o.px=mv(rear,triX+6,80,140);o.mode='walk';o.dir=-1;o.triHand=true;}
 else if(f<190){o.px=mv(triX+6,rear,140,190);o.mode='walk';}
 else if(f<230){o.px=rear;o.mode='stand';o.spare={x:rear+12,flat:false};}
 else if(f<285){o.px=mv(rear,kx,230,285);o.mode='carry';o.spare={x:mv(rear+12,kx+48,230,285),flat:false};}
 else{o.px=kx;o.spare={x:wx+24,flat:false};
  const hub=[wx,P.y-55.5+WCY+2];
  if(f<345){o.mode='kneel';o.hand=hub;o.wrench=true;}
  else if(f<400){o.mode='pump';o.hand=[wx+12,P.y-6];o.lift=5*ez((f-345)/55);}
  else if(f<440){o.mode='kneel';o.lift=5;o.noWheel=k;o.old={x:mv(wx,wx-34,400,440),flat:true};o.hand=[o.old.x,hub[1]];}
  else if(f<480){o.mode='kneel';o.lift=5;o.old={x:wx-34,flat:true};o.spare={x:mv(wx+24,wx,440,480),flat:false};o.noWheel=f<478?k:null;o.hand=[o.spare.x,hub[1]];if(f>=478)o.spare=null;}
  else if(f<525){o.mode='kneel';o.lift=5;o.old={x:wx-34,flat:true};o.hand=hub;o.wrench=true;}
  else if(f<560){o.mode='pump';o.hand=[wx+12,P.y-6];o.lift=5*(1-ez((f-525)/35));o.old={x:wx-34,flat:true};}
  else if(f<595){o.mode='kneel';o.hand=hub;o.wrench=true;o.old={x:wx-34,flat:true};}
  else if(f<640){o.px=mv(kx,rear,595,640);o.mode='carry';o.dir=-1;o.old={x:mv(wx-34,rear-12,595,640),flat:true};}
  else if(f<680){o.px=mv(rear,triX+6,640,680);o.mode='walk';o.dir=-1;}
  else if(f<730){o.px=mv(triX+6,door,680,730);o.mode='walk';o.triHand=true;}
  else{o.px=door;o.mode='stand';}
  if(f>=478)o.spare=null;}
 return o;}

/* ---------- rajzolás: játék ---------- */
let [DK,dg]=mk(W,H,SC);
function onSC(){[DK,dg]=mk(W,H,SC);COBBLE=null;for(const k in MAPCACHE)delete MAPCACHE[k];}
function darkness(g,L){let a=0;if(L.time==='night')a=0.62;else if(L.time==='dusk')a=0.26;else if(L.weather==='storm')a=0.3;else if(L.time==='sunset')a=0.05;
 if(L.time==='dusk'||L.time==='sunset')R(g,'rgba(255,130,60,0.1)',0,0,W,H);if(a<=0)return;
 dg.setTransform(SC,0,0,SC,0,0);dg.globalCompositeOperation='source-over';dg.clearRect(0,0,W,H);dg.fillStyle='rgba(8,12,38,'+a+')';dg.fillRect(0,0,W,H);dg.globalCompositeOperation='destination-out';
 for(const l of lights){if(l.cone){const ln=l.high?320:170,sp=l.high?44:22;const gr=dg.createLinearGradient(l.x,0,l.x+ln,0);gr.addColorStop(0,'rgba(0,0,0,0.97)');gr.addColorStop(1,'rgba(0,0,0,0)');dg.fillStyle=gr;dg.beginPath();dg.moveTo(l.x,l.y-2);dg.lineTo(l.x+ln,l.y-sp);dg.lineTo(l.x+ln,l.g+10);dg.lineTo(l.x,l.y+3);dg.closePath();dg.fill();}
  else{dg.fillStyle=rg(dg,l.x,l.y,0,l.r,[[0,'rgba(0,0,0,0.9)'],[1,'rgba(0,0,0,0)']]);dg.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2);}}
 dg.globalCompositeOperation='source-over';g.drawImage(DK,0,0,W,H);}
function drawWeather(g,L,t){if(L.weather==='rain'||L.weather==='storm'){R(g,'rgba(40,60,90,0.12)',0,0,W,H);g.strokeStyle='rgba(190,215,240,0.7)';g.lineWidth=0.6;g.beginPath();for(const d of drops){g.moveTo(d.x,d.y);g.lineTo(d.x-1.4,d.y+5);}g.stroke();}
 else if(L.weather==='snow'){g.fillStyle='#ffffff';for(const d of drops){g.beginPath();g.arc(d.x,d.y,d.v>1.1?1.1:0.7,0,TAU);g.fill();}}
 else if(L.weather==='fog'){R(g,'rgba(225,230,236,0.22)',0,0,W,H);for(let i=0;i<6;i++){const x=((hsh(i)*W*2-t*(0.3+i*0.1)-P.dist*0.3)%(W+200)+W+200)%(W+200)-100;ell(g,'rgba(240,244,248,0.2)',x,150+hsh(i*7)*90,90,12);}}
 if(G.flash>0){if(G.flash>8){let x=G.bolt,y=0;g.strokeStyle='#ffffff';g.lineWidth=1.3;g.beginPath();g.moveTo(x,y);for(let k=0;k<9;k++){x+=rnd(-12,12);y+=14;g.lineTo(x,y);}g.stroke();}R(g,'rgba(255,255,255,'+(G.flash/18)+')',0,0,W,H);}}
function drawSkids(g){if(!P.skids)return;for(const s of P.skids){for(const [wx,dy,al] of [[24,-0.8,0.75],[89,-0.8,0.7],[24,-7,0.35],[89,-7,0.3]]){const a=s.x0+wx-P.dist+PX,b=s.x1+wx-P.dist+PX;if(b<-10||a>W+10||b-a<1)continue;
  g.fillStyle=lg(g,a,0,b,0,[[0,'rgba(20,20,22,0)'],[Math.min(0.3,12/(b-a)),'rgba(20,20,22,'+al+')'],[1,'rgba(20,20,22,'+al+')']]);g.fillRect(a,s.y+dy-1.1,b-a,2.2);}}}
function drawPlayer(g,t){const fp=P.sub==='fix'?fixPose():null,fl=P.flat&&!(fp&&(fp.noWheel||P.fix>=478))?P.flat:null,sF=fl==='f'?3.2:0,sR=fl==='r'?3.2:0;
 const gy=P.y,body=gy-55.5+(P.yF+sF+P.yR+sR)/2,pitch=Math.atan2((P.yF+sF)-(P.yR+sR),65);
 g.fillStyle=rg(g,PX+57,gy,4,60,[[0,'rgba(0,0,0,0.38)'],[1,'rgba(0,0,0,0)']]);g.save();g.translate(PX+57,gy);g.scale(1,0.07);g.beginPath();g.arc(0,0,60,0,TAU);g.fill();g.restore();
 if(P.inv>0&&((t>>2)&1))g.globalAlpha=0.55;
 const blinkOn=(t%40)<20;
 drawCarSide(g,PX,body,gy-55.5,{dirt:G.trip.dirt||0,dmg:1-hpOf(G.trip)/100,spd:Math.abs(P.kmh),airbag:G.trip.airbag===1?Math.min(1,(P.abT||0)/6):G.trip.airbag===2?2:0,scare:P.scare,lean:P.lean,t:t,ang:P.ang,pitch:pitch,wF:P.wF,wR:P.wR,hide:P.hide,door:P.door,brake:P.brake||P.sub!=='drive'||Math.abs(P.kmh)<0.5&&!P.arriving&&P.boarding<0,blink:(P.blink>0||P.haz||P.flat||P.sub==='fix')&&blinkOn,
  pos:P.lightMode>=1,lightsOn:P.lightMode>=2,high:P.lightMode===3||P.flashOn,fogF:P.fogF,fogR:P.fogR,rev:P.rev,flat:fl,noWheel:fp?fp.noWheel:null,jack:fp&&fp.jack?P.flat:null,lift:fp?fp.lift:0,
  flap:P.sub==='pump'||(P.sub==='shop'&&P.shop&&P.shop.type==='fuel'),wiping:['rain','storm','snow'].includes(LEGS[G.leg].weather),bounce:P.kmh>1},lights);
 g.globalAlpha=1;
 if(fp){if(fp.tri)triangle(g,fp.tri,gy+3);if(fp.old)wheel(g,fp.old.x,gy-WR+1,0,true);if(fp.spare)wheel(g,fp.spare.x,gy-WR,0,false);
  const hd=person(g,fp.px,gy+4,'apa',t,fp.mode,{dir:fp.dir,hand:fp.hand});
  if(fp.triHand&&hd)triangle(g,fp.px+(fp.dir<0?-6:10),gy-8);
  if(fp.wrench&&fp.hand){const a=t*0.3;line(g,'#9aa3ad',fp.hand[0],fp.hand[1],fp.hand[0]+Math.cos(a)*7,fp.hand[1]+Math.sin(a)*7,1.4);disc(g,'#cfd6dc',fp.hand[0],fp.hand[1],1.2);}}
 if((P.sub==='pump'||P.sub==='shop'&&P.shop&&P.shop.type==='fuel')&&P.pump){const q=P.pump.q-P.dist+PX;person(g,PX-10,gy+4,'apa',t,'work');g.strokeStyle='#1b1f2a';g.lineWidth=1;g.beginPath();g.moveTo(q+13,ROADT-14);g.quadraticCurveTo((q+PX+13)/2,gy-6,PX+13.6,body+31);g.stroke();frr(g,'#2e8b57',PX+11.6,body+29.6,4,2.4,1);}
 if(P.ev&&EVDEF[P.ev.type]&&P.ev.stopT>0){const out=EVDEF[P.ev.type].out;let k=0;for(const w of out)if(w!=='atti')person(g,PX+34+k++*18,gy+5,w,t,'wave');}}
function drawBubble(g){if(!P.bub)return;const b=P.bub,txt=b.txt.toUpperCase(),w=textW(txt)+8,hx=WHO_X[b.who]||40;
 const ax=PX+hx,top=P.y-55.5-18;let bx=clamp(ax-w/2,2,W-w-2);frr(g,'#ffffff',bx,top,w,11,3);g.strokeStyle='#1b1f2a';g.lineWidth=0.6;rrect(g,bx,top,w,11,3);g.stroke();
 poly(g,'#ffffff',[[-3,0],[3,0],[0,5]],ax,top+10.5);text(g,txt,bx+4,top+2.4,'#1b1f2a',1,'left',null);}
/* ---- mini műszerfal ---- */
function gauge(g,cx,cy,r,v,max,ticks,redFrom){const a0=Math.PI*0.75,a1=Math.PI*2.25;
 g.fillStyle=rg(g,cx,cy-r*0.4,1,r*1.4,[[0,'#1f2633'],[1,'#07090f']]);g.beginPath();g.arc(cx,cy,r+1.4,0,TAU);g.fill();g.strokeStyle='#5a6474';g.lineWidth=0.9;g.beginPath();g.arc(cx,cy,r+1.2,0,TAU);g.stroke();
 if(redFrom!==undefined){g.strokeStyle='rgba(255,60,60,0.85)';g.lineWidth=1.6;g.beginPath();g.arc(cx,cy,r-1.2,a0+(a1-a0)*redFrom,a1);g.stroke();}
 for(let i=0;i<=ticks;i++){const a=a0+(a1-a0)*i/ticks,big=i%2===0;line(g,'#d7dee6',cx+Math.cos(a)*(r-(big?3.4:2.2)),cy+Math.sin(a)*(r-(big?3.4:2.2)),cx+Math.cos(a)*(r-0.6),cy+Math.sin(a)*(r-0.6),big?0.8:0.5);}
 const a=a0+(a1-a0)*clamp(v/max,0,1);line(g,'#ff4433',cx-Math.cos(a)*r*0.15,cy-Math.sin(a)*r*0.15,cx+Math.cos(a)*r*0.86,cy+Math.sin(a)*r*0.86,1.2);disc(g,'#3a414c',cx,cy,1.8);disc(g,'#9aa4ae',cx,cy,0.7);}
const LAMPC={pos:'#5bd06a',low:'#5bd06a',high:'#3b8bff',fogF:'#5bd06a',fogR:'#ffaa22',blL:'#5bd06a',blR:'#5bd06a',haz:'#ff4d4d',fuel:'#ffaa22',door:'#ff4d4d',rev:'#ffffff',radio:'#7fd1ff',tyre:'#ffaa22',brake:'#ff4d4d'};
function lamp(g,x,y,type,on){const c=on?LAMPC[type]:'#2b313c';if(on)glow(g,x+4,y+3.5,6,c.replace('#','rgba(').length?'rgba(255,255,255,0.08)':'');g.strokeStyle=c;g.fillStyle=c;g.lineWidth=0.8;
 const D=(dx,flip)=>{g.beginPath();if(!flip)g.arc(x+dx,y+3.5,2.6,-Math.PI/2,Math.PI/2);else g.arc(x+dx,y+3.5,2.6,Math.PI/2,Math.PI*1.5);g.closePath();g.fill();};
 if(type==='low'||type==='high'||type==='fogF'){D(0.8);for(let k=0;k<3;k++){const yy=y+1.5+k*2;line(g,c,x+4.5,yy,x+8.5,yy+(type==='low'?1.2:0),0.7);}if(type==='fogF')line(g,c,x+6.5,y,x+6.5,y+7,0.6);}
 else if(type==='fogR'){D(6.5,true);for(let k=0;k<3;k++)line(g,c,x+0.5,y+1.5+k*2,x+3.6,y+1.5+k*2,0.7);line(g,c,x+2,y,x+2,y+7,0.6);}
 else if(type==='pos'){D(2.4,true);D(5.6);line(g,c,x-0.4,y+1.4,x+0.6,y+2,0.6);line(g,c,x+8.6,y+1.4,x+7.6,y+2,0.6);}
 else if(type==='blL'){g.beginPath();g.moveTo(x,y+3.5);g.lineTo(x+4,y);g.lineTo(x+4,y+7);g.closePath();g.fill();g.fillRect(x+4,y+2,4,3);}
 else if(type==='blR'){g.beginPath();g.moveTo(x+8,y+3.5);g.lineTo(x+4,y);g.lineTo(x+4,y+7);g.closePath();g.fill();g.fillRect(x,y+2,4,3);}
 else if(type==='haz'){g.beginPath();g.moveTo(x+4,y);g.lineTo(x+8,y+7);g.lineTo(x,y+7);g.closePath();g.stroke();}
 else if(type==='fuel'){g.fillRect(x+1,y+1,4,6);g.fillStyle='#0b0f17';g.fillRect(x+1.8,y+1.8,2.4,1.6);line(g,c,x+5,y+2,x+7,y+3,0.6);line(g,c,x+7,y+3,x+7,y+6,0.6);}
 else if(type==='door'){g.strokeRect(x+1,y+0.5,4,6.5);line(g,c,x+5,y+1,x+8,y+2.5,0.8);}
 else if(type==='rev'){text(g,'R',x+1.5,y,c,1,'left',null);}
 else if(type==='radio'){g.strokeRect(x+0.5,y+1.5,7,5);disc(g,c,x+5.5,y+4,1);line(g,c,x+1,y+1.5,x+5,y-0.5,0.6);}
 else if(type==='tyre'){g.beginPath();g.arc(x+4,y+3.5,3.2,Math.PI*0.75,Math.PI*2.25);g.stroke();text(g,'!',x+2.5,y+0.5,c,0.8,'left',null);}
 else if(type==='brake'){g.beginPath();g.arc(x+4,y+3.5,3,0,TAU);g.stroke();text(g,'!',x+2.5,y+0.5,c,0.8,'left',null);}}
/* ---- jobb oldali „közeledik” lista: kis ikonok távolsággal ---- */
function upIcon(g,k,x,y,st){// 9x9-es ikonok
 const box=(c)=>frr(g,c,x,y,9,9,2);
 if(k==='fuel'){box('#2e8b57');frr(g,'#ffffff',x+2,y+2,3.4,5.2,0.6);R(g,'#2e8b57',x+2.6,y+2.6,2.2,1.6);line(g,'#ffffff',x+5.4,y+3,x+7,y+4.4,0.7);line(g,'#ffffff',x+7,y+4.4,x+7,y+6.6,0.7);}
 else if(k==='kis'){box('#2e7d4f');line(g,'#fff',x+1.6,y+2.6,x+2.8,y+2.6,0.7);g.strokeStyle='#fff';g.lineWidth=0.7;g.beginPath();g.moveTo(x+2.6,y+2.6);g.lineTo(x+3.4,y+5.6);g.lineTo(x+7,y+5.6);g.lineTo(x+7.4,y+3.4);g.lineTo(x+3,y+3.4);g.stroke();disc(g,'#fff',x+4,y+7,0.7);disc(g,'#fff',x+6.4,y+7,0.7);}
 else if(k==='hiper'){box('#1e4fb5');text(g,'H',x+4.6,y+2,'#ffd84a',1,'center',null);}
 else if(k==='trafik'){box('#5a4632');text(g,'T',x+4.6,y+2,'#ffffff',1,'center',null);}
 else if(k==='ujsag'){box('#2f6b45');frr(g,'#ffffff',x+2,y+2,5,5.4,0.6);for(let i=0;i<3;i++)R(g,'#2f6b45',x+2.8,y+3+i*1.4,3.4,0.5);}
 else if(k==='veda'){box('#3a3f47');frr(g,'#ffd84a',x+1.6,y+3,5.6,3.6,0.8);disc(g,'#3a3f47',x+4.4,y+4.8,1.2);disc(g,'#9fd8ff',x+4.4,y+4.8,0.6);}
 else if(k==='light'){frr(g,'#1b1f26',x+2,y,5,9,1.5);disc(g,st==='red'?'#ff3b30':'#3a1512',x+4.5,y+1.8,1.2);disc(g,st==='yellow'?'#ffcc00':'#3a3212',x+4.5,y+4.5,1.2);disc(g,st==='green'?'#34c759':'#0f2a16',x+4.5,y+7.2,1.2);}
 else if(k==='town'){frr(g,'#ffd84a',x,y+1.5,9,6,1);frr(g,'#1a1a1a',x+0.8,y+2.3,7.4,4.4,0.6);frr(g,'#ffd84a',x+1.4,y+2.9,6.2,3.2,0.4);}
 else if(k==='motorway'){box('#1f5fbf');line(g,'#fff',x+2.6,y+7.4,x+3.6,y+2,0.8);line(g,'#fff',x+6.4,y+7.4,x+5.4,y+2,0.8);line(g,'#fff',x+4.5,y+3,x+4.5,y+3.8,0.6);line(g,'#fff',x+4.5,y+5.4,x+4.5,y+6.4,0.6);}
 else if(k==='burger'){box('#0e7c7b');disc(g,'#f2b155',x+4.5,y+3.6,2.6);R(g,'#5b2b14',x+1.8,y+4.6,5.4,1.1);R(g,'#7cc04a',x+1.8,y+5.6,5.4,0.6);frr(g,'#e8a03e',x+1.9,y+6.2,5.2,1.8,0.8);}
 else if(k==='garage'){box('#c62828');g.save();g.translate(x+4.5,y+4.5);g.rotate(-0.7);R(g,'#ffffff',-0.7,-1,1.4,5);g.strokeStyle='#ffffff';g.lineWidth=1.1;g.beginPath();g.arc(0,-2,1.6,0.5,5.8);g.stroke();g.restore();}
 else if(k==='wash'){box('#1e88e5');disc(g,'#ffffff',x+3,y+3.4,1.6);disc(g,'#ffffff',x+6,y+5.6,1.3);disc(g,'#bfe6ff',x+5.6,y+2.4,1);}
 else if(k==='rest'){box('#1f5fbf');text(g,'P',x+4.6,y+2,'#ffffff',1,'center',null);}
 else if(k==='flag'){line(g,'#e6ebf2',x+2,y+0.5,x+2,y+9,0.8);for(let i=0;i<3;i++)for(let j=0;j<2;j++)R(g,(i+j)%2?'#1a1a1a':'#ffffff',x+2.4+i*1.9,y+1+j*1.8,1.9,1.8);}
 else{g.fillStyle='#ffb02e';g.beginPath();g.moveTo(x+4.5,y+0.6);g.lineTo(x+8.8,y+8.4);g.lineTo(x+0.2,y+8.4);g.closePath();g.fill();R(g,'#1a1a1a',x+4,y+3,1,3);R(g,'#1a1a1a',x+4,y+6.6,1,1);}}
function upcoming(){const out=[],kp=LEG.kmPerPx,front=P.dist+112;
 let nf=null;for(const p of LEG.pois){const d=(p.x-front)*kp;if(p.type==='fuel'&&d>2&&d<60&&!nf){nf=p;out.push({k:'fuel',d:d,n:POI_NAME.fuel});}if(d<0||d>2)continue;if(p.type==='veda'&&p.passed)continue;out.push({k:p.type,d:d,n:POI_NAME[p.type]});}
 for(const l of LEG.lights){const d=(l.x-front)*kp;if(d>0&&d<0.6)out.push({k:'light',d:d,n:'Lámpa',st:lightState(l,G.t)});}
 for(let i=1;i<LEG.segs.length;i++){const s=LEG.segs[i],d=(s.x0-front)*kp,pv=LEG.segs[i-1];if(d<0||d>3)continue;
  if((s.type==='town'||s.type==='village')&&s.name&&s.name!==pv.name)out.push({k:'town',d:d,n:s.name});else if(s.type==='motorway'&&pv.type!=='motorway')out.push({k:'motorway',d:d,n:s.name||'Autópálya'});}
 const dd=(LEG.len-front)*kp;if(dd>0)out.push({k:'flag',d:dd,n:LEGS[G.leg].to.split(' (')[0]});
 for(const e of ents){const d=(e.x-front)*kp;if(d<0||d>0.4)continue;
  if(e.kind==='hole'||e.kind==='cone'||e.kind==='animal'||(e.kind==='traffic'&&(e.wreck||e.jam||e.help))){if(e.kind!=='traffic'&&e.lane!==undefined&&e.lane!==P.lane&&e.kind!=='animal')continue;
   out.push({k:'warn',d:d,n:e.kind==='hole'?'Kátyú':e.kind==='cone'?'Útépítés':e.kind==='animal'?'Állat':e.wreck?'Baleset':e.jam?'Dugó':'Lerobbant autó'});}}
 out.sort((a,b)=>a.d-b.d);const seen={},res=[];for(const o of out){const key=o.k+o.n;if(seen[key])continue;seen[key]=1;res.push(o);if(res.length>=5)break;}return res;}
function drawUpcoming(g,x0,y0,maxY){const list=upcoming();let y=y0;const w=W-3-x0;
 for(const o of list){if(y+12>maxY)break;const near=o.d<0.15;frr(g,near?'rgba(60,20,16,0.82)':'rgba(8,11,18,0.78)',x0,y,w,11,5);upIcon(g,o.k,x0+1.5,y+1,o.st);
  const ds=o.d<1?Math.max(10,Math.round(o.d*1000/10)*10)+' M':fmt(o.d,1)+' KM';text(g,ds,W-6,y+3,near?'#ffb3a8':'#ffffff',1,'right',null);
  const nm=o.n.toUpperCase(),room=w-14-textW(ds)-6;let nn=nm;while(nn.length>2&&textW(nn)>room)nn=nn.slice(0,-1);if(nn!==nm)nn=nn.slice(0,-1)+'.';text(g,nn,x0+13,y+3,'#9fb0c2',1,'left',null);y+=13;}}
function drawHUD(g){const L=LEGS[G.leg],T=G.trip,s=seg(),t=G.t,blinkOn=(t%40)<20;
 // bal oldal: műszerfal
 frr(g,'rgba(8,11,18,0.85)',3,3,204,46,10);g.strokeStyle='rgba(255,255,255,0.14)';g.lineWidth=0.7;rrect(g,3,3,204,46,10);g.stroke();
 const sp=Math.abs(P.kmh),over=P.kmh>s.limit+5;gauge(g,26,26,19,sp,200,10);text(g,String(Math.round(sp)),26,31,over?'#ff6b6b':'#ffffff',1,'center',null);
 gauge(g,67,27,15,P.rpm||0,7000,7,6/7);text(g,String(P.gear||'N'),67,29,'#ffd84a',1,'center',null);if(P.cruise){frr(g,'#123a5a',52,40,30,9,3);text(g,'T'+P.cruise,67,41,'#7fd1ff',1,'center',null);}
 const fl=T.fuel/CAR.tank;frr(g,'#1b212b',89,8,5,28,2);frr(g,fl>0.25?'#5bd06a':fl>0.12?'#ffcf33':'#ff4d4d',89.6,8.6+26.8*(1-fl),3.8,26.8*fl,1.6);text(g,'F',96,8,'#8a96a6',1,'left',null);text(g,'E',96,29,'#8a96a6',1,'left',null);
 text(g,fmt(T.fuel,0)+'l',93,39,T.fuel<7?'#ff6b6b':'#cfd6df',1,'center',null);
 disc(g,'#d32f2f',117,16,7);disc(g,'#ffffff',117,16,5.4);text(g,String(s.limit),117.4,13.6,'#111',s.limit>=100?0.5:0.62,'center',null);
 const avg=P.avgKm>0.5?P.avgL/P.avgKm*100:0;text(g,'Ø'+(avg?fmt(avg,1):'-'),117,29,'#cfd6df',1,'center',null);
 const lamps=[['pos',P.lightMode>=1],['low',P.lightMode>=2],['high',P.lightMode===3||P.flashOn],['fogF',P.fogF],['fogR',P.fogR],
  ['blL',(P.haz||P.flat||P.blink>0&&P.lastLane>P.lane)&&blinkOn],['blR',(P.haz||P.flat||P.blink>0&&P.lastLane<P.lane)&&blinkOn],['haz',P.haz],['rev',P.rev],['door',P.door>0.05],
  ['fuel',T.fuel<7],['radio',radio.on],['tyre',!!P.flat||!T.spare],['brake',!!P.hb]];
 lamps.forEach((l,i)=>lamp(g,134+(i%5)*14,9+Math.floor(i/5)*12,l[0],l[1]));
 // közép: kedv
 for(let i=0;i<5;i++)text(g,'♥',W/2-17+i*7,31,i<T.mood?'#ff4d6d':'#3a404c',1,'left',null);{const m=Math.floor((T.driveS||0)/60);text(g,'Vez. '+m+' p',W/2,(L.live?50:41),m>=30?((t>>4)&1?'#ff6b6b':'#ffcf33'):m>=25?'#ffcf33':'#8a96a6',1,'center',null);}if(L.live)text(g,fmt(L.temp,0)+' °C'.replace('°',''),W/2,41,'#9fd8ff',1,'center');
 // jobb oldal: út, pénz, készletek
 const rx=W-207;frr(g,'rgba(8,11,18,0.85)',rx,3,204,46,10);g.strokeStyle='rgba(255,255,255,0.14)';g.lineWidth=0.7;rrect(g,rx,3,204,46,10);g.stroke();
 const route=(L.from.split(',')[0]+' > '+L.to).toUpperCase();text(g,route.length>21?route.slice(0,20)+'.':route,rx+7,8,'#ffd84a',1,'left',null);{const lt=G.lastTx&&G.lastTx.t<110?G.lastTx:null;if(lt)lt.t++;const ms=lt&&lt.t<80?(lt.a>0?'+':'-')+fmt(Math.abs(lt.a))+' Ft':fmt(T.money)+' Ft';const mw=textW(ms)+16;
  frr(g,lt&&lt.t<80?(lt.a>0?'rgba(40,140,70,0.55)':'rgba(170,50,50,0.5)'):'rgba(255,255,255,0.08)',W-8-mw,3.5,mw+3,10,5);
  text(g,ms,W-13,6,lt&&lt.t<80?'#ffffff':T.money<0?'#ff8a8a':'#b7ffcf',1,'right',null);poly(g,'rgba(255,255,255,0.55)',[[W-10.5,6],[W-7.5,8.5],[W-10.5,11]]);}
 const pr=Math.min(1,P.dist/LEG.len),bx=rx+7,bw=190;frr(g,'#1b212b',bx,18,bw,4,2);frr(g,lg(g,bx,0,bx+bw,0,[[0,'#2f8fd8'],[1,'#4fc3f7']]),bx,18,bw*pr,4,2);
 for(const p of LEG.pois)if(p.type==='fuel')disc(g,'#5bd06a',bx+bw*p.x/LEG.len,20,1.1);disc(g,'#ffd84a',bx+bw*pr,20,2.2);
 text(g,distStr(legKm())+' / '+fmt(L.km)+' km',rx+7,26,'#ffffff',1,'left',null);text(g,'Össz '+fmt(T.km,0)+' km',W-10,26,'#9fb0c2',1,'right',null);
 const bar=(x,lbl,v)=>{text(g,lbl,x,37,'#9fb0c2',1,'left',null);frr(g,'#1b212b',x+textW(lbl)+3,38,30,5,2);frr(g,v<20?'#ff6b6b':v<45?'#ffcf33':'#5bd06a',x+textW(lbl)+3,38,30*v/100,5,2);};
 bar(rx+7,'Kaja',T.food);bar(rx+70,'Baba',T.baby);bar(rx+133,'Autó',hpOf(T));
 // minitérkép (érintésre nagyobb)
 const mr=mapRect();frr(g,'rgba(8,11,18,0.85)',mr[0]-2,mr[1]-2,mr[2]+4,mr[3]+4,9);if(G.mapBig)drawMiniMap(g,mr,G.leg,Math.min(1,P.dist/LEG.len),t);else{drawGPSCached(g,mr,G.leg,Math.min(1,P.dist/LEG.len),t,L.time==='night'||L.time==='dusk',Math.abs(P.kmh),Math.max(0,L.km-legKm()));drawUpcoming(g,mr[0]-2,mr[1]+mr[3]+5,ROADT+4);}
 // jelzések
 const cxp=(W-mr[2]-8)/2+2;let y=isTouch?94:54;const pill=(txt,col)=>{const w=textW(txt.toUpperCase())+10;frr(g,'rgba(8,11,18,0.72)',cxp-w/2,y-2,w,11,5);text(g,txt,cxp,y,col,1,'center',null);y+=13;};
 if(G.segInfo)pill(G.segInfo.txt,'#ffffff');if(G.msg)pill(G.msg.txt,G.msg.col);
 if(P.ev&&EVDEF[P.ev.type]){const d=EVDEF[P.ev.type];pill(d.msg,'#ffb347');const pr2=P.ev.stopT/d.stop;frr(g,'#2a2f3a',cxp-60,y-3,120,4,2);frr(g,P.ev.stopT?'#5bd06a':'#ff8a5a',cxp-60,y-3,120*(P.ev.stopT?pr2:P.ev.t/d.time),4,2);y+=5;}
 G.chips=[];if(P.sub==='drive'){
  if(P.auto){const d=Math.max(0,(P.auto.tx-P.dist)*LEG.kmPerPx);const tx='MEGÁLLÁS: '+POI_NAME[P.auto.type].toUpperCase()+' '+distStr(d).toUpperCase()+'   X MÉGSE';const w=textW(tx)+14;
   frr(g,'rgba(30,110,60,0.9)',cxp-w/2,y-3,w,13,6);g.strokeStyle='rgba(255,255,255,0.5)';g.lineWidth=0.6;rrect(g,cxp-w/2,y-3,w,13,6);g.stroke();text(g,tx,cxp,y,'#ffffff',1,'center',null);G.chips.push({r:[cxp-w/2-4,y-6,w+8,19],cancel:true});y+=16;}
  else if(!P.flat){const cs=stopChips();if(cs.length){const items=cs.map(c=>({c:c,t:'P '+POI_NAME[c.p.type].toUpperCase()+' '+distStr(c.d).toUpperCase()}));const gap=4;let tw=-gap;for(const it of items){it.w=textW(it.t)+12;tw+=it.w+gap;}
   let x=cxp-tw/2;const pulse=0.5+0.5*Math.sin(G.t*0.12);for(const it of items){frr(g,'rgba(8,11,18,0.78)',x,y-3,it.w,13,6);g.strokeStyle='rgba(124,217,156,'+(0.45+pulse*0.4)+')';g.lineWidth=0.8;rrect(g,x,y-3,it.w,13,6);g.stroke();
    frr(g,'#2e8b57',x+2,y-1.5,9,10,3);text(g,'P',x+6.5,y,'#ffffff',1,'center',null);text(g,it.t.slice(2),x+13,y,'#bff5cf',1,'left',null);G.chips.push({r:[x-2,y-7,it.w+4,21],p:it.c.p});x+=it.w+gap;}y+=16;}}
  const vd=LEG.pois.find(p=>p.type==='veda'&&!p.passed&&(p.x-P.dist)*LEG.kmPerPx>0.05&&(p.x-P.dist)*LEG.kmPerPx<0.6);if(vd)pill('Sebességmérés '+distStr((vd.x-P.dist)*LEG.kmPerPx),'#ffcf33');}
 if(P.flat&&P.sub==='drive')pill('Defekt! Állj meg a szélső (felső) sávban!','#ff6b6b');
 if((T.driveS||0)>=1800&&P.sub==='drive'&&((t>>5)&1))pill('Apa fáradt: tarts pihenőt (P)!','#ffcf33');
 if(P.sub==='total')pill(P.tt<330?'Totálkár: a tréler úton van...':P.tt<630?'Az autót felhúzzák a trélerre':'Irány a szerviz, 10 km-rel vissza','#ff8a5a');
 if(P.sub==='repair'&&P.rp)pill('Szerviz: javítás '+Math.min(100,Math.round(P.rp.t/420*100))+'%'+(P.rp.t>150?' - koppints a továbbhoz':''),'#ffd84a');
 if(P.sub==='wash'&&P.wash&&P.wash.step==='run'){const pr=WASH_PROGS[P.wash.prog];pill('Autómosó: '+WASH_NAME[P.wash.phase]+' ('+(Math.floor(P.wash.t/110)+1)+'/'+pr.ph.length+')','#7fd1ff');}
 if(P.sub==='rest'&&P.rest)pill('Pihenő: nyújtózkodás, játszótér'+(P.rest.t>150?' - koppints a továbbhoz':''),'#bff5cf');
 if(P.cranky&&P.sub==='drive'&&((t>>5)&1))pill('A család nyűgös: állj meg pihenni!','#ff8a5a');
 if(radio.show>0){g.globalAlpha=Math.min(1,radio.show/30);const nm=radio.on?STATIONS[radio.idx].name:'Rádió kikapcsolva';text(g,nm,W/2,isTouch?140:84,'#ffd84a',1.8,'center','#3a1a00');g.globalAlpha=1;}
 if(G.banner>0&&G.banner<230&&P.boarding<0){const a=Math.min(1,G.banner/30);g.globalAlpha=a;frr(g,'rgba(8,11,18,0.85)',70,100,340,50,8);text(g,L.from+' > '+L.to,W/2,108,'#ffd84a',1.3,'center');
  text(g,fmt(L.km)+' km  -  '+WNAME[L.weather]+TNAME[L.time]+'  -  benzin: '+L.price+' Ft/l',W/2,125,'#ffffff',1,'center');text(g,'Gáz: jobbra nyíl / GÁZ pedál',W/2,137,'#9fb0c2',1,'center');g.globalAlpha=1;}
 if(G.paused)R(g,'rgba(10,12,20,0.55)',0,0,W,H);}
function drawParts(g,world){for(const p of parts){if(!!p.world!==world)continue;const x=p.world?p.x-P.dist+PX:p.x,y=p.y;
 if(p.type==='puff'){disc(g,p.col,x,y,1+(1-p.life/p.max)*4);}else frr(g,p.col,x,y,2,2,1);}}
function drawPlay(g){const L=LEGS[G.leg],t=G.t;lights=[];const s=seg();
 g.save();if(G.shake>0)g.translate(rnd(-1.5,1.5),rnd(-1.5,1.5));
 const rough=P.kmh>10?(QAMP[s.q]*P.kmh/400):0;if(rough>0.05)g.translate(0,rnd(-rough,rough));
 drawSky(g,L,t);drawClouds(g,L,P.dist,t);drawFar(g,L,s,P.dist,lights);drawMid(g,L,LEG,P.dist,lights);
 if(L.weather==='fog')R(g,'rgba(222,228,234,0.55)',0,0,W,ROADT);
 if(G.leg===0&&P.dist<400){house(g,PX+14-P.dist,ROADT-8,'#f2e2b8','#b5452b',L.time==='night',lights,false,'12');roadSign(g,PX-66-P.dist,ROADT-4,'Táncsics Mihály utca','town');}
 drawNear(g,L,LEG,P.dist,lights,t);drawRoad(g,L,LEG,P.dist,t);drawMarkings(g,LEG,P.dist,t);drawSkids(g);
 drawPOIs(g,L,LEG,P.dist,lights,t);
 const dsx=LEG.len+260-P.dist+PX;if(dsx<W+150&&dsx>-200){const txt=(G.leg===LEGS.length-1?'Isten hozott itthon, Komárom!':'Üdvözöl: '+L.to).toUpperCase(),w=textW(txt)+16;line(g,'#6b4a2b',dsx+6,ROADT-8,dsx+6,ROADT-70,2.4);line(g,'#6b4a2b',dsx+w-6,ROADT-8,dsx+w-6,ROADT-70,2.4);frr(g,'#ffffff',dsx,ROADT-88,w,24,2);frr(g,'#2e7d4f',dsx+2,ROADT-86,w-4,20,2);text(g,txt,dsx+8,ROADT-79,'#ffffff',1,'left',null);}
 for(const l of LEG.lights)drawTrafficLight(g,l,P.dist,t);
 if(P.ws!==undefined&&P.ws!==null)drawGarage(g,P.ws-P.dist+PX,L.time==='night'||L.time==='dusk',lights,t,P.sub==='repair');
 if(P.sub==='rest'&&P.rest)drawRest(g,t);
 const list=ents.map(e=>({y:e.y,e:e}));list.push({y:P.y+0.01,e:null});list.sort((a,b)=>a.y-b.y);
 if(P.sub==='wash'&&P.wash&&P.wash.step!=='menu')drawWashBack(g,t);
 for(const it of list){const e=it.e;if(!e){if(P.tw)drawTowTruck(g,P.tw.x+P.tw.dx,P.y,P.tw.tilt,t,lights);if(P.carOff){g.save();g.translate(P.carOff.x,P.carOff.y);}drawPlayer(g,t);if(P.carOff)g.restore();if(P.sub==='wash')drawWashFront(g,t);if(P.sparkle>0){P.sparkle--;for(let k=0;k<6;k++){const ph=((t+k*17)%40)/40,sx=PX+10+hsh(k*7+((t/40)|0))*96,sy=P.y-50+hsh(k*3+((t/40)|0))*30,r=Math.sin(ph*Math.PI)*3;if(r>0.3){line(g,'#ffffff',sx-r,sy,sx+r,sy,0.6);line(g,'#ffffff',sx,sy-r,sx,sy+r,0.6);}}}continue;}const ex=e.x-P.dist+PX;if(ex<-140||ex>W+20)continue;
  if(e.kind==='traffic'){const cover=it.y>P.y&&ex<PX+112&&ex+e.w>PX&&e.y-P.y<46;e.fa=lerp(e.fa===undefined?1:e.fa,cover?0.38:1,0.12);if(e.fa<0.98)g.globalAlpha=e.fa;drawTraffic(g,e,ex,lights,P.lightMode>=2,t);g.globalAlpha=1;if(e.help){if((t>>4)&1){glow(g,ex+e.w-1,e.y-14,6,'rgba(255,170,30,0.9)');glow(g,ex+1,e.y-16,6,'rgba(255,170,30,0.9)');}
   if(e.help==='truck')for(let k=0;k<5;k++)frr(g,['#b07a42','#c8955a','#8a5a2b'][k%3],ex-30+k*9,e.y-(k%2?16:8),8,8,1);person(g,ex-12,e.y+4,'apa',t,'wave');triangle(g,ex-48,e.y+2);}}else if(e.kind==='animal')drawAnimal(g,e,ex,t);else drawObstacle(g,e,ex,t);}
 for(const w of P.walk)person(g,w.x,w.y,w.w,w.t+(w.out?0:0),w.out&&w.x>=w.tx?'wave':'walk');
 for(const p of LEG.pois)if(p.type==='veda')drawVedaFront(g,p,p.x-P.dist+PX);
 drawParts(g,true);drawWeather(g,L,t);darkness(g,L);drawBubble(g);g.restore();drawParts(g,false);drawHUDc(g);if(P.fadeA>0)R(g,'rgba(0,0,0,'+P.fadeA+')',0,0,W,H);if(G.eyelid>0.02){const k=G.eyelid,hh=H*0.46*k;g.fillStyle=lg(g,0,0,0,hh+12,[[0,'#000'],[Math.max(0.01,hh/(hh+12)),'#000'],[1,'rgba(0,0,0,0)']]);g.fillRect(0,0,W,hh+12);g.fillStyle=lg(g,0,H,0,H-hh-12,[[0,'#000'],[Math.max(0.01,hh/(hh+12)),'#000'],[1,'rgba(0,0,0,0)']]);g.fillRect(0,H-hh-12,W,hh+12);}if(P.sub==='pump')drawPumpUI(g);if(P.sub==='wash')drawWashUI(g);if(P.sub==='shop')drawShopUI(g);if(MG)drawMini(g);}

/* ---------- képernyők ---------- */
const VIEWS=['side','front','rear','top'],VNAMES=['Oldalnézet','Elölnézet','Hátulnézet','Felülnézet'];
const TITLE_L={region:'hu',weather:'sun',time:'day'},TITLE_LEG={segs:[{type:'village',name:'Komárom',q:'good',x0:-1e9,x1:1e9,limit:50}]};
function drawView(g,v,t,ph){const o={pos:true,t:t,ang:t*0.09,door:(v==='side')?Math.max(0,Math.min(1,(ph-0.35)*8,(0.8-ph)*8)):0,blink:((t>>4)&1)===1,brake:((t>>5)&3)===0,wipe:(Math.sin(t*0.08)+1)/2,lightsOn:true,bounce:true,
 wF:Math.sin(t*0.12)*0.6,wR:Math.sin(t*0.12-1)*0.6,pitch:Math.sin(t*0.06)*0.01};
 if(v==='side'||v==='sideR')drawCarSide(g,0,0,0,o,null);else if(v==='front')drawFront(g,20,0,o);else if(v==='rear')drawRear(g,20,0,o);else drawTop(g,2,0,o);}
function titleOpts(){const o=[];if(G.save&&(G.save.leg>0||G.save.dist>0))o.push({l:'Folytatás ('+LEGS[G.save.leg].from.split(',')[0]+' > '+LEGS[G.save.leg].to+(G.save.dist?', '+fmt(G.save.dist/(PXKM/(G.save.ts||1)),1)+' km':'')+')',a:'cont'});o.push({l:'Új utazás Komáromból',a:'new'});
 o.push({l:'Autó színe: '+carColor,a:'color'});o.push({l:'Utazás: '+(TS_OPTS.find(q=>q[0]===G.ts)||TS_OPTS[0])[1],a:'ts'});o.push({l:'Az autó adatai',a:'specs'});return o;}
const TSCENES=[{L:{region:'hu',weather:'sun',time:'day'},type:'village',q:'good',lbl:'Komárom, Táncsics Mihály utca'},{L:{region:'hu',weather:'sun',time:'day'},type:'motorway',q:'good',lbl:'M1 autópálya'},
 {L:{region:'alps',weather:'snow',time:'day'},type:'country',q:'medium',lbl:'Alpok'},{L:{region:'it',weather:'sun',time:'day'},type:'village',q:'cobble',lbl:'Olasz tengerpart'},
 {L:{region:'provence',weather:'sun',time:'sunset'},type:'country',q:'good',lbl:'Provence, naplemente'},{L:{region:'fr',weather:'clear',time:'night'},type:'town',q:'good',lbl:'Párizs éjjel'}];
TSCENES.forEach(sc=>sc.leg={segs:[{type:sc.type,name:'',q:sc.q,x0:-1e12,x1:1e12,limit:LIMIT[sc.type],cc:''}],pois:[],lights:[],stations:[],kmPerPx:1/PXKM});
/* előre elkészített filmes rétegek (egyszer rajzolva, utána csak egy képmásolás) */
let TFX=null,TGR=null;
function titleFX(){if(TFX&&TFX.sc===SC)return TFX.c;const [c,x]=mk(W,H,SC);
 x.fillStyle=lg(x,0,0,0,H,[[0,'rgba(0,95,150,0.16)'],[0.5,'rgba(0,0,0,0)'],[1,'rgba(255,140,60,0.14)']]);x.fillRect(0,0,W,H);
 x.fillStyle=rg(x,W*0.58,H*0.52,H*0.3,W*0.72,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.62)']]);x.fillRect(0,0,W,H);TFX={c:c,sc:SC};return c;}
function grainTile(){if(TGR)return TGR;const [c,x]=mk(W+16,H+16,1);for(let i=0;i<2600;i++){x.fillStyle=Math.random()>0.5?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.09)';x.fillRect(Math.random()*(W+16),Math.random()*(H+16),1,1);}TGR=c;return c;}
/* GPS: offscreen képbe rajzolva, kb. 12-szer másodpercenként frissül */
let GPSC=null;
function drawGPSCached(g,r,leg,frac,t,night,kmh,rem){const w=r[2],h=r[3];if(!GPSC||GPSC.sc!==SC||GPSC.w!==w||t-GPSC.t>=5||t<GPSC.t){const [c,x]=GPSC&&GPSC.sc===SC&&GPSC.w===w?[GPSC.c,GPSC.x]:mk(w+2,h+2,SC);
  x.setTransform(SC,0,0,SC,0,0);x.clearRect(0,0,w+2,h+2);x.save();x.translate(1-r[0],1-r[1]);drawGPS(x,r,leg,frac,t,night,kmh,rem);x.restore();GPSC={c:c,x:x,sc:SC,w:w,t:t};}
 g.drawImage(GPSC.c,r[0]-1,r[1]-1,w+2,h+2);}
/* gyenge módban a kijelző csak minden 3. képkockán rajzolódik újra, közben a kész képe másolódik */
let HUDC=null;
function drawHUDc(g){if(!LOWQ){drawHUD(g);return;}if(!HUDC||HUDC.sc!==SC){const [c,x]=mk(W,H,SC);HUDC={c:c,x:x,sc:SC,t:-9};}
 if(G.t-HUDC.t>=3||G.t<HUDC.t||TAPD){const x=HUDC.x;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,HUDC.c.width,HUDC.c.height);x.setTransform(SC,0,0,SC,0,0);drawHUD(x);HUDC.t=G.t;}
 g.drawImage(HUDC.c,0,0,W,H);}
function introT(){if(G.introSeen)return 999;if(G.st>=170)G.introSeen=true;return G.st;}
const CREDITS=['Apa','Anya','Anna (5)','Petra (3)','kis Atti (10 hó)','és a családi egyterű'];
function drawTitle(g){const t=G.t,per=600,k=Math.floor(t/per)%TSCENES.length,ph=t%per,sc=TSCENES[k],L=sc.L,leg=sc.leg,dist=t*5,it=introT();lights=[];
 const u=ph/per,cam=k%3,ez=x=>x<0.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
 const z=cam===0?1+0.07*ez(u):cam===1?1.09-0.07*ez(u):1.035,pan=cam===2?(ez(u)-0.5)*26:0,fx=W*0.6,fy=176;
 g.save();g.translate(fx,fy);g.scale(z,z);g.translate(-fx-pan,-fy+(cam===2?-4:0));
 drawSky(g,L,t);drawClouds(g,L,dist,t);drawFar(g,L,leg.segs[0],dist,lights);drawMid(g,L,leg,dist,lights);drawNear(g,L,leg,dist,lights,t);drawRoad(g,L,leg,dist,t);
 const cx=W*0.6,gy=214,s2=1.7,night=L.time==='night'||L.time==='sunset';
 g.fillStyle=rg(g,cx,gy,4,110,[[0,'rgba(0,0,0,0.42)'],[1,'rgba(0,0,0,0)']]);g.save();g.translate(cx,gy);g.scale(1,0.07);g.beginPath();g.arc(0,0,110,0,TAU);g.fill();g.restore();
 const bob=Math.sin(t*0.21)*0.35+(sc.q==='cobble'?Math.sin(t*1.3)*0.25:0);
 g.save();g.translate(cx-56*s2,gy-55.5*s2);g.scale(s2,s2);const lt=[];drawCarSide(g,0,bob,0,{t:t,ang:dist/WR,pos:true,lightsOn:night,wF:Math.sin(t*0.17)*0.3,wR:Math.sin(t*0.17-1.1)*0.3,pitch:Math.sin(t*0.05)*0.004,bounce:true},night?lt:null);g.restore();
 for(const l of lt){const o={x:cx-56*s2+l.x*s2,y:gy-55.5*s2+l.y*s2,r:(l.r||0)*s2,cone:l.cone,high:l.high,g:gy};lights.push(o);}
 if(L.weather==='snow'){g.fillStyle='#ffffff';for(let i=0;i<90;i++){const x=((hsh(i)*W-t*(0.6+hsh(i+3))*1.8)%W+W)%W,y=(hsh(i+7)*H+t*(0.5+hsh(i+1)))%H;g.beginPath();g.arc(x,y,hsh(i+9)>0.6?1.1:0.7,0,TAU);g.fill();}}
 darkness(g,L);g.restore();
 // színkorrekció: hűvös ég, meleg föld (filmes "teal & orange")
 g.drawImage(titleFX(),0,0,W,H);
 // lencsefény a nap felől
 const sun=L.time==='day'&&L.weather==='sun'?[405,38]:L.time==='sunset'?[380,150]:null;
 if(sun&&!LOWQ){g.save();g.globalCompositeOperation='lighter';const vx=W*0.5-sun[0],vy=H*0.55-sun[1],fl=0.75+0.25*Math.sin(t*0.02);
  for(const [f,r,c] of [[0.35,7,'rgba(255,220,150,0.10)'],[0.6,3,'rgba(150,220,255,0.16)'],[0.85,12,'rgba(255,170,90,0.07)'],[1.25,5,'rgba(190,255,200,0.12)'],[1.6,18,'rgba(140,180,255,0.06)']])disc(g,c,sun[0]+vx*f,sun[1]+vy*f,r*fl);
  g.fillStyle=lg(g,sun[0]-120,0,sun[0]+120,0,[[0,'rgba(255,230,180,0)'],[0.5,'rgba(255,230,180,'+0.22*fl+')'],[1,'rgba(255,230,180,0)']]);g.fillRect(sun[0]-120,sun[1]-0.6,240,1.2);g.restore();}
 // vignetta és filmszemcse
 if(!LOWQ){const gr=grainTile();g.drawImage(gr,-((t*37)%16),-((t*23)%16),W+16,H+16);
  if(hsh(t*5)>0.985)R(g,'rgba(255,255,255,0.05)',hsh(t)*W,0,0.5,H);}
 // jelenetváltás: áttűnés feketébe
 const fade=ph<36?1-ph/36:ph>per-36?(ph-(per-36))/36:0;if(fade>0)R(g,'rgba(0,0,0,'+fade+')',0,0,W,H);
 // nyitány: feketéből
 if(it<60)R(g,'rgba(0,0,0,'+(1-it/60)+')',0,0,W,H);
 // szélesvásznú csíkok
 const bh=25*ez(clamp(it/70,0,1));R(g,'#000',0,0,W,bh);R(g,'#000',0,H-bh,W,bh);
 // cím: középen indul, majd a helyére úszik
 const mR=G.menuR||W*0.36,fw=textW('CSALÁDI VAKÁCIÓ',1),ts2=clamp((W-mR-22)/fw,1.3,2.5),tx2=Math.max(W*0.645,(mR+W)/2+2);const a1=clamp((it-30)/50,0,1),mv=ez(clamp((it-120)/50,0,1)),tx=W/2+(tx2-W/2)*mv,ty=H*0.40+(46-H*0.40)*mv,ts=3.2+(ts2-3.2)*mv;
 if(a1>0){g.save();g.globalAlpha=a1;const tw=textW('CSALÁDI VAKÁCIÓ',ts);
  text(g,'Családi Vakáció',tx+0.8,ty+1.2,'rgba(0,0,0,0.55)',ts,'center');text(g,'Családi Vakáció',tx,ty,'#ffd84a',ts,'center','#7a3b12');
  const lw=Math.min(60,tw*0.25)*a1,ly=ty+ts*7+5;line(g,'rgba(255,216,74,0.7)',tx-tw/2,ly,tx-tw/2+lw,ly,0.6);line(g,'rgba(255,216,74,0.7)',tx+tw/2-lw,ly,tx+tw/2,ly,0.6);
  g.globalAlpha=a1*clamp((it-70)/40,0,1);const subT=textW('EGY CSALÁDI ROAD MOVIE  ·  EURÓPA, 5 800 KM')>W-mR-16&&mv>0.5?'Road movie · Európa, 5 800 km':'Egy családi road movie  ·  Európa, 5 800 km';text(g,subT,tx,ly+4,'#e9eef5',1,'center');g.restore();}
 if(it<150&&it>40){g.globalAlpha=clamp((it-40)/30,0,1)*(1-clamp((it-120)/30,0,1));text(g,'Koppints a kezdéshez',W/2,H-bh-14,'#cfd6df',1,'center');g.globalAlpha=1;}
 if(bh>12){// felső csík: szereplők
  const ci=Math.floor(t/150)%CREDITS.length,cph=t%150,ca=Math.min(1,cph/20,(150-cph)/20);g.globalAlpha=ca*0.9;text(g,'Főszerepben:',W-10-textW(CREDITS[ci].toUpperCase())-4,8,'#7d8a9a',1,'right');text(g,CREDITS[ci],W-10,8,'#ffffff',1,'right');g.globalAlpha=1;
  // alsó csík: helyszín írógéppel
  const lbl=sc.lbl.toUpperCase(),n=clamp(Math.floor((ph-40)/2.2),0,lbl.length),la=ph>per-50?Math.max(0,(per-36-ph)/14):1;
  if(n>0){g.globalAlpha=la;const s1=lbl.slice(0,n),w=textW(lbl);R(g,'#ffd84a',W-14-w-8,H-bh/2-3.5,2,7);text(g,s1,W-14-w,H-bh/2-2.5,'#ffffff',1,'left');
   text(g,(k+1)+'. jelenet',W-14-w-14,H-bh/2-2.5,'#7d8a9a',1,'right');if(n<lbl.length&&Math.floor(t/6)%2)R(g,'#ffffff',W-14-w+textW(s1)+1,H-bh/2-2.5,3,5);g.globalAlpha=1;}}}

function drawSpecs(g){R(g,'#141a26',0,0,W,H);g.save();g.translate(250,40);g.scale(1.8,1.8);drawCarSide(g,0,0,0,{t:G.t,ang:G.t*0.05,lightsOn:true},null);g.restore();
 text(g,'Az autó adatai',20,16,'#ffd84a',2);const rows=[['Típus','7 üléses egyterű'],['Motor','1.8 16V benzin'],['Teljesítmény',CAR.hp+' LE'],['Nyomaték',CAR.torque+' Nm'],['Végsebesség',CAR.top+' km/h'],['0-100 km/h',fmt(CAR.acc100,1)+' s'],
  ['Fogyasztás városban',fmt(CAR.urban,1)+' l/100 km'],['Fogyasztás országúton',fmt(CAR.extra,1)+' l/100 km'],['Vegyes fogyasztás',fmt(CAR.comb,1)+' l/100 km'],['Tank',CAR.tank+' l'],['Saját tömeg',fmt(CAR.mass)+' kg'],['Hossz',fmt(CAR.len,2)+' m'],['Gumiméret',CAR.tyre],['Ülések',CAR.seats+' (3. sor: csomagok)']];
 rows.forEach((r,i)=>{text(g,r[0],20,44+i*14,'#9fb0c2');text(g,r[1],150,44+i*14,'#ffffff');});
 text(g,'Utasok: Apa, Anya, Anna (5), Petra (3), kis Atti (10 hónapos)',20,248,'#ffd84a');text(g,isTouch?'Érintsd meg: vissza':'Enter: vissza',W-10,258,'#6f7d8c',1,'right');}
function drawMap(g){const t=G.st,i=G.leg,L=LEGS[i],T=G.trip;drawBigMap(g,i,G.resume?Math.min(1,G.resume/(PXKM/G.ts)/L.km):0,G.t,true);
 frr(g,'rgba(10,13,22,0.9)',0,H-58,W,58,0);text(g,(i+1)+'/'+LEGS.length+'. szakasz: '+L.from.split(',')[0]+' > '+L.to,10,H-52,'#ffd84a',1.1,'left');
 text(g,fmt(L.km)+' km  -  '+WNAME[L.weather]+TNAME[L.time]+(L.live?' (élő, '+fmt(L.temp,0)+' fok)':'')+'  -  95: '+L.price+' Ft/l',10,H-39,'#ffffff',1,'left');
 text(g,'Tank '+fmt(T.fuel,1)+' l   Pénz '+fmt(T.money)+' Ft',10,H-28,'#cfd6df',1,'left');text(g,'Kaja '+Math.round(T.food)+'%   Baba '+Math.round(T.baby)+'%   Eddig '+fmt(T.km,0)+' km',10,H-17,'#cfd6df',1,'left');
 if(!isTouch&&t>25&&((t>>4)&1))text(g,'Enter: indulás',W-10,H-52,'#9fb0c2',1,'right');}
const LMK={'Siófok':0,'Keszthely':1,'Bécs':2,'Prága':8,'Berlin':9,'Amszterdam':10,'Párizs':5,'Barcelona':11,'Nizza':6,'Velence':4,'Salzburg (Alpok)':3,'Komárom (haza)':7};
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
 else if(i===8){g.fillStyle='#5a7a9a';g.fillRect(0,150,w,h);for(let k=0;k<6;k++){frr(g,'#d8c8a8',8+k*24,96-((k%2)*14),18,60,1);g.fillStyle='#3f5f4a';g.beginPath();g.moveTo(8+k*24,96-((k%2)*14));g.lineTo(17+k*24,70-((k%2)*14));g.lineTo(26+k*24,96-((k%2)*14));g.fill();}
  g.strokeStyle='#c9b48a';g.lineWidth=3;for(let k=0;k<5;k++){g.beginPath();g.arc(16+k*32,156,14,Math.PI,TAU);g.stroke();}R(g,'#c9b48a',0,142,w,4);}
 else if(i===9){g.fillStyle='#8fb07a';g.fillRect(0,150,w,h);frr(g,'#e8dcc0',28,70,100,14,1);for(let k=0;k<6;k++)frr(g,'#e8dcc0',30+k*18,84,8,66,1);frr(g,'#7a8a6a',62,52,32,18,2);}
 else if(i===10){g.fillStyle='#3a7fb8';g.fillRect(0,140,w,h);for(let k=0;k<6;k++){const c=['#8a3a2a','#d8c8a8','#3a4a6a','#a85a2a','#5a6a3a','#e0d0b0'][k];frr(g,c,4+k*25,70+(k%3)*6,22,72,1);g.fillStyle=c;g.beginPath();g.moveTo(4+k*25,70+(k%3)*6);g.lineTo(15+k*25,58+(k%3)*6);g.lineTo(26+k*25,70+(k%3)*6);g.fill();for(let j=0;j<3;j++)frr(g,'#cfe6f3',8+k*25,80+j*16+(k%3)*6,6,8,1);}}
 else if(i===11){g.fillStyle=lg(g,0,110,0,h,[[0,'#3fa0d8'],[1,'#21608f']]);g.fillRect(0,110,w,h);R(g,'#e8d3a2',0,150,w,h);palm(g,20,160);palm(g,110,158);umbrellaPC(g,70,160);}
 else{g.fillStyle='#7cbf66';g.fillRect(0,150,w,h);house(g,50,160,'#f2e2b8','#b5452b',false,null,false,'12');roadSign(g,10,170,'Komárom','town');}
 g.restore();}
function umbrellaPC(g,x,b){line(g,'#eee',x+12,b,x+12,b-26,1.4);for(let k=0;k<5;k++)poly(g,k%2?'#ffffff':'#e53935',[[k*6,0],[k*6+6,0],[13,-8]],x,b-26);}
function drawPostcard(g){const L=LEGS[G.leg],T=G.trip;g.fillStyle=lg(g,0,0,0,H,[[0,'#24314d'],[1,'#141b2c']]);g.fillRect(0,0,W,H);
 for(let k=0;k<40;k++)frr(g,['#ff5a7a','#ffd54f','#4fc3f7','#81c784'][k%4],(hsh(k)*W+G.t*0.3*(k%3+1))%W,(hsh(k+40)*H+G.t*(0.4+hsh(k)*0.6))%H,3,3,1);
 frr(g,'#1b1f2a',58,26,366,220,4);frr(g,'#f5ecd7',60,28,362,216,4);frr(g,'#e8dcc0',64,32,354,208,3);frr(g,'#f5ecd7',66,34,350,204,3);
 drawLandmark(g,LMK[L.to]!==undefined?LMK[L.to]:0,74,42,156,188);R(g,'#c9b994',238,44,1,186);
 frr(g,'#c62a35',384,40,30,36,2);frr(g,'#f5ecd7',386,42,26,32,1);text(g,'2026',399,60,'#c62a35',1,'center',null);disc(g,'#c62a35',399,51,4);
 text(g,'Üdvözlet',246,46,'#c62a35',2);text(g,L.to,246,70,'#1b1f2a',L.to.length<=10?2:1,'left',null);
 const rows=['Megtett út: '+fmt(L.km)+' km','Összesen: '+fmt(T.km,0)+' km','Benzin: '+fmt(T.fuelUsed,1)+' l ('+(T.km>1?fmt(T.fuelUsed/T.km*100,1):'-')+' l/100)','Pénz: '+fmt(T.money)+' Ft','Szállás és bevásárlás: 18 000 Ft','Kaja és bébicsomag feltöltve!','Puszi: Apa, Anya, Anna,','Petra és kis Atti'];
 rows.forEach((r,k)=>{R(g,'#d9cba8',246,100+k*15,166,0.6);text(g,r,248,92+k*15,'#3a4a6a',1,'left',null);});
 if(G.st>40&&((G.t>>4)&1))text(g,isTouch?'Érintsd meg: tovább':'Enter: tovább',W/2,252,'#ffffff',1,'center');}
function drawOver(g){drawPlay(g);R(g,'rgba(10,13,22,0.78)',0,0,W,H);text(g,'Elfogyott a jókedv...',W/2,96,'#ff8a8a',2,'center');text(g,'A család pihen egyet a szálláson, aztán újra nekivág.',W/2,128,'#ffffff',1,'center');
 if(G.st>50&&((G.t>>4)&1))text(g,isTouch?'Érintsd meg: újra':'Enter: újrakezdés',W/2,156,'#ffd84a',1,'center');}
function drawWin(g){const t=G.t,T=G.trip;drawSky(g,LEGS[LEGS.length-1],t);drawClouds(g,LEGS[LEGS.length-1],t*0.4,t);drawFar(g,LEGS[LEGS.length-1],TITLE_LEG.segs[0],t*0.4,null);drawRoad(g,LEGS[LEGS.length-1],TITLE_LEG,0,t);
 house(g,150,ROADT-8,'#f2e2b8','#b5452b',false,null,false,'12');drawCarSide(g,W/2-30,232-55.5,232-55.5,{t:t,ang:0,door:1,hide:{apa:1,anya:1,anna:1,petra:1,atti:1}},null);
 ['apa','anya','anna','petra'].forEach((w,k)=>person(g,100+k*22,240,w,t,'wave'));
 for(let k=0;k<50;k++)frr(g,['#ff5a7a','#ffd54f','#4fc3f7','#81c784','#ba68c8'][k%5],hsh(k)*W+Math.sin(t*0.02+k)*20,(hsh(k+50)*H+t*(0.5+hsh(k)))%H,3,3,1);
 frr(g,'rgba(10,13,22,0.65)',40,20,400,130,6);text(g,'Hazaértünk Komáromba!',W/2,30,'#ffd84a',2,'center','#7a3b12');
 const r=['Megtett út: '+fmt(T.km,0)+' km','Elfogyott benzin: '+fmt(T.fuelUsed,1)+' l  (átlag '+(T.km>1?fmt(T.fuelUsed/T.km*100,1):'-')+' l/100 km)','Benzinre költve: '+fmt(T.spentFuel)+' Ft','Boltban, szálláson: '+fmt(T.spentShop)+' Ft','Bírságok: '+fmt(T.fines)+' Ft','Mellékesen keresett: '+fmt(T.earned||0)+' Ft','Maradt: '+fmt(T.money)+' Ft'];
 r.forEach((s,k)=>text(g,s,W/2,56+k*12,'#ffffff',1,'center'));if(G.st>60&&((t>>4)&1))text(g,isTouch?'Érintsd meg: főmenü':'Enter: főmenü',W/2,134,'#cfd6df',1,'center');}

/* ---------- fő frissítés ---------- */
function update(){if(!window.LAZY_DONE&&G.state!=='title'&&G.state!=='specs'){G.t++;return;}if(G.ledger&&G.state!=='play'){G.t++;K.upP=K.dnP=K.enterP=K.enterKey=K.pauseP=false;K.num=0;TAP=TAPD=null;return;}G.t++;G.st++;{const play=G.state==='play'&&!G.paused&&!MG;if(K.horn&&!G.hornPrev&&play)K.honkP=true;G.hornPrev=K.horn;hornSet(K.horn&&play);}updateMusic(G.paused||G.state==='play'||radio.on||G.state!=='title'&&G.state!=='map');if(G.state==='play'&&!G.paused)updRadio();if(radio.show>0)radio.show--;if(G.state!=='play'||G.paused)engine(0,0);
 if(G.state==='title'&&introT()<150&&(K.enterP||TAPD||TAP||K.upP||K.dnP)){G.st=150;G.introSeen=true;K.enterP=K.upP=K.dnP=false;TAPD=TAP=null;}
 if(G.state==='title'){const opts=titleOpts(),n=opts.length;if(G.menu>=n)G.menu=0;if(K.upP)G.menu=(G.menu+n-1)%n,SFX.click();if(K.dnP)G.menu=(G.menu+1)%n,SFX.click();
  if(TAP){const i=Math.floor((TAP.y-221)/9);if(i>=0&&i<n)G.menu=i;}
  if(K.enterP){SFX.click();const a=opts[G.menu].a;if(a==='color'){const ns=Object.keys(PALETTES);setColor(ns[(ns.indexOf(carColor)+1)%ns.length]);}
   else if(a==='ts'){const k=TS_OPTS.findIndex(q=>q[0]===G.ts);G.ts=TS_OPTS[(k+1)%TS_OPTS.length][0];try{localStorage.setItem('csaladi-vakacio-ts',G.ts);}catch(e){}}
   else if(a==='specs'){G.state='specs';G.st=0;}
   else{if(a==='cont'){G.leg=G.save.leg;G.trip=fixLog(G.save.trip);G.ts=G.save.ts||G.ts;G.resume=G.save.dist||0;}else{G.leg=0;G.trip=newTrip();G.resume=0;}G.state='map';G.st=0;}}}
 else if(G.state==='specs'){if(K.enterP&&G.st>10){G.state='title';SFX.click();}}
 else if(G.state==='map'){if(G.st===1)fetchWeather(G.leg);if(K.enterP&&G.st>25){SFX.click();startLeg(G.leg,G.resume);G.resume=0;}}
 else if(G.state==='play')updPlay();
 else if(G.state==='postcard'){for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.life--;}parts=parts.filter(p=>p.life>0);
  if(K.enterP&&G.st>40){SFX.click();G.leg++;if(G.leg>=LEGS.length){G.state='win';G.st=0;SFX.win();try{localStorage.removeItem('csaladi-vakacio-v2');}catch(e){}G.save=null;}else{save(0);G.state='map';G.st=0;}}}
 else if(G.state==='over'){if(K.enterP&&G.st>50){SFX.click();G.trip.mood=3;startLeg(G.leg);}}
 else if(G.state==='win'){if(K.enterP&&G.st>60){SFX.click();G.state='title';G.menu=0;}}
 K.upP=K.dnP=K.honkP=K.enterP=K.pauseP=K.lightP=K.fogP=K.hazP=K.doorP=K.revP=K.radioP=K.hbP=false;K.enterKey=false;K.cruiseP=false;K.stopP=false;K.logP=false;TAPD=null;K.num=0;TAP=null;}
function render(){ctx.setTransform(SC,0,0,SC,0,0);ctx.imageSmoothingEnabled=true;
 if(!window.LAZY_DONE&&G.state!=='title'&&G.state!=='specs'){R(ctx,'#0b0f17',0,0,W,H);text(ctx,'Betöltés...',W/2,H/2-4,'#ffd84a',1.4,'center');return;}
 if(G.state==='title')drawTitle(ctx);else if(G.state==='specs')drawSpecs(ctx);else if(G.state==='map')drawMap(ctx);else if(G.state==='play')drawPlay(ctx);
 else if(G.state==='postcard')drawPostcard(ctx);else if(G.state==='over')drawOver(ctx);else if(G.state==='win')drawWin(ctx);
 if(typeof appTick==='function')appTick();}
let last=performance.now(),acc=0,perfT=0,perfN=0;const STEP=1000/60;
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(G.state==='play'&&P){G.paused=true;save(P.dist);}if(AC&&AC.state==='running')AC.suspend();}else{last=performance.now();if(AC)AC.resume();}});
// minőségi fokozatok: renderfelbontás (SC) és effektek; a kijelző tényleges felbontásánál nem rajzol többet
const QTIERS=[3,2.5,2,1.5,1.25,1.25];let QT=null,QUP=0,RT=0,HALF=false,FRM=0;
function wantSC(){const c=document.getElementById('c'),dpr=window.devicePixelRatio||1;return Math.max(1,(c.clientWidth||W)*dpr/W);}
function applyQ(){const sc=Math.min(QTIERS[QT],Math.max(1.25,Math.ceil(wantSC()*4)/4));LOWQ=QT>=3;HALF=QT>=5;if(Math.abs(sc-SC)>0.01){setSC(sc);TFX=null;GPSC=null;}}
function qualityStep(avg,ra){if(document.hidden)return;if(QT===null){const touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;QT=touch?((navigator.hardwareConcurrency||4)>=8?2:3):((navigator.hardwareConcurrency||4)>=6?1:2);applyQ();return;}
 if(HALF)avg/=2;if(avg>21&&QT<QTIERS.length-1){QT=Math.min(QTIERS.length-1,QT+(avg>30?2:1));QUP=0;applyQ();}else if(avg<18&&ra<5&&QT>0){if(++QUP>=4){QT--;QUP=0;applyQ();}}else QUP=0;}
function frame(now){const dt=Math.min(200,now-last);acc+=dt;last=now;let n=0;while(acc>=STEP&&n<3){update();acc-=STEP;n++;}if(n>=3)acc=0;FRM++;if(!HALF||FRM%2===0){const r0=performance.now();render();RT+=performance.now()-r0*1;}
 perfT+=dt;perfN++;if(perfN>=(QT===null?20:45)){const avg=perfT/perfN,ra=RT/perfN;perfT=0;perfN=0;RT=0;qualityStep(avg,ra);}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
