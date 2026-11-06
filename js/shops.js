'use strict';
/* =========================================================
   MEGÁLLÓK – boltok termékkártyákkal és látványos tankolás
   ========================================================= */
/* ---- termékikonok ---- */
function itemIcon(g,k,x,y){g.save();g.translate(x,y);const s=(c,a,b,w,h,r)=>frr(g,c,a,b,w,h,r||1);
 switch(k){
 case 'food':poly(g,'#e8c48a',[[-9,6],[9,6],[0,-8]]);poly(g,'#7cc04a',[[-7,4],[7,4],[0,-5]]);poly(g,'#f4d7a0',[[-6,3],[6,3],[0,-4]]);R(g,'#d84a3a',-5,1,10,1.4);break;
 case 'pastry':g.fillStyle='#d9973f';g.beginPath();g.arc(0,3,9,Math.PI,TAU);g.closePath();g.fill();for(let i=-6;i<=6;i+=4)line(g,'#a8682a',i,3,i*0.7,-4,0.8);break;
 case 'fruit':disc(g,'#d32f2f',-4,2,5);disc(g,'rgba(255,255,255,0.3)',-6,0,1.4);g.strokeStyle='#fdd835';g.lineWidth=3;g.lineCap='round';g.beginPath();g.arc(4,-4,8,0.6,2.2);g.stroke();break;
 case 'water':s('#4fc3f7',-4,-6,8,14,2);s('#1e88e5',-2,-9,4,3,1);s('rgba(255,255,255,0.5)',-3,-4,1.5,10,0.6);s('#e3f2fd',-4,-1,8,3,0.5);break;
 case 'drink':s('#d32f2f',-5,-8,10,16,2.5);s('#b0bec5',-5,-9,10,2,1);s('#ffffff',-5,-2,10,3,0.5);break;
 case 'coffee':s('#f5f5f5',-6,-3,10,10,2);g.strokeStyle='#f5f5f5';g.lineWidth=1.4;g.beginPath();g.arc(5,1,3,-1.4,1.4);g.stroke();R(g,'#6d4c41',-5,-2,8,2);for(const dx of [-3,0])line(g,'rgba(255,255,255,0.6)',dx,-6,dx+1,-10,0.7);break;
 case 'baby':s('#fff8e1',-5,-5,10,12,2);s('#ffb74d',-5,-8,10,4,1.5);s('#81d4fa',-4,-1,8,5,1);disc(g,'#ffcc80',0,1.5,1.6);break;
 case 'diaper':s('#ffffff',-8,-5,16,11,4);s('#b3e5fc',-8,-5,3,4,1);s('#b3e5fc',5,-5,3,4,1);disc(g,'#ffcdd2',0,1,2);break;
 case 'ice':poly(g,'#d9a35c',[[-4,0],[4,0],[0,10]]);disc(g,'#ff9fc4',0,-2,4.5);disc(g,'#fff0c2',-2,-5,3);disc(g,'#e53935',2,-8,1.2);break;
 case 'big':s('#2e7d4f',-8,-4,16,13,2);g.strokeStyle='#2e7d4f';g.lineWidth=1.4;g.beginPath();g.arc(0,-4,4,Math.PI,TAU);g.stroke();disc(g,'#fdd835',-4,-5,2.4);disc(g,'#d32f2f',1,-6,2.6);s('#e8c48a',3,-9,3,6,1);break;
 case 'babybig':s('#81d4fa',-9,-7,18,15,2);s('#ffffff',-6,-4,12,8,1.5);disc(g,'#ffcc80',0,0,2.4);break;
 case 'basket':g.fillStyle='#a1744a';g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.lineTo(6,8);g.lineTo(-6,8);g.closePath();g.fill();disc(g,'#d32f2f',-4,-2,3);disc(g,'#fdd835',1,-3,3);disc(g,'#7cb342',5,-1,2.6);break;
 case 'toy':disc(g,'#a1744a',0,2,6);disc(g,'#a1744a',0,-6,4.5);disc(g,'#a1744a',-4,-9,2);disc(g,'#a1744a',4,-9,2);disc(g,'#1a1a1a',-1.5,-6.5,0.6);disc(g,'#1a1a1a',1.5,-6.5,0.6);disc(g,'#d7b38a',0,2,3);break;
 case 'game':s('#3f7fd9',-9,-6,18,12,1.5);s('#ffffff',-3,-3,6,6,1.2);disc(g,'#1a1a1a',-1.5,-1.5,0.6);disc(g,'#1a1a1a',1.5,1.5,0.6);disc(g,'#1a1a1a',0,0,0.6);break;
 case 'work':s('#a1744a',-9,-2,18,10,1);for(const [c,dx] of [['#d32f2f',-5],['#fdd835',0],['#43a047',5]])disc(g,c,dx,-3,3);break;
 case 'scratch':case 'scratch4':case 'scratch10':{const c=k==='scratch'?'#ffcf33':k==='scratch4'?'#ff8a3a':'#9c6bff';s(c,-10,-7,20,14,2);s('#b8c0c8',-7,-4,14,8,1.5);text(g,k==='scratch'?'1X':k==='scratch4'?'4X':'10X',0,-2.5,'#3a3f47',0.6,'center',null);break;}
 case 'gum':s('#43a047',-8,-4,16,8,2);s('#ffffff',-6,-2,12,4,1);break;
 case 'comic':s('#e53935',-8,-9,16,18,1);s('#fdd835',-6,-6,12,6,1);disc(g,'#4fc3f7',2,4,3);break;
 case 'color':for(let i=0;i<4;i++){s(['#e53935','#1e88e5','#43a047','#fdd835'][i],-8+i*4.4,-7,3.4,14,1);poly(g,['#e53935','#1e88e5','#43a047','#fdd835'][i],[[-8+i*4.4,-7],[-4.6+i*4.4,-7],[-6.3+i*4.4,-10]]);}break;
 case 'map':poly(g,'#cfe6c8',[[-9,-7],[-3,-9],[3,-7],[9,-9],[9,7],[3,9],[-3,7],[-9,9]]);line(g,'#d32f2f',-6,4,0,-2,1);line(g,'#d32f2f',0,-2,6,0,1);line(g,'#7a8a6a',-3,-9,-3,7,0.5);line(g,'#7a8a6a',3,-7,3,9,0.5);break;
 case 'postcard':s('#fff3d6',-9,-6,18,12,1);s('#4fc3f7',-8,-5,9,10,0.5);s('#d32f2f',4,-5,4,5,0.5);break;
 case 'tyre':disc(g,'#1b1f26',0,0,9);disc(g,'#9aa4ae',0,0,5);disc(g,'#5a636d',0,0,2);break;
 case 'carwash':frr(g,'#1e88e5',-9,-9,3,17,1.5);frr(g,'#e53935',6,-9,3,17,1.5);for(let k=0;k<4;k++)R(g,'rgba(255,255,255,0.5)',-9,-7+k*4,3,1);
  g.fillStyle='#cfd8e0';g.beginPath();g.moveTo(-6,6);g.lineTo(-6,1);g.quadraticCurveTo(-5,-3,0,-3);g.lineTo(3,-3);g.lineTo(6,1);g.lineTo(6,6);g.closePath();g.fill();R(g,'#7fb2d6',-3,-2,5,2.6);disc(g,'#1b1f26',-3.5,6.2,1.6);disc(g,'#1b1f26',3.5,6.2,1.6);
  for(const [bx,by,r] of [[-2,-7,1.6],[2,-9,1.2],[4.5,-6,1]])disc(g,'rgba(200,235,255,0.95)',bx,by,r);break;
 case 'repair':g.save();g.rotate(-0.7);frr(g,'#9aa3ad',-1.6,-8,3.2,14,1.2);g.strokeStyle='#9aa3ad';g.lineWidth=2.6;g.beginPath();g.arc(0,-9,3.6,0.6,Math.PI*2-0.6+Math.PI);g.stroke();g.restore();disc(g,'#c62828',5,5,2.2);break;
 case 'wash':for(let k=0;k<6;k++)disc(g,'rgba(160,210,255,0.9)',-5+hsh(k)*10,-6+hsh(k*3)*12,1.6+hsh(k*5)*2);frr(g,'#3b8bff',-7,2,14,6,2);break;
 case 'oil':frr(g,'#1b1f26',-5,-4,10,12,2);frr(g,'#ffd84a',-3,-1,6,4,1);frr(g,'#1b1f26',-2,-7,4,3,1);break;
 case 'burger':disc(g,'#e8a03e',0,-3,7);R(g,'#7cc04a',-7.5,-1,15,1.6);R(g,'#5b2b14',-7,0.6,14,2.6);R(g,'#ffd84a',-7,3,14,1.2);frr(g,'#e8a03e',-7,4,14,4,2);disc(g,'#fff4d6',-2,-6,0.7);disc(g,'#fff4d6',2,-5,0.7);break;
 case 'fries':poly(g,'#0e7c7b',[[-6,-1],[6,-1],[4.5,9],[-4.5,9]]);for(let k=0;k<5;k++)R(g,'#ffd84a',-4.4+k*2,-8+(k%2)*2,1.5,8);R(g,'#ff8c42',-5,2,10,1.4);break;
 case 'kidmeal':frr(g,'#ff8c42',-8,-3,16,12,2);g.strokeStyle='#ff8c42';g.lineWidth=1.4;g.beginPath();g.arc(0,-3,5,Math.PI,TAU);g.stroke();disc(g,'#ffd84a',0,3,2.6);disc(g,'#1a1a1a',-0.9,2.4,0.4);disc(g,'#1a1a1a',0.9,2.4,0.4);break;
 case 'nuggets':frr(g,'#0e7c7b',-8,-1,16,9,2);for(const [dx,dy] of [[-4,-3],[0,-4],[4,-3],[-2,-1],[2,-1]])ell(g,'#d9a35c',dx,dy,2.4,1.8);break;
 case 'shake':poly(g,'#ffffff',[[-4,-4],[4,-4],[3,9],[-3,9]]);R(g,'#ff9fc4',-3.6,-2,7.2,6);disc(g,'#ff9fc4',0,-5,3.6);line(g,'#ff8c42',1,-5,3,-11,1);break;
 case 'family':frr(g,'#ff8c42',-9,-6,18,14,2);R(g,'#0e7c7b',-9,-1,18,3);for(let k=0;k<4;k++)R(g,'#ffd84a',-7+k*4,-10,2,5);break;
 default:disc(g,'#cfd6df',0,0,6);}
 g.restore();}
