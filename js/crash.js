/* ---------- TÖRÉSTESZT: ütközésvizsgáló csarnok, 300 m-es nekifutópálya, saját vezetés vagy vontatás, bábuk, lassított felvétel, lassulásgörbe, csillagos értékelés ----------
   Világkoordináták: 1 egység = az autó képpontja (az autó 112 egység = 4,4 m, tehát 1 m = CT_MU egység), a képernyőn CTS-szeres nagyításban; a kamera (cam) követi a mozgó járművet.
   Menetfizika valós mértékegységben (m/s): 96 kW-os motor, 1450 kg, 6 fokozat (kapcsoláskor rövid vonóerő-kiesés), légellenállás, gördülési ellenállás, motorfék, ABS-fék (9,2 m/s²).
   Ütközési impulzus: félszinusz lassulás, hossza T = 2·D/v, csúcsa A = π·v²/(4·D), ahol D a gyűrődési út.
   A gyűrődés: az autó szeletekre vágva, a gyűrődési zóna vízszintesen összenyomva (eleje: motortér, majd utastér). */
const CT_TESTS=[
 {k:'front',nm:'Frontális ütközés, részleges átfedés',sh:'Frontális 40%',v:64,z:'f',m:1},
 {k:'full',nm:'Teljes szélességű merev fal',sh:'Merev fal',v:50,z:'f',m:1.2},
 {k:'rear',nm:'Hátulról ütközés, mozgó akadály',sh:'Hátsó ütközés',v:50,z:'r',m:0.65}];
const CT_SPD=[30,40,50,64,80,100,130];
const CTS=1.55,CTF=148,CTBX=272,CT_COL=['#2fb34a','#f2d22e','#f39a2b','#9a5a2b','#d93a2f'];
const CT_MU=25.5,CT_L=300,CT_GR=[7.6,13,19,25.5,32,38.5],CT_TW=336,CT_STOP=8;
const CT_SURF=[{n:'Száraz',ic:'☀',k:'száraz beton',b:9.2,a:4.3},{n:'Vizes',ic:'💧',k:'vizes beton',b:6.6,a:3.4},{n:'Jeges',ic:'❄',k:'jeges, havas út',b:2.9,a:1.9}];
const ctMass=()=>1450+(CT.load?180:0);   // csomaggal: tetőbox + rögzítetlen bőröndök a csomagtartóban
let CT=null,CTBG=null;
const ctRef=()=>CT_TESTS[CT.ti].z==='f'?CTBX:100;                 // az ütközés helye (fal / álló autó hátulja)
const ctNose=()=>CT_TESTS[CT.ti].z==='f'?CT.x+112:CT.tx+70;        // a mozgó jármű eleje
const ctGap=()=>ctRef()-ctNose();
function ctDriving(){return !!CT&&G.state==='crash'&&(CT.ph==='run'||CT.ph==='count');}
function startCrash(){G.state='crash';G.st=0;G.paused=false;const ti=clamp((PROF.ctTest|0),0,CT_TESTS.length-1);CT={ti:ti,v:PROF.ctV||CT_TESTS[ti].v,own:PROF.ctOwn!==false,belt:PROF.ctBelt!==false,surf:clamp(PROF.ctSurf|0,0,2),load:!!PROF.ctLoad,cfg:false};ctReset();elog('info','Törésteszt megnyitva');}
function ctReset(){const T=CT_TESTS[CT.ti],front=T.z==='f';Object.assign(CT,{ph:'ready',t:0,f:0,x:front?CTBX-112-CT_L*CT_MU:100,vx:0,tx:front?-1e5:100-70-CT_L*CT_MU,tvx:0,cv:0,ang:0,cr:0,hc:0,pitch:0,hd:0,ab:0,parts:[],res:null,flash:0,shake:0,lost:false,slow:1,imp:false,puddle:0,ms:0,
  sp:0,gear:0,rpm:850,shift:0,still:0,moved:false,vi:0,vmax:0,skid:[],sk:null,bk0:null,bkv:0,brkPrev:false,thud:false,replay:false,box:0,i0:null});
 K.gas=K.brake=false;for(const id of ['bGas','bBr']){const el=document.getElementById(id);if(el)el.classList.remove('on');}MENU_SIG='?';}
const ctSev=()=>{const T=CT_TESTS[CT.ti];return Math.pow((CT.vi||CT.v)/64,2)*T.m*(T.z==='f'?ctMass()/1450:1);};
/* ütközési impulzus (az autó lassulása): D gyűrődési út [m], T időtartam [s], A csúcslassulás [m/s²] */
function ctPulse(){const T=CT_TESTS[CT.ti],front=T.z==='f',v=Math.max(0.5,(CT.vi||CT.v)/3.6),dv=front?v:v*0.55,
  D=Math.max(0.04,(front?(T.k==='full'?0.5:0.68):0.32)*Math.pow(v/(front?17.8:13.9),0.85)*(front?Math.sqrt(ctMass()/1450):1));return {D:D,T:2*D/dv,A:Math.PI*dv*dv/(4*D)};}
const ctKey=()=>{const T=CT_TESTS[CT.ti];return T.k+(CT.own?Math.round((CT.vi||0)/5)*5:CT.v)+(CT.belt?'':'n');};
function ctMenu(){if(CT.dest&&typeof wkMenu==='function'&&WK)return wkMenu();const T=CT_TESTS[CT.ti];if(CT.ph!=='ready'&&CT.ph!=='result')return null;
 if(CT.cfg){const it=[{a:'ctmode',l:CT.own?'Saját':'Automata',ic:CT.own?'🎮':'🤖'}];if(!CT.own)it.push({a:'ctspd',l:CT.v+' km/h',ic:'⏱'});
  it.push({a:'ctbelt',l:CT.belt?'Öv be':'Öv ki',ic:CT.belt?'🔒':'⚠'},{a:'ctsurf',l:CT_SURF[CT.surf].n,ic:CT_SURF[CT.surf].ic},{a:'ctload',l:CT.load?'Csomag':'Üres',ic:CT.load?'🧳':'▫'},{a:'ctcfg',l:'Kész',ic:'✓',c:'primary'});
  return {cls:'bottom ctm',items:it};}
 const it=[{a:'ctgo',l:CT.ph==='result'?'Újra':'Indítás',ic:'▶',c:'primary'}];
 if(CT.ph==='result'&&CT.res&&!CT.res.brake&&CT.i0)it.push({a:'ctrep',l:'Ismétlés',ic:'🎥'});
 it.push({a:'cttest',l:T.sh,ic:'🧪'},{a:'ctcfg',l:'Beállítás',ic:'⚙'},{a:'ctdest',l:'Roncsolás',ic:'🔨'},{a:'home',l:'Főmenü',ic:'⌂'});
 return {cls:'bottom ctm',items:it};}
