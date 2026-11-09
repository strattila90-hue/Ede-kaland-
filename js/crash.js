/* ---------- TÖRÉSTESZT: ütközésvizsgáló csarnok, bábuk, lassított felvétel, csillagos értékelés ----------
   Világkoordináták: 1 egység = az autó képpontja (az autó 112 hosszú), a képernyőn CTS-szeres nagyításban.
   A gyűrődés: az autó szeletekre vágva, a gyűrődési zóna vízszintesen összenyomva (eleje: motortér, majd utastér). */
const CT_TESTS=[
 {k:'front',nm:'Frontális ütközés, részleges átfedés',sh:'Frontális 40%',v:64,z:'f',m:1},
 {k:'full',nm:'Teljes szélességű merev fal',sh:'Merev fal',v:50,z:'f',m:1.2},
 {k:'rear',nm:'Hátulról ütközés, mozgó akadály',sh:'Hátsó ütközés',v:50,z:'r',m:0.65}];
const CT_SPD=[30,40,50,64,80,100,130];
const CTS=1.55,CTF=148,CTBX=272,CT_COL=['#2fb34a','#f2d22e','#f39a2b','#9a5a2b','#d93a2f'];
let CT=null,CTBG=null;
function startCrash(){G.state='crash';G.st=0;G.paused=false;const ti=clamp((PROF.ctTest|0),0,CT_TESTS.length-1);CT={ti:ti,v:PROF.ctV||CT_TESTS[ti].v};ctReset();elog('info','Törésteszt megnyitva');}
function ctReset(){const T=CT_TESTS[CT.ti];Object.assign(CT,{ph:'ready',t:0,f:0,x:T.z==='r'?100:6,vx:0,tx:-190,tvx:0,cv:0,ang:0,cr:0,hc:0,pitch:0,hd:0,ab:0,parts:[],res:null,flash:0,shake:0,lost:false,slow:1,imp:false,puddle:0,ms:0});MENU_SIG='?';}
const ctSev=()=>{const T=CT_TESTS[CT.ti];return Math.pow(CT.v/64,2)*T.m;};
function ctMenu(){const T=CT_TESTS[CT.ti];if(CT.ph!=='ready'&&CT.ph!=='result')return null;
 return {cls:'bottom',items:[{a:'ctgo',l:CT.ph==='result'?'Újra':'Indítás',ic:'▶',c:'primary'},{a:'cttest',l:T.sh,ic:'🧪'},{a:'ctspd',l:CT.v+' km/h',ic:'⏱'},{a:'home',l:'Főmenü',ic:'⌂'}]};}
function ctAction(a){if(!CT)return;const T=CT_TESTS[CT.ti];
 if(a==='ctgo'){if(CT.ph==='result')ctReset();CT.ph='count';CT.t=0;initAudio();}
 else if(a==='cttest'){CT.ti=(CT.ti+1)%CT_TESTS.length;CT.v=CT_TESTS[CT.ti].v;PROF.ctTest=CT.ti;PROF.ctV=CT.v;saveProf();ctReset();toast(CT_TESTS[CT.ti].nm+', '+CT.v+' km/h');}
 else if(a==='ctspd'){const i=CT_SPD.indexOf(CT.v);CT.v=CT_SPD[(i+1)%CT_SPD.length];PROF.ctV=CT.v;saveProf();ctReset();toast(T.sh+': '+CT.v+' km/h'+(CT.v>64?' (a szabványosnál gyorsabb!)':''));}
 MENU_SIG='?';}
