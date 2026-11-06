# 🚐 Családi Vakáció – v2.20.0

Családi autós kalandjáték. A család **Komáromból, a Táncsics Mihály utcából** indul, és bejárja Európát, valós távolságokon és valós fogyasztással, **forintban** számolva.

A játék telepíthető alkalmazás (PWA): telefonon a kezdőképernyőre tehető és internet nélkül is fut.

## 👨‍👩‍👧‍👧 A család és az autó

**Utasok:** Apa (sofőr, 177 cm), Anya (174 cm), Anna (5 éves, kb. 110 cm), Petra (3 éves, kb. 96 cm) és kis Atti (10 hónapos, bébiülésben). Az alakok valós arányban látszanak az autóhoz képest. A harmadik sorban a családi csomagok utaznak.

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

A játék valós léptékű: 90 km/h-val 1 km pontosan 40 másodperc, így Komáromtól Bábolnáig kb. negyedóra, Komáromtól Siófokig közel két óra. A teljes út kb. 9 600 km.

A játék kétpercenként automatikusan menti az állást, így az út több napon át is folytatható. A főmenüben választható **Gyorsított (5x)** vagy **Turbó (20x)** utazás is, de alapból valós idővel megy.

## 🌍 Európa körút (22 szakasz, kb. 9 600 km, 14 ország)

Komárom → Siófok → Keszthely → Zágráb → Ljubljana → Velence → Firenze → Róma → Nizza (a Ligur-tenger partján) → Barcelona → Madrid → Lisszabon → Bordeaux → Párizs → Amszterdam → Hamburg → Koppenhága (a dán hidakon át) → Berlin → Varsó → Krakkó → Prága → Bécs → haza, Komárom.

Országok: Magyarország, Horvátország, Szlovénia, Olaszország, Franciaország, Spanyolország, Portugália, Belgium, Hollandia, Németország, Dánia, Lengyelország, Csehország, Ausztria. Az útdíjak és matricák országonként valósághűek (pl. szlovén e-matrica, horvát, olasz, francia, spanyol, portugál és lengyel autópályadíj). Minden nagyvárosnak saját képeslapja van (Zágráb tornyai, Colosseum, Duomo, madridi palota, lisszaboni híd és villamos, bordeaux-i kastély, hamburgi daruk, Nyhavn, varsói Kultúrpalota, Wawel).

A régi (12 szakaszos) mentések automatikusan átállnak: a játék a legközelebbi új szakasztól folytatja.

## 🧭 GPS

Külön térképképernyő nincs: a térkép a **GPS** gomb mögött van. Út közben telefonon a jobb oldali oszlopban, a tempomat fölött egy nagy kék **GPS** gomb (tableten a lenti sávban a tempomat fölött, gépen a felső sávban), indulás előtt az Indulás gomb mellett található (gépen a **G** billentyű, vagy a Szünet menü). Az indulás előtti képen a szakasz tája, a családi autó, a cél képeslapja és az út adatai látszanak. A GPS teljes képernyős, interaktív térképet nyit:

- **Követés:** az autó a térkép közepén, nyíl mutatja a menetirányt; a megtett út sárga, a hátralévő kék.
- **Húzással** mozgatható, **két ujjal csippentve**, egérgörgővel vagy a **+ / −** gombokkal nagyítható, dupla koppintásra ráközelít.
- **Szakasz** és **Teljes út:** egy érintéssel az aktuális szakaszra vagy az egész Európa körútra áll.
- Közelről a városok, tavak, erdők, mellékutak és az út menti megállók (benzinkút, pihenő, gyorsétterem, szerviz, autómosó, boltok) ikonjai is látszanak.
- **Kártya:** honnan hová, melyik úton és országban járunk, megtett és hátralévő km, sebesség, várható érkezés, az egész út állása, és a következő megállók távolsággal (érintésre a térkép odaugrik).

