# version.json előállítása: verzió + fájlméretek a százalékos frissítéshez
import json,os,re
v=re.search(r"APP_VERSION='([^']+)'",open('js/core.js',encoding='utf-8').read()).group(1)
files=['index.html','manifest.webmanifest','sw.js','js/core.js','js/geo.js','js/radio.js','js/map.js','js/car.js','js/world.js','js/minigames.js','js/shops.js','js/game.js','js/app.js','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png']
json.dump({'version':v,'files':{f:os.path.getsize(f) for f in files if os.path.exists(f)}},open('version.json','w'),indent=1)
sw=open('sw.js',encoding='utf-8').read();sw=re.sub(r"const VERSION='[^']+'","const VERSION='%s'"%v,sw);open('sw.js','w',encoding='utf-8').write(sw)
print('version.json',v)
