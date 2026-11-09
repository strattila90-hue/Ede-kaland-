'use strict';
/* ---------- RONCSOLÓ MŰHELY (Apa garázsa, a törésteszt csarnokában) ----------
   Az üres autó (a bábukat kivették) egyetlen képbe van rajzolva (WK.dc); minden sérülés egy művelet (WK.ops),
   amit erre a képre rajzolunk: horpadás (dent), lyuk szakadt szélekkel (hole), vágás (cut), hőszíneződés (tint),
   kormos égésnyom (scorch), repedt / betört üveg (glass), préselési redő (crease), leszakadt rész helye (det).
   A műveletlistából a kép bármikor újraépíthető (felbontásváltás).
   Az autó 5 részre van osztva (eleje, hátulja, tető, két ajtó) + 2 kerék; ha egy rész életereje elfogy,
   töredezett széllel leszakad, és külön darabként leesik.
   Olvadás: az izzó foltok (WK.hot) hőmérséklete T; 1 fölött a fém megolvad, lyuk nő, izzó cseppek hullanak a padlóra (tócsa).
   Koordináták: autó-helyi (u,v): az autó 0..112 széles, a padló v=55.5; a képernyőn CTS*WK_Z nagyítással. */
const WK_TOOLS=[
 {k:'hammer',n:'Kalapács',ic:'🔨',tip:'Koppints az autóra: horpadás, sokadik ütésre szakad. Az ablak betörik.'},
 {k:'ball',n:'Bontógolyó',ic:'⚫',tip:'Koppints oda, ahová a lengő bontógolyó csapódjon.'},
 {k:'cannon',n:'Ágyú',ic:'🎯',tip:'Koppints: az acélgolyó átlyukasztja a lemezt.'},
 {k:'flex',n:'Flex',ic:'⚙',tip:'Tartsd az ujjad az autón és húzd: a vágókorong szikrázva átvágja a fémet.'},
 {k:'torch',n:'Lángvágó',ic:'🔥',tip:'Tartsd egy helyen: a fém felizzik, megolvad, és lecsöpög.'},
 {k:'laser',n:'Lézer',ic:'🔴',tip:'Tartsd és húzd: a lézer izzó vágást hagy, és olvasztja a fémet.'},
 {k:'press',n:'Prés',ic:'🗜',tip:'Koppints: a hidraulikus prés lenyomja az autót. Újabb koppintás: felemeli.'},
 {k:'bomb',n:'Robbantás',ic:'🧨',tip:'Koppints az autóra: a töltet 1,5 másodperc múlva felrobban.'},
 {k:'pistol',n:'Pisztoly',ic:'🔫',tip:'Koppints: golyó üt lyukat a lemezen, az üveg megpókhálósodik, a gumi kidurran.'},
 {k:'shotgun',n:'Sörétes',ic:'💥',tip:'Koppints: a sörétek egy csomóban sok kis lyukat ütnek.'},
 {k:'mg',n:'Géppuska',ic:'⚡',tip:'Tartsd az ujjad az autón és húzd: sorozatlövés.'}];
/* tartályok (autó-helyi u,v): sérüléskor szivárognak, a cseppekből tócsa lesz; a benzin meggyulladhat */
const WK_RES=[['oil','a motorolaj',100,44,1],['cool','a hűtőfolyadék',108,36,1],['brake','a fékfolyadék',90,30,0.5],['wash','az ablakmosó-folyadék',104,32,0.7],['gear','a váltóolaj',84,46,0.7],['fuel','a benzin',42,45,1.6]];
const WK_FLC={oil:'rgba(38,26,14,0.92)',cool:'rgba(60,200,90,0.8)',brake:'rgba(200,170,60,0.8)',wash:'rgba(70,140,240,0.75)',gear:'rgba(130,45,30,0.85)',fuel:'rgba(215,205,130,0.55)'};
const WK_HOLDT={flex:1,torch:1,laser:1,mg:1};
const WK_Z=1.6,WK_OX=8,WK_OY=10,WK_DW=128,WK_DH=66,WK_CX=0;
let WK=null;
const wkBy=()=>CTF-55.5;
const wkCam=()=>WK_CX+56-(W*0.63)/(CTS*WK_Z);
function wkRand(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
/* téglalap töredezett élekkel (a szakadás vonala) */
function wkJag(pts,seed,amp){const r=wkRand(seed),o=[];
 for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(2,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/3.5)),nx=-(b[1]-a[1]),ny=b[0]-a[0],l=Math.hypot(nx,ny)||1;
  for(let k=0;k<n;k++){const t=k/n,j=k===0?0:(r()*2-1)*amp;o.push([a[0]+(b[0]-a[0])*t+nx/l*j,a[1]+(b[1]-a[1])*t+ny/l*j]);}}return o;}
function wkPartsNew(){const P=[['front','az autó eleje',130,[[92,-4],[118,-4],[118,54],[92,54]]],['rear','az autó hátulja',120,[[-4,-4],[16,-4],[16,54],[-4,54]]],
  ['roof','a tető',100,[[16,-4],[92,-4],[92,12.6],[16,12.6]]],['doorL','a hátsó ajtó',90,[[16,12.6],[54,12.6],[54,54],[16,54]]],['doorR','az első ajtó',90,[[54,12.6],[92,12.6],[92,54],[54,54]]]];
 return P.map((q,i)=>({k:q[0],n:q[1],hp:q[2],h:q[2],gone:false,r:q[3],p:wkJag(q[3],31+i*7,1.7)}));}
function startWreck(home){if(!CT)startCrash();CT.dest=true;CT.wkHome=!!home;CT.cfg=false;CT.parts=[];
 WK={tool:clamp(PROF.wkTool|0,0,WK_TOOLS.length-1),ops:[],parts:wkPartsNew(),wh:[{x:WHEELS[0],h:60,flat:false,gone:false,air:1,leak:0,susp:0},{x:WHEELS[1],h:60,flat:false,gone:false,air:1,leak:0,susp:0}],res:WK_RES.map(r=>({k:r[0],n:r[1],u:r[2],v:r[3],amt:r[4],leak:0})),fp:[],
  hot:[],pud:[],pcs:[],holes:[],ps:[],tr:[],gun:null,hits:{},sq:0,press:null,act:null,cost:0,shake:0,flash:0,prev:null,t:0,sag:0,tilt:0,msg:null,dc:null,lost:0,sfx:0};
 engine(0,0);MENU_SIG='?';elog('info','Roncsoló műhely');}
function wkMenu(){const it=WK_TOOLS.map((t,i)=>({a:'wk'+i,l:t.n,ic:t.ic,c:i===WK.tool?'primary':''}));it.push({a:'wknew',l:'Új autó',ic:'🚗'},{a:'wkback',l:'Vissza',ic:'◀'});return {cls:'ctside',items:it};}
function wkAction(a){if(a==='wknew'){const t=WK.tool;startWreck(CT.wkHome);WK.tool=t;toast('Új autó a műhelyben.');}
 else if(a==='wkback'){CT.dest=false;WK=null;CT.parts=[];ctReset();if(CT.wkHome){G.state='title';G.st=0;}}
 else{const i=+a.slice(2);if(i>=0&&i<WK_TOOLS.length){WK.tool=i;PROF.wkTool=i;saveProf();toast(WK_TOOLS[i].tip,3200);}}
 MENU_SIG='?';}
