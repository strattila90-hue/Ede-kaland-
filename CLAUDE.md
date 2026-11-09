# Családi Vakáció – útmutató Claude-nak

Magyar nyelvű, böngészőben futó családi autós játék (PWA), GitHub Pages-en: https://strattila90-hue.github.io/Ede-kaland-/
Nincs build lépés, nincs csomagkezelő: sima HTML + klasszikus `<script>` fájlok, közvetlenül szerkeszthetők.
A felhasználó magyarul ír, a játék szövegei, a commit üzenetek és a README is magyarul vannak.

## Parancsok

```bash
# szintaxis-ellenőrzés minden szkriptre (minden módosítás után)
for f in js/*.js; do node --check "$f" || echo "HIBA: $f"; done

# verzióléptetés: előbb APP_VERSION a js/core.js-ben, aztán ez frissíti a version.json-t és az sw.js VERSION-t
python3 tools-version.py

# helyi futtatás (a service worker / offline csak http-n megy, file://-on nem)
python3 -m http.server 8765    # -> http://localhost:8765/index.html

# tesztek (Playwright + Chromium; ebben a környezetben a böngésző itt van:)
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
python3 tests/flash.py     # ~15 mp, elvárt: black 0, ERR []
python3 tests/devices.py   # ~1 perc, 9 képernyőméret, elvárt: minden "overlap": "" (képek: tests/out/)
python3 tests/crash.py     # ~3 perc, törésteszt: saját vezetés, fékpróba, öv nélkül, hátsó, fékút burkolatonként, csomag + ismétlés; elvárt: ERR [] (képek: tests/out/crash_*.png)
python3 tests/wreck.py     # ~1 perc, roncsoló műhely: mind a 11 eszköz a gombsor kattintásával és egérrel; elvárt: ERR [], leszakadt részek (képek: tests/out/wreck_*.png)
python3 tests/soak.py      # ~20 perc, mind a 22 szakasz; elvárt: "HIBÁK 0", legsDone 22, win 1, pageerrors []
```

Feltöltés (a felhasználó kérésére mindig közvetlenül a main ágra megy, a commit végén a szokásos Co-Authored-By sorral):
```bash
python3 tools-version.py && git add -A && git commit -m "vX.Y.Z: ..." \
  && git fetch -q origin main && git rebase -q origin/main && git push -q origin HEAD:main
```

## Szerkezet