const SHOPS={
 kis:{title:'Kisbolt - ABC',col:'#2e7d4f',items:[{k:'food',nm:'Szendvics',p:4290,food:35},{k:'pastry',nm:'Pékáru',p:1490,food:15},{k:'fruit',nm:'Gyümölcs',p:1990,food:20},{k:'water',nm:'Ásványvíz',p:490,food:5},
  {k:'baby',nm:'Bébiétel',p:1690,baby:30},{k:'diaper',nm:'Pelenka',p:4990,baby:40},{k:'ice',nm:'Fagyi',p:1990,mood:1},{k:'coffee',nm:'Kávé Apának',p:690,msg:'Apa felfrissült, mehet tovább.'}]},
 hiper:{title:'Hipermarket',col:'#1e4fb5',items:[{k:'big',nm:'Nagybevás.',p:14990,food:100,baby:30},{k:'babybig',nm:'Bébicsomag',p:6990,baby:100},{k:'basket',nm:'Gyüm.kosár',p:3490,food:30},{k:'water',nm:'Víz 6 db',p:1990,food:12},
  {k:'toy',nm:'Plüssmaci',p:4990,mood:2},{k:'game',nm:'Társasjáték',p:5990,mood:2},{k:'drink',nm:'Üdítő',p:790,food:6},{k:'work',nm:'Munka',p:0,work:true}]},
 trafik:{title:'Trafik',col:'#5a4632',items:[{k:'scratch',nm:'Kaparós 1x',p:600,mult:1},{k:'scratch4',nm:'Kaparós 4x',p:2000,mult:4},{k:'scratch10',nm:'Kaparós 10x',p:5000,mult:10},{k:'drink',nm:'Üdítő',p:690,food:5},{k:'gum',nm:'Rágó',p:350,msg:'A gyerekek boldogan rágóznak.'}]},
 ujsag:{title:'Újságos',col:'#2f6b45',items:[{k:'comic',nm:'Gyerekújság',p:1290,mood:1},{k:'color',nm:'Színező',p:990,mood:1},{k:'map',nm:'Autós térkép',p:2490,msg:'Az új térképpel nem tévedünk el!'},{k:'postcard',nm:'Képeslap',p:290,photo:1},{k:'scratch',nm:'Kaparós 1x',p:600,mult:1}]},
 burger:{title:'Burger Pont - gyorsétterem',col:'#0e7c7b',items:[{k:'burger',nm:'Sajtburger',p:2690,food:30},{k:'kidmeal',nm:'Gyerekmenü',p:2390,food:25,mood:1},{k:'nuggets',nm:'Csirkefalat',p:2190,food:24},{k:'fries',nm:'Sült krumpli',p:990,food:10},
  {k:'shake',nm:'Shake',p:1290,food:6,mood:1},{k:'coffee',nm:'Kávé Apának',p:690,msg:'Apa felfrissült.'},{k:'family',nm:'Családi menü',p:11990,food:100,mood:1},{k:'ice',nm:'Fagyikehely',p:890,mood:1}]},
 garage:{title:'Autószerviz',col:'#c62828',items:[]},
 fuel:{title:'Benzinkút - bolt',col:'#2e8b57',items:[{k:'food',nm:'Szendvics',p:4790,food:35},{k:'coffee',nm:'Kávé Apának',p:890,msg:'Apa felfrissült.'},{k:'water',nm:'Ásványvíz',p:690,food:5},{k:'baby',nm:'Bébiétel',p:1990,baby:30},
  {k:'ice',nm:'Fagyi',p:2190,mood:1},{k:'tyre',nm:'Pótkerék',p:28000,tyre:true},{k:'scratch',nm:'Kaparós 1x',p:600,mult:1},{k:'work',nm:'Munka',p:0,work:true}]}};
