import{S as I,i as N,s as S,a3 as k,D as d,k as y,l as C,m as D,h as g,a4 as h,b as R,a5 as V,a6 as X,a7 as j,Q as q,g as v,d as z,a0 as b,a2 as E,w as P}from"./index.5c9a020e.js";import{c as Q}from"./Offcanvas.svelte_svelte_type_style_lang.537800b5.js";function A(n){let s,t;const o=n[8].default,l=k(o,n,n[7],null);let r=[n[2],{class:n[1]}],f={};for(let e=0;e<r.length;e+=1)f=d(f,r[e]);return{c(){s=y("div"),l&&l.c(),this.h()},l(e){s=C(e,"DIV",{class:!0});var i=D(s);l&&l.l(i),i.forEach(g),this.h()},h(){h(s,f)},m(e,i){R(e,s,i),l&&l.m(s,null),n[9](s),t=!0},p(e,[i]){l&&l.p&&(!t||i&128)&&V(l,o,e,e[7],t?j(o,e[7],i,null):X(e[7]),null),h(s,f=q(r,[i&4&&e[2],(!t||i&2)&&{class:e[1]}]))},i(e){t||(v(l,e),t=!0)},o(e){z(l,e),t=!1},d(e){e&&g(s),l&&l.d(e),n[9](null)}}}function B(n){const s=parseInt(n);if(isNaN(s)){if(typeof n=="object")return["xs","sm","md","lg","xl"].map(t=>{const l=t==="xs"?"-":`-${t}-`,r=n[t];return typeof r=="number"&&r>0?`row-cols${l}${r}`:null}).filter(t=>!!t)}else if(s>0)return[`row-cols-${s}`];return[]}function F(n,s,t){let o;const l=["class","noGutters","form","cols","inner"];let r=b(s,l),{$$slots:f={},$$scope:e}=s,{class:i=""}=s,{noGutters:c=!1}=s,{form:m=!1}=s,{cols:_=0}=s,{inner:u=void 0}=s;function G(a){P[a?"unshift":"push"](()=>{u=a,t(0,u)})}return n.$$set=a=>{s=d(d({},s),E(a)),t(2,r=b(s,l)),"class"in a&&t(3,i=a.class),"noGutters"in a&&t(4,c=a.noGutters),"form"in a&&t(5,m=a.form),"cols"in a&&t(6,_=a.cols),"inner"in a&&t(0,u=a.inner),"$$scope"in a&&t(7,e=a.$$scope)},n.$$.update=()=>{n.$$.dirty&120&&t(1,o=Q(i,c?"gx-0":null,m?"form-row":"row",...B(_)))},[u,o,r,i,c,m,_,e,f,G]}class K extends I{constructor(s){super(),N(this,s,F,A,S,{class:3,noGutters:4,form:5,cols:6,inner:0})}}export{K as R};
