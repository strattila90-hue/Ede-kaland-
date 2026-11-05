'use strict';
/* =========================================================
   VILÁG – útvonal, útszakaszok, táj, út rajzolása
   ========================================================= */
// útszakasz: [típus, név, minőség]   típus: town | village | country | motorway   minőség: good | medium | bad | cobble
const LEGS=[
 {from:'Komárom, Táncsics Mihály utca',to:'Siófok',km:150,region:'hu',weather:'sun',time:'day',price:612,cur:'Ft',
  segs:[['town','Komárom','medium'],['town','Komárom','cobble'],['village','Ács','medium'],['country','','bad'],['village','Bábolna','medium'],['country','','medium'],['motorway','M1','good','HU'],['motorway','M0','good','HU'],['motorway','M7','good','HU'],['town','Siófok','good']]},
 {from:'Siófok',to:'Keszthely',km:80,region:'hu',weather:'rain',time:'day',price:612,
  segs:[['town','Siófok','good'],['country','','medium'],['village','Balatonszárszó','medium'],['village','Balatonboglár','bad'],['country','','good'],['village','Fonyód','medium'],['country','','bad'],['village','Balatonberény','cobble'],['town','Keszthely','medium']]},
 {from:'Keszthely',to:'Bécs',km:260,region:'hu',weather:'cloudy',time:'day',price:612,
  segs:[['town','Keszthely','medium'],['country','','medium'],['village','Sümeg','medium'],['country','','bad'],['town','Szombathely','good'],['country','','medium'],['motorway','A3','good','AT'],['motorway','A2','good','AT'],['town','Bécs','cobble'],['town','Bécs','good']]},
 {from:'Bécs',to:'Salzburg (Alpok)',km:300,region:'alps',weather:'snow',time:'day',price:655,
  segs:[['town','Bécs','good'],['motorway','A1','good','AT'],['motorway','A1','good','AT'],['village','Mondsee','medium'],['country','','bad'],['village','St. Gilgen','cobble'],['country','','medium'],['town','Salzburg','good']]},
 {from:'Salzburg',to:'Velence',km:470,region:'it',weather:'fog',time:'day',price:735,
  segs:[['town','Salzburg','good'],['motorway','A10','good','AT'],['motorway','A10','good','AT'],['country','','medium'],['motorway','A23','good','IT'],['motorway','A4','good','IT'],['village','Mestre','bad'],['town','Velence','cobble']]},
 {from:'Velence',to:'Párizs',km:1100,region:'fr',weather:'clear',time:'night',price:730,
  segs:[['town','Velence','good'],['motorway','A4','good','IT'],['motorway','A4','good','IT'],['country','','medium'],['motorway','A6','good','FR'],['village','Beaune','cobble'],['motorway','A6','good','FR'],['motorway','A6','good','FR'],['town','Párizs','cobble'],['town','Párizs','good']]},
 {from:'Párizs',to:'Provence',km:690,region:'provence',weather:'storm',time:'dusk',price:730,
  segs:[['town','Párizs','good'],['motorway','A6','good','FR'],['motorway','A7','good','FR'],['country','','medium'],['village','Orange','cobble'],['country','','bad'],['village','Gordes','cobble'],['town','Avignon','medium']]},
 {from:'Provence',to:'Komárom (haza)',km:1400,region:'hu',weather:'sun',time:'sunset',price:612,
  segs:[['town','Avignon','medium'],['motorway','A7','good','FR'],['motorway','A9','good','FR'],['motorway','A4','good','IT'],['motorway','A1','good','AT'],['motorway','M1','good','HU'],['country','','medium'],['village','Ács','medium'],['town','Komárom','cobble'],['town','Komárom','medium']]}];
const LIVE_XY=[[47.743,18.119],[46.904,18.058],[46.765,17.243],[48.208,16.373],[47.809,13.055],[45.441,12.316],[48.857,2.352],[43.949,4.806],[47.743,18.119]];
const CITY_XY=[['Komárom',344,106],['Siófok',338,140],['Keszthely',318,150],['Bécs',312,98],['Salzburg',262,116],['Velence',262,158],['Párizs',150,92],['Provence',176,172],['Komárom',344,106]];
const WNAME={sun:'Napsütés',rain:'Eső',cloudy:'Borult ég',snow:'Havazás',fog:'Köd',clear:'Csillagos éjszaka',storm:'Vihar'};
const TNAME={day:'',night:', éjszaka',dusk:', alkonyat',sunset:', naplemente'};
const QNAME={good:'Jó minőségű út',medium:'Közepes út',bad:'Rossz, kátyús út',cobble:'Macskaköves út'};
const LIMIT={town:50,village:50,country:90,motorway:130};
const SEGW={town:1,village:0.7,country:1.1,motorway:2.2};