const ITEMCAT={repair:'service',wash:'service',oil:'service',burger:'food',kidmeal:'food',nuggets:'food',fries:'food',shake:'food',family:'food',food:'food',pastry:'food',fruit:'food',water:'food',drink:'food',coffee:'food',big:'food',basket:'food',gum:'food',baby:'baby',diaper:'baby',babybig:'baby',ice:'fun',toy:'fun',game:'fun',comic:'fun',color:'fun',postcard:'fun',map:'other',tyre:'service',scratch:'lottery',scratch4:'lottery',scratch10:'lottery'};
const PANEL=[166,50,308,214];
// az autószerviz csak karosszériát javít (a légzsák a karosszériajavítás része)
function garageCost(){const T=G.trip,hp=T.hp===undefined?100:T.hp;return Math.round(((100-hp)*3200+(T.airbag?118000:0))/100)*100;}
function garageItems(){const T=G.trip,hp=T.hp===undefined?100:T.hp;return hp<100||T.airbag?[{k:'repair',nm:'Karosszéria',p:garageCost(),repair:true,msg:'A karosszéria megjavítva, mint az új!'}]:[];}
function shopList(type){const T=G.trip,ps=P.shop;if(type==='garage')return garageItems();return SHOPS[type].items.filter(it=>(!it.work||!ps.worked)&&(!it.tyre||!T.spare));}
function cardRect(i){return [PANEL[0]+8+(i%4)*74,PANEL[1]+40+Math.floor(i/4)*60,70,56];}
const GO_BTN=[PANEL[0]+8,PANEL[1]+PANEL[3]-26,PANEL[2]-16,20];
function enterShop(type){G.trip.driveS=Math.max(0,(G.trip.driveS||0)-300);if(typeof cheerUp==='function'&&P.cranky)cheerUp(2,type==='burger'?'A gyerekek imádják a gyorséttermet!':'Jót tett a kis szünet!');P.sub='shop';P.shop={type:type,msg:'',worked:false,anim:0,last:-1};P.hide.apa=1;if(type!=='fuel')P.hide.anna=1;SFX.click();
 if(P.ev&&P.ev.type==='pee'){P.ev=null;flash('Anna elszaladt a mosdóba. Megkönnyebbült!','#7cff7c');}}
