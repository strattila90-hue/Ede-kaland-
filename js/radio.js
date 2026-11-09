'use strict';
/* =========================================================
   MOTORHANG és AUTÓRÁDIÓ
   A motor: 4 hengeres négyütemű, gyújtási frekvencia = fordulat/60*2
   A rádió: saját, kódból generált zene, 5 állomás (saját szerzemények, nem jogvédett számok)
   ========================================================= */
let EN=null;
function engineInit(){if(!AC||EN)return;
 const o1=AC.createOscillator();o1.type='sawtooth';const o2=AC.createOscillator();o2.type='square';const o3=AC.createOscillator();o3.type='triangle';
 const nb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.4;
 const ws=AC.createWaveShaper(),cu=new Float32Array(512);for(let i=0;i<512;i++){const x=i/256-1;cu[i]=Math.tanh(x*2.2);}ws.curve=cu;
 const lp=AC.createBiquadFilter();lp.type='lowpass';lp.Q.value=0.9;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=28;
 const g1=AC.createGain(),g2=AC.createGain(),g3=AC.createGain(),gn=AC.createGain(),out=AC.createGain();g1.gain.value=0.45;g2.gain.value=0.3;g3.gain.value=0.4;gn.gain.value=0.22;out.gain.value=0;
 const am=AC.createGain();am.gain.value=0.7;const lfo=AC.createOscillator();lfo.type='square';const lfg=AC.createGain();lfg.gain.value=0.3;lfo.connect(lfg);lfg.connect(am.gain);
 o1.connect(g1);o2.connect(g2);o3.connect(g3);ns.connect(bp);bp.connect(gn);g1.connect(am);g2.connect(am);g3.connect(am);gn.connect(am);am.connect(ws);ws.connect(lp);lp.connect(hp);hp.connect(out);out.connect(BUS?BUS.eng:master);
 [o1,o2,o3,ns,lfo].forEach(n=>n.start());EN={o1:o1,o2:o2,o3:o3,bp:bp,lp:lp,out:out,lfo:lfo,gn:gn};}
function engine(rpm,load){if(!AC)return;engineInit();if(!EN)return;const t=AC.currentTime,f=Math.max(rpm,1)/60*2;
 EN.o1.frequency.setTargetAtTime(f,t,0.04);EN.o2.frequency.setTargetAtTime(f*0.5,t,0.04);EN.o3.frequency.setTargetAtTime(f*1.5,t,0.04);EN.lfo.frequency.setTargetAtTime(f*0.25,t,0.04);
 EN.bp.frequency.setTargetAtTime(180+f*5,t,0.06);EN.gn.gain.setTargetAtTime(0.12+load*0.3,t,0.08);
 EN.lp.frequency.setTargetAtTime(260+load*1600+rpm*0.12,t,0.06);EN.out.gain.setTargetAtTime(rpm>0?(0.045+load*0.05)*(radio.on?0.7:1):0,t,0.1);}

/* ---- rádió ---- */
const STATIONS=[
 {name:'Országút Rádió 96,4',bpm:150,style:'road',key:52,prog:[0,0,5,0,7,5,0,7],minor:false},
 {name:'Retro FM 88,5',bpm:104,style:'synth',key:57,prog:[0,-4,3,-2],minor:true},
 {name:'Rock Rádió 92,1',bpm:132,style:'rock',key:52,prog:[0,3,5,3],minor:true},
 {name:'Pop Hullám 101,3',bpm:118,style:'pop',key:60,prog:[0,7,9,5],minor:false},
 {name:'Esti Lounge 104,7',bpm:84,style:'chill',key:62,prog:[0,5,-3,-5],minor:false}];
const radio={on:false,idx:-1,step:0,next:0,bus:null,show:0};
function radioInit(){if(!AC||radio.bus)return;const b=AC.createGain();b.gain.value=0.55;const f1=AC.createBiquadFilter();f1.type='highpass';f1.frequency.value=90;const f2=AC.createBiquadFilter();f2.type='lowpass';f2.frequency.value=7000;
 b.connect(f1);f1.connect(f2);f2.connect(BUS?BUS.radio:master);radio.bus=b;
 /* torzított gitár: előerősítés -> torzító -> hangláda-szűrő */
 const pre=AC.createGain();pre.gain.value=1;const ws=AC.createWaveShaper(),cu=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cu[i]=Math.tanh(x*7)*0.8;}ws.curve=cu;ws.oversample='2x';
 const cab=AC.createBiquadFilter();cab.type='lowpass';cab.frequency.value=3400;cab.Q.value=0.8;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=110;const out=AC.createGain();out.gain.value=0.1;
 pre.connect(ws);ws.connect(cab);cab.connect(hp);hp.connect(out);out.connect(b);radio.gtr=pre;}
