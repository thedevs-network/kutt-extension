!function(e){var r={};function t(n){if(r[n])return r[n].exports;var s=r[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var s in e)t.d(n,s,function(r){return e[r]}.bind(null,s));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=49)}([,function(e,r,t){e.exports=t(8)},function(e,r,t){var n,s,o;s=[e],void 0===(o="function"==typeof(n=function(e){"use strict";if("undefined"==typeof browser||Object.getPrototypeOf(browser)!==Object.prototype){const r="The message port closed before a response was received.",t="Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",n=()=>{const e={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getBrowserInfo:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(0===Object.keys(e).length)throw new Error("api-metadata.json has not been included in browser-polyfill");const n=(e,r)=>(...t)=>{chrome.runtime.lastError?e.reject(chrome.runtime.lastError):r.singleCallbackArg||t.length<=1?e.resolve(t[0]):e.resolve(t)},s=e=>1==e?"argument":"arguments",o=(e,r,t)=>new Proxy(r,{apply:(r,n,s)=>t.call(n,e,...s)});let i=Function.call.bind(Object.prototype.hasOwnProperty);const a=(e,r={},t={})=>{let c=Object.create(null),u={has:(r,t)=>t in e||t in c,get(u,l,g){if(l in c)return c[l];if(!(l in e))return;let m=e[l];if("function"==typeof m)if("function"==typeof r[l])m=o(e,e[l],r[l]);else if(i(t,l)){let r=((e,r)=>(function(t,...o){if(o.length<r.minArgs)throw new Error(`Expected at least ${r.minArgs} ${s(r.minArgs)} for ${e}(), got ${o.length}`);if(o.length>r.maxArgs)throw new Error(`Expected at most ${r.maxArgs} ${s(r.maxArgs)} for ${e}(), got ${o.length}`);return new Promise((s,i)=>{if(r.fallbackToNoCallback)try{t[e](...o,n({resolve:s,reject:i},r))}catch(n){console.warn(`${e} API method doesn't seem to support the callback parameter, `+"falling back to call it without a callback: ",n),t[e](...o),r.fallbackToNoCallback=!1,r.noCallback=!0,s()}else r.noCallback?(t[e](...o),s()):t[e](...o,n({resolve:s,reject:i},r))})}))(l,t[l]);m=o(e,e[l],r)}else m=m.bind(e);else{if("object"!=typeof m||null===m||!i(r,l)&&!i(t,l))return Object.defineProperty(c,l,{configurable:!0,enumerable:!0,get:()=>e[l],set(r){e[l]=r}}),m;m=a(m,r[l],t[l])}return c[l]=m,m},set:(r,t,n,s)=>(t in c?c[t]=n:e[t]=n,!0),defineProperty:(e,r,t)=>Reflect.defineProperty(c,r,t),deleteProperty:(e,r)=>Reflect.deleteProperty(c,r)},l=Object.create(e);return new Proxy(l,u)},c=e=>({addListener(r,t,...n){r.addListener(e.get(t),...n)},hasListener:(r,t)=>r.hasListener(e.get(t)),removeListener(r,t){r.removeListener(e.get(t))}});let u=!1;const l=new class extends WeakMap{constructor(e,r){super(r),this.createItem=e}get(e){return this.has(e)||this.set(e,this.createItem(e)),super.get(e)}}(e=>"function"!=typeof e?e:function(r,n,s){let o,i,a=!1,c=new Promise(e=>{o=function(r){u||(console.warn(t,(new Error).stack),u=!0),a=!0,e(r)}});try{i=e(r,n,o)}catch(e){i=Promise.reject(e)}const l=!0!==i&&(e=>e&&"object"==typeof e&&"function"==typeof e.then)(i);if(!0!==i&&!l&&!a)return!1;const g=e=>{e.then(e=>{s(e)},e=>{let r;r=e&&(e instanceof Error||"string"==typeof e.message)?e.message:"An unexpected error occurred",s({__mozWebExtensionPolyfillReject__:!0,message:r})}).catch(e=>{console.error("Failed to send onMessage rejected reply",e)})};return g(l?i:c),!0}),g=(e,t,n,...o)=>{if(o.length<t.minArgs)throw new Error(`Expected at least ${t.minArgs} ${s(t.minArgs)} for ${e}(), got ${o.length}`);if(o.length>t.maxArgs)throw new Error(`Expected at most ${t.maxArgs} ${s(t.maxArgs)} for ${e}(), got ${o.length}`);return new Promise((e,t)=>{const s=(({reject:e,resolve:t},n)=>{chrome.runtime.lastError?chrome.runtime.lastError.message===r?t():e(chrome.runtime.lastError):n&&n.__mozWebExtensionPolyfillReject__?e(new Error(n.message)):t(n)}).bind(null,{resolve:e,reject:t});o.push(s),n.sendMessage(...o)})},m={runtime:{onMessage:c(l),onMessageExternal:c(l),sendMessage:g.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:g.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},f={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return e.privacy={network:{networkPredictionEnabled:f,webRTCIPHandlingPolicy:f},services:{passwordSavingEnabled:f},websites:{hyperlinkAuditingEnabled:f,referrersEnabled:f}},a(chrome,m,e)};e.exports=n()}else e.exports=browser})?n.apply(r,s):n)||(e.exports=o)},function(e,r){function t(e,r,t,n,s,o,i){try{var a=e[o](i),c=a.value}catch(e){return void t(e)}a.done?r(c):Promise.resolve(c).then(n,s)}e.exports=function(e){return function(){var r=this,n=arguments;return new Promise(function(s,o){var i=e.apply(r,n);function a(e){t(i,s,o,a,c,"next",e)}function c(e){t(i,s,o,a,c,"throw",e)}a(void 0)})}}},,,,function(e,r,t){"use strict";var n=t(37),s=t(53),o=Object.prototype.toString;function i(e){return"[object Array]"===o.call(e)}function a(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===o.call(e)}function u(e,r){if(null!=e)if("object"!=typeof e&&(e=[e]),i(e))for(var t=0,n=e.length;t<n;t++)r.call(null,e[t],t,e);else for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&r.call(null,e[s],s,e)}e.exports={isArray:i,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:s,isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:a,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:c,isStream:function(e){return a(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:u,merge:function e(){var r={};function t(t,n){"object"==typeof r[n]&&"object"==typeof t?r[n]=e(r[n],t):r[n]=t}for(var n=0,s=arguments.length;n<s;n++)u(arguments[n],t);return r},extend:function(e,r,t){return u(r,function(r,s){e[s]=t&&"function"==typeof r?n(r,t):r}),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,r,t){var n=function(e){"use strict";var r,t=Object.prototype,n=t.hasOwnProperty,s="function"==typeof Symbol?Symbol:{},o=s.iterator||"@@iterator",i=s.asyncIterator||"@@asyncIterator",a=s.toStringTag||"@@toStringTag";function c(e,r,t,n){var s=r&&r.prototype instanceof h?r:h,o=Object.create(s.prototype),i=new L(n||[]);return o._invoke=function(e,r,t){var n=l;return function(s,o){if(n===m)throw new Error("Generator is already running");if(n===f){if("throw"===s)throw o;return j()}for(t.method=s,t.arg=o;;){var i=t.delegate;if(i){var a=T(i,t);if(a){if(a===p)continue;return a}}if("next"===t.method)t.sent=t._sent=t.arg;else if("throw"===t.method){if(n===l)throw n=f,t.arg;t.dispatchException(t.arg)}else"return"===t.method&&t.abrupt("return",t.arg);n=m;var c=u(e,r,t);if("normal"===c.type){if(n=t.done?f:g,c.arg===p)continue;return{value:c.arg,done:t.done}}"throw"===c.type&&(n=f,t.method="throw",t.arg=c.arg)}}}(e,t,i),o}function u(e,r,t){try{return{type:"normal",arg:e.call(r,t)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var l="suspendedStart",g="suspendedYield",m="executing",f="completed",p={};function h(){}function A(){}function d(){}var x={};x[o]=function(){return this};var y=Object.getPrototypeOf,v=y&&y(y(C([])));v&&v!==t&&n.call(v,o)&&(x=v);var w=d.prototype=h.prototype=Object.create(x);function b(e){["next","throw","return"].forEach(function(r){e[r]=function(e){return this._invoke(r,e)}})}function E(e){var r;this._invoke=function(t,s){function o(){return new Promise(function(r,o){!function r(t,s,o,i){var a=u(e[t],e,s);if("throw"!==a.type){var c=a.arg,l=c.value;return l&&"object"==typeof l&&n.call(l,"__await")?Promise.resolve(l.__await).then(function(e){r("next",e,o,i)},function(e){r("throw",e,o,i)}):Promise.resolve(l).then(function(e){c.value=e,o(c)},function(e){return r("throw",e,o,i)})}i(a.arg)}(t,s,r,o)})}return r=r?r.then(o,o):o()}}function T(e,t){var n=e.iterator[t.method];if(n===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=r,T(e,t),"throw"===t.method))return p;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var s=u(n,e.iterator,t.arg);if("throw"===s.type)return t.method="throw",t.arg=s.arg,t.delegate=null,p;var o=s.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,p):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,p)}function k(e){var r={tryLoc:e[0]};1 in e&&(r.catchLoc=e[1]),2 in e&&(r.finallyLoc=e[2],r.afterLoc=e[3]),this.tryEntries.push(r)}function P(e){var r=e.completion||{};r.type="normal",delete r.arg,e.completion=r}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function C(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var s=-1,i=function t(){for(;++s<e.length;)if(n.call(e,s))return t.value=e[s],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}return{next:j}}function j(){return{value:r,done:!0}}return A.prototype=w.constructor=d,d.constructor=A,d[a]=A.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var r="function"==typeof e&&e.constructor;return!!r&&(r===A||"GeneratorFunction"===(r.displayName||r.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,d):(e.__proto__=d,a in e||(e[a]="GeneratorFunction")),e.prototype=Object.create(w),e},e.awrap=function(e){return{__await:e}},b(E.prototype),E.prototype[i]=function(){return this},e.AsyncIterator=E,e.async=function(r,t,n,s){var o=new E(c(r,t,n,s));return e.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},b(w),w[a]="Generator",w[o]=function(){return this},w.toString=function(){return"[object Generator]"},e.keys=function(e){var r=[];for(var t in e)r.push(t);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=C,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(P),!e)for(var t in this)"t"===t.charAt(0)&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function s(n,s){return a.type="throw",a.arg=e,t.next=n,s&&(t.method="next",t.arg=r),!!s}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return s("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),u=n.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return s(i.catchLoc,!0);if(this.prev<i.finallyLoc)return s(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return s(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return s(i.finallyLoc)}}}},abrupt:function(e,r){for(var t=this.tryEntries.length-1;t>=0;--t){var s=this.tryEntries[t];if(s.tryLoc<=this.prev&&n.call(s,"finallyLoc")&&this.prev<s.finallyLoc){var o=s;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=r&&r<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=r,o?(this.method="next",this.next=o.finallyLoc,p):this.complete(i)},complete:function(e,r){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&r&&(this.next=r),p},finish:function(e){for(var r=this.tryEntries.length-1;r>=0;--r){var t=this.tryEntries[r];if(t.finallyLoc===e)return this.complete(t.completion,t.afterLoc),P(t),p}},catch:function(e){for(var r=this.tryEntries.length-1;r>=0;--r){var t=this.tryEntries[r];if(t.tryLoc===e){var n=t.completion;if("throw"===n.type){var s=n.arg;P(t)}return s}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:C(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),p}},e}(e.exports);try{regeneratorRuntime=n}catch(e){Function("r","regeneratorRuntime = r")(n)}},,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,r,t){"use strict";(function(r){var n=t(7),s=t(56),o={"Content-Type":"application/x-www-form-urlencoded"};function i(e,r){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=r)}var a,c={adapter:("undefined"!=typeof XMLHttpRequest?a=t(38):void 0!==r&&(a=t(38)),a),transformRequest:[function(e,r){return s(r,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(i(r,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(i(r,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],function(e){c.headers[e]={}}),n.forEach(["post","put","patch"],function(e){c.headers[e]=n.merge(o)}),e.exports=c}).call(this,t(55))},function(e,r,t){"use strict";e.exports=function(e,r){return function(){for(var t=new Array(arguments.length),n=0;n<t.length;n++)t[n]=arguments[n];return e.apply(r,t)}}},function(e,r,t){"use strict";var n=t(7),s=t(57),o=t(59),i=t(60),a=t(61),c=t(39);e.exports=function(e){return new Promise(function(r,u){var l=e.data,g=e.headers;n.isFormData(l)&&delete g["Content-Type"];var m=new XMLHttpRequest;if(e.auth){var f=e.auth.username||"",p=e.auth.password||"";g.Authorization="Basic "+btoa(f+":"+p)}if(m.open(e.method.toUpperCase(),o(e.url,e.params,e.paramsSerializer),!0),m.timeout=e.timeout,m.onreadystatechange=function(){if(m&&4===m.readyState&&(0!==m.status||m.responseURL&&0===m.responseURL.indexOf("file:"))){var t="getAllResponseHeaders"in m?i(m.getAllResponseHeaders()):null,n={data:e.responseType&&"text"!==e.responseType?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:t,config:e,request:m};s(r,u,n),m=null}},m.onerror=function(){u(c("Network Error",e,null,m)),m=null},m.ontimeout=function(){u(c("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",m)),m=null},n.isStandardBrowserEnv()){var h=t(62),A=(e.withCredentials||a(e.url))&&e.xsrfCookieName?h.read(e.xsrfCookieName):void 0;A&&(g[e.xsrfHeaderName]=A)}if("setRequestHeader"in m&&n.forEach(g,function(e,r){void 0===l&&"content-type"===r.toLowerCase()?delete g[r]:m.setRequestHeader(r,e)}),e.withCredentials&&(m.withCredentials=!0),e.responseType)try{m.responseType=e.responseType}catch(r){if("json"!==e.responseType)throw r}"function"==typeof e.onDownloadProgress&&m.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&m.upload&&m.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){m&&(m.abort(),u(e),m=null)}),void 0===l&&(l=null),m.send(l)})}},function(e,r,t){"use strict";var n=t(58);e.exports=function(e,r,t,s,o){var i=new Error(e);return n(i,r,t,s,o)}},function(e,r,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,r,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,r,t){"use strict";const n=t(51),s="get",o="post",i={API:"https://kutt.it",KEY:"",DOMAIN:void 0,TIMEOUT:1e4};class a{constructor(){this._config=Object.assign({},i)}_request(e,r,t,s){"function"==typeof t&&(s=t,t=void 0);const{API:o,KEY:i,TIMEOUT:a}=this._config,c=n.default({method:e,data:t,url:r,baseURL:`${o}/api/url`,timeout:a,headers:{"X-API-Key":i}});if(!s)return c.then(e=>e.data);c.then(e=>s(null,e.data)).catch(e=>s(e))}setAPI(e){return this._config.API=e,this}setKey(e){return this._config.KEY=e,this}setDomain(e){return this._config.DOMAIN=e,this}setTimeout(e){return this._config.TIMEOUT=e,this}list(e){return this._request(s,"/geturls",e)}submit(e,r){return this._request(o,"/submit",e,r)}delete(e,r){return this._request(o,"/deleteurl",{id:e,domain:this._config.DOMAIN},r)}stats(e,r){const t=this._config.DOMAIN;return this._request(s,`/stats?id=${e}${t?`&domain=${t}`:""}`,r)}}a.setAPI=(e=>i.API=e),a.setKey=(e=>i.KEY=e),a.setDomain=(e=>i.DOMAIN=e),a.setTimeout=(e=>i.TIMEOUT=e),e.exports=a},,,,,,,function(e,r,t){e.exports=t(50)},function(e,r,t){"use strict";t.r(r);var n=t(1),s=t.n(n),o=t(3),i=t.n(o),a=t(42),c=t.n(a),u=t(2),l=t.n(u);const g=function(){var e=i()(s.a.mark(function e(r,t,n){var o,i,a,u,g,m,f;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o="https://kutt.it",e.prev=1,e.next=4,l.a.storage.local.get(["host","userOptions"]);case 4:i=e.sent,a=i.host,(u=i.userOptions).hasOwnProperty("devMode")&&u.devMode&&(o=a),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),o="https://kutt.it";case 13:return(g=new c.a).setAPI(o),g.setKey(r),g.setTimeout(2e4),m={target:t,password:n},e.prev=18,e.next=21,g.submit(m);case 21:return f=e.sent,e.abrupt("return",f.shortUrl);case 25:if(e.prev=25,e.t1=e.catch(18),"ECONNABORTED"!==e.t1.code){e.next=29;break}return e.abrupt("return",504);case 29:if(!e.t1.response){e.next=31;break}return e.abrupt("return",e.t1.response.status);case 31:case"end":return e.stop()}},e,null,[[1,10],[18,25]])}));return function(r,t,n){return e.apply(this,arguments)}}();l.a.runtime.onMessage.addListener(function(){var e=i()(s.a.mark(function e(r,t,n){var o,i,a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("start"!==r.msg){e.next=4;break}return e.next=3,g(r.API_key,r.pageUrl,r.password);case 3:return e.abrupt("return",e.sent);case 4:if("store"!==r.msg){e.next=13;break}return o=r.curURLCollection,i=r.curURLPair,a=o.filter(e=>e.longUrl!==i.longUrl),a.length>=10&&a.shift(),a.push(i),e.next=13,l.a.storage.local.set({URL_array:a});case 13:case"end":return e.stop()}},e)}));return function(r,t,n){return e.apply(this,arguments)}}())},function(e,r,t){e.exports=t(52)},function(e,r,t){"use strict";var n=t(7),s=t(37),o=t(54),i=t(36);function a(e){var r=new o(e),t=s(o.prototype.request,r);return n.extend(t,o.prototype,r),n.extend(t,r),t}var c=a(i);c.Axios=o,c.create=function(e){return a(n.merge(i,e))},c.Cancel=t(41),c.CancelToken=t(68),c.isCancel=t(40),c.all=function(e){return Promise.all(e)},c.spread=t(69),e.exports=c,e.exports.default=c},function(e,r){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&null!=e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}},function(e,r,t){"use strict";var n=t(36),s=t(7),o=t(63),i=t(64);function a(e){this.defaults=e,this.interceptors={request:new o,response:new o}}a.prototype.request=function(e){"string"==typeof e&&(e=s.merge({url:arguments[0]},arguments[1])),(e=s.merge(n,{method:"get"},this.defaults,e)).method=e.method.toLowerCase();var r=[i,void 0],t=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){r.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){r.push(e.fulfilled,e.rejected)});r.length;)t=t.then(r.shift(),r.shift());return t},s.forEach(["delete","get","head","options"],function(e){a.prototype[e]=function(r,t){return this.request(s.merge(t||{},{method:e,url:r}))}}),s.forEach(["post","put","patch"],function(e){a.prototype[e]=function(r,t,n){return this.request(s.merge(n||{},{method:e,url:r,data:t}))}}),e.exports=a},function(e,r){var t,n,s=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var c,u=[],l=!1,g=-1;function m(){l&&c&&(l=!1,c.length?u=c.concat(u):g=-1,u.length&&f())}function f(){if(!l){var e=a(m);l=!0;for(var r=u.length;r;){for(c=u,u=[];++g<r;)c&&c[g].run();g=-1,r=u.length}c=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(r){try{return n.call(null,e)}catch(r){return n.call(this,e)}}}(e)}}function p(e,r){this.fun=e,this.array=r}function h(){}s.nextTick=function(e){var r=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];u.push(new p(e,r)),1!==u.length||l||a(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=h,s.addListener=h,s.once=h,s.off=h,s.removeListener=h,s.removeAllListeners=h,s.emit=h,s.prependListener=h,s.prependOnceListener=h,s.listeners=function(e){return[]},s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,r,t){"use strict";var n=t(7);e.exports=function(e,r){n.forEach(e,function(t,n){n!==r&&n.toUpperCase()===r.toUpperCase()&&(e[r]=t,delete e[n])})}},function(e,r,t){"use strict";var n=t(39);e.exports=function(e,r,t){var s=t.config.validateStatus;t.status&&s&&!s(t.status)?r(n("Request failed with status code "+t.status,t.config,null,t.request,t)):e(t)}},function(e,r,t){"use strict";e.exports=function(e,r,t,n,s){return e.config=r,t&&(e.code=t),e.request=n,e.response=s,e}},function(e,r,t){"use strict";var n=t(7);function s(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,r,t){if(!r)return e;var o;if(t)o=t(r);else if(n.isURLSearchParams(r))o=r.toString();else{var i=[];n.forEach(r,function(e,r){null!=e&&(n.isArray(e)?r+="[]":e=[e],n.forEach(e,function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),i.push(s(r)+"="+s(e))}))}),o=i.join("&")}return o&&(e+=(-1===e.indexOf("?")?"?":"&")+o),e}},function(e,r,t){"use strict";var n=t(7),s=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var r,t,o,i={};return e?(n.forEach(e.split("\n"),function(e){if(o=e.indexOf(":"),r=n.trim(e.substr(0,o)).toLowerCase(),t=n.trim(e.substr(o+1)),r){if(i[r]&&s.indexOf(r)>=0)return;i[r]="set-cookie"===r?(i[r]?i[r]:[]).concat([t]):i[r]?i[r]+", "+t:t}}),i):i}},function(e,r,t){"use strict";var n=t(7);e.exports=n.isStandardBrowserEnv()?function(){var e,r=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");function s(e){var n=e;return r&&(t.setAttribute("href",n),n=t.href),t.setAttribute("href",n),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return e=s(window.location.href),function(r){var t=n.isString(r)?s(r):r;return t.protocol===e.protocol&&t.host===e.host}}():function(){return!0}},function(e,r,t){"use strict";var n=t(7);e.exports=n.isStandardBrowserEnv()?{write:function(e,r,t,s,o,i){var a=[];a.push(e+"="+encodeURIComponent(r)),n.isNumber(t)&&a.push("expires="+new Date(t).toGMTString()),n.isString(s)&&a.push("path="+s),n.isString(o)&&a.push("domain="+o),!0===i&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var r=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return r?decodeURIComponent(r[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,r,t){"use strict";var n=t(7);function s(){this.handlers=[]}s.prototype.use=function(e,r){return this.handlers.push({fulfilled:e,rejected:r}),this.handlers.length-1},s.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},s.prototype.forEach=function(e){n.forEach(this.handlers,function(r){null!==r&&e(r)})},e.exports=s},function(e,r,t){"use strict";var n=t(7),s=t(65),o=t(40),i=t(36),a=t(66),c=t(67);function u(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return u(e),e.baseURL&&!a(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=s(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),n.forEach(["delete","get","head","post","put","patch","common"],function(r){delete e.headers[r]}),(e.adapter||i.adapter)(e).then(function(r){return u(e),r.data=s(r.data,r.headers,e.transformResponse),r},function(r){return o(r)||(u(e),r&&r.response&&(r.response.data=s(r.response.data,r.response.headers,e.transformResponse))),Promise.reject(r)})}},function(e,r,t){"use strict";var n=t(7);e.exports=function(e,r,t){return n.forEach(t,function(t){e=t(e,r)}),e}},function(e,r,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,r,t){"use strict";e.exports=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e}},function(e,r,t){"use strict";var n=t(41);function s(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var r;this.promise=new Promise(function(e){r=e});var t=this;e(function(e){t.reason||(t.reason=new n(e),r(t.reason))})}s.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},s.source=function(){var e;return{token:new s(function(r){e=r}),cancel:e}},e.exports=s},function(e,r,t){"use strict";e.exports=function(e){return function(r){return e.apply(null,r)}}}]);