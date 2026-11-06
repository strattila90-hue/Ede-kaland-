'use strict';
/* =========================================================
   MINIJÁTÉKOK – kaparós sorsjegy, bikázás, rakodás, zöldségszortírozás,
   autópálya-matrica
   ========================================================= */
var MG=null;
cv.addEventListener('pointermove',e=>{if(!HOLD)return;const r=cv.getBoundingClientRect();HOLD.x=(e.clientX-r.left)/r.width*W;HOLD.y=(e.clientY-r.top)/r.height*H;});
function vib(ms){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
function startMini(type,opt){MG={type:type,t:0,opt:opt||{},phase:'play',reward:0,msg:''};const init=MINI[type].init;if(init)init(MG);}
function endMini(){const m=MG;MG=null;if(m.reward)book(m.reward,m.type==='scratch'?'lottery':'income',{scratch:'Kaparós sorsjegy nyeremény',jump:'Segítség: bikázás',truck:'Segítség: kamionos rakodás',sort:'Munka: zöldségszortírozás'}[m.type]||'Bevétel');if(m.opt.onEnd)m.opt.onEnd(m.reward,m);}
function updMini(){MG.t++;MINI[MG.type].upd(MG);}
function drawMini(g){R(g,'rgba(8,10,18,0.82)',0,0,W,H);MINI[MG.type].draw(g,MG);}
function mbtn(g,r,l,col,on){frr(g,on?shade(col,1.3):col,r[0],r[1],r[2],r[3],5);g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.8;rrect(g,r[0],r[1],r[2],r[3],5);g.stroke();text(g,l,r[0]+r[2]/2,r[1]+r[3]/2-3.5,'#ffffff',1,'center');}
function panel(g,x,y,w,h,title,col){frr(g,'rgba(18,22,34,0.96)',x,y,w,h,8);g.strokeStyle=col||'#ffd84a';g.lineWidth=1.2;rrect(g,x,y,w,h,8);g.stroke();if(title)text(g,title,x+w/2,y+8,col||'#ffd84a',1.4,'center');}

/* ---- zöldségek, gyümölcsök rajza ---- */
const PRODUCE=[
 {n:'Paradicsom',c:0,d:(g,x,y)=>{disc(g,'#e53935',x,y,7);disc(g,'rgba(255,255,255,0.3)',x-2.5,y-2.5,2);poly(g,'#2e7d32',[[-4,-6],[0,-4],[4,-6],[1,-8],[-1,-8]],x,y);}},
 {n:'Piros alma',c:0,d:(g,x,y)=>{disc(g,'#c62828',x-2,y,6);disc(g,'#c62828',x+2,y,6);disc(g,'rgba(255,255,255,0.3)',x-3,y-2,1.8);line(g,'#5d4037',x,y-6,x+1,y-10,1);ell(g,'#43a047',x+3,y-9,2.4,1.2);}},
 {n:'Eper',c:0,d:(g,x,y)=>{g.fillStyle='#e53935';g.beginPath();g.moveTo(x-6,y-4);g.quadraticCurveTo(x,y-7,x+6,y-4);g.quadraticCurveTo(x+4,y+6,x,y+8);g.quadraticCurveTo(x-4,y+6,x-6,y-4);g.fill();for(let i=0;i<7;i++)disc(g,'#ffe082',x-3+hsh(i)*6,y-2+hsh(i+9)*7,0.4);poly(g,'#2e7d32',[[-5,-5],[0,-3],[5,-5],[0,-8]],x,y);}},
 {n:'Piros paprika',c:0,d:(g,x,y)=>{frr(g,'#d32f2f',x-6,y-6,12,14,5);disc(g,'rgba(255,255,255,0.25)',x-3,y-2,1.6);frr(g,'#2e7d32',x-1,y-10,2,5,1);}},
 {n:'Banán',c:1,d:(g,x,y)=>{g.strokeStyle='#fdd835';g.lineWidth=5;g.lineCap='round';g.beginPath();g.arc(x,y-8,12,0.5,2.6);g.stroke();g.strokeStyle='#f9a825';g.lineWidth=1;g.beginPath();g.arc(x,y-8,13.5,0.6,2.5);g.stroke();}},
 {n:'Citrom',c:1,d:(g,x,y)=>{ell(g,'#fff176',x,y,8,6);disc(g,'#fff176',x+8,y,1.6);disc(g,'#fff176',x-8,y,1.6);disc(g,'rgba(255,255,255,0.4)',x-3,y-2,1.6);}},
 {n:'Sárga paprika',c:1,d:(g,x,y)=>{frr(g,'#fbc02d',x-6,y-6,12,14,5);disc(g,'rgba(255,255,255,0.3)',x-3,y-2,1.6);frr(g,'#2e7d32',x-1,y-10,2,5,1);}},
 {n:'Kukorica',c:1,d:(g,x,y)=>{ell(g,'#fbc02d',x,y,4,9);for(let i=-3;i<4;i++)line(g,'rgba(150,100,0,0.35)',x-3,y+i*2.2,x+3,y+i*2.2,0.4);poly(g,'#7cb342',[[-6,4],[0,10],[-2,-2]],x,y);poly(g,'#7cb342',[[6,4],[0,10],[2,-2]],x,y);}},
 {n:'Uborka',c:2,d:(g,x,y)=>{frr(g,'#2e7d32',x-11,y-4,22,8,4);for(let i=0;i<5;i++)disc(g,'#66bb6a',x-7+i*3.5,y-1,0.6);}},
 {n:'Brokkoli',c:2,d:(g,x,y)=>{frr(g,'#9ccc65',x-2,y,4,8,1.5);for(const [dx,dy] of [[-5,-2],[0,-5],[5,-2],[-2,1],[3,1]])disc(g,'#388e3c',x+dx,y+dy,4);}},
 {n:'Zöld alma',c:2,d:(g,x,y)=>{disc(g,'#7cb342',x-2,y,6);disc(g,'#7cb342',x+2,y,6);disc(g,'rgba(255,255,255,0.3)',x-3,y-2,1.8);line(g,'#5d4037',x,y-6,x+1,y-10,1);}},
 {n:'Cukkini',c:2,d:(g,x,y)=>{frr(g,'#1b5e20',x-12,y-3.5,24,7,3.5);line(g,'#66bb6a',x-9,y-1,x+9,y-1,0.5);frr(g,'#8d6e63',x+10,y-1.5,3,3,1);}},
 {n:'Szilva',c:3,d:(g,x,y)=>{ell(g,'#6a1b9a',x,y,6,7);disc(g,'rgba(255,255,255,0.25)',x-2,y-3,1.5);line(g,'#5d4037',x,y-7,x+1,y-10,1);}},
 {n:'Padlizsán',c:3,d:(g,x,y)=>{g.fillStyle='#4a148c';g.beginPath();g.ellipse(x+2,y+2,6,9,0.5,0,TAU);g.fill();poly(g,'#2e7d32',[[-6,-8],[0,-5],[4,-9],[-1,-11]],x,y);}},
 {n:'Szőlő',c:3,d:(g,x,y)=>{for(const [dx,dy] of [[-4,-4],[0,-4],[4,-4],[-2,0],[2,0],[0,4],[-4,0],[4,0],[0,8]])disc(g,'#7b1fa2',x+dx,y+dy,2.6);line(g,'#5d4037',x,y-7,x+2,y-11,1);}},
 {n:'Lilahagyma',c:3,d:(g,x,y)=>{ell(g,'#8e24aa',x,y+1,7,6.5);g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=0.5;g.beginPath();g.ellipse(x,y+1,4,6,0,0,TAU);g.stroke();poly(g,'#7cb342',[[-1,-5],[1,-5],[0,-11]],x,y);}}];
const CRATES=[['Piros','#e53935'],['Sárga','#fdd835'],['Zöld','#43a047'],['Lila','#8e24aa']];

const MINI={
 /* ---- kaparós sorsjegy ---- */
 scratch:{init(m){const amounts=[500,1000,2000,5000,10000,20000,100000];const r=Math.random();let win=0;
   if(r<0.02)win=100000;else if(r<0.07)win=20000;else if(r<0.17)win=5000;else if(r<0.4)win=1000;
   let f=[];if(win){f=[win,win,win];}while(f.length<6){const a=pick(amounts.filter(x=>x!==win));if(f.filter(x=>x===a).length<2)f.push(a);}
   const mu=m.opt.mult||1;m.fields=f.sort(()=>Math.random()-0.5).map(v=>v*mu);m.win=win*mu;const [c,x]=mk(300,150,SC);m.mask=c;m.mg=x;
   x.fillStyle=lg(x,0,0,300,150,[[0,'#c9ced6'],[0.5,'#eef1f4'],[1,'#aeb5bf']]);x.fillRect(0,0,300,150);for(let i=0;i<40;i++){x.fillStyle='rgba(255,255,255,0.25)';x.fillRect(hsh(i)*300,hsh(i+3)*150,8,1);}
   for(let i=0;i<6;i++){const fx=12+(i%3)*96,fy=10+Math.floor(i/3)*70;text(x,'?',fx+42,fy+22,'#8a929c',3,'left',null);}
   m.cells=new Array(60*30).fill(0);m.cov=0;m.last=null;},
  upd(m){const card=[90,62,300,150];const p=HOLD&&inRect(HOLD,card)?{x:HOLD.x-90,y:HOLD.y-62}:null;
   let pts=[];if(p)pts.push(p);if(K.pump&&m.phase==='play'){const a=m.t*0.35;pts.push({x:150+Math.cos(a)*(20+m.t%120),y:75+Math.sin(a*1.3)*55});}
   if(m.phase==='play'){for(const q of pts){const x=m.mg;x.globalCompositeOperation='destination-out';x.lineWidth=12;x.lineCap='round';x.beginPath();x.moveTo((m.last||q).x,(m.last||q).y);x.lineTo(q.x,q.y);x.stroke();x.beginPath();x.arc(q.x,q.y,6,0,TAU);x.fill();x.globalCompositeOperation='source-over';
     for(let cy=Math.floor((q.y-7)/5);cy<=Math.floor((q.y+7)/5);cy++)for(let cx=Math.floor((q.x-7)/5);cx<=Math.floor((q.x+7)/5);cx++)if(cx>=0&&cx<60&&cy>=0&&cy<30&&!m.cells[cy*60+cx]){m.cells[cy*60+cx]=1;m.cov++;}
     if(m.t%3===0)noise(0.03,0.04,0,4000);m.last=q;}
    if(!pts.length)m.last=null;
    if(m.cov>60*30*0.72||inRect(TAP,[160,222,160,22])||K.enterKey&&m.t>20)m.phase='reveal',m.rt=0;}
   else{m.rt++;if(m.rt===1){m.reward=m.win;if(m.win){SFX.win();vib([60,40,60]);}else tone(220,0.3,'triangle',0.06);}
    if(m.rt>30&&(K.enterP||TAP))endMini();}},
  draw(g,m){panel(g,70,30,340,226,'Kaparós sorsjegy','#ffd84a');text(g,'Három egyforma összeg = nyeremény!',W/2,51,'#ffffff',1,'center');
   frr(g,lg(g,90,62,390,212,[[0,'#ffe082'],[1,'#ffb300']]),90,62,300,150,6);
   m.fields.forEach((a,i)=>{const fx=102+(i%3)*96,fy=72+Math.floor(i/3)*70;frr(g,'#fff8e1',fx,fy,84,60,4);const hit=m.win&&a===m.win&&m.phase==='reveal';text(g,fmt(a),fx+42,fy+18,hit?'#d32f2f':'#5d4037',a>=100000?1.4:1.8,'center',null);text(g,'Ft',fx+42,fy+40,'#8d6e63',1,'center',null);});
   if(m.phase==='play')g.drawImage(m.mask,90,62,300,150);else{const a=Math.max(0,1-m.rt/20);if(a>0){g.globalAlpha=a;g.drawImage(m.mask,90,62,300,150);g.globalAlpha=1;}}
   if(m.phase==='play'){mbtn(g,[160,222,160,22],'Mindet lekaparom','#555c66');text(g,isTouch?'Kapard le az ujjaddal!':'Kapard egérrel, vagy tartsd a Space-t',W/2,250,'#9fb0c2',1,'center');}
   else{text(g,m.win?'Nyertél '+fmt(m.win)+' Ft-ot!':'Most nem nyert, legközelebb!',W/2,224,m.win?'#7cff7c':'#ff8a8a',1.6,'center');if(m.rt>30)text(g,isTouch?'Érintsd meg: tovább':'Enter: tovább',W/2,246,'#cfd6df',1,'center');}}},

 /* ---- bikázás: lemerült akkumulátor ---- */
 jump:{init(m){m.order=['B+','A+','A-','GND'];m.done=[];m.time=60*25;m.spark=0;m.hold=0;
   m.T={'A+':[118,150],'A-':[146,150],'B+':[334,150],'B-':[362,150],GND:[392,186]};m.keys={'1':'A+','2':'A-','3':'B+','4':'B-','5':'GND'};},
  upd(m){if(m.phase==='play'){m.time--;if(m.spark>0)m.spark--;const names=Object.keys(m.T);let pickd=null;
    for(const n of names){const p=m.T[n];if(TAP&&Math.hypot(TAP.x-p[0],TAP.y-p[1])<9)pickd=n;}
    if(K.num>0)pickd=m.keys[String(K.num)];
    if(pickd&&!m.done.includes(pickd)){if(pickd===m.order[m.done.length]){m.done.push(pickd);SFX.clunk();}else{m.spark=20;m.time-=180;SFX.pop();vib(120);m.msg='Szikra! Rossz sorrend: -3 mp';}}
    if(m.done.length===4){m.phase='start';m.msg='';}
    if(m.time<=0){m.phase='fail';m.rt=0;}}
   else if(m.phase==='start'){const h=K.pump||K.enterP||(HOLD&&inRect(HOLD,[180,226,120,22]));if(h){m.hold++;if(m.hold%6===0)tone(60+m.hold,0.08,'sawtooth',0.05);}if(m.hold>45){m.phase='ok';m.rt=0;m.reward=8000+Math.round(Math.random()*7)*1000;SFX.win();vib([50,30,50]);}}
   else{m.rt=(m.rt||0)+1;if(m.rt>30&&(K.enterP||TAP))endMini();}},
  draw(g,m){panel(g,40,22,400,240,'Bikázás: segíts a lerobbant autósnak!','#7fd1ff');
   for(const [bx,lbl] of [[90,'A te autód (jó akku)'],[306,'Lerobbant autó']]){frr(g,'#2a2f38',bx-10,120,110,92,6);text(g,lbl,bx+45,112,'#cfd6df',1,'center');frr(g,'#1b1f26',bx+8,146,64,38,3);frr(g,'#3a3f47',bx+8,146,64,6,2);text(g,'12V',bx+40,166,'#9fb0c2',1,'center',null);}
   frr(g,'#6b7480',380,180,24,14,3);
   const lab={'A+':'1','A-':'2','B+':'3','B-':'4',GND:'5'};
   for(const n in m.T){const p=m.T[n],pos=n.endsWith('+');disc(g,n==='GND'?'#9aa3ad':pos?'#d32f2f':'#222',p[0],p[1],5.5);text(g,n==='GND'?'test':pos?'+':'-',p[0],p[1]-3.4,'#fff',1,'center',null);text(g,lab[n],p[0],p[1]+8,'#ffd84a',1,'center');}
   const pts=m.done.map(n=>m.T[n]);if(pts.length>=1){const a=m.T['B+'],b=pts.length>=2?m.T['A+']:[220,236];g.strokeStyle='#e53935';g.lineWidth=2.2;g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo((a[0]+b[0])/2,240,b[0],b[1]);g.stroke();}
   if(pts.length>=3){const a=m.T['A-'],b=pts.length>=4?m.T.GND:[240,238];g.strokeStyle='#111';g.lineWidth=2.2;g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo((a[0]+b[0])/2,246,b[0],b[1]);g.stroke();}
   const steps=['Piros csipesz: lemerült akku + (3)','Piros csipesz: jó akku + (1)','Fekete csipesz: jó akku - (2)','Fekete csipesz: lerobbant motor fém test (5)'];
   steps.forEach((s,i)=>text(g,(i<m.done.length?'v ':(i+1)+'. ')+s,56,44+i*10,i<m.done.length?'#7cff7c':i===m.done.length?'#ffffff':'#7a8594'));
   if(m.spark>0){for(let k=0;k<6;k++)line(g,'#fff59d',m.T['A+'][0],m.T['A+'][1],m.T['A+'][0]+rnd(-12,12),m.T['A+'][1]+rnd(-12,12),0.8);}
   if(m.msg)text(g,m.msg,W/2,214,'#ff8a8a',1,'center');
   if(m.phase==='play'){frr(g,'#2a2f3a',300,86,120,5,2);frr(g,'#ffb347',300,86,120*Math.max(0,m.time)/(60*25),5,2);text(g,'Idő',294,85,'#ffb347',1,'right');text(g,isTouch?'Érintsd a pólusokat sorrendben':'Érintsd a pólusokat, vagy 1-5',W/2,250,'#9fb0c2',1,'center');}
   if(m.phase==='start'){mbtn(g,[180,226,120,22],'Tartsd: indítás','#2e8b57',m.hold>0);frr(g,'#2a2f3a',180,250,120,4,2);frr(g,'#5bd06a',180,250,120*Math.min(1,m.hold/45),4,2);}
   if(m.phase==='ok'){text(g,'Beindult! A sofőr hálából ad '+fmt(m.reward)+' Ft-ot.',W/2,226,'#7cff7c',1.2,'center');if(m.rt>30)text(g,'Tovább: Enter / érintés',W/2,244,'#cfd6df',1,'center');}
   if(m.phase==='fail'){text(g,'Kifutottál az időből, a sofőr autómentőt hívott.',W/2,226,'#ff8a8a',1,'center');if(m.rt>30)text(g,'Tovább: Enter / érintés',W/2,244,'#cfd6df',1,'center');}}},

 /* ---- kamionos: rakomány visszapakolása ---- */
 truck:{init(m){m.cart=W/2;m.boxes=[];m.caught=0;m.lost=0;m.spawned=0;m.total=14;m.next=30;},
  upd(m){if(m.phase==='play'){if(K.brake)m.cart-=4;if(K.gas)m.cart+=4;if(HOLD)m.cart+=clamp(HOLD.x-m.cart,-5,5);m.cart=clamp(m.cart,80,400);
    if(--m.next<=0&&m.spawned<m.total){m.boxes.push({x:rnd(90,390),y:40,v:0.8+m.spawned*0.07,s:rnd(10,16),c:pick(['#b07a42','#c8955a','#8a5a2b'])});m.spawned++;m.next=Math.max(28,70-m.spawned*3);}
    for(const b of m.boxes){b.y+=b.v;b.v+=0.02;if(!b.done&&b.y>=212&&Math.abs(b.x-m.cart)<24){b.done='ok';m.caught++;SFX.clunk();}else if(!b.done&&b.y>=236){b.done='lost';m.lost++;SFX.bump();vib(60);}}
    m.boxes=m.boxes.filter(b=>!b.done);if(m.spawned>=m.total&&!m.boxes.length){m.phase='end';m.rt=0;m.reward=m.caught*900+(m.lost===0?5000:0);SFX.win();}}
   else{m.rt++;if(m.rt>30&&(K.enterP||TAP))endMini();}},
  draw(g,m){panel(g,40,22,400,240,'Segíts a kamionosnak visszapakolni!','#ffb347');frr(g,lg(g,0,40,0,250,[[0,'#3b4a63'],[1,'#20283a']]),50,40,380,200,4);R(g,'rgba(10,13,22,0.6)',50,40,380,13);
   frr(g,'#eef1f4',52,60,70,140,3);frr(g,'#c62a35',52,150,70,6,1);text(g,'KAMION',87,64,'#3a4a6a',1,'center',null);
   for(const b of m.boxes){frr(g,b.c,b.x-b.s/2,b.y-b.s,b.s,b.s,1.5);line(g,'rgba(0,0,0,0.3)',b.x-b.s/2,b.y-b.s/2,b.x+b.s/2,b.y-b.s/2,0.6);}
   frr(g,'#555c66',m.cart-26,214,52,6,2);line(g,'#3a3f47',m.cart+24,214,m.cart+32,198,1.6);disc(g,'#14171b',m.cart-18,222,3.5);disc(g,'#14171b',m.cart+18,222,3.5);person(g,m.cart+30,224,'apa',m.t,'work');
   R(g,'#6b7480',50,236,380,4);text(g,'Elkapva: '+m.caught+'   Leesett: '+m.lost+'   Hátra: '+(m.total-m.spawned+m.boxes.length),W/2,44,'#ffffff',1,'center');
   if(m.phase==='play')text(g,isTouch?'Húzd az ujjad a kocsival!':'Bal/jobb nyíl: kocsi mozgatása',W/2,248,'#9fb0c2',1,'center');
   else{text(g,'A kamionos hálás: '+fmt(m.reward)+' Ft'+(m.lost===0?' (hibátlan bónusz!)':''),W/2,120,'#7cff7c',1.4,'center');if(m.rt>30)text(g,'Tovább: Enter / érintés',W/2,140,'#cfd6df',1,'center');}}},

 /* ---- zöldséges: szortírozás szín szerint ---- */
 sort:{init(m){m.time=60*30;m.item=pick(PRODUCE);m.iy=60;m.score=0;m.ok=0;m.bad=0;m.combo=0;m.fly=null;m.flash=0;},
  upd(m){if(m.phase==='play'){m.time--;m.iy=Math.min(150,m.iy+0.5+m.ok*0.03);let c=-1;if(K.num>=1&&K.num<=4)c=K.num-1;
    for(let i=0;i<4;i++)if(inRect(TAP,[60+i*92,176,84,58]))c=i;
    if(c>=0&&!m.fly){const good=c===m.item.c;if(good){m.ok++;m.combo++;m.score+=300+Math.min(5,m.combo)*50;SFX.pick();}else{m.bad++;m.combo=0;m.score=Math.max(0,m.score-150);tone(160,0.2,'square',0.06);vib(80);}
     m.flash=good?12:-12;m.fly={it:m.item,c:c,t:0};m.item=pick(PRODUCE);m.iy=60;}
    if(m.fly&&++m.fly.t>14)m.fly=null;if(m.flash>0)m.flash--;if(m.flash<0)m.flash++;
    if(m.time<=0){m.phase='end';m.rt=0;m.reward=m.score;SFX.win();}}
   else{m.rt++;if(m.rt>30&&(K.enterP||TAP))endMini();}},
  draw(g,m){panel(g,40,22,400,240,'Zöldséges: válogasd szín szerint!','#7cd99c');frr(g,'#3e2f22',50,40,380,200,4);for(let k=0;k<8;k++)R(g,'rgba(0,0,0,0.15)',50,40+k*25,380,1);
   text(g,'Idő: '+Math.ceil(m.time/60)+' mp   Kereset: '+fmt(m.score)+' Ft   Kombó: '+m.combo,W/2,46,'#ffffff',1,'center');
   if(m.phase==='play'){g.save();g.translate(W/2,m.iy+40);g.scale(2.2,2.2);m.item.d(g,0,0);g.restore();text(g,m.item.n,W/2,m.iy+68,'#ffffff',1,'center');}
   if(m.fly){const tx=102+m.fly.c*92,u=m.fly.t/14;g.save();g.translate(lerp(W/2,tx,u),lerp(150,200,u));g.scale(1.6-u*0.6,1.6-u*0.6);m.fly.it.d(g,0,0);g.restore();}
   CRATES.forEach((cr,i)=>{const x=60+i*92;frr(g,'#a1744a',x,176,84,58,4);for(let k=0;k<3;k++)R(g,'#7d5634',x,186+k*16,84,2);frr(g,cr[1],x+4,180,76,10,3);text(g,(i+1)+': '+cr[0],x+42,181.5,'#ffffff',1,'center');});
   if(m.flash)frr(g,m.flash>0?'rgba(90,220,120,0.2)':'rgba(255,80,80,0.25)',50,40,380,200,4);
   if(m.phase==='play')text(g,isTouch?'Érintsd meg a megfelelő ládát!':'1-4: láda kiválasztása',W/2,248,'#9fb0c2',1,'center');
   else{frr(g,'rgba(10,13,22,0.85)',120,90,240,60,6);text(g,'A zöldséges fizet: '+fmt(m.reward)+' Ft',W/2,104,'#7cff7c',1.3,'center');text(g,'Helyes: '+m.ok+'  Hibás: '+m.bad,W/2,122,'#ffffff',1,'center');if(m.rt>30)text(g,'Tovább: Enter / érintés',W/2,136,'#cfd6df',1,'center');}}},

 /* ---- autópálya-matrica ---- */
 vignette:{init(m){},upd(m){const o=m.opt;if(K.num===1||inRect(TAP,[110,150,120,26])||K.enterP){book(-o.price,'road','Autópálya-matrica: '+o.label);G.trip.vig[o.cc]=true;SFX.cash();endMini();}
   else if(K.num===2||inRect(TAP,[250,150,120,26])){G.trip.noVig=G.trip.noVig||{};G.trip.noVig[o.cc]=true;endMini();}},
  draw(g,m){const o=m.opt;panel(g,90,70,300,124,'Autópálya-matrica','#7fd1ff');text(g,o.label,W/2,96,'#ffffff',1,'center');text(g,'Ár: '+fmt(o.price)+' Ft (kb.)',W/2,110,'#ffd84a',1.2,'center');
   text(g,'Matrica nélkül pótdíjat kaphatsz!',W/2,130,'#ff8a8a',1,'center');mbtn(g,[110,150,120,26],'1: Megveszem','#2e8b57');mbtn(g,[250,150,120,26],'2: Nem kérem','#555c66');}}};