/* ---- koordináták ---- */
function wkLoc(p){const k=CTS*WK_Z,wx=p.x/k+wkCam(),wy=(p.y-CTF*CTS)/k+CTF,s=WK.sq;let v=wy-(wkBy()+WK.sag);v=(v+WK_OY-WK_DH*s)/(1-s)-WK_OY;return {u:wx-WK_CX,v:v,wx:wx,wy:wy};}
const wkV=v=>-WK_OY+WK_DH*WK.sq+(v+WK_OY)*(1-WK.sq);           // helyi v -> a (préselt) képen
const wkWX=u=>WK_CX+u,wkWY=v=>wkBy()+WK.sag+wkV(v);              // helyi -> világ
function wkIn(pts,x,y){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
const wkGlass=(u,v)=>v>13.2&&v<26.6&&u>8&&(u<61||(v-13)>(u-61)*0.47)&&u<92;
function wkGone(u,v){for(const p of WK.parts)if(p.gone&&wkIn(p.p,u,v))return true;return false;}
function wkOn(u,v){if(u<1.5||u>111.5||v<2.5||v>49)return false;if(wkGone(u,v))return false;
 for(const h of WK.holes)if((u-h.u)*(u-h.u)+(v-h.v)*(v-h.v)<h.r*h.r*0.7)return false;
 for(const x of WHEELS)if((u-x)*(u-x)+(v-WCY)*(v-WCY)<ARCH*ARCH&&v>WCY-ARCH*0.6)return false;return true;}
function wkWheelAt(u,v,rad){for(const w of WK.wh)if(!w.gone&&Math.hypot(u-w.x,v-WCY)<WR+(rad||1.5))return w;return null;}
/* ---- a sérült autó képe ---- */
function wkPath(g,pts){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();}
function wkDC(){if(WK.dc&&WK.dc.sc===SC)return WK.dc;const [c,g]=mk(WK_DW,WK_DH,CTS*WK_Z*SC);g.translate(WK_OX,WK_OY);
 drawCarSide(g,0,0,0,{t:0,live:true,noWheels:true,hide:{apa:1,anya:1,anna:1,petra:1,atti:1},inner:()=>{},spd:0},null);
 for(const op of WK.ops)wkOp(g,op);WK.dc={c:c,g:g,sc:SC};return WK.dc;}
function wkDo(op){op.s=op.s||((Math.random()*1e9)|0);WK.ops.push(op);if(WK.dc&&WK.dc.sc===SC)wkOp(WK.dc.g,op);}
function wkOp(g,o){const R=wkRand(o.s);g.save();
 if(o.k==='dent'){g.globalCompositeOperation='source-atop';const gr=g.createRadialGradient(o.u-o.r*0.25,o.v-o.r*0.2,0,o.u,o.v,o.r);
  gr.addColorStop(0,'rgba(0,0,0,'+(0.5*o.a).toFixed(2)+')');gr.addColorStop(0.5,'rgba(0,0,0,'+(0.2*o.a).toFixed(2)+')');gr.addColorStop(0.78,'rgba(255,255,255,'+(0.25*o.a).toFixed(2)+')');gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr;g.beginPath();g.arc(o.u,o.v,o.r,0,TAU);g.fill();
  /* 3D-s hatás: a gödör felső szélén fény, alsó szélén árnyék */g.lineWidth=o.r*0.13;g.strokeStyle='rgba(255,255,255,'+(0.35*o.a).toFixed(2)+')';g.beginPath();g.arc(o.u,o.v,o.r*0.8,3.6,5.4);g.stroke();g.strokeStyle='rgba(0,0,0,'+(0.4*o.a).toFixed(2)+')';g.beginPath();g.arc(o.u,o.v,o.r*0.8,0.5,2.2);g.stroke();
  g.strokeStyle='rgba(10,12,16,'+(0.55*o.a).toFixed(2)+')';g.lineWidth=0.35+o.r*0.02;g.beginPath();
  for(let i=0;i<5;i++){const a=R()*TAU,l=o.r*(0.55+R()*0.4);g.moveTo(o.u+Math.cos(a)*o.r*0.15,o.v+Math.sin(a)*o.r*0.15);g.lineTo(o.u+Math.cos(a+0.35)*l*0.55,o.v+Math.sin(a+0.35)*l*0.55);g.lineTo(o.u+Math.cos(a)*l,o.v+Math.sin(a)*l);}g.stroke();}
 else if(o.k==='hole'){const n=9+((o.r*2)|0),pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,rr=o.r*(o.hot?0.85+R()*0.25:0.55+R()*0.65);pts.push([o.u+Math.cos(a)*rr,o.v+Math.sin(a)*rr]);}
  g.globalCompositeOperation='source-atop';g.fillStyle=o.hot?'rgba(60,40,35,0.8)':'rgba(22,25,30,0.85)';wkPath(g,pts.map(p=>[o.u+(p[0]-o.u)*1.3,o.v+(p[1]-o.v)*1.3]));g.fill();
  if(!o.hot){g.fillStyle='rgba(225,232,240,0.6)';for(let i=0;i<n;i+=2){const p=pts[i],a=Math.atan2(p[1]-o.v,p[0]-o.u);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]+Math.cos(a+0.6)*o.r*0.4,p[1]+Math.sin(a+0.6)*o.r*0.4);g.lineTo(p[0]+Math.cos(a-0.25)*o.r*0.5,p[1]+Math.sin(a-0.25)*o.r*0.5);g.closePath();g.fill();}}
  g.globalCompositeOperation='destination-out';g.fillStyle='#000';wkPath(g,pts);g.fill();}
 else if(o.k==='cut'){g.lineCap='round';g.globalCompositeOperation='source-atop';g.strokeStyle=o.hot?'rgba(70,55,120,0.4)':'rgba(18,20,24,0.75)';g.lineWidth=o.w+(o.hot?3.2:1.1);
  g.beginPath();g.moveTo(o.u0,o.v0);g.lineTo(o.u1,o.v1);g.stroke();g.globalCompositeOperation='destination-out';g.lineWidth=o.w;g.stroke();}
 else if(o.k==='tint'||o.k==='scorch'){g.globalCompositeOperation='source-atop';const gr=g.createRadialGradient(o.u,o.v,0,o.u,o.v,o.r);
  if(o.k==='tint'){gr.addColorStop(0,'rgba(45,30,25,0.6)');gr.addColorStop(0.45,'rgba(70,60,150,0.38)');gr.addColorStop(0.75,'rgba(200,155,70,0.28)');gr.addColorStop(1,'rgba(200,155,70,0)');}
  else{gr.addColorStop(0,'rgba(8,8,8,0.92)');gr.addColorStop(0.6,'rgba(25,20,18,0.6)');gr.addColorStop(1,'rgba(25,20,18,0)');}
  g.fillStyle=gr;g.beginPath();g.arc(o.u,o.v,o.r,0,TAU);g.fill();}
 else if(o.k==='glass'){glassPath(g);g.clip();
  if(o.br){g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,0.85)';const n=12,pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,rr=o.r*(0.6+R()*0.5);pts.push([o.u+Math.cos(a)*rr,o.v+Math.sin(a)*rr]);}wkPath(g,pts);g.fill();g.globalCompositeOperation='source-over';}
  g.strokeStyle='rgba(235,245,255,0.8)';g.lineWidth=0.3;g.beginPath();
  for(let i=0;i<9;i++){let a=R()*TAU,x=o.u,y=o.v;g.moveTo(x,y);for(let j=0;j<3;j++){a+=(R()-0.5)*0.6;const l=o.r*(0.4+R()*0.5);x+=Math.cos(a)*l;y+=Math.sin(a)*l;g.lineTo(x,y);}}
  for(let j=1;j<3;j++){const rr=o.r*0.45*j;for(let i=0;i<5;i++){const a=R()*TAU;g.moveTo(o.u+Math.cos(a)*rr,o.v+Math.sin(a)*rr);g.arc(o.u,o.v,rr,a,a+0.5+R()*0.6);}}g.stroke();}
 else if(o.k==='crush'){const rx=o.r*(o.nx?0.6:1.25),ry=o.r*(o.ny?0.5:1.1),cx=o.u+o.nx*rx*0.7,cy=o.v+o.ny*ry*0.7;
  g.globalCompositeOperation='destination-out';g.fillStyle='#000';g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,TAU);g.fill();
  g.globalCompositeOperation='source-atop';g.strokeStyle='rgba(12,14,18,0.85)';g.lineWidth=1.2;g.beginPath();g.ellipse(cx,cy,rx+0.5,ry+0.5,0,0,TAU);g.stroke();
  g.strokeStyle='rgba(255,255,255,0.3)';g.lineWidth=0.4;g.beginPath();g.ellipse(cx,cy,rx+1.6,ry+1.6,0,0,TAU);g.stroke();
  g.strokeStyle='rgba(12,14,18,0.55)';g.lineWidth=0.4;g.beginPath();for(let i=0;i<7;i++){const a=R()*TAU,r0=Math.max(rx,ry)+1,l=o.r*(0.4+R()*0.7);g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);g.lineTo(cx+Math.cos(a+0.12)*(r0+l),cy+Math.sin(a+0.12)*(r0+l));}g.stroke();}
 else if(o.k==='bullet'){g.globalCompositeOperation='source-atop';const r=o.r;disc(g,'rgba(28,28,30,0.85)',o.u,o.v,r*2.1);
  g.strokeStyle='rgba(205,210,218,0.85)';g.lineWidth=r*0.7;g.beginPath();g.arc(o.u,o.v,r*1.6,0,TAU);g.stroke();
  g.strokeStyle='rgba(20,22,26,0.6)';g.lineWidth=0.25;g.beginPath();for(let i=0;i<5;i++){const a=R()*TAU,l=r*(2.4+R()*2);g.moveTo(o.u+Math.cos(a)*r*1.8,o.v+Math.sin(a)*r*1.8);g.lineTo(o.u+Math.cos(a)*l,o.v+Math.sin(a)*l);}g.stroke();
  g.globalCompositeOperation='destination-out';g.fillStyle='#000';g.beginPath();g.arc(o.u,o.v,r,0,TAU);g.fill();}
 else if(o.k==='crease'){g.globalCompositeOperation='source-atop';g.strokeStyle='rgba(12,14,18,0.7)';g.lineWidth=0.7;g.beginPath();
  for(let j=0;j<=6;j++){const y=o.v0+(o.v1-o.v0)*j/6;g.lineTo(o.u+(j%2?1.6:-1.6),y);}g.stroke();g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.4;g.beginPath();
  for(let j=0;j<=6;j++){const y=o.v0+(o.v1-o.v0)*j/6;g.lineTo(o.u+0.8+(j%2?1.6:-1.6),y);}g.stroke();}
 else if(o.k==='det'){g.globalCompositeOperation='destination-out';g.fillStyle='#000';wkPath(g,o.p);g.fill();g.globalCompositeOperation='source-atop';g.strokeStyle='rgba(16,18,22,0.9)';g.lineWidth=1.5;wkPath(g,o.p);g.stroke();}
 g.restore();}
