'use strict';
/* =========================================================
   VILÁG – útvonal, útszakaszok, táj, út rajzolása
   ========================================================= */
// útszakasz: [típus, név, minőség, km, ország]   típus: town | village | country | motorway   minőség: good | medium | bad | cobble
// path: valós útpontok [szélesség, hosszúság] a térképhez
const PXKM=14400; // 1 km = 14 400 képpont: 90 km/h-nál 1 km pontosan 40 másodperc, a sebesség arányos az autó méretével
const KPX=PXKM/216000; // km/h -> képpont/képkocka (60 fps)
const GEOC={Komárom:[47.743,18.119],Ács:[47.712,17.996],Bábolna:[47.641,17.977],Tatabánya:[47.586,18.394],Budapest:[47.497,19.040],Székesfehérvár:[47.186,18.422],Siófok:[46.904,18.058],
 Balatonboglár:[46.776,17.651],Fonyód:[46.744,17.553],Keszthely:[46.765,17.243],Sümeg:[46.977,17.282],Szombathely:[47.231,16.622],Graz:[47.07,15.44],Bécs:[48.208,16.373],Mikulov:[48.806,16.637],Brno:[49.195,16.607],
 Jihlava:[49.396,15.591],Prága:[50.075,14.437],Ústí:[50.66,14.03],Drezda:[51.050,13.737],Berlin:[52.520,13.405],Magdeburg:[52.12,11.63],Hannover:[52.375,9.732],Osnabrück:[52.28,8.05],
 'Bad Bentheim':[52.30,7.16],Amersfoort:[52.156,5.387],Amszterdam:[52.370,4.895],Utrecht:[52.09,5.12],Antwerpen:[51.219,4.402],Brüsszel:[50.850,4.352],Lille:[50.63,3.06],Párizs:[48.857,2.352],
 Orléans:[47.903,1.909],'Clermont-Ferrand':[45.78,3.08],Millau:[44.10,3.08],Montpellier:[43.61,3.88],Perpignan:[42.69,2.90],'Le Perthus':[42.46,2.86],Girona:[41.98,2.82],Barcelona:[41.385,2.173],
 Nîmes:[43.84,4.36],Avignon:[43.949,4.806],Gordes:[43.911,5.200],'Aix-en-Provence':[43.53,5.45],Nizza:[43.710,7.262],Genova:[44.405,8.946],Piacenza:[45.05,9.70],Verona:[45.438,10.992],
 Velence:[45.441,12.316],Mestre:[45.49,12.24],Udine:[46.06,13.24],Villach:[46.61,13.85],'St. Gilgen':[47.766,13.365],Salzburg:[47.809,13.055],Linz:[48.306,14.286],'St. Pölten':[48.20,15.62],Győr:[47.687,17.650],
 Nagykanizsa:[46.453,16.991],Letenye:[46.433,16.726],Varaždin:[46.304,16.337],Zágráb:[45.815,15.982],'Novo Mesto':[45.80,15.17],Ljubljana:[46.056,14.506],Postojna:[45.776,14.214],Trieszt:[45.650,13.777],
 Padova:[45.406,11.876],Bologna:[44.494,11.343],Firenze:[43.769,11.256],Arezzo:[43.463,11.879],Orvieto:[42.718,12.111],Róma:[41.903,12.496],Civitavecchia:[42.093,11.796],Grosseto:[42.760,11.113],Livorno:[43.548,10.310],
 'La Spezia':[44.102,9.824],Sanremo:[43.816,7.776],Lleida:[41.617,0.620],Zaragoza:[41.649,-0.889],Medinaceli:[41.172,-2.434],Madrid:[40.416,-3.704],Talavera:[39.963,-4.830],Mérida:[38.916,-6.344],Badajoz:[38.879,-6.970],
 Évora:[38.571,-7.909],Lisszabon:[38.722,-9.139],Coimbra:[40.203,-8.410],Guarda:[40.537,-7.267],'Vilar Formoso':[40.611,-6.836],Salamanca:[40.970,-5.664],Burgos:[42.344,-3.697],'San Sebastián':[43.318,-1.981],
 Bayonne:[43.493,-1.475],Bordeaux:[44.838,-0.579],Poitiers:[46.580,0.340],Tours:[47.394,0.684],Bremen:[53.079,8.802],Hamburg:[53.551,9.993],Flensburg:[54.794,9.437],Kolding:[55.491,9.472],Odense:[55.403,10.402],
 Koppenhága:[55.676,12.568],Schwerin:[53.635,11.401],'Frankfurt (Oder)':[52.347,14.551],Poznań:[52.406,16.925],Łódź:[51.759,19.456],Varsó:[52.230,21.012],Radom:[51.403,21.147],Kielce:[50.866,20.628],
 Krakkó:[50.065,19.945],Katowice:[50.264,19.023],Ostrava:[49.820,18.262],Olomouc:[49.594,17.251],Parndorf:[47.998,16.862],Hegyeshalom:[47.912,17.157],Mosonmagyaróvár:[47.873,17.269],};
Object.assign(GEOC,{Monfalcone:[45.809,13.533],Latisana:[45.782,12.996],Portogruaro:[45.776,12.837],'San Donà di Piave':[45.630,12.565],Tarquinia:[42.254,11.758],'Montalto di Castro':[42.351,11.608],Albinia:[42.502,11.209],Pisa:[43.716,10.402],Viareggio:[43.867,10.250],Massa:[44.035,10.139],Sarzana:[44.113,9.960],'Sestri Levante':[44.273,9.398],Rapallo:[44.350,9.231],Savona:[44.309,8.481],Albenga:[44.049,8.215],Imperia:[43.889,8.039],Ventimiglia:[43.791,7.608],Menton:[43.775,7.497],Monaco:[43.738,7.424],Béziers:[43.344,3.216],Narbonne:[43.184,3.004],Middelfart:[55.506,9.730],Nyborg:[55.312,10.790],Korsør:[55.330,11.139],Ringsted:[55.443,11.790]});
const LEGS=[
 {from:'Komárom, Táncsics Mihály utca',to:'Siófok',region:'hu',weather:'sun',time:'day',price:612,path:['Komárom','Ács','Bábolna','Tatabánya','Budapest','Székesfehérvár','Siófok'],
  segs:[['town','Komárom','medium',4],['country','','medium',7],['village','Ács','medium',3],['country','','bad',9],['village','Bábolna','cobble',2],['country','','medium',9],
   ['motorway','M1','good',62,'HU'],['motorway','M0','good',18,'HU'],['motorway','M7','good',47,'HU'],['country','','good',2],['town','Siófok','good',4]]},
 {from:'Siófok',to:'Keszthely',region:'hu',weather:'rain',time:'day',price:612,path:['Siófok','Balatonboglár','Fonyód','Keszthely'],
  segs:[['town','Siófok','good',3],['country','','medium',8],['village','Balatonszárszó','medium',3],['country','','good',6],['village','Balatonboglár','bad',3],['country','','good',7],
   ['village','Fonyód','medium',4],['country','','bad',6],['village','Balatonfenyves','medium',2],['country','','bad',4],['village','Balatonmáriafürdő','bad',2],['country','','medium',4],['village','Balatonberény','cobble',2],['country','','medium',12],['village','Fenékpuszta','bad',2],['country','','medium',7],['town','Keszthely','medium',5]]},
 {from:'Keszthely',to:'Zágráb',region:'hu',weather:'cloudy',time:'day',price:600,path:['Keszthely','Nagykanizsa','Letenye','Varaždin','Zágráb'],
  segs:[['town','Keszthely','medium',3],['country','','medium',14],['village','Sármellék','medium',2],['country','','bad',18],['town','Nagykanizsa','good',5],['motorway','M7','good',22,'HU'],['motorway','A4','good',95,'HR'],['town','Zágráb','cobble',10]]},
 {from:'Zágráb',to:'Ljubljana',region:'alps',weather:'rain',time:'day',price:610,path:['Zágráb','Novo Mesto','Ljubljana'],
  segs:[['town','Zágráb','good',8],['motorway','A3','good',30,'HR'],['motorway','A2','good',85,'SI'],['village','Trebnje','medium',2],['motorway','A2','good',20,'SI'],['town','Ljubljana','cobble',8]]},
 {from:'Ljubljana',to:'Velence',region:'it',weather:'sun',time:'day',price:680,path:['Ljubljana','Postojna','Trieszt','Monfalcone','Latisana','Portogruaro','San Donà di Piave','Mestre','Velence'],
  segs:[['town','Ljubljana','good',5],['motorway','A1','good',95,'SI'],['motorway','RA13','good',15,'IT'],['town','Trieszt','cobble',6],['motorway','A4','good',130,'IT'],['village','Mestre','bad',4],['town','Velence','cobble',6]]},
 {from:'Velence',to:'Firenze',region:'tuscany',weather:'cloudy',time:'day',price:690,path:['Velence','Padova','Bologna','Firenze'],
  segs:[['town','Velence','good',5],['motorway','A13','good',120,'IT'],['town','Bologna','cobble',8],['motorway','A1','good',100,'IT'],['town','Firenze','cobble',8]]},
 {from:'Firenze',to:'Róma',region:'tuscany',weather:'sun',time:'sunset',price:690,path:['Firenze','Arezzo','Orvieto','Róma'],
  segs:[['town','Firenze','good',6],['motorway','A1','good',80,'IT'],['country','','medium',12],['village','Orvieto','cobble',3],['country','','medium',8],['motorway','A1','good',150,'IT'],['town','Róma','cobble',14]]},
 {from:'Róma',to:'Nizza',region:'it',weather:'sun',time:'day',price:695,path:['Róma','Civitavecchia','Tarquinia','Montalto di Castro','Albinia','Grosseto','Livorno','Pisa','Viareggio','Massa','Sarzana','La Spezia','Sestri Levante','Rapallo','Genova','Savona','Albenga','Imperia','Sanremo','Ventimiglia','Menton','Monaco','Nizza'],
  segs:[['town','Róma','good',10],['motorway','A12','good',70,'IT'],['town','Civitavecchia','good',4],['country','','good',110],['town','Livorno','cobble',6],['motorway','A12','good',90,'IT'],['town','La Spezia','good',5],['motorway','A12','good',100,'IT'],['town','Genova','cobble',8],['motorway','A10','good',150,'IT'],['village','Sanremo','medium',4],['motorway','A8','good',30,'FR'],['town','Nizza','good',8]]},
 {from:'Nizza',to:'Barcelona',region:'provence',weather:'sun',time:'day',price:730,path:['Nizza','Aix-en-Provence','Avignon','Gordes','Nîmes','Montpellier','Béziers','Narbonne','Perpignan','Le Perthus','Girona','Barcelona'],
  segs:[['town','Nizza','good',8],['motorway','A8','good',200,'FR'],['country','','medium',15],['village','Gordes','cobble',3],['country','','bad',20],['motorway','A9','good',220,'FR'],['village','Le Perthus','medium',2],['motorway','AP-7','good',150,'ES'],['town','Barcelona','good',13]]},
 {from:'Barcelona',to:'Madrid',region:'es',weather:'sun',time:'day',price:600,path:['Barcelona','Lleida','Zaragoza','Medinaceli','Madrid'],
  segs:[['town','Barcelona','good',10],['motorway','AP-2','good',160,'ES'],['town','Lleida','good',6],['motorway','A-2','good',140,'ES'],['town','Zaragoza','good',8],['motorway','A-2','good',230,'ES'],['village','Medinaceli','cobble',3],['motorway','A-2','good',40,'ES'],['town','Madrid','good',18]]},
 {from:'Madrid',to:'Lisszabon',region:'es',weather:'clear',time:'night',price:640,path:['Madrid','Talavera','Mérida','Badajoz','Évora','Lisszabon'],
  segs:[['town','Madrid','good',14],['motorway','A-5','good',110,'ES'],['town','Talavera','good',5],['motorway','A-5','good',190,'ES'],['town','Mérida','cobble',5],['motorway','A-5','good',60,'ES'],['town','Badajoz','good',5],['motorway','A6','good',140,'PT'],['village','Évora','cobble',4],['motorway','A2','good',80,'PT'],['town','Lisszabon','cobble',15]]},
 {from:'Lisszabon',to:'Bordeaux',region:'es',weather:'cloudy',time:'day',price:650,path:['Lisszabon','Coimbra','Guarda','Vilar Formoso','Salamanca','Burgos','San Sebastián','Bayonne','Bordeaux'],
  segs:[['town','Lisszabon','good',10],['motorway','A1','good',190,'PT'],['town','Coimbra','cobble',6],['motorway','A25','good',160,'PT'],['village','Vilar Formoso','medium',2],['motorway','A-62','good',120,'ES'],['town','Salamanca','cobble',7],['motorway','A-62','good',220,'ES'],['town','Burgos','good',6],['motorway','AP-1','good',160,'ES'],['town','San Sebastián','good',8],['motorway','A63','good',180,'FR'],['town','Bordeaux','good',12]]},
 {from:'Bordeaux',to:'Párizs',region:'fr',weather:'rain',time:'day',price:730,path:['Bordeaux','Poitiers','Tours','Orléans','Párizs'],
  segs:[['town','Bordeaux','good',8],['motorway','A10','good',240,'FR'],['town','Poitiers','good',6],['motorway','A10','good',100,'FR'],['town','Tours','good',6],['motorway','A10','good',210,'FR'],['town','Párizs','cobble',18]]},
 {from:'Párizs',to:'Amszterdam',region:'fr',weather:'cloudy',time:'day',price:730,path:['Párizs','Lille','Brüsszel','Antwerpen','Utrecht','Amszterdam'],
  segs:[['town','Párizs','good',15],['motorway','A1','good',220,'FR'],['motorway','E19','good',90,'BE'],['town','Brüsszel','cobble',8],['motorway','E19','good',60,'BE'],['town','Antwerpen','good',6],['motorway','A2','good',90,'NL'],['town','Amszterdam','cobble',9]]},
 {from:'Amszterdam',to:'Hamburg',region:'hu',weather:'rain',time:'day',price:700,path:['Amszterdam','Amersfoort','Bad Bentheim','Osnabrück','Bremen','Hamburg'],
  segs:[['town','Amszterdam','good',8],['motorway','A1','good',150,'NL'],['village','Bad Bentheim','cobble',3],['motorway','A30','good',60,'DE'],['town','Osnabrück','good',6],['motorway','A1','good',120,'DE'],['town','Bremen','good',8],['motorway','A1','good',110,'DE'],['town','Hamburg','good',14]]},
 {from:'Hamburg',to:'Koppenhága',region:'nordic',weather:'cloudy',time:'day',price:760,path:['Hamburg','Flensburg','Kolding','Middelfart','Odense','Nyborg','Korsør','Ringsted','Koppenhága'],
  segs:[['town','Hamburg','good',10],['motorway','A7','good',150,'DE'],['town','Flensburg','good',5],['motorway','E45','good',80,'DK'],['town','Kolding','good',5],['motorway','E20','good',70,'DK'],['town','Odense','good',6],['motorway','E20','good',120,'DK'],['town','Koppenhága','cobble',10]]},
 {from:'Koppenhága',to:'Berlin',region:'nordic',weather:'fog',time:'dusk',price:720,path:['Koppenhága','Ringsted','Korsør','Nyborg','Odense','Middelfart','Kolding','Flensburg','Hamburg','Schwerin','Berlin'],
  segs:[['town','Koppenhága','good',8],['motorway','E20','good',200,'DK'],['motorway','E45','good',80,'DK'],['motorway','A7','good',150,'DE'],['town','Hamburg','good',10],['motorway','A24','good',260,'DE'],['town','Berlin','good',16]]},
 {from:'Berlin',to:'Varsó',region:'hu',weather:'snow',time:'day',price:600,path:['Berlin','Frankfurt (Oder)','Poznań','Łódź','Varsó'],
  segs:[['town','Berlin','good',12],['motorway','A12','good',80,'DE'],['town','Frankfurt (Oder)','good',4],['motorway','A2','good',160,'PL'],['town','Poznań','cobble',8],['motorway','A2','good',210,'PL'],['town','Łódź','good',8],['motorway','A2','good',120,'PL'],['town','Varsó','good',15]]},
 {from:'Varsó',to:'Krakkó',region:'hu',weather:'cloudy',time:'day',price:600,path:['Varsó','Radom','Kielce','Krakkó'],
  segs:[['town','Varsó','good',12],['motorway','S7','good',100,'PL'],['town','Radom','good',6],['motorway','S7','good',80,'PL'],['town','Kielce','good',6],['motorway','S7','good',100,'PL'],['town','Krakkó','cobble',10]]},
 {from:'Krakkó',to:'Prága',region:'hu',weather:'rain',time:'day',price:620,path:['Krakkó','Katowice','Ostrava','Olomouc','Brno','Jihlava','Prága'],
  segs:[['town','Krakkó','good',8],['motorway','A4','good',70,'PL'],['town','Katowice','good',8],['motorway','A1','good',90,'PL'],['town','Ostrava','good',8],['motorway','D1','good',100,'CZ'],['town','Olomouc','cobble',6],['motorway','D46','good',70,'CZ'],['town','Brno','good',8],['motorway','D1','medium',190,'CZ'],['town','Prága','cobble',10]]},
 {from:'Prága',to:'Bécs',region:'hu',weather:'sun',time:'day',price:640,path:['Prága','Jihlava','Brno','Mikulov','Bécs'],
  segs:[['town','Prága','good',8],['motorway','D1','medium',190,'CZ'],['town','Brno','good',8],['country','','medium',15],['village','Rajhrad','cobble',2],['country','','medium',14],['village','Pohořelice','medium',3],['country','','medium',15],['village','Mikulov','cobble',2],['country','','medium',10],['motorway','A5','good',60,'AT'],['town','Bécs','cobble',10]]},
 {from:'Bécs',to:'Komárom (haza)',region:'hu',weather:'sun',time:'sunset',price:612,path:['Bécs','Parndorf','Hegyeshalom','Mosonmagyaróvár','Győr','Ács','Komárom'],
  segs:[['town','Bécs','good',10],['motorway','A4','good',60,'AT'],['motorway','M1','good',55,'HU'],['country','','medium',20],['village','Ács','medium',3],['town','Komárom','cobble',7]]}];
