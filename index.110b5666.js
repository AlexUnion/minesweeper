function e(e,r,o,t){Object.defineProperty(e,r,{get:o,set:t,enumerable:!0,configurable:!0})}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},t={},n=r.parcelRequired5d1;null==n&&((n=function(e){if(e in o)return o[e].exports;if(e in t){var r=t[e];delete t[e];var n={id:e,exports:{}};return o[e]=n,r.call(n.exports,n,n.exports),n.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,r){t[e]=r},r.parcelRequired5d1=n),n.register("eBuhp",(function(r,o){function t(e,r){"number"==typeof r&&(r+="");const{length:o}=e[0];if(r.length===o)return r;const t=r.split("").reverse();for(let e=t.length;e<o;e++)t.push("0");return t.reverse().join("")}e(r.exports,"fillZero",(()=>t)),e(r.exports,"generateRandomNumber",(()=>n)),e(r.exports,"copyMatrix",(()=>i)),e(r.exports,"stringifyCoords",(()=>s)),e(r.exports,"parseCoords",(()=>l)),e(r.exports,"parseTime",(()=>p));const n=(e,r)=>Math.floor(Math.random()*(r-e))+e,i=e=>e.map((e=>[...e])),s=(e,r)=>`${e}-${r}`,l=e=>e.split("-").map((e=>Number(e))),p=e=>`${t`00${Math.floor(e/60)}`}:${t`00${e%60}`}`})),n("eBuhp");
//# sourceMappingURL=index.110b5666.js.map