function radioNext(){initAudio();if(!AC)return;radioInit();radio.idx++;if(radio.idx>=STATIONS.length){radio.idx=-1;radio.on=false;}else radio.on=true;radio.show=200;radio.step=0;radio.next=AC.currentTime+0.35;noise(0.3,0.12,0,3500);}
function rv(f,d,type,v,t0,cut,att){const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+(att||0.005));g.gain.exponentialRampToValueAtTime(0.0001,t+d);let node=o;
 if(cut){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);lp.frequency.exponentialRampToValueAtTime(Math.max(200,cut*0.3),t+d);o.connect(lp);node=lp;}
 node.connect(g);g.connect(radio.bus);o.start(t);o.stop(t+d+0.05);}
/* dob-zaj a közös zajmintából (noiseBuf), gyors lecsengéssel: nem gyárt ütésenként új hangmintát */
function rnoise(d,v,t0,type,freq){const t=AC.currentTime+t0,s=AC.createBufferSource();s.buffer=noiseBuf();const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;const g=AC.createGain();
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0005,v*0.01),t+d);s.connect(f);f.connect(g);g.connect(radio.bus);s.start(t,Math.random()*1.5,d+0.01);}
function kick(t0,v){const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.connect(g);g.connect(radio.bus);o.start(t);o.stop(t+0.3);}
/* ---- Országút Rádió: lendületes országúti rock (saját szerzemény) ----
   32 ütemes kör: 8 ütem bevezető riff, 8 ütem verze, 8 ütem refrén (gitárdallam + taps), 8 ütem szóló.
   Boogie basszus, tompított power chord nyolcadok, kiemelt ütések, cintányér a részek elején. */
function gtr(f,d,v,t0,bend){const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';
 if(bend){o.frequency.setValueAtTime(f*Math.pow(2,-bend/12),t);o.frequency.exponentialRampToValueAtTime(f,t+Math.min(d*0.5,0.12));}else o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+0.004);g.gain.setValueAtTime(v,t+d*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(radio.gtr);o.start(t);o.stop(t+d+0.03);}
function crash(t0,v){rnoise(1.1,v,t0,'highpass',5200);}
const ROAD_HOOK=[ // refrén gitárdallam (2 ütem, 16-od lépések; fokok a dúr pentaton skálán, null = szünet)
 [7,null,null,9,null,12,null,null,12,null,14,null,12,null,9,null],
 [7,null,null,4,null,7,null,null,9,null,null,null,7,null,null,null]];
const ROAD_SOLO=[ // szóló: rövid, ismétlődő lickek húzással
 [12,null,15,null,16,null,15,12,null,null,10,null,12,null,null,null],
 [9,null,12,null,9,7,null,4,null,null,7,null,null,null,null,null]];
function roadStep(st,step,t0,spb){const s16=step%16,bar=Math.floor(step/16),sec=Math.floor((bar%32)/8),bi=bar%8,root=st.key+st.prog[bi];
 // dob: egyenes rock ütem, a refrénben duplázott lábdob a végén
 if(s16===0||s16===8||(s16===10&&sec>=2)||(s16===14&&bi%2===1))kick(t0,0.6);
 if(s16===4||s16===12){rnoise(0.16,0.4,t0,'bandpass',1900);if(sec===2)rnoise(0.06,0.22,t0+0.008,'bandpass',1200);}
 if(s16%2===0)rnoise(s16===14?0.16:0.035,s16%4===0?0.09:0.14,t0,'highpass',8000);
 if(bi===7&&s16>=12)rnoise(0.09,0.28,t0,'bandpass',900+(s16-12)*260); // dobfutam a rész végén
 if(bi===0&&s16===0&&bar>0)crash(t0,0.22);
 // basszus: boogie (alap, terc, kvint, szext, kis szept, vissza)
 if(s16%2===0){const bp=sec===0&&bi<4?[0,0,0,0,0,0,0,0]:[0,4,7,9,10,9,7,4];rv(mf(root-12+bp[s16/2]),spb*1.7,'square',0.09,t0,700);}
 // ritmusgitár: tompított power chord nyolcadok, ütem elején és a 7. tizenhatodon kiemelve
 if(s16%2===0||s16===7){const acc=s16===0||s16===7,len=acc?spb*(s16===7?5:3):spb*0.9,v=acc?0.5:0.3;
  if(!(sec===0&&bi<2&&s16!==0))for(const iv of [0,7,12])gtr(mf(root-12+iv),len,v,t0,0);}
 // vezető gitár
 const pent=[0,2,4,7,9,12,14,16];
 if(sec===0&&bi>=2){const riff=[0,null,3,null,4,null,7,null,9,null,7,null,4,null,3,null];const n=riff[s16];if(n!==null&&bi%2===0)gtr(mf(st.key+n),spb*1.8,0.32,t0,n===3?1:0);}
 if(sec===2){const n=ROAD_HOOK[bi%2][s16];if(n!==null)gtr(mf(st.key+12+n),spb*(ROAD_HOOK[bi%2][s16+1]===null?3.2:1.6),0.42,t0,n===12||n===9?2:0);}
 if(sec===3){const n=ROAD_SOLO[bi%2][s16];if(n!==null)gtr(mf(root+12+n),spb*1.9,0.4,t0,(s16===0||n===15)?2:0);}
 if(sec===1&&bi%2===1&&s16>=8&&s16%2===0){const n=pent[(hsh(bar*17+s16)*5|0)+2];gtr(mf(root+12+n),spb*1.7,0.3,t0,s16===8?1:0);}}