function ctAction(a){if(!CT)return;if(/^wk/.test(a)&&typeof wkAction==='function'&&WK){wkAction(a);return;}if(a==='ctdest'){if(typeof startWreck==='function')startWreck(false);MENU_SIG='?';return;}const T=CT_TESTS[CT.ti];
 if(a==='ctgo'){CT.cfg=false;if(CT.ph==='result')ctReset();CT.ph='count';CT.t=0;initAudio();}
 else if(a==='cttest'){CT.ti=(CT.ti+1)%CT_TESTS.length;CT.v=CT_TESTS[CT.ti].v;PROF.ctTest=CT.ti;PROF.ctV=CT.v;saveProf();ctReset();toast(CT_TESTS[CT.ti].nm+(CT.own?'':', '+CT.v+' km/h'));}
 else if(a==='ctspd'){const i=CT_SPD.indexOf(CT.v);CT.v=CT_SPD[(i+1)%CT_SPD.length];PROF.ctV=CT.v;saveProf();ctReset();toast(T.sh+': '+CT.v+' km/h'+(CT.v>64?' (a szabványosnál gyorsabb!)':''));}
 else if(a==='ctmode'){CT.own=!CT.own;PROF.ctOwn=CT.own;saveProf();ctReset();toast(CT.own?'Saját vezetés: te gyorsítasz és fékezel ('+(isTouch?'GÁZ és FÉK pedál':'gáz: jobb nyíl vagy D, fék: bal nyíl vagy A')+'). A fénykapu méri az ütközési sebességet.':'Automata: a vontatórendszer pontosan '+CT.v+' km/h-val viszi az autót.',4200);}
 else if(a==='ctbelt'){CT.belt=!CT.belt;PROF.ctBelt=CT.belt;saveProf();ctReset();toast(CT.belt?'A bábuk bekötve, a gyerekek gyerekülésben.':'Öv nélkül! Nézd meg, mi történik a bábukkal. A valóságban mindig kösd be magad!',3800);}
 else if(a==='ctcfg')CT.cfg=!CT.cfg;
 else if(a==='ctrep')ctReplay();
 else if(a==='ctsurf'){CT.surf=(CT.surf+1)%CT_SURF.length;PROF.ctSurf=CT.surf;saveProf();ctReset();toast(['Száraz beton: a legjobb tapadás, ABS-szel kb. 9 m/s² lassulás.','Vizes beton: kb. 30%-kal hosszabb fékút, gyorsításkor is könnyebben kipörög a kerék.','Jeges, havas út: háromszor hosszabb fékút! Télen sokkal korábban kell fékezni.'][CT.surf],3800);}
 else if(a==='ctload'){CT.load=!CT.load;PROF.ctLoad=CT.load;saveProf();ctReset();toast(CT.load?'Csomaggal: +180 kg (tetőbox, bőröndök). Lassabban gyorsul, ütközéskor több az energia, és a rögzítetlen bőrönd előrerepül!':'Üres csomagtartó.',4000);}
 MENU_SIG='?';}
/* visszajátszás közeli kamerával: az ütközés újra, a mentett kiinduló állapotból (az értékelés nem változik) */
function ctReplay(){const i=CT.i0;if(!i)return;Object.assign(CT,{ph:'hit',f:0,t:0,x:i.x,tx:i.tx,ang:i.ang,tvx:i.tvx,x0:i.x,tvx0:i.tvx,cv:0,cr:0,hc:0,pitch:0,hd:0,ab:0,box:0,parts:[],imp:false,lost:false,puddle:0,thud:false,slow:0.08,flash:1,shake:0,replay:true,cfg:false});ctBang();MENU_SIG='?';}
/* ---- frissítés ---- */
/* üresben (visszaszámláláskor) a motor felpörgethető */
function ctIdle(gas){const tg=gas?4300:850;CT.rpm+=(tg-CT.rpm)*(tg>CT.rpm?0.09:0.05);engine(CT.rpm,gas?0.8:0.06);}
function ctDrive(front){const dt=1/60,tg=CT.v/3.6;let gas,brk;
 if(CT.own){gas=!!K.gas;brk=!!(K.brake||K.pump);}else{gas=CT.sp<tg-0.08;brk=false;}
 if(brk)gas=false;
 const kmh=CT.sp*3.6;let g=CT.gear;
 if(CT.shift>0)CT.shift--;
 else if(gas&&g<5&&kmh/CT_GR[g]*1000>5700){CT.gear=++g;CT.shift=13;}
 else if(g>0&&kmh/CT_GR[g]*1000<1500)CT.gear=--g;
 const wr=kmh/CT_GR[g]*1000,tr=CT.shift>0?Math.max(900,wr*0.92):g===0&&gas?Math.max(wr,2300):Math.max(gas?1000:800,wr);
 CT.rpm+=(tr-CT.rpm)*0.3;
 let a=0,hold=false;if(gas&&CT.shift===0)a=Math.min(CT_SURF[CT.surf].a,96000/(ctMass()*Math.max(CT.sp,2.5)));
 if(!CT.own&&!gas&&CT.sp>=tg-0.08){CT.sp=tg;hold=true;}
 else{const res=(CT.sp>0.05?0.15+0.00068*CT.sp*CT.sp+(gas?0:0.35):0)+(brk?CT_SURF[CT.surf].b:0);CT.sp=Math.max(0,CT.sp+(a-res)*dt);}
 engine(CT.rpm,gas&&CT.shift===0?1:hold?0.35:0.06);
 const dx=CT.sp*dt*CT_MU;if(dx>0)CT.moved=true;CT.ms=CT.sp*3.6;CT.vmax=Math.max(CT.vmax,CT.ms);
 if(front){CT.x+=dx;CT.ang+=dx/WR;const tp=brk&&CT.sp>0.3?0.024:gas&&CT.shift===0?-0.016*Math.min(1,a/3):0;CT.pitch+=(tp-CT.pitch)*0.12;}else CT.tx+=dx;
 // fékezés: kezdősebesség és -hely (a fékúthoz), halvány ABS-féknyom, gumisziszegés
 if(brk&&!CT.brkPrev&&CT.sp>0.5){CT.bk0=ctNose();CT.bkv=CT.ms;}CT.brkPrev=brk;
 if(brk&&CT.sp>4){const w0=front?CT.x+WHEELS[0]:CT.tx+12,w1=front?CT.x+WHEELS[1]:CT.tx+50;if(!CT.sk){CT.sk={a:w0,b:w1};CT.skid.push(CT.sk);if(CT.skid.length>12)CT.skid.shift();}CT.sk.b=w1;
  if(CT.t%(CT.surf===1?9:14)===0)noise(0.3,0.04+Math.min(0.08,CT.sp*0.003),0,2400);}else CT.sk=null;
 const gap=ctGap();
 if(gap<=0){if(front)CT.x+=gap;else CT.tx+=gap;const vi=CT.ms;
  if(vi<4){CT.sp=0;ctBrakeRes(0,true);return;}
  CT.vi=Math.round(vi*10)/10;CT.tvx=CT.vi*0.05;ctImpact();return;}
 if(CT.own&&CT.moved&&CT.sp===0&&!gas){if(++CT.still>70&&gap/CT_MU<CT_STOP)ctBrakeRes(gap/CT_MU,false);}else CT.still=0;}
