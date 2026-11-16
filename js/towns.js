'use strict';
/* =========================================================
   TELEPÜLÉSEK – minden város és falu saját arculata:
   - országonkénti építészeti stílus (homlokzatszín, tetőforma, zsalugáter), településenként más-más véletlenmaggal,
     így nincs két egyforma falu;
   - nevezetességek: városonként a saját látványosságai (pl. Párizs: Eiffel-torony), falvanként egy jellegzetes
     templom + egyedi tárgy (víztorony, szobor, kút, szélmalom...), ismert falvaknál a valódi nevezetesség.
   Minden egyszer megrajzolt kép (sprite), képkockánként csak egy képmásolás. A világ (world.js drawMid) hívja.
   ========================================================= */
function tSeed(n){let h=2166136261;n=String(n||'');for(let i=0;i<n.length;i++){h^=n.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)%99991;}
/* országonkénti stílus: f homlokzat, r tető, rt tetőforma, sh zsalugáter */
const TST={HU:{f:['#f2e2b8','#efe6d2','#e8d6c8','#f4efe2','#e9d29a','#dfe9ef'],r:['#b5452b','#8a3a2a','#a85a2a'],rt:'gable',sh:'#3f7d3a'},
 AT:{f:['#f4efe2','#f2e2b8','#efe6d2','#e3eef0','#f0dcc0'],r:['#7a3b2a','#5d6670','#8a3a2a'],rt:'steep',sh:'#5a3d22'},
 CZ:{f:['#f2d29a','#e9c7c2','#d9e4c8','#f4efe2','#f0e0a8'],r:['#b5452b','#9a3a28'],rt:'gable',sh:'#2f6a4a'},
 PL:{f:['#e8b74a','#d7a3a0','#9fc0d8','#b8cfb2','#e9e1cf','#f0c890'],r:['#a8432e','#8a3a2a'],rt:'gable',sh:'#3a4048'},
 DE:{f:['#efe6d2','#f4efe2','#e7dcc5','#f2e8d8'],r:['#5d6670','#4a525b','#8a3a2a'],rt:'fach',sh:'#3a2a1c'},
 DK:{f:['#f2c14e','#d9503a','#4f86c6','#f08a3c','#e8e2d0','#7fb58a'],r:['#a8432e','#3a3f47'],rt:'gable',sh:'#f4f4ef'},
 NL:{f:['#8a4a32','#6f3a28','#9a5a3a','#5a3a2a','#a8643e'],r:['#3a3f47','#2c3138'],rt:'step',sh:'#f4f4ef'},
 BE:{f:['#9a5a3a','#b07a52','#efe6d2','#7a4a32'],r:['#3a3f47'],rt:'step',sh:'#f4f4ef'},
 FR:{f:['#efe6d2','#e9dfc8','#f4efe2','#e2d6bc','#ece2cc'],r:['#56606a','#4a525b'],rt:'mansard',sh:'#4f7fae'},
 IT:{f:['#e8b07a','#d98a5a','#f0c890','#c9764a','#e9d29a','#e6a88a'],r:['#c2552f','#a8432e'],rt:'low',sh:'#3f7d3a'},
 ES:{f:['#f6f4ee','#f2ead8','#efe2c8','#f6f4ee','#f0dcb0'],r:['#c2552f','#b5452b'],rt:'low',sh:'#2f6a8a'},
 PT:{f:['#f6f4ee','#f2d29a','#9fc0d8','#f0b8a8','#f6f4ee'],r:['#c2552f'],rt:'low',sh:'#2f5aa8',tile:1},
 SI:{f:['#f4efe2','#efe6d2','#f2e2b8','#e9e1cf'],r:['#a8432e','#7a3b2a'],rt:'steep',sh:'#5a3d22'},
 HR:{f:['#f4efe2','#f2e2b8','#e9d29a','#efe6d2'],r:['#b5452b','#a8432e'],rt:'gable',sh:'#3f7d3a'}};
const tst=cc=>TST[cc]||TST.HU;
const CAPS={Párizs:1,Madrid:1,Berlin:1,Varsó:1,Róma:1,Bécs:1,Prága:1,Lisszabon:1,Brüsszel:1,Amszterdam:1,Koppenhága:1,Hamburg:1,Barcelona:1,Zágráb:1,Ljubljana:1};

/* ---- rajzelemek ---- */
function tbx(g,x,b,w,h,col){R(g,col,x,b-h,w,h);R(g,shade(col,0.87),x+w*0.66,b-h,w*0.34,h);}
function twins(g,x,y,w,h,rows,cols,n,L,seed,col,sh){const cw=w/cols,rh=h/rows;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const wx=x+c*cw+cw*0.28,wy=y+r*rh+rh*0.22,ww=cw*0.44,wh=rh*0.56,lit=n&&hsh(seed+r*31+c*7)>0.5;
  if(sh&&!n){R(g,sh,wx-ww*0.42,wy,ww*0.38,wh);R(g,sh,wx+ww*1.04,wy,ww*0.38,wh);}R(g,lit?'#ffd77a':n?'#2e3550':(col||'#8fb6cf'),wx,wy,ww,wh);if(!n&&!col)R(g,'#cfe6f3',wx,wy,ww,wh*0.3);if(lit&&L)L.push({x:wx+ww/2,y:wy+wh/2,r:6});}}
function ttri(g,x,b,w,h,col){poly(g,col,[[x,b],[x+w/2,b-h],[x+w,b]]);poly(g,'rgba(0,0,0,0.14)',[[x+w/2,b-h],[x+w,b],[x+w/2,b]]);}
function tspire(g,cx,y,w,h,col){poly(g,col,[[cx-w/2,y],[cx,y-h],[cx+w/2,y]]);poly(g,'rgba(0,0,0,0.18)',[[cx,y-h],[cx+w/2,y],[cx,y]]);R(g,'#d9b24a',cx-0.5,y-h-5,1,5);R(g,'#d9b24a',cx-2,y-h-3.6,4,1);}
function tonion(g,cx,y,r,col){g.fillStyle=col;g.beginPath();g.moveTo(cx-r*0.55,y);g.quadraticCurveTo(cx-r*1.35,y-r*0.95,cx,y-r*2.3);g.quadraticCurveTo(cx+r*1.35,y-r*0.95,cx+r*0.55,y);g.closePath();g.fill();
 g.fillStyle='rgba(255,255,255,0.18)';g.beginPath();g.moveTo(cx-r*0.4,y);g.quadraticCurveTo(cx-r*1.1,y-r*0.95,cx,y-r*2.2);g.quadraticCurveTo(cx-r*0.4,y-r,cx-r*0.1,y);g.closePath();g.fill();R(g,'#d9b24a',cx-0.5,y-r*2.3-5,1,5);}
function tdome(g,cx,y,r,col,rib){g.fillStyle=col;g.beginPath();g.arc(cx,y,r,Math.PI,TAU);g.closePath();g.fill();g.fillStyle='rgba(0,0,0,0.15)';g.beginPath();g.arc(cx,y,r,Math.PI*1.5,TAU);g.lineTo(cx,y);g.closePath();g.fill();
 if(rib){g.strokeStyle=rib;g.lineWidth=0.8;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(cx+k*r*0.36,y);g.quadraticCurveTo(cx+k*r*0.3,y-r*0.8,cx,y-r);g.stroke();}}
 R(g,shade(col,1.1),cx-r*0.14,y-r-r*0.36,r*0.28,r*0.38);disc(g,'#d9b24a',cx,y-r-r*0.42,1.3);}
function tcren(g,x,y,w,col,st){st=st||3;for(let k=0;k<w-0.1;k+=st*2)R(g,col,x+k,y-st,st,st);}
function tarcade(g,x,b,w,h,n,dark){const aw=w/n;g.fillStyle=dark||'#3a3228';g.beginPath();for(let k=0;k<n;k++){const ax=x+k*aw+aw*0.18,ww=aw*0.64;g.moveTo(ax,b);g.lineTo(ax,b-h+ww/2);g.arc(ax+ww/2,b-h+ww/2,ww/2,Math.PI,TAU);g.lineTo(ax+ww,b);g.closePath();}g.fill();}
function tcols(g,x,b,w,h,n,col){for(let k=0;k<n;k++){const cx=x+k*(w-3)/(n-1);R(g,col,cx,b-h,3,h);R(g,'rgba(0,0,0,0.15)',cx+2,b-h,1,h);}}
function tflag(g,x,y,cols){line(g,'#6b6f75',x,y,x,y+22,0.8);for(let k=0;k<cols.length;k++)R(g,cols[k],x+0.5,y+k*(7/cols.length),11,7/cols.length);}
function twater(g,x,b,w,h){R(g,'#4f8fc6',x,b-h,w,h);R(g,'#6aa8dc',x,b-h,w,1.4);for(let k=0;k<w;k+=13)R(g,'rgba(255,255,255,0.5)',x+k+(k%26?4:0),b-h+3+(k%3),6,0.7);}
function tboat(g,x,b,col,sail){poly(g,col||'#f4f4ef',[[x,b-6],[x+26,b-6],[x+22,b],[x+4,b]]);if(sail){line(g,'#6b4a2b',x+13,b-6,x+13,b-34,1);poly(g,'#ffffff',[[x+14,b-33],[x+26,b-9],[x+14,b-9]]);poly(g,sail,[[x+12,b-30],[x+3,b-9],[x+12,b-9]]);}}
function ttree(g,x,b,s,col){R(g,'#5d4630',x-1,b-6*s,2,6*s);disc(g,col||'#4f8a3e',x,b-9*s,5*s);disc(g,shade(col||'#4f8a3e',1.15),x-1.5*s,b-10.5*s,3*s);}
function tpalm(g,x,b,h){g.strokeStyle='#8a6a3e';g.lineWidth=2.2;g.beginPath();g.moveTo(x,b);g.quadraticCurveTo(x-3,b-h*0.5,x+2,b-h);g.stroke();for(const [dx,dy] of [[-12,5],[12,5],[-9,-4],[9,-4],[0,-7]]){g.strokeStyle='#2f8a3e';g.lineWidth=1.6;g.beginPath();g.moveTo(x+2,b-h);g.quadraticCurveTo(x+2+dx*0.6,b-h-4+dy*0.3,x+2+dx,b-h+dy);g.stroke();}}
function thill(g,c,b,w,h,col){g.fillStyle=col||'#6a9a52';g.beginPath();g.moveTo(c-w/2,b);g.quadraticCurveTo(c-w*0.3,b-h,c,b-h);g.quadraticCurveTo(c+w*0.3,b-h,c+w/2,b);g.closePath();g.fill();}
function tstatue(g,x,b,col){frr(g,'#b8b2a6',x-6,b-14,12,14,1);R(g,'#a39d92',x-7,b-15,14,2);col=col||'#5f7f6a';R(g,col,x-2,b-30,4,15);disc(g,col,x,b-32,2.4);line(g,col,x+1,b-26,x+6,b-33,1.4);}
function tchurchBody(g,x,b,w,h,col,roof){tbx(g,x,b,w,h,col);ttri(g,x-3,b-h+1,w+6,h*0.55,roof);frr(g,'#4a3a2a',x+w*0.42,b-14,w*0.16,14,3);for(let k=0;k<3;k++)frr(g,'#7aa7c7',x+6+k*(w-16)/2,b-h+8,4,10,2);}
function tclock(g,cx,y,r){disc(g,'#ffffff',cx,y,r);line(g,'#333',cx,y,cx,y-r*0.7,0.5);line(g,'#333',cx,y,cx+r*0.5,y,0.5);}