LEGS.forEach(L=>{L.km=L.segs.reduce((s,q)=>s+q[3],0);L.pts=L.path.map(n=>GEOC[n]);});
const LIVE_XY=[GEOC.Komárom].concat(LEGS.map(L=>L.pts[L.pts.length-1]));
const WNAME={sun:'Napsütés',rain:'Eső',cloudy:'Borult ég',snow:'Havazás',fog:'Köd',clear:'Csillagos éjszaka',storm:'Vihar'};
const TNAME={day:'',night:', éjszaka',dusk:', alkonyat',sunset:', naplemente'};
const QNAME={good:'Jó minőségű út',medium:'Közepes út',bad:'Rossz, kátyús út',cobble:'Macskaköves út'};
const LIMIT={town:50,village:50,country:90,motorway:130};
const POI_NAME={wash:'Autómosó',garage:'Autószerviz',burger:'Gyorsétterem',rest:'Pihenő',fuel:'Benzinkút',kis:'Kisbolt',hiper:'Hipermarket',trafik:'Trafik',ujsag:'Újságos',veda:'Sebességmérés'};
function buildLeg(i,ts){ts=ts||1;const L=LEGS[i],pk=PXKM/ts;let x=0;
 const segs=L.segs.map((q,k)=>{const w=q[3]*pk;const s={type:q[0],name:q[1],q:q[2],km:q[3],cc:q[4]||'',x0:x,x1:x+w,k:k,limit:(L.region!=='hu'&&q[0]==='country')?100:LIMIT[q[0]]};x+=w;return s;});
 const len=x;segs[segs.length-1].x1=len+40000;segs[0].x0=-40000;
 const pois=[],lights=[];const add=(type,km,s)=>{const px=s.x0+km*pk;if(px>s.x0+600&&px<Math.min(s.x1,len)-1500)pois.push({type:type,x:px,seg:s});};
 segs.forEach((s,k)=>{const h=(n)=>hsh(i*997+k*131+n);const x0=Math.max(0,s.x0);const sk=(Math.min(s.x1,len)-x0)/pk;const s2={x0:x0,x1:s.x1};
  if(s.type==='motorway'){for(let d=12+h(1)*10;d<sk-5;d+=38+h(d)*14){add('fuel',d,s2);if(hsh(i*31+d*7)<0.6)add('burger',d+1.6,s2);if(hsh(i*17+d*13)<0.35)add('garage',d+2.6,s2);if(hsh(i*23+d*11)<0.5)add('wash',d+0.6,s2);}for(let d=26+h(6)*8;d<sk-5;d+=34+h(d+3)*12)add('rest',d,s2);for(let d=25+h(2)*10;d<sk-5;d+=45+h(d+7)*20)add('veda',d,s2);}
  else if(s.type==='country'){if(sk>12)add('fuel',sk*(0.4+h(3)*0.2),s2);if(sk>9)add('garage',sk*0.7,s2);if(sk>8)add('rest',sk*(0.15+h(8)*0.1),s2);for(let d=6+h(4)*5;d<sk-3;d+=18+h(d)*10)add('veda',d,s2);}
  else if(s.type==='town'){add('veda',0.25,s2);add('kis',sk*0.22,s2);add('trafik',sk*0.38,s2);add('ujsag',sk*0.5,s2);if(sk>=3)add('fuel',sk*0.64,s2);if(sk>=3)add('hiper',sk*0.82,s2);if(sk>=2)add('burger',sk*0.92,s2);if(sk>=3)add('garage',sk*0.3,s2);if(sk>=3)add('wash',sk*0.72,s2);
   for(let d=0.55;d<sk-0.3;d+=0.7+h(d)*0.4){const px=x0+d*pk;if(!pois.some(p=>Math.abs(p.x-px)<2500))lights.push({x:px,ph:Math.floor(h(d*9)*1980)});}}
  else if(s.type==='village'){if(h(5)<0.6)add('veda',0.2,s2);add('kis',sk*0.45,s2);if(sk>=2)add('trafik',sk*0.7,s2);}});
 pois.sort((a,b)=>a.x-b.x);
 return {len:len,segs:segs,pois:pois,stations:pois.filter(p=>p.type==='fuel').map(p=>p.x),lights:lights,kmPerPx:1/pk,ts:ts};}
function segAtIn(segs,x){for(const s of segs)if(x<s.x1)return s;return segs[segs.length-1];}

/* ---- ég, felhők, nap ---- */
function skyCols(L){if(L.time==='night')return ['#060a24','#22325f'];if(L.weather==='storm')return ['#2f3744','#6f7987'];
 if(['rain','snow','cloudy','fog'].includes(L.weather))return ['#8797ad','#d8dfe6'];if(L.time==='dusk')return ['#2f3b78','#f29a5f'];if(L.time==='sunset')return ['#46589f','#ffb06a'];return ['#3d97e6','#cbeeff'];}
