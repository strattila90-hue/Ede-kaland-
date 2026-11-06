'use strict';
/* =========================================================
   GPS – teljes képernyős, interaktív térkép
   húzás = mozgatás, csippentés / görgő / +− = nagyítás,
   Követés = az autó középen, Szakasz / Teljes út = ráközelítés
   ========================================================= */
const GV={open:false,cx:18,cy:54,z:260,follow:true,w:0,h:0,dpr:1,ptrs:{},pinch:null,drag:null,lastTap:0,anim:null,last:0,raf:0,geo:null,ff:'system-ui,sans-serif',wasPaused:false};
const GPS_CC={HU:'Magyarország',AT:'Ausztria',SI:'Szlovénia',HR:'Horvátország',IT:'Olaszország',FR:'Franciaország',ES:'Spanyolország',PT:'Portugália',BE:'Belgium',NL:'Hollandia',DE:'Németország',DK:'Dánia',PL:'Lengyelország',CZ:'Csehország',SK:'Szlovákia',CH:'Svájc'};
const GPS_LAND=[['Magyarország',47.1,19.4],['Ausztria',47.5,14.3],['Szlovénia',46.1,14.8],['Horvátország',45.5,16.2],['Olaszország',42.9,12.5],['Franciaország',46.6,2.4],['Spanyolország',40.2,-3.6],['Portugália',39.7,-8.1],
 ['Belgium',50.6,4.6],['Hollandia',52.3,5.7],['Németország',51.0,10.3],['Dánia',56.0,9.2],['Lengyelország',52.1,19.3],['Csehország',49.8,15.4],['Szlovákia',48.7,19.6],['Svájc',46.8,8.2],['Románia',45.9,24.9],['Szerbia',44.0,20.8],
 ['Bosznia-Hercegovina',44.2,17.8],['Egyesült Királyság',53.0,-1.6],['Írország',53.2,-8.0],['Svédország',57.6,14.8],['Norvégia',60.2,8.8],['Ukrajna',49.2,30.0],['Fehéroroszország',53.5,27.8],['Litvánia',55.3,23.9],['Görögország',39.6,21.9],['Bulgária',42.7,25.3]];
const GPS_ICON={fuel:'⛽',rest:'🅿️',burger:'🍔',garage:'🔧',wash:'🧽',hiper:'🛒',kis:'🏪',trafik:'🗞️',ujsag:'🗞️',town:'🏘️',flag:'🏁'};
const MY=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*180/Math.PI;
const IMY=y=>(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2)*180/Math.PI;
const gpsX=lon=>GV.w/2+(lon-GV.cx)*GV.z,gpsY=my=>GV.h/2-(my-GV.cy)*GV.z;

/* a játék km-e -> földrajzi pont: a városok a saját útszakaszuk közepére esnek */
function gpsAnchors(i){const L=LEGS[i];if(L._anc)return L._anc;const n=L.path.length,km=new Array(n).fill(null);km[0]=0;km[n-1]=L.km;
 const st=[];let acc=0;for(const q of L.segs){st.push(acc);acc+=q[3];}
 let from=1;for(let k=1;k<n-1;k++)for(let j=from;j<L.segs.length-1;j++){const q=L.segs[j];if((q[0]==='town'||q[0]==='village')&&q[1]===L.path[k]){km[k]=st[j]+q[3]/2;from=j+1;break;}}
 const gd=k=>{const a=L.pts[k-1],b=L.pts[k];return Math.hypot(b[0]-a[0],(b[1]-a[1])*Math.cos(b[0]*Math.PI/180));};
 let k=0;while(k<n-1){let j=k+1;while(km[j]===null)j++;if(j>k+1){let tot=0;for(let m=k+1;m<=j;m++)tot+=gd(m);let s=0;for(let m=k+1;m<j;m++){s+=gd(m);km[m]=km[k]+(km[j]-km[k])*(tot?s/tot:(m-k)/(j-k));}}k=j;}
 for(let m=1;m<n;m++)if(km[m]<km[m-1])km[m]=km[m-1];return L._anc=km;}
