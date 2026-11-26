/* network-first with offline fallback: lets the app open without internet */
var C='chok-v1';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET'||!/^https?:/.test(r.url)) return;
  if(/firestore\.googleapis\.com|identitytoolkit|securetoken|googleapis\.com\/google\.firestore/.test(r.url)) return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&(res.ok||res.type==='opaque')){var cp=res.clone(); caches.open(C).then(function(c){c.put(r,cp)}).catch(function(){})}
    return res;
  }).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('./index.html')||caches.match('./')})}));
});