let STARS=null;
function cg(g,key,make){const m=g.__gc||(g.__gc=new Map());let v=m.get(key);if(!v){if(m.size>60)m.clear();v=make();m.set(key,v);}return v;}
function drawSky(g,L,t){const [a,b]=skyCols(L);g.fillStyle=cg(g,'sky'+a+b,()=>lg(g,0,0,0,ROADT,[[0,a],[1,b]]));g.fillRect(0,0,W,ROADT);
 if(L.time==='night'){if(!STARS||STARS.sc!==SC){const [c,x]=mk(W,150,SC);for(let i=0;i<110;i++){x.fillStyle='rgba(255,255,255,'+(0.35+0.5*hsh(i))+')';x.fillRect(hsh(i*3+1)*W,hsh(i*7+2)*140,0.6,0.6);}STARS={c:c,sc:SC};}g.drawImage(STARS.c,0,0,W,150);
  if(!LOWQ)for(let i=0;i<8;i++){const x=hsh(i*31+5)*W,y=hsh(i*17+3)*120,a=0.4+0.6*Math.abs(Math.sin(t*0.03+i*1.7));g.fillStyle='rgba(255,255,255,'+a+')';g.fillRect(x,y,0.8,0.8);}
  glow(g,400,36,30,'rgba(240,240,210,0.25)');disc(g,'#f4f1d8',400,36,9);disc(g,'rgba(200,195,170,0.6)',397,33,2);disc(g,'rgba(200,195,170,0.6)',403,39,1.2);return;}
 if(L.weather!=='sun'&&L.weather!=='clear')return;
 if(L.time==='sunset'||L.time==='dusk'){glow(g,380,150,70,'rgba(255,200,120,0.55)');disc(g,'#ffe3a0',380,150,16);return;}
 glow(g,405,38,60,'rgba(255,250,210,0.6)');disc(g,'#fff9d8',405,38,12);}
function cloud(g,x,y,s,cA,cB){disc(g,cB,x,y+4*s,9*s);disc(g,cB,x+15*s,y+5*s,8*s);disc(g,cA,x+6*s,y,10*s);disc(g,cA,x+19*s,y+2*s,7.5*s);disc(g,cA,x-6*s,y+3*s,6.5*s);
 g.fillStyle=lg(g,0,y,0,y+12*s,[[0,'rgba(255,255,255,0)'],[1,'rgba(0,20,50,0.08)']]);g.fillRect(x-14*s,y-2*s,44*s,15*s);}
function drawClouds(g,L,dist,t){const oc=['rain','storm','snow','cloudy','fog'].includes(L.weather),night=L.time==='night';
 const cA=night?'#2a345e':oc?(L.weather==='storm'?'#5b6472':'#cdd4dc'):'#ffffff',cB=night?'#1f2950':oc?(L.weather==='storm'?'#454d5a':'#aeb8c3'):'#e1ecf5';
 const o=dist*0.04+t*0.12,slot=110,i0=Math.floor(o/slot)-1,s=oc?1.4:1;
 for(let i=i0;i<i0+7;i++){const h=hsh(i*31+7);if(!oc&&h<0.35)continue;cloud(g,i*slot-o+h*40,14+hsh(i*13+1)*55,s*(0.8+hsh(i*5)*0.5),cA,cB);}birds(g,L,t);}
function hills(g,o,col,base,amp,f,seed){g.fillStyle=cg(g,'h'+col+base+amp,()=>lg(g,0,base-amp*1.6,0,ROADT,[[0,col],[1,shade(col,0.82)]]));g.beginPath();g.moveTo(0,ROADT);
 for(let x=0,st=LOWQ?5:3;x<=W;x+=st){const X=x+o;g.lineTo(x,base-amp*Math.sin(X*f+seed)-amp*0.6*Math.sin(X*f*2.3+seed*3));}g.lineTo(W,ROADT);g.closePath();g.fill();}
/* ---- előre megrajzolt képek a sok apró alakzat helyett (telefonon a sok rajzolási művelet a lassú, nem a felbontás) ---- */
const LTC=new Map(),SPR=new Map();
function lruGet(m,k){const e=m.get(k);if(e!==undefined){m.delete(k);m.set(k,e);}return e;}
function lruPut(m,k,e,max){if(m.size>=max)m.delete(m.keys().next().value);m.set(k,e);}
/* parallax-sáv csempékben: a sáv 'f' sebességgel mozog; egy csempe egy képernyőnyi szélességű, egyszer rajzolódik */
function layerTiles(g,key,f,dist,y0,h,draw){const Dt=W/f,k=Math.floor(dist/Dt),sh=(dist-k*Dt)*f;
 for(let j=0;j<2;j++){const kk=k+j,ck=key+'|'+kk+'|'+SC;let c=lruGet(LTC,ck);
  if(!c){let cv=null,x=null;if(LTC.size>=8){const k0=LTC.keys().next().value,o=LTC.get(k0);LTC.delete(k0);if(o.width===Math.round((W+2)*SC)&&o.height===Math.round(h*SC)){cv=o;x=o.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.setTransform(SC,0,0,SC,0,0);}}
   if(!cv)[cv,x]=mk(W+2,h,SC);x.save();x.translate(0,-y0);draw(x,kk*Dt);x.restore();c=cv;LTC.set(ck,c);}
  g.drawImage(c,j*W-sh,y0,W+2,h);}}
/* egy tárgy (ház, fasor, templom...) képe; a fényeket (éjjel) is megjegyzi */
function sprite(g,key,dx,dy,w,h,lights,draw){const ck=key+'|'+SC;let e=lruGet(SPR,ck);
 if(!e){let c,x;if(SPR.size>=18){const k0=SPR.keys().next().value,o=SPR.get(k0);SPR.delete(k0);if(o.c.width===Math.round(w*SC)&&o.c.height===Math.round(h*SC)){c=o.c;x=o.x;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);x.setTransform(SC,0,0,SC,0,0);}}
  if(!c)[c,x]=mk(w,h,SC);const ll=[];draw(x,ll);e={c:c,x:x,l:ll};SPR.set(ck,e);}/* a legrégebbi kép vásznát újrahasznosítja: nem keletkezik folyton új */
 g.drawImage(e.c,dx,dy,w,h);if(lights)for(const l of e.l)lights.push({x:l.x+dx,y:l.y+dy,r:l.r});}
function drawFar(g,L,seg,dist,lights){const snow=L.weather==='snow',night=L.time==='night',reg=L.region;
 if(reg==='alps'||(reg==='it'&&seg.type==='motorway')){const o=dist*0.06,slot=120,i0=Math.floor(o/slot)-1;
  for(let i=i0;i<i0+6;i++){const h=hsh(i*17+3),px=i*slot-o+60+(h-0.5)*40,ph=70+h*75,base=ROADT-10;
   g.fillStyle=lg(g,0,base-ph,0,base,[[0,'#8fa0c0'],[1,'#5f7092']]);g.beginPath();g.moveTo(px-105,base);g.quadraticCurveTo(px-30,base-ph*0.8,px,base-ph);g.quadraticCurveTo(px+30,base-ph*0.8,px+105,base);g.closePath();g.fill();
   g.fillStyle='rgba(30,40,70,0.18)';g.beginPath();g.moveTo(px,base-ph);g.quadraticCurveTo(px+30,base-ph*0.8,px+105,base);g.lineTo(px+20,base);g.closePath();g.fill();
   g.fillStyle='#f5f8fb';g.beginPath();g.moveTo(px,base-ph);g.quadraticCurveTo(px+12,base-ph*0.86,px+26,base-ph*0.7);g.lineTo(px+12,base-ph*0.74);g.lineTo(px+2,base-ph*0.66);g.lineTo(px-10,base-ph*0.75);g.lineTo(px-26,base-ph*0.7);g.quadraticCurveTo(px-12,base-ph*0.86,px,base-ph);g.fill();}
  hills(g,dist*0.18,snow?'#e6edf3':'#5f9a5a',ROADT-24,7,0.012,5);return;}
 if(seg.type==='town'){layerTiles(g,'sky|'+night,0.1,dist,ROADT-142,142,(x,d)=>skyline(x,d,night));return;}

 if(reg==='it'&&seg.type!=='country'){g.fillStyle=lg(g,0,ROADT-48,0,ROADT,[[0,night?'#1d3d6b':'#5aa4dc'],[1,night?'#132a4a':'#2f78b8']]);g.fillRect(0,ROADT-48,W,48);
  for(let i=0;i<26;i++){const x=((hsh(i)*W-dist*0.12*(0.5+hsh(i+9)))%W+W)%W;R(g,'rgba(220,240,255,0.7)',x,ROADT-44+hsh(i*5)*30,5,0.6);}
  R(g,'#e8d3a2',0,ROADT-14,W,14);return;}
 const col1=snow?'#dfe7ee':reg==='provence'||reg==='tuscany'?'#a9b46a':reg==='es'?'#c9b27a':reg==='nordic'?'#6f9a6a':'#8cbc72',col2=snow?'#cfd9e2':reg==='provence'||reg==='tuscany'?'#8a9a52':reg==='es'?'#b0955a':reg==='nordic'?'#4f7d55':'#6aa35a';
 hills(g,dist*0.05,snow?'#e9eff4':shade(col1,1.08),ROADT-62,10,0.006,11);if(!night)haze(g,ROADT-80,ROADT-46,0.35);
 hills(g,dist*0.08,col1,ROADT-50,12,0.008,7);if(!night)haze(g,ROADT-62,ROADT-36,0.22);hills(g,dist*0.16,col2,ROADT-32,9,0.014,3);
 const tt=typeof G!=='undefined'?G.t:0;farLand(g,L,seg,dist,tt,snow);layerTiles(g,'fb|'+L.region+'|'+(seg.cc||'HU')+'|'+snow+'|'+LOWQ,0.3,dist,ROADT-44,36,(x,d)=>fieldBand(x,L,seg,d,snow));}


/* ---- táj részletei: madarak, mezők, szélkerekek, fák ---- */
function skyline(g,dist,night){const o=dist*0.1,slot=22,i0=Math.floor(o/slot)-1;
  for(let i=i0;i<i0+25;i++){const h=hsh(i*7+1),x=i*slot-o,bh=30+h*80;frr(g,night?'#27315a':'#a7b7cd',x,ROADT-12-bh,slot-2,bh+12,1.5);
   if(h>0.8)R(g,night?'#27315a':'#a7b7cd',x+8,ROADT-26-bh,1.5,14);
   for(let wy=ROADT-8-bh,r=0;wy<ROADT-16;wy+=6,r++)for(let wx=x+3,c=0;wx<x+slot-5;wx+=5,c++){const lit=night&&hsh(i*991+r*37+c*7+1)>0.55;R(g,lit?'#ffd77a':(night?'#38446a':'#c3d0df'),wx,wy,2,3);}}}
function birds(g,L,t){if(LOWQ||L.time==='night'||['rain','storm','snow','fog'].includes(L.weather))return;const n=L.weather==='cloudy'?3:5;
 for(let i=0;i<n;i++){const sp=0.18+hsh(i*7+3)*0.22,x=((hsh(i*11)*W*1.6+t*sp)%(W*1.6))-W*0.3,y=30+hsh(i*5+1)*60+Math.sin(t*0.02+i)*4,fl=Math.sin(t*0.25+i*2)*1.6,s=0.8+hsh(i*3)*0.6;
  g.strokeStyle='rgba(40,48,60,0.75)';g.lineWidth=0.7;g.beginPath();g.moveTo(x-3*s,y-fl);g.quadraticCurveTo(x-1.4*s,y-1.2*s,x,y);g.quadraticCurveTo(x+1.4*s,y-1.2*s,x+3*s,y-fl);g.stroke();}}