function leaveStop(){P.sub='drive';P.hide.apa=0;P.hide.anna=0;P.shop=null;P.pump=null;P.stopCD=P.dist;SFX.clunk();say('Mehetünk tovább!','apa');}
function updShop(){const T=G.trip,ps=P.shop,items=shopList(ps.type);if(ps.anim>0)ps.anim--;
 for(let i=0;i<items.length;i++){if(K.num===i+1||inRect(TAP,cardRect(i))){const it=items[i];
if(it.p){book(-it.p,ITEMCAT[it.k]||'other',SHOPS[ps.type].title+': '+it.nm);SFX.cash();}ps.anim=20;ps.last=i;
  if(it.repair){T.hp=100;T.airbag=0;}if(it.k==='coffee'){T.driveS=Math.max(0,(T.driveS||0)-900);}if(it.food)T.food=Math.min(100,T.food+it.food);if(it.baby)T.baby=Math.min(100,T.baby+it.baby);if(it.mood){T.mood=Math.min(5,T.mood+it.mood);say('Köszönjük, Apa!','anna');}
  if(it.tyre)T.spare=true;if(it.photo)T.photos++;ps.msg=it.msg||('Megvetted: '+it.nm);
  if(it.mult){startMini('scratch',{mult:it.mult,onEnd:r=>{ps.msg=r?'Nyeremény: '+fmt(r)+' Ft!':'Most nem nyert.';}});return;}
  if(it.work){ps.worked=true;startMini('sort',{onEnd:r=>{ps.msg='A zöldséges fizetett: '+fmt(r)+' Ft';}});return;}}}
 if(K.enterKey||inRect(TAP,GO_BTN))leaveStop();}
