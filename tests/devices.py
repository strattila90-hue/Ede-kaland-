# 9 képernyőméret (telefon, tablet, 4K): felbontás, gombok átfedése ("overlap" üres kell legyen), képernyőképek a tests/out mappába.
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
import asyncio,json
from playwright.async_api import async_playwright
O=OUT
DEV=[('iphone_se',667,375,2,True),('iphone_15',852,393,3,True),('galaxy_s',915,412,3.5,True),('pixel_fold',1080,840,2.6,True),('ipad_mini',1133,744,2,True),('ipad_air',1180,820,2,True),('ipad_pro12',1366,1024,2,True),('laptop',1366,768,1,False),('desktop_4k',1920,1080,2,False)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        for name,w,h,dpr,touch in DEV:
            ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=dpr,has_touch=touch,is_mobile=touch);pg=await ctx.new_page();pg.on('pageerror',lambda e,n=name:errs.append(n+': '+str(e)))
            await pg.goto(URL);await pg.wait_for_timeout(2600)
            await pg.evaluate("G.introSeen=true;G.st=200");await pg.wait_for_timeout(1500)
            info1=await pg.evaluate("(()=>{const c=document.getElementById('c').getBoundingClientRect(),m=document.getElementById('menu').getBoundingClientRect();return {canvas:[Math.round(c.x),Math.round(c.y),Math.round(c.width),Math.round(c.height)],SC:SC,want:+wantSC().toFixed(2),menuFits:m.bottom<=innerHeight+1&&m.top>=-1}})()")
            await pg.screenshot(path=O+name+'_title.png')
            await pg.evaluate("G.trip=newTrip();G.trip.vig={HU:1,AT:1,CZ:1};startLeg(0);P.boarding=-1;P.walk=[];P.hide={};P.door=0;G.banner=0;P.evCD=99999;P.dist=LEG.len*0.05;P.kmh=60")
            await pg.wait_for_timeout(1500)
            info2=await pg.evaluate("""(()=>{const c=document.getElementById('c').getBoundingClientRect();const ov=[];for(const id of ['bGas','bBr','bCruise','bUp','bDn','bHonk','ctlrow','topbar']){const e=document.getElementById(id);if(!e||e.offsetParent===null&&getComputedStyle(e).position!=='fixed')continue;const r=e.getBoundingClientRect();if(!r.width)continue;
              const inCanvas=Math.max(0,Math.min(r.bottom,c.bottom)-Math.max(r.top,c.top))*Math.max(0,Math.min(r.right,c.right)-Math.max(r.left,c.left))/(r.width*r.height);const off=r.left<-1||r.right>innerWidth+1||r.top<-1||r.bottom>innerHeight+1;ov.push(id+':'+Math.round(inCanvas*100)+'%'+(off?' KILÓG':''));}
              const els=[...document.querySelectorAll('#touch .ctl,#topbar .ctl')].filter(e=>e.offsetParent!==null).map(e=>[e.id,e.getBoundingClientRect()]);const hit=[];for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i][1],b=els[j][1];if(a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)hit.push(els[i][0]+'/'+els[j][0]);}
              return {SC:SC,QT:QT,overlap:hit.join(','),n:els.length}})()""")
            await pg.screenshot(path=O+name+'_play.png')
            print(name,w,'x',h,'dpr',dpr,json.dumps(info1),json.dumps(info2,ensure_ascii=False))
            await ctx.close()
        print('ERR',errs[:5]);await b.close()
asyncio.run(main())