/* ---- sérülés, leszakadás ---- */
function wkLeakHit(u,v,force,rad){for(const r of WK.res){if(r.amt<=0)continue;const d=Math.hypot(r.u-u,r.v-v);if(d<rad){const nl=force*(1-d/rad);if(nl>0.04&&r.leak<0.04)WK.msg={s:'Folyik '+r.n+'!',life:110};r.leak=Math.min(1,Math.max(r.leak,nl));}}}
function wkHurt(u,v,dmg,rad,vx,vy){wkLeakHit(u,v,dmg/28,rad+5);for(const p of WK.parts){if(p.gone)continue;const r=p.r,dx=Math.max(r[0][0]-u,0,u-r[1][0]),dy=Math.max(r[0][1]-v,0,v-r[2][1]),d=Math.hypot(dx,dy);
  if(d<rad){const k=1-d/rad;p.h-=dmg*k;WK.cost+=dmg*k*2600;if(p.h<=0)wkDetach(p,(vx||0)+((r[0][0]+r[1][0])/2-u)*0.04,(vy||-1)+((r[0][1]+r[2][1])/2-v)*0.03);}}}
function wkDetach(p,vx,vy){if(p.gone)return;const dc=wkDC();p.gone=true;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const q of p.p){x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);}
 x0=Math.max(x0,-WK_OX);y0=Math.max(y0,-WK_OY);x1=Math.min(x1,WK_DW-WK_OX);y1=Math.min(y1,WK_DH-WK_OY);const w=x1-x0,h=y1-y0,[c,g]=mk(w,h,CTS*WK_Z*SC);
 g.translate(-x0,-y0);wkPath(g,p.p);g.clip();g.drawImage(dc.c,-WK_OX,-WK_OY,WK_DW,WK_DH);
 // a darab ellökődik az autótól (eleje előre, hátulja hátra, tető felfelé), megbillen és felborul
 const sd=Math.sign(x0+w/2-56)||1,roof=p.k==='roof';
 WK.pcs.push({c:c,w:w,h:h*(1-WK.sq),x:wkWX(x0+w/2),y:wkWY(y0+h/2),vx:(vx||0)+sd*(roof?0.8:2),vy:(vy||-1)-(roof?2.4:1.6),r:0,vr:sd*(0.05+Math.random()*0.04),tr:h*(1-WK.sq)>w*0.9?sd*Math.PI/2:0,rest:false});
 WK.hot=WK.hot.filter(s=>!wkIn(p.p,s.u,s.v));for(const r of WK.res)if(r.amt>0&&wkIn(p.p,r.u,r.v)){r.leak=1;WK.msg={s:'Kiömlött '+r.n+'!',life:110};}wkDo({k:'det',p:p.p});WK.cost+=180000;
 noise(0.6,0.35,0,1200);tone(260,0.5,'sawtooth',0.06,0,-190);vib([30,20,60]);WK.msg={s:'Leszakadt '+p.n+'!',life:140};}
/* kerék: kind = 'pierce' (golyó: lassan ereszt), 'burst' (szétdurran), 'impact' (ütés: elgörbül a futómű, megdől a kerék) */
function wkWheelHurt(w,d,kind){if(w.gone)return;w.h-=d;WK.cost+=d*1500;
 if(kind==='pierce'&&w.air>0){if(!w.leak)WK.msg={s:'Lyukas a gumi, ereszt!',life:90};w.leak=Math.min(0.02,w.leak+0.0035);noise(0.3,0.12,0,7000);}
 if((kind==='burst'||w.h<35)&&w.air>0){w.air=0;w.leak=0;noise(0.8,0.22,0,6000);tone(90,0.2,'sine',0.06);WK.msg={s:'Kidurrant a gumi!',life:100};}
 if(kind==='impact'){const o=w.susp;w.susp=Math.min(1,w.susp+d/80);if(o<0.3&&w.susp>=0.3){WK.msg={s:'Elgörbült a futómű!',life:110};tone(140,0.3,'sawtooth',0.05,0,-60);}}
 w.flat=w.air<0.35;
 if(w.h<=-40){w.gone=true;CT.parts.push({k:'wheel',x:WK_CX+w.x,y:CTF-WR,vx:(w.x>56?1.2:-1.2),vy:-2.5,r:0,vr:0,life:1e9});noise(0.4,0.3,0,900);WK.msg={s:'Leszakadt egy kerék!',life:110};}}
function wkEdge(u,v,r){if(wkGone(u,v))return;
 if(v<10&&u>14&&u<96)wkDo({k:'crush',u:u,v:2.2,r:r,nx:0,ny:-1});else if(u>103)wkDo({k:'crush',u:111.5,v:v,r:r,nx:1,ny:0});else if(u<8)wkDo({k:'crush',u:1,v:v,r:r,nx:-1,ny:0});}