function playStep(st,step,t0,spb){if(st.style==='road'){roadStep(st,step,t0,spb);return;}const s16=step%16,bar=Math.floor(step/16),root=st.key+st.prog[bar%4],min=st.minor,third=min?3:4;
 const scale=min?[0,3,5,7,10,12,15]:[0,2,4,7,9,12,14];
 // dob
 if(st.style==='synth'||st.style==='pop'){if(s16%4===0)kick(t0,0.5);}else if(st.style==='rock'){if(s16===0||s16===6||s16===8||s16===10)kick(t0,0.55);}else{if(s16===0||s16===10)kick(t0,0.35);}
 if(s16===4||s16===12)rnoise(st.style==='chill'?0.12:0.18,st.style==='rock'?0.35:0.25,t0,'bandpass',1800);
 if(st.style!=='chill'||s16%4===2){if(s16%2===0||st.style==='rock')rnoise(0.04,s16%4===2?0.12:0.07,t0,'highpass',7000);}
 // basszus
 const bassHits={synth:[0,3,6,8,11,14],rock:[0,2,4,6,8,10,12,14],pop:[0,6,8,14],chill:[0,10]}[st.style];
 if(bassHits.includes(s16))rv(mf(root-24),spb*(st.style==='chill'?6:1.8),st.style==='synth'?'sawtooth':st.style==='rock'?'square':'triangle',0.14,t0,st.style==='synth'?900:600);
 // akkordok
 if(st.style==='synth'&&s16===0)for(const iv of [0,third,7,12])rv(mf(root+iv),spb*15,'sawtooth',0.035,t0,1800,0.25);
 if(st.style==='chill'&&s16===0)for(const iv of [0,third,7,11,14])rv(mf(root+iv),spb*16,'sine',0.045,t0,0,0.4);
 if(st.style==='rock'&&s16%2===0)for(const iv of [0,7,12])rv(mf(root+iv-12),spb*1.6,'square',0.04,t0,1400);
 if(st.style==='pop'&&(s16===2||s16===6||s16===10||s16===14))for(const iv of [0,third,7])rv(mf(root+iv),spb*1.2,'triangle',0.06,t0,2600);
 // dallam (állomásonként rögzített, ismétlődő motívum)
 const motif=Math.floor(bar/2)%2,seed=hsh(st.key*31+motif*7+s16*13+(bar%2)*3);
 const dens={synth:0.42,rock:0.3,pop:0.5,chill:0.22}[st.style];
 if(seed<dens&&(s16%2===0||st.style==='pop')){const deg=scale[Math.floor(hsh(seed*1e6)*scale.length)];rv(mf(root+12+deg),spb*(st.style==='chill'?4:2),st.style==='synth'?'square':st.style==='rock'?'sawtooth':st.style==='pop'?'triangle':'sine',st.style==='rock'?0.05:0.07,t0,st.style==='rock'?2200:3500);}}
function updRadio(){if(!AC||!radio.on||!radio.bus)return;const st=STATIONS[radio.idx],spb=60/st.bpm/4;if(radio.next<AC.currentTime)radio.next=AC.currentTime+0.05;
 while(radio.next<AC.currentTime+0.2){playStep(st,radio.step,radio.next-AC.currentTime,spb);radio.next+=spb;radio.step++;}}
