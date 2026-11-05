# 🚐 Családi Vakáció

Vidám, oldalnézetes **pixel art** családi autós játék. A család kékesszürke egyterűjével indul el Budapestről, és bejárja Európát: autópályákon, városokon és falvakon át, napsütésben, esőben, hóban, ködben, éjszaka és viharban.

Az egész játék **egyetlen `index.html` fájl** – nincs szükség telepítésre, külső képekre vagy könyvtárakra. Minden grafika és hang kódból készül.

## 🗺️ Az útvonal – 8 állomás

| # | Állomás | Helyszín | Időjárás |
|---|---------|----------|----------|
| 1 | Balaton | autópálya | napsütés |
| 2 | Balatoni falvak | falu | eső |
| 3 | Bécs | város | borult ég |
| 4 | Alpok | hegyi út | havazás |
| 5 | Velence | tengerpart | köd |
| 6 | Párizs | város | csillagos éjszaka |
| 7 | Provence | falu | vihar, alkonyat |
| 8 | Budapest | autópálya | naplemente |

Minden állomás végén képeslap készül az úti célról.

## 🚐 A családi autó

Saját tervezésű, hétüléses egyterű tetőboxszal és krómkeretes ablakokkal. A lámpák LED-es fénycsíkok, a felni hatküllős.
A címképernyőn az autó körbefordul, és öt nézetből látható: bal és jobb oldal, elöl, hátul, felülről.
Közben nyílnak az ajtók, forognak a kerekek, villog az irányjelző, felvillan a féklámpa, mennek az ablaktörlők.
A színe a főmenüben választható: kékesszürke, pezsgőarany, piros, fehér, éjkék vagy fekete.
Minden állomáson megérkezéskor kinyílnak az ajtók, a család kiszáll és integet a táblánál.

**Autós funkciók:**
- **Lámpák:** fényszóró (L), első és hátsó ködlámpa (F), féklámpa, irányjelző sávváltáskor, vészvillogó megálláskor.
- **Ablaktörlő:** esőben és hóban magától jár.
- **Tankolás:** minden állomás felénél benzinkút van. Állj meg a felső sávban a kútnál: kinyílik a tanksapka, apa kiszáll és teletankol.
- **Defekt:** kátyúba vagy kőbe hajtva kidurranhat a kerék. Az autó ilyenkor lassabban megy és dübörög. Fékezz le teljesen, és apa emelővel kicseréli a kereket.

## 🎮 Irányítás

| Billentyű | Mobil gomb | Funkció |
|-----------|-----------|---------|
| → / D | GÁZ | gyorsítás |
| ← / A | FÉK | fékezés, megállás |
| ↑ ↓ / W S | ▲ ▼ | sávváltás |
| Space | UGRÁS | ugrás (bóják, kátyúk, magasan lebegő tárgyak) |
| H | DUDA | dudálás – az állatok elszaladnak, az autók félreállnak |
| L | 💡 | fényszóró be/ki |
| F | KÖD | ködlámpa be/ki |
| P / Esc | II | szünet |
| M | ♪ | zene be/ki |

Mobilon fektesd el a telefont!

## ⭐ Játékmenet

- **Kedv (♥)**: minden ütközés egy szívet visz el. Ha elfogy, az állomás újraindul.
- **Benzin**: fogy menet közben – szedd fel a piros kannákat!
- **Fagyi**: visszaad egy szívet.
- **Fényképezőgép / ajándék**: emlékeket gyűjt.
- Esőben és hóban csúszósabb az út, a pocsolyák lelassítanak.
- A haladás automatikusan mentődik (a böngészőben).

A család – apa, anya, két gyerek és a kutya – menet közben folyamatosan beszélget. 😄

## 🚀 Feltöltés GitHubra és közzététel (GitHub Pages)

1. Hozz létre egy új repót a GitHubon, pl. `csaladi-vakacio` néven.
2. Töltsd fel az `index.html` és a `README.md` fájlt (**Add file → Upload files**).
3. Menj a **Settings → Pages** menübe.
4. A *Source* alatt válaszd: **Deploy from a branch**, branch: `main`, mappa: `/ (root)` → **Save**.
5. Egy-két perc múlva a játék elérhető lesz itt:
   `https://<felhasználóneved>.github.io/csaladi-vakacio/`

Helyben is kipróbálható: elég duplán kattintani az `index.html` fájlra.

## 🛠️ Technika

- HTML5 Canvas, 480×270-es belső felbontás, éles (pixelated) nagyítással
- Az autó öt nézetből rajzolva és animálva: bal és jobb oldal, elöl, hátul, felülről (forgó kerekek, rugózás, irányjelző, féklámpa, ablaktörlő, fényszóró, utasok)
- Parallax hátterek, időjárás-részecskék, éjszakai fények
- Chiptune zene és hangeffektek Web Audio API-val