function wkDebris(wx,wy,n,dir,glass){for(let i=0;i<n;i++){const r=Math.random(),k=glass&&r<0.5?'glass':r<0.75?'frag':r<0.9?'plast':'spark';
  CT.parts.push({k:k,x:wx+rnd(-2,2),y:wy+rnd(-2,2),vx:(dir||0)*rnd(0.5,2)+rnd(-1.6,1.6),vy:-rnd(0.5,3.2),r:rnd(0,6),vr:rnd(-0.4,0.4),s:rnd(0.6,1.5),life:k==='spark'?rnd(15,35):1e9,max:40});}}
function wkSparks(wx,wy,n,dir){for(let i=0;i<n;i++)CT.parts.push({k:'spark',x:wx,y:wy,vx:dir*rnd(0.8,3)+rnd(-0.6,0.6),vy:-rnd(-0.6,2.2),r:0,life:rnd(10,26),max:30});}
/* üvegtörés a pont körül (sokadik találatra kitörik) */
function wkGlassHit(u,v,r,force){if(!wkGlass(u,v)||wkGone(u,v))return false;const key=((u/9)|0)+'_'+((v/7)|0),n=WK.hits['g'+key]=(WK.hits['g'+key]||0)+(force?3:1);
 wkDo({k:'glass',u:u,v:v,r:r,br:n>=2});if(n>=2)wkDebris(wkWX(u),wkWY(v),8,0,true);noise(0.25,n>=2?0.25:0.1,0,7000);tone(2600+rnd(0,600),0.08,'sine',0.03);WK.cost+=n>=2?45000:8000;return true;}
/* izzó folt melegítése az (u,v) pontban: T>1 fölött olvad, lyuk nő, cseppek hullanak */
function wkHeat(u,v,dT,mr){let s=null,bd=2.6;for(const h of WK.hot){const d=Math.hypot(h.u-u,h.v-v);if(d<bd){bd=d;s=h;}}
 if(!s){if(WK.hot.length>=40){WK.hot.sort((a,b)=>a.T-b.T);const o=WK.hot.shift();wkDo({k:'tint',u:o.u,v:o.v,r:3+o.m*1.6});}s={u:u,v:v,T:0.2,m:0,mh:0,on:0};WK.hot.push(s);}
 s.T=Math.min(1.6,s.T+dT);s.on=2;
 if(s.T>1&&mr>0){s.m=Math.min(mr,s.m+0.05);if(s.m>s.mh+0.6){s.mh=s.m;wkDo({k:'hole',u:s.u,v:s.v,r:s.m,hot:true});WK.holes.push({u:s.u,v:s.v,r:s.m});wkHurt(s.u,s.v,2.5,6);}
  if(WK.t%5===0)WK.ps.push({k:'drop',x:wkWX(s.u+rnd(-s.m,s.m)*0.5),y:wkWY(s.v+s.m*0.7),vx:rnd(-0.15,0.15),vy:0.2,T:1.3});}
 return s;}
/* ---- frissítés ---- */
function updWreck(){const w=WK;if(!w)return;w.t++;engine(0,0);if(K.pauseP){wkAction('wkback');return;}
 if(w.shake>0)w.shake*=0.85;if(w.flash>0)w.flash*=0.8;if(w.msg&&--w.msg.life<=0)w.msg=null;
 const tool=WK_TOOLS[w.tool].k;
 if(TAPD)wkTap(tool,wkLoc(TAPD));
 if(HOLD&&WK_HOLDT[tool]){const L=wkLoc(HOLD);wkHold(tool,L,w.prev);w.prev=L;w.hp=L;}else{w.prev=null;w.hp=null;}
 wkActs();wkPressUpd();
 for(const h of w.hot){if(h.on>0)h.on--;else h.T-=0.007;}
 for(let i=w.hot.length-1;i>=0;i--){const h=w.hot[i];if(h.T<0.15){wkDo({k:'tint',u:h.u,v:h.v,r:3+h.m*1.6});w.hot.splice(i,1);}}
 // olvadt cseppek, tűz, füst
 for(const r of w.res){if(r.leak>0&&r.amt>0&&Math.random()<r.leak*0.35){r.amt-=0.004;w.ps.push({k:'fl',c:r.k,x:wkWX(r.u+rnd(-1.5,1.5)),y:wkWY(r.v),vx:rnd(-0.06,0.06),vy:0.1});}}
 for(const d of w.fp){if(d.burn>0){d.burn--;d.w=Math.max(0,d.w-0.004);if(w.t%2===0)w.ps.push({k:'fire',x:d.x+rnd(-d.w,d.w)*0.85,y:CTF-rnd(0,2),vx:rnd(-0.2,0.2),vy:-rnd(0.4,1.1),r:rnd(1.5,1.5+d.w*0.18),life:rnd(16,32)});
   if(w.t%7===0)w.ps.push({k:'smoke',x:d.x+rnd(-d.w,d.w)*0.6,y:CTF-8,vx:rnd(-0.2,0.2),vy:-rnd(0.3,0.6),r:rnd(3,5),life:rnd(90,140)});if(w.t%9===0)noise(0.2,0.06,0,1500);
   if(w.t%40===0&&Math.abs(d.x-WK_CX-56)<60)wkHeat(clamp(d.x-WK_CX,6,106),46,0.25,0);}}
 if(w.fp.some(d=>d.k==='fuel'&&!d.burn)){const ign=d=>{if(d.k==='fuel'&&!d.burn&&d.w>2){d.burn=900;w.msg={s:'Meggyulladt a benzin!',life:130};noise(0.6,0.3,0,900);}};
  for(const d of w.fp){if(d.k!=='fuel'||d.burn)continue;
   if(w.ps.some(p=>(p.k==='fire'||p.k==='drop')&&Math.abs(p.x-d.x)<d.w+2&&p.y>CTF-14))ign(d);
   else if(CT.parts.some(p=>p.k==='spark'&&Math.abs(p.x-d.x)<d.w&&p.y>CTF-3)&&Math.random()<0.08)ign(d);
   else if(w.hot.some(h=>h.T>0.9&&Math.abs(wkWX(h.u)-d.x)<d.w+3&&h.v>34))ign(d);}}
 w.fp=w.fp.filter(d=>d.w>0.3);
 for(const p of w.ps){if(p.k==='fl'){p.vy+=0.14;p.y+=p.vy;p.x+=p.vx;if(p.y>=CTF-0.2){p.dead=true;let q=null;for(const d of w.fp)if(d.k===p.c&&Math.abs(d.x-p.x)<d.w*0.7+2){q=d;break;}
   if(q){q.w=Math.min(p.c==='fuel'?22:14,q.w+0.15);q.x+=(p.x-q.x)*0.05;}else w.fp.push({k:p.c,x:p.x,w:1.6,burn:0});}continue;}
  if(p.k==='shell'){p.vy+=0.2;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.y>CTF-0.6){p.y=CTF-0.6;p.vy*=-0.35;p.vx*=0.6;p.vr*=0.6;if(Math.abs(p.vy)>0.6)tone(3200+rnd(0,900),0.04,'triangle',0.012);}if(--p.life<=0)p.dead=true;}
  else if(p.k==='drop'){p.vy+=0.16;p.x+=p.vx;p.y+=p.vy;p.T-=0.004;if(p.y>=CTF){p.dead=true;let q=null;for(const d of w.pud)if(Math.abs(d.x-p.x)<d.w*0.6+2){q=d;break;}if(q){q.w=Math.min(16,q.w+0.35);q.T=Math.max(q.T,p.T);}else w.pud.push({x:p.x,w:2,T:p.T});}}
  else{p.x+=p.vx;p.y+=p.vy;p.vy-=p.k==='fire'?0.02:0.008;p.r+=p.k==='fire'?-0.03:0.09;if(--p.life<=0||p.r<=0.2)p.dead=true;}}
 w.ps=w.ps.filter(p=>!p.dead);if(w.ps.length>220)w.ps.splice(0,w.ps.length-220);for(const d of w.pud)d.T=Math.max(0,d.T-0.0025);
 ctParts(1);for(const q of w.tr)q.life--;w.tr=w.tr.filter(q=>q.life>0);if(w.gun&&w.gun.fl>0)w.gun.fl--;
 // leszakadt darabok esése
 for(const p of w.pcs){if(p.rest)continue;p.vy+=0.22;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;{const lo=wkCam()+30+p.w/2,hi=wkCam()+W/(CTS*WK_Z)-p.w/2-2;if(p.x>hi){p.x=hi;p.vx*=-0.35;}if(p.x<lo){p.x=lo;p.vx*=-0.35;}}const e=Math.abs(Math.cos(p.r))*p.h/2+Math.abs(Math.sin(p.r))*p.w/2;
  if(p.y+e>CTF){p.y=CTF-e;if(p.vy>1.2)noise(0.18,Math.min(0.3,p.vy*0.05),0,900);p.vy*=-0.25;p.vx*=0.6;p.vr*=0.5;
   const tr=p.tr;p.r+=(tr-p.r)*0.14;p.x+=Math.sign(tr)*0.25*Math.abs(tr-p.r);/* a magas darab eldől */if(Math.abs(p.vy)<0.4&&Math.abs(p.vx)<0.1&&Math.abs(p.r-tr)<0.02){p.rest=true;p.r=tr;}}}
 // a karosszéria megsüllyed a durrant / leszakadt kerék felé
 for(const q of w.wh){if(q.leak>0&&q.air>0){q.air=Math.max(0,q.air-q.leak);if(w.t%16===0)noise(0.25,0.05*q.air+0.02,0,7500);}q.flat=q.air<0.35;}
 const sg=i=>{const q=WK.wh[i];return q.gone?7:(1-q.air)*2.4+q.susp*2.6;},sR=sg(0),sF=sg(1),tg=(sR+sF)/2,tt=(sF-sR)/65;w.sag+=(tg-w.sag)*0.15;w.tilt+=(tt-w.tilt)*0.15;}
