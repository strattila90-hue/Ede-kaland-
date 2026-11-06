# Teljes teszt: mind a 22 szakasz, minden megállótípus autopilótával, véletlen vezetés eseményekkel, minijátékok, pénz/napló egyezés. Elvárt: "HIBÁK 0", legsDone 22, win 1.
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
import asyncio,json
from playwright.async_api import async_playwright
SOAK=r"""
(()=>{const errs=[],seen=new Set();const rec=(where,e)=>{const k=where+':'+(e&&e.message);if(seen.has(k))return;seen.add(k);errs.push({where,msg:String(e&&e.message),stack:String(e&&e.stack).split('\n').slice(0,4).join(' | '),leg:G.leg,sub:P&&P.sub,state:G.state,mg:MG&&MG.type});};
 const rnd=Math.random;const st={frames:0,visits:{},minis:{},legsDone:0,postcards:0,totals:0,fixes:0,win:0};
 const step=(n,ctl)=>{for(let i=0;i<n;i++){if(ctl)ctl(i);if(G.paused)G.paused=false;
   if(MG){st.minis[MG.type]=(st.minis[MG.type]||0)+1;K.num=1+((rnd()*4)|0);TAP={x:60+rnd()*360,y:60+rnd()*180};HOLD=rnd()<0.5?{x:TAP.x,y:TAP.y}:null;K.enterKey=rnd()<0.05;if(MG.t>240){try{endMini();}catch(e){rec('endMini',e);}}}
   try{update();st.frames++;}catch(e){rec('update',e);}if(i%5===0){try{render();}catch(e){rec('render:'+G.state+':'+(P&&P.sub),e);}}}};
 const handleSub=()=>{let guard=0;while(P.sub!=='drive'&&guard++<4000){const s=P.sub;st.visits[s]=(st.visits[s]||0)+1;
   step(1,()=>{if(s==='shop'){if(rnd()<0.05)K.num=1+((rnd()*8)|0);if(guard>120)K.enterKey=true;}else if(s==='pump'){if(guard<5)K.num=1;else if(guard<90)K.pump=true;else{K.pump=false;K.enterKey=true;}}
    else if(s==='rest'||s==='repair'){if(guard>200)K.enterP=true;}else if(s==='wash'){if(guard<3)K.num=1+((rnd()*3)|0);}else if(s==='fix'&&!G.trip.spare&&guard>3)K.enterP=true;});K.pump=false;}};
 for(let leg=0;leg<LEGS.length;leg++){const L=LEGS[leg],ow=L.weather,ot=L.time;const v=[[ow,ot],['snow','night'],['rain','dusk'],['fog','day']][leg%4];L.weather=v[0];L.time=v[1];
  try{G.trip=newTrip();G.trip.vig={HU:1,AT:1,CZ:1};if(leg%2)G.trip.money=-30000,G.trip.log[0].a=-30000,G.trip.log[0].b=-30000;startLeg(leg);P.boarding=-1;P.walk=[];P.hide={};P.door=0;G.banner=0;G.introSeen=true;}catch(e){rec('start',e);continue;}
  // minden megállótípus meglátogatása autopilótával
  for(const tp of ['fuel','kis','hiper','trafik','ujsag','burger','rest','garage','wash']){const p=LEG.pois.find(q=>q.type===tp&&stopTarget(q)>P.dist+400);if(!p)continue;
   if(tp==='garage'){G.trip.hp=35;G.trip.airbag=1;}P.dist=stopTarget(p)-900;P.kmh=40;P.lane=1;P.y=LANE[1];ents=[];try{startAuto(p);}catch(e){rec('startAuto',e);}
   step(1400,()=>{K.gas=false;K.brake=false;});if(P.sub!=='drive'){handleSub();}else st.visits['miss_'+tp]=(st.visits['miss_'+tp]||0)+1;}
  // véletlen vezetés eseményekkel, defekttel, ütközéssel, fáradással
  G.trip.driveS=2400;step(3000,i=>{K.gas=rnd()>0.15;K.brake=rnd()<0.04;if(rnd()<0.01)K.upP=true;if(rnd()<0.01)K.dnP=true;if(rnd()<0.004)K.honkP=true;if(rnd()<0.003)K.lightP=true;if(rnd()<0.002)K.fogP=true;if(rnd()<0.002)K.hazP=true;if(rnd()<0.003)K.cruiseTap=true;if(rnd()<0.001)K.revP=true;if(rnd()<0.001)K.hbP=true;if(rnd()<0.001)K.doorP=true;
    if(i===300&&P.sub==='drive')flatTire();if(i===1500&&P.sub==='drive'){const tp=pick(['truck','bus','hatch','moto','van']);ents.push({kind:'traffic',tp:tp,x:P.dist+150,lane:P.lane,y:P.y,ty:P.y,w:TW[tp],h:TH[tp],kmh:0,base:0,cur:0,col:'#888',parked:true});P.kmh=120;G.trip.hp=20;}
    if(P.sub!=='drive'&&P.sub){const s=P.sub;if(s==='fix')st.fixes++;if(s==='total')st.totals++;}
    if(P.sub==='shop'||P.sub==='pump'||P.sub==='rest'||P.sub==='repair'||P.sub==='wash')handleSub();
    if(P.flat&&P.sub==='drive'&&i>320&&i<900){K.gas=false;K.brake=true;if(P.lane>0)K.upP=true;}});
  handleSub();
  // célba érés, képeslap, térkép, következő szakasz
  P.dist=LEG.len-150;P.kmh=60;let g2=0;while(G.state==='play'&&g2++<3000)step(1,()=>{K.gas=true;});
  if(G.state==='postcard'){st.postcards++;G.st=999;step(5,()=>{K.enterP=true;});}
  if(G.state==='map'){G.st=999;step(5,()=>{K.enterP=true;});}
  if(G.state==='win')st.win++;
  if(G.leg!==leg||G.state==='win')st.legsDone++;
  try{openLedger('menu');renderLedger();closeLedger();}catch(e){rec('ledger',e);}
  const T=G.trip,sum=T.log.reduce((a,e)=>a+e.a,0);if(sum!==T.money)errs.push({where:'money',msg:'egyenleg '+T.money+' != napló '+sum,leg});if(!Number.isInteger(T.money))errs.push({where:'money',msg:'nem egész',leg});
  L.weather=ow;L.time=ot;G.state='play';}
 return {errs,st};})()
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':540});pe=[];pg.on('pageerror',lambda e:pe.append(str(e)))
        await pg.goto(URL);await pg.wait_for_timeout(3000)
        await pg.evaluate("window.requestAnimationFrame=()=>0")
        r=await pg.evaluate(SOAK)
        print(json.dumps(r['st'],ensure_ascii=False));print('HIBÁK',len(r['errs']))
        for e in r['errs'][:30]:print(json.dumps(e,ensure_ascii=False)[:700])
        print('pageerrors',pe[:5]);await b.close()
asyncio.run(main())
