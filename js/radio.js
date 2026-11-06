'use strict';
/* =========================================================
   MOTORHANG és AUTÓRÁDIÓ
   A motor: 4 hengeres négyütemű, gyújtási frekvencia = fordulat/60*2
   A rádió: saját, kódból generált zene, 4 állomás (nem jogvédett számok)
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
 o1.connect(g1);o2.connect(g2);o3.connect(g3);ns.connect(bp);bp.connect(gn);g1.connect(am);g2.connect(am);g3.connect(am);gn.connect(am);am.connect(ws);ws.connect(lp);lp.connect(hp);hp.connect(out);out.connect(master);
 [o1,o2,o3,ns,lfo].forEach(n=>n.start());EN={o1:o1,o2:o2,o3:o3,bp:bp,lp:lp,out:out,lfo:lfo,gn:gn};}
function engine(rpm,load){if(!AC)return;engineInit();if(!EN)return;const t=AC.currentTime,f=Math.max(rpm,1)/60*2;
 EN.o1.frequency.setTargetAtTime(f,t,0.04);EN.o2.frequency.setTargetAtTime(f*0.5,t,0.04);EN.o3.frequency.setTargetAtTime(f*1.5,t,0.04);EN.lfo.frequency.setTargetAtTime(f*0.25,t,0.04);
 EN.bp.frequency.setTargetAtTime(180+f*5,t,0.06);EN.gn.gain.setTargetAtTime(0.12+load*0.3,t,0.08);
 EN.lp.frequency.setTargetAtTime(260+load*1600+rpm*0.12,t,0.06);EN.out.gain.setTargetAtTime(rpm>0?(0.045+load*0.05)*(radio.on?0.7:1):0,t,0.1);}

/* ---- rádió ---- */
const STATIONS=[
 {name:'Retro FM 88,5',bpm:104,style:'synth',key:57,prog:[0,-4,3,-2],minor:true},
 {name:'Rock Rádió 92,1',bpm:132,style:'rock',key:52,prog:[0,3,5,3],minor:true},
 {name:'Pop Hullám 101,3',bpm:118,style:'pop',key:60,prog:[0,7,9,5],minor:false},
 {name:'Esti Lounge 104,7',bpm:84,style:'chill',key:62,prog:[0,5,-3,-5],minor:false}];
const radio={on:false,idx:-1,step:0,next:0,bus:null,show:0};
function radioInit(){if(!AC||radio.bus)return;const b=AC.createGain();b.gain.value=0.55;const f1=AC.createBiquadFilter();f1.type='highpass';f1.frequency.value=90;const f2=AC.createBiquadFilter();f2.type='lowpass';f2.frequency.value=7000;
 b.connect(f1);f1.connect(f2);f2.connect(master);radio.bus=b;}
function radioNext(){initAudio();if(!AC)return;radioInit();radio.idx++;if(radio.idx>=STATIONS.length){radio.idx=-1;radio.on=false;}else radio.on=true;radio.show=200;radio.step=0;radio.next=AC.currentTime+0.35;noise(0.3,0.12,0,3500);}
function rv(f,d,type,v,t0,cut,att){const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+(att||0.005));g.gain.exponentialRampToValueAtTime(0.0001,t+d);let node=o;
 if(cut){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);lp.frequency.exponentialRampToValueAtTime(Math.max(200,cut*0.3),t+d);o.connect(lp);node=lp;}
 node.connect(g);g.connect(radio.bus);o.start(t);o.stop(t+d+0.05);}
function rnoise(d,v,t0,type,freq){const t=AC.currentTime+t0,n=Math.max(1,AC.sampleRate*d|0),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;const g=AC.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(radio.bus);s.start(t);}
function kick(t0,v){const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.connect(g);g.connect(radio.bus);o.start(t);o.stop(t+0.3);}
function playStep(st,step,t0,spb){const s16=step%16,bar=Math.floor(step/16),root=st.key+st.prog[bar%4],min=st.minor,third=min?3:4;
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