Amíg a GPS nyitva van, a játék áll, de ez nem számít pihenőnek. A térkép a [Natural Earth](https://www.naturalearthdata.com) közkincs adataiból készült.

**Haladási sáv (a kép tetején, a műszerfal alatt):** bal szélén az autó, előtte egy 2 km-es vonal, rajta ikonokként minden, ami jön, a saját helyén és távolsággal: benzinkút, bolt, hipermarket, trafik, újságos, gyorsétterem, pihenő, szerviz, autómosó, sebességmérő, jelzőlámpa (az aktuális színével), település, autópálya, és villogó piros jelöléssel a veszélyek (kátyú, útépítés, baleset, dugó, állat). A sáv végén, 2 km-en túl a következő benzinkút és az úti cél távolsága. A kiválasztott megálló zölden ki van emelve. A közeli dolgok a sávon arányosan szétterülnek, így egy pillantással látszik, mi mennyire van közel.

**Jelzőlámpák:** zöld 20 másodperc, sárga 3 másodperc, piros 10 másodperc (egy teljes ciklus 33 mp); a lámpák egymástól függetlenül, eltolva váltanak.

**Lámpafigyelő:** 450 méterrel a jelzőlámpa előtt a jobb oldalon megjelenik egy kis lámpa: mutatja, melyik szín ég (világít), hány másodperc van hátra belőle (fogyó csíkkal), milyen messze van a lámpa, és a jelenlegi sebességed alapján tanácsot ad: **ÁTÉRSZ** (zöldben érsz oda), **LASSÍTS** (sárgában érnél oda), **FÉKEZZ** (pirosban érnél oda), **VÁRJ** (állsz a piros előtt), **ÁLLJ** (közvetlenül a lámpánál, nem zöld).

## 🎬 Főmenü: filmplakát

**Mentések (💾 a főmenüben):** három külön utazás (például gyerekenként), mindegyik saját névvel, utazással, képeslap-albummal és rekordokkal. Bármelyik **fájlba menthető** vagy **elküldhető** (pl. Messengeren), és másik telefonon vagy tableten a **Betöltés fájlból** gombbal ott folytatható, ahol abbahagytátok. Így az sem baj, ha a telefon takarítója vagy egy böngészőtörlés kitörli a játék adatait.


**Hibanapló (🩺 a főmenüben és a Szünet menüben):** a játék rögzíti a hibákat (melyik fájl, melyik sor, milyen állapotban: szakasz, sebesség, felbontás), a fontos eseményeket (indulás, szakasz, totálkár, frissítés, háttérbe kerülés, vissza-gesztus), és ha a játék váratlanul leállt (pl. a telefon kevés memória miatt bezárta), a következő indításkor beírja, mikor, mennyi játék után és milyen állapotban történt. A naplót a **Küldés** gombbal el lehet küldeni (pl. Messengeren), vagy **Másolás**sal kimásolni. Menet közbeni hiba sem állítja le a játékot: a hibát naplózza, és fut tovább.


**Új játék / kilépés:** ha van mentett út, a főmenüben a **Folytatás** mellett az **Új játék (teljes újrakezdés)** mindent elölről kezd (pénz, km, költségnapló), előtte rákérdez. A piros **Kilépés** gomb (főmenüben és a Szünet menüben) rákérdez, elment, és bezárja a játékot (ha a rendszer nem engedi az ablak bezárását, egy „Kiléptél” képernyő jelenik meg, onnan a kezdőképernyő gombbal lehet kimenni). Véletlen kilépés ellen: a vissza gomb és az oldalról behúzott vissza-gesztus nem zárja be a játékot, csak megállítja, és szól, hogy a piros gombbal lehet kilépni; a lefelé húzás nem tölti újra az oldalt. (A telefon saját kezdőképernyő-gesztusát egy weboldal nem tilthatja le, de ilyenkor a játék szünetel és ment.)


A plakáton a játékbeli családi autó, benne az egész család, aranyórában a Balaton partján halad a lemenő nap felé: mély kékből narancsba hajló ég, alulról megvilágított felhősávok, a nap fénykoronája és sugarai, légperspektívás hegyek, a tóban csillogó napút és egy vitorlás, a túlparton nyárfasor és falu templomtoronnyal, rét szalmabálákkal, szalagkorlát, az úton elmosott mozgáscsíkok, az autón meleg ellenfény és égő fényszóró.


A főmenü egyetlen álló kép, családi road movie plakát: naplemente csíkos nappal, hegyek, a horizontba futó út, rajta hátulról a családi autó csomagokkal a tetőn, nagy „Családi Vakáció” cím, alcím („Öt ember. Egy autó. 9 600 kilométer.”) és alul a szereplők. A kép egyszer rajzolódik meg, utána a főmenüben a játék nem rajzol képkockákat, így a belépés gyors és sima.

## 📐 Minden kijelzőmérethez

- **Felbontás:** a kijelző valódi pixelszámához igazodik (telefonon 2,5×, gépen 3× renderfelbontásról indul), és csak valódi akadásnál vesz vissza; visszavétel után 15 mp-ig nem emel, hogy ne ugráljon.
- **Széles telefonok (19,5:9):** a kezelőgombok az oldalsó sávokba kerülnek.
- **Tabletek (4:3, 16:10) és összehajtható telefonok:** a kép felül van, minden gomb (pedálok, tempomat, duda, kapcsolók) a lenti sávban, nem takarja a játékot.

## 🛣️ Út közben

Út közben folyamatosan váltakozik a város, a falu, az országút és az autópálya, a táblákon valós településnevekkel (Ács, Bábolna, Sümeg, Mondsee, Beaune…). A sebességkorlátozás is szakaszonként változik: 50, 90/100 vagy 130 km/h.

**Satufék:** erős fékezésnél csak a gumik csikorognak, féknyom marad az úton, az utasok előrebillennek és tágra nyílt szemmel ijednek meg (sikoly nincs). Normál fékezésnél is kicsit előredőlnek.

**Sávváltás:** az autó fokozatosan, ívben sorol át (kb. 1,5 s, lassan hosszabb, havon és esőben óvatosabb), nincs hirtelen rántás. A forgalom többi járműve is így vált sávot.

**Útminőség:** jó, közepes, rossz (kátyús) és macskaköves utak. A futómű rugózik és csillapít: fékezéskor bólint az autó, gyorsításkor leül, kátyúnál megdobja. Nagy sebességnél a kátyúk defektet okozhatnak.

**Élő időjárás:** a célállomás aktuális időjárása (eső, hó, köd, vihar, napsütés) és napszaka az internetről érkezik, az [Open-Meteo](https://open-meteo.com) szolgáltatásból. Internet nélkül a beépített időjárással fut a játék.

## 🏪 Megállók az úton

**Koppints oda, ahol meg akarsz állni:** egy boltra, hipermarketre, trafikra, újságosra, benzinkútra, gyorsétteremre, pihenőre, szervizre vagy autómosóra koppintva (gépen kattintva), vagy a felső haladási sávon az ikonjára, az autó kijelzi a megállást, behúzódik a szélső sávba, odamegy és megáll. Újabb koppintás a megállást törli. Ha a hely már elmaradt, vagy olyan közel van, hogy a sebesség miatt nem lehet biztonságosan megállni, a játék szól.

A megállókat előjelző tábla jelzi („Benzinkút 500 m”), a következők pedig a kijelző alatt is látszanak:

- **Benzinkút:** tankolás és bolt. Autópályán kb. 40 km-enként.
- **Kisbolt:** kaja, víz, bébiétel, fagyi.
- **Hipermarket:** nagybevásárlás, nagy bébicsomag, játék, munka a zöldségesnél.
- **Trafik:** kaparós sorsjegy, nagy kaparós (négyszeres nyeremény), üdítő.
- **Újságos:** gyerekújság, autós térkép, sorsjegy.

**Megállás egy érintéssel:** a kijelző alatt zöld „P” gombok mutatják a következő megállókat („P Kisbolt 400 m”). Érintésre (vagy az **E** billentyűre) apa irányjelzővel átsorol a szélső sávba, finoman lassít, és pontosan az üzlet ajtaja, illetve a benzinkútnál a tanksapka a kút előtt áll meg. Utána magától nyílik a bolt vagy a kút. Piros lámpánál és az előttünk haladó autó mögött megvár. Fékkel vagy sávváltással a megállás törölhető. Kézzel is meg lehet állni a szélső sávban az üzlet előtt.

**Sebességmérő kapu (VÉDA):** előtte „Sebességmérés” tábla áll. Ha túl gyorsan haladsz át alatta, villan, és jön a bírság (15 000 – 100 000 Ft).

## ❤️ A család kedve (5 szív)

A HUD közepén lévő szívek a család kedvét mutatják. Ütközés, piros lámpa, éhség, vagy ha nem állsz meg időben, amikor Atti sír, Petrának rossz vagy Annának pisilnie kell, egy szívet elvisz. Fagyi, játék, gyerekújság, gyerekmenü vagy egy pihenő visszaad.

**Nincs újrakezdés.** Ha elfogy minden szív, a család **nyűgös** lesz: a gyerekek nyafognak, sírnak, és Anya pihenőt kér. Ilyenkor elég megállni:
- **pihenőhelyen** (P tábla, padok, játszótér, mosdó): a család kiszáll, nyújtózik, a gyerekek csúszdáznak; utána legalább 3, plusz 1 szív. Ingyenes. A sürgős eseteket (sírás, rosszullét, pisilés) is megoldja.
- **gyorsétteremben vagy bármelyik boltnál:** legalább 2 szív.

1 szívnél figyelmeztetés jelez előre.

**Félreállás bárhol:** ha a család nyűgös, Apa fáradt (25 perc vezetés felett) vagy kevés a kedv, elég a szélső sávban megállni bárhol (kb. 1,5 mp). A játék pihenőnek veszi: bekapcsol a vészvillogó, a család kiszáll nyújtózni, utána helyreáll a kedv és nullázódik a fáradtság. Közlekedési lámpánál várakozva nem indul.

## 💥 Sérülés, totálkár, tréler, szerviz

Az autónak állapota van (100%), a HUD jobb panelján az **Autó** sáv mutatja. Ütközéskor a különbségi sebességtől függően sérül (egy 60 km/h-s ráfutás kb. 40%), vadbaleset és bója is visz le belőle. Ahogy romlik, látszik is:
- karcok és horpadások a sárvédőn;
- repedt fényszóró, leszakadt, menet közben lengő-lógó első lökhárító;
- gyűrődött motorháztető, pókhálósan repedt szélvédő;
- lelógó visszapillantó, füstölő, majd feketén füstölő motor, az úton szikrázó lökhárító.

Erős ütközésnél kinyílik a **légzsák**, és leeresztve ott lóg a javításig. A sérült autó lassabb: 50% alatt max. 120, 30% alatt 80, 15% alatt 50 km/h.

**Totálkár (0%):** a kép egyszer, röviden megremeg, aztán jön a **tréler** (50 000 Ft). A billenő plató hátracsúszik és lebillen a földig (nem megy át a tréler kerekein), a csörlő felhúzza rá az autót, amelynek kerekei végig a platón gördülnek, majd a plató visszabillen, és elviszi a legközelebbi **szervizbe 10 km-rel hátrébb**. Ott megjavítják: karosszéria és fényezés 186 000 Ft, fényszóró, lökhárító, tükör 46 500 Ft, légzsák 118 000 Ft. Utána a szerviztől folytatódik az út. Minden tétel bekerül a költségnaplóba.

**Autószerviz:** városokban, országutakon és az autópályák mentén is van (P gombbal, „SZERVIZ” útburkolati jellel, közeledő ikonnal). Csak karosszériát javít: mutatja az autó állapotát, a javítandó részeket (karcok, horpadások, lökhárító, fényszóró, motorháztető, szélvédő, tükör, légzsák) és a költséget (3 200 Ft / %, légzsák 118 000 Ft). Ép autónál kiírja, hogy nincs mit javítani.

**Mínuszba is lehet menni:** ha elfogy a pénz, bankkártya-hitelre folytatódik a vásárlás és a javítás, az egyenleg pirosan mutatja a tartozást.

## ⏸️ Szünet

Szünet alatt és amikor a játék a háttérben van (másik alkalmazás, lezárt képernyő), semmi nem számol tovább: nem fogy a kaja, nem nő a fáradtság, nem jönnek események. A háttérbe kerüléskor a játék magától szünetel és ment. A szünet valós ideje pihenésnek számít: Apa fáradtságából annyi perc lejön, amennyi a szünet volt; 10 perc felett az egész család kipiheni magát. Ez akkor is így van, ha kilépsz és később folytatod.

**Családi gondok gyakorisága:** egy óra vezetés alatt átlagosan kb. 4 (sírás, rosszullét, pisilés), és két ilyen között legalább kb. 5 perc telik el.

## 😴 Fáradás

Apa fárad: valós 30 perc folyamatos vezetés után elálmosodik (a szívek alatt látszik a vezetési idő). 25 percnél figyelmeztetés jön, 30 percnél felszólítás, hogy állj meg pihenni. Utána kissé homályosabb a kép, és ritkán (legfeljebb 20 másodpercenként) lecsukódik a szeme (mikroalvás): a kép széle elsötétül, középen piros felirat jelzi, hogy „Apa elbóbiskolt!”, és az autó kisodródik a sávból. 45 percnél a legerősebb.

- **Pihenőhely:** teljesen kipihenten indulsz tovább.
- **Kávé Apának:** 15 percet levesz a fáradtságból.
- **Bármelyik megálló** (bolt, kút, étterem): 5 percet.
- **Szállás** a szakasz végén: teljes pihenés.

## 🫧 Forgókefés autómosó

Az autó menet közben piszkolódik: porréteg és sárfoltok jelennek meg rajta, esőben, hóban és rossz úton gyorsabban, pocsolyán áthajtva egy adag sár is rákerül. Városokban és a kutak mellett **forgókefés automata autómosó** van (P gomb, „MOSÓ” útburkolati jel, közeledő ikon). A család bent marad, a mosókapu többször végigmegy az autón:

| Program | Ár | Menet |
|---|---|---|
| Alap | 2 490 Ft | előmosás, forgókefés mosás, öblítés |
| Prémium | 3 990 Ft | + aktív hab, meleg viasz (+1 kedv) |
| Extra | 5 490 Ft | + alvázmosás, szárítás, polírozás (+1 kedv) |

Látszik a vízsugár, a rózsaszín hab, a forgó oldalsó és felső kefe, a szárító fúvókák, a végén pedig csillog a tiszta autó. A piszkosság a mosóban látszik százalékban.

## 🍔 Burger Pont gyorsétterem

Városokban és az autópályák mentén (a kutak közelében) saját tervezésű gyorsétterem várja a családot, autós kiszolgálóval. Kínálat: sajtburger, gyerekmenü játékkal, csirkefalat, sült krumpli, shake, kávé Apának, családi menü és fagyikehely.

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
- **Defekt:** a kerék valóban lapos lesz (a felni leül, a gumi alul szétnyomódik), az autó azon a sarkon megroggyan, menet közben puffog és ráz. Állj meg a szélső sávban, és Apa végigcsinálja a kerékcserét: kiszáll, elhátrál a háromszöggel, kiveszi a pótkereket és az emelőt, letérdel, csavarkulccsal lazít, felpumpálja az autót, leveszi a lapos kereket, felteszi a pótkereket, meghúzza a csavarokat, leengedi az autót, elrakja a kereket, visszahozza a háromszöget és visszaül (kb. 13 mp). Pótkerék nélkül autómentőt kell hívni.
- **Traffipax**, **piros lámpa**, **dugó**, **útépítés**, **őz az úton**.
- **Kifogyott a benzin:** az autómentő hoz 10 litert.

## 🚦 Forgalom

Minden jármű valós méretarányban, részletesen kidolgozva látszik (a busz utasokkal, ajtókkal, viszonylatjelzővel és tükrökkel; a kamion ponyvás pótkocsival, terelős fülkével, üzemanyagtartállyal; a motoros bukósisakban, idomos géppel; a tréler fényhíddal és lebillenő platóval) a családi autóhoz képest: kisautó, rendőrautó, mentő, furgon, lakóautó, busz (12 m), kamion (16,5 m), traktor és motor.

Előfordulhat **baleset** az úton (rendőr, mentő, lezárt sáv). Nagyon ritkán pedig **helyi rendőr** ér utol szirénával: le kell húzódni és megállni, ilyenkor jön az igazoltatás.

## 🦌 Vadállatok

Országúton és falvak mellett őz, vaddisznó, róka és mezei nyúl kel át az úton, éjjel és szürkületben gyakrabban; „Vadveszély” táblák figyelmeztetnek. Az őz éjjel megbénul a fényszóróban, a nyúl cikázik. A duda elriasztja őket. Ha elütsz egy nagy vadat (őz, vaddisznó), az javítási költséggel (kb. 35–70 ezer Ft) jár, és nagy sebességnél defektet is okozhat. Falvakban birka és tehén is átballaghat.

## 🛣️ Útburkolati jelek

A megállók előtt 200 és 90 méterrel festett felirat és kanyarodó nyíl jelzi a szélső sávban: BENZIN, BOLT, TRAFIK, ÚJSÁG, ÉTTEREM, P PIHENŐ. A lámpáknál STOP felirat és felfestett állóvonal van, a települések elején a sebességkorlát (50) az úton.

## 🌳 Táj

**Falusi rész:** a hosszabb országúti szakaszokon valódi falvak (pl. Balatonfenyves, Balatonmáriafürdő, Fenékpuszta, Jánosháza, Sárvár, Bucsu, Pohořelice, Rajhrad) gémeskúttal, baromfiudvarral, kapirgáló csirkékkel, tehénnel, szénaboglyával és veteményessel. Országúton tanyák is feltűnnek.

Mezők (búza, napraforgó, repce, kukorica, szántás, levendula) szalmabálákkal, fasorok, nyárfák, nyírfák, bokrok, virágos fű, tanyák silóval, szélerőművek, Hollandiában szélmalmok, Toszkánában napsütötte dombok és búzamezők, Spanyolországban és Portugáliában száraz, napégette táj, északon (Dánia, Észak-Németország) fenyvesek, madarak, párás távoli dombok, és út menti kilométerkövek valós km-számmal.

## 🚗 Az autó kezelése

- **Középkonzol:** a kapcsolók LED-del jelzik, mi van bekapcsolva (zöld, kék, borostyán), lenyomásra besüppednek. A pedálok lenyomásra előrebillennek és világítanak, a kormány sávváltáskor elfordul.
- **Felső sáv:** ⏸ szünet és ⌂ **főmenü**. A főmenü gomb automatikusan elmenti a játékállást, a Folytatás gombbal pontosan onnan lehet továbbmenni. A játék akkor is ment, ha a telefon képernyője lezár vagy az alkalmazás a háttérbe kerül.

- **Világításkapcsoló:** kikapcsolva, helyzetjelző, tompított, reflektor.
- **Fénykürt (villogtatás)** és **duda:** az előtted haladó autó lehúzódik.
- **Ködlámpa:** első, majd első és hátsó.
- **Tempomat:** külön gomb a gázpedál fölött. Egy koppintás a mostani sebességet tartja (5 km/h-ra kerekítve, 30 km/h felett), újabb koppintás kikapcsolja; hosszan nyomva előre beállított sebességek (50–130). Fékre kikapcsol. Billentyűzeten: T.
- **Kézifék** visszajelző lámpával.
- **Vészvillogó**, **ajtók nyitása és csukása** (csak állva).
- **Hátramenet:** álló helyzetben tartsd nyomva a féket kb. egy másodpercig: bekapcsol a hátramenet és a tolatólámpa, a fékkel tolatsz, a gázzal visszavált előremenetbe. Billentyűzeten az R is működik.
- **Irányjelző:** valós ütemben, percenként 90-et villan, relékattogással; sávváltáskor 3 villanás.
- **Duda:** valódi kéthangú autóduda, amíg nyomod, szól.
- **Nagy kamion, busz mellett:** ha egy jármű eltakarná az autót, áttetszővé válik, így a családi autó mindig látszik.
- **Hátsó lámpa:** függőleges, a hátsó oszlop ívét követi, három LED-csíkkal; benne a helyzetjelző, a féklámpa (fékezéskor az egész lámpa felizzik) és az irányjelző.
- **Féklámpa** fékezéskor és álló helyzetben.
- **Rádió:** négy állomás saját szerzésű zenével (Retro FM, Rock Rádió, Pop Hullám, Esti Lounge).
- **Motorhang:** négyhengeres motor, fordulatszám és terhelés szerint változik.
- **Mini műszerfal:** sebességmérő, fordulatszámmérő, fokozat, üzemanyagszint, sebességkorlátozás, átlagfogyasztás és visszajelző lámpák.

## 🎮 Irányítás

A középkonzolon csak három gomb van: **világítás** (egyetlen gomb minden fokozattal, nyomva tartva fénykürt), mellette a **vészvillogó**, és a **rádió**. A **kézifék** a fék- és gázpedál mellett, a fékpedál fölött van. Az **ajtók automatikusak**.

**Billentyűzet (laptop, számítógép):** két választható kiosztás, a főmenüben vagy a Szünet menüben a **⌨ Billentyűzet** gombbal (vagy az **I** / **F1** billentyűvel) nyíló súgóban lehet váltani; az első játéknál magától megjelenik. A WASD a fizikai helyén működik magyar billentyűzeten is.

| Funkció | Klasszikus | Autós |
|---|---|---|
| Gáz | → D Num6 | ↑ W Num8 |
| Fék (álló helyzetben tartva: hátramenet) | ← A Num4 | ↓ S Num2 |
| Sávváltás fel / le | ↑ ↓ · W S · Num8 Num2 | ← → · A D · Num4 Num6 |

Mindkét kiosztásban:

| Billentyű | Funkció |
|---|---|
| Szóköz, Num0 | satufék / pumpálás a kútnál |
| B, X, Num5 | kézifék |
| H, Shift, Num+ | duda |
| L / K (tartva) / F / V | világítás fokozatai / fénykürt / ködlámpa / vészvillogó |
| T | tempomat be/ki |
| 1, 2, 3, 4, 5 / 0 | tempomat 50, 70, 90, 110, 130 km/h / ki (menet közben) |
| E | megállás a következő helynél |
| R | hátramenet kapcsoló (álló helyzetben) |
| G | GPS térkép |
| N, Tab | költségnapló |
| Q, C | rádió: következő adó |
| M | menüzene |
| P, Esc | szünet / vissza |
| F3 | teljesítménymérő |
| I, F1 | billentyűzet súgó |
| ↑ ↓ + Enter, 1–9 | menük, boltok, minijátékok |

## ⚡ Gyorsaság

- **Kétlépcsős betöltés:** először csak a főképernyőhöz kellő rész töltődik be (kb. egy másodperc), a térkép, a boltok és a minijátékok a háttérben jönnek utána.
- **Nincs élő elmosás:** a menük nem mossák el folyamatosan a mozgó képet (ez telefonon a leglassabb művelet volt).
- **Előre elkészített rétegek:** a filmes színkorrekció, a vignetta és a filmszemcse egyszer készül el, utána csak bemásolódik. A betűk is gyorsítótárból jönnek.
- **Éjszakai fények:** a sötétítő réteg fél felbontású (lágy fény, negyedannyi pixel), a lámpák fénye egy előre elkészített fénykörből jön; a csillagos ég egy képből.
- **Feliratok:** az állandó feliratok egyben gyorsítótárazva, egyetlen képmásolással kerülnek a képre; a változó számok (km, idő, pénz) a kész betűképekből rakódnak össze, így menet közben nem készül folyton új kép (a régi 15 helyett kb. 1 új kép másodpercenként), és nincs emiatt memóriatakarítási akadás.
- **Előmelegítés:** a betűképek induláskor és felbontásváltáskor a telefon üresjárati idejében készülnek el, nem játék közben.
- **Mentés üresjáratban:** az automatikus mentés (10 mp-enként) akkor fut, amikor a telefon épp ráér, így nem okoz döccenést.
- **Városi házak:** ablakonkénti színátmenet helyett egyszerű kitöltés és csillanás.
- **Előre megrajzolt táj:** telefonon nem a felbontás, hanem a képkockánkénti apró rajzolási műveletek száma a lassú. Ezért a házak, fák, templomok, kutak és minden út menti tárgy egyszer megrajzolt képként, a városi háttér-sziluett és a mezősáv képernyőnyi csempékben készül el, és menet közben csak ezek a képek mozognak (éjjel az ablakfények is megmaradnak). A műszerfal is egy képbe rajzolódik, és 30-szor frissül másodpercenként. Eredmény: városban képkockánként kb. 2 300 helyett kb. 350, országúton kb. 940 helyett kb. 480 rajzolási művelet. A régi képek vásznait újrahasznosítja, így nem keletkezik folyton új.
- **Sima mozgás 60/90/120/144 Hz-en is:** a játék 60 lépést tesz másodpercenként, a kép a kijelző frissítéséhez igazodik (60 Hz-en 60, 90 Hz-en 90, 120 Hz-en 60, 144 Hz-en 72 egyenletes kép/mp, akkor is, ha a telefon menet közben váltogat), és két lépés között az út, a járművek és a sávváltás helyzetét arányosan kiszámolja. Így gyors menetben sem rángat a kép (korábban a nagy frissítésű kijelzőkön a képek egyenetlen ütemben jöttek, ez tűnt akadásnak).
- **Rossz úton** a kép egyenletesen, finoman rezeg, nem véletlenszerűen ugrál képkockánként; a kerekek forgása is folyamatos.
- **Teljesítménymérő:** a Szünet menüben bekapcsolható; a kép tetején mutatja a kijelző frissítését (Hz), a kép/mp-t, a felbontást, a rajzolási időt, a leghosszabb képközt és az akadások számát.
- **Akadásfigyelés:** csak a valóban késő képkocka számít akadásnak (két kép között több mint 26 ms). A telefonok saját 60/120 Hz-es váltogatása nem, így a játék nem veszi vissza feleslegesen a minőséget. Ritkán és csak egy-egy lépést vált (minden váltás újraépíti a képtárakat); ha egyszer vissza kellett vennie, utána nem próbál feljebb lépni. Nincs többé fél sebességű (30 kép/mp) mód.
- **Letöltés a főmenüben:** a főmenübe érve a telefon azonnal letölti magának a teljes játékot; a főmenü alján látszik, ha kész („✓ teljes játék letöltve, offline is megy”). Utána internet nélkül is indul és végigjátszható.
- **Nincs fölösleges oldalfrissítés:** a gombok feliratai csak akkor íródnak újra, ha tényleg változnak.
- **Gyenge telefonon:** egyszerűbb díszítés, a kijelző minden 3. képkockán rajzolódik újra, végső esetben 30 kép/mp rajzolás 60-as játéklogikával.
- **A telefonhoz igazodik:** a processzormagok száma és a memória alapján választ kezdő minőséget (2 GB alatt rögtön takarékos mód); figyeli a hosszú, akadó képkockákat is, és ha ilyen többször előfordul, azonnal visszavesz. Erős telefonon élesebb felbontásban rajzol (a kijelzőnél soha nem többet), gyengébbnél automatikusan visszavesz a felbontásból és az effektekből, és ha újra van tartalék, visszaemeli.

## 📱 Telepítés, megosztás, frissítés

**Biztonságos frissítés:** a játék előbb minden új fájlt letölt és méret szerint ellenőriz, és csak akkor cseréli le a régieket, ha mind megjött és mind az új verzióé (a GitHub Pages feltöltés után pár percig vegyesen adhat régi és új fájlt; ilyenkor később újrapróbálja). Ha mégis keveredés miatt nem indulna el a menü, a játék egyszer magától tisztán újratölti magát; a menü akkor is megjelenik, ha az oldal és a szkriptek verziója eltér.

**Telepítési ablak:** magától csak egyszer jelenik meg, amikor valaki először nyitja meg a megosztott linket az adott készüléken; utána a főmenü mindig szabad, telepíteni a főmenü Telepítés gombjával lehet. A link telepítés nélkül is mindig közvetlenül a játékot nyitja meg. **Xiaomi / Redmi / POCO:** ha a telepített ikon nem indul, az a rendszer tiltása (a Chrome „Kezdőképernyő-parancsikonok” és „Felugró ablakok megjelenítése háttérben futás közben” engedélye); a magyarázat a telepítési ablak alján, egy koppintásra nyílik le. A Xiaomi saját böngészőjéből a játék felajánlja a megnyitást Chrome-ban.

A főmenüben bal oldalt három gomb van:

- **⬇ Telepítés:** a kezdőképernyőre teszi a játékot. iPhone-on Safariban: Megosztás, majd „Főképernyőhöz adás”.
- **↗ Megosztás:** elküldi a játék linkjét.
- **Telepítés megosztott linkről:** a Megosztás gomb olyan linket küld, amelyet megnyitva a játék azonnal felajánlja a telepítést, és amíg nincs telepítve, minden böngészős indításkor újra rákérdez.
- **Android, Chrome/Edge (gépen is):** egy gombnyomás a „Telepítés most”, a böngésző saját telepítő ablaka jön fel.
- **iPhone, iPad:** az Apple nem engedi az automatikus telepítést, ezért a játék megmutatja a három lépést (Megosztás → Főképernyőhöz adás → Hozzáadás), nyíllal a gomb felé.
- **Messenger, Facebook, Instagram beépített böngészője:** itt nem lehet telepíteni, a játék Androidon egy gombbal átviszi a linket a Chrome-ba, iPhone-on kimásolja.

Teljesen automatikus, jóváhagyás nélküli telepítést egyik böngésző sem enged, mindig a felhasználónak kell rábólintania.

**Offline magától:** az első indítás után a játék a háttérben letölti az összes fájlját, onnan internet nélkül is fut. Ha van új verzió, azt is magától letölti, és a következő indításkor már az fut.
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
| `js/map.js`, `js/geo.js` | térképrajzolás, alap partvonalak |
| `js/gps.js`, `js/geohd.js` | teljes képernyős, interaktív GPS és a részletes partvonalak |
| `js/game.js` | játékmenet, fizika, fogyasztás, események, képernyők |
| `js/app.js` | telepítés, megosztás, frissítés |
| `sw.js`, `manifest.webmanifest`, `version.json`, `icons/` | az alkalmazás működéséhez szükséges fájlok |