function haze(g,y0,y1,a){if(LOWQ)return;g.fillStyle=lg(g,0,y0,0,y1,[[0,'rgba(255,255,255,0)'],[1,'rgba(235,242,250,'+a+')']]);g.fillRect(0,y0,W,y1-y0);}
const FIELD_COLS={wheat:['#e2c25a','#c9a640'],green:['#86ba5c','#6c9f48'],plow:['#8e6c4a','#74563a'],rape:['#eadc4c','#cdbd2e'],sunf:['#5d8a3a','#e9b62a'],corn:['#8aae4a','#6f9038'],lav:['#9a78d4','#7d5cb8']};
function fieldBand(g,L,seg,dist,snow){const yT=ROADT-27,yB=ROADT-10,f=0.3,o=dist*f,slot=96,i0=Math.floor(o/slot)-1,reg=L.region,cc=seg.cc||'HU';
 const types=reg==='provence'?['lav','lav','wheat','green']:reg==='es'?['wheat','plow','wheat','sunf','plow']:reg==='tuscany'?['wheat','green','sunf','plow','wheat']:reg==='nordic'?['green','plow','rape','green']:cc==='NL'?['green','green','plow','rape']:['wheat','green','plow','rape','sunf','corn','wheat'];
 for(let i=i0;i<i0+7;i++){const h=hsh(i*29+11),w=slot+(hsh(i*3+1)-0.5)*30,x=i*slot-o+(hsh(i*7)-0.5)*10,tp=types[(h*types.length)|0];let [c1,c2]=FIELD_COLS[tp];
  if(snow){c1='#e9eff4';c2='#cfd9e2';}
  g.fillStyle=lg(g,0,yT,0,yB,[[0,shade(c1,0.92)],[1,c1]]);g.beginPath();g.moveTo(x,yT+1+h*2);g.lineTo(x+w,yT+2-h);g.lineTo(x+w+6,yB);g.lineTo(x-6,yB);g.closePath();g.fill();
  // sorok: fölül sűrűbb, lent ritkább (perspektíva)
  if(!LOWQ){g.strokeStyle=snow?'rgba(160,175,190,0.5)':shade(c2,0.95);g.lineWidth=0.5;}if(!LOWQ)for(let k=0,yy=yT+3;yy<yB;k++,yy+=1.1+k*0.42){g.beginPath();g.moveTo(x-3+(yy-yT)*-0.2,yy);g.lineTo(x+w+3+(yy-yT)*0.2,yy);g.stroke();}
  if(!snow&&!LOWQ&&tp==='sunf')for(let k=0;k<w;k+=3.2)for(let r=0;r<3;r++){const yy=yT+5+r*4;disc(g,'#f2c12e',x+k+r*1.6,yy,0.8+r*0.25);}
  if(!snow&&tp==='wheat'&&h>0.55)for(let k=0;k<3;k++){const bx=x+14+k*(w/3.2)+hsh(i*5+k)*8,by=yB-3-hsh(i+k)*6,r=1.6+(by-yT)*0.08;disc(g,'#b58d3a',bx,by,r);g.strokeStyle='#8f6c28';g.lineWidth=0.4;g.beginPath();g.arc(bx,by,r*0.55,0,TAU);g.stroke();disc(g,'rgba(0,0,0,0.15)',bx+r*0.6,by+r*0.7,r*0.5);}
  // határsáv: fasor vagy bokor
  if(h<0.35&&!(reg==='provence'))for(let k=0;k<5;k++){const px=x+w-2+k*0.2,py=yT+2,ph=7+hsh(i*9+k)*4;ell(g,snow?'#c9d3dc':'#3f6e3a',px+k*3.2-6,py-ph/2+1,1.4,ph/2);}}}
function turbine(g,x,b,h,t,ph){line(g,'#e8edf1',x,b,x,b-h,1.3);line(g,'rgba(120,130,140,0.4)',x+0.5,b,x+0.5,b-h,0.4);frr(g,'#eef2f5',x-1.6,b-h-1.2,3.6,2.4,1);
 const a=t*0.035+ph;for(let k=0;k<3;k++){const an=a+k*TAU/3;line(g,'#f4f7f9',x,b-h,x+Math.cos(an)*h*0.42,b-h+Math.sin(an)*h*0.42,0.9);}disc(g,'#dfe5ea',x,b-h,0.9);}
function windmill(g,x,b,t,ph){g.fillStyle='#5b4636';g.beginPath();g.moveTo(x-6,b);g.lineTo(x-3.5,b-20);g.lineTo(x+3.5,b-20);g.lineTo(x+6,b);g.closePath();g.fill();
 g.fillStyle='#3b2f28';g.beginPath();g.moveTo(x-4.5,b-20);g.quadraticCurveTo(x,b-27,x+4.5,b-20);g.closePath();g.fill();R(g,'#e9dcc0',x-1,b-6,2,6);
 const a=t*0.015+ph;for(let k=0;k<4;k++){const an=a+k*TAU/4,ex=x+Math.cos(an)*16,ey=b-22+Math.sin(an)*16;line(g,'#3b2f28',x,b-22,ex,ey,0.8);
  const nx=-Math.sin(an)*2.6,ny=Math.cos(an)*2.6;g.fillStyle='rgba(240,232,215,0.85)';g.beginPath();g.moveTo(x+Math.cos(an)*4,b-22+Math.sin(an)*4);g.lineTo(ex,ey);g.lineTo(ex+nx,ey+ny);g.lineTo(x+Math.cos(an)*4+nx,b-22+Math.sin(an)*4+ny);g.closePath();g.fill();}disc(g,'#2a221d',x,b-22,1.2);}
function farm(g,x,b,snow){frr(g,'#a8432e',x,b-9,16,9,0.5);g.fillStyle=snow?'#f1f5f8':'#6d2f22';g.beginPath();g.moveTo(x-1.5,b-9);g.lineTo(x+8,b-15);g.lineTo(x+17.5,b-9);g.closePath();g.fill();R(g,'#f0e6d0',x+6,b-6,4,6);
 frr(g,'#cfd5da',x+19,b-17,5,17,2.5);disc(g,'#b9c1c8',x+21.5,b-17,2.5);}
function farLand(g,L,seg,dist,t,snow){const f=0.3,o=dist*f,slot=160,i0=Math.floor(o/slot)-1,cc=seg.cc||'HU',b=ROADT-24;
 for(let i=i0;i<i0+5;i++){const h=hsh(i*41+5),x=i*slot-o+hsh(i*3)*60;
  if(cc==='NL'){if(h<0.55)windmill(g,x,b+4,t,i);else if(h<0.75)farm(g,x,b+3,snow);}
  else if((seg.type==='motorway'||seg.type==='country')&&['HU','AT','DE','FR'].includes(cc)&&h<0.32){for(let k=0;k<3;k++)turbine(g,x+k*18,b-2+k,26-k*3,t,i+k*1.7);}
  else if(h<0.5&&seg.type!=='motorway')farm(g,x,b+2,snow);}}
function poplar(g,x,b,h,snow){frr(g,'#5d4630',x-0.8,b-5,1.8,5,0.6);g.fillStyle=lg(g,x-4,0,x+4,0,[[0,'#4f8a3e'],[1,'#2f5f2c']]);g.beginPath();g.moveTo(x,b-h);g.quadraticCurveTo(x+5,b-h*0.55,x+2.6,b-4);g.lineTo(x-2.6,b-4);g.quadraticCurveTo(x-5,b-h*0.55,x,b-h);g.fill();
 g.fillStyle='rgba(255,255,255,0.12)';g.beginPath();g.moveTo(x-0.5,b-h+3);g.quadraticCurveTo(x-3.6,b-h*0.55,x-1.6,b-7);g.lineTo(x-0.6,b-7);g.closePath();g.fill();if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(x,b-h);g.quadraticCurveTo(x+2.4,b-h*0.8,x+3.4,b-h*0.62);g.lineTo(x-3.4,b-h*0.62);g.quadraticCurveTo(x-2.4,b-h*0.8,x,b-h);g.fill();}}
function birch(g,x,b,s,snow){frr(g,'#f1efe8',x-1,b-s*12,2.2,s*12,1);for(let k=1;k<6;k++)R(g,'#2b2b2b',x-1+(k%2),b-s*k*2,1.2,0.6);
 for(const [dx,dy,r,c] of [[-3,-13,3.4,'#7fb85a'],[2.8,-14.5,3.2,'#93c868'],[0,-17,3.4,'#a3d474'],[-1,-11,2.6,'#6aa24a']])disc(g,snow?'#e8eef3':c,x+dx*s/2.6,b+dy*s,r*s);}
function bush(g,x,b,s,snow,fl){disc(g,snow?'#dfe7ee':'#3e7a37',x,b-s*2.2,s*3);disc(g,snow?'#eef3f7':'#58984a',x+s*2.8,b-s*2.8,s*2.6);disc(g,snow?'#e6edf3':'#4a8a40',x+s*5,b-s*2,s*2.4);
 if(fl&&!snow)for(let k=0;k<5;k++)disc(g,['#ff6b8a','#ffffff','#ffd84a'][k%3],x-1+k*1.6,b-s*(2.5+hsh(k*7+fl)*2),0.6);}

/* ---- falusi elemek ---- */
function gemeskut(g,x,b,snow){frr(g,'#9a8f80',x-5,b-8,10,8,1.5);R(g,'#7a7064',x-5,b-8,10,1.6);line(g,'#6b4a2b',x+14,b,x+14,b-30,2.4);
 line(g,'#7a5634',x-12,b-38,x+34,b-22,1.6);line(g,'#5a3d22',x-10,b-37,x-1,b-10,0.6);frr(g,'#5a3d22',x-3,b-12,4,3,0.6);frr(g,'#6b4a2b',x+28,b-27,8,6,1);if(snow)R(g,'#f4f8fb',x-5,b-9,10,1.4);}
function haystack(g,x,b,snow){g.fillStyle=snow?'#eef3f7':'#d9b45a';g.beginPath();g.moveTo(x-9,b);g.quadraticCurveTo(x-9,b-20,x,b-22);g.quadraticCurveTo(x+9,b-20,x+9,b);g.closePath();g.fill();
 if(!snow)for(let k=0;k<4;k++)line(g,'#b8913f',x-7+k*4,b-2,x-4+k*3,b-16,0.5);line(g,'#6b4a2b',x,b-22,x,b-26,1);}
function fenceRow(g,x,b,w){for(let k=0;k<=w;k+=7)frr(g,'#a07c4a',x+k,b-9,1.6,9,0.5);R(g,'#b8925a',x,b-7,w,1.2);R(g,'#b8925a',x,b-3.6,w,1.2);}
function chicken(g,x,b,t,i){const pk=((t+i*37)%90)<14;const hy=pk?b-2.6:b-5.4;ell(g,'#f6f3ec',x,b-3,3,2.2);disc(g,'#f6f3ec',x+2.6,hy,1.5);R(g,'#e53935',x+2.2,hy-2.2,1.2,1);R(g,'#f2a33a',x+3.8,hy,1.2,0.6);line(g,'#f2a33a',x,b-1,x,b,0.4);}
function farmyard(g,x,b,t,snow,i){fenceRow(g,x,b,74);for(let k=0;k<4;k++)chicken(g,x+10+k*14+Math.sin((t+k*50)*0.01)*4,b-1,t,i*4+k);
 if(hsh(i*13)>0.4){const cx=x+44;ell(g,'rgba(0,0,0,0.2)',cx+10,b-1,12,1.6);frr(g,'#f4f1ea',cx,b-14,20,9,3);disc(g,'#2a2a2a',cx+6,b-11,2);disc(g,'#2a2a2a',cx+14,b-9,1.6);for(const lx of [3,7,14,17])line(g,'#e8e3d6',cx+lx,b-6,cx+lx,b-1,1.4);frr(g,'#f4f1ea',cx+18,b-18,6,6,2);frr(g,'#f3a7b0',cx+21,b-14.5,3.4,2.4,1);}
 frr(g,'#8a5a2b',x+60,b-12,12,12,1);g.fillStyle='#6d2f22';g.beginPath();g.moveTo(x+58,b-12);g.lineTo(x+66,b-18);g.lineTo(x+74,b-12);g.closePath();g.fill();}
function garden(g,x,b,snow){R(g,snow?'#e6edf3':'#6b4f35',x,b-4,70,4);if(!snow)for(let k=0;k<14;k++){disc(g,k%3?'#4f9a3e':'#e53935',x+3+k*5,b-5,k%3?1.8:1.3);line(g,'#3d7a2f',x+3+k*5,b-4,x+3+k*5,b-6,0.5);}
 for(let k=0;k<3;k++){line(g,'#7a5634',x+8+k*26,b,x+8+k*26,b-14,0.8);}line(g,'#8a6a3e',x+6,b-10,x+62,b-10,0.4);}