/* ---- frissítés ---- */
function updCrash(){if(!CT)return;const T=CT_TESTS[CT.ti],front=T.z==='f',vv=CT.v*0.05;CT.t++;if(K.enterP&&(CT.ph==='ready'||(CT.ph==='result'&&CT.t>40))){SFX.click();ctAction('ctgo');}if(CT.flash>0)CT.flash*=0.8;if(CT.shake>0)CT.shake*=0.86;
 if(CT.ph==='count'){if(CT.t%40===1&&CT.t<120)tone(CT.t<80?660:660,0.12,'square',0.07);if(CT.t===120){tone(1320,0.3,'square',0.08);CT.ph='run';CT.t=0;}return;}
 if(CT.ph==='run'){
  if(front){CT.vx=Math.min(vv,CT.vx+vv/38);CT.x+=CT.vx;CT.ang+=CT.vx/WR;CT.ms=CT.vx/vv*CT.v;if(CT.x+112>=CTBX){CT.x=CTBX-112;ctImpact();}}
  else{CT.tvx=Math.min(vv,CT.tvx+vv/38);CT.tx+=CT.tvx;CT.ms=CT.tvx/vv*CT.v;if(CT.tx+70>=CT.x){CT.tx=CT.x-70;ctImpact();}}
  return;}
 if(CT.ph==='hit'){const sl=CT.slow,f=CT.f,sev=ctSev(),dur=6,u=clamp(f/dur,0,1),e=1-(1-u)*(1-u);
  const cm=Math.min(30,(front?16:13)*Math.pow(sev,0.62)),hm=CT.ti===0?Math.min(14,9*Math.sqrt(sev)):0;CT.cr=cm*e;CT.hc=hm*e;
  if(front){const rb=f>dur?(1.5+2.5*Math.min(1.5,sev))*(1-Math.exp(-(f-dur)/6)):0;CT.x=CT.x0+CT.cr+CT.hc-rb;
   const pk=0.065*Math.min(1.9,Math.sqrt(sev));CT.pitch=f<dur?pk*u:pk*Math.exp(-(f-dur)/8)*Math.cos((f-dur)*0.42);
   const dm=5.5*Math.min(1.7,Math.pow(sev,0.7));CT.hd=dm*Math.sin(Math.PI*clamp(f/16,0,1))*(f<16?1:0);
   CT.ab=f<1?0:f<3?(f-1)/2:f<60?1:2;}
  else{// hátsó: a kocsi meglöki az autót
   const vC=CT.tvx0*0.55;if(f<dur)CT.cv=vC*u;else CT.cv=Math.max(0,CT.cv-0.06*vv*sl/3);CT.x+=CT.cv*sl;CT.ang+=CT.cv*sl/WR;
   CT.tvx=f<dur?lerp(CT.tvx0,vC*0.55,u):Math.max(0,CT.tvx-0.08*sl);CT.tx=f<dur?CT.x+CT.cr-70:CT.tx+CT.tvx*sl;
   const pk=0.035*Math.min(1.9,Math.sqrt(sev));CT.pitch=f<dur?-pk*u:-pk*Math.exp(-(f-dur)/8)*Math.cos((f-dur)*0.42);
   const dm=6*Math.min(1.6,Math.pow(sev,0.6));CT.hd=f<11?-dm*Math.sin(Math.PI*f/11):f<24?dm*0.45*Math.sin(Math.PI*(f-11)/13):0;CT.ab=0;}
  if(!CT.imp&&f>=0.4){CT.imp=true;ctDebris(sev,front);}
  if(sev>1.15&&front&&!CT.lost&&f>5){CT.lost=true;const wx=ctMap(89);CT.parts.push({k:'wheel',x:CT.x+wx,y:CTF-WR,vx:-1.6-sev*0.4,vy:-3,r:0,vr:-0.25,life:1e9});}
  if(f>dur&&f<200&&CT.t%3===0&&front){CT.parts.push({k:'steam',x:CT.x+112-CT.cr-6+rnd(-4,4),y:CTF-36+rnd(-4,4),vx:rnd(-0.3,0.2),vy:-rnd(0.3,0.7),r:2,life:70,max:70});}
  if(f>dur&&front)CT.puddle=Math.min(1,CT.puddle+0.004*sl);
  if(CT.t%32===16&&f<30)CT.flash=1;
  CT.f+=sl;CT.slow=f<26?0.14:Math.min(1,sl+0.025);
  ctParts(sl);if(CT.f>=110){CT.ph='result';CT.t=0;ctScore();}return;}
 if(CT.ph==='result'){ctParts(1);if(CT.t%3===0&&CT.t<400&&CT_TESTS[CT.ti].z==='f')CT.parts.push({k:'steam',x:CT.x+112-CT.cr-6+rnd(-4,4),y:CTF-36,vx:rnd(-0.3,0.2),vy:-rnd(0.2,0.5),r:2,life:70,max:70});
  if(CT.res&&CT.t>=34&&CT.t<=34+14*4&&(CT.t-34)%14===0){const k=(CT.t-34)/14;if(k<CT.res.stars)tone(880+k*170,0.12,'square',0.07);}}}