function buildLeg(i){const L=LEGS[i];const len=Math.round(7000+L.km*4.6);const tw=L.segs.reduce((s,q)=>s+SEGW[q[0]],0);let x=0;
 const segs=L.segs.map(q=>{const w=len*SEGW[q[0]]/tw;const s={type:q[0],name:q[1],q:q[2],cc:q[3]||'',x0:x,x1:x+w,limit:(L.region!=='hu'&&q[0]==='country')?100:LIMIT[q[0]]};x+=w;return s;});
 segs[segs.length-1].x1=len+2000;segs[0].x0=-3000;
 const nSt=Math.max(1,Math.round(L.km/320));const stations=[];
 for(let k=0;k<nSt;k++){let sx=len*(k+0.55)/nSt;const s=segAtIn(segs,sx);if(s.type==='town'||s.type==='village'){const alt=segs.find(q=>q.type!=='town'&&q.type!=='village'&&q.x0>s.x0);if(alt)sx=(alt.x0+alt.x1)/2;}stations.push(sx);}
 const lights=[];for(const s of segs)if(s.type==='town')for(let tx=s.x0+500;tx<s.x1-300;tx+=1300)lights.push({x:tx,ph:Math.floor(hsh(tx)*400)});
 return {len:len,segs:segs,stations:stations,lights:lights,kmPerPx:L.km/len};}
function segAtIn(segs,x){for(const s of segs)if(x<s.x1)return s;return segs[segs.length-1];}

/* ---- ég, felhők, nap ---- */
function skyCols(L){if(L.time==='night')return ['#060a24','#22325f'];if(L.weather==='storm')return ['#2f3744','#6f7987'];
 if(['rain','snow','cloudy','fog'].includes(L.weather))return ['#8797ad','#d8dfe6'];if(L.time==='dusk')return ['#2f3b78','#f29a5f'];if(L.time==='sunset')return ['#46589f','#ffb06a'];return ['#3d97e6','#cbeeff'];}
function drawSky(g,L,t){const [a,b]=skyCols(L);g.fillStyle=lg(g,0,0,0,ROADT,[[0,a],[1,b]]);g.fillRect(0,0,W,ROADT);
 if(L.time==='night'){for(let i=0;i<110;i++){const x=hsh(i*3+1)*W,y=hsh(i*7+2)*140,tw=0.4+0.6*Math.abs(Math.sin(t*0.03+i));g.fillStyle='rgba(255,255,255,'+(0.3+0.6*hsh(i)*tw)+')';g.fillRect(x,y,0.6,0.6);}
  glow(g,400,36,30,'rgba(240,240,210,0.25)');disc(g,'#f4f1d8',400,36,9);disc(g,'rgba(200,195,170,0.6)',397,33,2);disc(g,'rgba(200,195,170,0.6)',403,39,1.2);return;}
 if(L.weather!=='sun'&&L.weather!=='clear')return;
 if(L.time==='sunset'||L.time==='dusk'){glow(g,380,150,70,'rgba(255,200,120,0.55)');disc(g,'#ffe3a0',380,150,16);return;}
 glow(g,405,38,60,'rgba(255,250,210,0.6)');disc(g,'#fff9d8',405,38,12);}
function cloud(g,x,y,s,cA,cB){disc(g,cB,x,y+4*s,9*s);disc(g,cB,x+15*s,y+5*s,8*s);disc(g,cA,x+6*s,y,10*s);disc(g,cA,x+19*s,y+2*s,7.5*s);disc(g,cA,x-6*s,y+3*s,6.5*s);
 g.fillStyle=lg(g,0,y,0,y+12*s,[[0,'rgba(255,255,255,0)'],[1,'rgba(0,20,50,0.08)']]);g.fillRect(x-14*s,y-2*s,44*s,15*s);}