function gpsPos(i,km){const L=LEGS[i],a=gpsAnchors(i);km=clamp(km,0,L.km);for(let k=1;k<a.length;k++)if(km<=a[k]||k===a.length-1){const u=a[k]>a[k-1]?clamp((km-a[k-1])/(a[k]-a[k-1]),0,1):1;
  return [lerp(L.pts[k-1][0],L.pts[k][0],u),lerp(L.pts[k-1][1],L.pts[k][1],u)];}return L.pts[L.pts.length-1];}
function gpsLive(){return G.state==='play'&&P&&LEG;}
function gpsKm(){if(gpsLive())return legKm();const L=LEGS[G.leg];return G.resume&&G.ts?Math.min(L.km,G.resume/(PXKM/G.ts)):0;}
function gpsCar(){const km=gpsKm(),i=G.leg,p=gpsPos(i,km),a=gpsPos(i,km-1.5),b=gpsPos(i,km+1.5);let hd=Math.atan2((b[1]-a[1]),(MY(b[0])-MY(a[0])));if(!isFinite(hd)||(a[0]===b[0]&&a[1]===b[1]))hd=0;return {lat:p[0],lon:p[1],hd:hd};}
function gpsCountry(i,km){let c='HU';for(let l=0;l<=i;l++){let acc=0;for(const q of LEGS[l].segs){if(l===i&&acc>km)break;if(q[4])c=q[4];acc+=q[3];}}return c;}
function gpsSegName(i,km){let acc=0;for(const q of LEGS[i].segs){if(km<acc+q[3])return q[0]==='motorway'?q[1]+' autópálya':q[1]?q[1]:q[0]==='country'?'Országút':'';acc+=q[3];}return '';}

function gpsGeo(){if(GV.geo&&GV.geoHD===(typeof GEOHD!=='undefined'))return GV.geo;const hd=typeof GEOHD!=='undefined',src=hd?GEOHD:GEO,q=hd?100:20;GV.geoHD=hd;GV.geo=src.map(pl=>{const a=new Float32Array(pl.length);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let i=0;i<pl.length;i+=2){const x=pl[i]/q,y=MY(pl[i+1]/q);a[i]=x;a[i+1]=y;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return {a:a,bb:[x0,y0,x1,y1]};});return GV.geo;}
const gpsZMin=()=>Math.max(6,Math.min(GV.w/44,GV.h/30)),GPS_ZMAX=1800;
function gpsSet(cx,cy,z,anim){z=clamp(z,gpsZMin(),GPS_ZMAX);if(anim){GV.anim={a:[GV.cx,GV.cy,Math.log(GV.z)],b:[cx,cy,Math.log(z)],t0:performance.now()};}else{GV.anim=null;GV.cx=cx;GV.cy=cy;GV.z=z;}}
function gpsPad(){const wide=GV.w>=720;return wide?[340,30,70,70]:[24,GV.h>=520?150:30,70,70];}/* bal, fent, jobb, lent */
function gpsFit(pts,anim){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){const y=MY(p[0]);x0=Math.min(x0,p[1]);x1=Math.max(x1,p[1]);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 const pd=gpsPad(),aw=Math.max(80,GV.w-pd[0]-pd[2]),ah=Math.max(80,GV.h-pd[1]-pd[3]);const z=Math.min(aw/Math.max(0.05,x1-x0),ah/Math.max(0.05,y1-y0));
 const cz=clamp(z,gpsZMin(),GPS_ZMAX);const sx=(pd[0]-pd[2])/2,sy=(pd[1]-pd[3])/2;gpsSet((x0+x1)/2-sx/cz,(y0+y1)/2+sy/cz,cz,anim);}
function gpsOff(){const el=$('gpsInfo');if(!el||GV.w<560)return 0;const r=el.offsetLeft+el.offsetWidth;return r<GV.w*0.6?r/2:0;}/* az autó a kártya melletti szabad rész közepére kerül */
function gpsMode(m){GV.follow=m==='follow';['gpsFollow','gpsLeg','gpsAll'].forEach(id=>$(id).classList.toggle('on',(id==='gpsFollow'&&m==='follow')||(id==='gpsLeg'&&m==='leg')||(id==='gpsAll'&&m==='all')));
 if(m==='follow'){const c=gpsCar(),z=clamp(Math.max(GV.z,200),gpsZMin(),GPS_ZMAX);gpsSet(c.lon-gpsOff()/z,MY(c.lat),z,true);}
 else if(m==='leg')gpsFit(LEGS[G.leg].pts,true);else if(m==='all')gpsFit(LEGS.flatMap(L=>L.pts),true);}