function ctImpact(){const T=CT_TESTS[CT.ti],sev=ctSev();CT.ph='hit';CT.f=0;CT.t=0;CT.x0=CT.x;CT.tvx0=CT.tvx;CT.slow=0.14;CT.shake=Math.min(6,2+sev*2);CT.flash=1;
 if(AC){noise(0.9,Math.min(0.9,0.45+sev*0.2),0,700);noise(0.5,0.35,0.02,3200);tone(70,0.5,'sawtooth',0.14,0,-40);if(sev>0.5)noise(0.35,0.25,0.12,5000);}
 vib(sev>1?[80,30,180]:[90]);}
/* törmelék: üvegszilánk, karosszériadarab, műanyag, méhsejt-alumínium, szikra, por */
function ctDebris(sev,front){const n=Math.min(70,Math.round(18+sev*26)),ix=front?CTBX+CT.hc:CT.x+CT.cr,iy=CTF-30;
 for(let i=0;i<n;i++){const r=Math.random();let k=r<0.35?'glass':r<0.6?'frag':r<0.78?'plast':r<0.88&&CT.ti===0?'hc':'spark';
  const dir=front?-1:1;CT.parts.push({k:k,x:ix+rnd(-3,3),y:iy+rnd(-14,12),vx:dir*rnd(0.4,3.2)*(0.6+sev*0.4)+rnd(-0.6,0.6),vy:-rnd(0.5,4)*(0.7+sev*0.3),r:rnd(0,6),vr:rnd(-0.4,0.4),s:rnd(0.7,1.8),life:k==='spark'?rnd(20,40):1e9,max:40});}
 for(let i=0;i<8;i++)CT.parts.push({k:'dust',x:ix+rnd(-6,6),y:CTF-rnd(4,30),vx:rnd(-1,1)*0.6,vy:-rnd(0.1,0.5),r:3,life:90,max:90});
 if(front&&sev>0.45){// lökhárító-darab és fényszóró
  CT.parts.push({k:'bumper',x:ix-14,y:CTF-12,vx:-rnd(0.8,1.8),vy:-rnd(1,2.5),r:0,vr:-0.08,life:1e9});}}
function ctParts(sl){for(const p of CT.parts){p.life-=sl;
  if(p.k==='steam'||p.k==='dust'){p.x+=p.vx*sl;p.y+=p.vy*sl;p.r+=0.12*sl;continue;}
  p.x+=p.vx*sl;p.y+=p.vy*sl;p.r+=(p.vr||0)*sl;if(p.k!=='spark')p.vy+=0.22*sl;else p.vy+=0.12*sl;
  const gy=p.k==='wheel'?CTF-WR:CTF-0.5;if(p.y>gy){p.y=gy;if(p.k==='wheel'){p.vy*=-0.35;p.vx*=0.985;p.vr=p.vx/WR;}else{p.vy*=-0.25;p.vx*=0.55;p.vr*=0.5;}}}
 CT.parts=CT.parts.filter(p=>p.life>0&&p.x>-60&&p.x<360);if(CT.parts.length>160)CT.parts.splice(0,CT.parts.length-160);}
/* pontozás: sérülési kockázat testtájanként (zöld ... piros), csillagok */
function ctScore(){const T=CT_TESTS[CT.ti],s=ctSev(),c=v=>clamp(v,0,1);let head,neck,chest,legs;
 if(T.z==='f'){head=c((s-0.9)/2.2);neck=c((s-1)/2.5);chest=c((s-0.75)/2.2);legs=c((s-0.8)/2);}
 else{head=c((s-1)/2.2);neck=c((s-0.25)/1.2);chest=c((s-1.2)/2);legs=0;}
 const adult=Math.round(clamp(100-(head*30+neck*(T.z==='r'?45:20)+chest*30+legs*20)-4,12,97)),child=Math.round(clamp(100-(head*0.7*35+chest*0.7*35+neck*0.7*30)-6,10,95)),assist=84;
 const stars=adult>=80&&child>=80?5:adult>=70&&child>=70?4:adult>=58?3:adult>=42?2:adult>=28?1:0;
 const ri=v=>v<0.12?0:v<0.3?1:v<0.5?2:v<0.75?3:4;
 CT.res={stars:stars,adult:adult,child:child,assist:assist,parts:{head:ri(head),neck:ri(neck),chest:ri(chest),legs:ri(legs)},g:Math.round(18+26*s),hic:Math.round(140+460*Math.pow(s,1.4)),intr:Math.max(0,Math.round((CT.cr-14)*2.4))};
 PROF.ctBest=PROF.ctBest||{};const k=T.k+CT.v;if(!(PROF.ctBest[k]>=stars))PROF.ctBest[k]=stars;stat('crashtests');saveProf();if(typeof checkAwards==='function')checkAwards();
 const vt=['Nagyon veszélyes!','Gyenge védelem','Elfogadható védelem','Átlagos védelem','Jó védelem','Kiváló védelem!'][stars];speak(stars+' csillag. '+vt,'apa');MENU_SIG='?';}