function drawClouds(g,L,dist,t){const oc=['rain','storm','snow','cloudy','fog'].includes(L.weather),night=L.time==='night';
 const cA=night?'#2a345e':oc?(L.weather==='storm'?'#5b6472':'#cdd4dc'):'#ffffff',cB=night?'#1f2950':oc?(L.weather==='storm'?'#454d5a':'#aeb8c3'):'#e1ecf5';
 const o=dist*0.04+t*0.12,slot=110,i0=Math.floor(o/slot)-1,s=oc?1.4:1;
 for(let i=i0;i<i0+7;i++){const h=hsh(i*31+7);if(!oc&&h<0.35)continue;cloud(g,i*slot-o+h*40,14+hsh(i*13+1)*55,s*(0.8+hsh(i*5)*0.5),cA,cB);}}
function hills(g,o,col,base,amp,f,seed){g.fillStyle=lg(g,0,base-amp*1.6,0,ROADT,[[0,col],[1,shade(col,0.82)]]);g.beginPath();g.moveTo(0,ROADT);
 for(let x=0;x<=W;x+=3){const X=x+o;g.lineTo(x,base-amp*Math.sin(X*f+seed)-amp*0.6*Math.sin(X*f*2.3+seed*3));}g.lineTo(W,ROADT);g.closePath();g.fill();}
function drawFar(g,L,seg,dist,lights){const snow=L.weather==='snow',night=L.time==='night',reg=L.region;
 if(reg==='alps'||(reg==='it'&&seg.type==='motorway')){const o=dist*0.06,slot=120,i0=Math.floor(o/slot)-1;
  for(let i=i0;i<i0+6;i++){const h=hsh(i*17+3),px=i*slot-o+60+(h-0.5)*40,ph=70+h*75,base=ROADT-10;
   g.fillStyle=lg(g,0,base-ph,0,base,[[0,'#8fa0c0'],[1,'#5f7092']]);g.beginPath();g.moveTo(px-105,base);g.quadraticCurveTo(px-30,base-ph*0.8,px,base-ph);g.quadraticCurveTo(px+30,base-ph*0.8,px+105,base);g.closePath();g.fill();
   g.fillStyle='rgba(30,40,70,0.18)';g.beginPath();g.moveTo(px,base-ph);g.quadraticCurveTo(px+30,base-ph*0.8,px+105,base);g.lineTo(px+20,base);g.closePath();g.fill();
   g.fillStyle='#f5f8fb';g.beginPath();g.moveTo(px,base-ph);g.quadraticCurveTo(px+12,base-ph*0.86,px+26,base-ph*0.7);g.lineTo(px+12,base-ph*0.74);g.lineTo(px+2,base-ph*0.66);g.lineTo(px-10,base-ph*0.75);g.lineTo(px-26,base-ph*0.7);g.quadraticCurveTo(px-12,base-ph*0.86,px,base-ph);g.fill();}
  hills(g,dist*0.18,snow?'#e6edf3':'#5f9a5a',ROADT-24,7,0.012,5);return;}
 if(seg.type==='town'){const o=dist*0.1,slot=22,i0=Math.floor(o/slot)-1;
  for(let i=i0;i<i0+25;i++){const h=hsh(i*7+1),x=i*slot-o,bh=30+h*80;frr(g,night?'#27315a':'#a7b7cd',x,ROADT-12-bh,slot-2,bh+12,1.5);
   if(h>0.8)R(g,night?'#27315a':'#a7b7cd',x+8,ROADT-26-bh,1.5,14);
   for(let wy=ROADT-8-bh;wy<ROADT-16;wy+=6)for(let wx=x+3;wx<x+slot-5;wx+=5){const lit=night&&hsh(i*991+wy*7+wx)>0.55;R(g,lit?'#ffd77a':(night?'#38446a':'#c3d0df'),wx,wy,2,3);}}return;}
 if(reg==='it'&&seg.type!=='country'){g.fillStyle=lg(g,0,ROADT-48,0,ROADT,[[0,night?'#1d3d6b':'#5aa4dc'],[1,night?'#132a4a':'#2f78b8']]);g.fillRect(0,ROADT-48,W,48);
  for(let i=0;i<26;i++){const x=((hsh(i)*W-dist*0.12*(0.5+hsh(i+9)))%W+W)%W;R(g,'rgba(220,240,255,0.7)',x,ROADT-44+hsh(i*5)*30,5,0.6);}
  R(g,'#e8d3a2',0,ROADT-14,W,14);return;}
 const col1=snow?'#dfe7ee':reg==='provence'?'#a9b46a':'#8cbc72',col2=snow?'#cfd9e2':reg==='provence'?'#8a9a52':'#6aa35a';
 hills(g,dist*0.08,col1,ROADT-50,12,0.008,7);hills(g,dist*0.16,col2,ROADT-32,9,0.014,3);
 if(reg==='provence'&&!snow)for(let k=0;k<14;k++){const y=ROADT-28+k*1.8;g.fillStyle=k%2?'#8a63c9':'#a988e0';g.fillRect(0,y,W,0.9);}
 else if(!snow&&seg.type!=='motorway')for(let x=0;x<W;x+=7)R(g,'rgba(240,220,120,0.25)',x+((-dist*0.16)%7),ROADT-15,3.5,0.8);}

