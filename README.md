# 🚐 Családi Vakáció – v2.3.1

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

## ⏱️ Valós távolság és idő

A játék valós léptékű: 90 km/h-val 1 km pontosan 40 másodperc, így Komáromtól Bábolnáig kb. negyedóra, Komáromtól Siófokig közel két óra. A teljes út kb. 4 600 km.

A játék kétpercenként automatikusan menti az állást, így az út több napon át is folytatható. A főmenüben választható **Gyorsított (5x)** vagy **Turbó (20x)** utazás is, de alapból valós idővel megy.

## 🌍 Európa körút (12 szakasz, kb. 5 800 km, 9 ország)

Komárom → Siófok → Keszthely → Bécs → Prága → Berlin → Amszterdam → Párizs → Barcelona → Nizza → Velence → Salzburg (Alpok) → haza, Komárom.

A sarokban **minitérkép** mutatja, merre jár a család (érintésre nagyobb). A térkép földrajzilag pontos, [Natural Earth](https://www.naturalearthdata.com) közkincs adatokból készült.

## 🎬 Filmes főmenü

A főmenü úgy indul, mint egy film: feketéből úszik be a kép, szélesvásznú csíkokkal, a cím középről a helyére úszik. A családi autó egy irányba halad, a jelenetek (Komárom, Balaton, Alpok, olasz tengerpart, Provence, Párizs éjjel) áttűnéssel váltják egymást. Közben lassú kameramozgás, filmes színkorrekció, lencsefény, vignetta és filmszemcse látszik. Az alsó csíkban írógéppel jelenik meg a helyszín, a felsőben a szereplők. Bármilyen érintés átugorja a nyitányt.

## 🛣️ Út közben

Út közben folyamatosan váltakozik a város, a falu, az országút és az autópálya, a táblákon valós településnevekkel (Ács, Bábolna, Sümeg, Mondsee, Beaune…). A sebességkorlátozás is szakaszonként változik: 50, 90/100 vagy 130 km/h.

**Útminőség:** jó, közepes, rossz (kátyús) és macskaköves utak. A futómű rugózik és csillapít: fékezéskor bólint az autó, gyorsításkor leül, kátyúnál megdobja. Nagy sebességnél a kátyúk defektet okozhatnak.

**Élő időjárás:** a célállomás aktuális időjárása (eső, hó, köd, vihar, napsütés) és napszaka az internetről érkezik, az [Open-Meteo](https://open-meteo.com) szolgáltatásból. Internet nélkül a beépített időjárással fut a játék.

## 🏪 Megállók az úton

A megállókat előjelző tábla jelzi („Benzinkút 500 m”), a következők pedig a kijelző alatt is látszanak:

- **Benzinkút:** tankolás és bolt. Autópályán kb. 40 km-enként.
- **Kisbolt:** kaja, víz, bébiétel, fagyi.
- **Hipermarket:** nagybevásárlás, nagy bébicsomag, játék, munka a zöldségesnél.
- **Trafik:** kaparós sorsjegy, nagy kaparós (négyszeres nyeremény), üdítő.
- **Újságos:** gyerekújság, autós térkép, sorsjegy.

**Megállás egy érintéssel:** a kijelző alatt zöld „P” gombok mutatják a következő megállókat („P Kisbolt 400 m”). Érintésre (vagy az **E** billentyűre) apa irányjelzővel átsorol a szélső sávba, finoman lassít, és pontosan az üzlet ajtaja, illetve a benzinkútnál a tanksapka a kút előtt áll meg. Utána magától nyílik a bolt vagy a kút. Piros lámpánál és az előttünk haladó autó mögött megvár. Fékkel vagy sávváltással a megállás törölhető. Kézzel is meg lehet állni a szélső sávban az üzlet előtt.

**Sebességmérő kapu (VÉDA):** előtte „Sebességmérés” tábla áll. Ha túl gyorsan haladsz át alatta, villan, és jön a bírság (15 000 – 100 000 Ft).

## 💰 Pénz: 500 000 Ft kezdő keret

**Pontos könyvelés:** minden kiadás és bevétel egész forintra kerekítve, egy helyen kerül könyvelésre. A tankolás ára a liter (két tizedesre) és az aktuális literár szorzata, így a kijelzőn látott összeg pontosan egyezik a levont összeggel.

**Költségnapló:** a jobb felső sarokban a pénzre koppintva (vagy az **N** billentyűvel, a szünetmenüből és a térképről) megnyílik a napló:
- egyenleg, kezdő keret, kiadások, bevételek, és ellenőrzés, hogy a végösszeg forintra pontosan egyezik;
- kategóriák arányokkal: tankolás, élelmiszer, baba, gyerekek, matrica és útdíj, szállás, autó és segélyszolgálat, bírság, sorsjegy;
- minden tétel szakaszonként, km-rel, dátummal és a maradó egyenleggel; szűrhető kiadásra vagy bevételre.

Minden tranzakció után a pénzkijelző egy pillanatra a levont vagy kapott összeget mutatja.

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

## 🚦 Forgalom

Minden jármű valós méretarányban látszik a családi autóhoz képest: kisautó, rendőrautó, mentő, furgon, lakóautó, busz (12 m), kamion (16,5 m), traktor és motor.

Előfordulhat **baleset** az úton (rendőr, mentő, lezárt sáv). Nagyon ritkán pedig **helyi rendőr** ér utol szirénával: le kell húzódni és megállni, ilyenkor jön az igazoltatás.

## 🌳 Táj

Mezők (búza, napraforgó, repce, kukorica, szántás, levendula) szalmabálákkal, fasorok, nyárfák, nyírfák, bokrok, virágos fű, tanyák silóval, szélerőművek, Hollandiában szélmalmok, madarak, párás távoli dombok, és út menti kilométerkövek valós km-számmal.

## 🚗 Az autó kezelése

- **Középkonzol:** a kapcsolók LED-del jelzik, mi van bekapcsolva (zöld, kék, borostyán), lenyomásra besüppednek. A pedálok lenyomásra előrebillennek és világítanak, a kormány sávváltáskor elfordul.
- **Felső sáv:** ⏸ szünet és ⌂ **főmenü**. A főmenü gomb automatikusan elmenti a játékállást, a Folytatás gombbal pontosan onnan lehet továbbmenni. A játék akkor is ment, ha a telefon képernyője lezár vagy az alkalmazás a háttérbe kerül.

- **Világításkapcsoló:** kikapcsolva, helyzetjelző, tompított, reflektor.
- **Fénykürt (villogtatás)** és **duda:** az előtted haladó autó lehúzódik.
- **Ködlámpa:** első, majd első és hátsó.
- **Tempomat:** 50 / 70 / 90 / 110 / 130 km/h egy érintéssel, fékre kikapcsol.
- **Kézifék** visszajelző lámpával.
- **Vészvillogó**, **ajtók nyitása és csukása** (csak állva), **hátramenet (R)** tolatólámpával.
- **Féklámpa** fékezéskor és álló helyzetben.
- **Rádió:** négy állomás saját szerzésű zenével (Retro FM, Rock Rádió, Pop Hullám, Esti Lounge).
- **Motorhang:** négyhengeres motor, fordulatszám és terhelés szerint változik.
- **Mini műszerfal:** sebességmérő, fordulatszámmérő, fokozat, üzemanyagszint, sebességkorlátozás, átlagfogyasztás és visszajelző lámpák.

## 🎮 Irányítás

| Billentyű | Mobil gomb | Funkció |
|---|---|---|
| → | GÁZ | gyorsítás |
| ← / Space | FÉK | fékezés |
| ↑ ↓ | ▲ ▼ | sávváltás |
| H | DUDA | duda |
| L | TOMP | világításkapcsoló (fokozatok) |
| K (tartsd) | VILL | fénykürt |
| F | KÖD | ködlámpa |
| V | ⚠ | vészvillogó |
| O | AJTÓ | ajtók |
| R | R | hátramenet |
| T | TEMPO | tempomat |
| E | P gomb | megállás a következő üzletnél |
| N | pénz | költségnapló |
| B | KÉZI | kézifék |
| Q | RÁDIÓ | rádió: következő állomás |
| P | II | szünet |
| M | Zene (főmenü) | menüzene |
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
| `js/radio.js` | motorhang, autórádió |
| `js/car.js` | az autó minden nézetből, a család, a forgalom |
| `js/world.js` | útvonal, útszakaszok, táj, utak, benzinkút |
| `js/minigames.js` | minijátékok |
| `js/shops.js` | boltok és tankolás |
| `js/map.js`, `js/geo.js` | Európa-térkép és minitérkép |
| `js/game.js` | játékmenet, fizika, fogyasztás, események, képernyők |
| `js/app.js` | telepítés, megosztás, frissítés |
| `sw.js`, `manifest.webmanifest`, `version.json`, `icons/` | az alkalmazás működéséhez szükséges fájlok |