/* ---- az autó szeletei: [u0,u1,k,ref,refPos] – az u helyi x a refPos+(u-ref)*k helyre kerül ---- */
function ctSlices(){const z=CT_TESTS[CT.ti].z,cr=CT.cr;
 if(z==='f'){const a=Math.min(cr,16),b=Math.max(0,cr-16),kA=(26-a)/26,kB=(26-b)/26;return [[-60,60,1,0,0],[60,86,kB,60,60],[86,160,kA,86,60+26*kB]];}
 const a=Math.min(cr,14),b=Math.max(0,cr-14),kA=(26-a)/26,kB=(26-b)/26;return [[-50,26,kA,26,52-26*kB],[26,52,kB,52,52],[52,180,1,52,52]];}
function ctMap(u){for(const s of ctSlices())if(u>=s[0]&&u<s[1])return s[4]+(u-s[3])*s[2];return u;}
function ctDummy(g,x,y,r,dx,kid){if(kid)frr(g,'#2b3a55',x-r*1.9,y-r*0.6,r*1.1,r*4.4,r*0.5);
 frr(g,'#e0b020',x-r*1.4+dx*0.35,y+r*0.9,r*2.7,r*2.4,r*0.7);line(g,'#30343b',x-r*1.1+dx*0.35,y+r*1.1,x+r*1.2+dx*0.3,y+r*3.2,r*0.34);
 R(g,'#3a3f47',x-r*0.25+dx*0.6,y+r*0.55,r*0.55,r*0.6);const hx=x+dx;disc(g,'#c99a12',hx,y+r*0.08,r);disc(g,'#f2c230',hx-r*0.06,y-r*0.02,r*0.94);ell(g,'#f2c230',hx+r*0.9,y+r*0.2,r*0.22,r*0.28);
 const tx=hx-r*0.2,ty=y-r*0.12,tr=r*0.46;disc(g,'#111',tx,ty,tr*1.12);disc(g,'#ffe14d',tx,ty,tr);g.fillStyle='#111';g.beginPath();g.moveTo(tx,ty);g.arc(tx,ty,tr,0,Math.PI/2);g.closePath();g.moveTo(tx,ty);g.arc(tx,ty,tr,Math.PI,Math.PI*1.5);g.closePath();g.fill();
 disc(g,'#3a3f47',hx+r*0.58,y-r*0.18,r*0.11);line(g,'#9a7410',hx+r*0.45,y+r*0.45,hx+r*0.8,y+r*0.42,r*0.08);}