/* ---- középső réteg: házak, fák, táblák ---- */
function tree(g,x,b,s,snow){frr(g,'#6b4a2b',x+s*4-1,b-s*7,2.4,s*7,1);disc(g,'#356f33',x+s*4.3,b-s*10,s*4.2);disc(g,'#4e9446',x+s*3.2,b-s*11.2,s*3.2);disc(g,'rgba(255,255,255,0.12)',x+s*2.8,b-s*12,s*1.5);if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.arc(x+s*4,b-s*12,s*3.8,Math.PI,TAU);g.fill();}}
function pine(g,x,b,h,snow){frr(g,'#5a3d22',x+6,b-6,3,6,1);for(let k=0;k<3;k++){const y=b-6-k*h/4;g.fillStyle=lg(g,x,0,x+15,0,[[0,'#2b6342'],[1,'#1f4d33']]);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y-h/4,x+7.5,y-h/2.2);g.quadraticCurveTo(x+9,y-h/4,x+15,y);g.closePath();g.fill();
  if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(x+4,y-h/3.4);g.lineTo(x+7.5,y-h/2.2);g.lineTo(x+11,y-h/3.4);g.quadraticCurveTo(x+7.5,y-h/3.8,x+4,y-h/3.4);g.fill();}}}
function house(g,x,b,col,roof,night,lights,snow,num){frr(g,lg(g,x,0,x+44,0,[[0,col],[1,shade(col,0.88)]]),x,b-26,44,26,1);g.fillStyle=roof;g.beginPath();g.moveTo(x-4,b-25);g.lineTo(x+22,b-44);g.lineTo(x+48,b-25);g.closePath();g.fill();
 g.fillStyle='rgba(0,0,0,0.15)';g.beginPath();g.moveTo(x+22,b-44);g.lineTo(x+48,b-25);g.lineTo(x+22,b-25);g.closePath();g.fill();if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(x+1,b-28.5);g.lineTo(x+22,b-44);g.lineTo(x+43,b-28.5);g.lineTo(x+22,b-41);g.closePath();g.fill();}
 frr(g,'#7a3b20',x+32,b-46,4,10,0.5);frr(g,'#7a4f28',x+18,b-14,8,14,1);disc(g,'#d9b24a',x+24.5,b-7,0.6);
 for(const wx of [5,30]){frr(g,night?'#ffd77a':lg(g,0,b-21,0,b-14,[[0,'#cfe6f3'],[1,'#7ea8c2']]),x+wx,b-21,8,7,0.6);R(g,'#ffffff',x+wx+3.6,b-21,0.8,7);frr(g,'#3f7d3a',x+wx-2,b-21,2,7,0.4);frr(g,'#3f7d3a',x+wx+8,b-21,2,7,0.4);if(night&&lights)lights.push({x:x+wx+4,y:b-17,r:8});}
 if(num){frr(g,'#2a5db0',x+28,b-13,7,4.4,0.8);text(g,num,x+29,b-12.2,'#fff',0.5,'left',null);}}
function church(g,x,b,night){frr(g,'#efe6d2',x,b-32,46,32,1);g.fillStyle='#a8432e';g.beginPath();g.moveTo(x-3,b-31);g.lineTo(x+23,b-46);g.lineTo(x+49,b-31);g.closePath();g.fill();
 frr(g,'#f5eedd',x+16,b-72,14,72,1);g.fillStyle='#4f7a6a';g.beginPath();g.moveTo(x+14,b-72);g.quadraticCurveTo(x+23,b-80,x+23,b-96);g.quadraticCurveTo(x+23,b-80,x+32,b-72);g.closePath();g.fill();
 R(g,'#d9b24a',x+22.4,b-102,1.2,7);R(g,'#d9b24a',x+20.5,b-99.5,5,1.2);disc(g,'#ffffff',x+23,b-60,3);line(g,'#333',x+23,b-60,x+23,b-62.4,0.5);frr(g,night?'#ffd77a':'#7aa7c7',x+20,b-48,6,10,3);frr(g,'#7a4f28',x+19,b-14,8,14,3);}