function drawShopUI(g){const T=G.trip,ps=P.shop,sh=SHOPS[ps.type],items=shopList(ps.type),r=PANEL;
 frr(g,'rgba(12,15,24,0.94)',r[0],r[1],r[2],r[3],10);g.strokeStyle=sh.col;g.lineWidth=1.4;rrect(g,r[0],r[1],r[2],r[3],10);g.stroke();
 frr(g,sh.col,r[0],r[1],r[2],18,10);R(g,sh.col,r[0],r[1]+9,r[2],9);text(g,sh.title,r[0]+10,r[1]+5.5,'#ffffff',1.2,'left',null);text(g,fmt(T.money)+' Ft',r[0]+r[2]-8,r[1]+6,'#b7ffcf',1,'right',null);
 if(ps.type==='fuel'&&P.pump&&P.pump.cost)text(g,'Benzin: '+fmt(P.pump.liters,2)+' l = '+fmt(P.pump.cost)+' Ft  (fizetve)',r[0]+10,r[1]+25,'#b7ffcf',1,'left',null);
 else if(ps.type==='garage'){const hp=T.hp===undefined?100:T.hp;text(g,'Karosszéria állapota: '+hp+'%',r[0]+10,r[1]+25,hp<30?'#ff8a8a':hp<70?'#ffcf33':'#7cff7c',1,'left',null);
  frr(g,'#1b212b',r[0]+86,r[1]+43,r[2]-96,6,3);frr(g,hp<30?'#ff6b6b':hp<70?'#ffcf33':'#5bd06a',r[0]+86,r[1]+43,(r[2]-96)*hp/100,6,3);
  const d=1-hp/100,list=[];if(d>=0.08)list.push('karcok, horpadások');if(d>0.25)list.push('lökhárító, fényszóró');if(d>0.4)list.push('motorháztető, szélvédő');if(d>0.55)list.push('tükör, ajtó');if(T.airbag)list.push('légzsák');
  let y=r[1]+56;text(g,list.length?'Javítandó:':'Nincs sérülés.',r[0]+86,y,'#9fb0c2',1,'left',null);for(const l of list){y+=10;text(g,'· '+l,r[0]+90,y,'#ffffff',1,'left',null);}
  if(list.length){text(g,'Munkadíj: 3 200 Ft / %'+(T.airbag?' + légzsák 118 000 Ft':''),r[0]+86,y+14,'#9fb0c2',1,'left',null);text(g,'Összesen: '+fmt(garageCost())+' Ft',r[0]+86,y+25,'#ffd84a',1,'left',null);}
  else text(g,'A karosszéria ép, nincs mit javítani.',r[0]+r[2]/2,GO_BTN[1]-24,'#7cff7c',1,'center',null);}
 else text(g,'Kaja '+Math.round(T.food)+'%   Baba '+Math.round(T.baby)+'%   Kedv '+T.mood+'/5',r[0]+10,r[1]+25,'#cfd6df',1,'left',null);
 items.forEach((it,i)=>{const c=cardRect(i),hot=ps.last===i&&ps.anim>0,can=true;
  frr(g,hot?'#2f4a3a':'#1f2635',c[0],c[1],c[2],c[3],7);g.strokeStyle=hot?'#5bd06a':'rgba(255,255,255,0.12)';g.lineWidth=0.8;rrect(g,c[0],c[1],c[2],c[3],7);g.stroke();
  frr(g,'rgba(255,255,255,0.05)',c[0]+4,c[1]+4,c[2]-8,26,5);itemIcon(g,it.k,c[0]+c[2]/2,c[1]+17-(hot?Math.sin(ps.anim*0.5)*2:0));
  text(g,it.nm,c[0]+c[2]/2,c[1]+34,can?'#ffffff':'#7a8594',1,'center',null);text(g,it.p?fmt(it.p)+' Ft':'pénzt kapsz',c[0]+c[2]/2,c[1]+45,it.p?(can?'#ffd84a':'#8a6a3a'):'#7cff7c',1,'center',null);
  if(!isTouch)text(g,String(i+1),c[0]+5,c[1]+4,'#6f7d8c',1,'left',null);});
 if(ps.msg)text(g,ps.msg,r[0]+r[2]/2,GO_BTN[1]-12,ps.msg.startsWith('Nincs')?'#ff8a8a':'#7cff7c',1,'center');
 frr(g,'#1d5fb8',GO_BTN[0],GO_BTN[1],GO_BTN[2],GO_BTN[3],7);text(g,isTouch?'Tovább az úton':'Enter: tovább az úton',GO_BTN[0]+GO_BTN[2]/2,GO_BTN[1]+6.5,'#ffffff',1,'center',null);}