function ctInner(g){const d=CT.hd;ctDummy(g,33.4,20.4,2.3,d*0.75,true);ctDummy(g,42.6,19.6,2.6,d*0.8,true);ctDummy(g,63.4,18.4,3.1,d*0.95);ctDummy(g,68,17.7,3.2,d);}
function ctMark(g,x,y,r){disc(g,'#111',x,y,r*1.15);disc(g,'#ffe14d',x,y,r);g.fillStyle='#111';g.beginPath();g.moveTo(x,y);g.arc(x,y,r,0,Math.PI/2);g.closePath();g.moveTo(x,y);g.arc(x,y,r,Math.PI,Math.PI*1.5);g.closePath();g.fill();}
function ctCar(g,t){const T=CT_TESTS[CT.ti],front=T.z==='f',x=CT.x,by=CTF-55.5,sev=ctSev(),e=CT.cr>0?clamp(CT.cr/Math.max(1,Math.min(30,(front?16:13)*Math.pow(sev,0.62))),0,1):0;
 const dm=clamp(sev*0.75*e,0,1),o={t:t,ang:CT.ang,live:true,noWheels:true,hide:{apa:1,anya:1,anna:1,petra:1,atti:1},inner:ctInner,airbag:CT.ab,dmg:dm,dz:front?{f:dm,s:dm*0.35,r:0}:{f:0,s:dm*0.3,r:dm},spd:0,pos:CT.ph==='run'||CT.ph==='count'||CT.ph==='ready'};
 g.save();g.translate(x+56,by+45);g.rotate(CT.pitch);g.translate(-(x+56),-(by+45));
 // olajfolt / hűtőfolyadék a padlón
 if(CT.puddle>0.02){const px=x+ctMap(100);ell(g,'rgba(60,140,90,'+(0.45*CT.puddle)+')',px,CTF+0.6,4+CT.puddle*16,1+CT.puddle*1.6);}
 for(const s of ctSlices()){// a vágás a szelet saját (összenyomás előtti) koordinátáiban
  g.save();g.translate(x+s[4],0);g.scale(s[2],1);g.translate(-(x+s[3]),0);g.beginPath();g.rect(x+s[0],-100,s[1]-s[0],400);g.clip();
  drawCarSide(g,x,by,by,o,null);
  for(const [mx,my] of [[10,34],[37,36],[63,36],[96,35],[50,13.6]])if(mx>=s[0]&&mx<s[1])ctMark(g,x+mx,by+my,1.9);
  if(s[2]<0.995){// gyűrődési redők, felgyűrt motorháztető
   const n=Math.ceil((1-s[2])*10),u0=Math.max(s[0],front?60:2),u1=Math.min(s[1],front?110:52);
   for(let i=0;i<n;i++){const ux=u0+(i+0.5)*(u1-u0)/n;g.strokeStyle='rgba(10,12,16,0.7)';g.lineWidth=0.9;g.beginPath();for(let j=0;j<=5;j++)g.lineTo(x+ux+(j%2?1.8:-1.8),by+30+j*3.4);g.stroke();
    g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.5;g.beginPath();for(let j=0;j<=5;j++)g.lineTo(x+ux+1+(j%2?1.8:-1.8),by+30+j*3.4);g.stroke();}
   if(front&&s[0]===86){const k=Math.min(7,CT.cr*0.4);g.fillStyle=CP.m;g.beginPath();g.moveTo(x+88,by+29.4);g.lineTo(x+95,by+29.6-k);g.lineTo(x+100,by+31-k*0.6);g.lineTo(x+106,by+32.6);g.closePath();g.fill();g.strokeStyle='#0c0f14';g.lineWidth=0.6;g.stroke();
    line(g,'rgba(255,255,255,0.5)',x+89,by+29.2,x+95,by+29.4-k,0.4);}}
  g.restore();}
 // kerekek (nem torzulnak, a gyűrődéssel hátrébb tolódnak)
 const wy=by+WCY;wheel(g,x+ctMap(WHEELS[0]),wy,CT.ang,false);
 if(!CT.lost)wheel(g,x+ctMap(WHEELS[1]),wy-Math.min(2.5,Math.max(0,CT.cr-14)*0.2),CT.ang,false);
 else{const hx=x+ctMap(WHEELS[1]),hy=wy+4;disc(g,'#4a4f56',hx,hy,5);disc(g,'#7d858d',hx,hy,3.8);disc(g,'#2b3037',hx,hy,1.4);}
 g.restore();}
/* mozgó akadály (hátsó teszthez) */
function ctTrolley(g,x){const y=CTF;frr(g,'#59616a',x+6,y-44,44,11,2);R(g,'rgba(255,255,255,0.2)',x+6,y-44,44,1);frr(g,'#2a2f36',x,y-34,58,24,2);frr(g,lg(g,0,y-40,0,y-12,[[0,'#e9edf1'],[1,'#9aa4ae']]),x+56,y-40,14,28,1.5);
 for(let k=0;k<6;k++)R(g,'rgba(0,0,0,0.25)',x+57+k*2.2,y-39,0.6,26);for(let k=0;k<7;k++)R(g,'rgba(0,0,0,0.18)',x+56,y-38+k*4,14,0.5);
 for(let k=0;k<8;k++)R(g,k%2?'#111':'#ffd84a',x+1+k*7,y-32,7,5);
 text(g,'MOZGÓ AKADÁLY',x+30,y-25,'#ffffff',0.45,'center',null);for(const wx of [x+12,x+50]){disc(g,'#15181c',wx,y-5,5);disc(g,'#8a939c',wx,y-5,2.4);}}