function building(g,x,b,w,h,i,night,lights){const cols=['#e3b98f','#c9d8e8','#f0d6a8','#d7a3a0','#b8cfb2','#e9e1cf','#d9c7e8'],col=cols[(hsh(i*3)*cols.length)|0];
 frr(g,lg(g,x,0,x+w,0,[[0,col],[1,shade(col,0.85)]]),x,b-h,w,h,1);R(g,shade(col,0.75),x,b-h,w,3);
 for(let wy=b-h+8;wy<b-24;wy+=12)for(let wx=x+5;wx<x+w-8;wx+=12){const lit=night&&hsh(i*77+wx*3+wy)>0.45;frr(g,lit?'#ffd77a':(night?'#2e3550':lg(g,0,wy,0,wy+8,[[0,'#cfe6f3'],[1,'#6f98b3']])),wx,wy,7,8,0.6);R(g,shade(col,0.7),wx-1,wy+8,9,1);if(lit&&lights)lights.push({x:wx+3,y:wy+4,r:6});}
 const a1=['#e53935','#1e88e5','#43a047','#fb8c00'][(hsh(i*5)*4)|0];for(let k=0;k<w;k+=6){g.fillStyle=(k/6)%2?a1:'#ffffff';g.beginPath();g.moveTo(x+k,b-22);g.lineTo(x+k+6,b-22);g.lineTo(x+k+6,b-18);g.quadraticCurveTo(x+k+3,b-16,x+k,b-18);g.closePath();g.fill();}
 frr(g,night?'#ffe9a8':'#5f6f7f',x+4,b-15,w/2-6,10,1);frr(g,'#5a3d22',x+w-18,b-17,10,17,1);if(night&&lights)lights.push({x:x+w/4,y:b-10,r:14});}
function palm(g,x,b){g.strokeStyle='#8a6a3e';g.lineWidth=3;g.beginPath();g.moveTo(x+8,b);g.quadraticCurveTo(x+4,b-28,x+10,b-50);g.stroke();
 for(const [dx,dy] of [[-16,6],[16,6],[-12,-6],[12,-6],[0,-10]]){g.strokeStyle='#2f8a3e';g.lineWidth=2;g.beginPath();g.moveTo(x+10,b-50);g.quadraticCurveTo(x+10+dx*0.6,b-56+dy*0.3,x+10+dx,b-50+dy);g.stroke();}}
function roadSign(g,x,b,txt,kind){const t=txt.toUpperCase(),w=textW(t)+10;
 if(kind==='motorway'){line(g,'#7d858d',x+w/2,b,x+w/2,b-34,1.6);frr(g,'#ffffff',x,b-52,w,18,2);frr(g,'#1d5fb8',x+1,b-51,w-2,16,1.6);text(g,t,x+5,b-46,'#ffffff',1,'left',null);}
 else if(kind==='exit'){line(g,'#7d858d',x+w/2,b,x+w/2,b-22,1.4);frr(g,'#ffffff',x,b-36,w,14,1);g.strokeStyle='#1a1a1a';g.lineWidth=1;rrect(g,x+1,b-35,w-2,12,1);g.stroke();text(g,t,x+5,b-32,'#1a1a1a',1,'left',null);line(g,'#d32f2f',x+2,b-23,x+w-2,b-35,1.6);}
 else{line(g,'#7d858d',x+w/2,b,x+w/2,b-22,1.4);frr(g,'#ffffff',x,b-36,w,14,1);g.strokeStyle='#1a1a1a';g.lineWidth=1;rrect(g,x+1,b-35,w-2,12,1);g.stroke();text(g,t,x+5,b-32,'#1a1a1a',1,'left',null);}}
