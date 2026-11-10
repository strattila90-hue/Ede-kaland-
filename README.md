# 🚐 Családi Vakáció – v2.42.0

Családi autós kalandjáték. A család **Komáromból, a Táncsics Mihály utcából** indul, és bejárja Európát, valós távolságokon és valós fogyasztással, **forintban** számolva.

A játék telepíthető alkalmazás (PWA): telefonon a kezdőképernyőre tehető és internet nélkül is fut.

## 👨‍👩‍👧‍👧 A család és az autó

**Felolvasás, nemek szerint:** amit a családtagok mondanak (a szövegbuborékok), azt a telefon saját magyar hangja fel is olvassa. Ha a készüléken van férfi és női magyar hang is, **Apa és kis Atti a férfi**, **Anya, Anna és Petra a női** hangot kapja. Ha csak egy magyar hang van (sok Androidon így van), a hangmagasság választja szét őket: Apa mély, Anya közepes, Anna és Petra magasabb, kis Atti a legmagasabb, a gyerekek kicsit hadarnak is. A számokat és mértékegységeket kiolvassa (130 kilométer per óra, 500 forint). Beszéd közben a rádió lehalkul. Szünetben, menüben és háttérben elhallgat. Offline is megy, ha a telefonon le van töltve a magyar hang (Beállítások > Szövegfelolvasás).

**Ki utazik? (v2.34)** Az első (és minden új) játék előtt kiválasztható, hányan indulnak útnak: Apa mindig jön (ő vezet), Anya, Anna, Petra és kis Atti egyenként be- és kikapcsolható a kártyájukra koppintva (1–5 ember). Aki otthon marad, az nem ül az autóban, nem száll ki a megállóknál, nem szól bele az útba, és az ő bajai (Atti sír, Petrának rossz, Anna pisilne) sem fordulnak elő. A választás az **Apa garázsa > Ki utazik?** pontban is beállítható. A szemek új rajzot kaptak: mandulaszem, színes írisz (Apa és Anya barna/zöld, a gyerekek kék), pupilla, csillanás, a lányoknak szempilla; Apa napszemüvege a feje búbjára került.

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

A játék 10 másodpercenként (és háttérbe kerüléskor) automatikusan menti az állást, így az út több napon át is folytatható. A főmenüben választható **Gyorsított (5x)** utazás is (ennél gyorsabb nincs), de alapból valós idővel megy. A megtett utat a mentés kilométerben tárolja, így egy elkezdett utazásban a km és a méter sosem vész el és nem ugrik, akkor sem, ha közben átállítod a gyorsítást. Valós időben a kijelzett megtett út méterre pontos: 90 km/h-val pontosan 25 métert teszel meg másodpercenként (1 km = 40 mp), és a kijelző a métereket is mutatja (pl. 10,305 / 167 km). Gyorsított és turbó módban a táv rövidebbre van sűrítve, ezért ilyenkor a kijelző mellett ott a szorzó (5x, 20x).

## 🌍 Európa körút (22 szakasz, kb. 9 700 km, 14 ország)

Komárom → Siófok → Keszthely → Zágráb → Ljubljana → (a Vršič-hágón át, 1611 m) → Velence → Firenze → Róma → Nizza (a Ligur-tenger partján) → Barcelona → Madrid → Lisszabon → Bordeaux → Párizs → Amszterdam → Hamburg → Koppenhága (a dán hidakon át) → Berlin → Varsó → Krakkó → Prága → Bécs → haza, Komárom.

Országok: Magyarország, Horvátország, Szlovénia, Olaszország, Franciaország, Spanyolország, Portugália, Belgium, Hollandia, Németország, Dánia, Lengyelország, Csehország, Ausztria. Az útdíjak és matricák országonként valósághűek (pl. szlovén e-matrica, horvát, olasz, francia, spanyol, portugál és lengyel autópályadíj). Minden nagyvárosnak saját képeslapja van (Zágráb tornyai, Colosseum, Duomo, madridi palota, lisszaboni híd és villamos, bordeaux-i kastély, hamburgi daruk, Nyhavn, varsói Kultúrpalota, Wawel).

## ⛰️ Domborzat, hegymenet, szerpentin (v2.40)

**Emelkedők és lejtők:** minden szakasznak valódi magasságprofilja van: a városok tengerszint feletti magasságai között fut (pl. Komárom 110 m, Madrid 650 m, Medinaceli 1200 m, Vršič-hágó 1611 m), rajta szelíd dombokkal. Valós meredekség-korlátok: autópályán legfeljebb 5%, országúton 7% (az Alpokban 9%), lakott területen 4%, szerpentinen 12%. A dombok tájegységenként mások: az Alföldön és Hollandiában szinte sík, Toszkánában és Provence-ban hullámos.
- **Látvány akadás nélkül:** egy képernyőn kb. 33 m út látszik, ezen belül a lejtő egyenes. A talaj (közeli táj, út, forgalom, autó) külön képre rajzolódik, és 8 képpontos függőleges csíkokban, egész képpontnyi eltolással kerül a képernyőre. Ez csak egyszerű képmásolás (nincs ferdítés, újramintavételezés), ezért gyenge telefonon is gyors. Az épületek, fák, oszlopok függőlegesek maradnak, az égbolt és a látóhatár vízszintes. A kép 1% alatt nem dől, takarékos minőségben pedig kikapcsol (a menetfizika marad).
- **Menetfizika:** emelkedőn az autó lassul (a gravitáció valós ereje), és többet fogyaszt (5%-on kb. +9 l/100 km), a motor hangja terheltebb. Lejtőn gyorsul és alig fogyaszt (motorfék). A tempomat lejtőn visszafogja az autót, az autopilóta is.
- **Táblák:** „Emelkedő / Lejtő X%” háromszögtábla az 5%-nál meredekebb szakaszok előtt.

**Szerpentin: a Vršič-hágó** (Szlovénia, 1611 m). A Ljubljana–Velence szakasz most Kranjska Gorán, a hágón, a Soča völgyén (Trenta, Bovec, Kobarid) és Cividale del Friulin át vezet (322 km).
- A hágó két oldalán **50 számozott hajtűkanyar** (északon 1–24, délen 25–50), mindegyiknél tábla a sorszámmal és a magassággal (ahogy a valóságban). Előtte „Veszélyes kanyarok – 24 / 26 hajtű” és meredekségtábla.
- **35 km/h fölött a hajtűkanyarban megcsúszik az autó**: csikorgás, nekicsúszik a szalagkorlátnak, oldalsérülés. Előtte figyelmeztetés: „lassíts 30 km/h-ra”. Kanyarodáskor az autó elfordul (rövid kanyarodó mozdulat). Az autopilóta magától lelassít. A hágón 50 km/h a határ, kamion és busz nem jár.
- A háttérben, a hegyoldalon látszik a **cikcakkos szerpentin**, rajta egy pont mutatja, hol tart a család (felfelé a hágó tetején álló menedékházig, utána lefelé). A hágó környékén alpesi táj van, a tájváltás lágyan átúszik.
- A **GPS-en** a szerpentin valódi cikcakkos vonal, és a család helye is ezen halad.