/* ---- nevezetességek: [szélesség, rajz(g, közép, talp, éjjel, fények)] ---- */
const LMD={
 erod:[210,(g,c,b,n,L)=>{const x=c-100;g.fillStyle='#8a6a4a';g.beginPath();g.moveTo(x,b);g.lineTo(x+14,b-34);g.lineTo(x+186,b-34);g.lineTo(x+200,b);g.closePath();g.fill();R(g,'#5f9a4e',x+14,b-38,172,5);
   for(let k=x+20;k<x+180;k+=9)R(g,'rgba(0,0,0,0.12)',k,b-33,1,32);poly(g,'#7a5a3a',[[x-6,b],[x+8,b-30],[x+24,b-30],[x+30,b]]);poly(g,'#7a5a3a',[[x+170,b],[x+176,b-30],[x+192,b-30],[x+206,b]]);
   frr(g,'#d9c9a8',c-18,b-46,36,46,1);g.fillStyle='#3a2a1c';g.beginPath();g.moveTo(c-8,b);g.lineTo(c-8,b-16);g.arc(c,b-16,8,Math.PI,TAU);g.lineTo(c+8,b);g.fill();ttri(g,c-21,b-45,42,10,'#a8432e');tflag(g,c,b-80,['#d32f2f','#ffffff','#2e7d32']);
   text(g,'MONOSTORI ERŐD',c,b-58+3,'#3a2a1c',0.55,'center',null);}],
 komhid:[220,(g,c,b,n,L)=>{const x=c-110;twater(g,x,b,220,16);R(g,'#4a5a6a',x,b-34,220,4);for(let k=0;k<3;k++){const ax=x+8+k*70;g.strokeStyle='#3f5a74';g.lineWidth=2.4;g.beginPath();g.moveTo(ax,b-34);g.quadraticCurveTo(ax+35,b-78,ax+70,b-34);g.stroke();
   g.lineWidth=0.8;for(let j=1;j<7;j++){const tx=ax+j*10,ty=b-34-Math.sin(j/7*Math.PI)*40*0.85;g.beginPath();g.moveTo(tx,b-34);g.lineTo(tx,ty);g.stroke();}frr(g,'#9a8f80',ax-3,b-16,6,18,1);}text(g,'ERZSÉBET HÍD',c,b-26+2,'#ffffff',0.5,'center',null);}],
 viztorony:[80,(g,c,b,n,L)=>{frr(g,lg(g,c-6,0,c+6,0,[[0,'#d6dde4'],[1,'#8f9aa5']]),c-5,b-104,10,104,2);frr(g,n?'#ffd77a':lg(g,0,b-130,0,b-104,[[0,'#bfe0f0'],[1,'#5f88a2']]),c-18,b-130,36,26,6);if(n&&L)L.push({x:c,y:b-118,r:22});
   R(g,'#59616a',c-19,b-131,38,2);R(g,'#59616a',c-19,b-105,38,2);for(let k=-12;k<=12;k+=8)R(g,'rgba(0,0,0,0.25)',c+k,b-129,0.8,24);tspire(g,c,b-131,10,10,'#7a858f');}],
 balaton:[210,(g,c,b,n,L)=>{const x=c-105;twater(g,x,b,210,26);R(g,'#c8a878',x+20,b-28,90,3);for(let k=x+24;k<x+110;k+=14)R(g,'#8a6a4a',k,b-26,2,10);tboat(g,x+130,b-8,'#ffffff','#e53935');tboat(g,x+170,b-14,'#f4f4ef','#3f7fd9');tboat(g,x+60,b-4,'#ffffff','#ffcf33');}],
 festetics:[220,(g,c,b,n,L)=>{const x=c-108;tbx(g,x,b,216,46,'#f4ead0');R(g,'#56606a',x-2,b-54,220,8);twins(g,x+4,b-44,208,40,3,18,n,L,11,null,null);tbx(g,c-24,b,48,62,'#f7efda');
   R(g,'#56606a',c-26,b-70,52,8);tdome(g,c,b-70,14,'#5f8f7a');tcols(g,c-20,b,40,40,5,'#ffffff');poly(g,'#f7efda',[[c-26,b-62],[c,b-74],[c+26,b-62]]);disc(g,'#d9b24a',c,b-66,2.4);}],
 baroktemplom:[110,(g,c,b,n,L)=>{tbx(g,c-34,b,68,58,'#f2e2b8');ttri(g,c-36,b-57,72,20,'#8a3a2a');for(const tx of [c-30,c+16]){tbx(g,tx,b,14,96,'#f6ecc8');tonion(g,tx+7,b-96,7,'#4f7a6a');tclock(g,tx+7,b-80,3);}
   frr(g,'#4a3a2a',c-6,b-18,12,18,5);frr(g,'#7aa7c7',c-4,b-44,8,14,4);}],
 szentmark:[130,(g,c,b,n,L)=>{tbx(g,c-46,b,92,40,'#efe6d2');const rt=b-40;g.save();g.beginPath();g.moveTo(c-50,rt);g.lineTo(c-30,rt-44);g.lineTo(c+30,rt-44);g.lineTo(c+50,rt);g.closePath();g.clip();
   for(let y=0;y<46;y+=5)for(let x=0;x<100;x+=5)R(g,((x+y)/5)%2?'#d32f2f':'#ffffff',c-50+x,rt-44+y,5,5);for(let k=0;k<100;k+=8)R(g,'#2f5aa8',c-50+k,rt-6,4,4);g.restore();
   disc(g,'#ffffff',c-16,rt-22,8);disc(g,'#d32f2f',c+16,rt-22,8);tbx(g,c+30,b,14,72,'#e9e1cf');tspire(g,c+37,b-72,14,18,'#4f7a6a');frr(g,'#4a3a2a',c-8,b-16,16,16,6);}],
 zagkat:[100,(g,c,b,n,L)=>{tbx(g,c-34,b,68,70,'#e9e1cf');for(const tx of [c-30,c+16]){tbx(g,tx,b,14,108,'#efe6d2');tspire(g,tx+7,b-108,14,40,'#c7cbd0');for(let y=b-100;y<b-20;y+=14)frr(g,'#3a4048',tx+5,y,4,9,2);}
   g.fillStyle='#3a4048';g.beginPath();g.arc(c,b-46,10,0,TAU);g.fill();frr(g,'#4a3a2a',c-7,b-22,14,22,7);}],
 ljvar:[210,(g,c,b,n,L)=>{thill(g,c+40,b,170,70,'#5d8a4a');tbx(g,c+20,b-62,46,22,'#e9e1cf');tbx(g,c+46,b-62,14,46,'#e9e1cf');tcren(g,c+46,b-108,14,'#d9cfb8',2);tflag(g,c+53,b-130,['#ffffff','#2f5aa8','#d32f2f']);
   tbx(g,c-96,b,56,58,'#e8a6a0');ttri(g,c-98,b-57,60,24,'#8a3a2a');tbx(g,c-46,b,12,84,'#e8a6a0');tspire(g,c-40,b-84,12,16,'#4f7a6a');frr(g,'#4a3a2a',c-74,b-16,12,16,5);tstatue(g,c-16,b,'#4f7a6a');}],
 harmashid:[210,(g,c,b,n,L)=>{const x=c-105;twater(g,x,b,210,14);for(const [dx,w] of [[0,70],[60,90],[140,70]]){R(g,'#f2ede2',x+dx,b-30,w,6);g.fillStyle='#e9e1cf';g.beginPath();g.moveTo(x+dx,b-24);g.quadraticCurveTo(x+dx+w/2,b-6,x+dx+w,b-24);g.lineTo(x+dx+w,b-20);g.quadraticCurveTo(x+dx+w/2,b-2,x+dx,b-20);g.fill();
   for(let k=4;k<w;k+=5)R(g,'#ffffff',x+dx+k,b-38,2.4,8);R(g,'#ffffff',x+dx,b-39,w,1.4);}ttree(g,x+10,b-30,1.6);ttree(g,x+200,b-30,1.6);}],
 loggia:[170,(g,c,b,n,L)=>{const x=c-80;tbx(g,x,b,160,64,'#f0d8d0');for(let y=b-64;y<b-24;y+=4)R(g,(y/4)%2?'#e8b8b0':'#f6ece8',x,y,160,4);tarcade(g,x,b,160,26,7,'#3a3228');for(let k=0;k<6;k++)frr(g,'#7a5a6a',x+14+k*25,b-56,8,14,3);
   R(g,'#a8432e',x-3,b-68,166,4);tcols(g,x,b,160,4,8,'#ffffff');tstatue(g,c+70,b,'#7a7a6a');}],
 campanile:[180,(g,c,b,n,L)=>{tbx(g,c-86,b,104,48,'#f2d6d0');for(let y=b-48;y<b-20;y+=3)for(let x=c-86;x<c+18;x+=6)R(g,(((x+y)/3)|0)%2?'#e8b8b0':'#f6ece8',x,y,3,3);tarcade(g,c-86,b,104,20,9,'#4a3a32');tcren(g,c-86,b-48,104,'#ffffff',2);
   tbx(g,c+30,b,20,118,'#b5583a');for(let y=b-110;y<b-20;y+=8)R(g,'rgba(0,0,0,0.12)',c+33,y,14,1);tarcade(g,c+30,b-110,20,12,3,'#2a2420');R(g,'#e9e1cf',c+28,b-112,24,3);tspire(g,c+40,b-114,22,30,'#4f8a6a');R(g,'#d9b24a',c+39,b-150,2,6);}],
 rialto:[200,(g,c,b,n,L)=>{const x=c-100;twater(g,x,b,200,18);g.fillStyle='#efe6d2';g.beginPath();g.moveTo(x+10,b-16);g.quadraticCurveTo(c,b-70,x+190,b-16);g.lineTo(x+170,b-16);g.quadraticCurveTo(c,b-40,x+30,b-16);g.closePath();g.fill();
   tbx(g,c-30,b-44,60,18,'#efe6d2');ttri(g,c-32,b-62,64,10,'#c2552f');tarcade(g,c-26,b-44,52,14,4,'#3a3228');poly(g,'#1b1f26',[[x+120,b-8],[x+170,b-8],[x+176,b-14],[x+116,b-10]]);line(g,'#1b1f26',x+170,b-12,x+180,b-24,1);}],
 kettorony:[90,(g,c,b,n,L)=>{tbx(g,c-24,b,16,150,'#b5683a');for(let y=b-146;y<b;y+=10)R(g,'rgba(0,0,0,0.12)',c-24,y,16,1);tcren(g,c-25,b-150,18,'#9a5a32',2);for(let y=b-140;y<b-20;y+=24)frr(g,'#3a2a20',c-18,y,4,6,2);
   g.save();g.translate(c+12,b);g.rotate(0.06);tbx(g,-8,0,18,92,'#a8603a');for(let y=-88;y<0;y+=10)R(g,'rgba(0,0,0,0.12)',-8,y,18,1);g.restore();}],
 duomo:[210,(g,c,b,n,L)=>{tbx(g,c-90,b,130,52,'#f2ede2');for(let k=0;k<130;k+=12)R(g,'#4f7a5a',c-90+k,b-52,2,52);R(g,'#4f7a5a',c-90,b-30,130,2);R(g,'#c27a6a',c-90,b-54,130,3);
   tbx(g,c-46,b-52,44,16,'#f2ede2');for(let k=0;k<44;k+=8)R(g,'#4f7a5a',c-46+k,b-68,1.4,16);g.fillStyle='#c2552f';g.beginPath();g.moveTo(c-46,b-68);g.quadraticCurveTo(c-44,b-110,c-24,b-114);g.quadraticCurveTo(c-4,b-110,c-2,b-68);g.closePath();g.fill();
   g.strokeStyle='#ffffff';g.lineWidth=1;for(const k of [-16,-6,6,16]){g.beginPath();g.moveTo(c-24+k,b-68);g.quadraticCurveTo(c-24+k*0.6,b-104,c-24,b-114);g.stroke();}R(g,'#f2ede2',c-28,b-124,8,10);
   tbx(g,c+56,b,22,132,'#f2ede2');for(let y=b-132;y<b;y+=22){R(g,'#c27a6a',c+56,y,22,2);R(g,'#4f7a5a',c+56,y+10,22,1.4);}tarcade(g,c+56,b-110,22,16,2,'#3a3228');}],
 colosseum:[220,(g,c,b,n,L)=>{const x=c-110;g.fillStyle='#d9c39a';g.beginPath();g.moveTo(x,b);g.lineTo(x,b-92);g.quadraticCurveTo(x+110,b-100,x+180,b-84);g.lineTo(x+186,b-60);g.lineTo(x+196,b-58);g.lineTo(x+206,b-30);g.lineTo(x+220,b);g.closePath();g.fill();
   for(let r=0;r<3;r++)tarcade(g,x+4,b-r*28,(r?170:200)-r*8,22,(r?12:14),'#6a5a42');R(g,'#c9b08a',x,b-90,170,3);R(g,'#c9b08a',x,b-58,186,2);R(g,'#c9b08a',x,b-30,206,2);for(let k=0;k<20;k++)R(g,'rgba(0,0,0,0.12)',x+k*9,b-90,1,8);}],
 szentpeter:[210,(g,c,b,n,L)=>{tbx(g,c-80,b,160,58,'#efe6d2');tcols(g,c-60,b,120,46,9,'#ffffff');R(g,'#e2d6bc',c-82,b-62,164,6);poly(g,'#e9dfc8',[[c-30,b-62],[c,b-76],[c+30,b-62]]);for(let k=0;k<12;k++)tstatue(g,c-74+k*13.5,b-62,'#efe6d2');
   tbx(g,c-24,b-62,48,26,'#efe6d2');tdome(g,c,b-88,30,'#7aa0b5','#e9e1cf');R(g,'#efe6d2',c-4,b-136,8,12);tspire(g,c,b-136,6,8,'#d9b24a');}],
 forte:[200,(g,c,b,n,L)=>{const x=c-100;twater(g,x,b,200,12);tbx(g,x+30,b-12,140,44,'#c9b89a');tcren(g,x+30,b-56,140,'#b8a68a',3);for(const tx of [x+20,x+160]){g.fillStyle='#bfae90';g.beginPath();g.ellipse(tx+10,b-38,14,30,0,0,TAU);g.fill();tcren(g,tx-4,b-68,28,'#a8987a',3);}
   tbx(g,c-8,b-56,16,36,'#c9b89a');tflag(g,c,b-112,['#2e7d32','#ffffff','#d32f2f']);}],
 terrazza:[200,(g,c,b,n,L)=>{const x=c-100;twater(g,x,b-22,200,24);for(let y=b-22;y<b;y+=4)for(let k=0;k<200;k+=8)R(g,(((k+y)/4)|0)%2?'#2a2a2a':'#f4f4ef',x+k,y,8,4);for(let k=0;k<200;k+=6){R(g,'#f4f4ef',x+k,b-30,2,8);}R(g,'#f4f4ef',x,b-31,200,2);
   g.fillStyle='#f4f4ef';g.beginPath();g.arc(c+50,b-52,16,Math.PI,TAU);g.fill();tcols(g,c+36,b-22,28,30,4,'#f4f4ef');tpalm(g,x+20,b-22,44);}],
 kikoto:[210,(g,c,b,n,L)=>{const x=c-105;twater(g,x,b,210,14);poly(g,'#2f5aa8',[[x+70,b-14],[x+200,b-14],[x+194,b+2],[x+76,b+2]]);for(let k=0;k<6;k++)frr(g,['#e53935','#ffcf33','#3f7fd9','#43a047','#fb8c00','#7a5a9a'][k],x+80+k*18,b-30,16,16,1);
   for(const cx2 of [x+20,x+50]){R(g,'#e8661c',cx2,b-90,4,76);line(g,'#e8661c',cx2,b-88,cx2+46,b-88,3);line(g,'#e8661c',cx2+2,b-90,cx2+14,b-100,1.4);line(g,'#59616a',cx2+40,b-88,cx2+40,b-50,0.8);}}],
 lanterna:[70,(g,c,b,n,L)=>{thill(g,c,b,70,14,'#8a7a62');tbx(g,c-10,b-12,20,60,'#efe6d2');tcren(g,c-12,b-72,24,'#d9cfb8',2);tbx(g,c-8,b-74,16,50,'#efe6d2');tcren(g,c-10,b-124,20,'#d9cfb8',2);frr(g,'#ffe9a8',c-5,b-136,10,10,2);R(g,'#3a3f47',c-6,b-138,12,2);
   if(L)L.push({x:c,y:b-131,r:40});glow(g,c,b-131,n?26:10,'rgba(255,230,140,0.5)');}],
 negresco:[180,(g,c,b,n,L)=>{tbx(g,c-60,b,120,74,'#f6f2ec');twins(g,c-56,b-70,112,56,5,10,n,L,21,null,null);g.fillStyle='#e88aa8';g.beginPath();g.moveTo(c-22,b-74);g.quadraticCurveTo(c-22,b-104,c,b-108);g.quadraticCurveTo(c+22,b-104,c+22,b-74);g.closePath();g.fill();
   R(g,'#2e7d4f',c-22,b-76,44,3);tflag(g,c,b-128,['#2f5aa8','#ffffff','#d32f2f']);for(const tx of [c-80,c+74])tpalm(g,tx,b,60);text(g,'NEGRESCO',c,b-18,'#c2552f',0.6,'center',null);}],
 sagrada:[190,(g,c,b,n,L)=>{tbx(g,c-80,b,160,60,'#c9b08a');for(let k=0;k<8;k++){const tx=c-74+k*20,h=k%7===0?96:k===3||k===4?150:120;g.fillStyle='#bfa57e';g.beginPath();g.moveTo(tx-6,b-60);g.quadraticCurveTo(tx-6,b-h*0.8,tx,b-h);g.quadraticCurveTo(tx+6,b-h*0.8,tx+6,b-60);g.closePath();g.fill();
   for(let y=b-h+16;y<b-64;y+=7)R(g,'rgba(60,40,20,0.35)',tx-2,y,4,2);disc(g,['#e53935','#ffcf33','#43a047'][k%3],tx,b-h-2,2.4);}tarcade(g,c-60,b,120,40,3,'#5a4a32');for(let k=0;k<3;k++){R(g,'#e8661c',c+90-k*6,b-140+k*10,2,140-k*10);}}],
 seuvella:[190,(g,c,b,n,L)=>{thill(g,c,b,190,40,'#9a8a5a');tbx(g,c-50,b-36,100,44,'#d9c39a');ttri(g,c-52,b-80,104,16,'#b5683a');tbx(g,c+36,b-36,20,96,'#d9c39a');for(let k=0;k<3;k++)tarcade(g,c+36,b-60-k*24,20,14,2,'#5a4a32');tcren(g,c+35,b-132,22,'#c9b08a',2);}],
 pilar:[220,(g,c,b,n,L)=>{tbx(g,c-90,b,180,58,'#d9b88a');twins(g,c-86,b-54,172,44,2,12,n,L,31,'#6a5a42',null);for(const tx of [c-104,c+86]){tbx(g,tx,b,18,124,'#d9b88a');tspire(g,tx+9,b-124,16,24,'#c9a878');}
   tdome(g,c,b-58,26,'#2f7a5a','#ffcf33');for(const dx of [-58,58])tdome(g,c+dx,b-58,14,'#3f7fd9','#ffffff');for(const dx of [-32,32])tdome(g,c+dx,b-58,10,'#ffcf33','#2f7a5a');twater(g,c-110,b,220,6);}],
 alcala:[170,(g,c,b,n,L)=>{tbx(g,c-74,b,148,74,'#ece2cc');for(let k=0;k<5;k++){const ax=c-66+k*28,big=k>0&&k<4;g.fillStyle='#4a5a6a';g.beginPath();if(big){g.moveTo(ax+4,b);g.lineTo(ax+4,b-36);g.arc(ax+14,b-36,10,Math.PI,TAU);g.lineTo(ax+24,b);}else{g.rect(ax+6,b-34,16,34);}g.fill();}
   tcols(g,c-70,b-4,140,58,10,'#f6f0e2');R(g,'#d9cfb8',c-76,b-80,152,6);poly(g,'#ece2cc',[[c-30,b-80],[c,b-100],[c+30,b-80]]);for(const dx of [-50,50])tstatue(g,c+dx,b-80,'#d9cfb8');}],
 palota:[220,(g,c,b,n,L)=>{tbx(g,c-108,b,216,64,'#f2ede2');twins(g,c-104,b-58,208,50,3,20,n,L,41,null,null);R(g,'#d9cfb8',c-110,b-68,220,5);for(let k=0;k<22;k++)R(g,'#d9cfb8',c-108+k*10,b-74,4,6);tdome(g,c,b-68,14,'#56606a');tflag(g,c+4,b-104,['#c62a35','#ffcf33','#c62a35']);}],
 prado:[150,(g,c,b,n,L)=>{tbx(g,c-60,b,120,54,'#b5683a');for(let y=b-30;y<b-6;y+=6)for(let k=0;k<120;k+=6)R(g,((k+y)/6)%2?'#2f5aa8':'#f6f4ee',c-60+k,y,6,6);tarcade(g,c-56,b-30,112,20,5,'#4a3a2a');ttri(g,c-62,b-53,124,16,'#c2552f');
   tbx(g,c+44,b,18,96,'#b5683a');tdome(g,c+53,b-96,9,'#2f5aa8','#ffcf33');}],
 merida:[210,(g,c,b,n,L)=>{const x=c-105;R(g,'#c9b08a',x,b-14,210,14);for(let k=0;k<210;k+=6)R(g,'rgba(0,0,0,0.1)',x+k,b-14,1,14);tcols(g,x+20,b-14,170,46,16,'#e9dfc8');R(g,'#d9cfb8',x+16,b-62,178,4);tcols(g,x+30,b-66,150,36,13,'#e9dfc8');R(g,'#d9cfb8',x+26,b-104,158,4);
   for(let k=0;k<6;k++)tstatue(g,x+44+k*24,b-14,'#e9dfc8');}],
 alcazaba:[190,(g,c,b,n,L)=>{thill(g,c,b,190,30,'#a89a6a');tbx(g,c-90,b-26,140,30,'#c9a878');tcren(g,c-90,b-56,140,'#b8986a',3);for(let k=0;k<4;k++)tbx(g,c-88+k*42,b-26,10,40,'#c9a878');g.fillStyle='#c9a878';g.beginPath();g.moveTo(c+50,b-26);g.lineTo(c+52,b-110);g.lineTo(c+78,b-110);g.lineTo(c+80,b-26);g.fill();tcren(g,c+50,b-110,30,'#b8986a',3);for(let y=b-100;y<b-40;y+=18)frr(g,'#4a3a2a',c+62,y,5,9,2);}],
 belem:[120,(g,c,b,n,L)=>{twater(g,c-60,b,120,14);tbx(g,c-34,b-12,68,30,'#f2ede2');tcren(g,c-34,b-42,68,'#e2d6bc',3);tbx(g,c-20,b-42,40,70,'#f2ede2');tarcade(g,c-18,b-80,36,16,3,'#4a4a4a');tcren(g,c-20,b-112,40,'#e2d6bc',3);
   for(const tx of [c-36,c+30]){disc(g,'#f2ede2',tx+3,b-44,5);tdome(g,tx+3,b-48,5,'#e2d6bc');}tdome(g,c,b-116,7,'#e2d6bc');}],
 villamos:[130,(g,c,b,n,L)=>{line(g,'#3a3f47',c-70,b-60,c+70,b-60,0.6);frr(g,'#f2c418',c-40,b-44,80,36,4);R(g,'#ffffff',c-40,b-22,80,4);twins(g,c-36,b-42,72,16,1,6,n,L,51,null,null);R(g,'#2a2f36',c-40,b-8,80,4);for(const wx of [c-26,c+26])disc(g,'#2a2f36',wx,b-4,4);line(g,'#3a3f47',c,b-44,c+10,b-60,1);text(g,'28',c-32,b-41,'#2a2f36',0.6,'left',null);}],
 coimbra:[130,(g,c,b,n,L)=>{thill(g,c,b,130,30,'#8a9a5a');tbx(g,c-46,b-26,92,36,'#f2ede2');ttri(g,c-48,b-61,96,10,'#c2552f');tbx(g,c-8,b-26,16,96,'#f2ede2');tclock(g,c,b-100,4);tdome(g,c,b-122,8,'#e2d6bc');}],
 salamanca:[190,(g,c,b,n,L)=>{tbx(g,c-80,b,140,62,'#e2b878');for(let k=0;k<140;k+=14)R(g,'#c9a060',c-80+k,b-62,2,62);ttri(g,c-82,b-61,144,16,'#b5683a');tdome(g,c-20,b-78,20,'#c9a060','#e2b878');tbx(g,c+48,b,22,128,'#e2b878');tarcade(g,c+48,b-106,22,16,2,'#4a3a2a');tdome(g,c+59,b-128,10,'#c9a060');tspire(g,c+59,b-138,6,10,'#c9a060');}],
 burgos:[180,(g,c,b,n,L)=>{tbx(g,c-70,b,140,70,'#efe6d2');g.fillStyle='#4a5a6a';g.beginPath();g.arc(c,b-48,12,0,TAU);g.fill();for(const tx of [c-66,c+46]){tbx(g,tx,b,20,104,'#efe6d2');g.fillStyle='#e2d6bc';g.beginPath();g.moveTo(tx,b-104);g.lineTo(tx+10,b-150);g.lineTo(tx+20,b-104);g.fill();
   for(let y=b-140;y<b-108;y+=6)R(g,'#6a6a6a',tx+8,y,4,3);}tarcade(g,c-40,b,80,30,3,'#4a3a2a');}],
 concha:[220,(g,c,b,n,L)=>{const x=c-110;twater(g,x,b-10,220,30);R(g,'#e8d3a2',x,b-10,220,10);for(let k=0;k<220;k+=5)R(g,'#f4f4ef',x+k,b-22,1.4,12);R(g,'#f4f4ef',x,b-23,220,2);thill(g,x+40,b-40,60,40,'#4f7a4a');thill(g,x+170,b-40,80,22,'#5d8a4a');tbx(g,x+164,b-60,10,16,'#efe6d2');}],
 bourse:[220,(g,c,b,n,L)=>{const x=c-108;tbx(g,x,b-8,216,60,'#ece2cc');twins(g,x+4,b-62,208,52,2,18,n,L,61,null,null);R(g,'#56606a',x-2,b-80,220,12);for(let k=0;k<12;k++)frr(g,'#56606a',x+6+k*18,b-88,6,8,1);
   R(g,'rgba(140,180,220,0.6)',x,b-8,216,8);R(g,'rgba(236,226,204,0.35)',x,b-4,216,3);}],
 poitiers:[130,(g,c,b,n,L)=>{tbx(g,c-46,b,92,74,'#e2d6bc');for(let r=0;r<2;r++)tarcade(g,c-40,b-r*30,80,24,r?5:3,'#5a4a32');ttri(g,c-48,b-73,96,22,'#b8a888');for(const tx of [c-58,c+44]){tbx(g,tx,b,14,90,'#e2d6bc');for(let y=b-90;y<b-60;y+=4)R(g,'#cfc2a4',tx,y,14,2);tspire(g,tx+7,b-90,14,22,'#9a8a6a');}}],
 loirekastely:[210,(g,c,b,n,L)=>{const x=c-100;twater(g,x-5,b,210,12);tbx(g,x+20,b-12,160,50,'#f2ede2');twins(g,x+24,b-58,152,40,2,10,n,L,71,null,null);poly(g,'#56606a',[[x+18,b-62],[x+30,b-84],[x+170,b-84],[x+182,b-62]]);
   for(const tx of [x+8,x+80,x+176]){disc(g,'#f2ede2',tx+8,b-56,12);R(g,'#f2ede2',tx-4,b-56,24,44);poly(g,'#56606a',[[tx-6,b-56],[tx+8,b-100],[tx+22,b-56]]);}for(let k=0;k<5;k++)frr(g,'#56606a',x+40+k*28,b-96,8,12,1);}],
 eiffel:[130,(g,c,b,n,L)=>{const col='#7a5a3a';g.fillStyle=col;g.beginPath();g.moveTo(c-50,b);g.quadraticCurveTo(c-22,b-50,c-8,b-110);g.lineTo(c-3,b-148);g.lineTo(c+3,b-148);g.lineTo(c+8,b-110);g.quadraticCurveTo(c+22,b-50,c+50,b);g.lineTo(c+34,b);g.quadraticCurveTo(c,b-46,c-34,b);g.closePath();g.fill();
   R(g,col,c-30,b-46,60,4);R(g,col,c-14,b-90,28,3);g.strokeStyle='rgba(255,220,160,0.35)';g.lineWidth=0.5;for(let y=b-140;y<b-4;y+=6){const w=y>b-46?(b-y)*0.95+14:(b-y)<90?16-(b-y-46)*0.18+6:6;g.beginPath();g.moveTo(c-w,y);g.lineTo(c+w,y+6);g.stroke();}
   R(g,col,c-0.6,b-158,1.2,10);if(n){for(let k=0;k<14;k++)disc(g,'#ffd77a',c+(hsh(k)-0.5)*40*(1-(k/14)),b-10-k*9,0.9);if(L)L.push({x:c,y:b-70,r:40});}}],
 diadal:[150,(g,c,b,n,L)=>{tbx(g,c-56,b,112,96,'#ece2cc');g.fillStyle='#3a4048';g.beginPath();g.moveTo(c-18,b);g.lineTo(c-18,b-46);g.arc(c,b-46,18,Math.PI,TAU);g.lineTo(c+18,b);g.fill();R(g,'#d9cfb8',c-58,b-100,116,8);R(g,'#d9cfb8',c-56,b-70,112,3);
   for(const dx of [-46,26])frr(g,'#cfc2a4',c+dx,b-60,20,30,1);tflag(g,c,b-76,['#2f5aa8','#ffffff','#d32f2f']);}],
 atomium:[130,(g,c,b,n,L)=>{const P=[[0,-40],[-24,-64],[24,-64],[-24,-100],[24,-100],[0,-82],[0,-124],[-34,-82],[34,-82]];g.strokeStyle='#b7c0c9';g.lineWidth=3;for(const p of P.slice(1)){g.beginPath();g.moveTo(c,b-82);g.lineTo(c+p[0],b+p[1]);g.stroke();}
   line(g,'#9aa3ad',c,b,c,b-40,4);line(g,'#9aa3ad',c-20,b,c-24,b-64,2);line(g,'#9aa3ad',c+20,b,c+24,b-64,2);for(const p of P){disc(g,lg(g,c+p[0]-8,b+p[1]-8,c+p[0]+8,b+p[1]+8,[[0,'#f4f7f9'],[1,'#7d868f']]),c+p[0],b+p[1],9);if(n&&L)L.push({x:c+p[0],y:b+p[1],r:10});}}],
 grandplace:[130,(g,c,b,n,L)=>{tbx(g,c-56,b,112,60,'#d9c9a8');tarcade(g,c-52,b,104,20,8,'#4a3a2a');twins(g,c-52,b-56,104,32,2,10,n,L,81,'#4a5a6a',null);poly(g,'#4a525b',[[c-58,b-60],[c-50,b-80],[c+50,b-80],[c+58,b-60]]);
   tbx(g,c-8,b-60,16,50,'#d9c9a8');tbx(g,c-5,b-110,10,20,'#d9c9a8');tspire(g,c,b-130,8,22,'#4a525b');tstatue(g,c,b-150,'#d9b24a');}],
 antwerpen:[100,(g,c,b,n,L)=>{tbx(g,c-40,b,80,66,'#e2d6bc');ttri(g,c-42,b-65,84,18,'#56606a');tbx(g,c-10,b,20,120,'#e2d6bc');for(let y=b-116;y<b-20;y+=12)frr(g,'#4a4a4a',c-4,y,8,8,3);tdome(g,c,b-120,9,'#e2d6bc');tspire(g,c,b-130,10,24,'#d9cfb8');tclock(g,c,b-70,4);}],
 grachten:[220,(g,c,b,n,L)=>{const x=c-110;twater(g,x,b,220,12);const C=['#8a4a32','#3a4048','#a8643e','#6f3a28','#f2ede2','#5a3a2a'];for(let k=0;k<6;k++){const hx=x+6+k*35,h=72+(k%3)*10;tbx(g,hx,b-12,32,h,C[k]);twins(g,hx+2,b-12-h+16,28,h-22,4,2,n,L,91+k,null,null);
   g.fillStyle=C[k];g.beginPath();g.moveTo(hx,b-12-h);if(k%2){g.lineTo(hx+16,b-12-h-14);g.lineTo(hx+32,b-12-h);}else{g.lineTo(hx+6,b-12-h);g.lineTo(hx+6,b-h-18);g.lineTo(hx+12,b-h-18);g.lineTo(hx+12,b-h-24);g.lineTo(hx+20,b-h-24);g.lineTo(hx+20,b-h-18);g.lineTo(hx+26,b-h-18);g.lineTo(hx+26,b-12-h);g.lineTo(hx+32,b-12-h);}g.closePath();g.fill();R(g,'#ffffff',hx,b-12-h,32,1.4);}
   for(let k=0;k<3;k++){const bx2=x+40+k*60;disc(g,'#1b1f26',bx2,b-14,3);disc(g,'#1b1f26',bx2+11,b-14,3);line(g,'#1b1f26',bx2,b-14,bx2+6,b-20,0.8);line(g,'#1b1f26',bx2+6,b-20,bx2+11,b-14,0.8);}}],
 osnabruck:[150,(g,c,b,n,L)=>{tbx(g,c-56,b,112,52,'#c9b8a0');twins(g,c-52,b-48,104,30,2,8,n,L,101,'#4a5a6a',null);poly(g,'#4f7a6a',[[c-58,b-52],[c,b-104],[c+58,b-52]]);for(const dx of [-44,-16,16,44])tspire(g,c+dx,b-52,6,20,'#4f7a6a');tflag(g,c,b-124,['#1b1b1b','#d32f2f','#ffcf33']);}],
 brema:[120,(g,c,b,n,L)=>{frr(g,'#b8b2a6',c-46,b-16,18,16,1);R(g,'#8a8478',c-42,b-62,10,46);disc(g,'#8a8478',c-37,b-66,4);R(g,'#8a8478',c-32,b-58,2,30);frr(g,'#6a6458',c-46,b-50,8,16,2);
   frr(g,'#9a948a',c+4,b-10,40,10,1);ell(g,'#7a5a3a',c+24,b-22,14,8);R(g,'#7a5a3a',c+12,b-14,3,6);R(g,'#7a5a3a',c+32,b-14,3,6);disc(g,'#7a5a3a',c+38,b-30,4);ell(g,'#c9b08a',c+22,b-34,9,5);ell(g,'#4a4a4a',c+22,b-44,6,4);disc(g,'#4a4a4a',c+27,b-48,2.5);ell(g,'#d32f2f',c+22,b-53,5,3.5);disc(g,'#d32f2f',c+26,b-58,2);}],
 elbphil:[210,(g,c,b,n,L)=>{const x=c-100;twater(g,x,b,210,10);tbx(g,x+20,b-10,150,54,'#9a5a3a');for(let y=b-60;y<b-14;y+=4)R(g,'rgba(0,0,0,0.12)',x+20,y,150,1);g.fillStyle=lg(g,0,b-120,0,b-64,[[0,'#cfe6f3'],[1,'#7ea8c2']]);g.beginPath();g.moveTo(x+20,b-64);g.lineTo(x+20,b-96);
   g.quadraticCurveTo(x+50,b-122,x+80,b-104);g.quadraticCurveTo(x+110,b-128,x+140,b-108);g.quadraticCurveTo(x+160,b-118,x+170,b-104);g.lineTo(x+170,b-64);g.closePath();g.fill();for(let k=x+24;k<x+168;k+=6)for(let y=b-100;y<b-66;y+=6)R(g,n&&hsh(k*3+y)>0.5?'#ffd77a':'rgba(255,255,255,0.4)',k,y,3,2);
   R(g,'#e8661c',x+186,b-110,3,100);line(g,'#e8661c',x+176,b-108,x+210,b-108,2);}],
 vitorlas:[210,(g,c,b,n,L)=>{const x=c-105;twater(g,x,b,210,14);for(const [dx,s] of [[20,1],[110,1.3]]){const bx2=x+dx;poly(g,'#3a2a1c',[[bx2,b-16],[bx2+70*s,b-16],[bx2+64*s,b-4],[bx2+8,b-4]]);for(const mx of [0.3,0.65]){line(g,'#5a3d22',bx2+70*s*mx,b-16,bx2+70*s*mx,b-16-70*s,1.4);
   for(let k=0;k<3;k++)frr(g,'#f4f0e2',bx2+70*s*mx-12*s,b-26-70*s+k*20*s,24*s,16*s,1);}line(g,'#5a3d22',bx2+70*s,b-16,bx2+90*s,b-36*s,1);}}],
 koldinghus:[180,(g,c,b,n,L)=>{thill(g,c,b,180,18,'#6a9a52');tbx(g,c-70,b-14,140,62,'#a8483a');for(let y=b-74;y<b-16;y+=4)R(g,'rgba(0,0,0,0.1)',c-70,y,140,1);twins(g,c-66,b-70,132,50,3,10,n,L,111,null,null);tcren(g,c-70,b-76,140,'#8a3a2a',3);
   tbx(g,c+40,b-14,24,90,'#a8483a');tcren(g,c+40,b-104,24,'#8a3a2a',3);tflag(g,c+52,b-130,['#c62a35','#ffffff','#c62a35']);}],
 andersen:[120,(g,c,b,n,L)=>{tbx(g,c-46,b,92,30,'#f2c14e');for(let k=0;k<92;k+=10)R(g,'#5a3d22',c-46+k,b-30,1.6,30);R(g,'#5a3d22',c-46,b-16,92,1.6);ttri(g,c-50,b-29,100,26,'#b5452b');twins(g,c-42,b-26,84,14,1,5,n,L,121,null,null);frr(g,'#3f7d3a',c-4,b-14,8,14,2);tstatue(g,c+56,b,'#5f7f6a');}],
 nyhavn:[220,(g,c,b,n,L)=>{const x=c-110;twater(g,x,b,220,14);const C=['#f2c14e','#d9503a','#4f86c6','#f08a3c','#e8e2d0','#7fb58a','#c2552f'];for(let k=0;k<7;k++){const hx=x+2+k*31,h=56+(k*13)%24;tbx(g,hx,b-14,30,h,C[k]);twins(g,hx+2,b-14-h+6,26,h-10,3,3,n,L,131+k,null,null);ttri(g,hx-1,b-13-h,32,14,k%2?'#a8432e':'#3a3f47');}
   tboat(g,x+20,b-2,'#ffffff','#e53935');tboat(g,x+120,b-4,'#3a2a1c',null);line(g,'#5a3d22',x+133,b-10,x+133,b-60,1.4);}],
 kisbeleany:[90,(g,c,b,n,L)=>{twater(g,c-45,b,90,10);g.fillStyle='#6a6458';g.beginPath();g.moveTo(c-24,b-6);g.quadraticCurveTo(c-20,b-30,c,b-30);g.quadraticCurveTo(c+22,b-30,c+26,b-6);g.fill();ell(g,'#4f7a6a',c,b-36,9,5);R(g,'#4f7a6a',c-3,b-52,6,16);disc(g,'#4f7a6a',c,b-56,4);line(g,'#4f7a6a',c+2,b-34,c+16,b-32,3);}],
 brandenburg:[180,(g,c,b,n,L)=>{tbx(g,c-70,b,140,14,'#e2d6bc');tcols(g,c-64,b-12,128,62,6,'#ece2cc');R(g,'#d9cfb8',c-72,b-84,144,12);R(g,'#d9cfb8',c-30,b-94,60,10);g.fillStyle='#4f7a6a';g.fillRect(c-14,b-110,28,16);for(let k=0;k<4;k++)ell(g,'#4f7a6a',c-12+k*8,b-102,3,5);disc(g,'#4f7a6a',c,b-114,3);
   R(g,'#e2d6bc',c-72,b-4,6,4);R(g,'#e2d6bc',c+66,b-4,6,4);}],
 tvtorony:[70,(g,c,b,n,L)=>{frr(g,lg(g,c-5,0,c+5,0,[[0,'#e8edf1'],[1,'#9aa3ad']]),c-4,b-104,8,104,2);disc(g,lg(g,c-12,b-120,c+12,b-100,[[0,'#d6dde4'],[1,'#7d868f']]),c,b-112,12);R(g,'rgba(0,0,0,0.3)',c-12,b-113,24,1.6);
   R(g,'#c62a35',c-1.5,b-150,3,26);for(let y=b-148;y<b-126;y+=6)R(g,'#ffffff',c-1.5,y,3,3);if(n){disc(g,'#ff3b30',c,b-150,1.4);if(L)L.push({x:c,y:b-112,r:16});}}],
 tegla:[150,(g,c,b,n,L)=>{tbx(g,c-60,b,120,62,'#a8483a');for(let y=b-60;y<b;y+=4)R(g,'rgba(0,0,0,0.1)',c-60,y,120,1);for(let k=0;k<5;k++)frr(g,'#3a4048',c-52+k*23,b-54,8,30,4);poly(g,'#3a3f47',[[c-62,b-62],[c,b-98],[c+62,b-62]]);
   for(let k=0;k<6;k++)poly(g,'#a8483a',[[c-56+k*20,b-62],[c-50+k*20,b-74],[c-44+k*20,b-62]]);}],
 poznan:[210,(g,c,b,n,L)=>{const C=['#e8b74a','#d7a3a0','#9fc0d8','#b8cfb2','#f0c890','#e9a07a'];for(let k=0;k<6;k++){const hx=c-104+(k<3?k:k+2)*23;tbx(g,hx,b,22,56,C[k]);twins(g,hx+1,b-52,20,40,3,2,n,L,141+k,null,null);poly(g,C[k],[[hx,b-56],[hx+11,b-70],[hx+22,b-56]]);}
   tbx(g,c-34,b,68,62,'#f6f0e2');tarcade(g,c-34,b-38,68,22,5,'#5a4a32');tarcade(g,c-34,b-14,68,12,5,'#7a6a52');tbx(g,c-6,b-62,12,46,'#f6f0e2');tdome(g,c,b-110,6,'#4f7a6a');tspire(g,c,b-118,6,22,'#4f7a6a');}],
 manufaktura:[210,(g,c,b,n,L)=>{tbx(g,c-100,b,170,58,'#a8483a');for(let y=b-58;y<b;y+=4)R(g,'rgba(0,0,0,0.1)',c-100,y,170,1);for(let r=0;r<3;r++)for(let k=0;k<12;k++)frr(g,n&&hsh(r*12+k)>0.5?'#ffd77a':'#4a5a6a',c-94+k*14,b-52+r*17,7,11,3);tcren(g,c-100,b-58,170,'#8a3a2a',3);
   frr(g,'#9a4032',c+76,b-140,14,140,2);for(let y=b-136;y<b-10;y+=10)R(g,'rgba(0,0,0,0.12)',c+76,y,14,1);}],
 kulturpalota:[130,(g,c,b,n,L)=>{const col='#d9cfb8';tbx(g,c-56,b,112,40,col);tbx(g,c-36,b-40,72,40,col);tbx(g,c-22,b-80,44,30,col);tbx(g,c-14,b-110,28,18,col);R(g,col,c-1,b-150,2,22);twins(g,c-52,b-38,104,34,3,10,n,L,151,null,null);twins(g,c-32,b-78,64,36,3,6,n,L,152,null,null);tclock(g,c,b-102,4);
   for(const dx of [-56,-36,-22,22,36,52])R(g,col,c+dx,b-[40,80,110,110,80,40][[-56,-36,-22,22,36,52].indexOf(dx)]-6,4,6);}],
 neogot:[110,(g,c,b,n,L)=>{tbx(g,c-40,b,80,56,'#a8483a');for(let k=0;k<3;k++)frr(g,'#3a4048',c-30+k*26,b-48,8,26,4);ttri(g,c-42,b-55,84,18,'#3a3f47');for(const tx of [c-36,c+22]){tbx(g,tx,b,14,96,'#a8483a');tspire(g,tx+7,b-96,14,40,'#4f7a6a');}}],
 puspokipalota:[180,(g,c,b,n,L)=>{tbx(g,c-60,b,120,54,'#f2ede2');twins(g,c-56,b-50,112,44,2,9,n,L,161,null,null);poly(g,'#4a525b',[[c-62,b-54],[c-50,b-70],[c+50,b-70],[c+62,b-54]]);
   for(const tx of [c-80,c+60]){tbx(g,tx,b,20,74,'#f2ede2');poly(g,'#4a525b',[[tx-2,b-74],[tx+10,b-94],[tx+22,b-74]]);tspire(g,tx+10,b-94,4,10,'#4a525b');}}],
 mariacki:[120,(g,c,b,n,L)=>{tbx(g,c-34,b,68,62,'#a8483a');for(let y=b-60;y<b;y+=4)R(g,'rgba(0,0,0,0.1)',c-34,y,68,1);frr(g,'#3a4048',c-6,b-54,12,34,6);tbx(g,c-48,b,18,138,'#a8483a');tspire(g,c-39,b-138,18,8,'#4f7a6a');for(const dx of [-8,8])tspire(g,c-39+dx,b-134,5,10,'#4f7a6a');
   tonion(g,c-39,b-146,4,'#4f7a6a');tbx(g,c+30,b,18,110,'#a8483a');tdome(g,c+39,b-110,9,'#4f7a6a');}],
 wawel:[210,(g,c,b,n,L)=>{thill(g,c,b,210,36,'#6a9a52');tbx(g,c-90,b-30,180,24,'#c9b8a0');tcren(g,c-90,b-54,180,'#b8a68a',3);tbx(g,c-60,b-54,70,30,'#efe6d2');tdome(g,c-40,b-84,10,'#d9b24a');tdome(g,c-14,b-84,9,'#4f7a6a');tbx(g,c+20,b-54,50,30,'#efe6d2');poly(g,'#a8432e',[[c+18,b-84],[c+45,b-100],[c+72,b-84]]);
   tbx(g,c-74,b-54,12,50,'#d9cfb8');tspire(g,c-68,b-104,14,20,'#4f7a6a');}],
 spodek:[170,(g,c,b,n,L)=>{for(const dx of [-50,-20,20,50])line(g,'#7d868f',c+dx,b,c+dx*0.7,b-30,2.4);g.fillStyle=lg(g,0,b-56,0,b-30,[[0,'#e8edf1'],[1,'#8f9aa5']]);g.beginPath();g.moveTo(c-80,b-34);g.lineTo(c-40,b-56);g.lineTo(c+40,b-56);g.lineTo(c+80,b-34);g.lineTo(c+70,b-28);g.lineTo(c-70,b-28);g.closePath();g.fill();
   for(let k=-70;k<70;k+=10)line(g,'rgba(0,0,0,0.2)',c+k,b-30,c+k*0.55,b-55,0.6);if(n)for(let k=-60;k<=60;k+=12)disc(g,'#7fd1ff',c+k,b-30,1.2);}],
 koho:[180,(g,c,b,n,L)=>{for(const [dx,h,w] of [[-70,100,26],[-30,120,30],[20,90,24]]){g.fillStyle='#5a4a42';g.beginPath();g.moveTo(c+dx,b);g.lineTo(c+dx+3,b-h);g.lineTo(c+dx+w-3,b-h);g.lineTo(c+dx+w,b);g.fill();for(let y=b-h+6;y<b;y+=12)R(g,'#7a5a4a',c+dx,y,w,2);R(g,'#3a3a3a',c+dx+w/2-3,b-h-24,6,24);}
   line(g,'#6a5a52',c-44,b-80,c-30,b-100,3);line(g,'#6a5a52',c,b-70,c+20,b-80,3);R(g,'#7a7068',c+50,b-60,40,60);for(let k=0;k<3;k++)R(g,'#9a8a7a',c+52+k*12,b-56,8,52);}],
 szentharomsag:[70,(g,c,b,n,L)=>{tbx(g,c-24,b,48,22,'#e9e1cf');tbx(g,c-16,b-22,32,20,'#e9e1cf');g.fillStyle='#e2d6bc';g.beginPath();g.moveTo(c-10,b-42);g.lineTo(c-3,b-130);g.lineTo(c+3,b-130);g.lineTo(c+10,b-42);g.fill();for(let k=0;k<6;k++)tstatue(g,c-18+k*7.2,b-42+((k%2)*4),'#e2d6bc');
   disc(g,'#d9b24a',c,b-134,5);R(g,'#d9b24a',c-1,b-148,2,10);R(g,'#d9b24a',c-4,b-144,8,2);}],
 brnokat:[120,(g,c,b,n,L)=>{thill(g,c,b,120,24,'#6a9a52');tbx(g,c-36,b-20,72,44,'#e2d6bc');ttri(g,c-38,b-63,76,18,'#3a3f47');for(const tx of [c-30,c+18]){tbx(g,tx,b-20,12,80,'#d9cfb8');poly(g,'#3a3f47',[[tx,b-100],[tx+6,b-148],[tx+12,b-100]]);}frr(g,'#3a4048',c-6,b-50,12,24,6);}],
 tyn:[120,(g,c,b,n,L)=>{tbx(g,c-30,b,60,56,'#e9e1cf');ttri(g,c-32,b-55,64,22,'#4a525b');for(const tx of [c-34,c+16]){tbx(g,tx,b,18,96,'#c9b8a0');g.fillStyle='#2c3138';g.beginPath();g.moveTo(tx-2,b-96);g.lineTo(tx+9,b-136);g.lineTo(tx+20,b-96);g.fill();for(const dx of [0,6,12,18]){poly(g,'#2c3138',[[tx+dx-2,b-96],[tx+dx,b-110],[tx+dx+2,b-96]]);disc(g,'#d9b24a',tx+dx,b-111,1);}disc(g,'#d9b24a',tx+9,b-138,1.6);}}],
 karolyhid:[220,(g,c,b,n,L)=>{const x=c-110;twater(g,x,b,220,18);R(g,'#8a7a62',x+30,b-36,190,8);for(let k=0;k<4;k++){g.fillStyle='#7a6a52';g.beginPath();g.moveTo(x+30+k*48,b-28);g.quadraticCurveTo(x+54+k*48,b-8,x+78+k*48,b-28);g.lineTo(x+78+k*48,b-18);g.lineTo(x+30+k*48,b-18);g.fill();R(g,'#7a6a52',x+28+k*48,b-28,8,22);}
   for(let k=0;k<6;k++){R(g,'#3a3a3a',x+50+k*30,b-50,4,14);disc(g,'#3a3a3a',x+52+k*30,b-52,2.4);}tbx(g,x+4,b-14,28,80,'#5a4a42');poly(g,'#2c3138',[[x+2,b-94],[x+18,b-120],[x+34,b-94]]);for(const dx of [4,30])tspire(g,x+dx,b-94,5,12,'#2c3138');tarcade(g,x+6,b-14,24,24,1,'#2a2420');}],
 stephansdom:[160,(g,c,b,n,L)=>{tbx(g,c-70,b,100,56,'#d9cfb8');g.save();g.beginPath();g.moveTo(c-74,b-56);g.lineTo(c-20,b-96);g.lineTo(c+34,b-56);g.closePath();g.clip();for(let y=0;y<44;y+=5)for(let k=0;k<110;k+=6)poly(g,((k+y)/5|0)%2?'#2f6a4a':'#e8c040',[[c-74+k,b-96+y],[c-71+k,b-91+y],[c-68+k,b-96+y]]);R(g,'rgba(255,255,255,0)',0,0,1,1);g.restore();
   g.fillStyle='#c9bfa8';g.beginPath();g.moveTo(c+30,b);g.lineTo(c+32,b-80);g.lineTo(c+44,b-152);g.lineTo(c+56,b-80);g.lineTo(c+58,b);g.fill();for(let y=b-140;y<b-20;y+=10)R(g,'rgba(0,0,0,0.15)',c+40,y,8,4);frr(g,'#3a4048',c-30,b-34,14,24,6);}],
 oriaskerek:[150,(g,c,b,n,L)=>{const cy=b-72,r=62;g.strokeStyle='#b5452b';g.lineWidth=2;g.beginPath();g.arc(c,cy,r,0,TAU);g.stroke();g.lineWidth=0.7;for(let k=0;k<16;k++){const a=k/16*TAU;g.beginPath();g.moveTo(c,cy);g.lineTo(c+Math.cos(a)*r,cy+Math.sin(a)*r);g.stroke();}
   line(g,'#7a3a2a',c,cy,c-30,b,3);line(g,'#7a3a2a',c,cy,c+30,b,3);for(let k=0;k<15;k++){const a=k/15*TAU;frr(g,['#c62a35','#efe6d2'][k%2],c+Math.cos(a)*r-4,cy+Math.sin(a)*r,8,7,1.2);if(n&&L&&k%3===0)L.push({x:c+Math.cos(a)*r,y:cy+Math.sin(a)*r,r:8});}disc(g,'#7a3a2a',c,cy,4);}],
 /* ismert falvak */
 babolna:[170,(g,c,b,n,L)=>{tbx(g,c-80,b,130,34,'#f2d29a');for(let k=0;k<8;k++)frr(g,'#7a4f28',c-74+k*16,b-24,9,16,4);ttri(g,c-82,b-33,134,18,'#8a3a2a');tbx(g,c-24,b,20,62,'#f2d29a');tclock(g,c-14,b-50,4);tspire(g,c-14,b-62,14,16,'#4f7a6a');
   frr(g,'#b8b2a6',c+56,b-10,26,10,1);ell(g,'#5a3d22',c+68,b-24,11,6);R(g,'#5a3d22',c+60,b-20,2,10);R(g,'#5a3d22',c+75,b-20,2,10);line(g,'#5a3d22',c+76,b-26,c+82,b-36,4);disc(g,'#5a3d22',c+83,b-36,3);}],
 gombkilato:[80,(g,c,b,n,L)=>{for(const dx of [-12,0,12])line(g,'#9aa3ad',c+dx,b,c+dx*0.3,b-70,2);disc(g,lg(g,c-16,b-104,c+16,b-72,[[0,'#ffe9a8'],[1,'#d9a020']]),c,b-88,16);R(g,'rgba(0,0,0,0.2)',c-16,b-89,32,1.4);line(g,'#9aa3ad',c-16,b-88,c+16,b-88,0.6);}],
 kisvasut:[160,(g,c,b,n,L)=>{R(g,'#5a5f66',c-80,b-3,160,2);frr(g,'#2a6a3a',c-70,b-28,34,22,2);frr(g,'#1b1f26',c-44,b-38,8,12,1);for(const k of [0,1])frr(g,k?'#c62a35':'#e8d3a2',c-30+k*50,b-26,46,20,2);twins(g,c-28,b-24,96,10,1,8,n,L,171,null,null);for(let k=0;k<7;k++)disc(g,'#1b1f26',c-64+k*22,b-5,3);
   for(let k=0;k<4;k++)ttree(g,c-74+k*48,b-30,1.4,'#2f5f2c');}],
 strand:[190,(g,c,b,n,L)=>{const x=c-95;twater(g,x,b-12,190,22);R(g,'#e8d3a2',x,b-12,190,12);for(let k=0;k<4;k++){const ux=x+20+k*46;line(g,'#ffffff',ux,b-4,ux,b-28,0.8);g.fillStyle=['#e53935','#3f7fd9','#ffcf33','#43a047'][k];g.beginPath();g.arc(ux,b-28,11,Math.PI,TAU);g.fill();}tboat(g,x+120,b-24,'#ffffff','#e53935');}],
 rom:[140,(g,c,b,n,L)=>{for(const [dx,h] of [[-60,24],[-40,40],[-20,18],[0,46],[20,28],[44,36]])tbx(g,c+dx,b,18,h,'#c9b89a');tarcade(g,c-40,b,60,22,2,'#5a4a32');for(let k=0;k<6;k++)R(g,'#a8987a',c-60+k*22,b-2,10,2);ttree(g,c+66,b,1.8);}],
 reptér:[110,(g,c,b,n,L)=>{tbx(g,c-10,b,20,70,'#e8edf1');frr(g,lg(g,0,b-90,0,b-70,[[0,'#bfe0f0'],[1,'#5f88a2']]),c-20,b-90,40,20,3);R(g,'#59616a',c-22,b-92,44,3);line(g,'#9aa3ad',c,b-92,c,b-104,1);tbx(g,c+20,b,40,20,'#d6dde4');
   line(g,'#7d858d',c-46,b,c-46,b-40,1);poly(g,'#ff8f1f',[[c-46,b-40],[c-28,b-37],[c-28,b-33],[c-46,b-32]]);R(g,'#ffffff',c-40,b-39,3,7);}],
 sanc:[200,(g,c,b,n,L)=>{thill(g,c,b,200,90,'#eef3f7');g.fillStyle='#d6dde4';g.beginPath();g.moveTo(c-90,b-80);g.quadraticCurveTo(c-20,b-60,c+10,b-16);g.lineTo(c+90,b-4);g.lineTo(c+90,b);g.lineTo(c+6,b-12);g.quadraticCurveTo(c-24,b-58,c-92,b-74);g.fill();R(g,'#9aa3ad',c-96,b-96,10,22);for(let k=0;k<5;k++)tflag(g,c-60+k*30,b-70+k*12,['#d32f2f','#ffffff']);}],
 oroszkapolna:[90,(g,c,b,n,L)=>{tbx(g,c-24,b,48,30,'#7a5a3a');for(let y=b-30;y<b;y+=4)R(g,'rgba(0,0,0,0.15)',c-24,y,48,1);ttri(g,c-28,b-29,56,22,'#5a3d22');for(const dx of [-16,16]){tbx(g,c+dx-4,b-30,8,18,'#7a5a3a');tonion(g,c+dx,b-48,5,'#5a3d22');}ttree(g,c-40,b,2.2,'#2f5f2c');ttree(g,c+40,b,2.4,'#2f5f2c');}],
 soca:[190,(g,c,b,n,L)=>{const x=c-95;R(g,'#2fb5a0',x,b-12,190,12);for(let k=0;k<190;k+=11)R(g,'rgba(255,255,255,0.6)',x+k,b-10+(k%3),5,0.8);R(g,'#7a5a3a',x+60,b-26,70,3);for(let k=0;k<70;k+=7)line(g,'#7a5a3a',x+60+k,b-26,x+60+k,b-34,0.8);R(g,'#7a5a3a',x+60,b-34,70,1);line(g,'#5a3d22',x+60,b-34,x+60,b-12,1.4);line(g,'#5a3d22',x+130,b-34,x+130,b-12,1.4);
   tbx(g,x+150,b-12,30,22,'#f4efe2');ttri(g,x+147,b-33,36,18,'#5a3d22');ttree(g,x+20,b-12,2,'#2f5f2c');}],
 osszarium:[130,(g,c,b,n,L)=>{thill(g,c,b,130,30,'#6a9a52');for(let k=0;k<3;k++)tbx(g,c-46+k*12,b-26-k*16,92-k*24,16,'#e9e1cf');tbx(g,c-8,b-74,16,22,'#e9e1cf');tdome(g,c,b-76,8,'#9aa3ad');R(g,'#7d858d',c-0.6,b-98,1.2,12);R(g,'#7d858d',c-3,b-94,6,1.2);}],
 ordoghid:[190,(g,c,b,n,L)=>{const x=c-95;R(g,'#2f8a7a',x,b-8,190,8);g.fillStyle='#8a7a62';g.beginPath();g.moveTo(x,b-40);g.lineTo(x+190,b-40);g.lineTo(x+190,b);g.lineTo(x+150,b);g.quadraticCurveTo(x+120,b-34,x+95,b-4);g.quadraticCurveTo(x+70,b-34,x+40,b);g.lineTo(x,b);g.closePath();g.fill();R(g,'#7a6a52',x,b-44,190,4);
   tbx(g,x+88,b-4,14,40,'#7a6a52');tbx(g,x+150,b-44,30,40,'#efe6d2');ttri(g,x+148,b-82,34,14,'#c2552f');}],
 orvieto:[130,(g,c,b,n,L)=>{thill(g,c,b,130,20,'#a89a6a');tbx(g,c-40,b-18,80,64,'#efe6d2');for(let y=b-82;y<b-18;y+=6)R(g,'#3a3f47',c-40,y,80,2.6);g.fillStyle='#d9b24a';g.beginPath();g.moveTo(c-42,b-82);g.lineTo(c,b-120);g.lineTo(c+42,b-82);g.fill();for(const dx of [-24,0,24])poly(g,'#d9b24a',[[c+dx-10,b-82],[c+dx,b-100],[c+dx+10,b-82]]);
   disc(g,'#5a7aa8',c,b-62,8);disc(g,'#d9b24a',c,b-62,4);for(const tx of [c-48,c+40])tspire(g,tx+4,b-82,8,30,'#efe6d2');}],
 sanremo:[130,(g,c,b,n,L)=>{tbx(g,c-40,b,80,48,'#f2ede2');for(const [dx,r] of [[-28,6],[-10,7],[10,7],[28,6],[0,10]])tonion(g,c+dx,b-48-(dx===0?14:0),r,'#2f9a8a');R(g,'#f2ede2',c-6,b-62,12,14);tbx(g,c+50,b,10,10,'#f2ede2');tpalm(g,c-58,b,50);tpalm(g,c+58,b,46);}],
 gordes:[200,(g,c,b,n,L)=>{thill(g,c,b,200,60,'#a89a6a');for(let k=0;k<14;k++){const hx=c-80+k*12,hy=b-30-Math.sin(k/13*Math.PI)*34;tbx(g,hx,hy+12,14,16+(k%3)*6,'#d9c9a8');poly(g,'#c2552f',[[hx-1,hy-4-(k%3)*6],[hx+7,hy-8-(k%3)*6],[hx+15,hy-4-(k%3)*6]]);}
   tbx(g,c-16,b-60,32,44,'#d9c9a8');tcren(g,c-16,b-104,32,'#c9b998',3);for(const tx of [c-20,c+12])tbx(g,tx,b-60,8,54,'#d9c9a8');}],
 bellegarde:[180,(g,c,b,n,L)=>{thill(g,c,b,180,50,'#7a8a52');g.fillStyle='#b8a68a';g.beginPath();g.moveTo(c-70,b-46);g.lineTo(c-50,b-70);g.lineTo(c-20,b-60);g.lineTo(c,b-80);g.lineTo(c+20,b-60);g.lineTo(c+50,b-70);g.lineTo(c+70,b-46);g.closePath();g.fill();tbx(g,c-20,b-60,40,20,'#c9b89a');tflag(g,c,b-102,['#2f5aa8','#ffffff','#d32f2f']);}],
 medinaceli:[120,(g,c,b,n,L)=>{tbx(g,c-50,b,100,70,'#d9c39a');for(let k=0;k<100;k+=8)R(g,'rgba(0,0,0,0.08)',c-50+k,b-70,1,70);R(g,'#c9b08a',c-52,b-74,104,6);for(const [dx,w,h] of [[-40,16,30],[-16,32,48],[24,16,30]]){g.fillStyle='#4a4a3a';g.beginPath();g.moveTo(c+dx,b);g.lineTo(c+dx,b-h+w/2);g.arc(c+dx+w/2,b-h+w/2,w/2,Math.PI,TAU);g.lineTo(c+dx+w,b);g.fill();}}],
 evora:[130,(g,c,b,n,L)=>{tbx(g,c-50,b,100,24,'#c9b89a');for(let k=0;k<100;k+=7)R(g,'rgba(0,0,0,0.1)',c-50+k,b-24,1,24);tcols(g,c-44,b-24,88,56,7,'#efe6d2');for(let k=0;k<7;k++)R(g,'#d9cfb8',c-46+k*14.4,b-82,7,4);R(g,'#d9cfb8',c-48,b-86,96,6);}],
 allomas:[160,(g,c,b,n,L)=>{tbx(g,c-70,b,140,40,'#f6f4ee');for(let y=b-30;y<b-6;y+=4)for(let k=0;k<140;k+=4)R(g,((k+y)/4)%2?'#2f5aa8':'#d6e2f2',c-70+k,y,4,4);for(let k=0;k<6;k++)frr(g,'#4a3a2a',c-60+k*22,b-24,10,24,4);ttri(g,c-72,b-39,144,14,'#c2552f');tclock(g,c,b-34,4);text(g,'VILAR FORMOSO',c,b-48,'#2f5aa8',0.5,'center',null);}],
 bentheim:[170,(g,c,b,n,L)=>{thill(g,c,b,170,40,'#6a9a52');tbx(g,c-60,b-36,120,36,'#c9b89a');tcren(g,c-60,b-72,120,'#b8a68a',3);tbx(g,c-20,b-36,30,70,'#c9b89a');poly(g,'#4a525b',[[c-22,b-106],[c-5,b-126],[c+12,b-106]]);tbx(g,c+30,b-36,22,50,'#c9b89a');tdome(g,c+41,b-86,8,'#4f7a6a');}],
 rajhrad:[180,(g,c,b,n,L)=>{tbx(g,c-86,b,172,40,'#f2e2b8');twins(g,c-82,b-36,164,30,2,16,n,L,181,null,'#3f6a4a');R(g,'#8a3a2a',c-88,b-46,176,6);tbx(g,c-22,b,44,62,'#f6ecc8');for(const tx of [c-22,c+12]){tbx(g,tx,b-62,10,26,'#f6ecc8');tonion(g,tx+5,b-88,5,'#4f7a6a');}ttri(g,c-24,b-62,48,12,'#8a3a2a');}],
 mikulov:[210,(g,c,b,n,L)=>{thill(g,c-40,b,140,60,'#6a9a52');thill(g,c+70,b,100,80,'#9aa86a');tbx(g,c-80,b-56,80,30,'#f2ede2');twins(g,c-76,b-84,72,24,2,8,n,L,191,null,null);poly(g,'#a8432e',[[c-82,b-86],[c-40,b-102],[c+2,b-86]]);tbx(g,c-48,b-86,14,34,'#f2ede2');tdome(g,c-41,b-120,6,'#4f7a6a');
   tbx(g,c+64,b-76,14,22,'#f2ede2');tspire(g,c+71,b-98,12,16,'#a8432e');}]
};
/* városok és falvak nevezetességei (sorrendben, a szakaszon ismétlődve) */
const TLMK={Komárom:['erod','komhid'],Siófok:['viztorony','balaton'],Keszthely:['festetics','balaton'],Nagykanizsa:['baroktemplom'],Zágráb:['szentmark','zagkat'],Ljubljana:['ljvar','harmashid'],Udine:['loggia'],
 Velence:['campanile','rialto'],Bologna:['kettorony'],Firenze:['duomo'],Róma:['colosseum','szentpeter'],Civitavecchia:['forte'],Livorno:['terrazza'],'La Spezia':['kikoto'],Genova:['lanterna','kikoto'],Nizza:['negresco'],
 Barcelona:['sagrada'],Lleida:['seuvella'],Zaragoza:['pilar'],Madrid:['alcala','palota'],Talavera:['prado'],Mérida:['merida'],Badajoz:['alcazaba'],Lisszabon:['belem','villamos'],Coimbra:['coimbra'],Salamanca:['salamanca'],
 Burgos:['burgos'],'San Sebastián':['concha'],Bordeaux:['bourse'],Poitiers:['poitiers'],Tours:['loirekastely'],Párizs:['eiffel','diadal'],Brüsszel:['atomium','grandplace'],Antwerpen:['antwerpen'],Amszterdam:['grachten'],
 Osnabrück:['osnabruck'],Bremen:['brema'],Hamburg:['elbphil'],Flensburg:['vitorlas'],Kolding:['koldinghus'],Odense:['andersen'],Koppenhága:['nyhavn','kisbeleany'],Berlin:['brandenburg','tvtorony'],'Frankfurt (Oder)':['tegla'],
 Poznań:['poznan'],Łódź:['manufaktura'],Varsó:['kulturpalota'],Radom:['neogot'],Kielce:['puspokipalota'],Krakkó:['mariacki','wawel'],Katowice:['spodek'],Ostrava:['koho'],Olomouc:['szentharomsag'],Brno:['brnokat'],Prága:['tyn','karolyhid'],Bécs:['stephansdom','oriaskerek'],
 Bábolna:['babolna'],Balatonboglár:['gombkilato'],Balatonfenyves:['kisvasut'],Balatonmáriafürdő:['strand'],Fonyód:['strand'],Fenékpuszta:['rom'],Sármellék:['reptér'],Jesenice:['koho'],'Kranjska Gora':['sanc'],'Vršič-hágó':['oroszkapolna'],
 Trenta:['soca'],Kobarid:['osszarium'],'Cividale del Friuli':['ordoghid'],Orvieto:['orvieto'],Sanremo:['sanremo'],Gordes:['gordes'],'Le Perthus':['bellegarde'],Medinaceli:['medinaceli'],Évora:['evora'],'Vilar Formoso':['allomas'],
 'Bad Bentheim':['bentheim'],Rajhrad:['rajhrad'],Mikulov:['mikulov']};