function limitSign(g,x,b,v){line(g,'#7d858d',x,b,x,b-20,1.2);disc(g,'#d32f2f',x,b-25,6.2);disc(g,'#ffffff',x,b-25,4.6);text(g,String(v),x+0.3,b-27.4,'#111',v>=100?0.42:0.55,'center',null);}
function drawMid(g,L,leg,dist,lights){const night=L.time==='night',snow=L.weather==='snow',f=0.55,o=dist*f,b=ROADT-8,reg=L.region;
 const slot=84,i0=Math.floor(o/slot)-1;
 for(let i=i0;i<i0+8;i++){const m=i*slot,x=m-o,wx=(m-PX)/f+PX,s=segAtIn(leg.segs,wx),h=hsh(i*13+5);
  if(s.type==='town'){if(reg==='it'&&h<0.25){palm(g,x+10,b);continue;}building(g,x,b,78,60+hsh(i*7)*70,i,night,lights);}
  else if(s.type==='village'){if(h<0.1)church(g,x+20,b,night);else if(h<0.72)house(g,x+18,b,['#f4efe2','#f2e2b8','#e8d6c8','#dfe9ef'][(hsh(i)*4)|0],reg==='provence'?'#c2552f':['#b5452b','#8a3a2a','#a85a2a'][(hsh(i*9)*3)|0],night,lights,snow);else{tree(g,x+10,b,3,snow);tree(g,x+48,b,2,snow);}}
  else if(s.type==='country'){if(reg==='alps'){pine(g,x+6,b,40+h*20,snow);pine(g,x+40,b,30+h*12,snow);}else if(h<0.55){tree(g,x+18,b,3,snow);}else if(h<0.7){tree(g,x+6,b,2,snow);tree(g,x+44,b,3,snow);}
   else if(h<0.85){line(g,'#6b4a2b',x+30,b,x+30,b-70,2.4);line(g,'#6b4a2b',x+21,b-66,x+39,b-66,1.6);}}
  else{if(h<0.3)tree(g,x+18,b,2.5,snow);else if(h<0.42&&reg!=='alps'){/* zajvédő fal */frr(g,'#a7b0ba',x,b-22,84,22,1);for(let k=0;k<84;k+=12)R(g,'#8f99a4',x+k,b-22,1,22);}}}}
/* ---- közeli réteg: járda, korlát, táblák (az úttal együtt mozog) ---- */
function drawNear(g,L,leg,dist,lights,t){const snow=L.weather==='snow',night=L.time==='night',y0=ROADT-10;
 // típusonként sávokban rajzolva
 for(const s of leg.segs){const a=Math.max(0,s.x0-dist+PX),bx=Math.min(W,s.x1-dist+PX);if(bx<=a)continue;const w=bx-a;
  if(s.type==='town'){R(g,'#c4beb3',a,y0,w,10);for(let x=a-((dist+a)%16);x<bx;x+=16)if(x>=a)R(g,'#aaa398',x,y0,0.6,10);R(g,'#8f8a82',a,ROADT-2,w,2);}
  else if(s.type==='village'){R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);for(let x=a-((dist+a)%8);x<bx;x+=8)if(x>=a)frr(g,'#a07c4a',x,y0-4,1.8,12,0.6);R(g,'#b8925a',a,y0-1,w,1.6);R(g,'#b8925a',a,y0+4,w,1.6);}
  else if(s.type==='country'){R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);R(g,'#b9ab8c',a,ROADT-3,w,3);for(let x=a-((dist+a)%60);x<bx;x+=60)if(x>=a){frr(g,'#ffffff',x,y0-2,1.6,9,0.6);R(g,'#1a1a1a',x,y0-1,1.6,2);}}
  else{R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);R(g,lg(g,0,y0+1,0,y0+6,[[0,'#e2e6ea'],[1,'#8f979f']]),a,y0+1.5,w,3.6);for(let x=a-((dist+a)%24);x<bx;x+=24)if(x>=a)frr(g,'#7d858d',x,y0+1,1.8,9,0.5);}}
 // utcai lámpák városban
 for(let x=-((dist)%150)+40;x<W+10;x+=150){const wx=dist+x-PX,s=segAtIn(leg.segs,wx);if(s.type!=='town')continue;g.strokeStyle='#3a3f47';g.lineWidth=1.8;g.beginPath();g.moveTo(x,y0+8);g.lineTo(x,120);g.quadraticCurveTo(x,116,x+5,116);g.stroke();
  frr(g,'#3a3f47',x+3,115,8,3,1.2);frr(g,'#ffe9a3',x+4,117.6,6,1.2,0.6);if(night){glow(g,x+7,120,16,'rgba(255,230,160,0.35)');if(lights)lights.push({x:x+7,y:124,r:32});}}
 // helységnév-, autópálya- és sebességtáblák a szakaszhatárokon
 for(let k=0;k<leg.segs.length;k++){const s=leg.segs[k],sx=s.x0-dist+PX+30;if(sx<-90||sx>W+20)continue;const prev=leg.segs[k-1];
  if(s.type==='motorway'&&(!prev||prev.name!==s.name))roadSign(g,sx,y0+8,s.name,'motorway');
  else if((s.type==='town'||s.type==='village')&&s.name&&(!prev||prev.name!==s.name))roadSign(g,sx,y0+8,s.name,'town');
  if(prev&&(prev.type==='town'||prev.type==='village')&&prev.name!==s.name&&prev.name)roadSign(g,sx-70,y0+8,prev.name,'exit');
  if(!prev||prev.limit!==s.limit)limitSign(g,sx+(s.type==='motorway'||s.name?-14:6),y0+8,s.limit);}}

