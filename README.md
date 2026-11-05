# 🚐 Családi Vakáció – v2.0.0

Családi autós kalandjáték. A család **Komáromból, a Táncsics Mihály utcából** indul, és bejárja Európát, valós távolságokon és valós fogyasztással, **forintban** számolva.

A játék telepíthető alkalmazás (PWA): telefonon a kezdőképernyőre tehető és internet nélkül is fut.

## 👨‍👩‍👧‍👧 A család és az autó

**Utasok:** Apa (sofőr), Anya, Anna (5 éves), Petra (3 éves) és kis Atti (10 hónapos, bébiülésben). A harmadik sorban a családi csomagok utaznak.

**Az autó:** saját tervezésű, 7 üléses egyterű 1.8 16V benzines motorral, valós műszaki adatokkal:

| Adat | Érték |
|---|---|
| Teljesítmény / nyomaték | 125 LE / 170 Nm |
| Végsebesség, 0–100 km/h | 185 km/h, 13,4 s |
| Fogyasztás: város / országút / vegyes | 11,3 / 6,1 / 8,0 l/100 km |
| Tank | 60 liter |
| Tömeg, hossz | 1 510 kg, 4,59 m |
| Gumiméret | 205/65 R15 |

A fogyasztás a sebességtől, a gyorsítástól, az út típusától, a hótól és a hegyektől függ. A műszerfal mutatja a pillanatnyi és az átlagfogyasztást.

## 🗺️ Az útvonal (kb. 4 450 km)

Komárom → Siófok → Keszthely → Bécs → Salzburg (Alpok) → Velence → Párizs → Provence → haza, Komárom.

Út közben folyamatosan váltakozik a város, a falu, az országút és az autópálya, a táblákon valós településnevekkel (Ács, Bábolna, Sümeg, Mondsee, Beaune…). A sebességkorlátozás is szakaszonként változik: 50, 90/100 vagy 130 km/h.

**Útminőség:** jó, közepes, rossz (kátyús) és macskaköves utak. A futómű rugózik és csillapít: fékezéskor bólint az autó, gyorsításkor leül, kátyúnál megdobja. Nagy sebességnél a kátyúk defektet okozhatnak.

**Élő időjárás:** a célállomás aktuális időjárása (eső, hó, köd, vihar, napsütés) és napszaka az internetről érkezik, az [Open-Meteo](https://open-meteo.com) szolgáltatásból. Internet nélkül a beépített időjárással fut a játék.

## 💰 Pénz: 500 000 Ft kezdő keret

**Kiadások:**
- tankolás (országonként eltérő literár),
- kaja és bébiétel a gyerekeknek,
- autópálya-matrica (Magyarország, Ausztria),
- útdíj (Olaszország, Franciaország),
- szállás,
- bírságok: traffipax, piros lámpa, matrica nélküli autópálya.

**Pénzszerzés minijátékokkal:**
- 🎟️ **Kaparós sorsjegy:** ujjal vagy egérrel kell lekaparni.
- 🔋 **Bikázás:** egy lerobbant autósnak segítesz a kábelek helyes sorrendjével.
- 📦 **Kamionos:** elkapod a leeső dobozokat, és visszapakolod a rakományt.
- 🥕 **Zöldséges:** a kútnál lévő boltban szín szerint válogatod a zöldséget és a gyümölcsöt.

## ⛽ Tankolás és bolt

1. Állj meg a szélső (felső) sávban a kútnál.
2. Válaszd ki a pisztolyt. A Diesel rossz választás!
3. Tartsd nyomva a tankolás gombot: pörög a liter- és forintszámláló, tele tanknál kattan.
4. Fizess, majd vásárolj a boltban: kaja, bébicsomag, fagyi, pótkerék, sorsjegy, vagy vállalj munkát.

## 🚨 Rendkívüli helyzetek

- **Atti sír**, **Petrának rossz**, **Annának pisilni kell:** állj meg időben a szélső sávban.
- **Defekt:** állj meg, és apa kirakja az elakadásjelző háromszöget, megemeli az autót, és kicseréli a kereket. Pótkerék nélkül autómentőt kell hívni.
- **Traffipax**, **piros lámpa**, **dugó**, **útépítés**, **őz az úton**.
- **Kifogyott a benzin:** az autómentő hoz 10 litert.

## 🎮 Irányítás

| Billentyű | Mobil gomb | Funkció |
|---|---|---|
| → | GÁZ | gyorsítás |
| ← / Space | FÉK | fékezés |
| ↑ ↓ | ▲ ▼ | sávváltás |
| H | DUDA | duda |
| L | 💡 | fényszóró |
| F | KÖD | ködlámpa |
| V | ⚠ | vészvillogó |
| P | II | szünet |
| M | ♪ | zene |
| 1–5, Enter | érintés | menük és minijátékok |

## 📱 Telepítés, megosztás, frissítés

A főmenüben bal oldalt három gomb van:

- **⬇ Telepítés:** a kezdőképernyőre teszi a játékot. iPhone-on Safariban: Megosztás, majd „Főképernyőhöz adás”.
- **↗ Megosztás:** elküldi a játék linkjét.
- **⟳ Frissítés:** százalékosan mutatja a letöltést. Ha van új verzió, a gomb kiemelve jelzi. Alatta látszik az aktuális verziószám.

## 🚀 GitHub Pages

**Settings → Pages → Deploy from a branch → `main` / `(root)`**

Utána a játék itt érhető el: `https://strattila90-hue.github.io/Ede-kaland-/`

**Új verzió kiadása:**
1. Írd át az `APP_VERSION` értékét a `js/core.js` fájlban.
2. Futtasd: `python3 tools-version.py`. Ez frissíti a `version.json`-t és a service workert.
3. Commit és push.

## 🗂️ Fájlok

| Fájl | Tartalom |
|---|---|
| `index.html` | a játék oldala |
| `js/core.js` | rajzolás, betűk, hang, irányítás |
| `js/car.js` | az autó minden nézetből, a család, a forgalom |
| `js/world.js` | útvonal, útszakaszok, táj, utak, benzinkút |
| `js/minigames.js` | minijátékok |
| `js/game.js` | játékmenet, fizika, fogyasztás, események, képernyők |
| `js/app.js` | telepítés, megosztás, frissítés |
| `sw.js`, `manifest.webmanifest`, `version.json`, `icons/` | az alkalmazás működéséhez szükséges fájlok |
