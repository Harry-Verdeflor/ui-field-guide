/* UI Field Guide: icons and drawing helpers shared by every demo. Load first. */
/* ---------- icons ---------- */
const P={
search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 20.5a2 2 0 0 0 4 0"/>',
home:'<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
kebab:'<circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>',
meat:'<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>',
chr:'<path d="M9 6l6 6-6 6"/>',chl:'<path d="M15 6l-6 6 6 6"/>',chd:'<path d="M6 9l6 6 6-6"/>',chu:'<path d="M6 15l6-6 6 6"/>',
back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
play:'<path d="M8 5l11 7-11 7z"/>',
img:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 7"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
check:'<path d="M5 12l5 5 9-10"/>',
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
folder:'<path d="M3 6h7l2 2h9v11H3z"/>',
pin:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
sword:'<path d="M20 4l-9.5 9.5M20 4h-4M20 4v4M7 13l4 4M5 15l4 4M8.5 15.5L4 20"/>',
potion:'<path d="M9 3h6M10 3v5.5L5.2 16.6A3 3 0 0 0 7.8 21h8.4a3 3 0 0 0 2.6-4.4L14 8.5V3"/><path d="M7 15h10"/>',
key:'<circle cx="7.5" cy="16.5" r="4"/><path d="M10.5 13.5L20 4M16 8l3 3M14 10l2 2"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
warn:'<path d="M12 3l10 18H2zM12 10v5M12 18v.5"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
vol:'<path d="M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6"/>',
layers:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
link:'<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5"/>',
refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
sort:'<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',
code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
undo:'<path d="M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-4"/>',
redo:'<path d="M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h4"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
chat:'<path d="M4 5h16v11H9l-5 4z"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
grid:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>',
hand:'<path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6 7s-5-2-6.5-5L3 13a1.5 1.5 0 0 1 2.5-1.5L8 14"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2-1 3-1a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
access:'<circle cx="12" cy="4.5" r="2"/><path d="M4 8.5l8 2 8-2M12 10.5v4.5l-4 6M12 15l4 6"/>',
cart:'<path d="M3 4h3l2 12h11l2-8H7"/><circle cx="10" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
check2:'<path d="M5 12l5 5 9-10"/>',
mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'
};
const FILLED=new Set(['kebab','meat','play']);
const I=(n,c='')=>`<svg class="i ${FILLED.has(n)?'f ':''}${c}" data-ic="${n}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;
const SPP='M12 1c.7 5.6 2.6 9.5 11 11-8.4 1.5-10.3 5.4-11 11-.7-5.6-2.6-9.5-11-11 8.4-1.5 10.3-5.4 11-11z';
const SP=`<svg class="sp" viewBox="0 0 24 24" aria-hidden="true"><path d="${SPP}"/></svg>`;
const L=(w,c='')=>`<i class="ln ${c}" style="width:${w}px"></i>`;
const B=(t,c='')=>`<span class="btn ${c}">${t}</span>`;
const IN=(t,c='',pre='',suf='')=>`<span class="inp ${c}">${pre}<span class="it">${t}</span>${suf}</span>`;
const CB=(n,c='')=>`<span class="cb ${c}">${I(n)}</span>`;
const FL=`<div class="col" style="padding:10px">${L(70)}${L(120,'m t')}${L(100,'m t')}${L(110,'m t')}</div>`;
const CUR=(x,y)=>`<svg class="cur" style="left:${x}px;top:${y}px" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v16l4-4 3 7 3-1-3-7h6z"/></svg>`;
const CAL=f=>`<div class="cal">${'MTWTFSS'.split('').map(d=>`<span class="h">${d}</span>`).join('')}${Array.from({length:14},(_,i)=>`<span class="${f(i+1)}">${i+1}</span>`).join('')}</div>`;
const chkRow=(t,c)=>`<label class="row b sm"><button type="button" class="chk ${c}" ${c==='ind'?'':'data-tg'} aria-label="${t}">${I(c==='ind'?'minus':'check')}</button>${t}</label>`;
const SV=(w,h,inner,vb)=>`<svg viewBox="${vb||`0 0 ${w} ${h}`}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const MINI=(inner,w=46,h=72)=>`<span class="phone" style="width:${w}px;height:${h}px;border-radius:10px;display:flex;flex-direction:column;gap:4px;padding:6px">${inner}</span>`;

/* ---------- extra icons & helpers ---------- */
Object.assign(P,{
type:'<path d="M5 7V4h14v3M12 4v16M9 20h6"/>',
wand:'<path d="M15 4V2M15 10V8M11 6h2M17 6h2M4 20L14 10M18 9l1 1M12 3l1 1"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
send:'<path d="M4 12l16-8-6 16-2-7z"/>',
clip2:'<path d="M20 12l-8 8a5 5 0 0 1-7-7l9-9a3 3 0 0 1 4 4l-9 9a1 1 0 0 1-2-2l8-8"/>',
bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
download:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
crop:'<path d="M6 2v16h16M2 6h16v16"/>',
cube:'<path d="M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12v10M12 12L3 7"/>',
watch:'<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/>',
tv:'<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8"/>',
term:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
ruler:'<path d="M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
drop:'<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>',
bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z"/>',
flag:'<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
question:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17v.5"/>',
sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
puzzle:'<path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4H4z"/>',
wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M9 17a4 4 0 0 1 6 0M12 20v.5"/>',
branch:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11c0 4-6 3-12 6"/>'
});
const TX=(x,y,t,s=8,a='start')=>`<text x="${x}" y="${y}" font-size="${s}" fill="currentColor" stroke="none" font-family="Courier Prime,monospace" text-anchor="${a}">${t}</text>`;
const CODE=t=>`<pre class="code" style="font-size:10px">${t}</pre>`;
const CH=(arr,on=-1)=>`<span class="row" style="flex-wrap:wrap;gap:5px;max-width:186px;justify-content:center">${arr.map((t,i)=>`<span class="chip sm ${i===on?'on':''}">${t}</span>`).join('')}</span>`;
const SW=(c,s=22)=>`<i class="sw" style="background:${c};width:${s}px;height:${s}px;flex:none"></i>`;
const SWS=(a,s)=>`<span class="row" style="gap:4px">${a.map(c=>SW(c,s)).join('')}</span>`;
const GB=(bad,good)=>`<div class="col" style="gap:8px;width:184px"><span class="row b xs" style="gap:6px;align-items:flex-start"><span style="color:var(--danger)">${I('x','s')}</span><span>${bad}</span></span><span class="row b xs" style="gap:6px;align-items:flex-start"><span style="color:var(--ok)">${I('check','s')}</span><span>${good}</span></span></div>`;
const LB=t=>`<span class="mono xs">${t}</span>`;
const BIG=(t,s=34)=>`<b class="fr" style="font-size:${s}px;line-height:1">${t}</b>`;
const SCR=(inner,w=176,h=124)=>`<div class="frame" style="width:${w}px;height:${h}px;padding:9px;display:flex;flex-direction:column;gap:5px">${inner}</div>`;
const MV=(cls,st='')=>`<div class="trk"><span class="mv ${cls}" style="${st}"></span></div>`;
const RND=(n,seed=3)=>{let s=seed;return Array.from({length:n},()=>{s=(s*9301+49297)%233280;return s/233280;});};
const AX='<path d="M10 80h156M10 6v74" stroke-width="2"/>';
const BAR=(v,lab)=>{const bw=150/v.length;return SV(170,88,AX+v.map((x,i)=>`<rect x="${14+i*bw}" y="${80-x}" width="${bw-6}" height="${x}" rx="3" fill="${i%2?'var(--mute)':'currentColor'}" stroke="none"/>${lab?TX(14+i*bw+(bw-6)/2,76-x,x,8,'middle'):''}`).join(''));};
const LINE=(v,area,extra='')=>{const st=150/(v.length-1);const p=v.map((y,i)=>`${12+i*st} ${80-y}`);return SV(170,88,AX+extra+(area?`<path d="M12 80L${p.join('L')}L${12+(v.length-1)*st} 80Z" fill="currentColor" opacity=".22" stroke="none"/>`:'')+`<path d="M${p.join('L')}"/>`+(area?'':v.map((y,i)=>`<circle cx="${12+i*st}" cy="${80-y}" r="3" fill="var(--paper)"/>`).join('')));};
const PIE=(st,donut,label='')=>`<span style="position:relative;display:inline-grid;place-items:center;width:86px;height:86px;border-radius:50%;background:conic-gradient(${st});${donut?'-webkit-mask:radial-gradient(circle,transparent 37%,#000 38%);mask:radial-gradient(circle,transparent 37%,#000 38%)':''}"></span>${label}`;
const QR=()=>{let s=7,r='';const N=21,c=4;const fp=(x,y)=>`<rect x="${x*c}" y="${y*c}" width="${7*c}" height="${7*c}"/><rect x="${x*c+c}" y="${y*c+c}" width="${5*c}" height="${5*c}" fill="var(--paper)"/><rect x="${x*c+2*c}" y="${y*c+2*c}" width="${3*c}" height="${3*c}"/>`;for(let y=0;y<N;y++)for(let x=0;x<N;x++){if((x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12))continue;s=(s*9301+49297)%233280;if(s/233280>.5)r+=`<rect x="${x*c}" y="${y*c}" width="${c}" height="${c}"/>`;}return `<span style="background:var(--paper);padding:8px;border:var(--bw,2px) solid var(--ink);border-radius:10px;display:inline-block;line-height:0"><svg viewBox="0 0 ${N*c} ${N*c}" width="86" height="86" fill="currentColor" aria-hidden="true">${r}${fp(0,0)}${fp(14,0)}${fp(0,14)}</svg></span>`;};
const TYPO=k=>{const L2=[['ascender',26],['cap height',31],['x-height',43],['baseline',70],['descender',83]];return SV(180,96,`<text x="6" y="70" font-size="56" font-family="Fraunces,Georgia,serif" font-weight="800" fill="currentColor" stroke="none">Hxgdy</text>`+L2.map(([n,y])=>`<path d="M2 ${y}H178" stroke-width="${n===k?2:1}" stroke="${n===k?'#c8372d':'currentColor'}" opacity="${n===k?1:.25}" stroke-dasharray="${n===k?'':'3 3'}"/>${n===k?`<text x="176" y="${y-3}" font-size="8" text-anchor="end" fill="#c8372d" stroke="none" font-family="Courier Prime,monospace">${n}</text>`:''}`).join(''));};
const FXD=(prop,opts,base,items=3)=>`<div class="col" data-demo style="gap:8px;width:186px;align-items:center"><div class="fx" data-tgt style="${base};width:170px">${'<i></i>'.repeat(items)}</div><span class="seg sm" data-group>${opts.map(([l,v],i)=>`<button type="button" data-rg data-css="${prop}:${v}" class="${i?'':'on'}">${l}</button>`).join('')}</span></div>`;
const HUE=(c,l)=>`<span class="col" style="align-items:center;gap:3px">${SW(c,30)}${LB(l)}</span>`;