/* ---- út: minőség szerinti felület ---- */
let COBBLE=null;
function cobblePat(g){if(COBBLE)return COBBLE;const [c,x]=mk(12,6,SC);x.fillStyle='#6b6a6a';x.fillRect(0,0,12,6);
 for(const [cx,cy] of [[3,1.5],[9,1.5],[0,4.5],[6,4.5],[12,4.5]]){x.fillStyle='#878585';x.beginPath();x.ellipse(cx,cy,2.6,1.2,0,0,TAU);x.fill();x.fillStyle='rgba(255,255,255,0.15)';x.beginPath();x.ellipse(cx-0.6,cy-0.4,1.2,0.5,0,0,TAU);x.fill();}
 COBBLE=g.createPattern(c,'repeat');return COBBLE;}
function drawRoad(g,L,leg,dist,t){const snow=L.weather==='snow',wet=L.weather==='rain'||L.weather==='storm';
 for(const s of leg.segs){const a=Math.max(0,s.x0-dist+PX),bx=Math.min(W,s.x1-dist+PX);if(bx<=a)continue;const w=bx-a;
  const base=snow?'#7b818b':wet?'#3e424a':s.q==='bad'?'#5d6066':s.q==='medium'?'#575b62':'#4d5159';
  if(s.q==='cobble'&&!snow){const p=cobblePat(g);if(p.setTransform)p.setTransform(new DOMMatrix([1/SC,0,0,1/SC,-dist%12,0]));g.fillStyle=p;g.fillRect(a,ROADT,w,ROADB-ROADT);g.fillStyle='rgba(30,30,40,'+(wet?0.25:0.08)+')';g.fillRect(a,ROADT,w,ROADB-ROADT);}
  else{g.fillStyle=lg(g,0,ROADT,0,ROADB,[[0,shade(base,0.85)],[0.5,base],[1,shade(base,0.92)]]);g.fillRect(a,ROADT,w,ROADB-ROADT);}
  // foltok, repedések
  const den=s.q==='bad'?18:s.q==='medium'?45:999;
  for(let i=Math.floor((dist+a-PX)/den);i<Math.floor((dist+bx-PX)/den)+1;i++){const h=hsh(i*5+11),x=i*den-dist+PX;if(x<a||x>bx)continue;
   if(s.q==='bad'&&h>0.4){frr(g,'rgba(30,30,34,0.35)',x,ROADT+6+h*52,8+h*12,3+h*2,1.5);line(g,'rgba(20,20,24,0.5)',x+2,ROADT+8+h*40,x+9,ROADT+12+h*40,0.5);}
   else if(s.q==='medium'&&h>0.5)frr(g,'rgba(0,0,0,0.18)',x,ROADT+8+h*50,14,3,1.5);}
  R(g,'#30343a',a,ROADT,w,1.6);
  // felfestés
  const lc=snow?'rgba(240,244,248,0.4)':s.q==='bad'?'rgba(233,236,239,0.55)':'#e9ecef';
  if(s.q!=='cobble'){R(g,lc,a,ROADT+4,w,0.9);R(g,lc,a,ROADB-4,w,0.9);const dl=s.type==='motorway'?40:24,dw=s.type==='motorway'?20:12;
   for(let x=a-((dist+a)%dl);x<bx;x+=dl){const xs=Math.max(a,x),xe=Math.min(bx,x+dw);if(xe>xs){R(g,lc,xs,221.6,xe-xs,0.9);if(s.type==='motorway'||s.type==='country')R(g,lc,xs,241.6,xe-xs,0.9);else R(g,lc,xs,241.6,xe-xs,0.9);}}}
  if(s.type==='town'){for(let k=0;k<6;k++){const zx=s.x0+400+k*900-dist+PX;if(zx>a&&zx<bx-30)for(let z=0;z<8;z++)R(g,'#eef1f4',zx+z*4,ROADT+5,2.4,ROADB-ROADT-10);}}}
 if(snow)for(let i=Math.floor(dist/6);i<Math.floor(dist/6)+W/6+2;i++){const h=hsh(i*3);frr(g,'#f4f8fb',i*6-dist,ROADT-1,7,2+h*5,2);frr(g,'#f4f8fb',i*6-dist,ROADB-3-h*4,7,4+h*4,2);}
 if(wet)for(let i=Math.floor(dist/30);i<Math.floor(dist/30)+20;i++){const h=hsh(i*11);if(h>0.5)R(g,'rgba(180,210,240,0.22)',i*30-dist,ROADT+10+h*48,14,0.8);}
 const sgc=segAtIn(leg.segs,dist+PX);const gc=sgc.type==='town'?'#b6b0a6':L.region==='it'&&sgc.type!=='country'?'#e8d3a2':snow?'#eef3f7':'#5d9a4e';
 R(g,gc,0,ROADB,W,H-ROADB);R(g,'rgba(0,0,0,0.2)',0,ROADB,W,1);}