/* ---- rajz ---- */
function ctBG(){if(CTBG&&CTBG.sc===SC)return CTBG.c;const [c,g]=mk(W,H,SC),fy=CTF*CTS;
 g.fillStyle=lg(g,0,0,0,fy,[[0,'#121722'],[0.5,'#1d2433'],[1,'#2b3446']]);g.fillRect(0,0,W,fy);
 for(let x=0;x<W;x+=48){R(g,'rgba(255,255,255,0.035)',x,20,1,fy-20);R(g,'rgba(0,0,0,0.18)',x+1,20,1,fy-20);}
 R(g,'#0b0e14',0,0,W,18);for(let k=0;k<6;k++){const lx=24+k*84;frr(g,'#fdfbf0',lx,10,46,4,2);g.fillStyle=lg(g,0,14,0,90,[[0,'rgba(255,250,225,0.16)'],[1,'rgba(255,250,225,0)']]);g.beginPath();g.moveTo(lx,14);g.lineTo(lx+46,14);g.lineTo(lx+66,90);g.lineTo(lx-20,90);g.closePath();g.fill();}
 text(g,'TÖRÉSTESZT KÖZPONT',W/2+50,26,'#ffd84a',1.6,'center',null);text(g,'CSALÁDI BIZTONSÁGI VIZSGÁLAT',W/2+50,44,'#9fb0c2',0.8,'center',null);
 // mérőcsík a falon (fekete-fehér kockák) és magasságjelek
 const my=fy-122;for(let x=0;x<W;x+=7)R(g,((x/7)|0)%2?'#e9edf1':'#15181c',x,my,7,5);for(let x=0;x<W;x+=7)R(g,((x/7)|0)%2?'#15181c':'#e9edf1',x,my+5,7,5);
 for(let k=0;k<8;k++){R(g,'rgba(255,255,255,0.35)',8,fy-k*16,8,1);text(g,String(k*50),20,fy-k*16-2,'rgba(255,255,255,0.5)',0.5,'left',null);}
 // nagysebességű kamerák állványon
 for(const cx of [150,330]){line(g,'#3a404a',cx,fy-40,cx-8,fy-2,1.2);line(g,'#3a404a',cx,fy-40,cx+8,fy-2,1.2);line(g,'#3a404a',cx,fy-40,cx,fy-2,1.2);frr(g,'#22272f',cx-9,fy-50,18,10,2);disc(g,'#0b0d12',cx+9,fy-45,3.4);disc(g,'#3b6a9a',cx+9.4,fy-45.6,1.2);}
 // padló: világos beton, sín, sárga-fekete veszélycsík az akadály előtt
 g.fillStyle=lg(g,0,fy,0,H,[[0,'#9aa3ae'],[0.3,'#7d8692'],[1,'#4f5662']]);g.fillRect(0,fy,W,H-fy);R(g,'rgba(255,255,255,0.4)',0,fy,W,1);
 for(let k=0;k<8;k++)R(g,'rgba(0,0,0,0.08)',0,fy+5+k*6,W,1);R(g,'#2b3038',0,fy+12,(CTBX-6)*CTS,2.2);
 for(let x=(CTBX-30)*CTS;x<W;x+=10)poly(g,((x/10)|0)%2?'#111':'#ffd84a',[[x,fy+1],[x+10,fy+1],[x+6,fy+9],[x-4,fy+9]]);
 // betontömb (akadály)
 const bx=(CTBX+16)*CTS;g.fillStyle=lg(g,bx,0,W,0,[[0,'#b9bec4'],[0.3,'#9aa0a7'],[1,'#6c727a']]);g.fillRect(bx,fy-112*CTS*0.62,W-bx,112*CTS*0.62);
 for(let k=0;k<5;k++)R(g,'rgba(0,0,0,0.12)',bx,fy-112*CTS*0.62+k*22,W-bx,1);for(let x=bx;x<W;x+=8)poly(g,((x/8)|0)%2?'#111':'#ffd84a',[[x,fy-10],[x+8,fy-10],[x+4,fy-2],[x-4,fy-2]]);
 CTBG={c:c,sc:SC};return c;}
