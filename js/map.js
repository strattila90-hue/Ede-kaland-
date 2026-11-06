'use strict';
/* =========================================================
   TÉRKÉP – földrajzilag pontos Európa (Natural Earth), útvonal, pozíció
   ========================================================= */
const MAPVIEW={lat0:40.6,lat1:54.2,lon0:-0.8,lon1:21.2};
function mapProj(v,r){const c=Math.cos((v.lat0+v.lat1)/2*Math.PI/180),sx=r[2]/((v.lon1-v.lon0)*c),sy=r[3]/(v.lat1-v.lat0),k=Math.min(sx,sy);
 const ox=r[0]+(r[2]-(v.lon1-v.lon0)*c*k)/2,oy=r[1]+(r[3]-(v.lat1-v.lat0)*k)/2;return (lat,lon)=>[ox+(lon-v.lon0)*c*k,oy+(v.lat1-lat)*k];}
const MAPCACHE={};
function landImage(r,v,key){const ck=key+'|'+SC;if(MAPCACHE[ck])return MAPCACHE[ck];const [c,g]=mk(r[2],r[3],SC);const pr=mapProj(v,[0,0,r[2],r[3]]);
 g.fillStyle=lg(g,0,0,0,r[3],[[0,'#2f6fb8'],[1,'#24599a']]);g.fillRect(0,0,r[2],r[3]);
 for(const pl of GEO){g.beginPath();for(let i=0;i<pl.length;i+=2){const p=pr(pl[i+1]/20,pl[i]/20);i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.closePath();
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
 for(let i=0;i<=LEGS.length;i++){const c=LIVE_XY[i],q=pr(c[0],c[1]);disc(g,i<=leg?'#ff4d4d':'#ffffff',q[0],q[1],2);if(i<LEGS.length||i===0){const nm=names[i];frr(g,'rgba(10,13,22,0.55)',q[0]+3,q[1]-5,textW(nm)+4,9,2);text(g,nm,q[0]+5,q[1]-4,'#ffffff',1,'left',null);}}
 const cur=legPos(leg,frac),q=pr(cur[0],cur[1]);g.save();g.translate(q[0]-9,q[1]-10);g.scale(0.16,0.16);drawCarSide(g,0,0,0,{t:t,ang:t*0.1,pos:true},null);g.restore();
 g.restore();g.strokeStyle='rgba(255,255,255,0.3)';g.lineWidth=1;rrect(g,r[0],r[1],r[2],r[3],8);g.stroke();
 text(g,'Útiterv - Európa körút',W/2,8,'#ffd84a',1.4,'center');}