## 🛂 Külföldi táblák, határok, sebességhatárok (v2.40)

- **Helyi nevek a helységnévtáblán:** a táblán a helyi nyelvű név áll, a GPS-en és a feliratokon a magyar is: WIEN (Bécs), PRAHA (Prága), WARSZAWA (Varsó), KRAKÓW, ŁÓDŹ, ZAGREB, VENEZIA, TRIESTE, ROMA, NICE, PARIS, BRUXELLES / BRUSSEL, LISBOA, KØBENHAVN, DONOSTIA / SAN SEBASTIÁN stb. A betűkészlet megkapta a szükséges ékezeteket (ř, č, š, ž, ł, ń, ż, ø, å, ñ, ã, ç, ê, ë…).
- **Országonkénti táblastílus:** német sárga, holland kék, lengyel zöld, francia piros keretes, a többi fehér fekete kerettel. A városvégi tábla ugyanilyen, piros áthúzással.
- **Határtábla:** kék, csillagkörös tábla az ország helyi nevével (ÖSTERREICH, ČESKO, POLSKA, NEDERLAND, BELGIË · BELGIQUE, ESPAÑA…), alatta a sebességhatárok. Határátlépéskor üzenet az ország nevével és a határokkal.
- **Valós sebességhatárok:** lakott területen 50, országúton / autópályán: Magyarország 90/130, Ausztria 100/130, Csehország 90/130, Lengyelország 90/140, Németország 100/130 (ajánlott), Hollandia 80/100 (napközben), Belgium 90/120, Franciaország 80/130, Spanyolország és Portugália 90/120, Olaszország, Szlovénia, Horvátország 90/130, Dánia 80/130.

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

**Település-előjelző:** 1,5 km-rel a város vagy falu előtt a jobb oldalon megjelenik a helységnévtábla a település nevével, a távolsággal és a korláttal (50), és a sebességed alapján tanácsot ad: **JÓ TEMPÓ**, **LASSÍTS** (még van idő kíméletesen lassítani) vagy **FÉKEZZ** (már erősen kell fékezni, hogy a táblánál 50 legyen). A település vége előtt 500 méterrel az áthúzott tábla jelzi, mennyivel mehetsz utána (**MAJD 90**). Ha lámpa is jön, a lámpa alatt látszik.

**Sávváltási útmutató:** ha egy lassabb jármű vagy útépítés van előtted a sávodban, halvány, kék, „digitális” szaggatott vonal ível az autó orrától abba a szomszédos sávba, ahol most nincs ütközésveszély (előtted és mögötted sincs ott közeli vagy gyorsabban érkező autó). Először a belső, előzősávot ajánlja. Ha egyik szomszéd sáv sem szabad, piros szaggatott vonal mutatja, hol kell lassítani a jármű mögött.

## 🖼 Album, útinapló, kitüntetések

A főmenüben az **Album és rekordok** gomb (a Szünet menüből is elérhető) mentési helyenként mutatja:

- **Képeslap-album:** minden teljesített szakasz után a célváros képeslapja bekerül az albumba (22 gyűjthető). A még hiányzók kérdőjellel látszanak.
- **Kitüntetések (15):** például Elindultunk!, Félúton, Európa-bajnok, Ezer és Ötezer kilométer, Példás sofőr (szakasz bírság nélkül), Szabálytisztelő, Csillogó autó, Piknikbajnok, Nagybevásárlás, Kerékcserélő, Száguldó család, Képeslapgyűjtő, Teljes album, Egy óra az úton. Ha összejön egy, a játék menet közben szól.
- **Útinapló:** megtett km, teljesített szakaszok (és ebből hány bírság nélkül), hazaérkezések, játékidő, legnagyobb sebesség, elköltött pénz, tankolások, boltlátogatások, pihenők, autómosások, bírságok, kerékcserék, totálkárok.

## ⚙ Beállítások

- **Könnyű mód** (mentési helyenként): kisebbeknek. Nincs sérülés, bírság és fáradás, a család mindig jókedvű.
- **Hangerő** külön: zene, motor, rádió, hanghatások és duda, valamint az **utasok hangja** (0 = felolvasás kikapcsolva). A csúszka húzásakor Anya és Apa bemutatkozik, így hallod, hogy szól-e.
- **Akkukímélő mód:** hosszú autóúton kb. 30 kép/mp és kisebb felbontás, kevésbé melegszik a telefon és tovább bírja az akku.

## 🎬 Főmenü: filmplakát

**v2.34:** a **Folytatás** és az **Új játék** gomb **egymás mellett** van, nagy hellyel köztük (nem lehet véletlenül a rosszat megnyomni; az új játék úgyis rákérdez). Alattuk a **narancssárga Apa garázsa gomb**: benne a **Törésteszt**, az autó adatai, az autó színe, az utazás tempója és a „Ki utazik?” választó. A többi gomb rendezett, négyoszlopos csempékben, a Kilépés a jobb alsó sarokban.

**v2.33.0:** új „📲 APK megosztása” gomb a főmenüben: az alkalmazásban magát az APK-fájlt küldi el (internet nélkül is), böngészőben a letöltési linket.

**v2.32.2:** a címben az ékezetek nem lógnak bele a felső sorba (a sorköz számol az ékezettel).

**v2.32:** üveghatású menü forgó, fénylő kerettel, ikoncsipekkel, rugós belépő animációval, lüktető fő gombbal.

**Mentések (💾 a főmenüben):** három külön utazás (például gyerekenként), mindegyik saját névvel, utazással, képeslap-albummal és rekordokkal. Bármelyik **fájlba menthető** vagy **elküldhető** (pl. Messengeren), és másik telefonon vagy tableten a **Betöltés fájlból** gombbal ott folytatható, ahol abbahagytátok. Így az sem baj, ha a telefon takarítója vagy egy böngészőtörlés kitörli a játék adatait.


**Eltűnő feliratok és autó javítva:** egyes Android-tableteken a Chrome memóriahiánykor elveszi a játék előre megrajzolt képeit (betűk, autó-karosszéria, táj), majd üresen adja vissza. Ilyenkor eltűnt minden szám és felirat, az autóból csak az ablakok és a kerekek látszottak. A játék most ezt észreveszi (azonnal, és biztonságból másodpercenként ellenőrzi), és mindent újrarajzol; a hibanaplóba „Képtárak újrarajzolva” kerül. A memóriahasználat is kisebb: az áttűnő feliratok nem kérnek külön betűképet minden átlátszósági fokhoz, és 4 GB vagy kevesebb memóriájú készüléken a felbontás menet közben nem emelkedik.