function wkTap(tool,L){const w=WK;
 if(tool==='hammer'){w.act={k:'hammer',u:L.u,v:L.v,f:0};}
 else if(tool==='ball'){if(!w.act||w.act.k!=='ball')w.act={k:'ball',u:L.u,v:L.v,f:0};}
 else if(tool==='cannon'){if(!w.act||w.act.k!=='cannon'||w.act.f>10){w.act={k:'cannon',u:L.u,v:L.v,f:0};noise(0.5,0.5,0,420);tone(70,0.4,'sawtooth',0.1,0,-40);w.shake=3;}}
 else if(tool==='bomb'){if(!w.act||w.act.k!=='bomb'){if(wkOn(L.u,L.v)||wkWheelAt(L.u,L.v))w.act={k:'bomb',u:L.u,v:L.v,f:0};else WK.msg={s:'A töltetet az autóra tedd!',life:90};}}
 else if(tool==='pistol'){wkFire(L,1,1);}
 else if(tool==='shotgun'){wkFire(L,9,0.7);tone(300,0.05,'square',0.04,0.35);tone(220,0.06,'square',0.04,0.5);}
 else if(tool==='press'){if(!w.press)w.press={pv:-36,dir:1};else w.press.dir=-w.press.dir;tone(60,0.3,'sine',0.05);}}
function wkHold(tool,L,P){if(tool==='mg'){if(WK.t%5===0)wkFire(L,1,0.9,2.2);return;}const w=WK,wh=wkWheelAt(L.u,L.v),melt=(tool==='torch'||tool==='laser')&&!wkGone(L.u,L.v)&&w.hot.some(h=>h.m>0&&Math.hypot(h.u-L.u,h.v-L.v)<h.m+2.5),on=wkOn(L.u,L.v)||melt;
 if(tool==='flex'){if(wh){wkWheelHurt(wh,0.8,'burst');wkSparks(L.wx,L.wy,2,-1);}
  if(on){wkSparks(L.wx,L.wy,3,-1);if(w.t%4===0){noise(0.12,0.07,0,5200);tone(2300+rnd(0,400),0.08,'sawtooth',0.012);}
   if(P&&Math.hypot(L.u-P.u,L.v-P.v)>0.35){const l=Math.hypot(L.u-P.u,L.v-P.v);wkDo({k:'cut',u0:P.u,v0:P.v,u1:L.u,v1:L.v,w:0.8});wkHurt(L.u,L.v,l*6,5);WK.cost+=l*900;}}}
 else if(tool==='torch'){if(w.t%6===0)noise(0.15,0.05,0,1800);if(on){wkHeat(L.u,L.v,0.035,7);WK.cost+=60;}
  if(w.t%2===0)w.ps.push({k:'fire',x:L.wx+rnd(-1,1),y:L.wy+rnd(-1,1),vx:rnd(-0.2,0.2),vy:-rnd(0.2,0.6),r:rnd(1.2,2.2),life:18});}
 else if(tool==='laser'){if(w.t%5===0){tone(1500,0.1,'sine',0.02);noise(0.1,0.04,0,4200);}
  if(wh)wkWheelHurt(wh,1.2,'burst');
  if(on){const s=wkHeat(L.u,L.v,0.09,4);s.T=Math.max(s.T,1.25);WK.cost+=80;
   if(P&&Math.hypot(L.u-P.u,L.v-P.v)>0.3){const l=Math.hypot(L.u-P.u,L.v-P.v);wkDo({k:'cut',u0:P.u,v0:P.v,u1:L.u,v1:L.v,w:1,hot:true});wkHurt(L.u,L.v,l*5+1.5,5);}
   if(w.t%3===0)wkSparks(L.wx,L.wy,1,rnd(-1,1));}}}
/* lövés a néző felől: golyó ütötte lyuk (bullet), üvegen pókhálós repedés, gumin defekt */
function wkFire(L,n,pow,spr){const w=WK,tool=WK_TOOLS[w.tool].k;w.gun={k:tool,x:L.wx,y:L.wy,life:90,fl:3};
 noise(n>1?0.45:0.22,n>1?0.6:0.45,0,n>1?1500:2400);noise(0.1,0.3,0,6500);tone(120,0.1,'square',0.05,0,-60);vib(n>1?40:12);w.shake=Math.max(w.shake,n>1?3:tool==='mg'?0.8:1.2);
 w.ps.push({k:'shell',x:wkCam()+(W-30)/(CTS*WK_Z),y:CTF-10,vx:rnd(0.3,1),vy:-rnd(1.5,2.5),r:0,vr:rnd(-0.5,0.5),life:150});
 for(let i=0;i<n;i++){const u=L.u+(n>1?rnd(-5,5):rnd(-(spr||0),spr||0)),v=L.v+(n>1?rnd(-4,4):rnd(-(spr||0),spr||0));w.tr.push({x:wkWX(u),y:wkWY(v),life:3});
  const wh=wkWheelAt(u,v);if(wh){wkWheelHurt(wh,14*pow,'pierce');continue;}
  if(wkGlass(u,v)&&!wkGone(u,v)){const key='b'+((u/8)|0)+'_'+((v/7)|0),m=w.hits[key]=(w.hits[key]||0)+1;wkDo({k:'glass',u:u,v:v,r:4.5,br:m>=5});wkDo({k:'bullet',u:u,v:v,r:0.5});
   if(m>=5)wkDebris(wkWX(u),wkWY(v),6,0,true);noise(0.12,0.12,0,7500);w.cost+=6000;continue;}
  if(wkOn(u,v)){const r=0.45+pow*0.25;wkDo({k:'bullet',u:u,v:v,r:r});w.holes.push({u:u,v:v,r:r});wkHurt(u,v,3.5*pow,4);wkSparks(wkWX(u),wkWY(v),2,rnd(-1,1));w.cost+=3500;
   if(Math.random()<0.2)tone(2800,0.18,'sine',0.025,0.03,-900);else tone(1500+rnd(0,500),0.06,'triangle',0.03);}}}
