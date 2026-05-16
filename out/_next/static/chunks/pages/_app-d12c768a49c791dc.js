(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6840:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(5545)}])},9254:function(e,t,r){"use strict";r.d(t,{u:function(){return a}});let a={maleName:"秦",femaleName:"笨蛋",meetDate:"2026-04-29",loveDate:"2027-04-29",avatarUrlMale:"https://tc.qiyinqin.ccwu.cc/file/Telegram/1778822204012_user.webp",avatarUrlFemale:"https://tc.qiyinqin.ccwu.cc/file/Telegram/1778822227950_Screenshot_2026-05-15-13-15-19-72_2332cb9b27b851b548ba47a91682926c.webp",siteTitle:"Mi55u",siteName:"小窝",siteDescription:"这是我们一起走过的",footerText:"记录我们的故事",showMeetCount:!0,showLoveCount:!1,homepageBg:"https://i.postimg.cc/PfQbp9M0/bg-Cover.jpg",siteIcon:"https://i.postimg.cc/j5yhCmXp/dog.png",copyrightText:"记录小站 \xa9 2026"}},5545:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return n}});var a=r(5893),i=r(7294),o=r(6501),s=r(9254);function n(e){let{Component:t,pageProps:r}=e;return(0,i.useEffect)(()=>{let e=s.u.siteTitle,t=s.u.siteIcon,r=localStorage.getItem("love_config.json");if(r)try{let a=JSON.parse(r);a.siteTitle&&(e=a.siteTitle),a.siteIcon&&(t=a.siteIcon)}catch(e){}if(e&&(document.title=e),t){let e=document.querySelector('link[rel="icon"]');e||((e=document.createElement("link")).rel="icon",document.head.appendChild(e)),e.href=t}},[]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t,{...r}),(0,a.jsx)(o.x7,{position:"top-center",toastOptions:{duration:3e3,style:{background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(12px)",borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.8)",color:"#4A3740",fontSize:"14px"}}})]})}r(876)},876:function(){},6501:function(e,t,r){"use strict";let a,i;r.d(t,{x7:function(){return ep},ZP:function(){return em}});var o,s=r(7294);let n={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,p=(e,t)=>{let r="",a="",i="";for(let o in e){let s=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+s+";":a+="f"==o[1]?p(s,o):o+"{"+p(s,"k"==o[1]?"":t)+"}":"object"==typeof s?a+=p(s,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=s&&(o="-"==o[1]?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=p.p?p.p(o,s):o+":"+s+";")}return r+(t&&i?t+"{"+i+"}":i)+a},m={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},g=(e,t,r,a,i)=>{var o;let s=f(e),n=m[s]||(m[s]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(s));if(!m[n]){let t=s!==e?e:(e=>{let t,r,a=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(r=t[3].replace(u," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(u," ").trim();return a[0]})(e);m[n]=p(i?{["@keyframes "+n]:t}:t,r?"":"."+n)}let l=r&&m.g;return r&&(m.g=m[n]),o=m[n],l?t.data=t.data.replace(l,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),n},h=(e,t,r)=>e.reduce((e,a,i)=>{let o=t[i];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"");function b(e){let t=this||{},r=e.call?e(t.p):e;return g(r.unshift?r.raw?h(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}b.bind({g:1});let y,v,x,w=b.bind({k:1});function E(e,t){let r=this||{};return function(){let a=arguments;function i(o,s){let n=Object.assign({},o),l=n.className||i.className;r.p=Object.assign({theme:v&&v()},n),r.o=/go\d/.test(l),n.className=b.apply(r,a)+(l?" "+l:""),t&&(n.ref=s);let c=e;return e[0]&&(c=n.as||e,delete n.as),x&&c[0]&&x(n),y(c,n)}return t?t(i):i}}var k=e=>"function"==typeof e,_=(e,t)=>k(e)?e(t):e,C=(a=0,()=>(++a).toString()),N=()=>{if(void 0===i&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");i=!e||e.matches}return i},j="default",$=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return $(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},O=[],D={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},I={},T=(e,t=j)=>{I[t]=$(I[t]||D,e),O.forEach(([e,r])=>{e===t&&r(I[t])})},A=e=>Object.keys(I).forEach(t=>T(e,t)),P=e=>Object.keys(I).find(t=>I[t].toasts.some(t=>t.id===e)),z=(e=j)=>t=>{T(t,e)},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=(e={},t=j)=>{let[r,a]=(0,s.useState)(I[t]||D),i=(0,s.useRef)(I[t]);(0,s.useEffect)(()=>(i.current!==I[t]&&a(I[t]),O.push([t,a]),()=>{let e=O.findIndex(([e])=>e===t);e>-1&&O.splice(e,1)}),[t]);let o=r.toasts.map(t=>{var r,a,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||M[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:o}},F=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||C()}),L=e=>(t,r)=>{let a=F(t,e,r);return z(a.toasterId||P(a.id))({type:2,toast:a}),a.id},q=(e,t)=>L("blank")(e,t);q.error=L("error"),q.success=L("success"),q.loading=L("loading"),q.custom=L("custom"),q.dismiss=(e,t)=>{let r={type:3,toastId:e};t?z(t)(r):A(r)},q.dismissAll=e=>q.dismiss(void 0,e),q.remove=(e,t)=>{let r={type:4,toastId:e};t?z(t)(r):A(r)},q.removeAll=e=>q.remove(void 0,e),q.promise=(e,t,r)=>{let a=q.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?_(t.success,e):void 0;return i?q.success(i,{id:a,...r,...null==r?void 0:r.success}):q.dismiss(a),e}).catch(e=>{let i=t.error?_(t.error,e):void 0;i?q.error(i,{id:a,...r,...null==r?void 0:r.error}):q.dismiss(a)}),e};var H=1e3,R=(e,t="default")=>{let{toasts:r,pausedAt:a}=S(e,t),i=(0,s.useRef)(new Map).current,o=(0,s.useCallback)((e,t=H)=>{if(i.has(e))return;let r=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,r)},[]);(0,s.useEffect)(()=>{if(a)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&q.dismiss(r.id);return}return setTimeout(()=>q.dismiss(r.id,t),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,s.useCallback)(z(t),[t]),l=(0,s.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,s.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,s.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:i=8,defaultPosition:o}=t||{},s=r.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<n&&e.visible).length;return s.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,s.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},U=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,X=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Z=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${X} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${B} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,J=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Q=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${J} 1s linear infinite;
`,Y=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,G=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,K=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${G} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,V=E("div")`
  position: absolute;
`,W=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,er=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(et,null,t):t:"blank"===r?null:s.createElement(W,null,s.createElement(Q,{...a}),"loading"!==r&&s.createElement(V,null,"error"===r?s.createElement(Z,{...a}):s.createElement(K,{...a})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ei=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,eo=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,es=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let r=e.includes("top")?1:-1,[a,i]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(r),ei(r)];return{animation:t?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=s.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(er,{toast:e}),n=s.createElement(es,{...e.ariaProps},_(e.message,e));return s.createElement(eo,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof a?a({icon:o,message:n}):s.createElement(s.Fragment,null,o,n))});o=s.createElement,p.p=void 0,y=o,v=void 0,x=void 0;var ec=({id:e,className:t,style:r,onHeightUpdate:a,children:i})=>{let o=s.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return s.createElement("div",{ref:o,className:t,style:r},i)},ed=(e,t)=>{let r=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...a}},eu=b`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:i,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=R(r,o);return s.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let o=r.position||t,n=ed(o,d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}));return s.createElement(ec,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?eu:"",style:n},"custom"===r.type?_(r.message,r):i?i(r):s.createElement(el,{toast:r,position:o}))}))},em=q}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(3079)}),_N_E=e.O()}]);