/* ---- közlekedési lámpa ---- */
function lightState(l,t){const c=(t+l.ph)%420;return c<200?'green':c<240?'yellow':'red';}
function drawTrafficLight(g,l,dist,t){const x=l.x-dist+PX;if(x<-20||x>W+20)return;const st=lightState(l,t);
 R(g,'#eef1f4',x,ROADT+4,1.6,ROADB-ROADT-8);line(g,'#2f343b',x+4,ROADT-8,x+4,ROADT-58,1.8);frr(g,'#1f2329',x,ROADT-74,8,18,2);
 for(const [k,c,yy] of [['red','#ff3b30',-70],['yellow','#ffcc00',-65],['green','#34c759',-60]]){disc(g,st===k?c:'#3a3f47',x+4,ROADT+yy,1.9);if(st===k)glow(g,x+4,ROADT+yy,7,{red:'rgba(255,59,48,0.6)',yellow:'rgba(255,204,0,0.6)',green:'rgba(52,199,89,0.6)'}[k]);}}
/* ---- benzinkút ---- */
function drawStation(g,sx,L,lights){if(sx<-230||sx>W+60)return;const night=L.time==='night'||L.time==='dusk';
 frr(g,lg(g,0,ROADT-60,0,ROADT-10,[[0,'#f3f5f7'],[1,'#d6dbe0']]),sx+150,ROADT-56,70,48,2);frr(g,'#2e7d4f',sx+150,ROADT-56,70,6,1);text(g,'SHOP',sx+175,ROADT-55,'#fff',0.8,'left',null);
 frr(g,night?'#ffe9a8':'#8fb4cf',sx+156,ROADT-44,30,22,1.5);frr(g,'#5a6470',sx+192,ROADT-40,16,32,1);
 frr(g,'#e9ecef',sx-10,ROADT-76,160,10,2);frr(g,'#2e7d4f',sx-10,ROADT-68,160,4,1);R(g,'#ffcf33',sx-10,ROADT-76,160,2);
 for(const c of [10,72,134])frr(g,'#b8bec6',sx+c,ROADT-64,4,56,1);text(g,'BENZINKÚT',sx+48,ROADT-74,'#2e7d4f',1,'left',null);
 for(const q of [40,104]){frr(g,'#3a3f47',sx+q-4,ROADT-4,18,4,1);frr(g,lg(g,0,ROADT-28,0,ROADT-4,[[0,'#3a9b62'],[1,'#25694a']]),sx+q-2,ROADT-28,14,24,2);frr(g,'#e9ecef',sx+q,ROADT-25,10,7,1);text(g,'95',sx+q+1.5,ROADT-23.5,'#1a1a1a',0.6,'left',null);
  frr(g,'#1b1f2a',sx+q+12,ROADT-20,2,10,1);}
 line(g,'#7d858d',sx+230,ROADT-8,sx+230,ROADT-112,2.4);frr(g,'#2e7d4f',sx+214,ROADT-136,34,26,2);R(g,'#ffcf33',sx+216,ROADT-134,30,2);text(g,'95',sx+217,ROADT-130,'#fff',0.8,'left',null);text(g,String(L.price),sx+217,ROADT-121,'#fff',0.8,'left',null);
 if(night&&lights){lights.push({x:sx+40,y:ROADT-60,r:44});lights.push({x:sx+104,y:ROADT-60,r:44});lights.push({x:sx+170,y:ROADT-34,r:30});}}