/* falu jellegzetes temploma: országonként más toronyforma, színe és mérete a névből */
const CHT={HU:'spire',AT:'onion',SI:'onion',CZ:'onion',PL:'onion',DE:'spire',DK:'step',NL:'spire',BE:'spire',FR:'slate',IT:'campanile',ES:'espadana',PT:'espadana',HR:'spire'};
function villageChurch(g,c,b,n,L,cc,sd){const st=tst(cc),wall=st.f[sd%st.f.length],roof=st.r[(sd>>3)%st.r.length],tp=CHT[cc]||'spire',th=60+(sd%5)*9,hc=['#4f7a6a','#a8432e','#3a3f47','#7a5a3a'][(sd>>5)%4];
 tchurchBody(g,c-34,b,52,30+(sd%3)*4,wall,roof);
 if(tp==='espadana'){tbx(g,c+18,b,22,44,wall);g.fillStyle=wall;g.beginPath();g.moveTo(c+18,b-44);g.lineTo(c+18,b-56);g.quadraticCurveTo(c+29,b-64,c+40,b-56);g.lineTo(c+40,b-44);g.fill();for(const dx of [22,31])frr(g,'#3a3228',c+dx,b-56,6,9,3);disc(g,'#9a7a3a',c+25,b-50,2);}
 else{tbx(g,c+18,b,16,th,wall);frr(g,'#3a3228',c+23,b-th+8,6,10,3);tclock(g,c+26,b-th+26,3.4);
  if(tp==='onion')tonion(g,c+26,b-th,8,hc);else if(tp==='campanile'){tarcade(g,c+18,b-th+16,16,14,2,'#3a3228');tspire(g,c+26,b-th,18,10,roof);}else if(tp==='slate')tspire(g,c+26,b-th,18,26,'#56606a');
  else if(tp==='step'){poly(g,wall,[[c+18,b-th],[c+18,b-th-6],[c+22,b-th-6],[c+22,b-th-12],[c+30,b-th-12],[c+30,b-th-6],[c+34,b-th-6],[c+34,b-th]]);}else tspire(g,c+26,b-th,18,30+(sd%4)*6,hc);}}