/* fékpróba: megállás a fal (álló autó) előtt */
function ctBrakeRes(gm,touch){const cm=Math.round(gm*100),stars=touch?2:cm<=30?5:cm<=75?4:cm<=150?3:cm<=300?2:1,bd=CT.bk0!=null?Math.max(0,(ctNose()-CT.bk0)/CT_MU):0;
 CT.res={brake:true,touch:touch,gap:cm,stars:stars,bkv:CT.bkv,bd:bd};CT.ph='result';CT.t=0;engine(0,0);
 if(!touch&&(PROF.ctBrake==null||cm<PROF.ctBrake))PROF.ctBrake=cm;saveProf();
 if(touch){noise(0.25,0.25,0,500);vib(40);}
 speak(touch?'Hozzáértél a falhoz, de szerencsére lassan.':'Szép fékezés! '+(cm<100?cm+' centire':(cm/100).toFixed(1).replace('.',',')+' méterre')+' álltál meg.','apa');MENU_SIG='?';}
function updCrash(){if(!CT)return;if(CT.dest&&typeof updWreck==='function'){updWreck();return;}const T=CT_TESTS[CT.ti],front=T.z==='f',vv=(CT.vi||CT.v)*0.05;CT.t++;
 if(K.enterP&&(CT.ph==='ready'||(CT.ph==='result'&&CT.t>40))){SFX.click();ctAction('ctgo');}
 if(K.pauseP&&ctDriving()){ctReset();toast('Teszt megszakítva');return;}
 if(CT.flash>0)CT.flash*=0.8;if(CT.shake>0)CT.shake*=0.86;
 if(CT.ph==='ready'){ctIdle(false);return;}
 if(CT.ph==='count'){if(CT.t%40===1&&CT.t<120)tone(660,0.12,'square',0.07);if(CT.t===120){tone(1320,0.3,'square',0.08);CT.ph='run';CT.t=0;}ctIdle(CT.own&&K.gas);return;}
 if(CT.ph==='run'){ctDrive(front);return;}
 engine(0,0);
 if(CT.ph==='hit'){const sl=CT.slow,f=CT.f,sev=ctSev(),dur=6,u=clamp(f/dur,0,1),e=1-(1-u)*(1-u);
  const cm=Math.min(30,(front?16:13)*Math.pow(sev,0.62)),hm=CT.ti===0?Math.min(14,9*Math.sqrt(sev)):0;CT.cr=cm*e;CT.hc=hm*e;
  if(front){const rb=f>dur?(1.5+2.5*Math.min(1.5,sev))*(1-Math.exp(-(f-dur)/6)):0;CT.x=CT.x0+CT.cr+CT.hc-rb;
   const pk=0.065*Math.min(1.9,Math.sqrt(sev));CT.pitch=f<dur?pk*u:pk*Math.exp(-(f-dur)/8)*Math.cos((f-dur)*0.42);
   const dm=5.5*Math.min(1.7,Math.pow(sev,0.7));
   // bekötve: az öv megtartja a bábut, majd visszahúzza; öv nélkül a bábu tovább repül a kormánynak / műszerfalnak / szélvédőnek
   if(CT.belt)CT.hd=dm*Math.sin(Math.PI*clamp(f/16,0,1))*(f<16?1:0);
   else{CT.hd=Math.min(12,dm*2.3+1.5*Math.min(1,sev*3))*(f<9?Math.sin(Math.PI/2*f/9):1-0.5*clamp((f-9)/40,0,1));
    if(!CT.thud&&f>=9){CT.thud=true;noise(0.22,Math.min(0.4,0.1+sev*0.25),0,480);if(sev>0.2)for(let i=0;i<8;i++)CT.parts.push({k:'glass',x:CT.x+82+rnd(-3,3),y:CTF-44+rnd(-4,4),vx:rnd(-0.4,1.4),vy:-rnd(0.5,2),r:rnd(0,6),vr:rnd(-0.4,0.4),s:rnd(0.6,1.3),life:1e9,max:40});}}
   CT.ab=f<1?0:f<3?(f-1)/2:f<60?1:2;}
  else{// hátsó: a kocsi meglöki az autót
   const vC=CT.tvx0*0.55;if(f<dur)CT.cv=vC*u;else CT.cv=Math.max(0,CT.cv-0.06*vv*sl/3);CT.x+=CT.cv*sl;CT.ang+=CT.cv*sl/WR;
   CT.tvx=f<dur?lerp(CT.tvx0,vC*0.55,u):Math.max(0,CT.tvx-0.08*sl);CT.tx=f<dur?CT.x+CT.cr-70:CT.tx+CT.tvx*sl;
   const pk=0.035*Math.min(1.9,Math.sqrt(sev));CT.pitch=f<dur?-pk*u:-pk*Math.exp(-(f-dur)/8)*Math.cos((f-dur)*0.42);
   const dm=6*Math.min(1.6,Math.pow(sev,0.6))*(CT.belt?1:1.4);CT.hd=f<11?-dm*Math.sin(Math.PI*f/11):f<24?dm*0.45*Math.sin(Math.PI*(f-11)/13):0;CT.ab=0;}
  if(!CT.imp&&f>=0.4){CT.imp=true;ctDebris(sev,front);}
  if(sev>1.15&&front&&!CT.lost&&f>5){CT.lost=true;const wx=ctMap(89);CT.parts.push({k:'wheel',x:CT.x+wx,y:CTF-WR,vx:-1.6-sev*0.4,vy:-3,r:0,vr:-0.25,life:1e9});}
  if(f>dur&&f<200&&CT.t%3===0&&front&&sev>0.15){CT.parts.push({k:'steam',x:CT.x+112-CT.cr-6+rnd(-4,4),y:CTF-36+rnd(-4,4),vx:rnd(-0.3,0.2),vy:-rnd(0.3,0.7),r:2,life:70,max:70});}
  if(f>dur&&front&&sev>0.15)CT.puddle=Math.min(1,CT.puddle+0.004*sl);
  if(CT.t%32===16&&f<30)CT.flash=1;
  if(CT.load&&front)CT.box=16*clamp((f-1.5)/8,0,1)*Math.min(1,sev*3);
  CT.f+=sl;CT.slow=f<26?(CT.replay?0.08:0.14):Math.min(1,sl+0.025);
  ctParts(sl);if(CT.f>=110){CT.ph='result';if(CT.replay){CT.replay=false;CT.t=100;MENU_SIG='?';}else{CT.t=0;ctScore();}}return;}
 if(CT.ph==='result'){ctParts(1);if(CT.t%3===0&&CT.t<400&&front&&!CT.res.brake&&ctSev()>0.15)CT.parts.push({k:'steam',x:CT.x+112-CT.cr-6+rnd(-4,4),y:CTF-36,vx:rnd(-0.3,0.2),vy:-rnd(0.2,0.5),r:2,life:70,max:70});
  if(CT.res&&CT.t>=34&&CT.t<=34+14*4&&(CT.t-34)%14===0){const k=(CT.t-34)/14;if(k<CT.res.stars)tone(880+k*170,0.12,'square',0.07);}}}