function wkActs(){const w=WK,a=w.act;if(!a)return;a.f++;
 if(a.k==='hammer'&&a.f===5){const L=a,wh=wkWheelAt(L.u,L.v);
  if(wh){wkWheelHurt(wh,16,'impact');tone(180,0.12,'square',0.05);}
  else if(wkGlassHit(L.u,L.v,6,false)){}
  else if(wkOn(L.u,L.v)){const key=((L.u/4)|0)+'_'+((L.v/4)|0),n=w.hits[key]=(w.hits[key]||0)+1;
   wkDo({k:'dent',u:L.u,v:L.v,r:4.5,a:0.65});if(n>=6&&n%2===0){wkDo({k:'hole',u:L.u,v:L.v,r:1.6+n*0.15});w.holes.push({u:L.u,v:L.v,r:1.6+n*0.15});}
   wkHurt(L.u,L.v,7,7,0,-0.5);w.cost+=6000;if(n%3===0)wkEdge(L.u,L.v,2.4);tone(1300+rnd(0,300),0.18,'triangle',0.06);tone(500,0.12,'square',0.035);noise(0.08,0.15,0,3000);w.shake=1.2;vib(15);}
  else tone(150,0.08,'sine',0.03);}
 if(a.k==='hammer'&&a.f>16)w.act=null;
 if(a.k==='ball'&&a.f===22){const L=a;w.shake=7;w.flash=0.3;noise(0.7,0.6,0,500);tone(55,0.5,'sawtooth',0.12,0,-25);noise(0.3,0.25,0.03,2500);vib([60,30,90]);
  for(const [du,dv] of [[0,0],[-7,3],[6,-3]])if(wkOn(L.u+du,L.v+dv))wkDo({k:'dent',u:L.u+du,v:L.v+dv,r:du?9:14,a:1});
  for(const [du,dv] of [[0,0],[-9,-4],[9,-3]])wkGlassHit(L.u+du,L.v+dv,8,true);
  const wh=wkWheelAt(L.u,L.v,6);if(wh)wkWheelHurt(wh,55,'impact');
  wkHurt(L.u,L.v,45,28,2.2,-1.5);wkEdge(L.u,L.v,8);const p=w.parts.find(q=>!q.gone&&wkIn(q.p,L.u,L.v));if(p&&p.h<55&&wkOn(L.u,L.v)){wkDo({k:'hole',u:L.u,v:L.v,r:6});w.holes.push({u:L.u,v:L.v,r:6});}
  wkDebris(wkWX(L.u),wkWY(L.v),26,1,false);for(let i=0;i<6;i++)CT.parts.push({k:'dust',x:wkWX(L.u)+rnd(-6,6),y:wkWY(L.v)+rnd(-6,6),vx:rnd(-0.6,0.6),vy:-rnd(0.1,0.4),r:3,life:80,max:80});w.cost+=60000;}
 if(a.k==='ball'&&a.f>90)w.act=null;
 if(a.k==='cannon'&&a.f===8){const L=a,wh=wkWheelAt(L.u,L.v);w.shake=4;tone(900,0.15,'square',0.05);noise(0.25,0.3,0,3000);
  if(wh)wkWheelHurt(wh,60,'burst');
  else if(wkGlass(L.u,L.v))wkGlassHit(L.u,L.v,5,true);
  else if(wkOn(L.u,L.v)){wkDo({k:'dent',u:L.u,v:L.v,r:7,a:0.8});wkDo({k:'hole',u:L.u,v:L.v,r:3.4});w.holes.push({u:L.u,v:L.v,r:3.4});wkHurt(L.u,L.v,30,14,0.6,-1);w.cost+=25000;}
  wkDebris(wkWX(L.u),wkWY(L.v),14,0,false);wkSparks(wkWX(L.u),wkWY(L.v),8,rnd(-1,1));}
 if(a.k==='cannon'&&a.f>20)w.act=null;
 if(a.k==='bomb'&&a.f===90)wkLeakHit(a.u,a.v,1,50);
 if(a.k==='bomb'){const per=a.f<60?15:a.f<80?8:4;if(a.f%per===0)tone(1800,0.06,'square',0.05);
  if(a.f===90){const L=a;w.act=null;w.shake=10;w.flash=1;noise(1.6,0.9,0,450);noise(0.6,0.5,0.02,2500);tone(45,0.9,'sawtooth',0.18,0,-25);vib([120,40,200]);
   wkDo({k:'scorch',u:L.u,v:L.v,r:22});wkEdge(L.u,L.v,11);if(wkOn(L.u,L.v)){wkDo({k:'hole',u:L.u,v:L.v,r:7,hot:true});w.holes.push({u:L.u,v:L.v,r:7});}
   for(let i=0;i<6;i++){const a2=Math.random()*TAU,d=rnd(8,22),u=L.u+Math.cos(a2)*d,v=L.v+Math.sin(a2)*d*0.7;if(wkOn(u,v))wkDo({k:'dent',u:u,v:v,r:rnd(6,11),a:0.9});}
   for(let i=0;i<10;i++){const u=rnd(10,90),v=rnd(14,26);if(Math.hypot(u-L.u,v-L.v)<45)wkGlassHit(u,v,7,true);}
   for(const wh of w.wh)if(Math.hypot(wh.x-L.u,WCY-L.v)<34){wkWheelHurt(wh,60,'impact');wkWheelHurt(wh,50,'burst');}
   for(const p of w.parts){if(p.gone)continue;const cx=(p.r[0][0]+p.r[1][0])/2,cy=(p.r[0][1]+p.r[2][1])/2,d=Math.hypot(cx-L.u,cy-L.v),k=clamp(1-d/55,0,1);
    p.h-=105*k;w.cost+=105*k*2600;if(p.h<=0)wkDetach(p,(cx-L.u)/Math.max(8,d)*3.2,-2.4-k*2+(cy-L.v)/Math.max(8,d)*1.5);}
   const s=wkHeat(L.u,L.v,1.4,0);s.T=1.5;
   const wx=wkWX(L.u),wy=wkWY(L.v);wkDebris(wx,wy,45,0,true);
   for(let i=0;i<34;i++)w.ps.push({k:'fire',x:wx+rnd(-6,6),y:wy+rnd(-6,6),vx:rnd(-1.4,1.4),vy:-rnd(0.3,1.8),r:rnd(2.5,5),life:rnd(18,40)});
   for(let i=0;i<18;i++)w.ps.push({k:'smoke',x:wx+rnd(-8,8),y:wy+rnd(-8,4),vx:rnd(-0.4,0.4),vy:-rnd(0.2,0.6),r:rnd(3,6),life:rnd(80,140)});w.cost+=150000;}}}