**Hibanapló (🩺 a főmenüben és a Szünet menüben):** a játék rögzíti a hibákat (melyik fájl, melyik sor, milyen állapotban: szakasz, sebesség, felbontás), a fontos eseményeket (indulás, szakasz, totálkár, frissítés, háttérbe kerülés, vissza-gesztus), és ha a játék váratlanul leállt (pl. a telefon kevés memória miatt bezárta), a következő indításkor beírja, mikor, mennyi játék után és milyen állapotban történt. A naplót a **Küldés** gombbal el lehet küldeni (pl. Messengeren), vagy **Másolás**sal kimásolni. Menet közbeni hiba sem állítja le a játékot: a hibát naplózza, és fut tovább.


**Új játék / kilépés:** ha van mentett út, a főmenüben a **Folytatás** mellett az **Új játék (teljes újrakezdés)** mindent elölről kezd (pénz, km, költségnapló), előtte rákérdez. A piros **Kilépés** gomb (főmenüben és a Szünet menüben) rákérdez, elment, és bezárja a játékot (ha a rendszer nem engedi az ablak bezárását, egy „Kiléptél” képernyő jelenik meg, onnan a kezdőképernyő gombbal lehet kimenni). Véletlen kilépés ellen: a vissza gomb és az oldalról behúzott vissza-gesztus nem zárja be a játékot, csak megállítja, és szól, hogy a piros gombbal lehet kilépni; a lefelé húzás nem tölti újra az oldalt. (A telefon saját kezdőképernyő-gesztusát egy weboldal nem tilthatja le, de ilyenkor a játék szünetel és ment.)


A plakáton a játékbeli családi autó, benne az egész család, aranyórában a Balaton partján halad a lemenő nap felé: mély kékből narancsba hajló ég, alulról megvilágított felhősávok, a nap fénykoronája és sugarai, légperspektívás hegyek, a tóban csillogó napút és egy vitorlás, a túlparton nyárfasor és falu templomtoronnyal, rét szalmabálákkal, szalagkorlát, az úton elmosott mozgáscsíkok, az autón meleg ellenfény és égő fényszóró.


A főmenü egyetlen álló kép, családi road movie plakát: naplemente csíkos nappal, hegyek, a horizontba futó út, rajta hátulról a családi autó csomagokkal a tetőn, nagy „Családi Vakáció” cím, alcím („Öt ember. Egy autó. 9 600 kilométer.”) és alul a szereplők. A kép egyszer rajzolódik meg, utána a főmenüben a játék nem rajzol képkockákat, így a belépés gyors és sima.

## 📐 Minden kijelzőmérethez

- **Felbontás:** a kijelző valódi pixelszámához igazodik (telefonon 2,5×, gépen 3× renderfelbontásról indul), és csak valódi akadásnál vesz vissza; visszavétel után 15 mp-ig nem emel, hogy ne ugráljon.
- **Széles telefonok (19,5:9):** a kezelőgombok az oldalsó sávokba kerülnek.
- **Tabletek (4:3, 16:10) és összehajtható telefonok:** a kép felül van, minden gomb (pedálok, tempomat, duda, kapcsolók) a lenti sávban, nem takarja a játékot.

## 🛣️ Út közben

Út közben folyamatosan váltakozik a város, a falu, az országút és az autópálya, a táblákon valós településnevekkel (Ács, Bábolna, Sümeg, Mondsee, Beaune…). A sebességkorlátozás is szakaszonként változik: 50, 90/100 vagy 130 km/h. A korlátot nagy, jól olvasható tábla mutatja az út mellett és a műszerfalon is; ha túllépted, a műszerfali tábla sárgán villog.

**Satufék:** erős fékezésnél csak a gumik csikorognak, féknyom marad az úton, az utasok előrebillennek és tágra nyílt szemmel ijednek meg (sikoly nincs). Normál fékezésnél is kicsit előredőlnek.

**„Ki lát előbb…?” játék:** út közben (kb. 1–3 percenként) Anna, Petra vagy Anya megkérdezi: „Ki lát előbb tehenet / lovat / szélkereket / gólyát / hőlégballont / piros autót?” (felolvasva és kiírva). A keresett dolog kicsit később felbukkan az út mellett (a hőlégballon az égen); ha időben rákoppintasz, **+1 szív** jár érte, felcsillan, és a gyerekek örülnek. Ha elhaladtatok mellette, csak megjegyzik, büntetés nincs.

**Autópályán a felső sáv mindig szabad:** oda nem kerül forgalom, és az autópályára érő autók átsorolnak belőle. A radaros rendőr és a segítségre váró autó a padkán áll, a baleset, a dugó és az útépítés a másik két sávot zárja le (útépítésnél: „maradj a felső sávban”). Autópályán nincs vadátkelés (vadháló), és nincs kátyú.

**Kátyú csak városban:** és ott is ritkán (jó úton kb. 2%, rossz úton kb. 12% eséllyel elhelyezésenként); esőben néhol tócsa lehet.

**Élethű forgalom:** a személyautók háromféle karosszériával járnak (ferdehátú, kombi, kis városi terepjáró), mindegyiken ívelt forma, ablakok oszlopokkal, ajtóvonalak, kilincsek, tükör, kerékívek, fényszóró- és hátsólámpa-forma, lökhárítók és fényes tükröződés. Új rajzot kapott a rendőrautó (szedán, kék csík, villogó), a kisbusz (zárt és ablakos), a mentő (sárga-zöld kockás csík, MENTŐ felirat, kék villogó), a lakóautó (alkóv, ablakok redőnnyel, ajtó, tetőklíma, dekorcsíkok) és a traktor (fülke, motorház hűtőráccsal, kipufogó, sárvédők). A karosszériák egyszer, előre rajzolódnak meg, menet közben csak a kerekek forognak, így telefonon sem lassabb.

**Sávváltás:** az autó fokozatosan, ívben sorol át (kb. 1,5 s, lassan hosszabb, havon és esőben óvatosabb), nincs hirtelen rántás. A forgalom többi járműve is így vált sávot.

**Útminőség:** jó, közepes, rossz (kátyús) és macskaköves utak. A futómű rugózik és csillapít: fékezéskor bólint az autó, gyorsításkor leül, kátyúnál megdobja. Nagy sebességnél a kátyúk defektet okozhatnak.