function ctImpact(){const sev=ctSev();CT.i0={x:CT.x,tx:CT.tx,ang:CT.ang,tvx:CT.tvx};CT.ph='hit';CT.f=0;CT.t=0;CT.x0=CT.x;CT.tvx0=CT.tvx;CT.slow=0.14;CT.shake=Math.min(6,1+sev*3);CT.flash=1;engine(0,0);ctBang();}
function ctBang(){const sev=ctSev(),k=clamp(0.3+sev,0.3,1);
 if(AC){noise(0.9,Math.min(0.9,0.45+sev*0.2)*k,0,700);noise(0.5,0.35*k,0.02,3200);tone(70,0.5,'sawtooth',0.14*k,0,-40);if(sev>0.5)noise(0.35,0.25,0.12,5000);}
 vib(sev>1?[80,30,180]:[Math.round(30+60*k)]);}
/* törmelék: üvegszilánk, karosszériadarab, műanyag, méhsejt-alumínium, szikra, por (kis sebességnél alig) */
function ctDebris(sev,front){const n=Math.min(70,Math.round(3+sev*40)),ix=front?CTBX+CT.hc:CT.x+CT.cr,iy=CTF-30;
 for(let i=0;i<n;i++){const r=Math.random();let k=r<0.35?'glass':r<0.6?'frag':r<0.78?'plast':r<0.88&&CT.ti===0?'hc':'spark';
  const dir=front?-1:1;CT.parts.push({k:k,x:ix+rnd(-3,3),y:iy+rnd(-14,12),vx:dir*rnd(0.4,3.2)*(0.6+sev*0.4)+rnd(-0.6,0.6),vy:-rnd(0.5,4)*(0.7+sev*0.3),r:rnd(0,6),vr:rnd(-0.4,0.4),s:rnd(0.7,1.8),life:k==='spark'?rnd(20,40):1e9,max:40});}
 for(let i=0;i<Math.min(8,2+sev*8);i++)CT.parts.push({k:'dust',x:ix+rnd(-6,6),y:CTF-rnd(4,30),vx:rnd(-1,1)*0.6,vy:-rnd(0.1,0.5),r:3,life:90,max:90});
 if(front&&sev>0.45){// lökhárító-darab és fényszóró
  CT.parts.push({k:'bumper',x:ix-14,y:CTF-12,vx:-rnd(0.8,1.8),vy:-rnd(1,2.5),r:0,vr:-0.08,life:1e9});}}
function ctParts(sl){for(const p of CT.parts){p.life-=sl;
  if(p.k==='steam'||p.k==='dust'){p.x+=p.vx*sl;p.y+=p.vy*sl;p.r+=0.12*sl;continue;}
  p.x+=p.vx*sl;p.y+=p.vy*sl;p.r+=(p.vr||0)*sl;if(p.k!=='spark')p.vy+=0.22*sl;else p.vy+=0.12*sl;
  const gy=p.k==='wheel'?CTF-WR:CTF-0.5;if(p.y>gy){p.y=gy;if(p.k==='wheel'){p.vy*=-0.35;p.vx*=0.985;p.vr=p.vx/WR;}else{p.vy*=-0.25;p.vx*=0.55;p.vr*=0.5;}}}
 CT.parts=CT.parts.filter(p=>p.life>0&&p.x>-60&&p.x<360);if(CT.parts.length>160)CT.parts.splice(0,CT.parts.length-160);}
/* pontozás: sérülési kockázat testtájanként (zöld ... piros), csillagok; öv nélkül sokkal nagyobb a kockázat */
function ctScore(){const T=CT_TESTS[CT.ti],s=ctSev(),c=v=>clamp(v,0,1),pu=ctPulse();let head,neck,chest,legs;
 if(T.z==='f'){head=c((s-0.9)/2.2);neck=c((s-1)/2.5);chest=c((s-0.75)/2.2);legs=c((s-0.8)/2);}
 else{head=c((s-1)/2.2);neck=c((s-0.25)/1.2);chest=c((s-1.2)/2);legs=0;}
 if(!CT.belt){const pn=c(s*2.5)*(T.z==='f'?1:0.5);head=c(head+0.9*pn);chest=c(chest+0.6*pn);neck=c(neck+0.4*pn);legs=c(legs+0.4*pn);}
 const lp=CT.load&&T.z==='f'?Math.round(14*clamp(s*2,0,1)):0;
 const adult=Math.round(clamp(100-(head*30+neck*(T.z==='r'?45:20)+chest*30+legs*20)-4,12,97)),child=Math.round(clamp(100-(head*0.7*35+chest*0.7*35+neck*0.7*30)-6-lp,10,95)),assist=CT.belt?84:38;
 const stars=adult>=80&&child>=80?5:adult>=70&&child>=70?4:adult>=58?3:adult>=42?2:adult>=28?1:0;
 const ri=v=>v<0.12?0:v<0.3?1:v<0.5?2:v<0.75?3:4,vi=CT.vi||CT.v,ms=vi/3.6;
 CT.res={stars:stars,adult:adult,child:child,assist:assist,parts:{head:ri(head),neck:ri(neck),chest:ri(chest),legs:ri(legs)},g:Math.round(pu.A/9.81),hic:Math.round((140+460*Math.pow(s,1.4))*(CT.belt?1:2.6)),intr:Math.max(0,Math.round((CT.cr-14)*2.4)),
  vi:vi,E:Math.round(0.5*ctMass()*ms*ms/1000),lp:lp,hf:ms*ms/(2*9.81),ms:Math.round(pu.T*1000)};
 PROF.ctBest=PROF.ctBest||{};const k=ctKey();if(!(PROF.ctBest[k]>=stars))PROF.ctBest[k]=stars;stat('crashtests');saveProf();if(typeof checkAwards==='function')checkAwards();
 const vt=['Nagyon veszélyes!','Gyenge védelem','Elfogadható védelem','Átlagos védelem','Jó védelem','Kiváló védelem!'][stars];speak(Math.round(vi)+' kilométer per óra. '+stars+' csillag. '+vt+(CT.belt?'':' Öv nélkül életveszélyes!'),'apa');MENU_SIG='?';}
/* ---- az autó szeletei: [u0,u1,k,ref,refPos] – az u helyi x a refPos+(u-ref)*k helyre kerül ---- */
function ctSlices(){const z=CT_TESTS[CT.ti].z,cr=CT.cr;
 if(z==='f'){const a=Math.min(cr,16),b=Math.max(0,cr-16),kA=(26-a)/26,kB=(26-b)/26;return [[-60,60,1,0,0],[60,86,kB,60,60],[86,160,kA,86,60+26*kB]];}
 const a=Math.min(cr,14),b=Math.max(0,cr-14),kA=(26-a)/26,kB=(26-b)/26;return [[-50,26,kA,26,52-26*kB],[26,52,kB,52,52],[52,180,1,52,52]];}
