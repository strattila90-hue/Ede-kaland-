# Törésteszt: saját vezetés 300 m-en (gázzal a falnak), fékpróba, öv nélküli teszt, automata hátsó ütközés. Elvárt: ERR [], minden eset eredményt ad (képek: tests/out/crash_*.png).
import os,asyncio
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
from playwright.async_api import async_playwright
WAIT="""(ph)=>new Promise(res=>{const t0=performance.now();(function c(){if(CT&&CT.ph===ph||performance.now()-t0>60000)res(CT&&CT.ph);else setTimeout(c,100);})();})"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**({'executable_path':'/opt/pw-browsers/chromium'} if os.path.exists('/opt/pw-browsers/chromium') else {}));ctx=await b.new_context(viewport={'width':852,'height':393},device_scale_factor=2,has_touch=True,is_mobile=True);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(e.stack))
        await pg.goto(URL);await pg.wait_for_function("window.LAZY_DONE&&typeof startCrash==='function'",timeout=20000)
        # 1) saját vezetés, teljes gázzal a falnak
        await pg.evaluate("PROF.ctOwn=true;PROF.ctBelt=true;PROF.ctTest=0;startCrash();ctAction('ctgo')")
        await pg.wait_for_function("CT.ph==='run'");await pg.screenshot(path=OUT+'crash_start.png')
        await pg.evaluate("K.gas=true");await pg.wait_for_timeout(5000);await pg.screenshot(path=OUT+'crash_drive.png')
        print('5 mp gáz után:',await pg.evaluate("({kmh:CT.ms.toFixed(1),gear:CT.gear+1,rpm:Math.round(CT.rpm),m:(ctGap()/CT_MU).toFixed(0),touch:document.getElementById('touch').style.display,cls:document.getElementById('touch').className})"))
        await pg.evaluate(WAIT,'hit');await pg.wait_for_timeout(600);await pg.screenshot(path=OUT+'crash_hit.png')
        await pg.evaluate(WAIT,'result');await pg.wait_for_timeout(2500);await pg.screenshot(path=OUT+'crash_result.png')
        print('saját vezetés:',await pg.evaluate("Object.assign({},CT.res,{parts:0,vmax:Math.round(CT.vmax)})"))
        # 2) fékpróba: gyorsítás, majd fékezés úgy, hogy a fal előtt álljon meg
        await pg.evaluate("ctReset();ctAction('ctgo')");await pg.wait_for_function("CT.ph==='run'")
        await pg.evaluate("""new Promise(res=>{K.gas=true;const iv=setInterval(()=>{const gm=ctGap()/CT_MU,v=CT.sp;if(K.gas&&gm<v*v/(2*9.2)+0.8+v/40){K.gas=false;K.brake=true;}if(CT.ph!=='run'){clearInterval(iv);K.brake=false;res();}if(K.brake&&CT.sp===0)K.brake=false;},16);})""")
        await pg.wait_for_timeout(2500);await pg.screenshot(path=OUT+'crash_brake.png')
        print('fékpróba:',await pg.evaluate("CT.res"))
        # 3) öv nélkül, automata 50 km/h, merev fal
        await pg.evaluate("CT.own=false;CT.belt=false;CT.ti=1;CT.v=50;ctReset();ctAction('ctgo')")
        await pg.evaluate(WAIT,'hit');await pg.wait_for_timeout(900);await pg.screenshot(path=OUT+'crash_nobelt.png')
        await pg.evaluate(WAIT,'result');await pg.wait_for_timeout(2500);await pg.screenshot(path=OUT+'crash_nobelt_result.png')
        print('öv nélkül:',await pg.evaluate("Object.assign({},CT.res,{parts:0})"))
        # 4) hátsó ütközés automata
        await pg.evaluate("CT.belt=true;CT.ti=2;CT.v=50;ctReset();ctAction('ctgo')")
        await pg.evaluate(WAIT,'result');await pg.wait_for_timeout(2500);await pg.screenshot(path=OUT+'crash_rear.png')
        print('hátsó:',await pg.evaluate("Object.assign({},CT.res,{parts:0})"))
        await pg.evaluate("menuAction('home')");await pg.wait_for_timeout(300)
        print('ERR',errs[:3]);await b.close()
asyncio.run(main())