/* ---- középső réteg: házak, fák, táblák ---- */
function tree(g,x,b,s,snow){frr(g,lg(g,x+s*4-1,0,x+s*4+1.4,0,[[0,'#7a5634'],[1,'#4e3520']]),x+s*4-1,b-s*7,2.4,s*7,1);disc(g,'rgba(0,0,0,0.12)',x+s*4.3,b,s*3.6);disc(g,'#2f6230',x+s*5.4,b-s*9.4,s*3.6);disc(g,'#356f33',x+s*4.3,b-s*10,s*4.2);disc(g,'#4e9446',x+s*3.2,b-s*11.2,s*3.2);disc(g,'#5fa652',x+s*4.8,b-s*12.6,s*2.4);disc(g,'rgba(255,255,255,0.12)',x+s*2.8,b-s*12,s*1.5);if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.arc(x+s*4,b-s*12,s*3.8,Math.PI,TAU);g.fill();}}
function pine(g,x,b,h,snow){frr(g,'#5a3d22',x+6,b-6,3,6,1);for(let k=0;k<3;k++){const y=b-6-k*h/4;g.fillStyle=lg(g,x,0,x+15,0,[[0,'#2b6342'],[1,'#1f4d33']]);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y-h/4,x+7.5,y-h/2.2);g.quadraticCurveTo(x+9,y-h/4,x+15,y);g.closePath();g.fill();
  if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(x+4,y-h/3.4);g.lineTo(x+7.5,y-h/2.2);g.lineTo(x+11,y-h/3.4);g.quadraticCurveTo(x+7.5,y-h/3.8,x+4,y-h/3.4);g.fill();}}}
function house(g,x,b,col,roof,night,lights,snow,num){frr(g,lg(g,x,0,x+44,0,[[0,col],[1,shade(col,0.88)]]),x,b-26,44,26,1);g.fillStyle=roof;g.beginPath();g.moveTo(x-4,b-25);g.lineTo(x+22,b-44);g.lineTo(x+48,b-25);g.closePath();g.fill();
 g.fillStyle='rgba(0,0,0,0.15)';g.beginPath();g.moveTo(x+22,b-44);g.lineTo(x+48,b-25);g.lineTo(x+22,b-25);g.closePath();g.fill();if(snow){g.fillStyle='#f4f8fb';g.beginPath();g.moveTo(x+1,b-28.5);g.lineTo(x+22,b-44);g.lineTo(x+43,b-28.5);g.lineTo(x+22,b-41);g.closePath();g.fill();}
 frr(g,'#7a3b20',x+32,b-46,4,10,0.5);frr(g,'#7a4f28',x+18,b-14,8,14,1);disc(g,'#d9b24a',x+24.5,b-7,0.6);
 for(const wx of [5,30]){frr(g,night?'#ffd77a':lg(g,0,b-21,0,b-14,[[0,'#cfe6f3'],[1,'#7ea8c2']]),x+wx,b-21,8,7,0.6);R(g,'#ffffff',x+wx+3.6,b-21,0.8,7);frr(g,'#3f7d3a',x+wx-2,b-21,2,7,0.4);frr(g,'#3f7d3a',x+wx+8,b-21,2,7,0.4);if(night&&lights)lights.push({x:x+wx+4,y:b-17,r:8});}
 if(num){frr(g,'#2a5db0',x+28,b-13,7,4.4,0.8);text(g,num,x+29,b-12.2,'#fff',0.5,'left',null);}}
function church(g,x,b,night){frr(g,'#efe6d2',x,b-32,46,32,1);g.fillStyle='#a8432e';g.beginPath();g.moveTo(x-3,b-31);g.lineTo(x+23,b-46);g.lineTo(x+49,b-31);g.closePath();g.fill();
 frr(g,'#f5eedd',x+16,b-72,14,72,1);g.fillStyle='#4f7a6a';g.beginPath();g.moveTo(x+14,b-72);g.quadraticCurveTo(x+23,b-80,x+23,b-96);g.quadraticCurveTo(x+23,b-80,x+32,b-72);g.closePath();g.fill();
 R(g,'#d9b24a',x+22.4,b-102,1.2,7);R(g,'#d9b24a',x+20.5,b-99.5,5,1.2);disc(g,'#ffffff',x+23,b-60,3);line(g,'#333',x+23,b-60,x+23,b-62.4,0.5);frr(g,night?'#ffd77a':'#7aa7c7',x+20,b-48,6,10,3);frr(g,'#7a4f28',x+19,b-14,8,14,3);}
const BCOL=['#e3b98f','#c9d8e8','#f0d6a8','#d7a3a0','#b8cfb2','#e9e1cf','#d9c7e8'].map(c=>[c,shade(c,0.85),shade(c,0.75),shade(c,0.7)]);
function building(g,x,b,w,h,i,night,lights){const bc=BCOL[(hsh(i*3)*BCOL.length)|0],col=bc[0];
 R(g,col,x,b-h,w,h);R(g,bc[1],x+w*0.6,b-h,w*0.4,h);R(g,bc[2],x,b-h,w,3);
 // ablakok: egyszerű kitöltés + csillanás (nincs ablakonkénti színátmenet)
 for(let wy=b-h+8,r=0;wy<b-24;wy+=12,r++)for(let wx=x+5,c=0;wx<x+w-8;wx+=12,c++){const lit=night&&hsh(i*77+r*29+c*5+3)>0.45;
  if(lit){R(g,'#ffd77a',wx,wy,7,8);if(lights)lights.push({x:wx+3,y:wy+4,r:6});}else if(night)R(g,'#2e3550',wx,wy,7,8);else{R(g,'#8fb6cf',wx,wy,7,8);R(g,'#cfe6f3',wx,wy,7,2.6);}
  R(g,bc[3],wx-1,wy+8,9,1);}
 const a1=['#e53935','#1e88e5','#43a047','#fb8c00'][(hsh(i*5)*4)|0];for(const [col2,par] of [[a1,1],['#ffffff',0]]){g.fillStyle=col2;g.beginPath();for(let k=0;k<w;k+=6){if(((k/6)%2)!==par)continue;g.moveTo(x+k,b-22);g.lineTo(x+k+6,b-22);g.lineTo(x+k+6,b-18);g.quadraticCurveTo(x+k+3,b-16,x+k,b-18);g.closePath();}g.fill();}
 frr(g,night?'#ffe9a8':'#5f6f7f',x+4,b-15,w/2-6,10,1);frr(g,'#5a3d22',x+w-18,b-17,10,17,1);if(night&&lights)lights.push({x:x+w/4,y:b-10,r:14});}
function palm(g,x,b){g.strokeStyle='#8a6a3e';g.lineWidth=3;g.beginPath();g.moveTo(x+8,b);g.quadraticCurveTo(x+4,b-28,x+10,b-50);g.stroke();
 for(const [dx,dy] of [[-16,6],[16,6],[-12,-6],[12,-6],[0,-10]]){g.strokeStyle='#2f8a3e';g.lineWidth=2;g.beginPath();g.moveTo(x+10,b-50);g.quadraticCurveTo(x+10+dx*0.6,b-56+dy*0.3,x+10+dx,b-50+dy);g.stroke();}}
function roadSign(g,x,b,txt,kind){const t=txt.toUpperCase(),w=textW(t)+10;
 if(kind==='motorway'){line(g,'#7d858d',x+w/2,b,x+w/2,b-34,1.6);frr(g,'#ffffff',x,b-52,w,18,2);frr(g,'#1d5fb8',x+1,b-51,w-2,16,1.6);text(g,t,x+5,b-46,'#ffffff',1,'left',null);}
 else if(kind==='exit'){line(g,'#7d858d',x+w/2,b,x+w/2,b-22,1.4);frr(g,'#ffffff',x,b-36,w,14,1);g.strokeStyle='#1a1a1a';g.lineWidth=1;rrect(g,x+1,b-35,w-2,12,1);g.stroke();text(g,t,x+5,b-32,'#1a1a1a',1,'left',null);line(g,'#d32f2f',x+2,b-23,x+w-2,b-35,1.6);}
 else{line(g,'#7d858d',x+w/2,b,x+w/2,b-22,1.4);frr(g,'#ffffff',x,b-36,w,14,1);g.strokeStyle='#1a1a1a';g.lineWidth=1;rrect(g,x+1,b-35,w-2,12,1);g.stroke();text(g,t,x+5,b-32,'#1a1a1a',1,'left',null);}}
function limitSign(g,x,b,v){line(g,'#7d858d',x,b,x,b-20,1.2);disc(g,'#d32f2f',x,b-25,6.2);disc(g,'#ffffff',x,b-25,4.6);text(g,String(v),x+0.3,b-27.4,'#111',v>=100?0.42:0.55,'center',null);}
function midItem(g,i,x,b,s,h,reg,night,snow,lights){
  if(s.type==='town'){if(reg==='it'&&h<0.25){palm(g,x+10,b);return;}building(g,x,b,78,60+hsh(i*7)*70,i,night,lights);}
  else if(s.type==='village'){const tt=typeof G!=='undefined'?G.t:0;if(h<0.08)church(g,x+20,b,night);else if(h>=0.48&&h<0.58){farmyard(g,x+4,b,tt,snow,i);return;}else if(h>=0.58&&h<0.66){gemeskut(g,x+20,b,snow);haystack(g,x+58,b,snow);return;}else if(h>=0.66&&h<0.72){garden(g,x+6,b,snow);return;}else if(h>=0.72&&h<0.8){birch(g,x+14,b,2.6,snow);bush(g,x+34,b,1.6,snow,i);poplar(g,x+64,b,46,snow);return;}else if(h<0.48)house(g,x+18,b,['#f4efe2','#f2e2b8','#e8d6c8','#dfe9ef'][(hsh(i)*4)|0],reg==='provence'?'#c2552f':['#b5452b','#8a3a2a','#a85a2a'][(hsh(i*9)*3)|0],night,lights,snow);else{tree(g,x+10,b,3,snow);tree(g,x+48,b,2,snow);}}
  else if(s.type==='country'){if(reg==='alps'||reg==='nordic'){pine(g,x+6,b,40+h*20,snow);pine(g,x+40,b,30+h*12,snow);}else if(h<0.3){tree(g,x+18,b,3,snow);bush(g,x+52,b,1.5,snow,i);}else if(h<0.42){for(let k=0;k<4;k++)poplar(g,x+8+k*17,b,48+hsh(i*5+k)*14,snow);}else if(h<0.52){birch(g,x+12,b,2.6,snow);birch(g,x+34,b,2.2,snow);bush(g,x+56,b,1.4,snow,i);}else if(h<0.58&&reg==='hu'){house(g,x+6,b,'#f4efe2','#8a3a2a',night,lights,snow);gemeskut(g,x+66,b,snow);return;}else if(h<0.62){haystack(g,x+20,b,snow);haystack(g,x+46,b,snow);}else if(h<0.7){tree(g,x+6,b,2,snow);tree(g,x+44,b,3,snow);}
   else if(h<0.85){line(g,'#6b4a2b',x+30,b,x+30,b-70,2.4);line(g,'#6b4a2b',x+21,b-66,x+39,b-66,1.6);}}
  else{if(h<0.16)tree(g,x+18,b,2.5,snow);else if(h<0.3){poplar(g,x+12,b,44,snow);poplar(g,x+30,b,50,snow);bush(g,x+50,b,1.4,snow,0);}else if(h<0.42&&reg!=='alps'){/* zajvédő fal */frr(g,'#a7b0ba',x,b-22,84,22,1);for(let k=0;k<84;k+=12)R(g,'#8f99a4',x+k,b-22,1,22);}}}