**Élő időjárás:** a célállomás aktuális időjárása (eső, hó, köd, vihar, napsütés) és napszaka az internetről érkezik, az [Open-Meteo](https://open-meteo.com) szolgáltatásból. Internet nélkül a beépített időjárással fut a játék.

## 🏪 Megállók az úton

**Koppints oda, ahol meg akarsz állni:** egy boltra, hipermarketre, trafikra, újságosra, benzinkútra, gyorsétteremre, pihenőre, szervizre vagy autómosóra koppintva (gépen kattintva), vagy a felső haladási sávon az ikonjára, az autó kijelzi a megállást, behúzódik a szélső sávba, odamegy és megáll. Újabb koppintás a megállást törli. Ha a hely már elmaradt, vagy olyan közel van, hogy a sebesség miatt nem lehet biztonságosan megállni, a játék szól.

A megállókat előjelző tábla jelzi („Benzinkút 500 m”), a következők pedig a kijelző alatt is látszanak:

- **Benzinkút (16 termék):** tankolás és bolt: szendvics, hot dog, croissant, energiaital, chips, gumicukor, pótkerék, ablakmosó, motorolaj, illatosító. Autópályán kb. 40 km-enként.
- **Kisbolt (16):** szendvics, kifli, pékáru, joghurt, túrórudi, banán, gyümölcslé, csoki, chips, fagyi, bébiétel, pelenka, popsitörlő.
- **Hipermarket (24):** nagybevásárlás, sajt, kolbász, müzli, pogácsa, bébitej, bébicsomag, naptej, úszógumi, strandlabda, homokozó, mesekönyv, kirakós, plüssmaci, társasjáték, nyakpárna, autós töltő, munka a zöldségesnél.
- **Trafik (12):** kaparós sorsjegy (1x, 4x, 10x), csoki, kártya, autósújság, kulcstartó, napszemüveg, matrica.
- **Újságos (12):** gyerekújság, képregény, színező, matricás könyv, mesekönyv, rejtvény, autós térkép, útikönyv, képeslap, hűtőmágnes, napilap.
- **Burger Pont (16):** sajtburger, duplaburger, csirkewrap, hot dog, saláta, hagymagyűrű, palacsinta, muffin, limonádé, gyerekmenü, családi menü.

**Boltban felolvasás:** belépéskor Apa bemondja a boltot („Hipermarket. Mit vegyünk?”), vásárláskor Anya felolvassa a terméket, az árát és a megjegyzést („Naptej, 3 990 forint. Naptej bekészítve, jöhet a strand!”); ha a gyerekek kedve javul, utána Anna megköszöni.

A boltokban 8 termék látszik egyszerre; a fejléc **◀ 2/3 ▶** gombjaival (billentyűzeten a sávváltó gombokkal) lehet lapozni.

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

**v2.32: részletesebb, zónás sérülés.** Az autó többet kibír (egy ütközésnek a 60%-a számít), és külön sérül az **eleje** (ráfutás, vadbaleset), az **oldala** (sávváltás közben nekimenni a mellettünk haladónak: horpadt, gyűrt ajtók, lepattant fényezés, betört oldalablak, leszakadt tükör) és a **hátulja** (ha hirtelen fékezel, a mögöttünk jövő belénk szalad: gyűrt csomagtérajtó, törött hátsó lámpa, lelógó, szikrázó hátsó lökhárító). Ütközéskor üvegszilánkok, műanyag- és fényezésdarabok repülnek.

**Kiszakadó kerék:** nagy ütésnél (főleg ha az a rész már sérült) leszakadhat egy kerék: elgurul, pattog és eldől, az autó azon a sarkán lebukik, a kerékagyon csúszva szikrázik, és legfeljebb 25 km/h-val megy.

**Sárga SOS gomb (Z / Y billentyű):** a felső sávban, bármikor hívható autómentő. Pulzál, ha nagy a baj (30% alatti állapot, leszakadt kerék, defekt pótkerék nélkül, üres tank). Megmutatja az állapotot zónánként, és ajánlja a segítséget: **tréler a szervizbe** (50 000 Ft, a javítás a sérült zónák szerint), **kerék visszaszerelése** (65 000 Ft), **defektjavítás** (40 000 Ft), **benzin** (10 liter, 25 000 Ft), **gyorsjavítás** (+25%, legfeljebb 85%, 30 000 Ft) vagy **átnézés**. A szervizautóból kiszálló szerelő odasétál és megcsinálja.

Erős ütközésnél kinyílik a **légzsák**, és leeresztve ott lóg a javításig. A sérült autó lassabb: 50% alatt max. 120, 30% alatt 80, 15% alatt 50 km/h.

**Totálkár (0%):** a kép egyszer, röviden megremeg, aztán jön a **tréler** (50 000 Ft). A billenő plató hátracsúszik és lebillen a földig (nem megy át a tréler kerekein), a csörlő felhúzza rá az autót, amelynek kerekei végig a platón gördülnek, majd a plató visszabillen, és elviszi a legközelebbi **szervizbe 1 km-rel hátrébb**. Ott megjavítják: karosszéria és fényezés 186 000 Ft, fényszóró, lökhárító, tükör 46 500 Ft, légzsák 118 000 Ft. Utána a szerviztől folytatódik az út. Minden tétel bekerül a költségnaplóba.

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
| Gyors | 1 490 Ft | előmosás, öblítés |
| Alap | 2 490 Ft | + forgókefés mosás, szárítás |
| Prémium (ajánlott) | 3 990 Ft | + aktív hab, meleg viasz (+1 kedv) |
| Extra | 5 490 Ft | + alvázmosás, felnikefe, polírozás (+1 kedv) |

**Extrák** (a program előtt kapcsolhatók, billentyűzeten 5–8): **Rovarmosó** (590 Ft), **Felnikefe** (690 Ft, forgó sárga kefe a kerekeken), **Kerámia bevonat** (1 490 Ft: 800 km-ig sokkal lassabban piszkolódik), **Porszívó** a belsőnek (1 990 Ft, +1 kedv). Új animációk: futófény a kapun, vizes padló, csöpögő víz, gőzölgő viasz, csillogó kerámia, alvázmosó sugarak.

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
- 🎟️ **Kaparós sorsjegy:** ujjal vagy egérrel kell lekaparni. Ha nyer, igazi ünneplés jön: konfettiágyúk lőnek a kártya két oldaláról, felhangzik az ujjongás és a tapsvihar, a telefon rezeg, és a család felkiált („Hurrá! Nyertünk!”, „Juhú!”). A nagy nyereménynél (20 000 Ft-tól) több a konfetti, hosszabb a taps, és Apa is megszólal.
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
- **Defekt:** a kerék valóban lapos lesz (a felni leül, a gumi alul szétnyomódik), az autó azon a sarkon megroggyan, menet közben puffog és ráz. Állj meg a szélső sávban, és Apa végigcsinálja a kerékcserét: kiszáll, elhátrál a háromszöggel, kiveszi a pótkereket és az emelőt, letérdel, csavarkulccsal lazít, felpumpálja az autót, leveszi a lapos kereket, felteszi a pótkereket, meghúzza a csavarokat, leengedi az autót, elrakja a kereket, visszahozza a háromszöget és visszaül (kb. 13 mp). Pótkerék nélkül autómentőt kell hívni. A defekt ritka: kátyúnál jó úton kb. 3%, rossz úton kb. 7% az esélye (gyorsabban nagyobb), vadbalesetnél 15%, és egy defekt után legalább 10 percnyi vezetésig nem jön újabb.
- **Traffipax**, **piros lámpa**, **dugó**, **útépítés**, **őz az úton**.
- **Kifogyott a benzin:** az autómentő hoz 10 litert.

## 💥 Törésteszt (Apa garázsa)

Ütközésvizsgáló csarnok a családi autóval, a bevett biztonsági vizsgálatok mintájára: mérőcsíkos fal, nagysebességű kamerák, betontömb méhsejt-alumínium homlokkal. A székekben **törésteszt-bábuk** ülnek (sárga fej, fekete-sárga célkör, biztonsági öv, a gyerekek ülésmagasítóban).
- **Három teszt:** frontális ütközés részleges átfedéssel (64 km/h), teljes szélességű merev fal (50 km/h), hátulról ütközés mozgó akadállyal (50 km/h). Automata módban a sebesség 30 és 130 km/h között állítható.
- **Látványos törés:** visszaszámlálás után az autó nekifut, az ütközés **lassított felvételen** látszik (ezredmásodperc-számlálóval, vakuvillanásokkal). Az autó eleje (nagy sebességnél az utastér is) összegyűrődik, a motorháztető felgyűrődik, a szélvédő megreped, kinyílik a légzsák, a bábuk feje előrecsapódik (hátsó ütközésnél hátra: ostorcsapás), üvegszilánkok, fényezés- és műanyagdarabok, szikrák repülnek, leesik a lökhárító, gőzöl a hűtő, folyadékfolt lesz a padlón; nagyon gyorsan a kerék is leszakad és elgurul.
- **Saját vezetés (v2.35):** az autót te vezeted a falnak egy **300 méteres nekifutópályán** (a kamera követi, 10 méterenként jel, 50 méterenként tábla, rajtvonal). Gáz: jobb nyíl / D, fék: bal nyíl / A, telefonon a GÁZ és FÉK pedál; Esc = megszakítás. Valós menetfizika: 96 kW, 1 450 kg, **6 fokozat** (kapcsoláskor rövid vonóerő-kiesés), légellenállás, motorfék, **ABS-fék** (9,2 m/s²). Gyorsításkor az autó orra megemelkedik, fékezéskor bebólint, a fékezés halvány féknyomot hagy. Teljes gázzal kb. 120 km/h-val éred el a falat. Az ütközési sebességet a fal előtt 1 m-rel álló **fénykapu** méri, és ebből számol az értékelés. Az **Automata** mód (a vontatórendszer pontosan a beállított sebességgel viszi az autót) is megmaradt.
- **Gyorsulás hangja:** a motor fordulatszáma a sebességből és a fokozatból jön, hallani a felpörgést, a **fokozatváltást** (a fordulat leesik), visszaszámláláskor üresben a gázfröccsöt, fékezéskor a gumik sziszegését. Ütközéskor leáll a motor. A műszer mutatja a sebességet, a fokozatot, a fordulatszámot és a fal távolságát.
- **Fékpróba:** ha a fal előtt 8 méteren belül megállsz, nem lesz ütközés, hanem fékpróba-értékelés: hány centire álltál meg, milyen sebességről kezdtél fékezni, mekkora lett a fékút, és mennyi utat tettél volna meg 1 másodperc reakcióidő alatt fékezés nélkül. A legközelebbi megállás megmarad.
- **Öv nélküli teszt:** az „Öv ki” gombbal a bábuk biztonsági öv nélkül ülnek. Ütközéskor nem tartja meg őket semmi: a műszerfalnak és a szélvédőnek csapódnak, a szélvédő betörik, és az értékelés is sokkal rosszabb. Így látható, miért kell mindig bekötni magunkat.
- **Valósághűbb mérések:** **lassulásgörbe** (g az idő függvényében, lassított felvételnél a görbe az ütközéssel együtt rajzolódik), valós időtartam (kb. 60–80 ms) és gyűrődési út. A csúcslassulás a sebességből és a gyűrődési útból számolódik (64 km/h-nál kb. 37 g). Kiírja az **ütközési energiát**, és hogy ez hány méteres zuhanásnak felel meg (64 km/h ≈ 16 m, kb. ötödik emelet). Kis sebességnél alig van törmelék, gőz és folyadékfolt.
- **Beállítás menü (v2.36):** a törésteszt alsó sora egyszerűbb lett (Indítás, Ismétlés, teszt, ⚙ Beállítás, Főmenü), a ⚙ Beállításban van a vezetési mód, a sebesség (automatánál), az öv, az útburkolat és a csomag.
- **Útburkolat:** száraz, vizes vagy jeges-havas. A tapadás a fékutat és a gyorsítást is befolyásolja (ABS-szel kb. 9,2 / 6,6 / 2,9 m/s²): 80 km/h-ról szárazon kb. 25 m, vizesen kb. 33 m, jeges úton kb. 69 m a fékút (ehhez jön még a reakcióidő alatt megtett út). A padló vizesen csillog, jegesen fehér.
- **Csomag:** +180 kg (tetőbox és bőröndök). Az autó lassabban gyorsul, ütközéskor nagyobb az energia és a gyűrődés, a **rögzítetlen bőrönd** pedig a csomagtartóból előrerepül a gyerekülések háttámlájának, ezért a gyermekvédelem pontszáma csökken.
- **Visszajátszás közeli kamerával:** az eredmény után az „Ismétlés” gombbal az ütközés újra lejátszódik, még lassabban, 1,8-szoros nagyításban (az értékelés nem változik).
- **Röntgen (v2.41, v2.42):** a ⚙ Beállításban bekapcsolva a karosszéria átlátszó, és látszik a hajtáslánc. A hűtő, az alváz és a lemezek gyűrődnek, a **motorblokk és a váltó merev**: nem nyomódik össze, hanem egyben tolódik hátra, nagy sebességnél a tűzfalon át az utastér felé. Frontálisan szétreped a hűtő, megsérül a motor (64 km/h-nál részben, 80-nál erősen, és nagy sebességnél eltörik a motortartó, a motor megsüllyed), eltörik és leng a féltengely, megreped a váltóház, nagyon erős ütésnél tönkremegy az akkumulátor. Hátulról ütközve összenyomódik a kipufogódob, megsérül a tank és a hátsó futómű. Ütközés után a motor leáll.
- **Élethűbb törés (v2.39):** az első kerék a gyűrődéssel hátratolódik és feljebb csúszik, a futómű elgörbül (a kerék megdől), nagy sebességnél a gumi szétdurran (hátsó ütközésnél a hátsó). A sérült motortérből olaj, hűtőfolyadék és ablakmosó-folyadék csöpög, nagyon erős ütésnél (és hátsó ütközésnél) a benzintank is szivárog. A cseppekből a padlón színes tócsák terülnek szét. Nagy sebességnél az A-oszlop megtörik, a tető felgyűrődik, és a B-oszlop is meggyűrődik.
- **Csillagos értékelés (0–5):** felnőtt és gyermek utasok védelme, biztonsági rendszerek százalékban, bábu-ábra testtájanként színezve (zöld = jó … piros = rossz), lassulás, fejsérülési érték (HIC), utastér-behatolás. A legjobb eredmény tesztenként és sebességenként megmarad.

## 🔨 Roncsoló műhely (Apa garázsa, v2.37)

Az Apa garázsából (vagy a törésteszt „Roncsolás” gombjával) nyílik. Az üres autó (a bábukat kivették) a csarnokban áll, és tizenegy eszközzel lehet szétszedni. Az eszközök a bal oldali gombsorban vannak (v2.38: javítva, hogy a gombsor gombjai, az Új autó és a Vissza is működjenek).
- **Kalapács:** koppintásra horpadás, sokadik ütésre ugyanott kiszakad a lemez. Az ablak megreped, majd kitörik.
- **Bontógolyó:** a lengő golyó oda csapódik, ahová koppintasz: nagy horpadás, kitört ablakok, és ha a rész már gyenge, kiszakad.
- **Ágyú:** az acélgolyó átlyukasztja a lemezt (kifelé hajló, szakadt szélű lyuk), a kereket kidurrantja.
- **Flex:** az ujjat az autón húzva a vágókorong szikrázva átvágja a fémet.
- **Lángvágó:** egy helyen tartva a fém felizzik (vörös, narancs, sárga, végül fehéren izzik), **megolvad**, a lyuk nő, az olvadt fém izzó cseppekben a padlóra csöpög, és ott izzó, majd kihűlő tócsa lesz. Kihűlés után kékes-barnás hőszíneződés marad.
- **Lézer:** húzva izzó vágást hagy, és közben olvasztja a fémet.
- **Prés:** a hidraulikus prés lenyomja az autót. Közben kitörnek az ablakok, és a fém meggyűrődik. Újabb koppintásra felemelkedik.
- **Lőfegyverek (v2.38):** **Pisztoly** (koppintás: kerek golyónyom lepattant festékkel, az üvegen pókhálós repedés, sok találatra kitörik, a gumi kidurran), **Sörétes puska** (egy lövés 9 sörét egy csomóban, utána csőretöltés hangja), **Géppuska** (nyomva tartva és húzva sorozatlövés). A fegyver jobbra lent a néző oldalán látszik, a célpont felé fordul, torkolattűz, nyomjelző lövedék, kirepülő és a padlón csilingelve pattogó hüvelyek, időnként golyó-lepattanás hangja.
- **Robbantás:** a töltet villogva, gyorsuló sípolással 1,5 másodperc múlva felrobban: kormos égésnyom, horpadások, tűz és füst. A közeli részek leszakadnak és elrepülnek.

**Hő- és fagykamra (v2.42):** a „Klímakamra” gombbal az autó köré szigetelt kamra kerül, a jobb felső panelen -80 és +800 °C között állítható (-20 / +20 / -80 / +800). A kamra levegője gyorsan, az autó lassabban követi. Kikapcsolva az autó visszaáll szobahőmérsékletre.
- **Fagyás:** dér lepi el a karosszériát és az üveget, jégcsapok nőnek az alján, a kamra falai deresek. -30 °C alatt az akku nem bírja: a motor leáll, és nem is indul. -40 °C alatt megfagy a hűtőfolyadék, és szétrepeszti a hűtőt. **-35 °C alatt rideg lesz a fém:** ütésre nem horpad, hanem pókhálósan megreped, forgácsok pattannak ki, sokkal könnyebben törik, és a leszakadó rész nem egyben esik le, hanem **szilánkosra törik**.
- **Olvadás:** melegítéskor a jég elolvad, a jégcsapokról csöpög a víz, alul víztócsák lesznek, a ridegség megszűnik.
- **Hő:** 110 °C-on felforr a hűtőfolyadék, 120 °C-tól **olvad a műanyag** (a lökhárítók és a lámpák lecsöpögnek), 150 °C-tól **ég a fényezés** (megbarnul, felhólyagzik), felfúvódik az akku. 200 °C-on füstölnek, 320 °C-on meggyulladnak a gumik. 280 °C-on berobban a benzingőz a tankban. 300 °C-tól repednek az ablakok. 500 °C fölött **vörösen izzik az acél**, 660 °C fölött **megolvad az alumínium** motorblokk és váltóház, és lecsöpög. Az elszíneződés és az olvadás nyoma megmarad.

**Hajtáslánc külön rétegben (v2.41, v2.42):** a karosszéria alatt külön réteg van, a karosszéria körvonalához vágva (semmi nem lóg ki; a motor a motorháztető alatt, a hűtő a hűtőrács mögött, tűzfal választja el az utastértől), hátulról előre: utastér (ülések, műszerfal, kormány), alváz, hátsó futómű tekercsrugóval, benzintank, kipufogó (leömlő, katalizátor, közép- és hátsó dob), váltó (alumínium harangház, differenciálmű), féltengely csuklóvédő gumikkal, motor (blokk, hengerfej piros szelepfedéllel, olajteknő, szívócső, ékszíj, generátor, ventilátor), hűtő, akkumulátor. Erre jön rá a karosszéria. A lyukakon, levágott és leszakadt részeken át látszik, a **Röntgen** gombbal pedig átlátszik a karosszéria.
- **Járó motor:** a műhelyben az autó alapjáraton jár (Motor gomb: be/ki): forog az ékszíj és a ventilátor, remeg a motor, a kipufogóból füst jön, hallani a motort.
- **Minden alkatrész külön sérül, saját életerővel.** Az ép lemez véd (a sérülés kb. harmada jut át), a golyó és a robbanás átüti. A **motor** megsérülve füstöl és akadozva jár, majd kilyukad az olajteknő (folyik az olaj), végül kilyukad a blokk, kilóg a hajtókar, és leáll. A **hűtő** lyukasan gőzöl, folyik a hűtőfolyadék, és a járó motor túlmelegszik. A **váltóház** megreped (folyik a váltóolaj), majd szétreped, kilátszanak a fogaskerekek. A **féltengely** eltörik, és a fele lengve lóg. A **kipufogó** lyukas lesz (érdesebb hang), majd leszakad és leesik (hangos motor). Az **akkumulátor** szikrázva tönkremegy, a motor leáll, és nem is indul többé. A **benzintank** lyukasan szivárog. A **hátsó rugó** eltörik, és az autó megroggyan. Az **alváz** megtörik.
- **Kieső motor:** ha az autó eleje leszakadt és a motor tönkrement, a motor kiesik a padlóra.

**Élethűbb sérülések (v2.39):**
- **Gyűrődés:** a horpadásoknak fényes felső és árnyékos alsó pereme van (térhatás). A nagy ütések (bontógolyó, robbantás, sok kalapácsütés a szélen) a **körvonalat is benyomják**: a tetőn, az orron vagy a farán behorpad a karosszéria széle, körülötte gyűrődési ráncokkal.
- **Defekt:** a golyó csak kilyukasztja a gumit, ami **sziszegve, lassan ereszt le**, és az autó arra az oldalra fokozatosan lesüllyed. Az ágyú, a flex, a lézer és a robbanás szétdurrantja a gumit.
- **Futómű:** az ütés (kalapács, bontógolyó, robbanás) **elgörbíti a futóművet**: a kerék megdől, a kerékívbe tolódik, és a felni is behorpad.
- **Folyadékok:** hat tartály van: motorolaj, hűtőfolyadék, fékfolyadék, ablakmosó-folyadék, váltóolaj és benzin (a hátsó ülés alatt). Ha egy sérülés eléri, **csöpögni kezd**, a cseppekből a padlón szétterülő, saját színű tócsa lesz (az olaj fényes, a benzin szivárványos). Ha a tartályt tartalmazó rész leszakad, a folyadék kiömlik.
- **Benzintűz:** a benzintócsát meggyújthatja a láng, az izzó fém, az olvadt csepp, a szikra vagy a robbanás. A tócsa ilyenkor füstölve ég, és melegíti az autó alját.

**Szakadás:** az autó öt részből áll (eleje, hátulja, tető, két ajtó), mindegyiknek van életereje. Ha elfogy, a rész **töredezett széllel leszakad**, leesik, a magas darabok eldőlnek a padlón. A kerék kidurranhat, majd leszakadhat, ilyenkor a karosszéria arra az oldalra lesüllyed. A sarokban látszik a kár forintban és a leszakadt részek száma. Az „Új autó” gomb hoz egy épet.

A sérült autó egyetlen képbe van rajzolva, minden sérülés egy rajzművelet rajta, így telefonon is gyors.

## 🚦 Forgalom

Minden jármű valós méretarányban, részletesen kidolgozva látszik (v2.34: új, szebb távolsági busz panorámaablakokkal, utasokkal, lendületes festéssel, csomagtérajtókkal és ívelt szélvédővel; háromféle nyerges kamion: ponyvás, hűtős és tartályos, terelős fülkével, kipufogókéménnyel, oldalsó aláfutásgátlóval, jelzőfényekkel; a nagy járművek előre megrajzolt képből rajzolódnak, így gyorsabbak. A mellettünk haladó hosszú kamion előzéskor sem tűnik el, és takaráskor is csak kicsit lesz áttetsző; a motoros bukósisakban, idomos géppel; a tréler fényhíddal és lebillenő platóval) a családi autóhoz képest: kisautó, rendőrautó, mentő, furgon, lakóautó, busz (12 m), kamion (16,5 m), traktor és motor.

Előfordulhat **baleset** az úton (rendőr, mentő, lezárt sáv). Nagyon ritkán pedig **helyi rendőr** ér utol szirénával: le kell húzódni és megállni, ilyenkor jön az igazoltatás.

## 🦌 Vadállatok

Az állatok **csak sötétben** jönnek elő: alkonyattól (napnyugta után) egészen reggel 6 óráig. Nappal és a naplemente fényeiben nincs állat az úton. Élő időjárásnál a város valós helyi ideje számít. Országúton és falvak mellett őz, vaddisznó, róka és mezei nyúl kel át az úton; „Vadveszély” táblák figyelmeztetnek. Az őz éjjel megbénul a fényszóróban, a nyúl cikázik. A duda elriasztja őket. Ha elütsz egy nagy vadat (őz, vaddisznó), az javítási költséggel (kb. 35–70 ezer Ft) jár, és nagy sebességnél defektet is okozhat. Éjjel a falvakban birka és tehén is átballaghat.

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
- **Rádió:** öt állomás saját szerzésű zenével. Az első az **Országút Rádió**: lendületes, napsütéses országúti rock (150 BPM, boogie basszus, torzított gitárriffek, gitárdallam és taps a refrénben, gitárszóló húzásokkal, 32 ütemes körben), igazi „indulunk!” zene. Utána: Retro FM, Rock Rádió, Pop Hullám, Esti Lounge.
- **Motorhang:** négyhengeres motor, fordulatszám és terhelés szerint változik.
- **Mini műszerfal:** sebességmérő, fordulatszámmérő, fokozat, üzemanyagszint, sebességkorlátozás, átlagfogyasztás és visszajelző lámpák.

## 🎮 Irányítás

Érintőképernyőn bal alul vannak a **SÁV ▲ / SÁV ▼** sávváltó gombok (sávváltás-ikonnal), mellettük függőleges oszlopban a **világítás (HELYZ/TOMP/TÁV), vészvillogó és rádió** gombja, fölöttük a kormány (duda). Jobb oldalon: GPS, tempomat, kézifék, fék- és gázpedál.

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
- **Betűatlasz és memóriatakarítás (váratlan leállás javítása):** a betűk színenként és méretenként egyetlen közös képben (atlaszban) vannak, nem betűnként külön kis képben. Felbontásváltáskor minden régi kép (betűk, feliratok, tárgyak, tájsávok, autó) törlődik, és a kidobott képek grafikus memóriája azonnal felszabadul. Korábban egy telefonon 1 276 külön betűkép gyűlt össze, és a rendszer emiatt leállította a játékot. Mérve: 6 szakasz és 10 felbontásváltás után a memóriában maradt képek száma 2 043 helyett 84, a méretük kb. 150 helyett 44 MB.
- **Előre megrajzolt autó:** a családi autó karosszériája, eleje és lámpái színenként és koszosság szerint egyszer megrajzolt kép, a tényleges nagyításon (nagyban sem elmosódott); az utasok, a kerekek és a fények élőben mozognak.
- **Előre megrajzolt táj:** telefonon nem a felbontás, hanem a képkockánkénti apró rajzolási műveletek száma a lassú. Ezért a házak, fák, templomok, kutak és minden út menti tárgy egyszer megrajzolt képként, a városi háttér-sziluett és a mezősáv képernyőnyi csempékben készül el, és menet közben csak ezek a képek mozognak (éjjel az ablakfények is megmaradnak). A műszerfal is egy képbe rajzolódik, és 30-szor frissül másodpercenként. Eredmény: városban képkockánként kb. 2 300 helyett kb. 350, országúton kb. 940 helyett kb. 480 rajzolási művelet. A régi képek vásznait újrahasznosítja, így nem keletkezik folyton új.
- **Sima mozgás 60/90/120/144 Hz-en is:** a játék 60 lépést tesz másodpercenként, a kép a kijelző frissítéséhez igazodik (60 Hz-en 60, 90 Hz-en 90, 120 Hz-en 60, 144 Hz-en 72 egyenletes kép/mp, akkor is, ha a telefon menet közben váltogat), és két lépés között az út, a járművek és a sávváltás helyzetét arányosan kiszámolja. Így gyors menetben sem rángat a kép (korábban a nagy frissítésű kijelzőkön a képek egyenetlen ütemben jöttek, ez tűnt akadásnak).
- **Rossz úton** a kép egyenletesen, finoman rezeg, nem véletlenszerűen ugrál képkockánként; a kerekek forgása is folyamatos.
- **Teljesítménymérő:** a Szünet menüben bekapcsolható; a kép tetején mutatja a kijelző frissítését (Hz), a kép/mp-t, a felbontást, a rajzolási időt, a leghosszabb képközt és az akadások számát.
- **Akadásfigyelés:** csak a valóban késő képkocka számít akadásnak (két kép között több mint 26 ms). A telefonok saját 60/120 Hz-es váltogatása nem, így a játék nem veszi vissza feleslegesen a minőséget. Ritkán és csak egy-egy lépést vált (minden váltás újraépíti a képtárakat); ha egyszer vissza kellett vennie, utána nem próbál feljebb lépni. Nincs többé fél sebességű (30 kép/mp) mód.
- **Letöltés a főmenüben:** a főmenübe érve a telefon azonnal letölti magának a teljes játékot; a főmenü alján látszik, ha kész („✓ teljes játék letöltve, offline is megy”). Utána internet nélkül is indul és végigjátszható.
- **Hangok egyetlen zajmintából:** a döccenés, csattanás, mennydörgés és a rádió dobjai (lábcin, pergő) egyetlen, egyszer elkészített zajmintát játszanak le, nem gyártanak minden hangnál új mintát (rádiózás közben ez másodpercenként több tucat volt).
- **Nincs fölösleges oldalfrissítés:** a gombok feliratai csak akkor íródnak újra, ha tényleg változnak.
- **Gyenge telefonon:** egyszerűbb díszítés, a kijelző minden 3. képkockán rajzolódik újra, végső esetben 30 kép/mp rajzolás 60-as játéklogikával.
- **A telefonhoz igazodik:** a processzormagok száma és a memória alapján választ kezdő minőséget (2 GB alatt rögtön takarékos mód); figyeli a hosszú, akadó képkockákat is, és ha ilyen többször előfordul, azonnal visszavesz. Erős telefonon élesebb felbontásban rajzol (a kijelzőnél soha nem többet), gyengébbnél automatikusan visszavesz a felbontásból és az effektekből, és ha újra van tartalék, visszaemeli.

## 📱 Telepítés, megosztás, frissítés

**Android-alkalmazás (APK) – a legbiztosabb út, ha a telepített ikon nem indul:** töltsd le innen: https://github.com/strattila90-hue/Ede-kaland-/releases/download/apk/csaladi-vakacio.apk, koppints a letöltött fájlra, engedélyezd az „ismeretlen forrásból” telepítést, és telepítsd. Az alkalmazás a Chrome-tól független, a teljes játék benne van, ezért **első indításkor is azonnal offline** megy. Az utasok hangját a telefon saját felolvasója adja, a mentés a Letöltések mappába kerül, a Frissítés gomb az új APK-t tölti le (a régire rátelepíthető, a mentés megmarad). **Háttérfrissítés (v2.30-tól):** az alkalmazás indításkor és óránként magától letölti az új verziót a háttérben, és csak szól: „Frissítés kész”. A következő indításkor már az új verzió fut, vagy a Frissítés gombra koppintva azonnal átvált (a mentés megmarad). Ha magát az alkalmazás-keretet kell cserélni (ritka), az új APK-t is a háttérben tölti le, és egy koppintással telepíthető (az Android ezt a telepítést mindig jóváhagyatja). Az APK-t a GitHub minden feltöltéskor magától felépíti (`.github/workflows/apk.yml`, forrás: `android/`). Az alkalmazás mentése külön van a böngészős játékétól: átvinni a Mentések → fájlba mentés / betöltés gombokkal lehet.

**Ha telepítés után az ikon nem indul:** töröld az ikont, nyisd meg a linket a Chrome-ban, ⋮ menü → „Hozzáadás a kezdőképernyőhöz” → **„Parancsikon létrehozása”** (nem „Telepítés”). Ez minden telefonon működik, a játékot a Chrome-ban nyitja meg, és így is offline megy: az első megnyitáskor a játék magától letölti magát. A telepítési leírás (manifest) teljes képernyőt kér, de ha a telefon azt nem támogatja, sima alkalmazás-ablakban indul.

**Biztonságos frissítés:** a játék előbb minden új fájlt letölt és méret szerint ellenőriz, és csak akkor cseréli le a régieket, ha mind megjött és mind az új verzióé (a GitHub Pages feltöltés után pár percig vegyesen adhat régi és új fájlt; ilyenkor később újrapróbálja). A frissítéshez kért fájlokat a játék mindig a hálózatról tölti, sosem a saját tárolt régi példányából (v2.21.2 előtt ez a hiba miatt a frissítés minden próbálkozáskor elakadt). Ha a letöltött fájlok így sem egyeznek, a háttérben futó offline kezelő (service worker) magától letölti az új verziót, végső esetben a játék a mentés megtartásával tisztán újratelepíti magát. Ha mégis keveredés miatt nem indulna el a menü, a játék egyszer magától tisztán újratölti magát; a menü akkor is megjelenik, ha az oldal és a szkriptek verziója eltér.

**Telepítési ablak:** magától csak egyszer jelenik meg, amikor valaki először nyitja meg a megosztott linket az adott készüléken; utána a főmenü mindig szabad, telepíteni a főmenü Telepítés gombjával lehet. A link telepítés nélkül is mindig közvetlenül a játékot nyitja meg. **Xiaomi / Redmi / POCO:** ha a telepített ikon nem indul, az a rendszer tiltása (a Chrome „Kezdőképernyő-parancsikonok” és „Felugró ablakok megjelenítése háttérben futás közben” engedélye); a magyarázat a telepítési ablak alján, egy koppintásra nyílik le. A Xiaomi saját böngészőjéből a játék felajánlja a megnyitást Chrome-ban.

A főmenüben bal oldalt három gomb van:

- **⬇ Telepítés:** a kezdőképernyőre teszi a játékot. iPhone-on Safariban: Megosztás, majd „Főképernyőhöz adás”.
- **↗ Megosztás:** elküldi a játék linkjét.
- **📲 APK megosztása:** az Android-alkalmazásban magát a telepített APK-fájlt küldi el (Quick Share, Bluetooth, Messenger, e-mail…), így a másik telefonra internet nélkül is átkerül; ott a fájlra koppintva telepíthető. Böngészőben (és a régebbi alkalmazásban) az APK letöltési linkjét küldi el.
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
