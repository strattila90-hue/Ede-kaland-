# Contributing / Közreműködés

## English

Thanks for helping! The project is plain HTML + classic `<script>` files: no build step, no package manager.

**Run locally**

```bash
python3 -m http.server 8765   # then open http://localhost:8765/index.html
```

**Checks before a pull request**

```bash
for f in js/*.js; do node --check "$f" || echo "ERROR: $f"; done
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers   # wherever your Playwright browsers are
python3 tests/flash.py     # ~15 s, expected: black 0, ERR []
python3 tests/devices.py   # ~1 min, expected: every "overlap" empty
```

Gameplay changes should also pass `python3 tests/soak.py` (~20 min). Other tests are in `tests/`.

**Style rules** (details in `CLAUDE.md`, in Hungarian)

- UI text, commit messages and the Hungarian README are in Hungarian; code comments may be either.
- Performance first: draw new scenery through `sprite()` / `layerTiles()`, no `shadowBlur`/`filter`, no `getImageData`, no per-item small canvases.
- Text goes through `text(g,str,x,y,col,scale,align)`.
- A new JS file must be added to the loader list in `index.html`, to `ASSETS` in `sw.js` and to `files` in `tools-version.py`.
- Bump `APP_VERSION` in `js/core.js`, then run `python3 tools-version.py`.

**PR flow:** fork, create a branch, make a small focused change, run the checks, open a pull request describing what and why.

## Magyar

Köszönjük a segítséget! A projekt sima HTML + klasszikus `<script>` fájlok, build lépés és csomagkezelő nélkül.

**Helyi futtatás:** `python3 -m http.server 8765`, majd http://localhost:8765/index.html

**Ellenőrzés PR előtt:** `node --check` minden `js/*.js` fájlra, `python3 tests/flash.py` (elvárt: black 0, ERR []) és `python3 tests/devices.py` (minden "overlap" üres). Játékmenetet érintő változásnál `python3 tests/soak.py` is.

**Stílus:** a felület, a commit üzenetek és a magyar README magyarul vannak; új tájelemet a `sprite()` / `layerTiles()` képtáron át rajzolj, ne használj `shadowBlur`-t, `filter`-t és `getImageData`-t; új JS fájlt vegyél fel az `index.html`, az `sw.js` és a `tools-version.py` listájába; változtatásnál léptesd az `APP_VERSION`-t (`js/core.js`), majd futtasd a `python3 tools-version.py`-t.

**PR menete:** fork, ág, kis, célzott változtatás, ellenőrzés, pull request rövid leírással.