function drawMid(g,L,leg,dist,lights){const night=L.time==='night',snow=L.weather==='snow',f=0.55,o=dist*f,b=ROADT-8,reg=L.region;
 const slot=84,i0=Math.floor(o/slot)-1;
 for(let i=i0;i<i0+8;i++){const m=i*slot,x=m-o,wx=(m-PX)/f+PX,s=segAtIn(leg.segs,wx),h=hsh(i*13+5);
  // a tanya (kapirgáló csirkék) mozog, azt élőben rajzolja; minden más egyszer megrajzolt kép
  if(s.type==='village'&&h>=0.48&&h<0.58){midItem(g,i,x,b,s,h,reg,night,snow,lights);continue;}
  sprite(g,'mid|'+i+'|'+s.type+'|'+reg+'|'+night+'|'+snow+'|'+LOWQ,x-30,b-150,144,158,lights,(gg,ll)=>midItem(gg,i,30,150,s,h,reg,night,snow,ll));}}
/* ---- közeli réteg: járda, korlát, táblák (az úttal együtt mozog) ---- */
function drawNear(g,L,leg,dist,lights,t){const snow=L.weather==='snow',night=L.time==='night',y0=ROADT-10;
 // típusonként sávokban rajzolva
 for(const s of leg.segs){const a=Math.max(0,s.x0-dist+PX),bx=Math.min(W,s.x1-dist+PX);if(bx<=a)continue;const w=bx-a;
  if(s.type==='town'){R(g,'#c4beb3',a,y0,w,10);for(let x=a-((dist+a)%16);x<bx;x+=16)if(x>=a)R(g,'#aaa398',x,y0,0.6,10);R(g,'#8f8a82',a,ROADT-2,w,2);}
  else if(s.type==='village'){R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);for(let x=a-((dist+a)%8);x<bx;x+=8)if(x>=a)frr(g,'#a07c4a',x,y0-4,1.8,12,0.6);R(g,'#b8925a',a,y0-1,w,1.6);R(g,'#b8925a',a,y0+4,w,1.6);}
  else if(s.type==='country'){R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);R(g,'#b9ab8c',a,ROADT-3,w,3);for(let x=a-((dist+a)%60);x<bx;x+=60)if(x>=a){frr(g,'#ffffff',x,y0-2,1.6,9,0.6);R(g,'#1a1a1a',x,y0-1,1.6,2);}}
  else{R(g,snow?'#eef3f7':'#5d9a4e',a,y0,w,10);R(g,lg(g,0,y0+1,0,y0+6,[[0,'#e2e6ea'],[1,'#8f979f']]),a,y0+1.5,w,3.6);for(let x=a-((dist+a)%24);x<bx;x+=24)if(x>=a)frr(g,'#7d858d',x,y0+1,1.8,9,0.5);}}
 // fű, virágok és kilométerkövek
 {const pk=1/leg.kmPerPx,x0=Math.floor((dist-PX)/5)*5;if(!LOWQ)for(let wx=x0;wx<dist-PX+W+5;wx+=5){const s=segAtIn(leg.segs,wx);if(s.type==='town')continue;const x=wx-dist+PX,h=hsh((wx/5)|0);
   if(h<0.55){const c=snow?'#d5dfe8':h<0.3?'#3f7f39':'#79b65e';line(g,c,x,y0+9,x-0.8,y0+5+h*4,0.5);line(g,c,x+1,y0+9,x+1.6,y0+4+h*5,0.5);}
   else if(!snow&&!LOWQ&&h>0.93&&s.type!=='motorway')disc(g,['#ff6b8a','#ffffff','#ffd84a','#b48cff'][((h*1000)|0)%4],x,y0+4+((h*50)|0)%5,0.75);}
  const k0=Math.max(1,Math.ceil((dist-PX-20)/pk)),k1=Math.floor((dist-PX+W+20)/pk);for(let k=k0;k<=k1;k++){const wx=k*pk,s=segAtIn(leg.segs,wx);if(s.type==='town')continue;const x=wx-dist+PX,km=String(k);
   frr(g,'#f4f4ef',x-3.5,y0-6,7,14,2.5);frr(g,s.type==='motorway'?'#2f6fd0':'#d33a2a',x-3.5,y0-6,7,4,2);R(g,'rgba(0,0,0,0.18)',x+2,y0-2,1.5,10);text(g,km.length>2?km.slice(-3):km,x,y0+0.5,'#1a1a1a',0.6,'center',null);}}
 // utcai lámpák városban
 for(let x=-((dist)%150)+40;x<W+10;x+=150){const wx=dist+x-PX,s=segAtIn(leg.segs,wx);if(s.type!=='town')continue;g.strokeStyle='#3a3f47';g.lineWidth=1.8;g.beginPath();g.moveTo(x,y0+8);g.lineTo(x,120);g.quadraticCurveTo(x,116,x+5,116);g.stroke();
  frr(g,'#3a3f47',x+3,115,8,3,1.2);frr(g,'#ffe9a3',x+4,117.6,6,1.2,0.6);if(night){glow(g,x+7,120,16,'rgba(255,230,160,0.35)');if(lights)lights.push({x:x+7,y:124,r:32});}}
 // vadveszély táblák országúton
 {const pk=1/leg.kmPerPx;for(const s of leg.segs){if(s.type!=='country')continue;for(let wx=s.x0+pk*0.35;wx<s.x1-pk*0.3;wx+=pk*3.5){const x=wx-dist+PX;if(x>-20&&x<W+20)wildSign(g,x,y0+8);}}}
 // helységnév-, autópálya- és sebességtáblák a szakaszhatárokon
 for(let k=0;k<leg.segs.length;k++){const s=leg.segs[k],sx=s.x0-dist+PX+30;if(sx<-90||sx>W+20)continue;const prev=leg.segs[k-1];
  if(s.type==='motorway'&&(!prev||prev.name!==s.name))roadSign(g,sx,y0+8,s.name,'motorway');
  else if((s.type==='town'||s.type==='village')&&s.name&&(!prev||prev.name!==s.name))roadSign(g,sx,y0+8,s.name,'town');
  if(prev&&(prev.type==='town'||prev.type==='village')&&prev.name!==s.name&&prev.name)roadSign(g,sx-70,y0+8,prev.name,'exit');
  if(!prev||prev.limit!==s.limit)limitSign(g,sx+(s.type==='motorway'||s.name?-14:6),y0+8,s.limit);}}

/* ---- út: minőség szerinti felület ---- */
let COBBLE=null;
function cobblePat(g){if(COBBLE)return COBBLE;const [c,x]=mk(12,6,SC);x.fillStyle='#6b6a6a';x.fillRect(0,0,12,6);
 for(const [cx,cy] of [[3,1.5],[9,1.5],[0,4.5],[6,4.5],[12,4.5]]){x.fillStyle='#878585';x.beginPath();x.ellipse(cx,cy,2.6,1.2,0,0,TAU);x.fill();x.fillStyle='rgba(255,255,255,0.15)';x.beginPath();x.ellipse(cx-0.6,cy-0.4,1.2,0.5,0,0,TAU);x.fill();}
 COBBLE=g.createPattern(c,'repeat');return COBBLE;}
function drawRoad(g,L,leg,dist,t){const snow=L.weather==='snow',wet=L.weather==='rain'||L.weather==='storm';
 for(const s of leg.segs){const a=Math.max(0,s.x0-dist+PX),bx=Math.min(W,s.x1-dist+PX);if(bx<=a)continue;const w=bx-a;
  const base=snow?'#7b818b':wet?'#3e424a':s.q==='bad'?'#5d6066':s.q==='medium'?'#575b62':'#4d5159';
  if(s.q==='cobble'&&!snow){const p=cobblePat(g);if(p.setTransform)p.setTransform(new DOMMatrix([1/SC,0,0,1/SC,-dist%12,0]));g.fillStyle=p;g.fillRect(a,ROADT,w,ROADB-ROADT);g.fillStyle='rgba(30,30,40,'+(wet?0.25:0.08)+')';g.fillRect(a,ROADT,w,ROADB-ROADT);}
  else{g.fillStyle=lg(g,0,ROADT,0,ROADB,[[0,shade(base,0.85)],[0.5,base],[1,shade(base,0.92)]]);g.fillRect(a,ROADT,w,ROADB-ROADT);}
  // foltok, repedések
  const den=s.q==='bad'?18:s.q==='medium'?45:999;
  for(let i=Math.floor((dist+a-PX)/den);i<Math.floor((dist+bx-PX)/den)+1;i++){const h=hsh(i*5+11),x=i*den-dist+PX;if(x<a||x>bx)continue;
   if(s.q==='bad'&&h>0.4){frr(g,'rgba(30,30,34,0.35)',x,ROADT+6+h*52,8+h*12,3+h*2,1.5);line(g,'rgba(20,20,24,0.5)',x+2,ROADT+8+h*40,x+9,ROADT+12+h*40,0.5);}
   else if(s.q==='medium'&&h>0.5)frr(g,'rgba(0,0,0,0.18)',x,ROADT+8+h*50,14,3,1.5);}
  R(g,'#30343a',a,ROADT,w,1.6);
  // felfestés
  const lc=snow?'rgba(240,244,248,0.4)':s.q==='bad'?'rgba(233,236,239,0.55)':'#e9ecef';
  if(s.q!=='cobble'){R(g,lc,a,ROADT+4,w,0.9);R(g,lc,a,ROADB-4,w,0.9);const dl=s.type==='motorway'?40:24,dw=s.type==='motorway'?20:12;
   for(let x=a-((dist+a)%dl);x<bx;x+=dl){const xs=Math.max(a,x),xe=Math.min(bx,x+dw);if(xe>xs){R(g,lc,xs,221.6,xe-xs,0.9);if(s.type==='motorway'||s.type==='country')R(g,lc,xs,241.6,xe-xs,0.9);else R(g,lc,xs,241.6,xe-xs,0.9);}}}
  if(s.type==='town'){for(let k=0;k<6;k++){const zx=s.x0+400+k*900-dist+PX;if(zx>a&&zx<bx-30)for(let z=0;z<8;z++)R(g,'#eef1f4',zx+z*4,ROADT+5,2.4,ROADB-ROADT-10);}}}
 if(snow)for(let i=Math.floor(dist/6);i<Math.floor(dist/6)+W/6+2;i++){const h=hsh(i*3);frr(g,'#f4f8fb',i*6-dist,ROADT-1,7,2+h*5,2);frr(g,'#f4f8fb',i*6-dist,ROADB-3-h*4,7,4+h*4,2);}
 if(wet)for(let i=Math.floor(dist/30);i<Math.floor(dist/30)+20;i++){const h=hsh(i*11);if(h>0.5)R(g,'rgba(180,210,240,0.22)',i*30-dist,ROADT+10+h*48,14,0.8);}
 const sgc=segAtIn(leg.segs,dist+PX);const gc=sgc.type==='town'?'#b6b0a6':L.region==='it'&&sgc.type!=='country'?'#e8d3a2':snow?'#eef3f7':'#5d9a4e';
 R(g,gc,0,ROADB,W,H-ROADB);R(g,'rgba(0,0,0,0.2)',0,ROADB,W,1);}