function drawCrash(g){if(!CT)return;const T=CT_TESTS[CT.ti],t=G.t;g.drawImage(ctBG(),0,0,W,H);
 g.save();if(CT.shake>0.3)g.translate(rnd(-CT.shake,CT.shake),rnd(-CT.shake,CT.shake)*0.6);g.scale(CTS,CTS);
 // akadály homloka: méhsejt (részleges átfedés) vagy acéllap erőmérő cellákkal (merev fal)
 if(T.k==='full'){frr(g,'#59616a',CTBX,CTF-72,16,72,1);for(let i=0;i<3;i++)for(let j=0;j<6;j++)frr(g,'#7d868f',CTBX+1.5+i*4.8,CTF-70+j*11.6,4,10.4,0.8);}
 else{const hx=CTBX+CT.hc;R(g,'#7d868f',CTBX+13,CTF-58,3,44);g.fillStyle=lg(g,hx,0,CTBX+16,0,[[0,'#eef2f5'],[1,'#a3adb7']]);g.fillRect(hx,CTF-54,CTBX+16-hx,38);
  g.strokeStyle='rgba(60,70,80,0.45)';g.lineWidth=0.4;g.beginPath();for(let k=0;k<9;k++){const yy=CTF-52+k*4.2;g.moveTo(hx,yy);g.lineTo(CTBX+16,yy);}for(let k=hx+1.2;k<CTBX+16;k+=2.4){g.moveTo(k,CTF-54);g.lineTo(k,CTF-16);}g.stroke();
  if(CT.hc>1){g.strokeStyle='rgba(20,24,30,0.6)';g.lineWidth=0.6;g.beginPath();g.moveTo(hx,CTF-54);for(let k=0;k<=8;k++)g.lineTo(hx+(k%2?1.6:-0.4),CTF-54+k*4.75);g.stroke();}}
 // árnyék, autó, akadálykocsi
 ell(g,'rgba(0,0,0,0.3)',CT.x+56+CT.cr*(T.z==='f'?0.5:-0.5),CTF+0.8,58,3.2);
 if(T.z==='r')ctTrolley(g,CT.tx);
 for(const p of CT.parts)if(p.k==='steam'||p.k==='dust'){const a=clamp(p.life/p.max,0,1)*(p.k==='dust'?0.35:0.4);disc(g,p.k==='dust'?'rgba(190,180,165,'+a.toFixed(2)+')':'rgba(235,240,245,'+a.toFixed(2)+')',p.x,p.y,p.r);}
 ctCar(g,t);
 for(const p of CT.parts){if(p.k==='steam'||p.k==='dust')continue;
  if(p.k==='wheel'){wheel(g,p.x,p.y,p.r,false);continue;}
  if(p.k==='bumper'){g.save();g.translate(p.x,p.y);g.rotate(p.r);frr(g,lg(g,0,-2,0,3,[[0,CP.l],[1,CP.dd]]),-7,-2,14,4.4,1.6);g.restore();continue;}
  if(p.k==='spark'){const a=clamp(p.life/30,0,1);line(g,'rgba(255,214,120,'+a.toFixed(2)+')',p.x,p.y,p.x-p.vx*1.6,p.y-p.vy*1.6,0.7);continue;}
  const s=p.s,c=p.k==='glass'?'rgba(205,235,250,0.9)':p.k==='frag'?CP.m:p.k==='hc'?'#cfd6dc':'#1d2228';g.save();g.translate(p.x,p.y);g.rotate(p.r);
  if(p.k==='glass')poly(g,c,[[-s,-s*0.4],[s,-s*0.7],[s*0.3,s*0.8]],0,0);else if(p.k==='frag')poly(g,c,[[-s*1.4,-s*0.5],[s*1.2,-s*0.8],[s*1.4,s*0.6],[-s,s*0.7]],0,0);else frr(g,c,-s,-s*0.5,s*2,s,0.3);g.restore();}
 g.restore();
 if(CT.flash>0.05)R(g,'rgba(255,255,255,'+(CT.flash*0.55).toFixed(2)+')',0,0,W,H);
 // felső sáv: teszt neve, sebesség
 frr(g,'rgba(10,13,20,0.78)',6,6,156,28,6);text(g,T.sh+' • '+CT.v+' km/h',12,11,'#ffd84a',1,'left',null);
 text(g,(CT.ph==='ready'?'Bábuk a helyükön, indulásra kész':CT.ph==='count'?'Visszaszámlálás...':CT.ph==='run'?'Sebesség: '+CT.ms.toFixed(1)+' km/h':CT.ph==='hit'?'Ütközés! t = '+Math.round(CT.f*16.7)+' ms':'Kiértékelés kész'),12,24,'#cfd6df',0.75,'left',null);
 if(CT.ph==='hit'&&CT.slow<0.9){const b=(t>>4)&1;frr(g,'rgba(120,10,10,0.85)',W-142,58,134,18,5);if(b)disc(g,'#ff4d4d',W-131,67,3.5);text(g,'LASSÍTOTT FELVÉTEL',W-122,63,'#ffffff',0.8,'left',null);}
 if(CT.ph==='count'){const n=3-Math.floor(CT.t/40),k=(CT.t%40)/40;if(n>0){const s=4.5-k*1.5;text(g,String(n),W/2,H/2-30-s*2,'rgba(255,216,74,'+(1-k*0.6).toFixed(2)+')',s,'center',null);}}
 if(CT.ph==='ready'&&PROF.ctBest){const b=PROF.ctBest[T.k+CT.v];if(b!==undefined){frr(g,'rgba(10,13,20,0.7)',6,38,136,16,5);text(g,'Eddigi legjobb:',12,42,'#9fb0c2',0.7,'left',null);for(let k=0;k<5;k++)ctStar(g,94+k*10,46,4,k<b?'#ffd84a':'rgba(255,255,255,0.18)');}}
 if(CT.ph==='result'&&CT.res)ctPanel(g);}