function ctMap(u){for(const s of ctSlices())if(u>=s[0]&&u<s[1])return s[4]+(u-s[3])*s[2];return u;}
function ctDummy(g,x,y,r,dx,kid,nb){if(kid)frr(g,'#2b3a55',x-r*1.9,y-r*0.6,r*1.1,r*4.4,r*0.5);
 frr(g,'#e0b020',x-r*1.4+dx*0.35,y+r*0.9,r*2.7,r*2.4,r*0.7);if(!nb)line(g,'#30343b',x-r*1.1+dx*0.35,y+r*1.1,x+r*1.2+dx*0.3,y+r*3.2,r*0.34);
 R(g,'#3a3f47',x-r*0.25+dx*0.6,y+r*0.55,r*0.55,r*0.6);const hx=x+dx;disc(g,'#c99a12',hx,y+r*0.08,r);disc(g,'#f2c230',hx-r*0.06,y-r*0.02,r*0.94);ell(g,'#f2c230',hx+r*0.9,y+r*0.2,r*0.22,r*0.28);
 const tx=hx-r*0.2,ty=y-r*0.12,tr=r*0.46;disc(g,'#111',tx,ty,tr*1.12);disc(g,'#ffe14d',tx,ty,tr);g.fillStyle='#111';g.beginPath();g.moveTo(tx,ty);g.arc(tx,ty,tr,0,Math.PI/2);g.closePath();g.moveTo(tx,ty);g.arc(tx,ty,tr,Math.PI,Math.PI*1.5);g.closePath();g.fill();
 disc(g,'#3a3f47',hx+r*0.58,y-r*0.18,r*0.11);line(g,'#9a7410',hx+r*0.45,y+r*0.45,hx+r*0.8,y+r*0.42,r*0.08);}
function ctInner(g){const d=CT.hd,nb=!CT.belt;if(CT.load){const bx=9+CT.box;frr(g,'#7a4a22',bx,21,11,10,1.5);R(g,'#5a3416',bx+4.6,21,1.6,10);frr(g,'#2b2f36',bx+3.5,19.6,4,1.8,0.8);}ctDummy(g,33.4,20.4,2.3,d*0.75,true,nb);ctDummy(g,42.6,19.6,2.6,d*0.8,true,nb);ctDummy(g,63.4,18.4,3.1,d*0.95,false,nb);ctDummy(g,68,17.7,3.2,d,false,nb);}
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
/* ---- rajz ----
   ctBG: c = ismétlődő csarnok-csempe (CT_TW széles: oszlopok, lámpák, mérőcsík, padló, sín), e = a pálya vége (felirat, kamerák, veszélycsík, betontömb) átlátszó háttéren.
   Képkockánként csak 2-3 drawImage, a kamera mozgása a csempe eltolása. */
function ctBG(){if(CTBG&&CTBG.sc===SC)return CTBG;const fy=CTF*CTS,[c,g]=mk(CT_TW,H,SC),fl=gg=>lg(gg,0,fy,0,H,[[0,'#9aa3ae'],[0.3,'#7d8692'],[1,'#4f5662']]);
 g.fillStyle=lg(g,0,0,0,fy,[[0,'#121722'],[0.5,'#1d2433'],[1,'#2b3446']]);g.fillRect(0,0,CT_TW,fy);
 for(let x=0;x<CT_TW;x+=48){R(g,'rgba(255,255,255,0.035)',x,20,1,fy-20);R(g,'rgba(0,0,0,0.18)',x+1,20,1,fy-20);}
 R(g,'#0b0e14',0,0,CT_TW,18);for(let k=-1;k<5;k++){const lx=24+k*84;frr(g,'#fdfbf0',lx,10,46,4,2);g.fillStyle=lg(g,0,14,0,90,[[0,'rgba(255,250,225,0.16)'],[1,'rgba(255,250,225,0)']]);g.beginPath();g.moveTo(lx,14);g.lineTo(lx+46,14);g.lineTo(lx+66,90);g.lineTo(lx-20,90);g.closePath();g.fill();}
 const my=fy-122;for(let x=0;x<CT_TW;x+=7)R(g,((x/7)|0)%2?'#e9edf1':'#15181c',x,my,7,5);for(let x=0;x<CT_TW;x+=7)R(g,((x/7)|0)%2?'#15181c':'#e9edf1',x,my+5,7,5);
 g.fillStyle=fl(g);g.fillRect(0,fy,CT_TW,H-fy);R(g,'rgba(255,255,255,0.4)',0,fy,CT_TW,1);
 for(let k=0;k<8;k++)R(g,'rgba(0,0,0,0.08)',0,fy+5+k*6,CT_TW,1);R(g,'#2b3038',0,fy+12,CT_TW,2.2);
 const X0=60,[e,h]=mk(W-X0,H,SC);h.translate(-X0,0);
 text(h,'TÖRÉSTESZT KÖZPONT',W/2+50,26,'#ffd84a',1.6,'center',null);text(h,'CSALÁDI BIZTONSÁGI VIZSGÁLAT',W/2+50,44,'#9fb0c2',0.8,'center',null);
 // nagysebességű kamerák állványon
 for(const cx of [150,330]){line(h,'#3a404a',cx,fy-40,cx-8,fy-2,1.2);line(h,'#3a404a',cx,fy-40,cx+8,fy-2,1.2);line(h,'#3a404a',cx,fy-40,cx,fy-2,1.2);frr(h,'#22272f',cx-9,fy-50,18,10,2);disc(h,'#0b0d12',cx+9,fy-45,3.4);disc(h,'#3b6a9a',cx+9.4,fy-45.6,1.2);}
 // a sín a fal előtt véget ér; sárga-fekete veszélycsík az akadály előtt
 h.fillStyle=fl(h);h.fillRect((CTBX-6)*CTS,fy+11.6,W,3);
 for(let x=(CTBX-30)*CTS;x<W;x+=10)poly(h,((x/10)|0)%2?'#111':'#ffd84a',[[x,fy+1],[x+10,fy+1],[x+6,fy+9],[x-4,fy+9]]);
 // betontömb (akadály)
 const bx=(CTBX+16)*CTS;h.fillStyle=lg(h,bx,0,W,0,[[0,'#b9bec4'],[0.3,'#9aa0a7'],[1,'#6c727a']]);h.fillRect(bx,fy-112*CTS*0.62,W-bx,112*CTS*0.62);
 for(let k=0;k<5;k++)R(h,'rgba(0,0,0,0.12)',bx,fy-112*CTS*0.62+k*22,W-bx,1);for(let x=bx;x<W;x+=8)poly(h,((x/8)|0)%2?'#111':'#ffd84a',[[x,fy-10],[x+8,fy-10],[x+4,fy-2],[x-4,fy-2]]);
 CTBG={c:c,e:e,x0:X0,sc:SC};return CTBG;}