/* ---- közlekedési lámpa ---- */
/* jelzőlámpa ciklus (képkocka, 60/mp): zöld 20 mp, sárga 3 mp, piros 10 mp */
const LG_G=1200,LG_Y=180,LG_R=600,LG_C=LG_G+LG_Y+LG_R;
function lightState(l,t){const c=(t+l.ph)%LG_C;return c<LG_G?'green':c<LG_G+LG_Y?'yellow':'red';}
function drawTrafficLight(g,l,dist,t){const x=l.x-dist+PX;if(x<-20||x>W+20)return;const st=lightState(l,t);
 R(g,'#eef1f4',x,ROADT+4,1.6,ROADB-ROADT-8);line(g,'#2f343b',x+4,ROADT-8,x+4,ROADT-58,1.8);frr(g,'#1f2329',x,ROADT-74,8,18,2);
 for(const [k,c,yy] of [['red','#ff3b30',-70],['yellow','#ffcc00',-65],['green','#34c759',-60]]){disc(g,st===k?c:'#3a3f47',x+4,ROADT+yy,1.9);if(st===k)glow(g,x+4,ROADT+yy,7,{red:'rgba(255,59,48,0.6)',yellow:'rgba(255,204,0,0.6)',green:'rgba(52,199,89,0.6)'}[k]);}}
/* ---- benzinkút ---- */
function drawStation(g,sx,L,lights){if(sx<-230||sx>W+60)return;const night=L.time==='night'||L.time==='dusk';
 frr(g,lg(g,0,ROADT-60,0,ROADT-10,[[0,'#f3f5f7'],[1,'#d6dbe0']]),sx+150,ROADT-56,70,48,2);frr(g,'#2e7d4f',sx+150,ROADT-56,70,6,1);text(g,'SHOP',sx+175,ROADT-55,'#fff',0.8,'left',null);
 frr(g,night?'#ffe9a8':'#8fb4cf',sx+156,ROADT-44,30,22,1.5);frr(g,'#5a6470',sx+192,ROADT-40,16,32,1);
 frr(g,'#e9ecef',sx-10,ROADT-76,160,10,2);frr(g,'#2e7d4f',sx-10,ROADT-68,160,4,1);R(g,'#ffcf33',sx-10,ROADT-76,160,2);
 for(const c of [10,72,134])frr(g,'#b8bec6',sx+c,ROADT-64,4,56,1);text(g,'BENZINKÚT',sx+48,ROADT-74,'#2e7d4f',1,'left',null);
 for(const q of [40,104]){frr(g,'#3a3f47',sx+q-4,ROADT-4,18,4,1);frr(g,lg(g,0,ROADT-28,0,ROADT-4,[[0,'#3a9b62'],[1,'#25694a']]),sx+q-2,ROADT-28,14,24,2);frr(g,'#e9ecef',sx+q,ROADT-25,10,7,1);text(g,'95',sx+q+1.5,ROADT-23.5,'#1a1a1a',0.6,'left',null);
  frr(g,'#1b1f2a',sx+q+12,ROADT-20,2,10,1);}
 line(g,'#7d858d',sx+230,ROADT-8,sx+230,ROADT-112,2.4);frr(g,'#2e7d4f',sx+214,ROADT-136,34,26,2);R(g,'#ffcf33',sx+216,ROADT-134,30,2);text(g,'95',sx+217,ROADT-130,'#fff',0.8,'left',null);text(g,String(L.price),sx+217,ROADT-121,'#fff',0.8,'left',null);
 if(night&&lights){lights.push({x:sx+40,y:ROADT-60,r:44});lights.push({x:sx+104,y:ROADT-60,r:44});lights.push({x:sx+170,y:ROADT-34,r:30});}}
/* ---- megállók: kisbolt, hipermarket, trafik, újságos, sebességmérő kapu ---- */
function shopFront(g,sx,w,h,wall,sign,signCol,txtCol,night,lights){const b=ROADT-6;
 frr(g,lg(g,sx,0,sx+w,0,[[0,wall],[1,shade(wall,0.86)]]),sx,b-h,w,h,2);R(g,shade(wall,0.7),sx,b-h,w,2);
 frr(g,signCol,sx+4,b-h-9,w-8,10,2);text(g,sign,sx+w/2,b-h-7.5,txtCol,1,'center',null);
 frr(g,night?'#ffe9a8':lg(g,0,b-h+8,0,b-4,[[0,'#d4ebf6'],[1,'#7ea8c2']]),sx+5,b-h+8,w*0.55,h-12,1.5);R(g,'rgba(255,255,255,0.35)',sx+8,b-h+9,1.2,h-14);
 frr(g,'#4a3a2c',sx+w*0.68,b-h+6,w*0.22,h-6,1.5);disc(g,'#d9b24a',sx+w*0.68+2,b-h/2+2,0.6);
 if(night&&lights){lights.push({x:sx+w/2,y:b-h/2,r:w*0.6});glow(g,sx+w/2,b-h-4,w*0.4,'rgba(255,240,190,0.35)');}}
function drawPOI(g,p,sx,L,lights,t){const night=L.time==='night'||L.time==='dusk',b=ROADT-6;if(sx<-200||sx>W+60)return;
 if(p.type==='kis'){shopFront(g,sx,74,34,'#f3ead6','KISBOLT - ABC','#2e7d4f','#ffffff',night,lights);for(let k=0;k<3;k++){frr(g,'#a1744a',sx+8+k*12,b-6,10,6,1);for(let j=0;j<3;j++)disc(g,['#e53935','#fdd835','#43a047'][k],sx+10+k*12+j*3,b-6.5,1.3);}
  for(let k=0;k<74;k+=8){g.fillStyle=(k/8)%2?'#2e7d4f':'#ffffff';g.beginPath();g.moveTo(sx+k,b-27);g.lineTo(sx+k+8,b-27);g.lineTo(sx+k+8,b-24);g.quadraticCurveTo(sx+k+4,b-22.5,sx+k,b-24);g.fill();}}
 else if(p.type==='hiper'){frr(g,lg(g,0,b-52,0,b,[[0,'#dfe5ec'],[1,'#b9c3ce']]),sx-20,b-52,170,52,2);R(g,'#1e4fb5',sx-20,b-52,170,7);R(g,'#d32f2f',sx-20,b-45,170,3);
  frr(g,'#ffffff',sx+25,b-66,80,14,2);text(g,'HIPERMARKET',sx+65,b-62,'#1e4fb5',1,'center',null);for(let k=0;k<6;k++)frr(g,night?'#ffe9a8':'#9cc4dc',sx-12+k*26,b-36,20,14,1);
  frr(g,'#7fa6be',sx+50,b-22,32,22,1);line(g,'#eef1f4',sx+66,b-22,sx+66,b,0.6);if(night&&lights){lights.push({x:sx+66,y:b-26,r:60});}
  for(let k=0;k<3;k++){const cx=sx+96+k*9;g.strokeStyle='#9aa4ae';g.lineWidth=0.7;rrect(g,cx,b-9,7,5,1);g.stroke();disc(g,'#333',cx+1.5,b-2.5,0.9);disc(g,'#333',cx+5.5,b-2.5,0.9);}}
 else if(p.type==='trafik'){shopFront(g,sx,44,30,'#5a4632','TRAFIK','#1b1f26','#ffd84a',night,lights);disc(g,'#d32f2f',sx+38,b-40,4.4);disc(g,'#ffffff',sx+38,b-40,3.2);text(g,'18',sx+38.3,b-42,'#111',0.55,'center',null);}
 else if(p.type==='ujsag'){shopFront(g,sx,46,30,'#2f6b45','ÚJSÁG','#ffcf33','#1b1f26',night,lights);for(let k=0;k<5;k++)frr(g,['#e53935','#1e88e5','#fdd835','#8e24aa','#43a047'][k],sx+7+k*4.6,b-18,3.8,6,0.6);}
 else if(p.type==='veda'){/* háttér felőli oszlop és kamera */line(g,'#8f979f',sx,ROADT-2,sx,ROADT-74,2.2);frr(g,'#eef1f4',sx-3,ROADT-80,26,7,1.5);frr(g,'#1b1f26',sx+16,ROADT-79,8,5,1.5);disc(g,'#5a7a9a',sx+21,ROADT-76.5,1.2);
  frr(g,'#1e4fb5',sx-14,ROADT-96,30,12,2);text(g,'VÉDA',sx+1,ROADT-93,'#ffffff',1,'center',null);if(p.flash>0){glow(g,sx+21,ROADT-76,30,'rgba(255,255,255,0.95)');p.flash--;}}
 else if(p.type==='burger'){// saját tervezésű gyorsétterem: Burger Pont
  frr(g,lg(g,0,b-40,0,b,[[0,'#f6efe4'],[1,'#e4d8c6']]),sx-6,b-40,96,40,3);R(g,'#0e7c7b',sx-6,b-40,96,8);for(let k=0;k<96;k+=12)R(g,'#ff8c42',sx-6+k,b-32,6,2.5);
  for(let k=0;k<4;k++)frr(g,night?'#ffe9a8':'#a9d3e8',sx+k*20,b-27,15,13,1.5);frr(g,'#7fa6be',sx+24,b-14,16,14,1);
  frr(g,'#0e7c7b',sx-4,b-14,22,10,1.5);text(g,'AUTÓS',sx+7,b-12,'#ffffff',0.5,'center',null);text(g,'KISZOLG.',sx+7,b-8.6,'#ffd84a',0.5,'center',null);
  // pilon logóval: zsemle-szendvics és felirat
  line(g,'#5b636d',sx+100,b,sx+100,b-58,2.4);frr(g,'#0e7c7b',sx+82,b-80,38,24,4);disc(g,'#f2b155',sx+101,b-72,6);R(g,'#5b2b14',sx+95,b-71.5,12,1.8);R(g,'#7cc04a',sx+95,b-69.6,12,1.2);disc(g,'#e8a03e',sx+101,b-67,4.5);
  text(g,'BURGER',sx+101,b-63,'#ffffff',0.6,'center',null);text(g,'PONT',sx+101,b-59.6,'#ff8c42',0.6,'center',null);
  frr(g,'#ff8c42',sx+8,b-50,64,9,2);text(g,'GYORSÉTTEREM',sx+40,b-47.6,'#ffffff',1,'center',null);
  if(night){glow(g,sx+101,b-68,20,'rgba(255,170,90,0.35)');if(lights)lights.push({x:sx+40,y:b-20,r:40});}
  for(let k=0;k<2;k++){frr(g,'#ff8c42',sx+62+k*12,b-8,9,1.6,0.6);R(g,'#5b636d',sx+66+k*12,b-6.5,1,6.5);}}
 else if(p.type==='rest'){// pihenőhely: P tábla, padok, fák, mászóka, mosdó
  frr(g,'#1f5fbf',sx-4,b-46,16,16,2);text(g,'P',sx+4,b-42,'#ffffff',1.6,'center',null);line(g,'#8f979f',sx+4,b-30,sx+4,b,1.6);
  for(const tx of [18,64,118])tree(g,sx+tx,b-2,2.6,L.weather==='snow');
  frr(g,'#8a5a2b',sx+30,b-9,22,2.4,0.6);R(g,'#6b4a2b',sx+32,b-7,1.6,7);R(g,'#6b4a2b',sx+48,b-7,1.6,7);frr(g,'#8a5a2b',sx+28,b-4.5,26,1.6,0.6);
  // mászóka csúszdával
  line(g,'#d84a3a',sx+80,b,sx+80,b-20,1.4);line(g,'#d84a3a',sx+92,b,sx+92,b-20,1.4);R(g,'#ffcf33',sx+79,b-21,14,3);line(g,'#3b8bff',sx+92,b-19,sx+106,b-1,2.2);
  frr(g,'#e9e1cf',sx+134,b-22,22,22,1.5);R(g,'#7d5a3a',sx+134,b-24,22,3);text(g,'WC',sx+145,b-17,'#1f5fbf',0.8,'center',null);
  if(night&&lights)lights.push({x:sx+60,y:b-24,r:36});}
 else if(p.type==='garage')drawGarage(g,sx-30,night,lights,t,false);
 else if(p.type==='wash')drawWashBuilding(g,sx-24,night,lights,t);
 else if(p.type==='fuel')drawStation(g,sx,L,lights);}