| Fájl | Mi van benne |
|---|---|
| `index.html` | minden CSS, a DOM-os kezelőgombok (`#touch`, `#topbar`), menük, lapok (`#ledger`, `#inst`, `#gpsv`, `#elog`, `#keys`, `#bye`), kétlépcsős betöltő + önjavítás (`heal()`) |
| `js/core.js` | `APP_VERSION`, vászon (logikai 480×270, `SC` skála), hibanapló (`elog`), szövegrajzolás (betű- és szövegtár: `GLC`, `STC`), hangok, billentyűzet (`kRole`, két kiosztás: `KEYMAP` a/b), `resize()` |
| `js/radio.js` | rádió, motorhang (`engine`), zene |
| `js/car.js` | családi autó oldalnézet (`drawCarSide`), utasok (`person`), forgalom (`drawTraffic`), tréler (`drawTowTruck`, `towBed`) |
| `js/world.js` | útvonal: `GEOC` (városok koordinátái), `LEGS` (22 szakasz, ~9600 km), szakaszgenerálás, tájrajz (`drawFar`/`drawMid`/`drawNear`), megállók (`drawPOI`), lámpák (`lightState`: zöld 20 / sárga 3 / piros 10 mp), előre megrajzolt képtárak (`layerTiles`, `sprite`) |
| `js/game.js` | játékállapot (`G`, `P`, `LEG`), `update`/`updPlay`, autopilóta (`startAuto`, `autoDrive`, `tapPOI`), sérülés/totálkár, autómosó, HUD (`drawHUD`, `drawStrip` haladási sáv, `drawLightAdvisor`), plakát (`drawPoster`), mentés (`save`/`loadSave`), képkocka-ciklus (`frame`, interpoláció `renderI`), minőségszabályzó (`qualityStep`) |
| `js/app.js` | DOM-menük (`menuDef`, `menuAction`), költségnapló, telepítés, offline/frissítés (`autoOffline`, `doUpdate`), hibanapló- és billentyűzet-ablak, kilépés/vissza-gesztus csapda |
| `js/shops.js` | boltok, benzinkút, szerviz |
| `js/minigames.js` | minijátékok |
| `js/crash.js` | törésteszt (Apa garázsa): 300 m-es pálya követő kamerával, saját vezetés (`ctDrive`: fokozatok, motorhang, ABS) vagy automata, ütközés (`ctImpact`, lassított `hit` fázis), lassulásgörbe (`ctPulse`, `ctChart`), öv nélküli mód, útburkolat (`CT_SURF`), csomag (`ctMass`, rögzítetlen bőrönd), visszajátszás közeli kamerával (`ctReplay`, mentett `CT.i0`), beállítás-almenü (`CT.cfg`), fékpróba (`ctBrakeRes`), értékelés (`ctScore`, `ctPanel`); vezetés közben a `#touch` csak a két pedált mutatja (`crashui` osztály) |
| `js/wreck.js` | roncsoló műhely: 11 eszköz (`WK_TOOLS`, ebből lőfegyverek: `wkFire`; nyomva tartott eszközök: `WK_HOLDT`; a gombok `wk…` műveleteit az `app.js` `menuAction` a `ctAction`-nek adja tovább), a sérült autó egy képben (`wkDC`) műveletlistából (`WK.ops`: dent/hole/cut/tint/scorch/glass/crease/det, `wkOp`), 5 leszakadó rész + 2 kerék (`wkHurt`, `wkDetach`, `wkWheelHurt`), olvadás izzó foltokkal (`wkHeat`, `WK.hot`, cseppek, tócsák), prés (`WK.sq`); a `crash.js` `CT.dest` jelzővel adja át neki a frissítést, rajzot és menüt (bal oldali `ctside` gombsor) |
| `js/map.js`, `js/geo.js` | térképrajz, durva Európa-partvonal (`GEO`) |
| `js/gps.js`, `js/geohd.js` | teljes képernyős interaktív GPS, részletes partvonal (`GEOHD`, Natural Earth 1:50m) |
| `sw.js` | service worker, gyorsítótár neve `csaladi-vakacio`, `ASSETS` lista |
| `version.json` | verzió + fájlméretek (a frissítés ellenőrzi velük, hogy minden fájl az új verzióé) |
| `tests/` | Playwright tesztek (lásd fent), kimenet a `tests/out/` mappába (gitignore) |

Betöltési sorrend (`index.html`): kritikus: core, radio, car, world, game, app; utána lusta: geo, map, gps, geohd, minigames, shops, crash, wreck (`window.LAZY_DONE`).

## Android-alkalmazás (APK)