function wkPressUpd(){const w=WK,p=w.press;if(!p)return;p.pv+=p.dir*0.32;
 if(p.dir>0){const top=wkV(2);if(p.pv>=top){const ns=clamp((p.pv-2)/(WK_DH-2-WK_OY),0,0.55);if(ns>w.sq){const o=w.sq;w.sq=ns;w.cost+=(ns-o)*900000;
    if(w.t%22===0)tone(85+rnd(0,40),0.4,'sawtooth',0.05,0,-30);if(w.t%12===0)tone(60,0.2,'sine',0.04);
    for(const th of [0.06,0.14,0.22]){if(o<th&&ns>=th){for(let i=0;i<4;i++)wkGlassHit(rnd(12,88),rnd(15,25),7,true);}}
    for(const th of [0.12,0.25,0.4]){if(o<th&&ns>=th){for(const u of [14,40,62,88])wkDo({k:'crease',u:u+rnd(-2,2),v0:2,v1:30});w.shake=2.5;noise(0.3,0.2,0,800);}}}
   if(w.sq>=0.55){p.dir=-1;WK.msg={s:'A prés a végállásban: teljesen összenyomva!',life:120};}}}
 else if(p.pv<-36)w.press=null;}
/* ---- rajz ---- */
function wkHotCol(T,a){return T>1.25?'rgba(255,250,225,'+a+')':T>0.95?'rgba(255,205,90,'+a+')':T>0.65?'rgba(255,125,35,'+a+')':'rgba(205,45,15,'+a+')';}
function drawWreck(g){const w=WK,B=ctBG(),k=CTS*WK_Z,cam=wkCam(),cs=cam*CTS,fy=CTF*CTS,t=G.t;
 const off=((cs%CT_TW)+CT_TW)%CT_TW;for(let x=-off;x<W;x+=CT_TW)g.drawImage(B.c,x,0,CT_TW,H);
 g.save();if(w.shake>0.3)g.translate(rnd(-w.shake,w.shake),rnd(-w.shake,w.shake)*0.6);g.translate(0,fy);g.scale(k,k);g.translate(-cam,-CTF);
 // folyadék-tócsák (olaj fényes csíkkal, benzin szivárvány-fénnyel, égő benzin kormos)
 for(const d of w.fp){ell(g,d.burn?'rgba(30,22,16,0.8)':WK_FLC[d.k],d.x,CTF+0.6,d.w,0.8+d.w*0.06);if(d.k==='oil')ell(g,'rgba(255,255,255,0.18)',d.x-d.w*0.3,CTF+0.3,d.w*0.3,0.3);
  if(d.k==='fuel'&&!d.burn){ell(g,'rgba(255,90,200,0.22)',d.x,CTF+0.4,d.w*0.6,0.4);ell(g,'rgba(80,220,255,0.2)',d.x+d.w*0.15,CTF+0.7,d.w*0.4,0.35);}}
 // olvadt fém tócsái a padlón (izzó, majd kihűlő)
 for(const d of w.pud){ell(g,d.T>0.3?wkHotCol(d.T+0.3,0.9):'rgba(70,74,80,0.9)',d.x,CTF+0.3,d.w,0.9+d.w*0.08);if(d.T>0.3)ell(g,'rgba(255,240,200,'+(d.T*0.5).toFixed(2)+')',d.x,CTF+0.1,d.w*0.5,0.4);}
 ell(g,'rgba(0,0,0,0.3)',WK_CX+56,CTF+0.8,58,3.2);
 for(const p of w.pcs)if(p.rest)wkPiece(g,p);
 // a karosszéria (préselve, megdőlve) és az izzó foltok
 const by=wkBy()+w.sag;g.save();g.translate(WK_CX+56,by+45);g.rotate(w.tilt);g.translate(-56,-45);
 const dc=wkDC();g.drawImage(dc.c,-WK_OX,-WK_OY+WK_DH*w.sq,WK_DW,WK_DH*(1-w.sq));
 if(w.hot.length){g.globalCompositeOperation='lighter';for(const h of w.hot){const a=clamp(h.T,0,1),r=2.2+h.m*1.3+h.T*2.2,y=wkV(h.v),gr=g.createRadialGradient(h.u,y,0,h.u,y,r);
   gr.addColorStop(0,wkHotCol(h.T,(0.95*a).toFixed(2)));gr.addColorStop(0.45,wkHotCol(h.T-0.3,(0.55*a).toFixed(2)));gr.addColorStop(1,wkHotCol(0.3,0));g.fillStyle=gr;g.beginPath();g.arc(h.u,y,r,0,TAU);g.fill();}
  g.globalCompositeOperation='source-over';}
 g.restore();
 for(let i=0;i<2;i++){const wh=w.wh[i];if(wh.gone){disc(g,'#4a4f56',WK_CX+wh.x,CTF-3.5,3.4);disc(g,'#2b3037',WK_CX+wh.x,CTF-3.5,1.4);continue;}wheel(g,WK_CX+wh.x+(wh.x>56?-1:1)*wh.susp*2.6,wkBy()+WCY-wh.susp*1.4+(wh.flat?0.4:0),0,wh.flat,undefined,wh.susp);}
 for(const p of w.pcs)if(!p.rest)wkPiece(g,p);
 // eszközök
 const a=w.act;
 if(a&&a.k==='hammer'){const x=wkWX(a.u),y=wkWY(a.v),an=a.f<5?1.2*(1-a.f/5):Math.min(0.35,(a.f-5)*0.04);g.save();g.translate(x+16,y+4);g.rotate(an);// kéz a nyélen, a fej a találati pontra csap
  line(g,'#8a5a2b',0,0,-14,-3.5,1.6);g.save();g.translate(-16,-4);g.rotate(-0.24);frr(g,'#5d646d',-2.5,-4.5,5,9,1);R(g,'rgba(255,255,255,0.3)',-2.5,-4.5,1,9);g.restore();g.restore();}
 if(a&&a.k==='ball'){const x=wkWX(a.u),y=wkWY(a.v)-2,top=CTF-150,L=y-top,th=a.f<22?-1.0*Math.cos(Math.PI/2*a.f/22):-0.32*Math.sin(Math.PI*Math.min(1,(a.f-22)/40)),lift=a.f>62?(a.f-62)*3:0;
  const bx=x-Math.sin(th)*L*-1-11,byy=top+Math.cos(th)*(L)-lift;line(g,'#2b2f36',x-11,top,bx,byy,1);for(let i=1;i<8;i++){const q=i/8;disc(g,'#4a4f56',lerp(x-11,bx,q),lerp(top,byy,q),0.7);}
  disc(g,'#15181c',bx,byy,11);disc(g,'#3a4048',bx-2,byy-2,8.5);disc(g,'rgba(255,255,255,0.18)',bx-4,byy-4,3);}
 if(a&&a.k==='cannon'&&a.f<=8){const x=wkWX(a.u),y=wkWY(a.v),r=lerp(12,2.4,a.f/8);disc(g,'rgba(0,0,0,0.35)',x+1,y+1,r);disc(g,'#2b3037',x,y,r);disc(g,'rgba(255,255,255,0.25)',x-r*0.3,y-r*0.3,r*0.35);}
 if(a&&a.k==='bomb'){const x=wkWX(a.u),y=wkWY(a.v);frr(g,'#b8342a',x-3.5,y-2.5,7,5,1);R(g,'#1d2228',x-3.5,y-0.6,7,1.2);if(((a.f/(a.f<60?8:4))|0)%2===0){disc(g,'#ff4d4d',x+2,y-2.8,0.9);disc(g,'rgba(255,80,80,0.35)',x+2,y-2.8,2.4);}}
 if(w.press){const p=w.press,py=wkBy()+w.sag+p.pv,top=CTF-150;for(const rx of [WK_CX+18,WK_CX+94]){R(g,'#8f99a4',rx-2,top,4,py-16-top);R(g,'rgba(255,255,255,0.3)',rx-2,top,1,py-16-top);}
  frr(g,'#3a4048',WK_CX-12,py-16,136,16,2);R(g,'#59616a',WK_CX-12,py-4,136,4);for(let x=WK_CX-10;x<WK_CX+122;x+=9)poly(g,((x/9)|0)%2?'#111':'#ffd84a',[[x,py-14],[x+9,py-14],[x+6,py-9],[x-3,py-9]]);}
 if(w.hp){const L=w.hp,tool=WK_TOOLS[w.tool].k;
  if(tool==='flex'){g.save();g.translate(L.wx,L.wy);disc(g,'#4a5058',0,0,6);g.strokeStyle='#9aa3ad';g.lineWidth=0.6;g.beginPath();for(let i=0;i<4;i++){const a2=t*0.9+i*Math.PI/2;g.moveTo(0,0);g.lineTo(Math.cos(a2)*5.5,Math.sin(a2)*5.5);}g.stroke();
   g.fillStyle='#e0a020';g.beginPath();g.arc(0,0,7,Math.PI*1.05,Math.PI*1.95);g.lineTo(0,0);g.closePath();g.fill();frr(g,'#2b6fd0',-3,-16,6,9,2);g.restore();}
  else if(tool==='torch'){const nx=L.wx-9,ny=L.wy-12;line(g,'#6b7480',nx-8,ny-10,nx,ny,2.2);g.globalCompositeOperation='lighter';
   poly(g,'rgba(255,140,40,0.55)',[[nx-1.2,ny],[nx+1.2,ny],[L.wx+1.5,L.wy+1],[L.wx-1,L.wy+1.5]]);poly(g,'rgba(120,170,255,0.8)',[[nx-0.5,ny],[nx+0.5,ny],[lerp(nx,L.wx,0.6)+0.4,lerp(ny,L.wy,0.6)],[lerp(nx,L.wx,0.6)-0.4,lerp(ny,L.wy,0.6)]]);g.globalCompositeOperation='source-over';}
  else if(tool==='laser'){const ex=cam+(W-18)/k,ey=CTF+(H-12-fy)/k;frr(g,'#2b3037',ex-8,ey-5,16,10,2);disc(g,'#ff3b3b',ex-6,ey-1,1.5);
   g.globalCompositeOperation='lighter';line(g,'rgba(255,40,40,0.35)',ex-6,ey-1,L.wx,L.wy,2.6);line(g,'rgba(255,220,220,0.9)',ex-6,ey-1,L.wx,L.wy,0.6);disc(g,'rgba(255,120,120,0.6)',L.wx,L.wy,2.4);g.globalCompositeOperation='source-over';}}
 // részecskék
 for(const p of CT.parts){if(p.k==='steam'||p.k==='dust'){const al=clamp(p.life/p.max,0,1)*0.35;disc(g,'rgba(190,180,165,'+al.toFixed(2)+')',p.x,p.y,p.r);continue;}
  if(p.k==='wheel'){wheel(g,p.x,p.y,p.r,true);continue;}
  if(p.k==='spark'){const al=clamp(p.life/22,0,1);line(g,'rgba(255,214,120,'+al.toFixed(2)+')',p.x,p.y,p.x-p.vx*1.6,p.y-p.vy*1.6,0.6);continue;}
  const s=p.s||1,c=p.k==='glass'?'rgba(205,235,250,0.9)':p.k==='frag'?CP.m:'#1d2228';g.save();g.translate(p.x,p.y);g.rotate(p.r);
  if(p.k==='glass')poly(g,c,[[-s,-s*0.4],[s,-s*0.7],[s*0.3,s*0.8]],0,0);else if(p.k==='frag')poly(g,c,[[-s*1.4,-s*0.5],[s*1.2,-s*0.8],[s*1.4,s*0.6],[-s,s*0.7]],0,0);else frr(g,c,-s,-s*0.5,s*2,s,0.3);g.restore();}
 for(const p of w.ps){if(p.k==='fl'){disc(g,WK_FLC[p.c],p.x,p.y,0.5);continue;}
  if(p.k==='shell'){g.save();g.translate(p.x,p.y);g.rotate(p.r);R(g,'#d9a933',-1,-0.4,2,0.8);R(g,'#8a6a1c',0.6,-0.4,0.4,0.8);g.restore();continue;}
  if(p.k==='drop'){disc(g,wkHotCol(p.T,0.95),p.x,p.y,0.9);continue;}
  const al=p.k==='fire'?clamp(p.life/30,0,1):clamp(p.life/120,0,1)*0.45;disc(g,p.k==='fire'?(p.life>14?'rgba(255,210,90,'+al.toFixed(2)+')':'rgba(240,90,30,'+al.toFixed(2)+')'):'rgba(60,62,66,'+al.toFixed(2)+')',p.x,p.y,p.r);}
 g.restore();
 // lőfegyver a néző oldalán (jobbra lent): cső a célpont felé, torkolattűz, nyomjelző
 if(w.gun&&w.gun.life-->0){const gx=W-34,gy=H-2,tx=(w.gun.x-cam)*k,ty=(w.gun.y-CTF)*k+fy,an=Math.atan2(ty-gy,tx-gx),L=w.gun.k==='pistol'?30:48;
  for(const q of w.tr){const qx=(q.x-cam)*k,qy=(q.y-CTF)*k+fy;g.globalCompositeOperation='lighter';line(g,'rgba(255,220,140,'+(q.life*0.2).toFixed(2)+')',gx+Math.cos(an)*L,gy+Math.sin(an)*L,qx,qy,1.2);g.globalCompositeOperation='source-over';}
  g.save();g.translate(gx,gy);g.rotate(an);frr(g,'#1d2228',-20,-7,L*0.55+20,14,3);R(g,'#2b3037',0,-3,L,6);R(g,'rgba(255,255,255,0.15)',0,-3,L,1.2);if(w.gun.k!=='pistol')frr(g,'#5a3a1e',-34,-6,18,12,3);
  if(w.gun.fl>0){g.globalCompositeOperation='lighter';disc(g,'rgba(255,200,90,0.85)',L+5,0,7);disc(g,'rgba(255,250,220,0.9)',L+3,0,3.5);g.globalCompositeOperation='source-over';}g.restore();}
 if(w.flash>0.05)R(g,'rgba(255,240,210,'+(w.flash*0.7).toFixed(2)+')',0,0,W,H);
 // felirat: eszköz, tipp, kár
 const T=WK_TOOLS[w.tool],cx=W/2+60,s1='Roncsoló műhely: '+T.n,s2=WK_HOLDT[T.k]?'Tartsd az ujjad az autón, és húzd':'Koppints az autóra',ww=Math.max(textW(s1,0.9),textW(s2,0.65))+18;
 frr(g,'rgba(10,13,20,0.78)',cx-ww/2,6,ww,28,6);text(g,s1,cx,11,'#ffd84a',0.9,'center',null);text(g,s2,cx,24,'#cfd6df',0.65,'center',null);
 const ng=w.parts.filter(p=>p.gone).length+w.wh.filter(q=>q.gone).length;frr(g,'rgba(10,13,20,0.78)',W-128,40,122,28,6);
 text(g,'Kár: '+fmt(Math.round(w.cost/1000)*1000)+' Ft',W-12,45,'#ff9a7a',0.75,'right',null);text(g,'Leszakadt részek: '+ng,W-12,58,'#cfd6df',0.65,'right',null);
 if(w.msg){const al=clamp(w.msg.life/30,0,1),mw=textW(w.msg.s,1.1)+20;frr(g,'rgba(120,20,10,'+(0.85*al).toFixed(2)+')',cx-mw/2,H/2-70,mw,20,7);text(g,w.msg.s,cx,H/2-64,'rgba(255,255,255,'+al.toFixed(2)+')',1.1,'center',null);}}
function wkPiece(g,p){g.save();g.translate(p.x,p.y);g.rotate(p.r);g.drawImage(p.c,-p.w/2,-p.h/2,p.w,p.h);g.restore();}
