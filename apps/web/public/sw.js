if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const u=e=>a(e,i),r={module:{uri:i},exports:t,require:u};s[i]=Promise.all(n.map((e=>r[e]||u(e)))).then((e=>(c(...e),t)))}}define(["./workbox-8c8aeaed"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/72mDHRzXkh_xs7u16PyhO/_buildManifest.js",revision:"dc232a7c043f36a4ea724656a7e61519"},{url:"/_next/static/72mDHRzXkh_xs7u16PyhO/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0f993a33-ded83db76dda1add.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/1616-5ab0ce3337fdc3a9.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/1721-f2ea5a90fc6e02cf.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/1887-718be8a70934392d.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/2499-fdd8e69b5f55dfe3.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/2751-dffea054c25cc5be.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/3726-131641a44203e1ed.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/456-dddce6c22a55b075.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/4655-1612a3aaa9064013.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/4760-5b1398c1d6fa1ecf.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/5092-8f32ba228cebe2f0.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/5301-25770eb9e1aef327.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/6324-36c630af458d54ab.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/6430-eaba19c60e20ba03.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/6499-8a222b6d2488f409.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/654-8a0ccd68288faab2.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/6729-1eb05b96991f997a.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/6786-d47dc0cd46571ee6.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/7348-576d37f0ff9aa5cb.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/7766-11c89930582b048f.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/8016-075e4dec8db7b923.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/8101-0a43bbe52ef34cfd.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/8409-4888f454261f0f48.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/8461863f-20bd5541376a7527.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/8771-b8e52938a4adaa76.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/9949-753d067a23dc4867.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/9e33a154-3f5abc62c1c7e5b0.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/a0eb5bce-8e767d75ac81a4df.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/forgot-password/page-e1fb45e2e86407bd.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/layout-a463570e69aac7ec.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/login/page-075be99365fd6974.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/logout/page-11f6b16d75abe0cb.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/register/page-bd4b0d44f00c2e8a.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/reset-password/%5Btoken%5D/page-b17229a73fdb54b1.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/(auth)/verification/page-73dc183383c0d2b5.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/_not-found/page-d5eefc4244647b84.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/classes/%5BclassId%5D/page-c269ebfcd716ccda.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/classes/page-f4915fa484f087f8.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/contact/page-fe2dea46eb64f3e6.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/layout-d160d4298334cb40.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/legal/page-0016dc80d1470dac.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/locations/%5BlocationId%5D/page-c4170665f2a81932.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/locations/page-243cea022bbdecf3.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/(coach)/agenda/%5BagendaId%5D/page-e1d5bfbc579761a3.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/(coach)/agenda/page-9bfcf2bafd2c5d33.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/(user)/booking/page-24d991d288661292.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/(user)/credit/page-a0b625d391eba62b.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/(user)/package/page-b4409953d9bf6c8a.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/layout-c6160d8b768b1815.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/loyalty/page-0b7229681aafb6a3.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/me/page-c92ac5c086095e4f.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/packages/%5BpackageId%5D/page-c329809d22b4f119.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/packages/page-06a2dc985a2f175e.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/page-849305c643df4cb8.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/reviews/page-d2fa9138c9b08bf6.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/schedules/%5BagendaId%5D/page-a399f6cfd91904e5.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/app/schedules/page-ef0720930e5fbdbd.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/d247ba79-ec17cd26f53e1797.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/framework-1e65b122cad114ea.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/main-3ffd1d422e820279.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/main-app-ba3c596cbac940b2.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/pages/_app-d4ebb67152d6a5cc.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/pages/_error-9857444bf29aa4e5.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-e6044a9b268459fe.js",revision:"72mDHRzXkh_xs7u16PyhO"},{url:"/_next/static/css/96ad31dbc3aec478.css",revision:"96ad31dbc3aec478"},{url:"/_next/static/media/634216363f5c73c1-s.woff2",revision:"4a1bf14c88bdef173c2a39c5c60e65ce"},{url:"/_next/static/media/88325a2c1fede2f4-s.woff2",revision:"93131c3ec4fe9782c2c40a708db9b0b6"},{url:"/_next/static/media/aec774cbe1963439-s.woff2",revision:"37f8885214448afc8f3b3678db525598"},{url:"/_next/static/media/d83fe381bb17eb77-s.woff2",revision:"215b11e73137fdb7d9a773e0211c29d6"},{url:"/_next/static/media/e1c529c04de64b40-s.p.woff2",revision:"e88b1871ed8eef59b7df05a91a6f2157"},{url:"/android-icon-144x144.png",revision:"8cfe10d0a65b0d51b8bc9a65668e8ac5"},{url:"/android-icon-192x192.png",revision:"75fcd051dd6dbd93a47c7fa1b92c0331"},{url:"/android-icon-36x36.png",revision:"e9b6605f9d5537bdb821f4d26c68b847"},{url:"/android-icon-48x48.png",revision:"df1d77901c045da0c91ca3756f0bd47e"},{url:"/android-icon-72x72.png",revision:"5408c19110935fe73ad0b7f780058273"},{url:"/android-icon-96x96.png",revision:"0de64dfdd6dabdfa8b9507fa90ee6e6e"},{url:"/apple-icon-114x114.png",revision:"3a6554adfffbbe6edb2233235e81d29c"},{url:"/apple-icon-120x120.png",revision:"e411fdd1a5acb02724054acbcf33462e"},{url:"/apple-icon-144x144.png",revision:"8cfe10d0a65b0d51b8bc9a65668e8ac5"},{url:"/apple-icon-152x152.png",revision:"8ecd3415a6bbff8f1cb079cd18d1ffa0"},{url:"/apple-icon-180x180.png",revision:"39801b2a43e476aeef839f2594053e86"},{url:"/apple-icon-57x57.png",revision:"308fc2a2d95780461ef3b8c59ad3070d"},{url:"/apple-icon-60x60.png",revision:"7dde8b43dce7de11682512076f577721"},{url:"/apple-icon-72x72.png",revision:"5408c19110935fe73ad0b7f780058273"},{url:"/apple-icon-76x76.png",revision:"95eff83dd667eac9a190f00af09f8d3f"},{url:"/apple-icon-precomposed.png",revision:"ff9d54530c592ddc01dc256dad1e1f5e"},{url:"/apple-icon.png",revision:"ff9d54530c592ddc01dc256dad1e1f5e"},{url:"/browserconfig.xml",revision:"653d077300a12f09a69caeea7a8947f8"},{url:"/favicon-16x16.png",revision:"f6e9340d2f63c65ec179ca312874d86f"},{url:"/favicon-32x32.png",revision:"83d9cf07e74a4e3a65fd6b63d9e7cdcf"},{url:"/favicon-96x96.png",revision:"0de64dfdd6dabdfa8b9507fa90ee6e6e"},{url:"/favicon.ico",revision:"c6606b3185ac5a79dcace8e552325463"},{url:"/manifest.json",revision:"9e554a8da14685942cc5723dae639aa1"},{url:"/ms-icon-144x144.png",revision:"8cfe10d0a65b0d51b8bc9a65668e8ac5"},{url:"/ms-icon-150x150.png",revision:"a964e5b298fd060c26b5c7b1e335bffa"},{url:"/ms-icon-310x310.png",revision:"929223a5d6c6f905ded016706a7733b4"},{url:"/ms-icon-70x70.png",revision:"f93b085dc65c9974e68e9dbd9a3b36f8"},{url:"/placeholder.svg",revision:"35707bd9960ba5281c72af927b79291f"},{url:"/robots.txt",revision:"61c27d2cd39a713f7829422c3d9edcc7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