- `android/`: WebView-alapú alkalmazás (`MainActivity.java`), a játékot az APK-ba másolt `assets/www`-ből tölti (`WebViewAssetLoader`, https://appassets.androidplatform.net/assets/www/index.html), így első indításkor is offline.
- Építés: GitHub Actions (`.github/workflows/apk.yml`) minden feltöltéskor, kiadás: `releases/download/apk/csaladi-vakacio.apk`. Itt helyben nincs Android SDK; az eredmény: `gh run list -R strattila90-hue/Ede-kaland-`.
- Aláírás: `android/csaladi-vakacio.keystore` (jelszó a `app/build.gradle`-ben). Ne cseréld le, különben az új APK nem telepíthető a régire.
- JS-híd: `window.CVNative` (`NTV` a `core.js`-ben): `speak`, `stopSpeak`, `hasTts`, `saveFile`, `share`, `openUrl`, `exit`, `version`. Alkalmazásban nincs service worker és `autoOffline`, a Frissítés gomb az új APK-t nyitja meg (`apkUpdate`).
- Új játékfájl (pl. kép, hang) a workflow „Játékfájlok” lépésébe is kell, ha nem a `js/` vagy `icons/` mappában van.
- **Háttérfrissítés:** az alkalmazás (`Updater.java`) magától letölti a weboldalról a `version.json`-ban felsorolt fájlokat a saját tárhelyére (méret-ellenőrzéssel), és a következő indításkor (vagy `reloadGame`) azokból fut. A JS oldalon `cvUpdate(fajta,verzió,üzenet)` jelez (`READY` / `NEED_APK` / `APK_READY` / `FAIL`).
- **`android/NATIVE_REV`:** az alkalmazás-keret sorszáma (a `version.json` „apk” mezője). **Ha a Java-kódot, a manifestet vagy a JS-hidat (`CVNative` új függvénye) módosítod, növeld eggyel**, különben a régi alkalmazás csak a játékfájlokat frissíti, és az új híd-függvények hiányoznak. Ilyenkor az alkalmazás a háttérben letölti az új APK-t, és egy koppintással telepíthető. A JS mindig nézze meg, létezik-e a híd-függvény (`typeof NTV.x==='function'`).

## Teendők új fájlnál vagy átnevezésnél

Egy új JS fájlt **három helyre** kell felvenni: `index.html` betöltőlista, `sw.js` `ASSETS`, `tools-version.py` `files`. Különben offline vagy frissítéskor hiányzik.

## Fontos szabályok és buktatók

- **Teljesítmény telefonon:** nem a felbontás, hanem a képkockánkénti rajzolási műveletek száma a szűk keresztmetszet. Új tájelemet a `sprite()` / `layerTiles()` képtáron keresztül rajzolj, ne képkockánként sok `fill`/`arc` hívással. Ne használj `shadowBlur`-t, `filter`-t, és ne olvass vissza a vászonról (`getImageData`).
- **Minőségszabályzó:** csak a valóban késő képkocka (két kép között >26 ms) számít akadásnak. A telefon saját 60/120 Hz-es váltása nem. Ne alakítsd vissza a frissítési idő minimumához mérő változatra (az okozta a 30 kép/mp-es hibát).
- **A menü frissítése (`appTick`) a `frame()`-ben fut minden képkockán**, nem a `render()`-ben, mert a főmenü képét a játék nem rajzolja újra (`TITLE_DRAWN`).
- `app.js`-ben a `$()` hiányzó elemnél egy üres elemet ad vissza (régi oldal + új szkript keveredésekor se álljon le a menü). Az `app.js` utolsó sora `window.APP_OK=true`; ha ez nem fut le, a betöltő egyszer tisztán újratölt.
- **Szöveg:** `text(g,str,x,y,col,scale,align)`. A betűk színenként és méretenként egy-egy atlaszképben vannak (`glyphAtlas`, `drawGlyph`, legfeljebb 40 atlasz). **Ne hozz létre elemenként külön kis vásznat** (betűnként, tárgyanként): telefonon ezer fölötti kis vászon miatt a rendszer leállította a játékot (hibanapló: „VÁRATLAN LEÁLLÁS”, „betű 1276”). A számot tartalmazó szövegek betűnként rajzolódnak, nem kerülnek a szövegtárba (`STC`, legfeljebb 80).
- **Elveszett vászontartalom:** Androidon a Chrome memóriahiánykor elveheti a vásznak tartalmát, és üresen adja vissza (tünet: nincs felirat, az autóból csak ablak és kerék látszik). Minden gyorsítótár-vásznat `mk()`-val vagy `watchCv()`-vel hozz létre, a `cvCheck()` ilyenkor `flushCaches()`-sel mindent újrarajzol. Új, `mk()`-val készült tárolt képet az `onSC()`-ben is nullázz.
- **Mentés:** `localStorage` kulcs: `csaladi-vakacio-v2`, `routeV:2` (a régi, 12 szakaszos mentést a `loadSave` átalakítja).
- **Arculati korlátok:** a gyorsétterem saját „Burger Pont”, nem McDonald's. A térkép neve „GPS”, nem Google Maps. Az autó saját tervezésű, nem a Citroën C4 Picasso másolata.
- **Frissítés és service worker:** az `sw.js` a tárolt fájlt adja vissza (`ignoreSearch`), ezért a frissítéshez kért fájlokat (`?t=` vagy `cache:'no-store'`) a `sw.js` külön ágon mindig a hálózatról kéri. Ezt ne vedd ki, mert akkor a méretellenőrzés soha nem megy át, és a frissítés örökre elakad (v2.16.2 – v2.21.1 hibája). Tartalék: `swInstallNew`, `cacheMatches`, `cleanReinstall` az `app.js`-ben.
- **Hibanapló:** `elog(kind,msg)` (`kind`: `hiba` / `info` / `leállás`), a felhasználó a főmenüből küldi el. Ha „véletlen kilépést” jelent, először a naplót kérd.
- Változás után legalább a `node --check` és a `tests/flash.py` fusson le; játékmenetet érintő változásnál a `tests/soak.py` is. Utána frissítsd a README-t, és léptesd a verziót.
