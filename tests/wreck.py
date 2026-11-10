# Roncsoló műhely: hő- és fagykamra (fagyás, rideg törés, olvadás, hő), hajtáslánc (röntgen, motor/hűtő sérülése, leállás), mind a 11 eszköz (a gombsor valódi kattintásával) egér-koppintással / húzással, Új autó és Vissza gomb. Elvárt: ERR [], leszakadt részek > 0, olvadt tócsa, képek: tests/out/wreck_*.png
import os,asyncio
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='file://'+ROOT+'/index.html'
OUT=os.path.join(ROOT,'tests','out')+os.sep
os.makedirs(OUT,exist_ok=True)
from playwright.async_api import async_playwright
P2C="""([u,v])=>{const k=CTS*WK_Z,wx=WK_CX+u,wy=wkBy()+WK.sag+wkV(v),sx=(wx-wkCam())*k,sy=(wy-CTF)*k+CTF*CTS,r=cv.getBoundingClientRect();return [r.left+sx/W*r.width,r.top+sy/H*r.height];}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**({'executable_path':'/opt/pw-browsers/chromium'} if os.path.exists('/opt/pw-browsers/chromium') else {}))
        ctx=await b.new_context(viewport={'width':852,'height':393},device_scale_factor=2);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(e.stack))
        await pg.goto(URL);await pg.wait_for_function("window.LAZY_DONE&&typeof startWreck==='function'",timeout=20000)
        await pg.evaluate("G.apaOpen=true;menuAction('wreck')");await pg.wait_for_timeout(500)
        async def pt(u,v): return await pg.evaluate(P2C,[u,v])
        async def tool(i):
            await pg.click(f'#menu button[data-a="wk{i}"]');await pg.wait_for_timeout(150)
            assert await pg.evaluate("WK.tool")==i,"a(z) %d. eszköz gombja nem működik"%i
        async def tap(u,v,wait=120):
            x,y=await pt(u,v);await pg.mouse.click(x,y);await pg.wait_for_timeout(wait)
        async def drag(path,steps=12,hold=0):
            x,y=await pt(*path[0]);await pg.mouse.move(x,y);await pg.mouse.down()
            if hold:await pg.wait_for_timeout(hold)
            for q in path[1:]:
                x,y=await pt(*q);await pg.mouse.move(x,y,steps=steps);await pg.wait_for_timeout(20)
            await pg.mouse.up()
        st="(()=>({gone:WK.parts.filter(p=>p.gone).map(p=>p.k).concat(WK.wh.filter(w=>w.gone).map(()=> 'kerék')),ops:WK.ops.length,hot:WK.hot.length,pud:WK.pud.length,cost:Math.round(WK.cost),sq:WK.sq.toFixed(2),flat:WK.wh.map(w=>w.flat),air:WK.wh.map(w=>w.air.toFixed(2)),susp:WK.wh.map(w=>w.susp.toFixed(2)),leak:WK.res.filter(r=>r.leak>0).map(r=>r.k),fp:WK.fp.map(d=>d.k+(d.burn?'*':'')+Math.round(d.w))}))()"
        await tool(0)
        for i in range(10):await tap(70,36,260)
        await tap(40,20,300);await tap(40,20,300)
        await pg.screenshot(path=OUT+'wreck_hammer.png');print('kalapács:',await pg.evaluate(st))
        await tool(1);await tap(34,32,2000);await pg.screenshot(path=OUT+'wreck_ball.png');print('bontógolyó:',await pg.evaluate(st))
        await tool(2)
        for uv in [(60,40),(80,22),(89,46)]:await tap(*uv,500)
        print('ágyú:',await pg.evaluate(st))
        await tool(4);await drag([(75,38),(75.2,38)],steps=2,hold=3500);await pg.screenshot(path=OUT+'wreck_torch.png');print('lángvágó:',await pg.evaluate(st))
        await tool(3)
        for _ in range(2):await drag([(93,4),(93,50)],steps=40)
        await pg.screenshot(path=OUT+'wreck_flex.png');print('flex:',await pg.evaluate(st))
        await tool(5)
        for _ in range(3):await drag([(20,6),(88,6)],steps=50)
        await pg.screenshot(path=OUT+'wreck_laser.png');print('lézer:',await pg.evaluate(st))
        await tool(6);await tap(56,20,7000);await pg.screenshot(path=OUT+'wreck_press.png');print('prés:',await pg.evaluate(st))
        await tool(7);await tap(12,36,1800);await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'wreck_bomb.png')
        await pg.wait_for_timeout(3000);await pg.screenshot(path=OUT+'wreck_after.png');print('robbantás:',await pg.evaluate(st))
        # lőfegyverek új autón
        await pg.click('#menu button[data-a="wknew"]');await pg.wait_for_timeout(300)
        await tool(8)
        for uv in [(30,20),(30,21),(31,20),(30,19),(31,21),(60,38),(70,40),(89,46)]:await tap(*uv,250)
        print('pisztoly:',await pg.evaluate(st))
        await tool(9)
        for uv in [(45,35),(75,30)]:await tap(*uv,700)
        print('sörétes:',await pg.evaluate(st))
        await tool(10);await drag([(20,40),(100,30)],steps=60,hold=300);await pg.wait_for_timeout(200);await pg.screenshot(path=OUT+'wreck_guns.png');print('géppuska:',await pg.evaluate(st))
        # folyadékok és benzintűz: új autó, a benzintank kilövése, majd lángvágó a tócsa fölött
        await pg.click('#menu button[data-a="wknew"]');await pg.wait_for_timeout(300)
        await tool(8)
        for uv in [(42,45),(43,44),(41,46),(89,47)]:await tap(*uv,200)
        await tool(1);await tap(96,40,1800)
        await pg.wait_for_timeout(3500);print('szivárgás, defekt, futómű:',await pg.evaluate(st));await pg.screenshot(path=OUT+'wreck_fluids.png')
        await tool(4);await drag([(42,48),(42.2,48)],steps=2,hold=3000);await pg.wait_for_timeout(1500)
        await pg.screenshot(path=OUT+'wreck_fire.png');print('benzintűz:',await pg.evaluate(st))
        # hajtáslánc: röntgen gomb, lövések a motorra és a hűtőre (a karosszéria alatti réteg sérül, a motor leáll)
        await pg.click('#menu button[data-a="wknew"]');await pg.wait_for_timeout(300)
        await pg.click('#menu button[data-a="wkxray"]');await pg.wait_for_timeout(200)
        assert await pg.evaluate("WK.xray"),"a röntgen gomb nem működik"
        await tool(8)
        for uv in [(96,34)]*12+[(107,34)]*5:await tap(*uv,120)
        await pg.wait_for_timeout(800);await pg.screenshot(path=OUT+'wreck_drivetrain.png')
        dt=await pg.evaluate("(()=>{const d=WK.dt;return {eng:+d.eng.toFixed(2),rad:+d.rad.toFixed(2),run:d.run};})()");print('hajtáslánc:',dt)
        assert dt['eng']<0.5 and dt['rad']<0.5 and not dt['run'],"a motor nem sérült / nem állt le"
        await pg.click('#menu button[data-a="wkxray"]')
        # hő- és fagykamra: fagyasztás -> rideg törés (repedés), majd hevítés -> olvadás, égő fényezés, olvadó műanyag
        await pg.click('#menu button[data-a="wknew"]');await pg.wait_for_timeout(300)
        await pg.click('#menu button[data-a="wkcham"]');await pg.wait_for_timeout(200)
        S2C="""([x,y])=>{const r=cv.getBoundingClientRect();return [r.left+x/W*r.width,r.top+y/H*r.height];}"""
        async def cbtn(i):
            x,y=await pg.evaluate(S2C,[480-128+4+i*29.5+13,72+30+6]);await pg.mouse.click(x,y);await pg.wait_for_timeout(150)
        await cbtn(2);await pg.wait_for_timeout(15000)
        fz=await pg.evaluate("({tc:Math.round(WK.tc),ice:WK.ice,brit:WK.brit})");print('fagyasztva:',fz)
        assert fz['brit']>0.5 and fz['ice']>0.5,"nem fagyott meg"
        await tool(0)
        for _ in range(3):await tap(60,38,300)
        cr=await pg.evaluate("WK.ops.filter(o=>o.k==='crack').length");print('repedések:',cr);await pg.screenshot(path=OUT+'wreck_frozen.png')
        assert cr>0,"fagyott fémen nem reped"
        await cbtn(3);await pg.wait_for_timeout(18000)
        ht=await pg.evaluate("({tc:Math.round(WK.tc),ice:WK.ice,paint:WK.paint,plast:WK.plast})");print('hevítve:',ht);await pg.screenshot(path=OUT+'wreck_oven.png')
        assert ht['ice']==0 and ht['paint']>0 and ht['plast']>0,"a hő nem hatott"
        await pg.click('#menu button[data-a="wkcham"]')
        # felbontásváltás: a sérült kép újraépül a műveletlistából
        await pg.evaluate("QT=QT===4?1:4;applyQ(true);window.dispatchEvent(new Event('resize'))");await pg.wait_for_timeout(800);await pg.screenshot(path=OUT+'wreck_rebuild.png')
        await pg.click('#menu button[data-a="wknew"]');await pg.wait_for_timeout(300);print('új autó:',await pg.evaluate(st))
        await pg.click('#menu button[data-a="wkback"]');await pg.wait_for_timeout(300);print('vissza:',await pg.evaluate("G.state+' '+G.apaOpen"))
        print('ERR',errs[:3]);await b.close()
asyncio.run(main())