/* a pálya jelei a világban: távolságjelek 10 m-enként (50 m-enként tábla), rajtvonal, fénykapu, féknyomok */
function ctTrack(g,cam,Z){const ref=ctRef(),v0=cam-30,v1=cam+W/(CTS*(Z||1))+30;
 const d0=Math.max(10,Math.ceil((ref-v1)/CT_MU/10)*10),d1=Math.min(CT_L-10,Math.floor((ref-v0)/CT_MU/10)*10);
 for(let d=d0;d<=d1;d+=10){const mx=ref-d*CT_MU,big=d%50===0;R(g,'rgba(255,255,255,'+(big?0.6:0.35)+')',mx-0.5,CTF+1,1,big?22:7);
  if(big){frr(g,'rgba(10,13,20,0.75)',mx-15,CTF-108,30,11,2);text(g,d+' M',mx,CTF-105.5,'#ffd84a',0.7,'center',null);}}
 const sx=ref-CT_L*CT_MU;if(sx>v0&&sx<v1){for(let j=0;j<4;j++)for(let i=0;i<2;i++)R(g,(i+j)%2?'#111':'#f2f2f2',sx-4+i*2,CTF+j*5.5,2,5.5);frr(g,'rgba(10,13,20,0.75)',sx-16,CTF-108,32,11,2);text(g,'RAJT',sx,CTF-105.5,'#7cff7c',0.7,'center',null);}
 const gx=ref-CT_MU;if(gx>v0&&gx<v1){const on=ctNose()>=gx;R(g,'#3a404a',gx-0.8,CTF-66,1.6,66);frr(g,'#22272f',gx-3.2,CTF-74,6.4,9,1.2);disc(g,on?'#5bff6a':'#ff4d4d',gx,CTF-69.5,1.5);
  if(CT.ph!=='hit'&&CT.ph!=='result')text(g,'FÉNYKAPU',gx,CTF-81,'#9fb0c2',0.4,'center',null);}
 for(const s of CT.skid)if(s.b>v0&&s.a<v1)R(g,'rgba(18,20,24,0.3)',s.a,CTF-0.3,s.b-s.a,1.5);}
/* kamera: messze a faltól az autó a kép bal-közepén, a fal közelében (16 → 7 m) átúszik úgy, hogy a fal is látsszon */
function ctCam(){if(CT_TESTS[CT.ti].z!=='f')return Math.min(0,CT.tx-10);const k=clamp((16-(CTBX-112-Math.min(CT.x,CTBX-112))/CT_MU)/9,0,1);return Math.min(0,lerp(CT.x-140,0,k*k*(3-2*k)));}
function drawCrash(g){if(!CT)return;if(CT.dest&&WK&&typeof drawWreck==='function'){drawWreck(g);return;}const T=CT_TESTS[CT.ti],t=G.t,front=T.z==='f',B=ctBG(),rp=CT.replay,Z=rp?1.8:1,fy=CTF*CTS,
  cam=rp?(front?CTBX-10:CT.i0.x+10)-W*0.6/(CTS*Z):ctCam(),cs=cam*CTS;
 const off=((cs%CT_TW)+CT_TW)%CT_TW;for(let x=-off;x<W;x+=CT_TW)g.drawImage(B.c,x,0,CT_TW,H);
 if(!rp){const ex=B.x0-cs;if(ex<W)g.drawImage(B.e,ex,0,W-B.x0,H);}
 // útburkolat: vizes (sötétebb, csillogó) vagy jeges-havas (fehér réteg)
 if(CT.surf===1){R(g,'rgba(30,60,105,0.3)',0,fy,W,H-fy);R(g,'rgba(210,230,255,0.3)',0,fy+1.5,W,1.2);R(g,'rgba(210,230,255,0.12)',0,fy+16,W,3);}
 else if(CT.surf===2){R(g,'rgba(236,243,250,0.62)',0,fy,W,H-fy);R(g,'rgba(255,255,255,0.8)',0,fy,W,2);R(g,'rgba(160,190,220,0.25)',0,fy+9,W,1.5);}
 g.save();if(CT.shake>0.3)g.translate(rnd(-CT.shake,CT.shake),rnd(-CT.shake,CT.shake)*0.6);
 if(rp){g.translate(0,fy);g.scale(CTS*Z,CTS*Z);g.translate(-cam,-CTF);// közeli kamera: a padló vonala a helyén marad
  g.fillStyle=lg(g,CTBX+16,0,CTBX+90,0,[[0,'#b9bec4'],[0.3,'#9aa0a7'],[1,'#6c727a']]);g.fillRect(CTBX+16,CTF-69.4,120,69.4);for(let k=0;k<10;k++)poly(g,k%2?'#111':'#ffd84a',[[CTBX+16+k*5,CTF-6.5],[CTBX+21+k*5,CTF-6.5],[CTBX+18.5+k*5,CTF-1.3],[CTBX+13.5+k*5,CTF-1.3]]);}
 else{g.scale(CTS,CTS);g.translate(-cam,0);}
 ctTrack(g,cam,Z);
 // akadály homloka: méhsejt (részleges átfedés) vagy acéllap erőmérő cellákkal (merev fal)
 if(cam>-W/CTS){if(T.k==='full'){frr(g,'#59616a',CTBX,CTF-72,16,72,1);for(let i=0;i<3;i++)for(let j=0;j<6;j++)frr(g,'#7d868f',CTBX+1.5+i*4.8,CTF-70+j*11.6,4,10.4,0.8);}
 else{const hx=CTBX+CT.hc;R(g,'#7d868f',CTBX+13,CTF-58,3,44);g.fillStyle=lg(g,hx,0,CTBX+16,0,[[0,'#eef2f5'],[1,'#a3adb7']]);g.fillRect(hx,CTF-54,CTBX+16-hx,38);
  g.strokeStyle='rgba(60,70,80,0.45)';g.lineWidth=0.4;g.beginPath();for(let k=0;k<9;k++){const yy=CTF-52+k*4.2;g.moveTo(hx,yy);g.lineTo(CTBX+16,yy);}for(let k=hx+1.2;k<CTBX+16;k+=2.4){g.moveTo(k,CTF-54);g.lineTo(k,CTF-16);}g.stroke();
  if(CT.hc>1){g.strokeStyle='rgba(20,24,30,0.6)';g.lineWidth=0.6;g.beginPath();g.moveTo(hx,CTF-54);for(let k=0;k<=8;k++)g.lineTo(hx+(k%2?1.6:-0.4),CTF-54+k*4.75);g.stroke();}}}
 // árnyék, autó, akadálykocsi
 const carVis=CT.x+130>cam&&CT.x-20<cam+W/CTS;
 if(carVis)ell(g,'rgba(0,0,0,0.3)',CT.x+56+CT.cr*(front?0.5:-0.5),CTF+0.8,58,3.2);
 if(!front)ctTrolley(g,CT.tx);
 for(const p of CT.parts)if(p.k==='steam'||p.k==='dust'){const a=clamp(p.life/p.max,0,1)*(p.k==='dust'?0.35:0.4);disc(g,p.k==='dust'?'rgba(190,180,165,'+a.toFixed(2)+')':'rgba(235,240,245,'+a.toFixed(2)+')',p.x,p.y,p.r);}
 if(carVis)ctCar(g,t);
 for(const p of CT.parts){if(p.k==='steam'||p.k==='dust')continue;
  if(p.k==='wheel'){wheel(g,p.x,p.y,p.r,false);continue;}
  if(p.k==='bumper'){g.save();g.translate(p.x,p.y);g.rotate(p.r);frr(g,lg(g,0,-2,0,3,[[0,CP.l],[1,CP.dd]]),-7,-2,14,4.4,1.6);g.restore();continue;}
  if(p.k==='spark'){const a=clamp(p.life/30,0,1);line(g,'rgba(255,214,120,'+a.toFixed(2)+')',p.x,p.y,p.x-p.vx*1.6,p.y-p.vy*1.6,0.7);continue;}
  const s=p.s,c=p.k==='glass'?'rgba(205,235,250,0.9)':p.k==='frag'?CP.m:p.k==='hc'?'#cfd6dc':'#1d2228';g.save();g.translate(p.x,p.y);g.rotate(p.r);
  if(p.k==='glass')poly(g,c,[[-s,-s*0.4],[s,-s*0.7],[s*0.3,s*0.8]],0,0);else if(p.k==='frag')poly(g,c,[[-s*1.4,-s*0.5],[s*1.2,-s*0.8],[s*1.4,s*0.6],[-s,s*0.7]],0,0);else frr(g,c,-s,-s*0.5,s*2,s,0.3);g.restore();}
 g.restore();
 if(CT.flash>0.05)R(g,'rgba(255,255,255,'+(CT.flash*0.55).toFixed(2)+')',0,0,W,H);
 // felső sáv: teszt neve, mód, állapot
 const pu=CT.ph==='hit'||(CT.ph==='result'&&CT.res&&!CT.res.brake)?ctPulse():null;
 const st=T.sh+', '+(CT.own?'saját':CT.v+' km/h')+(CT.belt?'':', öv nélkül')+(CT.surf?', '+CT_SURF[CT.surf].n.toLowerCase():'')+(CT.load?', csomag':'');
 frr(g,'rgba(10,13,20,0.78)',6,6,Math.max(172,textW(st,0.8)+14),28,6);text(g,st,12,11,CT.belt?'#ffd84a':'#ff8a5a',0.8,'left',null);
 text(g,(CT.ph==='ready'?'Bábuk a helyükön, indulásra kész':CT.ph==='count'?'Visszaszámlálás...':CT.ph==='run'?'Sebesség: '+CT.ms.toFixed(1)+' km/h':CT.ph==='hit'?(rp?'Visszajátszás, ':'Ütközés ')+CT.vi.toFixed(1)+' km/h! t = '+Math.round(CT.f*pu.T/6*1000)+' ms':'Kiértékelés kész'),12,24,'#cfd6df',0.7,'left',null);
 if(CT.ph==='hit'&&(CT.slow<0.9||rp)){const b=(t>>4)&1;frr(g,rp?'rgba(20,60,120,0.88)':'rgba(120,10,10,0.85)',W-142,58,134,18,5);if(b)disc(g,'#ff4d4d',W-131,67,3.5);text(g,rp?'KÖZELI KAMERA':'LASSÍTOTT FELVÉTEL',W-122,63,'#ffffff',0.8,'left',null);}
 if(pu)ctChart(g,W-178,82,172,62,CT.ph==='hit'?CT.f*pu.T/6:null,pu);
 if(CT.ph==='count'){const n=3-Math.floor(CT.t/40),k=(CT.t%40)/40;if(n>0){const s=4.5-k*1.5;text(g,String(n),W/2,H/2-30-s*2,'rgba(255,216,74,'+(1-k*0.6).toFixed(2)+')',s,'center',null);}}
 if(CT.ph==='run'&&CT.t<40)text(g,'RAJT!',W/2,H/2-44,'rgba(124,255,124,'+(1-CT.t/40).toFixed(2)+')',3.6,'center',null);
 if(CT.ph==='ready'&&!CT.own&&PROF.ctBest){const b=PROF.ctBest[ctKey()];if(b!==undefined){frr(g,'rgba(10,13,20,0.7)',6,38,136,16,5);text(g,'Eddigi legjobb:',12,42,'#9fb0c2',0.7,'left',null);for(let k=0;k<5;k++)ctStar(g,94+k*10,46,4,k<b?'#ffd84a':'rgba(255,255,255,0.18)');}}
 // tipp a képernyő tetején
 const gm=ctGap()/CT_MU;let hn='';
 if(CT.ph==='ready')hn=CT.own?(isTouch?'Saját vezetés: GÁZ és FÉK pedál. Indítás után gyorsíts a fal felé!':'Saját vezetés: gáz = jobb nyíl vagy D, fék = bal nyíl vagy A'):'Automata: a vontatórendszer '+CT.v+' km/h-val viszi '+(front?'a falnak':'a mozgó akadályt');
 else if(CT.ph==='count'&&CT.own)hn='Üresben fel is pörgetheted a motort!';
 else if(CT.ph==='run'&&CT.own&&CT.sp===0&&CT.moved)hn=gm<CT_STOP?'Megálltál...':'Állsz. Gáz, vagy állj meg '+CT_STOP+' m-en belül (fékpróba)';
 else if(CT.ph==='run'&&CT.own&&CT.t<260)hn='Gyorsíts! A fénykapu méri a sebességet. Fékezni is szabad.';
 if(hn){const w=textW(hn,0.7)+14,cx=CT.ph==='ready'?W/2:(W+162)/2;frr(g,'rgba(10,13,20,0.72)',cx-w/2,40,w,14,6);text(g,hn,cx,44,'#ffffff',0.7,'center',null);}
 if(CT.ph==='count'||CT.ph==='run')ctSpeedo(g,gm);
 if(CT.ph==='result'&&CT.res)ctPanel(g);}
