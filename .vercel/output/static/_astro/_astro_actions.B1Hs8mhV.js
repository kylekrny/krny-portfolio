function R(t){const e=_(t),a=new ArrayBuffer(e.length),r=new DataView(a);for(let s=0;s<a.byteLength;s++)r.setUint8(s,e.charCodeAt(s));return a}const w="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function _(t){t.length%4===0&&(t=t.replace(/==?$/,""));let e="",a=0,r=0;for(let s=0;s<t.length;s++)a<<=6,a|=w.indexOf(t[s]),r+=6,r===24&&(e+=String.fromCharCode((a&16711680)>>16),e+=String.fromCharCode((a&65280)>>8),e+=String.fromCharCode(a&255),a=r=0);return r===12?(a>>=4,e+=String.fromCharCode(a)):r===18&&(a>>=2,e+=String.fromCharCode((a&65280)>>8),e+=String.fromCharCode(a&255)),e}const m=-1,C=-2,b=-3,U=-4,D=-5,P=-6;function L(t,e){return k(JSON.parse(t),e)}function k(t,e){if(typeof t=="number")return s(t,!0);if(!Array.isArray(t)||t.length===0)throw new Error("Invalid input");const a=t,r=Array(a.length);function s(n,f=!1){if(n===m)return;if(n===b)return NaN;if(n===U)return 1/0;if(n===D)return-1/0;if(n===P)return-0;if(f)throw new Error("Invalid input");if(n in r)return r[n];const o=a[n];if(!o||typeof o!="object")r[n]=o;else if(Array.isArray(o))if(typeof o[0]=="string"){const i=o[0],u=e?.[i];if(u)return r[n]=u(s(o[1]));switch(i){case"Date":r[n]=new Date(o[1]);break;case"Set":const y=new Set;r[n]=y;for(let c=1;c<o.length;c+=1)y.add(s(o[c]));break;case"Map":const A=new Map;r[n]=A;for(let c=1;c<o.length;c+=2)A.set(s(o[c]),s(o[c+1]));break;case"RegExp":r[n]=new RegExp(o[1],o[2]);break;case"Object":r[n]=Object(o[1]);break;case"BigInt":r[n]=BigInt(o[1]);break;case"null":const h=Object.create(null);r[n]=h;for(let c=1;c<o.length;c+=2)h[o[c]]=s(o[c+1]);break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":{const c=globalThis[i],E=o[1],I=R(E),O=new c(I);r[n]=O;break}case"ArrayBuffer":{const c=o[1],E=R(c);r[n]=E;break}default:throw new Error(`Unknown type ${i}`)}}else{const i=new Array(o.length);r[n]=i;for(let u=0;u<o.length;u+=1){const y=o[u];y!==C&&(i[u]=s(y))}}else{const i={};r[n]=i;for(const u in o){const y=o[u];i[u]=s(y)}}return r[n]}return s(0)}function F(t){return t.endsWith("/")?t:t+"/"}const p={actionName:"_action"},v=p,B=F,N={BAD_REQUEST:400,UNAUTHORIZED:401,FORBIDDEN:403,NOT_FOUND:404,TIMEOUT:405,CONFLICT:409,PRECONDITION_FAILED:412,PAYLOAD_TOO_LARGE:413,UNSUPPORTED_MEDIA_TYPE:415,UNPROCESSABLE_CONTENT:422,TOO_MANY_REQUESTS:429,CLIENT_CLOSED_REQUEST:499,INTERNAL_SERVER_ERROR:500},$=Object.entries(N).reduce((t,[e,a])=>({...t,[a]:e}),{});class l extends Error{type="AstroActionError";code="INTERNAL_SERVER_ERROR";status=500;constructor(e){super(e.message),this.code=e.code,this.status=l.codeToStatus(e.code),e.stack&&(this.stack=e.stack)}static codeToStatus(e){return N[e]}static statusToCode(e){return $[e]??"INTERNAL_SERVER_ERROR"}static fromJson(e){return M(e)?new V(e.issues):j(e)?new l(e):new l({code:"INTERNAL_SERVER_ERROR"})}}function j(t){return typeof t=="object"&&t!=null&&"type"in t&&t.type==="AstroActionError"}function M(t){return typeof t=="object"&&t!=null&&"type"in t&&t.type==="AstroActionInputError"&&"issues"in t&&Array.isArray(t.issues)}class V extends l{type="AstroActionInputError";issues;fields;constructor(e){super({message:`Failed to validate: ${JSON.stringify(e,null,2)}`,code:"BAD_REQUEST"}),this.issues=e,this.fields={};for(const a of e)if(a.path.length>0){const r=a.path[0].toString();this.fields[r]??=[],this.fields[r]?.push(a.message)}}}function d(t){return`?${new URLSearchParams({[p.actionName]:t}).toString()}`}function S(t){if(t.type==="error"){let e;try{e=JSON.parse(t.body)}catch{return{data:void 0,error:new l({message:t.body,code:"INTERNAL_SERVER_ERROR"})}}return{error:l.fromJson(e),data:void 0}}return t.type==="empty"?{data:void 0,error:void 0}:{data:L(t.body,{URL:e=>new URL(e)}),error:void 0}}const Q="%2E";function T(t={},e=""){return new Proxy(t,{get(a,r){if(r in a||typeof r=="symbol")return a[r];const s=e+encodeURIComponent(r.toString()).replaceAll(".",Q);function n(f){return g(f,s)}return Object.assign(n,{queryString:d(s),toString:()=>n.queryString,$$FORM_ACTION:function(){return{method:"POST",name:"_astroAction",action:"?"+new URLSearchParams(n.toString()).toString()}},async orThrow(f){const{data:o,error:i}=await g(f,s);if(i)throw i;return o}}),T(n,s+".")}})}function Y(t){let e=`${"/".replace(/\/$/,"")}/_actions/${new URLSearchParams(t.toString()).get(v.actionName)}`;return e=B(e),e}async function g(t,e,a){const r=new Headers;r.set("Accept","application/json");let s=t;if(!(s instanceof FormData)){try{s=JSON.stringify(t)}catch(f){throw new l({code:"BAD_REQUEST",message:`Failed to serialize request body to JSON. Full error: ${f.message}`})}s?r.set("Content-Type","application/json"):r.set("Content-Length","0")}const n=await fetch(Y({toString(){return d(e)}}),{method:"POST",body:s,headers:r});return n.status===204?S({type:"empty",status:204}):S({type:n.ok?"data":"error",body:await n.text()})}const J=T();export{J as a};