/* falu egyedi tárgya: víztorony, szobor, kút, szélmalom, kereszt, emlékmű, májusfa, buszváró */
function villageFeature(g,c,b,n,L,cc,sd,name){const k=(sd>>2)%8;
 if(k===0){line(g,'#7d858d',c-10,b,c-6,b-56,1.6);line(g,'#7d858d',c+10,b,c+6,b-56,1.6);line(g,'#7d858d',c-8,b-28,c+8,b-28,0.8);frr(g,['#e8edf1','#9fc0d8','#e9d29a'][sd%3],c-16,b-80,32,24,8);text(g,name.slice(0,10).toUpperCase(),c,b-71,'#3a4048',0.45,'center',null);}
 else if(k===1)tstatue(g,c,b,['#5f7f6a','#7a6a52','#3a3f47'][sd%3]);
 else if(k===2){ell(g,'#9a948a',c,b-4,20,5);R(g,'#9a948a',c-20,b-8,40,6);ell(g,'#6aa8dc',c,b-8,17,3);R(g,'#b8b2a6',c-2,b-30,4,22);ell(g,'#b8b2a6',c,b-30,8,3);for(let j=0;j<5;j++)line(g,'#bfe3ff',c,b-32,c-8+j*4,b-10,0.6);}
 else if(k===3){g.fillStyle='#f4efe2';g.beginPath();g.moveTo(c-9,b);g.lineTo(c-6,b-40);g.lineTo(c+6,b-40);g.lineTo(c+9,b);g.fill();ttri(g,c-8,b-39,16,10,'#5a3d22');const a=(sd%7)*0.3;for(let j=0;j<4;j++){const aa=a+j*Math.PI/2;line(g,'#7a5a3a',c,b-36,c+Math.cos(aa)*26,b-36+Math.sin(aa)*26,2);}}
 else if(k===4){R(g,'#6b4a2b',c-1,b-40,2,40);R(g,'#6b4a2b',c-9,b-32,18,2);R(g,'#d9b24a',c-0.5,b-30,1,3);ell(g,'#5d9a4e',c,b,10,2);}
 else if(k===5){tbx(g,c-14,b,28,10,'#b8b2a6');g.fillStyle='#9a948a';g.beginPath();g.moveTo(c-8,b-10);g.lineTo(c-4,b-46);g.lineTo(c+4,b-46);g.lineTo(c+8,b-10);g.fill();R(g,'#d9b24a',c-6,b-24,12,1.2);}
 else if(k===6){line(g,'#7a5a3a',c,b,c,b-70,2);for(let j=0;j<3;j++){g.strokeStyle='#4f8a3e';g.lineWidth=3;g.beginPath();g.arc(c,b-56+j*8,6-j,0,TAU);g.stroke();}for(let j=0;j<6;j++)line(g,['#e53935','#ffffff','#3f7fd9'][j%3],c,b-66,c-10+j*4,b-44,0.8);}
 else{frr(g,'#4a5a6a',c-20,b-26,40,3,1);R(g,'rgba(190,220,240,0.5)',c-18,b-23,36,20);R(g,'#4a5a6a',c-20,b-23,2,23);R(g,'#4a5a6a',c+18,b-23,2,23);frr(g,'#ffcf33',c+22,b-36,10,10,5);text(g,'H',c+27,b-33,'#2a6a3a',0.6,'center',null);}}