function ctStar(g,cx,cy,r,col){g.fillStyle=col;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*0.45:r;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}g.closePath();g.fill();}
function ctPanel(g){const r=CT.res,t=CT.t,a=clamp(t/18,0,1),x=6-(1-a)*40,y=40,w=232,h=166;g.save();g.globalAlpha=a;
 frr(g,'rgba(8,11,18,0.9)',x,y,w,h,10);g.strokeStyle='rgba(255,216,74,0.45)';g.lineWidth=1;rrect(g,x+0.5,y+0.5,w-1,h-1,10);g.stroke();
 text(g,'Eredmény',x+10,y+8,'#9fb0c2',0.8,'left',null);
 for(let k=0;k<5;k++){const tk=t-34-k*14,on=k<r.stars&&tk>=0,s=on?1+Math.max(0,0.5-tk/14)*0.8:1,cx=x+w-96+k*20,cy=y+13;ctStar(g,cx,cy,8.2*s,'rgba(0,0,0,0.35)');ctStar(g,cx,cy,7*s,on?'#ffd84a':'#2c3442');if(on)ctStar(g,cx-1,cy-1.2,3*s,'rgba(255,255,255,0.45)');}
 const vt=['Nagyon veszélyes!','Gyenge védelem','Elfogadható védelem','Átlagos védelem','Jó védelem','Kiváló védelem!'][r.stars],vc=['#ff5a4a','#ff8a5a','#ffb347','#ffd84a','#9be37a','#5bd06a'][r.stars];
 text(g,vt,x+10,y+26,vc,1.2,'left',null);
 const bar=(yy,lbl,v)=>{text(g,lbl,x+10,yy,'#cfd6df',0.7,'left',null);text(g,v+'%',x+150,yy,'#ffffff',0.8,'right',null);frr(g,'#222a36',x+10,yy+8,140,5,2.5);const c=v>=80?'#5bd06a':v>=60?'#ffd84a':v>=40?'#ff9a3c':'#ff5a4a';frr(g,c,x+10,yy+8,140*clamp(v/100,0,1)*clamp((t-20)/30,0,1),5,2.5);};
 bar(y+48,'Felnőtt utasok',r.adult);bar(y+70,'Gyermek utasok',r.child);bar(y+92,'Biztonsági rendszerek',r.assist);
 text(g,'Lassulás '+r.g+' g   HIC '+r.hic,x+10,y+116,'#9fb0c2',0.7,'left',null);text(g,'Utastér-behatolás: '+r.intr+' cm',x+10,y+128,'#9fb0c2',0.7,'left',null);
 const b=PROF.ctBest&&PROF.ctBest[CT_TESTS[CT.ti].k+CT.v];text(g,'Legjobb ezen a sebességen: '+(b||0)+' csillag',x+10,y+146,'#7d8794',0.65,'left',null);
 // bábu-ábra testtájankénti kockázattal (zöld = jó ... piros = rossz)
 const dx=x+w-44,dy=y+46,P=r.parts,C=i=>CT_COL[i];frr(g,'rgba(255,255,255,0.05)',dx-24,dy-6,62,104,6);
 disc(g,C(P.head),dx+7,dy+8,8);R(g,C(P.neck),dx+4,dy+16,6,5);frr(g,C(P.chest),dx-6,dy+21,26,24,4);frr(g,shade(C(P.chest),0.85),dx-6,dy+45,26,9,3);
 frr(g,C(P.chest),dx-13,dy+22,6,22,3);frr(g,C(P.chest),dx+21,dy+22,6,22,3);frr(g,C(P.legs),dx-5,dy+55,10,32,3);frr(g,C(P.legs),dx+9,dy+55,10,32,3);
 text(g,'Fej',dx+19,dy+4,'#cfd6df',0.5,'left',null);text(g,'Lábak',dx+20,dy+82,'#cfd6df',0.5,'left',null);
 g.restore();}
