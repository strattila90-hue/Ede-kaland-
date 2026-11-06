# 🚐 Családi Vakáció – v2.11.2

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

A játék valós léptékű: 90 km/h-val 1 km pontosan 40 másodperc, így Komáromtól Bábolnáig kb. negyedóra, Komáromtól Siófokig közel két óra. A teljes út kb. 4 600 km.

A játék kétpercenként automatikusan menti az állást, így az út több napon át is folytatható. A főmenüben választható **Gyorsított (5x)** vagy **Turbó (20x)** utazás is, de alapból valós idővel megy.

## 🌍 Európa körút (12 szakasz, kb. 5 800 km, 9 ország)

Komárom → Siófok → Keszthely → Bécs → Prága → Berlin → Amszterdam → Párizs → Barcelona → Nizza → Velence → Salzburg (Alpok) → haza, Komárom.

A jobb felső sarokban **GPS** mutatja az autó környékét: ráközelít a kocsira, menetirány szerint fordul, kék vonallal mutatja az utat, rajta a városok, tavak (Balaton, Fertő, Garda, Bodeni- és Genfi-tó), erdők és mellékutak. Alul a hátralévő km és a várható menetidő. Érintésre a teljes Európa-térkép jelenik meg.

**Mi közeledik:** a GPS alatt kis ikonok mutatják, mi jön, és hány méterre: benzinkút, bolt, trafik, újságos, sebességmérő, közlekedési lámpa (az aktuális színével), település, autópálya, kátyú, útépítés, baleset, dugó, állat, és a cél. A térkép földrajzilag pontos, [Natural Earth](https://www.naturalearthdata.com) közkincs adatokból készült.

## 🎬 Főmenü: filmplakát

A főmenü egyetlen álló kép, családi road movie plakát: naplemente csíkos nappal, hegyek, a horizontba futó út, rajta hátulról a családi autó csomagokkal a tetőn, nagy „Családi Vakáció” cím, alcím („Öt ember. Egy autó. 5 800 kilométer.”) és alul a szereplők. A kép egyszer rajzolódik meg, utána a főmenüben a játék nem rajzol képkockákat, így a belépés gyors és sima.

## 📐 Minden kijelzőmérethez

- **Felbontás:** a kijelző valódi pixelszámához igazodik (telefonon 2,5×, gépen 3× renderfelbontásról indul), és csak valódi akadásnál vesz vissza; visszavétel után 15 mp-ig nem emel, hogy ne ugráljon.
- **Széles telefonok (19,5:9):** a kezelőgombok az oldalsó sávokba kerülnek.
- **Tabletek (4:3, 16:10) és összehajtható telefonok:** a kép felül van, minden gomb (pedálok, tempomat, duda, kapcsolók) a lenti sávban, nem takarja a játékot.

## 🛣️ Út közben

Út közben folyamatosan váltakozik a város, a falu, az országút és az autópálya, a táblákon valós településnevekkel (Ács, Bábolna, Sümeg, Mondsee, Beaune…). A sebességkorlátozás is szakaszonként változik: 50, 90/100 vagy 130 km/h.

**Satufék:** erős fékezésnél csikorognak a gumik, féknyom marad az úton, az utasok előrebillennek, tágra nyílt szemmel ijednek meg, a gyerekek sikítanak. Normál fékezésnél is kicsit előredőlnek.

**Sávváltás:** az autó fokozatosan, ívben sorol át (kb. 1,5 s, lassan hosszabb, havon és esőben óvatosabb), nincs hirtelen rántás. A forgalom többi járműve is így vált sávot.

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

## ❤️ A család kedve (5 szív)

A HUD közepén lévő szívek a család kedvét mutatják. Ütközés, piros lámpa, éhség, vagy ha nem állsz meg időben, amikor Atti sír, Petrának rossz vagy Annának pisilnie kell, egy szívet elvisz. Fagyi, játék, gyerekújság, gyerekmenü vagy egy pihenő visszaad.

**Nincs újrakezdés.** Ha elfogy minden szív, a család **nyűgös** lesz: a gyerekek nyafognak, sírnak, és Anya pihenőt kér. Ilyenkor elég megállni:
- **pihenőhelyen** (P tábla, padok, játszótér, mosdó): a család kiszáll, nyújtózik, a gyerekek csúszdáznak; utána legalább 3, plusz 1 szív. Ingyenes. A sürgős eseteket (sírás, rosszullét, pisilés) is megoldja.
- **gyorsétteremben vagy bármelyik boltnál:** legalább 2 szív.

1 szívnél figyelmeztetés jelez előre.

## 💥 Sérülés, totálkár, tréler, szerviz

Az autónak állapota van (100%), a HUD jobb panelján az **Autó** sáv mutatja. Ütközéskor a különbségi sebességtől függően sérül (egy 60 km/h-s ráfutás kb. 40%), vadbaleset és bója is visz le belőle. Ahogy romlik, látszik is:
- karcok és horpadások a sárvédőn;
- repedt fényszóró, leszakadt, menet közben lengő-lógó első lökhárító;
- gyűrődött motorháztető, pókhálósan repedt szélvédő;
- lelógó visszapillantó, füstölő, majd feketén füstölő motor, az úton szikrázó lökhárító.

Erős ütközésnél kinyílik a **légzsák**, és leeresztve ott lóg a javításig. A sérült autó lassabb: 50% alatt max. 120, 30% alatt 80, 15% alatt 50 km/h.

**Totálkár (0%):** jön a **tréler** (50 000 Ft), az autót felhúzza a platóra és elviszi a legközelebbi **szervizbe 10 km-rel hátrébb**. Ott megjavítják: karosszéria és fényezés 186 000 Ft, fényszóró, lökhárító, tükör 46 500 Ft, légzsák 118 000 Ft. Utána a szerviztől folytatódik az út. Minden tétel bekerül a költségnaplóba.

**Autószerviz:** városokban, országutakon és az autópályák mentén is van (P gombbal, „SZERVIZ” útburkolati jellel, közeledő ikonnal). Csak karosszériát javít: mutatja az autó állapotát, a javítandó részeket (karcok, horpadások, lökhárító, fényszóró, motorháztető, szélvédő, tükör, légzsák) és a költséget (3 200 Ft / %, légzsák 118 000 Ft). Ép autónál kiírja, hogy nincs mit javítani.

**Mínuszba is lehet menni:** ha elfogy a pénz, bankkártya-hitelre folytatódik a vásárlás és a javítás, az egyenleg pirosan mutatja a tartozást.

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

Mezők (búza, napraforgó, repce, kukorica, szántás, levendula) szalmabálákkal, fasorok, nyárfák, nyírfák, bokrok, virágos fű, tanyák silóval, szélerőművek, Hollandiában szélmalmok, madarak, párás távoli dombok, és út menti kilométerkövek valós km-számmal.

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
| R | fék tartva álló helyzetben | hátramenet |
| T | TEMPO | tempomat |
| E | P gomb | megállás a következő üzletnél |
| N | pénz | költségnapló |
| B | KÉZI | kézifék |
| Q | RÁDIÓ | rádió: következő állomás |
| P | II | szünet |
| M | Zene (főmenü) | menüzene |
| 1–5, Enter | érintés | menük és minijátékok |

## ⚡ Gyorsaság

- **Kétlépcsős betöltés:** először csak a főképernyőhöz kellő rész töltődik be (kb. egy másodperc), a térkép, a boltok és a minijátékok a háttérben jönnek utána.
- **Nincs élő elmosás:** a menük nem mossák el folyamatosan a mozgó képet (ez telefonon a leglassabb művelet volt).
- **Előre elkészített rétegek:** a filmes színkorrekció, a vignetta és a filmszemcse egyszer készül el, utána csak bemásolódik. A betűk is gyorsítótárból jönnek, a GPS kb. 12-szer frissül másodpercenként.
- **Éjszakai fények:** a sötétítő réteg fél felbontású (lágy fény, negyedannyi pixel), a lámpák fénye egy előre elkészített fénykörből jön; a csillagos ég egy képből.
- **Feliratok:** minden felirat egyben gyorsítótárazva, egyetlen képmásolással kerül a képre.
- **Városi házak:** ablakonkénti színátmenet helyett egyszerű kitöltés és csillanás.
- **Nincs fölösleges oldalfrissítés:** a gombok feliratai csak akkor íródnak újra, ha tényleg változnak.
- **Gyenge telefonon:** egyszerűbb díszítés, a kijelző minden 3. képkockán rajzolódik újra, végső esetben 30 kép/mp rajzolás 60-as játéklogikával.
- **A telefonhoz igazodik:** erős telefonon élesebb felbontásban rajzol (a kijelzőnél soha nem többet), gyengébbnél automatikusan visszavesz a felbontásból és az effektekből, és ha újra van tartalék, visszaemeli.

## 📱 Telepítés, megosztás, frissítés

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
| `js/map.js`, `js/geo.js` | Európa-térkép és minitérkép |
| `js/game.js` | játékmenet, fizika, fogyasztás, események, képernyők |
| `js/app.js` | telepítés, megosztás, frissítés |
| `sw.js`, `manifest.webmanifest`, `version.json`, `icons/` | az alkalmazás működéséhez szükséges fájlok |