function lmDef(id){if(LMD[id])return LMD[id];const m=/^([vg]):(.*)$/.exec(id);if(!m)return null;const [,kind,rest]=m,[cc,sd,name]=rest.split('|'),s=+sd;
 if(kind==='v')return [140,(g,c,b,n,L)=>{villageChurch(g,c-20,b,n,L,cc,s);villageFeature(g,c+50,b,n,L,cc,s,name);}];
 /* város, saját nevezetesség nélkül: nagy templom/székesegyház a város stílusában */
 return [160,(g,c,b,n,L)=>{const st=tst(cc);tbx(g,c-60,b,120,60,st.f[s%st.f.length]);ttri(g,c-62,b-59,124,24,st.r[0]);for(const tx of [c-56,c+40]){tbx(g,tx,b,16,110,st.f[(s+1)%st.f.length]);(s%2?tonion:(gg,x,y,r,cl)=>tspire(gg,x,y,r*2,r*3,cl))(g,tx+8,b-110,8,'#4f7a6a');}}];}
/* a szakasz nevezetességeinek helye (világkoordináta), egyszer kiszámolva a szakaszra */
function townLM(leg){if(leg.lmk)return leg.lmk;if(!leg.len)return (leg.lmk=[]);const out=[],pk=1/leg.kmPerPx;
 for(const s of leg.segs){if((s.type!=='town'&&s.type!=='village')||!s.name)continue;const x0=Math.max(0,s.x0),x1=Math.min(s.x1,leg.len),sd=tSeed(s.name),cc=s.ctry||'HU';
  const own=TLMK[s.name];
  if(s.type==='village'){const ids=own?[own[0],'v:'+cc+'|'+sd+'|'+s.name]:['v:'+cc+'|'+sd+'|'+s.name];const len=x1-x0;ids.forEach((id,k)=>out.push({wx:x0+len*(ids.length===1?0.5:0.3+k*0.4),id:id}));}
  else{const ids=own||['g:'+cc+'|'+sd+'|'+s.name];for(let wx=x0+pk*0.35,k=0;wx<x1-pk*0.2;wx+=pk*0.8,k++)out.push({wx:wx,id:ids[k%ids.length]});}}
 for(const m of out){const d=lmDef(m.id);m.w=d?d[0]:140;}leg.lmk=out;return out;}