/* sebességmérő, fokozat, fordulatszám, távolság a faltól */
function ctSpeedo(g,gm){const x=6,y=38,front=CT_TESTS[CT.ti].z==='f';frr(g,'rgba(10,13,20,0.8)',x,y,150,56,8);
 text(g,String(Math.round(CT.sp*3.6)),x+60,y+7,'#ffffff',2.6,'right',null);text(g,'KM/H',x+64,y+18,'#9fb0c2',0.7,'left',null);
 text(g,String(CT.gear+1),x+124,y+5,CT.shift>0?'#9fb0c2':'#ffd84a',2,'center',null);text(g,'FOKOZAT',x+124,y+21,'#9fb0c2',0.45,'center',null);
 const rp=clamp(CT.rpm/6500,0,1);frr(g,'#222a36',x+8,y+31,134,5,2.5);frr(g,CT.rpm>5500?'#ff5a4a':CT.rpm>4200?'#ffd84a':'#5bd06a',x+8,y+31,134*rp,5,2.5);
 text(g,(front?'Fal':'Álló autó')+': '+Math.max(0,gm).toFixed(gm<10?1:0)+' m',x+8,y+42,gm<20?'#ff9a7a':'#cfd6df',0.75,'left',null);}
/* lassulásgörbe: az autó lassulása (g) az idő függvényében; tc = az eddig lejátszott idő (lassított felvételnél) */
function ctChart(g,x,y,w,h,tc,pu){const gpk=pu.A/9.81,tm=Math.max(0.1,pu.T*1.9),gmx=Math.max(10,Math.ceil(gpk*1.2/10)*10);
 frr(g,'rgba(8,11,18,0.85)',x,y,w,h,6);text(g,'Lassulás (g)',x+6,y+4,'#9fb0c2',0.55,'left',null);text(g,Math.round(tm*1000)+' ms',x+w-6,y+h-8,'#7d8794',0.5,'right',null);text(g,'0',x+6,y+h-8,'#7d8794',0.5,'left',null);
 const px=x+8,py=y+14,pw=w-16,ph=h-28;R(g,'rgba(255,255,255,0.18)',px,py+ph,pw,0.6);R(g,'rgba(255,255,255,0.18)',px,py,0.6,ph);
 const ag=tt=>tt<pu.T?Math.sin(Math.PI*tt/pu.T):tt<pu.T*1.5?-0.12*Math.sin(Math.PI*(tt-pu.T)/(pu.T*0.5)):0,lim=tc==null?tm:Math.min(tm,tc);
 g.strokeStyle='#ff9a3c';g.lineWidth=1.1;g.lineJoin='round';g.beginPath();for(let i=0;i<=36;i++){const tt=lim*i/36,xx=px+pw*tt/tm,yy=py+ph-ph*ag(tt)*gpk/gmx;i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();
 if(lim>pu.T/2){const xx=px+pw*(pu.T/2)/tm,yy=py+ph-ph*gpk/gmx;disc(g,'#ffd84a',xx,yy,1.4);text(g,Math.round(gpk)+' g',xx+4,yy-2,'#ffd84a',0.6,'left',null);}
 if(tc!=null&&tc<tm)R(g,'rgba(255,255,255,0.55)',px+pw*tc/tm,py,0.6,ph);
 text(g,'Ütközés: '+Math.round(pu.T*1000)+' ms, gyűrődés '+Math.round(pu.D*100)+' cm',x+w/2,y+h-8,'#cfd6df',0.5,'center',null);}
function ctStar(g,cx,cy,r,col){g.fillStyle=col;g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*0.45:r;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}g.closePath();g.fill();}
function ctPanel(g){const r=CT.res,t=CT.t,a=clamp(t/18,0,1),x=6-(1-a)*40,y=37,w=232,h=r.brake?112:164;g.save();g.globalAlpha=a;
 frr(g,'rgba(8,11,18,0.9)',x,y,w,h,10);g.strokeStyle='rgba(255,216,74,0.45)';g.lineWidth=1;rrect(g,x+0.5,y+0.5,w-1,h-1,10);g.stroke();
 text(g,r.brake?'Fékpróba':'Eredmény',x+10,y+8,'#9fb0c2',0.8,'left',null);
 for(let k=0;k<5;k++){const tk=t-34-k*14,on=k<r.stars&&tk>=0,s=on?1+Math.max(0,0.5-tk/14)*0.8:1,cx=x+w-96+k*20,cy=y+13;ctStar(g,cx,cy,8.2*s,'rgba(0,0,0,0.35)');ctStar(g,cx,cy,7*s,on?'#ffd84a':'#2c3442');if(on)ctStar(g,cx-1,cy-1.2,3*s,'rgba(255,255,255,0.45)');}
 if(r.brake){const gs=r.gap<100?r.gap+' cm':(r.gap/100).toFixed(2).replace('.',',')+' m';
  text(g,r.touch?'Hozzáértél a falhoz!':'Megálltál!',x+10,y+28,r.touch?'#ffb347':'#5bd06a',1.2,'left',null);
  if(!r.touch)text(g,'A fal előtt: '+gs,x+10,y+46,'#ffffff',0.8,'left',null);
  if(r.bkv>1){text(g,'Fékezés kezdete: '+Math.round(r.bkv)+' km/h',x+10,y+60,'#cfd6df',0.7,'left',null);text(g,'Fékút: '+r.bd.toFixed(1).replace('.',',')+' m (ABS, '+CT_SURF[CT.surf].k+')',x+10,y+72,'#cfd6df',0.7,'left',null);
   text(g,'+1 mp reakcióidő: még '+Math.round(r.bkv/3.6)+' m fék nélkül!',x+10,y+84,'#ffb347',0.7,'left',null);}
  else text(g,'Fék nélkül, gurulva álltál meg.',x+10,y+60,'#cfd6df',0.7,'left',null);
  text(g,'Legjobb: '+(PROF.ctBrake!=null?PROF.ctBrake+' cm':'-')+' a faltól',x+10,y+98,'#7d8794',0.65,'left',null);g.restore();return;}
 const vt=['Nagyon veszélyes!','Gyenge védelem','Elfogadható védelem','Átlagos védelem','Jó védelem','Kiváló védelem!'][r.stars],vc=['#ff5a4a','#ff8a5a','#ffb347','#ffd84a','#9be37a','#5bd06a'][r.stars];
 text(g,vt,x+10,y+26,vc,1.2,'left',null);
 const bar=(yy,lbl,v)=>{text(g,lbl,x+10,yy,'#cfd6df',0.7,'left',null);text(g,v+'%',x+150,yy,'#ffffff',0.8,'right',null);frr(g,'#222a36',x+10,yy+8,140,5,2.5);const c=v>=80?'#5bd06a':v>=60?'#ffd84a':v>=40?'#ff9a3c':'#ff5a4a';frr(g,c,x+10,yy+8,140*clamp(v/100,0,1)*clamp((t-20)/30,0,1),5,2.5);};
 bar(y+44,'Felnőtt utasok',r.adult);bar(y+64,'Gyermek utasok',r.child);bar(y+84,'Biztonsági rendszerek',r.assist);
 text(g,'Ütközés '+r.vi.toFixed(1).replace('.',',')+' km/h, lassulás '+r.g+' g',x+10,y+104,'#ffffff',0.7,'left',null);
 text(g,'HIC '+r.hic+', utastér-behatolás '+r.intr+' cm',x+10,y+115,'#9fb0c2',0.7,'left',null);
 text(g,'Energia '+r.E+' kJ = zuhanás '+Math.round(r.hf)+' m-ről',x+10,y+126,'#9fb0c2',0.7,'left',null);
 if(r.lp>0)text(g,'Rögzítetlen bőrönd: gyerekek -'+r.lp+' pont!',x+10,y+137,'#ffb347',0.65,'left',null);
 else if(CT.own&&CT.vmax>r.vi+3)text(g,'Fékezéssel '+Math.round(CT.vmax)+' km/h-ról lassítottál',x+10,y+137,'#9be37a',0.65,'left',null);
 if(!CT.belt)text(g,'ÖV NÉLKÜL: a bábuk a szélvédőnek csapódtak!',x+10,y+150,'#ff6a5a',0.65,'left',null);
 else{const b=PROF.ctBest&&PROF.ctBest[ctKey()];text(g,'Legjobb ezen a sebességen: '+(b||0)+' csillag',x+10,y+150,'#7d8794',0.65,'left',null);}
 // bábu-ábra testtájankénti kockázattal (zöld = jó ... piros = rossz)
 const dx=x+w-44,dy=y+42,P=r.parts,C=i=>CT_COL[i];frr(g,'rgba(255,255,255,0.05)',dx-24,dy-6,62,104,6);
 disc(g,C(P.head),dx+7,dy+8,8);R(g,C(P.neck),dx+4,dy+16,6,5);frr(g,C(P.chest),dx-6,dy+21,26,24,4);frr(g,shade(C(P.chest),0.85),dx-6,dy+45,26,9,3);
 frr(g,C(P.chest),dx-13,dy+22,6,22,3);frr(g,C(P.chest),dx+21,dy+22,6,22,3);frr(g,C(P.legs),dx-5,dy+55,10,32,3);frr(g,C(P.legs),dx+9,dy+55,10,32,3);
 text(g,'Fej',dx+19,dy+4,'#cfd6df',0.5,'left',null);text(g,'Lábak',dx+20,dy+82,'#cfd6df',0.5,'left',null);
 g.restore();}