function drawVedaFront(g,p,sx){if(sx<-30||sx>W+30)return;/* közeli oszlop, az autó mögötte halad el */line(g,'#9aa3ad',sx+14,ROADB+6,sx+14,ROADT-66,2.6);line(g,'#b8c0c8',sx,ROADT-74,sx+14,ROADT-66,2.4);
 frr(g,'#1b1f26',sx+8,ROADT-62,9,6,1.5);disc(g,'#5a7a9a',sx+12.5,ROADT-59,1.3);if(p.flash>0)glow(g,sx+12.5,ROADT-59,26,'rgba(255,255,255,0.9)');}
function advanceSign(g,sx,p,km,pk){const b=ROADT+2;const name=POI_NAME[p.type];
 if(p.type==='veda'){line(g,'#7d858d',sx,b,sx,b-18,1.2);g.fillStyle='#ffffff';g.beginPath();g.moveTo(sx,b-34);g.lineTo(sx+9,b-19);g.lineTo(sx-9,b-19);g.closePath();g.fill();g.strokeStyle='#d32f2f';g.lineWidth=1.6;g.stroke();
  frr(g,'#1b1f26',sx-3.5,b-27,7,4.4,1);disc(g,'#ffffff',sx,b-24.8,1.2);frr(g,'#ffffff',sx-18,b-17,36,7,1);text(g,'SEBESSÉGMÉRÉS',sx,b-15.6,'#1b1f26',0.42,'center',null);return;}
 const t1=name.toUpperCase(),t2=fmt(Math.round(km*1000/50)*50)+' M',w=Math.max(textW(t1),textW(t2))+10;line(g,'#7d858d',sx+w/2,b,sx+w/2,b-14,1.4);
 frr(g,'#ffffff',sx,b-36,w,22,2);frr(g,p.type==='fuel'?'#1d5fb8':'#2e7d4f',sx+1,b-35,w-2,20,1.6);text(g,t1,sx+w/2,b-32,'#ffffff',1,'center',null);text(g,t2,sx+w/2,b-23,'#ffd84a',1,'center',null);}
function drawPOIs(g,L,leg,dist,lights,t){const pk=1/leg.kmPerPx;
 for(const p of leg.pois){const sx=p.x-dist+PX;
  const adv=p.type==='veda'?0.3:0.5,ax=p.x-adv*pk-dist+PX;if(ax>-60&&ax<W+20)advanceSign(g,ax,p,adv,pk);
  if(sx>-240&&sx<W+80)drawPOI(g,p,sx,L,lights,t);}}
/* ---- útburkolati jelek: felirat és nyíl a megállók előtt, STOP a lámpáknál, sebesség a település elején ---- */
const MARK_TXT={wash:'MOSÓ',garage:'SZERVIZ',fuel:'BENZIN',kis:'BOLT',hiper:'BOLT',trafik:'TRAFIK',ujsag:'ÚJSÁG',burger:'ÉTTEREM',rest:'PIHENŐ'};
function paint(g,txt,x,y,a){g.save();g.translate(x,y);g.scale(1.5,0.62);g.globalAlpha=a||0.78;text(g,txt,0,-3.5,'#f2f2ec',1,'left',null);g.restore();}
function paintArrow(g,x,y,a){g.save();g.globalAlpha=a||0.78;g.fillStyle='#f2f2ec';g.beginPath();g.moveTo(x,y+2);g.lineTo(x+14,y+2);g.lineTo(x+20,y-3);g.lineTo(x+22,y-1.6);g.lineTo(x+24,y-6);g.lineTo(x+17,y-5.4);g.lineTo(x+19,y-4.2);g.lineTo(x+13.4,y);g.lineTo(x,y);g.closePath();g.fill();g.restore();}
function drawMarkings(g,leg,dist,t){const pk=1/leg.kmPerPx,y0=LANE[0]-5;
 for(const p of leg.pois){const tx=MARK_TXT[p.type];if(!tx)continue;for(const d of [0.2,0.09]){const x=p.x-pk*d-dist+PX;if(x<-140||x>W+10)continue;
   const w=textW(tx)*1.5;if(p.type==='rest'){frr(g,'rgba(242,242,236,0.75)',x-14,y0-6.5,10,6,1);g.save();g.scale(1,1);text(g,'P',x-9,y0-5.6,'#4d5159',1,'center',null);g.restore();}
   paint(g,tx,x,y0,0.78);paintArrow(g,x+w+6,y0,0.78);}}
 for(const l of leg.lights){const x=l.x-dist+PX;if(x<-80||x>W+10)continue;R(g,'rgba(242,242,236,0.85)',x-3,ROADT+5,2.6,ROADB-ROADT-10);for(const ln of [0,1,2])paint(g,'STOP',x-58,LANE[ln]-5,0.7);}
 for(let k=1;k<leg.segs.length;k++){const s=leg.segs[k],pv=leg.segs[k-1];if((s.type==='town'||s.type==='village')&&pv.type!=='town'&&pv.type!=='village'){const x=s.x0+60-dist+PX;if(x<-60||x>W+10)continue;for(const ln of [0,1])paint(g,String(s.limit),x,LANE[ln]-5,0.75);}}}
function wildSign(g,x,b){line(g,'#7d858d',x,b,x,b-20,1.2);g.fillStyle='#ffffff';g.beginPath();g.moveTo(x,b-35);g.lineTo(x+8.5,b-20);g.lineTo(x-8.5,b-20);g.closePath();g.fill();
 g.strokeStyle='#d32f2f';g.lineWidth=1.6;g.stroke();g.fillStyle='#1a1a1a';g.beginPath();g.moveTo(x-4,b-23);g.lineTo(x-2,b-27);g.lineTo(x+2,b-27);g.lineTo(x+3,b-30);g.lineTo(x+4,b-29);g.lineTo(x+3.4,b-26);g.lineTo(x+3,b-23);g.lineTo(x+2,b-23);g.lineTo(x+1.6,b-25.4);g.lineTo(x-2,b-25.4);g.lineTo(x-3,b-23);g.closePath();g.fill();}
/* ---- autószerviz épület ---- */
function drawGarage(g,sx,night,lights,t,busy){const b=ROADT-6;if(sx<-220||sx>W+40)return;
 frr(g,lg(g,0,b-56,0,b,[[0,'#e7e9ec'],[1,'#c4c9cf']]),sx,b-56,170,56,2);R(g,'#c62828',sx,b-56,170,8);frr(g,'#1b1f26',sx+40,b-74,92,16,3);text(g,'AUTÓSZERVIZ',sx+86,b-70,'#ffd84a',1,'center',null);
 // két szerelőakna, nyitott kapuk
 for(const gx of [12,92]){frr(g,'#2e3238',sx+gx,b-40,66,40,2);for(let k=0;k<5;k++)R(g,'#3c4148',sx+gx,b-40+k*3,66,1);frr(g,night?'#ffe9a8':'#5b6168',sx+gx+4,b-30,58,30,1);}
 // szerszámfal, gumik
 for(let k=0;k<3;k++)disc(g,'#22262b',sx+150,b-6-k*8,4.4);frr(g,'#a1744a',sx+138,b-48,26,10,1);for(let k=0;k<5;k++)line(g,'#5b636d',sx+141+k*5,b-46,sx+141+k*5,b-40,0.8);
 if(busy&&((t>>2)&1)){for(let k=0;k<4;k++)disc(g,'#ffd27a',sx+40+hsh(t+k)*20,b-14+hsh(t*3+k)*8,0.6);glow(g,sx+48,b-10,8,'rgba(255,210,140,0.8)');}
 if(night&&lights)lights.push({x:sx+86,y:b-30,r:60});}

/* ---- forgókefés autómosó: épület, hátsó fal, mozgó kapu ---- */
function brush(g,x,y0,y1,w,t,col){frr(g,col,x-w/2,y0,w,y1-y0,w/2);const off=(t*1.6)%6;g.fillStyle='rgba(255,255,255,0.35)';for(let y=y0-6+off;y<y1;y+=6){const a=Math.max(y0,y),b=Math.min(y1,y+2.4);if(b>a)g.fillRect(x-w/2+1,a,w-2,b-a);}}
function drawWashBuilding(g,sx,night,lights,t){const b=ROADT-6;if(sx<-200||sx>W+40)return;
 frr(g,lg(g,0,b-58,0,b,[[0,'#f4f8fb'],[1,'#d3dde6']]),sx,b-58,150,58,3);R(g,'#1e88e5',sx,b-58,150,9);for(let k=0;k<150;k+=10)disc(g,'rgba(255,255,255,0.6)',sx+5+k,b-53,1.6);
 frr(g,'#0d47a1',sx+30,b-80,90,18,4);text(g,'AUTÓMOSÓ',sx+75,b-76,'#ffffff',1.1,'center',null);for(let k=0;k<5;k++)disc(g,['#7fd1ff','#ffffff','#ff9fc4'][k%3],sx+34+k*21,b-82+Math.sin(t*0.05+k)*1.5,2.2);
 frr(g,'#26323c',sx+18,b-44,96,44,3);frr(g,night?'#3a4a58':'#4a5a68',sx+20,b-42,92,42,2);
 brush(g,sx+40,b-40,b-2,9,t*0.3,'#1e88e5');brush(g,sx+92,b-40,b-2,9,t*0.3,'#e53935');frr(g,'#2a3a48',sx+30,b-44,72,5,2);
 frr(g,'#1b1f26',sx+122,b-40,10,22,2);for(const [k,c] of [[0,'#ff3b30'],[1,'#34c759']])disc(g,(k===1)===(((t>>6)&1)===1)?c:'#333',sx+127,b-34+k*9,3);
 if(night&&lights)lights.push({x:sx+66,y:b-24,r:50});}
function drawWashBack(g,t){const gy=P.y,top=gy-74;frr(g,'#3b4a58',PX-40,top,200,gy-top-2,4);for(let k=0;k<200;k+=14)R(g,'rgba(255,255,255,0.05)',PX-40+k,top,7,gy-top-2);R(g,'#1e88e5',PX-40,top,200,6);}
function drawWashFront(g,t){const w=P.wash;if(!w||w.step!=='run')return;const gy=P.y,x=w.gx,ph=w.phase,top=gy-70;
 // kapu: oszlop elöl, felső gerenda, kefék
 frr(g,'#1565c0',x-4,top,8,gy-top,2);frr(g,'#1e88e5',x-40,top-6,48,8,3);
 if(ph==='brush'||ph==='polish'){brush(g,x+7,gy-52,gy-4,10,t,ph==='polish'?'#ffd84a':'#e53935');const ty=w.roof;g.save();g.translate(x+2,ty);brush(g,0,-6,6,30,t,'#1e88e5');g.restore();}
 if(ph==='spray'||ph==='rinse'||ph==='foam'){const c=ph==='foam'?'rgba(255,160,210,0.75)':'rgba(170,220,255,0.7)';for(let k=0;k<(LOWQ?6:12);k++){const yy=top+8+k*5,ln=6+((t*3+k*7)%8);line(g,c,x-2,yy,x-2-ln,yy+3,0.8);}}
 if(ph==='dry'){for(let k=0;k<3;k++){const yy=top+12+k*16;frr(g,'#90a4ae',x-10,yy,10,8,3);for(let j=0;j<3;j++)line(g,'rgba(255,255,255,0.5)',x-12-((t*4+j*5)%14),yy+2+j*2,x-18-((t*4+j*5)%14),yy+2+j*2,0.6);}}
 // hab a kocsin (a kapu mögötti részen), korlátozott számú buborék
 if(w.foam>0){const a=w.foam,n=LOWQ?14:28;for(let k=0;k<n;k++){const bx=PX+4+hsh(k*7)*104,by=gy-50+hsh(k*13)*40;if((w.foamDir>0&&bx<x)||(w.foamDir<0&&bx>x))continue;disc(g,'rgba(255,255,255,'+(0.55*a)+')',bx,by,2+hsh(k)*2.4);disc(g,'rgba(255,190,225,'+(0.35*a)+')',bx+1,by-1,1.2);}}}