/* középső rétegben: a látható nevezetességek kirajzolása; visszaadja a kitakart sávokat (ott nem kell ház) */
const LM_K=0.8;/* a nevezetességek 80%-os méretben: a magas tornyok se csússzanak a felső kijelző alá */
function drawTownLM(g,leg,dist,f,b,night,snow,lights){const lm=townLM(leg),o=dist*f,occ=[];
 for(const m of lm){const w=Math.ceil(m.w*LM_K),x=(m.wx-PX)*f+PX-o;if(x<-w||x>W+w)continue;const d=lmDef(m.id);if(!d)continue;occ.push([x-w/2-8,x+w/2+8]);
  sprite(g,'lm|'+m.id+'|'+night,x-w/2-4,b-136,w+8,142,lights,(gg,ll)=>{const c=w/2+4;gg.save();gg.translate(c,136);gg.scale(LM_K,LM_K);const l2=[];d[1](gg,0,0,night,l2);gg.restore();for(const q of l2)ll.push({x:c+q.x*LM_K,y:136+q.y*LM_K,r:q.r*LM_K});});}
 return occ;}
/* városi ház az ország stílusában, településenként más színekkel és magassággal */
function townHouse(g,x,b,i,s,night,lights){const cc=s.ctry||'HU',st=tst(cc),sd=tSeed(s.name)+i*7,h0=hsh(sd);
 if(CAPS[s.name]&&h0<0.18){const h=110+hsh(sd+3)*40;R(g,'#7d93a8',x+4,b-h,66,h);g.fillStyle=lg(g,x,0,x+70,0,[[0,'#a9c3d8'],[0.6,'#6f8faa'],[1,'#4f6f8a']]);g.fillRect(x+6,b-h+2,62,h-4);for(let y=b-h+6;y<b-4;y+=6)R(g,'rgba(255,255,255,0.18)',x+6,y,62,1);
  if(night)for(let y=b-h+6,r=0;y<b-6;y+=6,r++)for(let c2=0;c2<6;c2++)if(hsh(sd+r*13+c2)>0.6){R(g,'#ffd77a',x+8+c2*10,y+1,7,3);}return;}
 const w=74,fl=2+((hsh(sd+1)*4)|0),h=fl*16+18,col=st.f[(hsh(sd+2)*st.f.length)|0],roof=st.r[(hsh(sd+5)*st.r.length)|0];
 tbx(g,x,b,w,h,col);if(st.tile){for(let y=b-h+4;y<b-18;y+=4)for(let k=0;k<w;k+=4)if(((k+y)/4)%3===0)R(g,'rgba(47,90,168,0.35)',x+k,y,2,2);}
 if(st.rt==='fach'){g.strokeStyle='#4a3424';g.lineWidth=1.4;for(let k=0;k<=w;k+=18){g.beginPath();g.moveTo(x+k,b-h);g.lineTo(x+k,b-18);g.stroke();}for(let y=b-h;y<b-18;y+=16){g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();for(let k=0;k<w;k+=18){g.beginPath();g.moveTo(x+k,y);g.lineTo(x+k+18,y+16);g.stroke();}}}
 twins(g,x+2,b-h+4,w-4,h-24,fl,4,night,lights,sd,null,st.rt==='fach'?null:st.sh);
 if(st.rt==='gable'||st.rt==='fach'||st.rt==='steep')ttri(g,x-3,b-h+1,w+6,st.rt==='gable'?16:26,roof);
 else if(st.rt==='step'){g.fillStyle=col;g.beginPath();g.moveTo(x+6,b-h);for(let k=0;k<4;k++){g.lineTo(x+6+k*8,b-h-k*8);g.lineTo(x+14+k*8,b-h-k*8);}for(let k=3;k>=0;k--){g.lineTo(x+w-14-k*8+8*0,b-h-k*8);g.lineTo(x+w-6-k*8+0,b-h-k*8);}g.lineTo(x+w-6,b-h);g.fill();R(g,'#ffffff',x,b-h,w,1.2);}
 else if(st.rt==='mansard'){poly(g,roof,[[x-2,b-h],[x+6,b-h-18],[x+w-6,b-h-18],[x+w+2,b-h]]);for(let k=0;k<3;k++){frr(g,'#efe6d2',x+12+k*22,b-h-14,8,10,1);R(g,night?'#ffd77a':'#4a5a6a',x+14+k*22,b-h-12,4,6);}R(g,'#2c3138',x-2,b-h-1,w+4,1.6);for(let k=4;k<w;k+=8)R(g,'#2c3138',x+k,b-h+16,1,6);}
 else{poly(g,roof,[[x-5,b-h+1],[x+w/2,b-h-8],[x+w+5,b-h+1]]);R(g,shade(roof,0.8),x-5,b-h,w+10,2);if(!night)for(let k=0;k<fl-1;k++)R(g,'#3a3f47',x+10,b-h+16+k*16+8,w-20,1.2);}
 // földszint: üzlet napellenzővel vagy kapu
 const ac=['#e53935','#1e88e5','#43a047','#fb8c00','#8e5cc4','#2a6a8a'][(hsh(sd+9)*6)|0];R(g,shade(col,0.8),x,b-18,w,18);frr(g,night?'#ffe9a8':'#5f6f7f',x+4,b-15,w/2-6,12,1);if(night&&lights)lights.push({x:x+w/4,y:b-9,r:14});
 for(let k=0;k<w/2;k+=6)R(g,(k/6)%2?ac:'#ffffff',x+2+k,b-20,6,4);frr(g,'#5a3d22',x+w-18,b-16,10,16,1);}