function gpsFree(){if(GV.follow||$('gpsLeg').classList.contains('on')||$('gpsAll').classList.contains('on')){GV.follow=false;['gpsFollow','gpsLeg','gpsAll'].forEach(id=>$(id).classList.remove('on'));}}
function gpsZoomAt(sx,sy,f){GV.anim=null;if(GV.follow){sx=GV.w/2+gpsOff();sy=GV.h/2;}const wx=GV.cx+(sx-GV.w/2)/GV.z,wy=GV.cy-(sy-GV.h/2)/GV.z,nz=clamp(GV.z*f,gpsZMin(),GPS_ZMAX);
 GV.cx=wx-(sx-GV.w/2)/nz;GV.cy=wy+(sy-GV.h/2)/nz;GV.z=nz;}

function gpsZoomBtn(f){const z=clamp(GV.z*f,gpsZMin(),GPS_ZMAX);if(GV.follow){const c=gpsCar();gpsSet(c.lon-gpsOff()/z,MY(c.lat),z,true);}else gpsSet(GV.cx,GV.cy,z,true);}
/* ---------- rajz ---------- */
function gpsDraw(now){const cv2=$('gpsc'),g=cv2.getContext('2d'),w=GV.w,h=GV.h,d=GV.dpr;
 if(GV.anim){const A=GV.anim,u=clamp((now-A.t0)/420,0,1),e=u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;GV.cx=lerp(A.a[0],A.b[0],e);GV.cy=lerp(A.a[1],A.b[1],e);GV.z=Math.exp(lerp(A.a[2],A.b[2],e));if(u>=1)GV.anim=null;}
 else if(GV.follow){const c=gpsCar();GV.cx=c.lon-gpsOff()/GV.z;GV.cy=MY(c.lat);}
 const L=LEGS[G.leg],night=L.time==='night'||L.time==='dusk',z=GV.z;
 const C=night?{w:'#0f2a44',l:'#262a31',b:'rgba(255,255,255,0.16)',r:'#59606e',ro:'#14171c',done:'#e0b43a',rt:'#3b8bff',fut:'rgba(200,210,225,0.55)',tx:'#e6ebf2',halo:'rgba(15,18,24,0.85)',cn:'rgba(200,210,225,0.32)',dot:'#cfd6e0'}
  :{w:'#a9d3f5',l:'#f2efe8',b:'rgba(120,110,100,0.45)',r:'#ffffff',ro:'#c4beb3',done:'#e8a317',rt:'#2f7cf6',fut:'rgba(70,80,95,0.5)',tx:'#262c34',halo:'rgba(255,255,255,0.88)',cn:'rgba(80,80,90,0.32)',dot:'#5d6672'};
 g.setTransform(d,0,0,d,0,0);g.fillStyle=C.w;g.fillRect(0,0,w,h);
 const vx0=GV.cx-w/2/z,vx1=GV.cx+w/2/z,vy0=GV.cy-h/2/z,vy1=GV.cy+h/2/z;
 // szárazföld
 g.fillStyle=C.l;g.strokeStyle=C.b;g.lineWidth=z>300?1.2:0.8;g.lineJoin='round';
 for(const pl of gpsGeo()){const b=pl.bb;if(b[2]<vx0||b[0]>vx1||b[3]<vy0||b[1]>vy1)continue;const a=pl.a;g.beginPath();for(let i=0;i<a.length;i+=2){const x=gpsX(a[i]),y=gpsY(a[i+1]);i?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();g.stroke();}
 // erdők, mellékutak (közelről) – rácshoz kötött, nem villog
 if(z>=420){g.save();g.beginPath();for(const pl of gpsGeo()){const b=pl.bb;if(b[2]<vx0||b[0]>vx1||b[3]<vy0||b[1]>vy1)continue;const a=pl.a;for(let i=0;i<a.length;i+=2){const x=gpsX(a[i]),y=gpsY(a[i+1]);i?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();}g.clip();const st=0.05,lo0=Math.floor(vx0/st),lo1=Math.ceil(vx1/st),la0=Math.floor(IMY(vy0)/st),la1=Math.ceil(IMY(vy1)/st);
  if((lo1-lo0)*(la1-la0)<4000)for(let a=la0;a<=la1;a++)for(let b=lo0;b<=lo1;b++){const hh=hsh(a*7919+b*104729),la=a*st,lo=b*st;
   if(hh<0.22){g.fillStyle=night?'rgba(60,110,70,0.28)':'rgba(150,200,140,0.5)';g.beginPath();g.ellipse(gpsX(lo+st/2),gpsY(MY(la+st/2)),st*z*0.33,st*z*0.22,0,0,TAU);g.fill();}
   if(hh>0.6){const q=hh>0.8?[la+st,lo]:[la,lo+st];g.strokeStyle=night?'#3a404b':'#ffffff';g.lineWidth=1.6;g.beginPath();g.moveTo(gpsX(lo),gpsY(MY(la)));g.lineTo(gpsX(q[1]),gpsY(MY(q[0])));g.stroke();}}g.restore();}
 // tavak
 if(z>=60)for(const [la,lo,lk,wk,an] of LAKES){const a=an*Math.PI/180,c0=Math.cos(la*Math.PI/180);g.fillStyle=C.w;g.beginPath();
  for(let q=0;q<=40;q++){const u=q/40*TAU,ex=Math.cos(u)*lk/2*(1-0.12*Math.sin(u*3)),ey=Math.sin(u)*wk/2;const dx=ex*Math.cos(a)-ey*Math.sin(a),dy=ex*Math.sin(a)+ey*Math.cos(a);const x=gpsX(lo+dx/(111*c0)),y=gpsY(MY(la+dy/111));q?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();}
 // Velence szigete a lagúnában
 if(z>=60){const [la,lo,lk,wk,an]=[45.437,12.334,5.2,2.4,-25],a=an*Math.PI/180,c0=Math.cos(la*Math.PI/180);g.fillStyle=C.l;g.beginPath();
  for(let q=0;q<=24;q++){const u=q/24*TAU,ex=Math.cos(u)*lk/2,ey=Math.sin(u)*wk/2*(1+0.25*Math.sin(u*2));const dx=ex*Math.cos(a)-ey*Math.sin(a),dy=ex*Math.sin(a)+ey*Math.cos(a);const x=gpsX(lo+dx/(111*c0)),y=gpsY(MY(la+dy/111));q?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();g.strokeStyle=C.b;g.stroke();}
 // országnevek
 if(z<260){g.textAlign='center';g.textBaseline='middle';g.font='italic 600 '+(z<40?11:13)+'px '+GV.ff;g.fillStyle=C.cn;for(const [n,la,lo] of GPS_LAND){const x=gpsX(lo),y=gpsY(MY(la));if(x>-80&&x<w+80&&y>-20&&y<h+20)g.fillText(n.toUpperCase(),x,y);}}
 // útvonal
 const km=gpsKm(),car=gpsCar(),lw=clamp(z/40,2.2,7);
 const poly=(pts,wd,col,dash)=>{if(pts.length<2)return;g.strokeStyle=col;g.lineWidth=wd;g.lineCap='round';g.lineJoin='round';g.setLineDash(dash||[]);g.beginPath();pts.forEach((p,k)=>{const x=gpsX(p[1]),y=gpsY(MY(p[0]));k?g.lineTo(x,y):g.moveTo(x,y);});g.stroke();g.setLineDash([]);};
 for(let i=0;i<LEGS.length;i++){if(i===G.leg)continue;const pts=LEGS[i].pts;poly(pts,lw+2.4,C.ro);if(i<G.leg){poly(pts,lw,C.done);}else{poly(pts,lw,C.r);poly(pts,Math.max(1.2,lw*0.4),C.fut,[lw*1.6,lw*1.8]);}}
 {const a=gpsAnchors(G.leg),pts=L.pts,done=[pts[0]],ahead=[[car.lat,car.lon]];for(let k=1;k<pts.length;k++){if(a[k]<=km)done.push(pts[k]);else ahead.push(pts[k]);}done.push([car.lat,car.lon]);
  poly(pts,lw+3.4,C.ro);poly(done,lw+1,C.done);poly(ahead,lw+1.4,C.rt);if(z>=120)poly(ahead,1,'rgba(255,255,255,0.7)',[3,5]);}
 // megállók az aktuális szakaszon (közelről)
 const occ=[];const free=(x,y,ww,hh)=>{for(const o of occ)if(x<o[0]+o[2]&&x+ww>o[0]&&y<o[1]+o[3]&&y+hh>o[1])return false;occ.push([x,y,ww,hh]);return true;};
 if(z>=320&&gpsLive()){const seen={};g.textAlign='center';g.textBaseline='middle';g.font='13px '+GV.ff;for(const p of LEG.pois){if(p.type==='veda'||!GPS_ICON[p.type])continue;const pk=p.x*LEG.kmPerPx;if(pk<km-0.3)continue;
  const q=gpsPos(G.leg,pk),x=gpsX(q[1]),y=gpsY(MY(q[0]));if(x<-20||x>w+20||y<-20||y>h+20)continue;const key=Math.round(x/22)+'|'+Math.round(y/22);if(seen[key])continue;seen[key]=1;
  g.fillStyle='rgba(0,0,0,0.25)';g.beginPath();g.arc(x,y+1.5,10,0,TAU);g.fill();g.fillStyle='#ffffff';g.beginPath();g.arc(x,y,10,0,TAU);g.fill();g.strokeStyle=C.rt;g.lineWidth=1.6;g.stroke();g.fillStyle='#000';g.fillText(GPS_ICON[p.type],x,y+0.5);occ.push([x-10,y-10,20,20]);}}
 // városok
 const ends=new Set(LEGS.flatMap(L2=>[L2.from.split(',')[0],L2.to.split(' (')[0]])),onRoute=new Set(LEGS.flatMap(L2=>L2.path));
 const list=[];for(const nm in GEOC){const rk=ends.has(nm)?0:onRoute.has(nm)?1:2;if(rk===1&&z<45||rk===2&&z<150)continue;const c=GEOC[nm],x=gpsX(c[1]),y=gpsY(MY(c[0]));if(x<-60||x>w+60||y<-20||y>h+20)continue;list.push([rk,nm,x,y]);}
 list.sort((a,b)=>a[0]-b[0]);g.textBaseline='middle';g.textAlign='left';
 // a cél és az autó helye ne takarodjon
 const cxs=gpsX(car.lon),cys=gpsY(MY(car.lat));occ.push([cxs-14,cys-14,28,28]);{const e=L.pts[L.pts.length-1],x=gpsX(e[1]),y=gpsY(MY(e[0]));occ.push([x-1,y-22,16,16]);}
 for(const [rk,nm,x,y] of list){const r0=rk===0?4.2:rk===1?3.2:2.4;g.fillStyle=C.halo;g.beginPath();g.arc(x,y,r0+1.6,0,TAU);g.fill();g.fillStyle=rk===0?(night?'#ffffff':'#1d232b'):C.dot;g.beginPath();g.arc(x,y,r0,0,TAU);g.fill();
  const fs=rk===0?(z<40?12:14):rk===1?12:11;g.font=(rk===0?'800 ':'600 ')+fs+'px '+GV.ff;const tw=g.measureText(nm).width;
  let lx=x+r0+4,ok=free(lx-2,y-fs/2-2,tw+4,fs+4);if(!ok){lx=x-r0-4-tw;ok=free(lx-2,y-fs/2-2,tw+4,fs+4);}if(!ok)continue;
  g.lineWidth=3.2;g.strokeStyle=C.halo;g.lineJoin='round';g.strokeText(nm,lx,y);g.fillStyle=C.tx;g.fillText(nm,lx,y);}
 // úti cél zászló
 {const e=L.pts[L.pts.length-1],x=gpsX(e[1]),y=gpsY(MY(e[0]));g.strokeStyle=C.tx;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-20);g.stroke();
  for(let i=0;i<4;i++)for(let j=0;j<3;j++){g.fillStyle=(i+j)%2?'#ffffff':'#111';g.fillRect(x+i*3.5,y-20+j*3.5,3.5,3.5);}}
 // autó
 {const pr=(now/900)%1;g.fillStyle='rgba(47,124,246,'+(0.35*(1-pr)).toFixed(3)+')';g.beginPath();g.arc(cxs,cys,10+pr*22,0,TAU);g.fill();
  g.save();g.translate(cxs,cys);g.rotate(car.hd);g.fillStyle='rgba(0,0,0,0.25)';g.beginPath();g.moveTo(0,-12);g.lineTo(9.5,10.5);g.lineTo(0,6);g.lineTo(-9.5,10.5);g.closePath();g.translate(0,2);g.fill();g.translate(0,-2);
  g.fillStyle='#ffffff';g.beginPath();g.moveTo(0,-13);g.lineTo(10,11);g.lineTo(0,6.5);g.lineTo(-10,11);g.closePath();g.fill();g.fillStyle='#2f7cf6';g.beginPath();g.moveTo(0,-9.5);g.lineTo(7,8);g.lineTo(0,4.4);g.lineTo(-7,8);g.closePath();g.fill();g.restore();}
 // lépték + észak
 {const lat=IMY(GV.cy),kpp=111.32*Math.cos(lat*Math.PI/180)/z;let s=1;for(const v of [0.5,1,2,5,10,20,50,100,200,500,1000])if(v/kpp<=110)s=v;const px=s/kpp,x=14+(GV.sl||0),y=h-18-(GV.sb||0);
  g.fillStyle=C.halo;g.fillRect(x-6,y-20,px+56,28);g.strokeStyle=C.tx;g.lineWidth=2;g.beginPath();g.moveTo(x,y-5);g.lineTo(x,y);g.lineTo(x+px,y);g.lineTo(x+px,y-5);g.stroke();
  g.font='700 12px '+GV.ff;g.fillStyle=C.tx;g.textAlign='left';g.textBaseline='alphabetic';g.fillText((s<1?fmt(s*1000)+' m':fmt(s)+' km'),x+px+6,y+1);
  g.textAlign='center';g.font='800 10px '+GV.ff;g.fillText('É ▲',x+px/2,y-8);}
 }
function gpsLoop(now){if(!GV.open)return;GV.raf=requestAnimationFrame(gpsLoop);if(now-GV.last<(GV.anim||GV.drag||GV.pinch?14:40))return;GV.last=now;try{gpsDraw(now);}catch(e){console.error(e);}}
function gpsResize(){const el=$('gpsv'),c=$('gpsc');GV.w=el.clientWidth||innerWidth;GV.h=el.clientHeight||innerHeight;GV.dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(GV.w*GV.dpr);c.height=Math.round(GV.h*GV.dpr);
 const cs=getComputedStyle(document.documentElement);GV.sl=parseFloat(cs.getPropertyValue('--sl'))||0;GV.sb=parseFloat(cs.getPropertyValue('--sb'))||0;GV.ff=(cs.getPropertyValue('--ff')||'').trim()||'system-ui,sans-serif';GV.z=clamp(GV.z,gpsZMin(),GPS_ZMAX);}

/* ---------- információs kártya ---------- */
function gpsEta(rem){const v=gpsLive()?Math.abs(P.kmh||0):0,sp=v>=15?v:85,m=rem/sp*60;return (v<15?'kb. ':'')+(m>=60?Math.floor(m/60)+' ó '+Math.round(m%60)+' p':Math.max(1,Math.round(m))+' p');}
function gpsInfo(){const L=LEGS[G.leg],km=gpsKm(),rem=Math.max(0,L.km-km),tot=LEGS.reduce((a,l)=>a+l.km,0),done=LEGS.slice(0,G.leg).reduce((a,l)=>a+l.km,0)+km,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
 const from=L.from.split(',')[0],to=L.to.split(' (')[0],cc=gpsCountry(G.leg,km),sn=gpsSegName(G.leg,km);
 const it=[];if(gpsLive()){const seen={},front=P.dist+112;for(const p of LEG.pois){if(p.type==='veda'||seen[p.type]||!GPS_ICON[p.type])continue;const d=(p.x-front)*LEG.kmPerPx;if(d<0.05)continue;seen[p.type]=1;it.push({i:GPS_ICON[p.type],n:POI_NAME[p.type],d:d,k:p.x*LEG.kmPerPx});}}
 const a=gpsAnchors(G.leg);let nt=0;for(let k=1;k<L.path.length-1&&nt<2;k++)if(a[k]>km+0.2){it.push({i:GPS_ICON.town,n:L.path[k],d:a[k]-km,k:a[k]});nt++;}
 it.sort((x,y)=>x.d-y.d);const li=it.slice(0,6);li.push({i:GPS_ICON.flag,n:to,d:rem,k:L.km});
 const fd=d=>d<1?fmt(Math.round(d*1000/10)*10)+' m':fmt(d,d<10?1:0)+' km';
 $('gpsInfo').innerHTML='<div class="rt">'+esc(from)+' → '+esc(to)+'</div><div class="mut">'+esc((sn?sn+' · ':'')+(GPS_CC[cc]||cc))+'</div>'
  +'<div class="bar"><i style="width:'+(km/L.km*100).toFixed(1)+'%"></i></div>'
  +'<div class="row"><span>Megtett <b>'+fmt(km,km<100?1:0)+' km</b></span><span>Hátra <b class="big">'+fmt(rem,rem<100?1:0)+' km</b></span></div>'
  +'<div class="row"><span>'+(gpsLive()?Math.round(Math.abs(P.kmh||0))+' km/h':'Indulásra kész')+'</span><span>Érkezés: <b>'+gpsEta(rem)+'</b></span></div>'
  +'<div class="row mut" style="margin-top:4px;white-space:nowrap"><span>'+(G.leg+1)+'/'+LEGS.length+'. szakasz</span><span>Össz: '+fmt(done)+' / '+fmt(tot)+' km</span></div>'
  +'<div class="bar" style="height:4px"><i style="width:'+(done/tot*100).toFixed(1)+'%;background:#e8a317"></i></div>'
  +'<div class="tg">Következő megállók ▾</div><ul>'+li.map((x,n)=>'<li data-k="'+x.k.toFixed(3)+'"><span>'+x.i+' '+esc(x.n)+'</span><b>'+fd(x.d)+'</b></li>').join('')+'</ul>';
 $('gpsInfo').querySelectorAll('li').forEach(el=>el.addEventListener('click',()=>{const q=gpsPos(G.leg,+el.dataset.k);gpsFree();gpsSet(q[1],MY(q[0]),Math.max(GV.z,420),true);haptic(10);}));
 const tg=$('gpsInfo').querySelector('.tg');tg.addEventListener('click',()=>{$('gpsInfo').classList.toggle('full');tg.textContent='Következő megállók '+($('gpsInfo').classList.contains('full')?'▴':'▾');});}

/* ---------- megnyitás / bezárás ---------- */
function openGPS(){if(!document.getElementById('gpsv')||GV.open||typeof GEO==='undefined'||!G.trip)return;if(G.state==='play'){if(!P||!LEG)return;GV.wasPaused=!!G.paused;G.paused=true;}else if(G.state!=='map')return;GV.open=true;G.gps=true;K.gas=K.brake=false;
 const el=$('gpsv'),L=LEGS[G.leg];el.classList.toggle('night',L.time==='night'||L.time==='dusk');el.classList.add('open');gpsResize();gpsInfo();
 if(G.state==='map'){gpsMode('leg');GV.anim=null;gpsFit(LEGS[G.leg].pts,false);}else{GV.follow=true;gpsMode('follow');GV.anim=null;const c=gpsCar();GV.cx=c.lon-gpsOff()/GV.z;GV.cy=MY(c.lat);}
 if(SFX&&SFX.click)SFX.click();haptic(12);MENU_SIG='?';GV.last=0;cancelAnimationFrame(GV.raf);GV.raf=requestAnimationFrame(gpsLoop);}
function closeGPS(){if(!GV.open)return;GV.open=false;cancelAnimationFrame(GV.raf);$('gpsv').classList.remove('open');GV.ptrs={};GV.pinch=GV.drag=null;G.gps=false;
 if(!GV.wasPaused&&G.state==='play')G.paused=false;GV.wasPaused=false;K.gas=K.brake=false;TAP=TAPD=HOLD=null;haptic(10);MENU_SIG='?';}
{const el=$('gpsv'),c=$('gpsc');
 ['pointerdown','touchstart','mousedown'].forEach(ev=>el.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
 const pt=e=>{const r=c.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 c.addEventListener('pointerdown',e=>{e.preventDefault();try{c.setPointerCapture(e.pointerId);}catch(_){}GV.ptrs[e.pointerId]=pt(e);const ids=Object.keys(GV.ptrs);GV.anim=null;
  if(ids.length===1){const p=GV.ptrs[ids[0]];GV.drag={x:p.x,y:p.y,sx:p.x,sy:p.y,t:performance.now(),moved:false};GV.pinch=null;}
  else if(ids.length===2){const a=GV.ptrs[ids[0]],b=GV.ptrs[ids[1]];GV.pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};GV.drag=null;}});
 c.addEventListener('pointermove',e=>{if(!GV.ptrs[e.pointerId])return;GV.ptrs[e.pointerId]=pt(e);const ids=Object.keys(GV.ptrs);
  if(GV.pinch&&ids.length>=2){const a=GV.ptrs[ids[0]],b=GV.ptrs[ids[1]],dd=Math.hypot(a.x-b.x,a.y-b.y)||1,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;gpsZoomAt(mx,my,dd/GV.pinch.d);
   if(!GV.follow){GV.cx-=(mx-GV.pinch.mx)/GV.z;GV.cy+=(my-GV.pinch.my)/GV.z;}GV.pinch={d:dd,mx:mx,my:my};}
  else if(GV.drag){const p=GV.ptrs[e.pointerId];if(!GV.drag.moved&&Math.hypot(p.x-GV.drag.sx,p.y-GV.drag.sy)>6){GV.drag.moved=true;gpsFree();}
   if(GV.drag.moved){GV.cx-=(p.x-GV.drag.x)/GV.z;GV.cy+=(p.y-GV.drag.y)/GV.z;}GV.drag.x=p.x;GV.drag.y=p.y;}});
 const up=e=>{if(!GV.ptrs[e.pointerId])return;const p=GV.ptrs[e.pointerId];delete GV.ptrs[e.pointerId];
  if(GV.drag&&!GV.drag.moved){const now=performance.now();if(now-GV.lastTap<320){gpsZoomAt(p.x,p.y,2);GV.lastTap=0;}else GV.lastTap=now;}
  const ids=Object.keys(GV.ptrs);if(ids.length===1){const q=GV.ptrs[ids[0]];GV.drag={x:q.x,y:q.y,sx:q.x,sy:q.y,moved:true};GV.pinch=null;}else if(!ids.length){GV.drag=null;GV.pinch=null;}};
 c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 c.addEventListener('wheel',e=>{e.preventDefault();const p=pt(e);gpsZoomAt(p.x,p.y,Math.exp(-clamp(e.deltaY,-120,120)*0.0022));},{passive:false});
 const tb=(id,fn)=>$(id).addEventListener('click',e=>{e.stopPropagation();fn();haptic(10);});
 tb('gpsClose',closeGPS);tb('gpsIn',()=>gpsZoomBtn(1.8));tb('gpsOut',()=>gpsZoomBtn(1/1.8));
 tb('gpsFollow',()=>gpsMode('follow'));tb('gpsLeg',()=>gpsMode('leg'));tb('gpsAll',()=>gpsMode('all'));
 window.addEventListener('resize',()=>{if(GV.open)gpsResize();});
 window.addEventListener('keydown',e=>{if(!GV.open)return;const k=e.key;e.stopImmediatePropagation();
  if(k==='Escape'||k==='g'||k==='G'||k==='p'||k==='P')closeGPS();else if(k==='+'||k==='=')gpsZoomBtn(1.8);else if(k==='-')gpsZoomBtn(1/1.8);
  else if(k==='ArrowLeft'||k==='ArrowRight'||k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();gpsFree();const s=90/GV.z;if(k==='ArrowLeft')GV.cx-=s;if(k==='ArrowRight')GV.cx+=s;if(k==='ArrowUp')GV.cy+=s;if(k==='ArrowDown')GV.cy-=s;}
  else if(k==='f'||k==='F')gpsMode('follow');},true);}
