'use strict';
/* =========================================================
   TÉRKÉP – földrajzilag pontos Európa (Natural Earth), útvonal, pozíció
   ========================================================= */
const MAPVIEW={lat0:36.4,lat1:57.6,lon0:-10.2,lon1:25.2};
function mapProj(v,r){const c=Math.cos((v.lat0+v.lat1)/2*Math.PI/180),sx=r[2]/((v.lon1-v.lon0)*c),sy=r[3]/(v.lat1-v.lat0),k=Math.min(sx,sy);
 const ox=r[0]+(r[2]-(v.lon1-v.lon0)*c*k)/2,oy=r[1]+(r[3]-(v.lat1-v.lat0)*k)/2;return (lat,lon)=>[ox+(lon-v.lon0)*c*k,oy+(v.lat1-lat)*k];}
const MAPCACHE={};
function landImage(r,v,key){const hd=typeof GEOHD!=='undefined',src=hd?GEOHD:GEO,qq=hd?100:20;const ck=key+'|'+SC+'|'+hd;if(MAPCACHE[ck])return MAPCACHE[ck];const [c,g]=mk(r[2],r[3],SC);const pr=mapProj(v,[0,0,r[2],r[3]]);
 g.fillStyle=lg(g,0,0,0,r[3],[[0,'#2f6fb8'],[1,'#24599a']]);g.fillRect(0,0,r[2],r[3]);
 for(const pl of src){g.beginPath();for(let i=0;i<pl.length;i+=2){const p=pr(pl[i+1]/qq,pl[i]/qq);i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.closePath();
  g.fillStyle='#86c070';g.fill();g.strokeStyle='rgba(60,90,50,0.75)';g.lineWidth=Math.max(0.3,r[2]/500);g.stroke();}
 // Alpok
 g.fillStyle='rgba(235,240,245,0.55)';for(const [la,lo,rr] of [[46.6,8.2,0.9],[47.1,11.2,0.9],[46.9,13.4,0.7],[45.9,7.0,0.6]]){const p=pr(la,lo),q=pr(la,lo+rr);g.beginPath();g.ellipse(p[0],p[1],q[0]-p[0],(q[0]-p[0])*0.45,0,0,TAU);g.fill();}
 return MAPCACHE[ck]=c;}
function legPos(i,frac){const pts=LEGS[i].pts;let tot=0;const d=[];for(let k=1;k<pts.length;k++){const c=Math.cos(pts[k][0]*Math.PI/180),dd=Math.hypot(pts[k][0]-pts[k-1][0],(pts[k][1]-pts[k-1][1])*c);d.push(dd);tot+=dd;}
 let rem=clamp(frac,0,1)*tot;for(let k=1;k<pts.length;k++){if(rem<=d[k-1]||k===pts.length-1){const u=d[k-1]?Math.min(1,rem/d[k-1]):0;return [lerp(pts[k-1][0],pts[k][0],u),lerp(pts[k-1][1],pts[k][1],u)];}rem-=d[k-1];}return pts[pts.length-1];}
function drawRoute(g,pr,leg,frac,lw){for(let i=0;i<LEGS.length;i++){const pts=LEGS[i].pts;g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';
  g.strokeStyle=i<leg?'#ffd84a':i===leg?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.35)';if(i>leg)g.setLineDash([lw*2,lw*2]);
  g.beginPath();pts.forEach((p,k)=>{const q=pr(p[0],p[1]);k?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.stroke();g.setLineDash([]);}
 if(frac>0){const pts=LEGS[leg].pts;g.strokeStyle='#ffd84a';g.lineWidth=lw*1.2;g.beginPath();const cur=legPos(leg,frac);let acc=0;const c0=pr(pts[0][0],pts[0][1]);g.moveTo(c0[0],c0[1]);
  let tot=0;const d=[];for(let k=1;k<pts.length;k++){const c=Math.cos(pts[k][0]*Math.PI/180),dd=Math.hypot(pts[k][0]-pts[k-1][0],(pts[k][1]-pts[k-1][1])*c);d.push(dd);tot+=dd;}
  for(let k=1;k<pts.length;k++){if(acc+d[k-1]>=frac*tot){const q=pr(cur[0],cur[1]);g.lineTo(q[0],q[1]);break;}acc+=d[k-1];const q=pr(pts[k][0],pts[k][1]);g.lineTo(q[0],q[1]);}g.stroke();}}
function drawMiniMap(g,r,leg,frac,t){const v=MAPVIEW;g.save();rrect(g,r[0],r[1],r[2],r[3],7);g.clip();g.drawImage(landImage(r,v,'mini'),r[0],r[1],r[2],r[3]);
 const pr=mapProj(v,r);drawRoute(g,pr,leg,frac,0.8);
 for(let i=0;i<=LEGS.length;i++){const c=LIVE_XY[i],q=pr(c[0],c[1]);disc(g,i<=leg?'#ff4d4d':'#ffffff',q[0],q[1],0.9);}
 const cur=legPos(leg,frac),q=pr(cur[0],cur[1]);const pulse=1.6+Math.abs(Math.sin(t*0.08))*1.6;disc(g,'rgba(255,60,60,0.35)',q[0],q[1],pulse+1.4);disc(g,'#ff2d2d',q[0],q[1],1.6);disc(g,'#ffffff',q[0],q[1],0.6);
 g.restore();g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.8;rrect(g,r[0],r[1],r[2],r[3],7);g.stroke();}
function drawBigMap(g,leg,frac,t,anim){const r=[8,22,W-16,H-82],v=MAPVIEW;frr(g,'#0b0f17',0,0,W,H,0);g.save();rrect(g,r[0],r[1],r[2],r[3],8);g.clip();g.drawImage(landImage(r,v,'big'),r[0],r[1],r[2],r[3]);
 const pr=mapProj(v,r);drawRoute(g,pr,leg,frac,1.6);
 const names=['Komárom'].concat(LEGS.map(L=>L.to.split(' (')[0]));
 for(let i=0;i<=LEGS.length;i++){const c=LIVE_XY[i],q=pr(c[0],c[1]);disc(g,i<=leg?'#ff4d4d':'#ffffff',q[0],q[1],2);}
 // feliratok: előbb az aktuális szakasz két vége, a többi csak ha nem takar
 const occ=[],ord=[leg,leg+1];for(let i=0;i<LEGS.length;i++)if(i!==leg&&i!==leg+1)ord.push(i);
 for(const i of ord){if(i>=LEGS.length)continue;const nm=names[i].toUpperCase(),c=LIVE_XY[i],q=pr(c[0],c[1]),w=textW(nm)+4;
  let ok=false,x=0;for(const cand of [q[0]+3,q[0]-3-w]){x=cand;if(!occ.some(o=>x<o[0]+o[2]&&x+w>o[0]&&q[1]-5<o[1]+o[3]&&q[1]+4>o[1])){ok=true;break;}}
  if(!ok)continue;occ.push([x,q[1]-5,w,9]);const cur=i===leg||i===leg+1;frr(g,cur?'rgba(255,216,74,0.85)':'rgba(10,13,22,0.55)',x,q[1]-5,w,9,2);text(g,names[i],x+2,q[1]-4,cur?'#1a1a1a':'#ffffff',1,'left',null);}
 const cur=legPos(leg,frac),q=pr(cur[0],cur[1]);g.save();g.translate(q[0]-9,q[1]-10);g.scale(0.16,0.16);drawCarSide(g,0,0,0,{t:t,ang:t*0.1,pos:true},null);g.restore();
 g.restore();g.strokeStyle='rgba(255,255,255,0.3)';g.lineWidth=1;rrect(g,r[0],r[1],r[2],r[3],8);g.stroke();
 text(g,'Útiterv - Európa körút',W/2,8,'#ffd84a',1.4,'center');}
/* ---- GPS: ráközelítés az autóra, menetirány szerint elforgatva ---- */
let GEOBB=null;
function geoBB(){if(GEOBB)return GEOBB;GEOBB=GEO.map(pl=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;for(let i=0;i<pl.length;i+=2){a=Math.min(a,pl[i]);c=Math.max(c,pl[i]);b=Math.min(b,pl[i+1]);d=Math.max(d,pl[i+1]);}return [a/20,b/20,c/20,d/20];});return GEOBB;}
const GPSCITY=Object.entries(GEOC);
const LAKES=[[46.83,17.73,78,9,36],[47.83,16.76,34,9,-82],[45.64,10.68,50,11,-80],[47.6,9.38,62,13,-28],[46.44,6.55,72,13,-12]];
function drawGPS(g,r,leg,frac,t,night,kmh,remKm){const L=LEGS[leg],cur=legPos(leg,frac),nx=legPos(leg,Math.min(1,frac+0.004)),pv=legPos(leg,Math.max(0,frac-0.004));
 const c0=Math.cos(cur[0]*Math.PI/180);let hd=Math.atan2((nx[1]-pv[1])*c0,nx[0]-pv[0]);if(!isFinite(hd))hd=0;
 GPS_HD=GPS_HD===null?hd:GPS_HD+Math.atan2(Math.sin(hd-GPS_HD),Math.cos(hd-GPS_HD))*0.04;
 const span=0.26+Math.min(1,kmh/130)*0.16,k=r[2]/span,cx=r[0]+r[2]/2,cy=r[1]+r[3]*0.66;
 const P2=(lat,lon)=>{const x=(lon-cur[1])*c0*k,y=-(lat-cur[0])*k,ca=Math.cos(-GPS_HD),sa=Math.sin(-GPS_HD);return [cx+x*ca-y*sa,cy+x*sa+y*ca];};
 const col=night?{w:'#0f2a44',l:'#23272e',b:'rgba(255,255,255,0.12)',r:'#4a5262',ro:'#16191f',rt:'#3b82f6',tx:'#e6ebf2',dn:'#6b7686'}:{w:'#a9d3f5',l:'#f1efe9',b:'rgba(120,110,100,0.35)',r:'#ffffff',ro:'#c9c4bb',rt:'#2f7cf6',tx:'#2b3138',dn:'#9aa3ad'};
 g.save();rrect(g,r[0],r[1],r[2],r[3],7);g.clip();R(g,col.w,r[0],r[1],r[2],r[3]);
 const rad=span*1.2,bb=geoBB();g.fillStyle=col.l;g.strokeStyle=col.b;g.lineWidth=0.5;
 for(let n=0;n<GEO.length;n++){const b=bb[n];if(b[2]<cur[1]-rad/c0||b[0]>cur[1]+rad/c0||b[3]<cur[0]-rad||b[1]>cur[0]+rad)continue;const pl=GEO[n];g.beginPath();for(let i=0;i<pl.length;i+=2){const p=P2(pl[i+1]/20,pl[i]/20);i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.closePath();g.fill();g.stroke();}
 // erdők és mellékutak: rácshoz kötött, állandó minta (nem villog)
 {const st=0.05,la0=Math.floor((cur[0]-rad)/st),la1=Math.ceil((cur[0]+rad)/st),lo0=Math.floor((cur[1]-rad/c0)/st),lo1=Math.ceil((cur[1]+rad/c0)/st);
  for(let a=la0;a<=la1;a++)for(let b=lo0;b<=lo1;b++){const h=hsh(a*7919+b*104729),la=a*st,lo=b*st;
   if(h<0.22){const p=P2(la+st*0.5,lo+st*0.5);ell(g,night?'rgba(60,110,70,0.25)':'rgba(150,200,140,0.45)',p[0],p[1],st*k*0.32,st*k*0.22);}
   if(h>0.55){const p=P2(la,lo),q=h>0.78?P2(la+st,lo):P2(la,lo+st);g.strokeStyle=night?'#3a404b':'#ffffff';g.lineWidth=1.2;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();}}}
 // tavak
 for(const [la,lo,lk,wk,an] of LAKES){if(Math.abs(la-cur[0])>rad+0.6||Math.abs(lo-cur[1])>(rad+0.8)/c0)continue;const a=an*Math.PI/180;g.fillStyle=col.w;g.beginPath();
  for(let q=0;q<=40;q++){const u=q/40*TAU,ex=Math.cos(u)*lk/2*(1-0.12*Math.sin(u*3)),ey=Math.sin(u)*wk/2;const dx=ex*Math.cos(a)-ey*Math.sin(a),dy=ex*Math.sin(a)+ey*Math.cos(a);const p=P2(la+dy/111,lo+dx/(111*c0));q?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.closePath();g.fill();}
 // utak: a többi szakasz szürke út, az aktuális kék útvonal
 const road=(pts,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>{const q=P2(p[0],p[1]);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.stroke();};
 for(let i=0;i<LEGS.length;i++)if(i!==leg){road(LEGS[i].pts,3.2,col.ro);road(LEGS[i].pts,2,col.r);}
 road(L.pts,4.6,col.ro);road(L.pts,3.4,col.r);
 const ahead=[cur];{const pts=L.pts;let tot=0,d=[];for(let q=1;q<pts.length;q++){const c=Math.cos(pts[q][0]*Math.PI/180),dd=Math.hypot(pts[q][0]-pts[q-1][0],(pts[q][1]-pts[q-1][1])*c);d.push(dd);tot+=dd;}let acc=0;for(let q=1;q<pts.length;q++){acc+=d[q-1];if(acc>=frac*tot)ahead.push(pts[q]);}}
 road(ahead,3.4,col.rt);g.strokeStyle='rgba(255,255,255,0.55)';g.lineWidth=0.6;g.setLineDash([2,3]);g.beginPath();ahead.forEach((p,i)=>{const q=P2(p[0],p[1]);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.stroke();g.setLineDash([]);
 // városok
 for(const [nm,c] of GPSCITY){const q=P2(c[0],c[1]);if(q[0]<r[0]-20||q[0]>r[0]+r[2]+20||q[1]<r[1]-8||q[1]>r[1]+r[3]+8)continue;disc(g,col.dn,q[0],q[1],1.3);disc(g,col.r,q[0],q[1],0.6);
  const w=textW(nm.toUpperCase());frr(g,night?'rgba(20,24,30,0.7)':'rgba(255,255,255,0.75)',q[0]+2,q[1]-4.5,w+3,8,2);text(g,nm,q[0]+3.5,q[1]-3.5,col.tx,1,'left',null);}
 // autó jelölő (mindig felfelé néz, a térkép fordul)
 disc(g,'rgba(47,124,246,0.22)',cx,cy,7+Math.sin(t*0.1)*1.2);g.fillStyle='#ffffff';g.beginPath();g.moveTo(cx,cy-6);g.lineTo(cx+4.6,cy+4.4);g.lineTo(cx,cy+2.2);g.lineTo(cx-4.6,cy+4.4);g.closePath();g.fill();
 g.fillStyle='#2f7cf6';g.beginPath();g.moveTo(cx,cy-4.4);g.lineTo(cx+3.2,cy+3);g.lineTo(cx,cy+1.4);g.lineTo(cx-3.2,cy+3);g.closePath();g.fill();
 // fejléc és lábléc
 frr(g,night?'rgba(14,17,22,0.88)':'rgba(255,255,255,0.9)',r[0],r[1],r[2],11,0);frr(g,'#2f7cf6',r[0]+2,r[1]+1.5,19,8,2);text(g,'GPS',r[0]+11.5,r[1]+3,'#ffffff',1,'center',null);
 const to=L.to.split(' (')[0];text(g,to.length>14?to.slice(0,13)+'.':to,r[0]+24,r[1]+3,col.tx,1,'left',null);
 const eta=kmh>5?remKm/kmh*60:null,ets=eta===null?'--':eta>=60?Math.floor(eta/60)+' Ó '+Math.round(eta%60)+' P':Math.max(1,Math.round(eta))+' P';
 frr(g,night?'rgba(14,17,22,0.88)':'rgba(255,255,255,0.9)',r[0],r[1]+r[3]-11,r[2],11,0);text(g,fmt(remKm,remKm<10?1:0)+' KM',r[0]+4,r[1]+r[3]-8,'#2f7cf6',1,'left',null);text(g,ets,r[0]+r[2]-4,r[1]+r[3]-8,col.tx,1,'right',null);
 // lépték (5 km)
 const sk=5/111*k;line(g,col.tx,r[0]+5,r[1]+r[3]-14,r[0]+5+sk,r[1]+r[3]-14,0.7);line(g,col.tx,r[0]+5,r[1]+r[3]-16,r[0]+5,r[1]+r[3]-13,0.6);line(g,col.tx,r[0]+5+sk,r[1]+r[3]-16,r[0]+5+sk,r[1]+r[3]-13,0.6);text(g,'5 km',r[0]+7+sk,r[1]+r[3]-17,col.tx,1,'left',null);
 g.restore();g.strokeStyle='rgba(255,255,255,0.4)';g.lineWidth=0.8;rrect(g,r[0],r[1],r[2],r[3],7);g.stroke();}
let GPS_HD=null;