/* ---- tankolás ---- */
const PUMP={n95:[PANEL[0]+66,PANEL[1]+76,26,34],nD:[PANEL[0]+66,PANEL[1]+122,26,34],c95:[PANEL[0]+108,PANEL[1]+64,190,40],cD:[PANEL[0]+108,PANEL[1]+110,190,40],
 cancel:[PANEL[0]+108,PANEL[1]+158,190,20],hold:[PANEL[0]+150,PANEL[1]+150,60,60],pay:[PANEL[0]+220,PANEL[1]+164,80,30]};
function updPump(){const pm=P.pump,T=G.trip,L=LEGS[G.leg];pm.t=(pm.t||0)+1;
 if(pm.step==='nozzle'){if(K.num===1||inRect(TAP,PUMP.n95)||inRect(TAP,PUMP.c95)){pm.step='fill';pm.msg='';SFX.clunk();vib(15);}
  else if(K.num===2||inRect(TAP,PUMP.nD)||inRect(TAP,PUMP.cD)){pm.msg='Állj! Ez benzines autó, a Diesel pisztoly rossz!';pm.shake=20;SFX.alarm();vib([40,30,40]);}
  else if(K.num===3||inRect(TAP,PUMP.cancel)){leaveStop();P.lane=1;P.blink=60;return;}
  if(pm.shake>0)pm.shake--;}
 else if(pm.step==='fill'){const hx=PUMP.hold[0]+30,hy=PUMP.hold[1]+30;const on=(K.pump||(HOLD&&Math.hypot(HOLD.x-hx,HOLD.y-hy)<32))&&!pm.full;
  if(on){const add=Math.min(0.22,CAR.tank-T.fuel);T.fuel+=add;pm.liters+=add;if(Math.floor(pm.liters)!==Math.floor(pm.liters-add))SFX.tick();if(pm.t%4===0)noise(0.06,0.05,0,900);if(CAR.tank-T.fuel<0.01){pm.full=true;SFX.clunk();vib(30);pm.msg='KATT! Tele a tank.';}}
  pm.on=on;if(K.enterKey||inRect(TAP,PUMP.pay)){if(pm.liters>0.01){pm.liters=Math.round(pm.liters*100)/100;const cost=Math.round(pm.liters*L.price);book(-cost,'fuel','Tankolás: '+fmt(pm.liters,2)+' l x '+L.price+' Ft/l');pm.cost=cost;SFX.cash();vib(20);}enterShop('fuel');P.shop.msg=pm.liters>0.01?'Köszönjük! Jó utat!':'';}}}
