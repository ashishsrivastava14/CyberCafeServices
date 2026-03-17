import{c as x,r as h,j as e,C as v}from"./index-CfrVhFRe.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=x("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=x("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=x("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=x("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);function M({columns:p,rows:l,pageSize:o=10}){const[n,u]=h.useState(null),[m,b]=h.useState("asc"),[a,d]=h.useState(0),j=s=>{n===s?b(t=>t==="asc"?"desc":"asc"):(u(s),b("asc")),d(0)},c=h.useMemo(()=>n?[...l].sort((s,t)=>{const r=s[n],y=t[n];if(r==null)return 1;if(y==null)return-1;const g=typeof r=="string"?r.localeCompare(y):r-y;return m==="asc"?g:-g}):l,[l,n,m]),i=Math.ceil(c.length/o),f=c.slice(a*o,(a+1)*o);return l.length===0?e.jsxs("div",{className:"bg-white rounded-md border border-gray-200 p-12 text-center",children:[e.jsx(C,{className:"w-12 h-12 text-gray-300 mx-auto mb-3"}),e.jsx("p",{className:"text-gray-500 font-medium",children:"No data found"}),e.jsx("p",{className:"text-gray-400 text-sm mt-1",children:"Try adjusting your filters"})]}):e.jsxs("div",{className:"bg-white rounded-md border border-gray-200 overflow-hidden",children:[e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-gray-50 border-b border-gray-200",children:p.map(s=>e.jsx("th",{onClick:()=>s.sortable!==!1&&j(s.key),className:`px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap ${s.sortable!==!1?"cursor-pointer select-none hover:text-primary-800":""}`,children:e.jsxs("div",{className:"flex items-center gap-1",children:[s.label,n===s.key&&(m==="asc"?e.jsx(k,{className:"w-3 h-3"}):e.jsx(N,{className:"w-3 h-3"}))]})},s.key))})}),e.jsx("tbody",{children:f.map((s,t)=>e.jsx("tr",{className:"border-b border-gray-100 hover:bg-gray-50 transition-colors",children:p.map(r=>e.jsx("td",{className:"px-4 py-3 whitespace-nowrap",children:r.render?r.render(s):s[r.key]},r.key))},s.id||t))})]})}),i>1&&e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50",children:[e.jsxs("span",{className:"text-sm text-gray-500",children:["Showing ",a*o+1,"–",Math.min((a+1)*o,c.length)," of ",c.length]}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx("button",{onClick:()=>d(s=>Math.max(0,s-1)),disabled:a===0,className:"p-1 rounded hover:bg-gray-200 disabled:opacity-40",children:e.jsx(w,{className:"w-4 h-4"})}),Array.from({length:i},(s,t)=>e.jsx("button",{onClick:()=>d(t),className:`px-2.5 py-1 text-xs rounded ${t===a?"bg-primary-800 text-white":"hover:bg-gray-200"}`,children:t+1},t)),e.jsx("button",{onClick:()=>d(s=>Math.min(i-1,s+1)),disabled:a===i-1,className:"p-1 rounded hover:bg-gray-200 disabled:opacity-40",children:e.jsx(v,{className:"w-4 h-4"})})]})]})]})}export{M as D};
