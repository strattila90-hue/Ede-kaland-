# Domborzat, szerpentin, külföldi táblák. Elvárt: "HIBÁK 0", ERR [] (képek: tests/out/terrain_*.png)
# - mind a 22 szakasz domborzata: nincs NaN, a meredekség a korlát alatt, a végén a célváros magassága (±40 m)
# - Vršič-hágó: 50 hajtűkanyar, a tető kb. 1611 m; 50 km/h-val megcsúszik (sérülés), 30-cal nem; az autopilóta lelassít
# - lejtőn a csíkos rajz bekapcsol; éjjel, GPS-sel sincs hiba; határátlépéskor üzenet; helyi nevek a táblán
import os,asyncio,json
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
from playwright.async_api import async_playwright
START="localStorage.setItem('cv-keys-seen','1');G.trip=newTrip();G.trip.vig={HU:1,AT:1,CZ:1,SI:1};startLeg(%d);P.boarding=-1;P.walk=[];P.hide={};P.door=0;G.banner=0;P.evCD=99999;G.introSeen=true;"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**({'executable_path':'/opt/pw-browsers/chromium'} if os.path.exists('/opt/pw-browsers/chromium') else {}))
        ctx=await b.new_context(viewport={'width':852,'height':393},device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(e.stack))
        await pg.goto(URL);await pg.wait_for_function("window.LAZY_DONE",timeout=20000)
        bad=[]
        # 1) domborzat minden szakaszon
        r=await pg.evaluate("""LEGS.map((L,i)=>{const lg=buildLeg(i,1);let mx=0,nan=0;for(let k=0;k<lg.gr.length;k++){if(!isFinite(lg.gr[k])||!isFinite(lg.el[k]))nan++;mx=Math.max(mx,Math.abs(lg.gr[k]));}
           const last=L.segs[L.segs.length-1][1],want=ALT[last];return {i,mx,nan,end:elevAt(lg,lg.len),want,hps:lg.hps.length,borders:lg.borders.length,slopes:lg.slopes.length};})""")
        for x in r:
            if x['nan']:bad.append('NaN a %d. szakaszon'%x['i'])
            if x['mx']>0.121:bad.append('túl meredek: %d. szakasz %.3f'%(x['i'],x['mx']))
            if x['want'] is not None and abs(x['end']-x['want'])>40:bad.append('%d. szakasz vége %d m, kellene %d m'%(x['i'],x['end'],x['want']))
        print('hajtűk:',r[4]['hps'],'határok összesen:',sum(x['borders'] for x in r),'lejtőtáblák:',sum(x['slopes'] for x in r))
        if r[4]['hps']!=50:bad.append('nem 50 hajtű')
        top=await pg.evaluate("(()=>{const lg=buildLeg(4,1);const sg=lg.segs.find(s=>s.name==='Vršič-hágó');return elevAt(lg,(sg.x0+sg.x1)/2);})()")
        print('Vršič teteje: %d m'%top)
        if abs(top-1611)>40:bad.append('a hágó teteje %d m'%top)
        # 2) hajtűkanyar: gyorsan megcsúszik, lassan nem, az autopilóta lassít
        await pg.evaluate(START%4);await pg.wait_for_timeout(300)
        await pg.evaluate("const h=LEG.hps[4];P.dist=h.x-112-900;P.kmh=50;P.cruise=50;G.trip.hp=100");await pg.wait_for_timeout(3500)
        hp1=await pg.evaluate("G.trip.hp")
        await pg.evaluate("const h=LEG.hps[5];P.dist=h.x-112-600;P.kmh=28;P.cruise=30;G.trip.hp=100");await pg.wait_for_timeout(3500)
        hp2=await pg.evaluate("G.trip.hp")
        av=await pg.evaluate("(()=>{const h=LEG.hps[8];P.cruise=0;P.dist=h.x-112-300;P.kmh=50;P.auto={tx:h.x+50000,p:null};const v=autoDrive();P.auto=null;return v;})()")
        print('hajtű 50-nel hp:',hp1,' 30-cal hp:',hp2,' autopilóta korlát: %.1f'%av)
        if hp1>=100:bad.append('50-nel nem csúszott meg')
        if hp2<100:bad.append('30-cal is megcsúszott')
        if av>40:bad.append('az autopilóta nem lassít a hajtű előtt')
        # 3) lejtős rajz, éjjel is; GPS
        await pg.evaluate("const sg=LEG.segs.find(s=>s.serp);P.dist=sg.x0+(sg.x1-sg.x0)*0.6;P.kmh=30;P.cruise=30;LEGS[4].time='night';P.lightMode=2");await pg.wait_for_timeout(1500)
        on=await pg.evaluate("tiltOn()");await pg.screenshot(path=OUT+'terrain_serp_night.png');await pg.evaluate("LEGS[4].time='day'")
        if not on:bad.append('a lejtős rajz nem kapcsolt be a hágón')
        await pg.evaluate("openGPS()");await pg.wait_for_timeout(700);await pg.screenshot(path=OUT+'terrain_gps.png');await pg.evaluate("closeGPS()")
        # 4) határ és helyi név
        await pg.evaluate(START%13+"const bd=LEG.borders[1];P.dist=bd.x-300;P.kmh=60;")
        try:await pg.wait_for_function("G.msg&&/Határ/.test(G.msg.txt)",timeout=8000)
        except Exception:pass
        msg=await pg.evaluate("G.msg&&G.msg.txt||''")
        print('határüzenet:',msg)
        if 'Hollandia' not in msg:bad.append('nincs határüzenet')
        await pg.evaluate(START%17+"const sg=LEG.segs.find(s=>s.name==='Łódź');P.dist=sg.x0-60;P.kmh=30;");await pg.wait_for_timeout(900)
        info=await pg.evaluate("G.segInfo&&G.segInfo.txt||''");print('szakaszcím:',info);await pg.screenshot(path=OUT+'terrain_lodz.png')
        if 'Łódź' not in info:bad.append('nincs helyi név')
        print('nevek:',await pg.evaluate("[locName('Bécs'),locName('Koppenhága'),locName('Brüsszel'),locName('Velence')].join(', ')"))
        print('HIBÁK',len(bad));[print(' -',x) for x in bad]
        print('ERR',errs[:3]);await b.close()
asyncio.run(main())
