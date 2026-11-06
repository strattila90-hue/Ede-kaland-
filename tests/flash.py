# Fekete villanás teszt: 10 mp játék felbontásváltással és átméretezéssel. Elvárt: black 0.
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':852,'height':393},device_scale_factor=3,has_touch=True,is_mobile=True);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(e.stack))
        await pg.goto(URL);await pg.wait_for_timeout(3000)
        await pg.evaluate("G.trip=newTrip();G.trip.vig={HU:1,AT:1,CZ:1};startLeg(0);P.boarding=-1;P.walk=[];P.hide={};P.door=0;G.banner=0;P.evCD=99999;G.introSeen=true;P.dist=LEG.len*0.3;P.kmh=90;K.gas=true")
        r=await pg.evaluate("""new Promise(res=>{let black=0,frames=0,k=0;const t0=performance.now();
          const iv=setInterval(()=>{k++;QT=(k%2)?1:4;applyQ(true);window.dispatchEvent(new Event('resize'));},1000);
          (function chk(){frames++;const d=ctx.getImageData(cv.width/2|0,cv.height*0.35|0,1,1).data;if(d[0]+d[1]+d[2]<20)black++;
            if(performance.now()-t0<10000)requestAnimationFrame(chk);else{clearInterval(iv);res({frames,black,SC});}})();})""")
        print('10 mp játék, 10 felbontásváltás + átméretezés:',r)
        print('ERR',errs[:3]);await b.close()
asyncio.run(main())