function drawPumpUI(g){const pm=P.pump,T=G.trip,L=LEGS[G.leg],r=PANEL;const sh=pm.shake?Math.sin(pm.shake*1.6)*2:0;
 frr(g,'rgba(12,15,24,0.94)',r[0],r[1],r[2],r[3],10);g.strokeStyle='#2e8b57';g.lineWidth=1.4;rrect(g,r[0],r[1],r[2],r[3],10);g.stroke();
 frr(g,'#2e8b57',r[0],r[1],r[2],18,10);R(g,'#2e8b57',r[0],r[1]+9,r[2],9);text(g,'Benzinkút - tankolás',r[0]+10,r[1]+5.5,'#ffffff',1.2,'left',null);text(g,'95: '+L.price+' Ft/l',r[0]+r[2]-8,r[1]+6,'#ffffff',1,'right',null);
 // a kút
 const px=r[0]+10,py=r[1]+26;frr(g,lg(g,px,0,px+62,0,[[0,'#3aa36a'],[1,'#22744a']]),px,py,58,176,8);frr(g,'#0d1a12',px+6,py+8,46,40,4);
 text(g,'LITER',px+9,py+12,'#5bd06a',1,'left',null);text(g,fmt(pm.liters,2),px+48,py+21,'#b7ffcf',1,'right',null);text(g,'FT',px+9,py+31,'#5bd06a',1,'left',null);text(g,fmt(Math.round(Math.round(pm.liters*100)/100*L.price)),px+48,py+40,'#b7ffcf',1,'right',null);
 frr(g,'#ffcf33',px,py+54,58,6,1);text(g,'95  DIESEL',px+29,py+55,'#1b1f26',0.8,'center',null);
 // pisztolyok a tartóban
 const noz=(rc,col,lbl,inHolster)=>{frr(g,'#1b1f26',rc[0]-2,rc[1]-2,rc[2]+4,rc[3]+4,4);if(inHolster){frr(g,col,rc[0]+3,rc[1]+2,rc[2]-6,rc[3]-8,4);frr(g,'#3a3f47',rc[0]+rc[2]-8,rc[1]+rc[3]-10,10,4,1.5);text(g,lbl,rc[0]+rc[2]/2-1,rc[1]+10,'#ffffff',0.8,'center',null);}else text(g,'-',rc[0]+rc[2]/2,rc[1]+12,'#5a636d',1,'center',null);};
 noz([PUMP.n95[0]+sh*0,PUMP.n95[1],PUMP.n95[2],PUMP.n95[3]],'#2e8b57','95',pm.step==='nozzle');noz(PUMP.nD,'#1b1f26','D',true);
 if(pm.step!=='nozzle'){g.strokeStyle='#1b1f26';g.lineWidth=2.4;g.beginPath();g.moveTo(PUMP.n95[0]+13,PUMP.n95[1]+30);g.quadraticCurveTo(r[0]-10,r[1]+260,r[0]-60,r[1]+150);g.stroke();}
 const R0=r[0]+108;
 if(pm.step==='nozzle'){text(g,'Vedd fel a töltőpisztolyt!',R0,r[1]+28,'#ffffff',1.1,'left',null);
  const card=(rc,col,ttl,sub,k)=>{frr(g,col,rc[0]+(k==='d'?sh:0),rc[1],rc[2],rc[3],8);text(g,ttl,rc[0]+44,rc[1]+9,'#ffffff',1.3,'left',null);text(g,sub,rc[0]+44,rc[1]+25,'#d0f0dc',1,'left',null);
   frr(g,k==='d'?'#3a3f47':'#5bd06a',rc[0]+8,rc[1]+8,26,24,5);text(g,k==='d'?'D':'95',rc[0]+21,rc[1]+16,'#ffffff',1,'center',null);};
  card(PUMP.c95,'#2e8b57','Benzin 95',(isTouch?'':'1: ')+L.price+' Ft/l - ez kell!','b');card(PUMP.cD,'#2a2f38','Diesel',(isTouch?'':'2: ')+'gázolaj','d');
  frr(g,'#3a4150',PUMP.cancel[0],PUMP.cancel[1],PUMP.cancel[2],PUMP.cancel[3],6);text(g,isTouch?'Mégse, tovább':'3: Mégse, tovább',PUMP.cancel[0]+PUMP.cancel[2]/2,PUMP.cancel[1]+6.5,'#ffffff',1,'center',null);}
 else{text(g,'Tankolás',R0,r[1]+28,'#ffffff',1.1,'left',null);
  // tank telítődése
  const tx=R0,ty=r[1]+44,tw=190,th=26,fl=T.fuel/CAR.tank;frr(g,'#1b212b',tx,ty,tw,th,10);g.save();rrect(g,tx,ty,tw,th,10);g.clip();
  const wv=pm.on?Math.sin(pm.t*0.3)*1.2:0;g.fillStyle=lg(g,0,ty,0,ty+th,[[0,'#ffd75a'],[1,'#e8a01a']]);g.beginPath();g.moveTo(tx,ty+th);g.lineTo(tx,ty+th*(1-0.9)+wv);
  g.lineTo(tx+tw*fl,ty+th*0.1-wv);g.lineTo(tx+tw*fl,ty+th);g.closePath();g.fillRect(tx,ty,tw*fl,th);if(pm.on)for(let i=0;i<5;i++)disc(g,'rgba(255,255,255,0.5)',tx+((pm.t*3+i*37)%Math.max(8,tw*fl)),ty+6+((i*7+pm.t)%14),1);
  g.restore();g.strokeStyle='rgba(255,255,255,0.3)';g.lineWidth=0.8;rrect(g,tx,ty,tw,th,10);g.stroke();text(g,fmt(T.fuel,1)+' / '+CAR.tank+' l',tx+tw/2,ty+9.5,'#1b1f26',1,'center',null);
  text(g,fmt(pm.liters,2)+' l',tx,ty+36,'#b7ffcf',2,'left',null);text(g,fmt(Math.round(Math.round(pm.liters*100)/100*L.price))+' Ft',tx,ty+58,'#ffd84a',2,'left',null);
  // nagy tankoló gomb
  const hx=PUMP.hold[0]+30,hy=PUMP.hold[1]+30;disc(g,pm.on?'#3fb06e':'#2e8b57',hx,hy,26);g.strokeStyle='#ffffff';g.lineWidth=2.4;g.beginPath();g.arc(hx,hy,29,-Math.PI/2,-Math.PI/2+TAU*fl);g.stroke();
  itemIcon(g,'water',hx,hy-6);text(g,pm.full?'TELE':isTouch?'TARTSD':'SPACE',hx,hy+6,'#ffffff',1,'center',null);
  frr(g,'#1d5fb8',PUMP.pay[0],PUMP.pay[1],PUMP.pay[2],PUMP.pay[3],8);text(g,isTouch?'Fizetés':'Enter: fizetés',PUMP.pay[0]+PUMP.pay[2]/2,PUMP.pay[1]+11.5,'#ffffff',1,'center',null);}
 if(pm.msg)text(g,pm.msg,r[0]+r[2]/2,r[1]+r[3]-12,pm.msg.startsWith('Állj')?'#ff8a8a':'#7cff7c',1,'center');}