/* falusi ház: az ország stílusában, a falu nevéből számolt színekkel (nincs két egyforma falu) */
function villageHouse(g,x,b,i,s,night,lights,snow){const cc=s.ctry||'HU',st=tst(cc),sd=tSeed(s.name)+i*5,col=st.f[(hsh(sd)*st.f.length)|0],roof=st.r[(hsh(sd+1)*st.r.length)|0],w=40+((hsh(sd+2)*12)|0),h=22+((hsh(sd+3)*8)|0);
 tbx(g,x,b,w,h,col);if(st.rt==='fach'){g.strokeStyle='#4a3424';g.lineWidth=1.2;g.strokeRect(x,b-h,w,h);for(let k=0;k<w;k+=10){g.beginPath();g.moveTo(x+k,b-h);g.lineTo(x+k+10,b);g.stroke();}}
 if(st.tile)for(let k=0;k<w;k+=4)R(g,'#2f5aa8',x+k,b-6,2,2);
 const rh=st.rt==='low'?8:st.rt==='steep'||st.rt==='fach'?22:st.rt==='mansard'?14:16;if(st.rt==='step'){poly(g,col,[[x,b-h],[x+6,b-h],[x+6,b-h-6],[x+12,b-h-6],[x+12,b-h-12],[x+w-12,b-h-12],[x+w-12,b-h-6],[x+w-6,b-h-6],[x+w-6,b-h],[x+w,b-h]]);R(g,roof,x+12,b-h-14,w-24,2);}
 else ttri(g,x-3,b-h+1,w+6,rh,snow?'#eef3f7':roof);frr(g,'#7a3b20',x+w*0.7,b-h-rh*0.8,4,rh*0.6,0.5);
 for(const wx of [0.14,0.62]){const lit=night&&hsh(sd+wx*10)>0.4;frr(g,lit?'#ffd77a':'#7ea8c2',x+w*wx,b-h+6,8,8,0.6);if(st.sh&&!night){R(g,st.sh,x+w*wx-2,b-h+6,2,8);R(g,st.sh,x+w*wx+8,b-h+6,2,8);}if(lit&&lights)lights.push({x:x+w*wx+4,y:b-h+10,r:8});}
 frr(g,'#7a4f28',x+w*0.42,b-13,7,13,1);if(hsh(sd+7)<0.5)for(let k=0;k<5;k++)disc(g,['#e53935','#ffcf33','#ff6b8a'][k%3],x+3+k*7,b-1.5,1.4);}
window.TOWNS_OK=true;
