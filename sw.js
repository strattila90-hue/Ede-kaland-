/* Családi Vakáció – service worker (offline működés) */
const VERSION='2.27.0';
const CACHE='csaladi-vakacio';
const ASSETS=['./','index.html','manifest.webmanifest','js/core.js','js/geo.js','js/radio.js','js/map.js','js/gps.js','js/geohd.js','js/car.js','js/world.js','js/minigames.js','js/shops.js','js/game.js','js/app.js','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
 if(url.origin!==location.origin)return;
 if(url.pathname.endsWith('version.json')){e.respondWith(fetch(req).catch(()=>caches.match('version.json',{ignoreSearch:true})));return;}
 /* frissítéshez kért fájl (t= vagy no-store): mindig a hálózatról, soha nem a régi tárolt példány */
 if(url.searchParams.has('t')||req.cache==='no-store'||req.cache==='reload'){e.respondWith(fetch(req));return;}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;}).catch(()=>caches.match('index.html'))));});
