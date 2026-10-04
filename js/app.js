/* UI Field Guide: render, interactions, playground, prompt builder, share links. Needs helpers.js and terms.js. */
/* ---------- render ---------- */
const total=D.reduce((n,s)=>n+s.items.length,0);
const ALL=[];D.forEach(s=>s.items.forEach(it=>ALL.push({n:it[0],a:it[1],d:it[2],demo:it[3],sec:s.id})));
/* Remixes can arrive from share links and backup files, so every one is validated
   field by field and its HTML is stripped of anything that can run code. */
const BAD_TAG=/^(script|iframe|frame|frameset|object|embed|applet|link|meta|base|style|template|noscript|form|portal|set|foreignobject|handler|listener)$/i;
const URL_ATTR=/^(href|xlink:href|src|srcset|action|formaction|poster|background|data|codebase)$/;
const BAD_URL=/^(javascript|vbscript|data(?!:image\/(png|gif|jpe?g|webp)[;,]))/i;
const cleanFrag=h=>{const t=document.createElement('template');t.innerHTML=String(h);const rm=[];
  const w=document.createTreeWalker(t.content,NodeFilter.SHOW_ELEMENT);let n;
  while((n=w.nextNode())){if(BAD_TAG.test(n.localName)){rm.push(n);continue;}
    for(const a of [...n.attributes]){const k=a.name.toLowerCase(),v=a.value.replace(/[\u0000- ]+/g,'');
      if(k.startsWith('on')||k==='srcdoc'||(URL_ATTR.test(k)&&BAD_URL.test(v))||(k==='attributename'&&/href|^on/i.test(v))||(k==='style'&&/url\((?!['"]?(#|data:image\/))/i.test(v)))n.removeAttribute(a.name);}}
  rm.forEach(x=>x.remove());return t.innerHTML;};
const HEXC=/^#[0-9a-f]{3,8}$/i,clampN=(v,lo,hi)=>Number.isFinite(+v)?Math.min(hi,Math.max(lo,+v)):null;
const cleanRemix=r=>{if(!r||typeof r!=='object')return null;const o={};
  ['ink','paper','soft','accent','bg'].forEach(k=>{if(typeof r[k]==='string'&&HEXC.test(r[k]))o[k]=r[k];});
  [['sc',.5,2.5],['bw',1,6],['rot',-20,20]].forEach(([k,lo,hi])=>{if(r[k]!=null){const v=clampN(r[k],lo,hi);if(v!=null)o[k]=v;}});
  if(['','sharp','round'].includes(r.corners))o.corners=r.corners;
  if(['','f-sans','f-serif','f-mono','f-sys'].includes(r.font))o.font=r.font;
  if(typeof r.html==='string'&&r.html.length<=200000)o.html=cleanFrag(r.html);
  return Object.keys(o).length?o:null;};
const cleanRemixes=obj=>{const out={};if(obj&&typeof obj==='object')for(const k in obj){if(!Object.prototype.hasOwnProperty.call(obj,k)||!ALL.some(t=>t.n===k))continue;const c=cleanRemix(obj[k]);if(c)out[k]=c;}return out;};
let REM={};try{REM=cleanRemixes(JSON.parse(localStorage.getItem('ufg-remix')||'{}'));}catch(e){REM={};}
let saveREM=()=>{try{localStorage.setItem('ufg-remix',JSON.stringify(REM));return true;}catch(e){return false;}};
const VMAP={ink:'--ink',paper:'--paper',soft:'--soft',accent:'--danger'};
const varStyle=st=>{let o='';for(const k in VMAP)if(st[k])o+=`${VMAP[k]}:${st[k]};`;if(st.bw!=null)o+=`--bw:${st.bw}px;`;if(st.sc!=null)o+=`--sc:${st.sc};`;if(st.rot!=null)o+=`--rot:${st.rot}deg;`;return o;};
const stageInner=i=>{const st=REM[ALL[i].n];if(!st)return ALL[i].demo;return `<div class="pv ${st.corners||''} ${st.font||''}" style="${varStyle(st)}">${st.html!=null?st.html:ALL[i].demo}</div>`;};
const stageBg=i=>{const st=REM[ALL[i].n];return st&&st.bg?`background-color:${st.bg}`:'';};
const playIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SPP}"/></svg>`;
const navItem=s=>`<li><a href="#s-${s.id}" data-sec="${s.id}"><span class="ci"><svg viewBox="0 0 24 24" aria-hidden="true">${P[s.ic]}</svg></span>${s.t}<span class="n">${s.items.length}</span></a></li>`;
let gi=0;
document.getElementById('sections').innerHTML=D.map((s,si)=>`
<section class="cat" id="s-${s.id}" aria-labelledby="h-${s.id}">
  <div class="sh">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SPP}"/></svg>
    <h2 id="h-${s.id}">${s.t}</h2>
    <span class="lvt">lv. ${si+1} <small>(${s.items.length} terms)</small></span>
    <p>${s.blurb}</p>
  </div>
  <div class="cards">${s.items.map(([n,a,d])=>{const i=gi++;return `
    <article class="card" id="c-${i}" data-k="${(n+' '+a+' '+d+' '+s.t).toLowerCase().replace(/"/g,'')}">
      <div class="st" style="${stageBg(i)}">${stageInner(i)}</div>
      <div class="tx"><h3>${n}${REM[n]?'<span class="remixed">remixed</span>':''}</h3><p class="aka">${a}</p><p class="df">${d}</p>
      <button type="button" class="playb" data-play="${i}" aria-label="Play with ${n.replace(/"/g,'')}">${playIcon}Play with it</button></div>
    </article>`;}).join('')}
  </div>
</section>`).join('');
document.getElementById('sideNav').innerHTML=D.map(navItem).join('');
document.getElementById('sheetList').innerHTML=D.map(navItem).join('');
document.getElementById('totalSmall').textContent=`(${total} terms)`;
document.getElementById('expMax').textContent=`${total} terms`;
document.getElementById('lvNum').textContent=`lv. ${D.length}`;
document.getElementById('footTotal').textContent=`That’s all ${total} terms across ${D.length} categories.`;
const refreshCard=i=>{const c=document.getElementById('c-'+i);if(!c)return;const st=c.querySelector('.st');st.setAttribute('style',stageBg(i));st.innerHTML=stageInner(i);const h=c.querySelector('h3');h.innerHTML=ALL[i].n+(REM[ALL[i].n]?'<span class="remixed">remixed</span>':'');syncRanges(c);};

/* ---------- interactions ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tg],[data-rg],[data-step],[data-star],[data-tgp]');
  if(!t) return;
  if(t.hasAttribute('data-tg')){t.classList.toggle('on');t.setAttribute('aria-pressed',t.classList.contains('on'));}
  else if(t.hasAttribute('data-tgp')){t.parentElement.classList.toggle('on');}
  else if(t.hasAttribute('data-rg')){const g=t.closest('[data-group]');if(g)g.querySelectorAll('[data-rg]').forEach(b=>b.classList.toggle('on',b===t));
    if(t.dataset.css){const d=t.closest('[data-demo]');const tg=d&&d.querySelector('[data-tgt]');if(tg){const k=t.dataset.css.indexOf(':');tg.style.setProperty(t.dataset.css.slice(0,k),t.dataset.css.slice(k+1));}}}
  else if(t.hasAttribute('data-step')){const v=t.parentElement.querySelector('.val');v.textContent=Math.max(0,Math.min(99,+v.textContent+ +t.dataset.step));}
  else if(t.hasAttribute('data-star')){const n=+t.dataset.star;t.parentElement.querySelectorAll('[data-star]').forEach(s=>s.classList.toggle('on',+s.dataset.star<=n));}
});
document.addEventListener('input',e=>{
  const r=e.target;
  if(r.classList&&r.classList.contains('rg'))r.style.setProperty('--p',r.value+'%');
  if(r.classList&&r.classList.contains('knobr')){const k=r.parentElement.querySelector('.knob');if(k)k.style.setProperty('--a',r.value+'deg');}
  if(r.dataset&&r.dataset.var){const d=r.closest('[data-demo]');const tg=d&&d.querySelector('[data-tgt]');if(tg)tg.style.setProperty(r.dataset.var,r.value);}
});
const syncRanges=root=>root.querySelectorAll('.rg').forEach(r=>r.style.setProperty('--p',r.value+'%'));
syncRanges(document);

/* ---------- playground (advanced, per-component editors) ---------- */
const $=id=>document.getElementById(id);
const pgm=$('pgm'),pv=$('pv'),pgs=$('pgs'),code=$('pgCode'),msg=$('pgMsg'),paneComp=$('paneComp'),treeEl=$('tree'),propsEl=$('props'),selbox=$('selbox');
const knobs=[...pgm.querySelectorAll('[data-k]')];
const cs=el=>getComputedStyle(el);
const hex=v=>{v=(v||'').trim();if(/^#[0-9a-f]{3}$/i.test(v))return '#'+v[1]+v[1]+v[2]+v[2]+v[3]+v[3];if(/^#[0-9a-f]{6}$/i.test(v))return v.toLowerCase();
  let m=v.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/);if(m)return '#'+[m[1],m[2],m[3]].map(x=>Math.round(+x).toString(16).padStart(2,'0')).join('');
  m=v.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);if(m)return '#'+[m[1],m[2],m[3]].map(x=>Math.round(+x*255).toString(16).padStart(2,'0')).join('');return '#000000';};
const DEF=()=>{const c=cs(document.documentElement);const g=v=>hex(c.getPropertyValue(v));return{ink:g('--ink'),paper:g('--paper'),soft:g('--soft'),accent:g('--danger'),bg:g('--bg'),sc:1,bw:2,rot:0,corners:'',font:''};};
let cur=-1,state={},touched=new Set(),lastBtn=null,baseline='',hist=[],hi=-1,tool='interact',zoom=1.6,sel=null,bgMode=0,histT=null,treeT=null;
const fmt={sc:v=>`${(+v).toFixed(2)}×`,bw:v=>`${v}px`,rot:v=>`${v}°`};
const fmtN=v=>{v=+v;return Math.abs(v)>=10||Number.isInteger(v)?String(Math.round(v*10)/10):v.toFixed(2);};

/* theme */
const applyTheme=()=>{
  const keep=[...pv.classList].filter(c=>c.startsWith('sim-')||c==='selmode');
  pv.className=['pv',state.corners,state.font,...keep].filter(Boolean).join(' ');
  pv.style.cssText=varStyle(state)+`--zoom:${zoom};`;
  pgs.style.backgroundColor=bgMode===3?'':state.bg;
  knobs.forEach(k=>{const v=pgm.querySelector(`[data-v="${k.dataset.k}"]`);if(v)v.textContent=fmt[k.dataset.k](state[k.dataset.k]);});
  $('zLbl').textContent=Math.round(zoom*100)+'%';
  requestAnimationFrame(updateSel);
};

/* history */
const snap=()=>({h:pv.innerHTML,s:JSON.stringify(state)});
const pushHist=()=>{const s=snap();const c=hist[hi];if(c&&c.h===s.h&&c.s===s.s)return;hist=hist.slice(0,hi+1);hist.push(s);if(hist.length>100)hist.shift();hi=hist.length-1;histBtns();};
const histBtns=()=>{$('undoB').disabled=hi<=0;$('redoB').disabled=hi>=hist.length-1;};
const restore=s=>{pv.innerHTML=s.h;state=Object.assign(DEF(),JSON.parse(s.s));knobs.forEach(k=>{k.value=state[k.dataset.k];});syncRanges(pv);sel=null;applyTheme();code.value=pv.innerHTML;rebuildAll();};
const undo=()=>{if(hi>0){hi--;restore(hist[hi]);histBtns();}};
const redo=()=>{if(hi<hist.length-1){hi++;restore(hist[hi]);histBtns();}};

/* change pipeline */
const changed=(o={})=>{
  if(document.activeElement!==code)code.value=pv.innerHTML;
  clearTimeout(histT);histT=setTimeout(pushHist,350);
  if(o.rebuild)buildComp();
  updateSel();clearTimeout(window._prT);window._prT=setTimeout(()=>{if(typeof refreshPrompt==='function')refreshPrompt();},400);
  if(!$('paneInsp').hidden){clearTimeout(treeT);treeT=setTimeout(()=>{buildTree();if(o.props&&sel)buildProps();},250);}
};

/* ---------- control kit ---------- */
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const row=(label,input,out)=>{const r=mk('label','ctl');r.append(mk('span','',label),input);r.append(out||mk('span'));return r;};
const C={
  text:(label,get,set,o={})=>{const i=o.area?mk('textarea'):mk('input');if(!o.area)i.type='text';i.value=get();if(o.ph)i.placeholder=o.ph;
    let t;const go=()=>{set(i.value);changed({rebuild:o.rebuild});};i.addEventListener('input',()=>{if(o.rebuild){clearTimeout(t);t=setTimeout(go,450);}else go();});return row(label,i);},
  range:(label,min,max,step,get,set,unit='',o={})=>{const i=mk('input');i.type='range';i.min=min;i.max=max;i.step=step;i.value=get();const out=mk('span','rv',fmtN(i.value)+unit);
    i.addEventListener('input',()=>{out.textContent=fmtN(i.value)+unit;set(+i.value);changed({rebuild:o.rebuild});});return row(label,i,out);},
  color:(label,get,set)=>{const i=mk('input');i.type='color';i.value=hex(get());i.addEventListener('input',()=>{set(i.value);changed();});return row(label,i);},
  select:(label,opts,get,set,o={})=>{const s=mk('select');opts.forEach(op=>{const[v,t]=Array.isArray(op)?op:[op,op];const e=mk('option');e.value=v;e.textContent=t;s.append(e);});s.value=get();
    s.addEventListener('change',()=>{set(s.value);changed({rebuild:o.rebuild});});return row(label,s);},
  toggle:(label,get,set,o={})=>{const b=mk('button','tg'+(get()?' on':''));b.type='button';b.setAttribute('role','switch');b.setAttribute('aria-checked',!!get());
    b.addEventListener('click',e=>{e.preventDefault();const v=!b.classList.contains('on');b.classList.toggle('on',v);b.setAttribute('aria-checked',v);set(v);changed({rebuild:o.rebuild});});return row(label,b);},
  btns:arr=>{const w=mk('div','cbtns');arr.forEach(([t,fn])=>{const b=mk('button','',t);b.type='button';b.addEventListener('click',e=>{e.preventDefault();fn();});w.append(b);});return w;},
  note:t=>mk('p','cnote',t)
};
const sec=(title,kids,tag='',open=true)=>{const d=mk('details','sec');d.open=open;const s=mk('summary','',`<span>${title}</span>${tag?`<span class="tag">${tag}</span>`:''}`);d.append(s);const b=mk('div','secb');kids.filter(Boolean).forEach(k=>b.append(k));d.append(b);return d;};
const txtNodes=el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue.trim()?1:3});const a=[];while(w.nextNode())a.push(w.currentNode);return a;};
const tGet=el=>{const n=txtNodes(el);return n.length?n.map(x=>x.nodeValue).join('').trim():'';};
const tSet=(el,v)=>{const n=txtNodes(el);if(n.length){n[0].nodeValue=v;n.slice(1).forEach(x=>x.nodeValue='');}else el.append(document.createTextNode(v));};
const swapCls=(el,list,v)=>{list.forEach(c=>c&&el.classList.remove(c));if(v)el.classList.add(v);};
const short=(s,n=22)=>{s=(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n)+'…':s;};
const ICONS=Object.keys(P).sort();
const setIcon=(svg,n)=>{svg.innerHTML=P[n]||'';svg.dataset.ic=n;svg.classList.toggle('f',FILLED.has(n));};
const onOf=(item)=>item.matches('[data-rg],[data-tg]')?item:(item.querySelector('[data-rg],[data-tg],.rad,.chk')||item);

/* ---------- recipes: each UI part gets its own controls ---------- */
const HANDLED='.btn,.chip,.inp,.av,.lbx,.otp,.cal,[data-group],.tbl,.code,.stepper,.pbar,.bdg,.tg,.chk,.rad,.wz,.pg,.bm,.ctr';
const COVERED=new Set();
const RECIPES=[
 {t:'Slider',q:'input[type=range]',b:el=>[
   C.range('Value',+el.min||0,+el.max||100,+el.step||1,()=>el.value,v=>{el.value=v;el.setAttribute('value',v);el.dispatchEvent(new Event('input',{bubbles:true}));}),
   C.text('Min',()=>el.getAttribute('min')||'0',v=>{el.setAttribute('min',v);syncRanges(pv);},{rebuild:1}),
   C.text('Max',()=>el.getAttribute('max')||'100',v=>{el.setAttribute('max',v);syncRanges(pv);},{rebuild:1}),
   C.text('Step',()=>el.getAttribute('step')||'1',v=>el.setAttribute('step',v),{rebuild:1}),
   el.classList.contains('rg')&&C.range('Track height',4,32,1,()=>parseFloat(cs(el).height)||12,v=>el.style.height=v+'px','px'),
   el.classList.contains('rg')&&C.range('Thumb size',10,44,1,()=>parseFloat(el.style.getPropertyValue('--th'))||24,v=>el.style.setProperty('--th',v+'px'),'px'),
   C.range('Width',60,340,2,()=>el.offsetWidth||160,v=>el.style.width=v+'px','px'),
   C.color('Fill',()=>cs(el).getPropertyValue('--ink'),v=>{el.style.setProperty('--ink',v);el.style.accentColor=v;})]},
 {t:'Button',q:'.btn',max:6,b:el=>[
   C.text('Label',()=>tGet(el),v=>tSet(el,v)),
   C.select('Style',[['','Outline'],['fill','Filled'],['soft','Soft'],['text','Text only'],['danger','Danger']],()=>['fill','soft','text','danger'].find(c=>el.classList.contains(c))||'',v=>swapCls(el,['fill','soft','text','danger'],v)),
   C.select('Size',[['xs','Tiny'],['sm','Small'],['','Medium'],['big','Large']],()=>['xs','sm','big'].find(c=>el.classList.contains(c))||'',v=>swapCls(el,['xs','sm','big'],v)),
   C.select('Shape',[['','Pill'],['10px','Rounded'],['0px','Square']],()=>el.style.borderRadius||'',v=>el.style.borderRadius=v),
   C.select('Icon',[['','None'],...ICONS.map(n=>[n,n])],()=>{const s=el.querySelector('svg.i');return s?(s.dataset.ic||''):'';},v=>{const s=el.querySelector('svg.i');if(!v){if(s)s.remove();return;}if(s)setIcon(s,v);else el.insertAdjacentHTML('afterbegin',I(v,'s'));}),
   C.toggle('All caps',()=>cs(el).textTransform==='uppercase',v=>el.style.textTransform=v?'uppercase':'none'),
   C.range('Letter spacing',-0.05,0.3,0.01,()=>{const c=cs(el);return Math.round((parseFloat(c.letterSpacing)||0)/parseFloat(c.fontSize)*100)/100;},v=>el.style.letterSpacing=v+'em','em'),
   C.toggle('Disabled',()=>el.classList.contains('dis'),v=>el.classList.toggle('dis',v)),
   C.color('Color',()=>cs(el).backgroundColor,v=>{el.style.backgroundColor=v;el.style.borderColor=v;})]},
 {t:'Toggle switch',q:'.tg',b:el=>[
   C.toggle('On',()=>el.classList.contains('on'),v=>{el.classList.toggle('on',v);el.setAttribute('aria-pressed',v);}),
   C.range('Scale',.5,2.2,.05,()=>parseFloat(el.style.scale)||1,v=>el.style.scale=v,'×'),
   C.color('On color',()=>cs(el).getPropertyValue('--ink'),v=>el.style.setProperty('--ink',v))]},
 {t:'Checkbox',q:'.chk',b:el=>[
   C.select('State',[['','Unchecked'],['on','Checked'],['ind','Indeterminate']],()=>el.classList.contains('ind')?'ind':el.classList.contains('on')?'on':'',v=>{swapCls(el,['on','ind'],v);const s=el.querySelector('svg.i');if(s)setIcon(s,v==='ind'?'minus':'check');}),
   C.range('Size',14,44,1,()=>el.offsetWidth||20,v=>{el.style.width=el.style.height=v+'px';el.style.borderRadius=Math.round(v*.3)+'px';},'px')]},
 {t:'Radio button',q:'.rad',b:el=>[
   C.toggle('Selected',()=>el.classList.contains('on'),v=>{const g=el.closest('[data-group]');if(v&&g)g.querySelectorAll('.rad').forEach(r=>r.classList.remove('on'));el.classList.toggle('on',v);}),
   C.range('Size',14,44,1,()=>el.offsetWidth||20,v=>el.style.width=el.style.height=v+'px','px')]},
 {t:'Chip',q:'.chip',max:8,b:el=>[
   C.text('Label',()=>tGet(el),v=>tSet(el,v)),
   C.toggle('Selected',()=>el.classList.contains('on'),v=>el.classList.toggle('on',v)),
   C.select('Size',[['sm','Small'],['','Medium']],()=>el.classList.contains('sm')?'sm':'',v=>swapCls(el,['sm'],v))]},
 {t:'Input field',q:'.inp',max:6,b:el=>{const it=el.querySelector('.it')||el;return [
   C.text('Text',()=>tGet(it),v=>tSet(it,v)),
   C.toggle('Looks like placeholder',()=>!!it.querySelector('.ph')||it.classList.contains('ph'),v=>it.classList.toggle('ph',v)),
   C.select('State',[['','Default'],['err','Error'],['ro','Read-only'],['dis','Disabled'],['focus','Focused']],()=>['err','ro','dis'].find(c=>el.classList.contains(c))||(el.style.outlineStyle==='solid'?'focus':''),
     v=>{swapCls(el,['err','ro','dis'],v==='focus'?'':v);el.style.outline=v==='focus'?'3px solid var(--ink)':'';el.style.outlineOffset=v==='focus'?'3px':'';}),
   C.select('Shape',[['','Rounded'],['pill','Pill'],['sq','Square']],()=>el.classList.contains('pill')?'pill':el.style.borderRadius==='0px'?'sq':'',v=>{el.classList.toggle('pill',v==='pill');el.style.borderRadius=v==='sq'?'0px':'';}),
   C.range('Width',60,340,2,()=>el.offsetWidth||150,v=>{el.style.width=v+'px';el.style.minWidth='0';},'px')];}},
 {t:'Progress bar',q:'.pbar',b:el=>{const f=el.querySelector('i');return [
   f&&C.range('Value',0,100,1,()=>parseFloat(f.style.width)||0,v=>f.style.width=v+'%','%'),
   C.range('Thickness',6,44,1,()=>el.offsetHeight||20,v=>el.style.height=v+'px','px'),
   f&&C.color('Fill',()=>cs(f).backgroundColor,v=>f.style.background=v),
   C.color('Track',()=>cs(el).backgroundColor,v=>el.style.background=v)];}},
 {t:'Progress ring',q:'circle[stroke-dasharray]',b:el=>{const r=+el.getAttribute('r')||24,cir=2*Math.PI*r;const txt=el.ownerSVGElement&&el.ownerSVGElement.querySelector('text');return [
   C.range('Value',0,100,1,()=>Math.round(parseFloat(el.getAttribute('stroke-dasharray'))/cir*100),v=>{el.setAttribute('stroke-dasharray',`${(v/100*cir).toFixed(1)} ${cir.toFixed(1)}`);if(txt&&/%$/.test(txt.textContent))txt.textContent=v+'%';},'%'),
   C.range('Thickness',2,16,1,()=>+el.getAttribute('stroke-width')||7,v=>{el.setAttribute('stroke-width',v);const bg=el.previousElementSibling;if(bg&&bg.tagName==='circle')bg.setAttribute('stroke-width',v);}),
   C.color('Color',()=>cs(el).stroke,v=>el.style.stroke=v)];}},
 {t:'Star rating',q:'.stars',b:el=>[C.range('Rating',0,5,1,()=>el.querySelectorAll('.on').length,v=>el.querySelectorAll('[data-star]').forEach(s=>s.classList.toggle('on',+s.dataset.star<=v)),' ★')]},
 {t:'Stepper',q:'.stepper',b:el=>{const v=el.querySelector('.val');return [C.range('Value',0,99,1,()=>+v.textContent||0,x=>v.textContent=x)];}},
 {t:'Options',q:'[data-group]',max:3,name:el=>el.classList.contains('tabs')?'Tabs':el.classList.contains('seg')?'Segmented control':el.classList.contains('dots')?'Carousel dots':'Option group',b:el=>{
   const items=()=>[...el.children];const hasText=items().some(c=>tGet(c));
   const rebuild=labels=>{const its=items();const act=Math.max(0,its.findIndex(c=>onOf(c).classList.contains('on')));const tpl=its[0].cloneNode(true);el.innerHTML='';
     labels.forEach((l,i)=>{const src=its[i]?its[i].cloneNode(true):tpl.cloneNode(true);if(hasText)tSet(src,l);onOf(src).classList.toggle('on',i===Math.min(act,labels.length-1));el.append(src);});};
   return [hasText?C.text('Options',()=>items().map(tGet).join('\n'),v=>rebuild(v.split('\n').map(s=>s.trim()).filter(Boolean)),{area:1,rebuild:1}):
     C.range('Count',1,10,1,()=>items().length,n=>rebuild(Array.from({length:n},()=>'')),'',{rebuild:1}),
     C.select('Active',items().map((c,i)=>[String(i),hasText?short(tGet(c),18):'#'+(i+1)]),()=>String(Math.max(0,items().findIndex(c=>onOf(c).classList.contains('on')))),v=>items().forEach((c,i)=>onOf(c).classList.toggle('on',i===+v)))];}},
 {t:'List',q:'.lbx',max:3,b:el=>{const its=()=>[...el.children];return [
   C.text('Items',()=>its().map(tGet).join('\n'),v=>{const old=its();const tpl=old[old.length-1];const act=old.findIndex(c=>c.classList.contains('on'));el.innerHTML='';
     v.split('\n').filter(s=>s.trim()).forEach((l,i)=>{const n=(old[i]||tpl).cloneNode(true);n.classList.toggle('on',i===act);tSet(n,l);el.append(n);});},{area:1,rebuild:1}),
   C.select('Selected',[['-1','None'],...its().map((c,i)=>[String(i),short(tGet(c),18)])],()=>String(its().findIndex(c=>c.classList.contains('on'))),v=>its().forEach((c,i)=>c.classList.toggle('on',i===+v)))];}},
 {t:'Avatar',q:'.av',max:5,b:el=>[
   C.text('Initials',()=>tGet(el),v=>tSet(el,v)),
   C.range('Size',16,90,1,()=>el.offsetWidth||34,v=>{el.style.width=el.style.height=v+'px';el.style.fontSize=Math.round(v*.36)+'px';},'px'),
   C.select('Shape',[['50%','Circle'],['28%','Rounded'],['4px','Square']],()=>el.style.borderRadius||'50%',v=>el.style.borderRadius=v),
   C.color('Fill',()=>cs(el).backgroundColor,v=>el.style.background=v),
   C.color('Text',()=>cs(el).color,v=>el.style.color=v)]},
 {t:'Badge',q:'.bdg i',b:el=>[
   C.text('Count',()=>el.textContent,v=>{el.textContent=v;el.classList.toggle('dot',!v);},{ph:'empty = dot'}),
   C.color('Color',()=>cs(el).backgroundColor,v=>el.style.background=v)]},
 {t:'Calendar',q:'.cal',b:el=>{const days=()=>[...el.children].filter(c=>!c.classList.contains('h'));return [
   C.text('Selected days',()=>{const on=days().filter(d=>d.classList.contains('on')).map(d=>+d.textContent);return on.length>1?`${on[0]}-${on[on.length-1]}`:on.join('');},
     v=>{const m=v.match(/(\d+)\s*-\s*(\d+)/);const a=m?+m[1]:+v,b=m?+m[2]:+v;days().forEach(d=>{const n=+d.textContent;d.classList.toggle('on',n===a||n===b);d.classList.toggle('in',!!m&&n>a&&n<b);});},{ph:'10 or 4-9'}),
   C.color('Highlight',()=>cs(el).getPropertyValue('--ink'),v=>el.style.setProperty('--ink',v))];}},
 {t:'Dial',q:'.knob',b:el=>[C.range('Angle',-135,135,1,()=>parseFloat(el.style.getPropertyValue('--a'))||0,v=>{el.style.setProperty('--a',v+'deg');const r=el.parentElement.querySelector('.knobr');if(r){r.value=v;r.setAttribute('value',v);}},'°'),
   C.range('Size',40,120,2,()=>el.offsetWidth||64,v=>{el.style.width=el.style.height=v+'px';const n=el.querySelector('i');if(n){n.style.height=v*.3+'px';n.style.transformOrigin=`2px ${v/2-6}px`;}},'px')]},
 {t:'Code boxes',find:()=>[...new Set([...pv.querySelectorAll('.otp')].map(o=>o.parentElement))].filter(p=>!p.matches('[data-group]')),b:el=>{const bx=()=>[...el.querySelectorAll('.otp')];return [
   C.text('Code',()=>bx().map(b=>b.textContent.trim()).join(''),v=>bx().forEach((b,i)=>{b.textContent=v[i]||'';b.classList.toggle('cur2',i===v.length);})),
   C.range('Boxes',3,8,1,()=>bx().length,n=>{const a=bx();while(a.length<n){const c=a[a.length-1].cloneNode(true);c.textContent='';c.classList.remove('cur2');el.append(c);a.push(c);}while(a.length>n)a.pop().remove();},'',{rebuild:1})];}},
 {t:'Swatch',q:'.sw',max:10,b:el=>[C.color('Color',()=>cs(el).backgroundColor,v=>el.style.background=v),C.range('Size',10,50,1,()=>el.offsetWidth||22,v=>el.style.width=el.style.height=v+'px','px')]},
 {t:'Chart bars',find:()=>[...pv.querySelectorAll('svg')].filter(s=>s.querySelectorAll(':scope > rect[height]').length>=3&&!s.closest('.i')),b:svg=>{const bars=[...svg.querySelectorAll(':scope > rect[height]')].filter(r=>+r.getAttribute('height')>0&&+r.getAttribute('width')<60);
   bars.forEach(x=>COVERED.add(x));const vb=(svg.getAttribute('viewBox')||'0 0 170 88').split(/[\s,]+/).map(Number);return [
   ...bars.slice(0,10).map((r,i)=>{const bottom=+r.getAttribute('y')+ +r.getAttribute('height');return C.range('Bar '+(i+1),0,Math.round(bottom-vb[1]),1,()=>+r.getAttribute('height'),v=>{r.setAttribute('height',v);r.setAttribute('y',bottom-v);const t=r.nextElementSibling;if(t&&t.tagName==='text'){t.textContent=v;t.setAttribute('y',bottom-v-4);}});}),
   C.range('Corner radius',0,12,1,()=>+bars[0].getAttribute('rx')||0,v=>bars.forEach(b=>b.setAttribute('rx',v))),
   C.color('Bar color',()=>cs(bars[0]).fill,v=>bars.forEach((b,i)=>{if(i%2===0||bars.every(x=>x.getAttribute('fill')===bars[0].getAttribute('fill')))b.style.fill=v;})),
   C.color('Alt bar color',()=>cs(bars[1]||bars[0]).fill,v=>bars.forEach((b,i)=>{if(i%2)b.style.fill=v;}))];}},
 {t:'Line data',find:()=>[...pv.querySelectorAll('svg path')].filter(p=>/^M[\d.]+ [\d.]+(L[\d.]+ [\d.]+){2,}$/.test((p.getAttribute('d')||'').trim())&&!p.closest('svg.i')),max:2,b:p=>{
   const pts=()=>p.getAttribute('d').slice(1).split('L').map(s=>s.trim().split(/\s+/).map(Number));const svg=p.ownerSVGElement;const H=+(svg.getAttribute('viewBox')||'0 0 0 88').split(/[\s,]+/)[3]||88;const base=H-8;
   const area=[...svg.querySelectorAll('path')].find(a=>a!==p&&/Z$/.test(a.getAttribute('d')||''));COVERED.add(p);if(area)COVERED.add(area);svg.querySelectorAll('circle').forEach(c=>COVERED.add(c));
   const set=(i,v)=>{const a=pts();const oldY=a[i][1];a[i][1]=base-v;p.setAttribute('d','M'+a.map(q=>q.join(' ')).join('L'));
     svg.querySelectorAll('circle').forEach(c=>{if(Math.abs(+c.getAttribute('cx')-a[i][0])<.5&&Math.abs(+c.getAttribute('cy')-oldY)<.5)c.setAttribute('cy',a[i][1]);});
     if(area)area.setAttribute('d',`M${a[0][0]} ${base}L${a.map(q=>q.join(' ')).join('L')}L${a[a.length-1][0]} ${base}Z`);};
   return [...pts().slice(0,10).map((q,i)=>C.range('Point '+(i+1),0,base,1,()=>Math.round(base-q[1]),v=>set(i,v))),
     C.range('Line width',1,8,.5,()=>parseFloat(cs(p).strokeWidth)||2.5,v=>p.style.strokeWidth=v),C.color('Line color',()=>cs(p).stroke,v=>p.style.stroke=v)];}},
 {t:'Pie slices',find:()=>[...pv.querySelectorAll('[style*="conic-gradient"]')].filter(e=>/%/.test(e.getAttribute('style'))),b:el=>{
   const get=()=>{const m=el.getAttribute('style').match(/conic-gradient\(([^;]*)\)\s*;/);return m?m[1]:'';};
   const parts=()=>get().split(/,(?![^(]*\))/).map(s=>s.trim());
   const write=arr=>el.setAttribute('style',el.getAttribute('style').replace(/conic-gradient\(([^;]*)\)\s*;/,`conic-gradient(${arr.join(',')});`));
   return parts().map((pt,i)=>{const m=pt.match(/^(.*?)\s+0\s+([\d.]+)%$/);if(!m)return null;return C.range('Slice '+(i+1)+' ends at',1,99,1,()=>+m[2],v=>{const a=parts();a[i]=a[i].replace(/[\d.]+%$/,v+'%');write(a);},'%');}).concat([
     C.toggle('Donut hole',()=>/mask/.test(el.getAttribute('style')),v=>{let s=el.getAttribute('style').replace(/-webkit-mask:[^;]*;?|mask:[^;]*;?/g,'');if(v)s+=';-webkit-mask:radial-gradient(circle,transparent 37%,#000 38%);mask:radial-gradient(circle,transparent 37%,#000 38%);';el.setAttribute('style',s);})]);}},
 {t:'Flex container',q:'.fx',b:el=>[
   C.select('Direction',['row','column','row-reverse','column-reverse'],()=>cs(el).flexDirection,v=>el.style.flexDirection=v),
   C.select('Justify',['flex-start','center','flex-end','space-between','space-around','space-evenly'],()=>cs(el).justifyContent.replace('normal','flex-start'),v=>el.style.justifyContent=v),
   C.select('Align',['flex-start','center','flex-end','stretch','baseline'],()=>cs(el).alignItems.replace('normal','stretch'),v=>el.style.alignItems=v),
   C.select('Wrap',['nowrap','wrap'],()=>cs(el).flexWrap,v=>el.style.flexWrap=v),
   C.range('Gap',0,30,1,()=>parseFloat(cs(el).columnGap)||6,v=>el.style.gap=v+'px','px'),
   C.range('Items',1,12,1,()=>el.children.length,n=>{while(el.children.length<n)el.append(el.lastElementChild.cloneNode(true));while(el.children.length>n)el.lastElementChild.remove();},'',{rebuild:1})]},
 {t:'Grid',find:()=>[...pv.querySelectorAll('*')].filter(e=>cs(e).display==='grid'&&e.children.length>=3&&!e.matches('.cal,.wk,.kn,.fx')&&!e.closest('svg')),max:2,b:el=>[
   C.range('Columns',1,10,1,()=>cs(el).gridTemplateColumns.split(' ').length,v=>el.style.gridTemplateColumns=`repeat(${v},minmax(0,1fr))`),
   C.range('Gap',0,30,1,()=>parseFloat(cs(el).columnGap)||0,v=>el.style.gap=v+'px','px'),
   C.range('Items',1,24,1,()=>el.children.length,n=>{while(el.children.length<n)el.append(el.lastElementChild.cloneNode(true));while(el.children.length>n)el.lastElementChild.remove();},'',{rebuild:1})]},
 {t:'Table',q:'.tbl',b:el=>[C.text('Rows (comma separated)',()=>[...el.rows].map(r=>[...r.cells].map(c=>c.textContent.trim()).join(', ')).join('\n'),v=>{
   const rows=v.split('\n').filter(s=>s.trim()).map(r=>r.split(',').map(s=>s.trim()));el.innerHTML=rows.map((r,i)=>`<tr>${r.map(c=>i?`<td>${c}</td>`:`<th>${c}</th>`).join('')}</tr>`).join('');},{area:1,rebuild:1})]},
 {t:'Code',q:'.code',b:el=>[C.text('Code',()=>el.innerText,v=>el.textContent=v,{area:1}),C.range('Font size',8,16,.5,()=>parseFloat(cs(el).fontSize),v=>el.style.fontSize=v+'px','px')]},
 {t:'Contrast check',q:'.ctr',b:el=>{const lum=h=>{const c=[1,3,5].map(i=>parseInt(hex(h).slice(i,i+2),16)/255).map(x=>x<=.03928?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
   const upd=()=>{const a=lum(cs(el).color),b=lum(cs(el).backgroundColor);const r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);const em=el.querySelector('em');if(em)em.textContent=`${r.toFixed(1)}:1 ${r>=4.5?'✓':'✕'}`;};
   return [C.color('Text',()=>cs(el).color,v=>{el.style.color=v;upd();}),C.color('Background',()=>cs(el).backgroundColor,v=>{el.style.background=v;upd();}),C.note('The ratio updates live. 4.5:1 passes for body text.')];}},
 {t:'Steps',q:'.wz',b:el=>{const st=()=>[...el.querySelectorAll(':scope > span')];return [C.range('Current step',1,st().length,1,()=>Math.max(1,st().findIndex(s=>s.classList.contains('on'))+1),v=>{
   st().forEach((s,i)=>{s.classList.toggle('done',i<v-1);s.classList.toggle('on',i===v-1);if(i>=v-1&&!s.querySelector('svg'))s.textContent=s.textContent||String(i+1);});[...el.querySelectorAll(':scope > i')].forEach((c,i)=>c.classList.toggle('m',i>=v-1));})];}},
 {t:'Pagination',q:'.pg',b:el=>{const nums=()=>[...el.children].filter(c=>!c.classList.contains('cb')&&/^\d+$/.test(c.textContent.trim()));return [
   C.select('Current page',nums().map(n=>n.textContent.trim()),()=>(nums().find(n=>n.classList.contains('on'))||nums()[0]).textContent.trim(),v=>nums().forEach(n=>n.classList.toggle('on',n.textContent.trim()===v)))];}},
 {t:'Box model',q:'.bm',max:4,name:el=>'Box model: '+short(txtNodes(el)[0]?txtNodes(el)[0].nodeValue:'',12),b:el=>[C.range('Spacing',0,24,1,()=>parseFloat(cs(el).paddingLeft)||6,v=>el.style.padding=v+'px','px')]},
 {t:'Frame',q:'.frame,.phone',max:2,b:el=>[
   C.range('Width',40,320,2,()=>el.offsetWidth,v=>el.style.width=v+'px','px'),C.range('Height',40,240,2,()=>el.offsetHeight,v=>el.style.height=v+'px','px'),
   C.range('Corner radius',0,40,1,()=>parseFloat(cs(el).borderTopLeftRadius)||0,v=>el.style.borderRadius=v+'px','px'),C.color('Fill',()=>cs(el).backgroundColor,v=>el.style.background=v)]},
 {t:'Icon',q:'svg.i',max:6,b:el=>[
   C.select('Icon',ICONS,()=>el.dataset.ic||'',v=>setIcon(el,v)),
   C.range('Size',8,64,1,()=>el.getBoundingClientRect().width/ (zoom*(state.sc||1)) ||18,v=>{el.style.width=el.style.height=v+'px';},'px'),
   C.range('Stroke',1,4,.25,()=>parseFloat(cs(el).strokeWidth)||2.2,v=>el.style.strokeWidth=v),
   C.color('Color',()=>cs(el).color,v=>el.style.color=v)]}
,
 {t:'Shape',find:()=>[...pv.querySelectorAll('svg:not(.i) :is(circle,rect,path,polygon,ellipse,line,polyline)')].filter(e=>!e.closest('svg.i,defs,clipPath')&&!COVERED.has(e)),max:8,
   name:el=>({circle:'Circle',rect:'Rectangle',path:'Path',polygon:'Polygon',ellipse:'Ellipse',line:'Line',polyline:'Polyline'}[el.tagName]||'Shape'),b:el=>{const c=cs(el);return [
   c.fill!=='none'&&C.color('Fill',()=>c.fill,v=>el.style.fill=v),
   c.stroke!=='none'&&C.color('Stroke',()=>c.stroke,v=>el.style.stroke=v),
   c.stroke!=='none'&&C.range('Stroke width',0,12,.5,()=>parseFloat(c.strokeWidth)||0,v=>el.style.strokeWidth=v),
   c.stroke!=='none'&&C.toggle('Dashed',()=>(el.style.strokeDasharray||el.getAttribute('stroke-dasharray')||'none')!=='none',v=>el.style.strokeDasharray=v?'6 5':'none'),
   el.tagName==='circle'&&C.range('Radius',1,80,.5,()=>+el.getAttribute('r')||5,v=>el.setAttribute('r',v)),
   el.tagName==='rect'&&C.range('Corner radius',0,30,1,()=>+el.getAttribute('rx')||0,v=>el.setAttribute('rx',v)),
   C.range('Opacity',0,1,.05,()=>+c.opacity,v=>el.style.opacity=v)];}},
 {t:'Block',find:()=>[...pv.querySelectorAll('*')].filter(e=>!(e instanceof SVGElement)&&!e.children.length&&!e.textContent.trim()&&!e.matches('input,textarea,br,.tg,.chk,.rad,.sw,.caret')&&!e.closest('.pbar,.stars,.dual,.knob,.otp,.bdg,[data-group],.fx,.cal')&&e.offsetWidth>3),max:6,
   name:el=>nameOf(el)==='i'||nameOf(el)==='span'?'Shape block':nameOf(el),b:el=>{const c=cs(el);return [
   C.range('Width',2,320,1,()=>el.offsetWidth,v=>el.style.width=v+'px','px'),
   C.range('Height',2,200,1,()=>el.offsetHeight,v=>el.style.height=v+'px','px'),
   C.color('Color',()=>c.backgroundColor,v=>el.style.background=v),
   C.range('Corner radius',0,60,1,()=>parseFloat(c.borderTopLeftRadius)||0,v=>el.style.borderRadius=v+'px','px'),
   C.range('Opacity',0,1,.05,()=>+c.opacity,v=>el.style.opacity=v)];}}
];
/* motion: one shared editor with a draggable easing curve */
const EASE={linear:[0,0,1,1],ease:[.25,.1,.25,1],'ease-in':[.42,0,1,1],'ease-out':[0,0,.58,1],'ease-in-out':[.42,0,.58,1],spring:[.34,1.8,.5,.8],snappy:[.7,0,.2,1],back:[.6,-.4,.4,1.4]};
const parseBz=s=>{if(EASE[s])return EASE[s].slice();const m=(s||'').match(/cubic-bezier\(([^)]+)\)/);return m?m[1].split(',').map(Number):EASE.ease.slice();};
const curveEditor=(get,set)=>{const W=200;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','-30 -60 260 320');svg.setAttribute('class','curve');
  let p=get();const X=v=>v*W,Y=v=>W-v*W;
  const draw=()=>{svg.innerHTML=`<rect x="0" y="0" width="${W}" height="${W}" fill="none" stroke="currentColor" stroke-opacity=".2"/><path d="M0 ${W}L${W} 0" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="4 4"/>
   <path d="M0 ${W}L${X(p[0])} ${Y(p[1])}M${W} 0L${X(p[2])} ${Y(p[3])}" stroke="#2f8fff" stroke-width="2"/>
   <path d="M0 ${W}C${X(p[0])} ${Y(p[1])} ${X(p[2])} ${Y(p[3])} ${W} 0" fill="none" stroke="currentColor" stroke-width="4"/>
   <circle data-h="0" cx="${X(p[0])}" cy="${Y(p[1])}" r="11" fill="#2f8fff" style="cursor:grab"/><circle data-h="1" cx="${X(p[2])}" cy="${Y(p[3])}" r="11" fill="#2f8fff" style="cursor:grab"/>
   <text x="100" y="-30" text-anchor="middle" font-size="16" fill="currentColor" font-family="Courier Prime,monospace">${p.map(v=>+v.toFixed(2)).join(', ')}</text>`;};
  let drag=-1;svg.addEventListener('pointerdown',e=>{const h=e.target.getAttribute&&e.target.getAttribute('data-h');if(h!=null){drag=+h;svg.setPointerCapture(e.pointerId);}});
  svg.addEventListener('pointermove',e=>{if(drag<0)return;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());
    p[drag*2]=Math.min(1,Math.max(0,q.x/W));p[drag*2+1]=Math.min(2,Math.max(-1,(W-q.y)/W));draw();set(p);});
  svg.addEventListener('pointerup',()=>{if(drag>=0){drag=-1;changed();}});
  draw();svg.redraw=np=>{p=np.slice();draw();};return svg;};
const motionSec=()=>{const els=[...pv.querySelectorAll('*')].filter(e=>{const c=cs(e);return c.animationName&&c.animationName!=='none';});if(!els.length)return null;
  const c0=cs(els[0]);const setAll=(k,v)=>els.forEach(e=>e.style[k]=v);
  let ce;const sel=C.select('Easing preset',[...Object.keys(EASE),'custom'],()=>{const t=c0.animationTimingFunction;const k=Object.keys(EASE).find(k=>t===k||t===`cubic-bezier(${EASE[k].join(', ')})`);return k||'custom';},v=>{if(v==='custom')return;setAll('animationTimingFunction',`cubic-bezier(${EASE[v].join(',')})`);ce.redraw(EASE[v]);});
  ce=curveEditor(()=>parseBz(c0.animationTimingFunction),p=>{setAll('animationTimingFunction',`cubic-bezier(${p.map(v=>+v.toFixed(3)).join(',')})`);sel.querySelector('select').value='custom';});
  return sec('Animation',[
    C.toggle('Playing',()=>c0.animationPlayState!=='paused',v=>setAll('animationPlayState',v?'running':'paused')),
    C.range('Duration',.1,6,.05,()=>parseFloat(c0.animationDuration)||1,v=>setAll('animationDuration',v+'s'),'s'),
    C.range('Delay',0,3,.05,()=>parseFloat(c0.animationDelay)||0,v=>setAll('animationDelay',v+'s'),'s'),
    sel,ce,C.note('Drag the two blue handles to shape the speed curve.'),
    C.select('Direction',['normal','alternate','reverse','alternate-reverse'],()=>c0.animationDirection,v=>setAll('animationDirection',v)),
    C.select('Repeat',[['infinite','Forever'],['1','Once'],['2','Twice'],['3','3 times']],()=>c0.animationIterationCount,v=>setAll('animationIterationCount',v)),
    C.btns([['↺ Replay',()=>els.forEach(e=>{const a=e.style.animationName;e.style.animationName='none';void e.offsetWidth;e.style.animationName=a;})]])
  ],`${els.length} moving part${els.length>1?'s':''}`);};
/* text: every remaining piece of text gets its own controls */
const textSec=()=>{const cands=[...pv.querySelectorAll('*')].filter(e=>{if(e.closest(HANDLED)||e.closest('svg.i')||e.matches('style,script'))return false;
   const own=[...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim());return own&&(e.tagName==='text'||!(e instanceof SVGElement));}).slice(0,10);
  return cands.map((e,i)=>{const isSvg=e instanceof SVGElement;return sec('Text: “'+short(e.textContent,18)+'”',[
    C.text('Content',()=>tGet(e),v=>tSet(e,v),{area:e.textContent.length>40}),
    C.range('Size',6,72,1,()=>parseFloat(cs(e).fontSize),v=>e.style.fontSize=v+'px','px'),
    !isSvg&&C.select('Weight',['400','500','600','700','800','900'],()=>String(cs(e).fontWeight),v=>e.style.fontWeight=v),
    !isSvg&&C.select('Font',[['','As drawn'],['Archivo, sans-serif','Archivo'],['Fraunces, serif','Fraunces'],['Courier Prime, monospace','Courier Prime'],['Georgia, serif','Georgia'],['system-ui, sans-serif','System']],()=>e.style.fontFamily||'',v=>e.style.fontFamily=v),
    !isSvg&&C.range('Letter spacing',-0.1,0.4,.01,()=>Math.round((parseFloat(cs(e).letterSpacing)||0)/parseFloat(cs(e).fontSize)*100)/100,v=>e.style.letterSpacing=v+'em','em'),
    C.color('Color',()=>isSvg?cs(e).fill:cs(e).color,v=>{if(isSvg)e.style.fill=v;else e.style.color=v;})
  ],'',i<3);});};
const buildComp=()=>{paneComp.innerHTML='';COVERED.clear();const out=[];const m=motionSec();if(m)out.push(m);
  RECIPES.forEach(r=>{let els=r.find?r.find():[...pv.querySelectorAll(r.q)];els=els.slice(0,r.max||4);els.forEach((el,i)=>{const kids=r.b(el);if(!kids||!kids.filter(Boolean).length)return;
    const nm=r.name?r.name(el):r.t;out.push(sec(nm+(els.length>1?' '+(i+1):''),kids,'',out.length<4));});});
  out.push(...textSec());
  if(!out.length)out.push(C.note('This one is mostly shapes. Switch to Select on the toolbar and click any part to edit it in Inspect.'));
  const head=mk('p','cnote',`${out.length} editable part${out.length>1?'s':''} found in this ${esc2(ALL[cur].n)}. Changes show instantly; use Undo if you go too far.`);
  paneComp.append(head,...out);};
const esc2=s=>s.replace(/[<>&]/g,'');

/* ---------- inspector: select any element ---------- */
const NAMES={btn:'Button',inp:'Input',chip:'Chip',tg:'Toggle',chk:'Checkbox',rad:'Radio',cb:'Round button',av:'Avatar',box:'Box',frame:'Frame',phone:'Phone',lbx:'List',ln:'Text line',sw:'Swatch',i:'Icon',sp:'Sparkle',pbar:'Progress bar',seg:'Segmented',tabs:'Tabs',cal:'Calendar',tbl:'Table',code:'Code',fab:'FAB',kbd:'Key',pop:'Popover',tip:'Tooltip',toast:'Toast',snack:'Snackbar',dlg:'Dialog',scrim:'Scrim',sheet:'Sheet',mv:'Moving box',ab:'Animated box',fx:'Flex box',stars:'Stars',stepper:'Stepper',knob:'Dial',otp:'Code box',sd:'Status dot',callout:'Callout',drop:'Dropzone',bdg:'Badge wrap'};
const nameOf=el=>{for(const c of el.classList)if(NAMES[c])return NAMES[c];const t=el.tagName.toLowerCase();const tx=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join('').trim();return t+(tx?` “${short(tx,14)}”`:'');};
const buildTree=()=>{treeEl.innerHTML='';const walk=(el,d)=>{if(treeEl.childElementCount>220)return;[...el.children].forEach(c=>{if(c.closest('svg.i')&&c.tagName!=='svg')return;if(c.parentElement&&c.parentElement.closest('svg')&&!['text','rect','circle','path','polygon','g'].includes(c.tagName))return;
   const b=mk('button',c===sel?'on':'');b.type='button';b.style.paddingLeft=(6+d*14)+'px';b.textContent=nameOf(c);b.addEventListener('click',()=>select(c));treeEl.append(b);c._tb=b;if(!c.matches('svg.i'))walk(c,d+1);});};walk(pv,0);
  if(!treeEl.childElementCount)treeEl.append(C.note('Nothing to list.'));};
const updateSel=()=>{if(!sel||!pv.contains(sel)){selbox.style.display='none';return;}const r=sel.getBoundingClientRect(),p=pgs.getBoundingClientRect();
  Object.assign(selbox.style,{display:'block',left:(r.left-p.left+pgs.scrollLeft-3)+'px',top:(r.top-p.top+pgs.scrollTop-3)+'px',width:(r.width+6)+'px',height:(r.height+6)+'px'});$('selname').textContent=nameOf(sel);};
const select=el=>{sel=el;showTab('Insp');buildTree();buildProps();updateSel();if(el._tb)el._tb.scrollIntoView({block:'nearest'});};
const SH={none:'',soft:'0 8px 18px rgba(0,0,0,.18)',hard:'4px 4px 0 currentColor',glow:'0 0 0 4px rgba(47,143,255,.35)'};
const buildProps=()=>{propsEl.innerHTML='';if(!sel||!pv.contains(sel)){propsEl.append(C.note('Pick a layer above, or choose Select on the toolbar and click any part of the preview.'));return;}
  const el=sel,isSvg=el instanceof SVGElement,c=cs(el);const re=()=>{changed({props:1});buildProps();};
  propsEl.append(sec('Selected: '+nameOf(el),[C.btns([
    ['↑ Parent',()=>{if(el.parentElement&&el.parentElement!==pv)select(el.parentElement);}],
    ['Duplicate',()=>{const n=el.cloneNode(true);el.after(n);changed({rebuild:1});select(n);}],
    ['Delete',()=>{const p=el.parentElement;el.remove();sel=p&&p!==pv?p:null;changed({rebuild:1});buildTree();buildProps();updateSel();}],
    ['Move up',()=>{if(el.previousElementSibling){el.previousElementSibling.before(el);re();}}],
    ['Move down',()=>{if(el.nextElementSibling){el.nextElementSibling.after(el);re();}}],
    ['Clear styles',()=>{el.removeAttribute('style');re();}]])]));
  const leaf=[...el.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim());
  if(leaf)propsEl.append(sec('Content',[C.text('Text',()=>tGet(el),v=>tSet(el,v),{area:el.textContent.length>40})]));
  if(el.matches('svg.i'))propsEl.append(sec('Icon',[C.select('Icon',ICONS,()=>el.dataset.ic||'',v=>setIcon(el,v))]));
  if(isSvg){propsEl.append(sec('Shape',[
    C.color('Fill',()=>c.fill,v=>el.style.fill=v),C.color('Stroke',()=>c.stroke,v=>el.style.stroke=v),
    C.range('Stroke width',0,10,.5,()=>parseFloat(c.strokeWidth)||0,v=>el.style.strokeWidth=v),C.range('Opacity',0,1,.05,()=>+c.opacity,v=>el.style.opacity=v),
    el.tagName==='text'&&C.range('Size',4,60,1,()=>parseFloat(c.fontSize),v=>el.setAttribute('font-size',v))]));return;}
  propsEl.append(sec('Layout',[
    C.text('Width',()=>el.style.width,v=>el.style.width=v,{ph:Math.round(el.offsetWidth)+'px (auto)'}),
    C.text('Height',()=>el.style.height,v=>el.style.height=v,{ph:Math.round(el.offsetHeight)+'px (auto)'}),
    C.range('Padding',0,40,1,()=>parseFloat(c.paddingTop)||0,v=>el.style.padding=v+'px','px'),
    C.range('Margin',-20,40,1,()=>parseFloat(c.marginTop)||0,v=>el.style.margin=v+'px','px'),
    /flex|grid/.test(c.display)&&C.range('Gap',0,40,1,()=>parseFloat(c.columnGap)||0,v=>el.style.gap=v+'px','px'),
    C.select('Display',['block','inline-block','inline','flex','inline-flex','grid','none'],()=>c.display,v=>el.style.display=v),
    C.range('Rotate',-180,180,1,()=>parseFloat(el.style.rotate)||0,v=>el.style.rotate=v+'deg','°'),
    C.range('Scale',.2,3,.05,()=>parseFloat(el.style.scale)||1,v=>el.style.scale=v,'×')]));
  propsEl.append(sec('Style',[
    C.color('Background',()=>c.backgroundColor,v=>el.style.background=v),C.color('Text color',()=>c.color,v=>el.style.color=v),
    C.range('Border width',0,10,.5,()=>parseFloat(c.borderTopWidth)||0,v=>{el.style.borderWidth=v+'px';if(c.borderTopStyle==='none')el.style.borderStyle='solid';},'px'),
    C.color('Border color',()=>c.borderTopColor,v=>el.style.borderColor=v),
    C.select('Border style',['solid','dashed','dotted','double','none'],()=>c.borderTopStyle,v=>el.style.borderStyle=v),
    C.range('Corner radius',0,80,1,()=>parseFloat(c.borderTopLeftRadius)||0,v=>el.style.borderRadius=v+'px','px'),
    C.range('Opacity',0,1,.05,()=>+c.opacity,v=>el.style.opacity=v),
    C.select('Shadow',Object.keys(SH),()=>Object.keys(SH).find(k=>SH[k]===el.style.boxShadow)||'none',v=>el.style.boxShadow=SH[v]),
    C.range('Blur',0,10,.5,()=>{const m=(el.style.filter||'').match(/blur\(([\d.]+)/);return m?+m[1]:0;},v=>el.style.filter=v?`blur(${v}px)`:'','px')],'',false));
  propsEl.append(sec('Type',[
    C.range('Font size',6,72,1,()=>parseFloat(c.fontSize),v=>el.style.fontSize=v+'px','px'),
    C.select('Weight',['300','400','500','600','700','800','900'],()=>String(c.fontWeight),v=>el.style.fontWeight=v),
    C.select('Font',[['','Inherit'],['Archivo, sans-serif','Archivo'],['Fraunces, serif','Fraunces'],['Courier Prime, monospace','Courier Prime'],['Georgia, serif','Georgia'],['system-ui, sans-serif','System']],()=>el.style.fontFamily||'',v=>el.style.fontFamily=v),
    C.range('Letter spacing',-0.1,0.5,.01,()=>Math.round((parseFloat(c.letterSpacing)||0)/parseFloat(c.fontSize)*100)/100,v=>el.style.letterSpacing=v+'em','em'),
    C.select('Align',['start','center','end','justify'],()=>c.textAlign.replace('left','start'),v=>el.style.textAlign=v),
    C.select('Case',[['none','As typed'],['uppercase','UPPERCASE'],['lowercase','lowercase'],['capitalize','Title Case']],()=>c.textTransform,v=>el.style.textTransform=v)],'',false));
};

/* ---------- prompt tab: a Claude Code prompt built from the live component ---------- */
const KNOW={
 'Slider':{beh:['Drag the thumb, or click anywhere on the track to jump there.','Keyboard: Arrow keys change by one step, Page Up/Down by ten steps, Home/End jump to min/max.','Fill the track from the start up to the current value.','Fire onChange while dragging and onChangeEnd on release.'],a11y:['Use a native <input type="range"> or role="slider" with aria-valuemin, aria-valuemax, aria-valuenow and a readable aria-valuetext.','Tie it to a visible label with aria-labelledby.'],props:['value','defaultValue','min','max','step','onChange','onChangeEnd','disabled','label','formatValue'],states:['default','hover','focus-visible','dragging','disabled'],tests:['Arrow keys change value by step and clamp at min/max.','Clicking the track moves the value.']},
 'Button':{beh:['Activates on click, Enter and Space.','A loading state shows a spinner, keeps the button’s width, and blocks repeat clicks.','Supports an optional leading icon.'],a11y:['Use a native <button type="button"> (or type="submit" inside forms).','Icon-only buttons need an aria-label.','Show a visible :focus-visible ring with at least 3:1 contrast.'],props:['variant: "filled" | "outline" | "soft" | "text" | "danger"','size: "xs" | "sm" | "md" | "lg"','icon?','loading?','disabled?','onClick','children'],states:['default','hover','focus-visible','pressed','disabled','loading'],tests:['onClick fires on click, Enter and Space.','onClick does not fire while disabled or loading.']},
 'Toggle switch':{beh:['Flips on/off immediately on click or Space; no Save button needed.','Animate the knob sliding across (about 200ms).'],a11y:['Use <button role="switch" aria-checked> or <input type="checkbox" role="switch">.','Clicking the visible label also toggles it.'],props:['checked','defaultChecked','onCheckedChange','disabled','label'],states:['off','on','hover','focus-visible','disabled'],tests:['Click and Space toggle aria-checked.']},
 'Checkbox':{beh:['Toggles on click, on its label, and with Space.','Supports an indeterminate state for “some selected” parents.'],a11y:['Use a native <input type="checkbox">; set .indeterminate in code for the mixed state.','Group related checkboxes in <fieldset> with a <legend>.'],props:['checked','defaultChecked','indeterminate','onCheckedChange','disabled','label'],states:['unchecked','checked','indeterminate','hover','focus-visible','disabled'],tests:['Label click toggles the box.','Indeterminate renders the dash and reports aria-checked="mixed".']},
 'Radio button':{beh:['Exactly one option in a group is selected.','Arrow keys move the selection within the group; Tab leaves the group.'],a11y:['Use native radios sharing one name, wrapped in <fieldset>/<legend>, or role="radiogroup" with roving tabindex.'],props:['options[]','value','defaultValue','onValueChange','name','disabled'],states:['unselected','selected','hover','focus-visible','disabled'],tests:['Arrow keys move selection and focus together.']},
 'Chip':{beh:['Filter/choice chips toggle a selected state on click.','Removable chips have a separate × button.'],a11y:['Toggle chips use <button aria-pressed>.','Remove buttons need aria-label="Remove {label}".'],props:['label','selected','onSelectedChange','onRemove?','size: "sm" | "md"'],states:['default','selected','hover','focus-visible','disabled'],tests:['Click toggles aria-pressed.']},
 'Input field':{beh:['Shows a persistent visible label, optional helper text, and an error message when invalid.','Optional leading/trailing adornments such as icons or units.'],a11y:['Link helper and error text with aria-describedby; set aria-invalid="true" on error.','Never use the placeholder as the only label.','Set the right type, inputmode and autocomplete.'],props:['label','value','defaultValue','onChange','placeholder','helperText','error','disabled','readOnly','prefix?','suffix?'],states:['default','hover','focus','filled','error','read-only','disabled'],tests:['Error text is announced via aria-describedby.']},
 'Progress bar':{beh:['Width animates smoothly when the value changes.','Support an indeterminate variant for unknown durations.'],a11y:['role="progressbar" with aria-valuenow, aria-valuemin="0", aria-valuemax="100" and a label.'],props:['value (0–100)','max?','indeterminate?','label'],states:['empty','in progress','complete','indeterminate'],tests:['aria-valuenow matches the value prop.']},
 'Progress ring':{beh:['Draw with an SVG circle and stroke-dasharray; animate changes.','Show the percentage in the center.'],a11y:['role="progressbar" with aria-valuenow and a label.'],props:['value (0–100)','size','thickness','showLabel'],states:['in progress','complete'],tests:['Dash length matches the value.']},
 'Star rating':{beh:['Click a star to set the rating; hover previews it.','Keyboard: Arrow keys change the rating.','Support a read-only display mode.'],a11y:['Implement as a radio group (“1 star” … “5 stars”); read-only mode uses aria-label="3 out of 5 stars".'],props:['value','max=5','onValueChange','readOnly','size'],states:['empty','hover preview','filled','focus-visible','read-only'],tests:['Arrow keys change the rating.']},
 'Stepper':{beh:['− and + change the value by step and clamp to min/max.','Disable each button at its bound.','The number can also be typed directly.'],a11y:['Buttons need aria-label="Decrease"/"Increase"; the field uses inputmode="numeric" or role="spinbutton".'],props:['value','min','max','step','onChange','disabled'],states:['default','at min','at max','focus-visible','disabled'],tests:['Value never goes outside min/max.']},
 'Options':{beh:['Exactly one option is active; clicking switches it.','Arrow keys move between options.'],a11y:['Tabs: role="tablist"/"tab"/"tabpanel", aria-selected and roving tabindex. Segmented controls: radio-group semantics. Carousel dots: buttons with aria-label="Slide n" and aria-current.'],props:['options[]','value','onValueChange'],states:['inactive','active','hover','focus-visible','disabled'],tests:['Arrow keys move the active option.']},
 'List':{beh:['Click or press Enter to select an item; Arrow keys move the highlight.','Typing a letter jumps to matching items.'],a11y:['role="listbox" with role="option" and aria-selected, or a native <select> where it fits.'],props:['items[]','value','onValueChange','renderItem?'],states:['default','highlighted','selected','disabled item'],tests:['Keyboard moves the highlight and Enter selects.']},
 'Avatar':{beh:['Show the image; fall back to initials if it fails or is missing.','Optional status dot.'],a11y:['Images get alt text with the person’s name; decorative avatars use alt="".'],props:['src?','name','size','shape: "circle" | "rounded" | "square"','status?'],states:['image','initials fallback'],tests:['Falls back to initials when the image errors.']},
 'Badge':{beh:['Shows a count; over 99 shows “99+”; zero hides it; a dot variant has no number.'],a11y:['Put the meaning on the parent, e.g. aria-label="Notifications, 3 unread".'],props:['count','max=99','dot?','showZero?'],states:['hidden','dot','count','overflow (99+)'],tests:['Count above max renders "99+".']},
 'Calendar':{beh:['Select one date or a start–end range; shade days in between.','Mark today, and disable unavailable dates.','Navigate months with previous/next buttons.'],a11y:['role="grid"; Arrow keys move by day, Page Up/Down by month, Home/End to week edges; aria-selected and aria-current="date".'],props:['value | {start,end}','onChange','minDate','maxDate','disabledDates','weekStartsOn','locale'],states:['default','today','selected','in range','disabled','focus-visible'],tests:['Arrow-key navigation crosses month boundaries.']},
 'Dial':{beh:['Drag around the knob to rotate it within −135° to 135°; the scroll wheel and Arrow keys also change it.'],a11y:['role="slider" with aria-valuenow, aria-valuemin, aria-valuemax and a label.'],props:['value','min','max','step','onChange'],states:['default','dragging','focus-visible','disabled'],tests:['Arrow keys rotate the indicator.']},
 'Code boxes':{beh:['One character per box; typing auto-advances, Backspace moves back, pasting fills every box.','Submit automatically when complete (optional).'],a11y:['Use inputmode="numeric" and autocomplete="one-time-code"; label the group, e.g. “Verification code”.'],props:['length','value','onChange','onComplete'],states:['empty','focused box','filled','error'],tests:['Pasting a full code fills all boxes.']},
 'Swatch':{beh:['Clicking a swatch selects that color, shown with a ring.'],a11y:['Radio-group semantics, with each swatch labeled by its color name and hex.'],props:['colors[]','value','onValueChange'],states:['default','selected','focus-visible'],tests:['The selected swatch has aria-checked="true".']},
 'Chart bars':{beh:['Render bars from a data array in props, scaled to the largest value.','Tooltip on hover and focus shows the exact value.'],a11y:['Give the chart an accessible summary (aria-label or <figcaption>) and a visually hidden data table fallback.','Don’t rely on color alone to tell series apart.'],props:['data: {label, value}[]','height','showValues?','colors?'],states:['default','hovered bar','focused bar','empty data'],tests:['Bar heights scale proportionally to the data.']},
 'Line data':{beh:['Plot points from a data array and join them with a line; an optional area fill sits under it.','Tooltip on hover and focus.'],a11y:['Provide a text summary of the trend and a data-table fallback.'],props:['data: {x, y}[]','area?','showPoints?'],states:['default','hovered point','empty data'],tests:['Point positions match the data.']},
 'Pie slices':{beh:['Slices come from data proportions; an optional donut hole can hold a total.'],a11y:['Include a legend with values and an accessible summary.'],props:['data: {label, value}[]','donut?','centerLabel?'],states:['default','hovered slice'],tests:['Slice angles sum to 360°.']},
 'Flex container':{beh:['Lay out children with CSS flexbox using the exact direction, justify, align, wrap and gap values in the spec.'],a11y:['Keep the DOM order the same as the visual order.'],props:['direction','justify','align','wrap','gap'],states:[],tests:[]},
 'Grid':{beh:['Lay out children with CSS grid using the column count and gap in the spec, collapsing to fewer columns on small screens.'],a11y:['Keep DOM order logical.'],props:['columns','gap'],states:[],tests:[]},
 'Table':{beh:['Render rows from data; the header row stays visible when the table scrolls.'],a11y:['Use a semantic <table> with <caption>, <th scope="col">; sortable headers use aria-sort.'],props:['columns[]','rows[]','caption'],states:['default','row hover','empty'],tests:['Headers render as th with scope="col".']},
 'Code':{beh:['Monospaced block that preserves whitespace, with a Copy button.'],a11y:['Use <pre><code>; the Copy button announces “Copied”.'],props:['code','language?','showCopy?'],states:['default','copied'],tests:['Copy writes to the clipboard.']},
 'Contrast check':{beh:['Compute the WCAG contrast ratio live: (L1 + 0.05) / (L2 + 0.05) using relative luminance.','Show pass/fail for 4.5:1 (body text) and 3:1 (large text, UI).'],a11y:['Write pass/fail in text, not only as color.'],props:['foreground','background'],states:['pass','fail'],tests:['Black on white returns 21:1.']},
 'Steps':{beh:['Show completed, current and upcoming steps joined by connectors.'],a11y:['Use an <ol>; mark the current step with aria-current="step".'],props:['steps[]','current'],states:['complete','current','upcoming'],tests:['Only one step has aria-current.']},
 'Pagination':{beh:['Previous/next plus page numbers, with ellipses for long ranges; disable previous/next at the ends.'],a11y:['Wrap it in <nav aria-label="Pagination">; the current page gets aria-current="page".'],props:['page','pageCount','onPageChange','siblingCount'],states:['default','current','disabled arrow'],tests:['Previous is disabled on page 1.']},
 'Icon':{beh:['Inline SVG icons that use currentColor and scale with the size prop.'],a11y:['Decorative icons get aria-hidden="true"; meaningful standalone icons need a label.'],props:['name','size','strokeWidth'],states:[],tests:[]}
};
const FW={
 'react-tw':{n:'React + TypeScript + Tailwind CSS',files:p=>[`src/components/${p}/${p}.tsx`,`src/components/${p}/index.ts`],story:p=>`src/components/${p}/${p}.stories.tsx`,test:p=>`src/components/${p}/${p}.test.tsx (Vitest + React Testing Library + user-event)`,style:'Tailwind utility classes. Add the design tokens to tailwind.config (theme.extend.colors, borderRadius, fontFamily) as CSS variables so dark mode can swap them. Use clsx (or the repo’s cn helper) for variant classes.',ts:true},
 'react-css':{n:'React + TypeScript + CSS Modules',files:p=>[`src/components/${p}/${p}.tsx`,`src/components/${p}/${p}.module.css`,`src/components/${p}/index.ts`],story:p=>`src/components/${p}/${p}.stories.tsx`,test:p=>`src/components/${p}/${p}.test.tsx (Vitest + React Testing Library + user-event)`,style:'CSS Modules. Declare the tokens as CSS custom properties on :root (and a dark override) in a shared tokens.css, then reference them in the module.',ts:true},
 'next':{n:'Next.js (App Router) + TypeScript + Tailwind CSS',files:p=>[`components/${p}/${p}.tsx`,`components/${p}/index.ts`,`app/playground/${p.toLowerCase()}/page.tsx (demo page)`],story:p=>`components/${p}/${p}.stories.tsx`,test:p=>`components/${p}/${p}.test.tsx (Vitest + React Testing Library)`,style:'Tailwind with tokens as CSS variables in globals.css. Mark the component "use client" only if it has state or event handlers. Load fonts with next/font/google.',ts:true},
 'vue':{n:'Vue 3 (<script setup lang="ts">)',files:p=>[`src/components/${p}.vue`,`src/components/index.ts`],story:p=>`src/components/${p}.stories.ts`,test:p=>`src/components/${p}.spec.ts (Vitest + Vue Test Utils)`,style:'Scoped <style> using CSS custom properties for the tokens. Use defineProps/defineEmits with types and v-model where it fits.',ts:true},
 'svelte':{n:'Svelte 5 + TypeScript',files:p=>[`src/lib/components/${p}.svelte`,`src/lib/components/index.ts`],story:p=>`src/lib/components/${p}.stories.svelte`,test:p=>`src/lib/components/${p}.test.ts (Vitest + Testing Library)`,style:'Component-scoped <style> with CSS custom properties for tokens. Use runes ($props, $state, $derived) and bindable values.',ts:true},
 'html':{n:'Plain HTML, CSS and JavaScript (no build step)',files:p=>[`${p.toLowerCase()}/index.html (demo)`,`${p.toLowerCase()}/${p.toLowerCase()}.css`,`${p.toLowerCase()}/${p.toLowerCase()}.js`],story:null,test:p=>`${p.toLowerCase()}/${p.toLowerCase()}.test.html (a simple in-browser test page with console asserts)`,style:'Vanilla CSS with custom properties for tokens. Package it as a Web Component (<ui-'+'name>) with a shadow root, or as a small init() function if Web Components don’t fit the repo.',ts:false},
 'swiftui':{n:'SwiftUI (iOS 17+)',files:p=>[`Sources/Components/${p}View.swift`,`Sources/Theme/Tokens.swift`],story:null,test:p=>`Tests/${p}ViewTests.swift (XCTest + snapshot or ViewInspector if present)`,style:'Define tokens as Color and Font extensions in Tokens.swift with light/dark variants in the asset catalog. Support Dynamic Type and include #Preview blocks for every state.',ts:false},
 'compose':{n:'Jetpack Compose (Kotlin, Material 3 base)',files:p=>[`ui/components/${p}.kt`,`ui/theme/Tokens.kt`],story:null,test:p=>`androidTest/${p}Test.kt (Compose UI test rule)`,style:'Put tokens in a custom theme object (CompositionLocal) with light/dark values. Use Modifier.semantics for accessibility and add @Preview functions for each state.',ts:false},
 'flutter':{n:'Flutter (Dart 3)',files:p=>[`lib/widgets/${p.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase()}.dart`,'lib/theme/tokens.dart'],story:null,test:p=>`test/${p.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase()}_test.dart (widget tests)`,style:'Define tokens in a ThemeExtension with light/dark instances. Wrap interactive parts in Semantics and respect MediaQuery.textScaler.',ts:false}
};
const pascal=s=>s.replace(/[’']/g,'').replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').map(w=>w[0]?w[0].toUpperCase()+w.slice(1):'').join('')||'Component';
const colorStr=v=>{v=(v||'').trim();if(!v||v==='transparent'||/rgba\([^)]*,\s*0\)$/.test(v)||/\/\s*0\)$/.test(v))return 'transparent';return hex(v);};
const measure=el=>{const c=cs(el);const isSvg=el instanceof SVGElement;if(isSvg){return `fill ${colorStr(c.fill)}, stroke ${colorStr(c.stroke)} ${c.strokeWidth}`;}
  const pad=[c.paddingTop,c.paddingRight,c.paddingBottom,c.paddingLeft].map(x=>parseFloat(x)).join(' ');
  return `${el.offsetWidth}×${el.offsetHeight}px · background ${colorStr(c.backgroundColor)} · text ${colorStr(c.color)} · border ${parseFloat(c.borderTopWidth)}px ${c.borderTopStyle} ${colorStr(c.borderTopColor)} · radius ${c.borderTopLeftRadius} · padding ${pad}px · font ${c.fontFamily.split(',')[0].replace(/"/g,'')} ${c.fontWeight} ${c.fontSize}${c.textTransform!=='none'?' '+c.textTransform:''}${parseFloat(c.letterSpacing)?' tracking '+c.letterSpacing:''}${c.boxShadow!=='none'?' · shadow '+c.boxShadow:''}`;};
const detectParts=()=>{COVERED.clear();const out=[];RECIPES.forEach(r=>{let els;try{els=r.find?r.find():[...pv.querySelectorAll(r.q)];}catch(e){els=[];}if(els.length){if(r.t==='Chart bars'||r.t==='Line data')r.b(els[0]);out.push({t:r.t,name:r.name?r.name(els[0]):r.t,els});}});COVERED.clear();return out;};
const chartData=()=>{const lines=[];
  [...pv.querySelectorAll('svg')].forEach(s=>{const bars=[...s.querySelectorAll(':scope > rect[height]')].filter(r=>+r.getAttribute('height')>0&&+r.getAttribute('width')<60);if(bars.length>=3)lines.push(`Bar values (relative heights): [${bars.map(b=>+b.getAttribute('height')).join(', ')}]`);});
  [...pv.querySelectorAll('svg path')].forEach(p=>{const d=(p.getAttribute('d')||'').trim();if(/^M[\d.]+ [\d.]+(L[\d.]+ [\d.]+){2,}$/.test(d)){const H=+((p.ownerSVGElement.getAttribute('viewBox')||'0 0 0 88').split(/[\s,]+/)[3])||88;lines.push(`Line values (bottom = 0): [${d.slice(1).split('L').map(q=>Math.round(H-8-+q.trim().split(/\s+/)[1])).join(', ')}]`);}});
  [...pv.querySelectorAll('[style*="conic-gradient"]')].forEach(e=>{const m=e.getAttribute('style').match(/conic-gradient\(([^;]*)\)\s*;/);if(m&&/%/.test(m[1]))lines.push(`Pie stops: ${m[1]}`);});
  return lines;};
const motionSpec=()=>{const els=[...pv.querySelectorAll('*')].filter(e=>{const c=cs(e);return c.animationName&&c.animationName!=='none';});if(!els.length)return null;
  const c=cs(els[0]);const kf=[];for(const sh of document.styleSheets){try{for(const r of sh.cssRules){if(r.type===7&&els.some(e=>cs(e).animationName.split(',').map(s=>s.trim()).includes(r.name)))kf.push(r.cssText);}}catch(e){}}
  return {n:els.length,dur:c.animationDuration,delay:c.animationDelay,ease:c.animationTimingFunction,dir:c.animationDirection,iter:c.animationIterationCount,state:c.animationPlayState,kf:[...new Set(kf)].slice(0,4)};};
const visibleText=()=>{const out=[];const w=document.createTreeWalker(pv,NodeFilter.SHOW_TEXT);while(w.nextNode()){const t=w.currentNode.nodeValue.replace(/\s+/g,' ').trim();if(t&&!out.includes(t))out.push(t);}return out.slice(0,40);};
const uniq=a=>[...new Set(a.filter(Boolean))];

const buildPrompt=()=>{
  const it=ALL[cur];const o={fw:$('prFw').value,ts:$('prTs').classList.contains('on'),tests:$('prTests').classList.contains('on'),story:$('prStory').classList.contains('on'),ref:$('prRef').classList.contains('on'),dark:$('prDark').classList.contains('on'),extra:$('prExtra').value.trim()};
  const fw=FW[o.fw];const P2=pascal(it.n);const parts=detectParts();const keys=uniq(parts.map(p=>p.t)).filter(k=>KNOW[k]);
  const sectionTitle=(D.find(s=>s.id===it.sec)||{}).t||'';
  const all=f=>uniq(keys.flatMap(k=>KNOW[k][f]||[]));
  const beh=all('beh'),a11y=all('a11y'),props=all('props'),states=all('states'),tests=all('tests');
  const mot=motionSpec();const data=chartData();const texts=visibleText();
  const root=pv.firstElementChild;const D0=DEF();
  const tok=[['ink (primary text, borders, filled surfaces)',state.ink],['paper (component surface)',state.paper],['soft (tints, tracks, subtle fills)',state.soft],['accent / danger',state.accent],['page background',state.bg]];
  const darkTok=['#121110 background','#1c1b19 surface','#f4f0e6 ink','#2e2c28 soft','#a59f93 muted'];
  const L=[];const h=t=>L.push('',`## ${t}`);
  L.push(`# Build the “${it.n}” component (${fw.n})`,'',
   `You are working in my codebase through Claude Code. Build a production-ready **${P2}** component that matches the spec below as closely as the platform allows. Read the whole prompt first, then work through it in order. Don’t stop at a sketch; finish every section.`);
  h('1. What this component is');
  L.push(`${it.d.replace(/\s+(?:Drag|Tap|Try|Click|Flip|Hover)\b[^.]{0,45}\.$/,'')}`,`- Also called: ${it.a}`,`- Category: ${sectionTitle}`,`- Parts detected in my design: ${parts.length?parts.map(p=>`${p.name}${p.els.length>1?` ×${p.els.length}`:''}`).join(', '):'decorative shapes only'}`);
  h('2. Before you write code');
  L.push('- Inspect the repo first: package.json (or the platform equivalent), the existing components folder, how styling and theming are done, lint/format config, and the test setup.',
   '- If the repo already has conventions (folder layout, naming, a design-token file, a cn/clsx helper, an icon set), follow them and adapt the file paths below.',
   '- Don’t add new dependencies unless they are essential; if you need one, tell me why before installing it.',
   '- Briefly write out your plan (files to create and change), then implement it.');
  h('3. Tech and files');
  L.push(`- Stack: ${fw.n}${fw.ts?(o.ts?', TypeScript in strict mode with exported prop types':', JavaScript'):''}.`,`- Styling: ${fw.style}`,'- Create:',...fw.files(P2).map(f=>`  - ${f}`));
  if(o.story&&fw.story)L.push(`  - ${fw.story(P2)} (Storybook, one story per state and variant)`);
  if(o.tests)L.push(`  - ${fw.test(P2)}`);
  L.push('- Export the component from the folder’s index so it can be imported in one line.','- Add a short usage example to my demo/playground page if the repo has one; otherwise put it in the story or the PR summary.');
  h('4. Design tokens (taken from my playground settings)');
  L.push('Define these as tokens/variables. Don’t hard-code raw hex values inside the component.','','| Token | Value |','|---|---|',...tok.map(([k,v])=>`| ${k} | ${v} |`),
   `| border width | ${state.bw}px solid, in the ink color |`,`| corner style | ${state.corners==='sharp'?'sharp (0 radius everywhere)':state.corners==='round'?'extra round (about 22px on containers; pills stay fully rounded)':'as measured per part below (pills = 999px)'} |`,
   `| type | ${state.font==='f-serif'?'Fraunces for all text':state.font==='f-mono'?'Courier Prime for all text':state.font==='f-sys'?'system-ui for all text':'Fraunces (black weight, SOFT axis 100) for display text; Archivo (400–900) for UI text and uppercase labels; Courier Prime for small mono labels and numbers'} |`,
   `| scale | render the whole component at ${state.sc}× the measured sizes below${state.rot?`, rotated ${state.rot}°`:''} |`,
   '| shadows | hard offset shadows (e.g. 4px 4px 0) instead of soft blurs, where shadows appear |','| spacing | a 4/8px rhythm |',
   '','Fonts (web): https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=Courier+Prime:wght@400;700&family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100&display=swap — always give a real fallback stack (sans-serif / serif / monospace). On native platforms, bundle these fonts or use the closest system equivalents.',
   'Overall look: flat, hand-drawn, black-on-cream with thick outlines, fully rounded pill buttons, 4-point sparkle accents, and no gradients unless listed.');
  if(o.dark)L.push('','Dark mode: provide a dark theme that swaps the tokens, roughly '+darkTok.join(', ')+'. Filled ink surfaces invert (light fill, dark text). Follow the system setting and allow an explicit override.');
  h('5. Anatomy and measured styles');
  L.push('Measured from the rendered component at 1× (before the scale factor). Match these within ±1px where the platform allows.');
  if(root)L.push(`- Root (${nameOf(root)}): ${measure(root)}`);
  parts.forEach(p=>p.els.slice(0,3).forEach((el,i)=>L.push(`- ${p.name}${p.els.length>1?' '+(i+1):''}: ${measure(el)}`)));
  if(texts.length){h('6. Content: use this exact copy');texts.forEach(t=>L.push(`- “${t}”`));L.push('Make all copy come from props/slots, not hard-coded strings, except as defaults.');}
  if(data.length){h('7. Data');L.push('Make the data a prop. Use these values as the default/demo data:',...data.map(d=>`- ${d}`),'Draw charts with SVG yourself; don’t add a chart library unless the repo already uses one.');}
  h('8. Behavior');
  (beh.length?beh:['Match the static design exactly; nothing in it is interactive beyond standard focus and hover.']).forEach(b=>L.push(`- ${b}`));
  L.push('- Support both controlled and uncontrolled use where the component holds state (value + onChange, or defaultValue).');
  h('9. States to design and build');
  const SD={default:'as measured above',hover:'surface shifts toward the soft tint, or brightness drops about 10% on filled parts; cursor pointer','focus-visible':'3px solid ink outline, offset 3px, only for keyboard focus',focus:'3px solid ink outline, offset 3px',pressed:'moves 2px down and right; hard shadow shrinks to 1px',disabled:'35% opacity, cursor not-allowed, no hover effects, removed from interaction',loading:'inline spinner replaces or precedes the label; width stays the same',error:'border and helper text turn the accent/danger color, plus an icon and a text message',dragging:'thumb/indicator slightly enlarged with a grabbing cursor'};
  (states.length?states:['default']).forEach(s=>L.push(`- **${s}**: ${SD[s]||'see the behavior notes'}`));
  h('10. Accessibility (target WCAG 2.2 AA)');
  [...a11y,'Fully usable with the keyboard alone, in a logical tab order.','Visible focus on every interactive part; never remove outlines without replacing them.','Text contrast at least 4.5:1, and UI parts/borders at least 3:1, in both themes.','Touch targets at least 44×44px (pad the hit area if the visual is smaller).','Information is never shown by color alone.','Honor prefers-reduced-motion and the user’s text-size settings.'].forEach(a=>L.push(`- ${a}`));
  if(mot){h('11. Motion');L.push(`This component has ${mot.n} animated part${mot.n>1?'s':''}. Match the timing exactly:`,
    `- duration ${mot.dur}, delay ${mot.delay}, easing ${mot.ease}, direction ${mot.dir}, iterations ${mot.iter}${mot.state==='paused'?' (paused by default)':''}`,
    '- Animate only transform and opacity (or offset-distance for path motion) so it stays on the compositor.',
    '- Under prefers-reduced-motion: reduce, stop looping animations and use a simple fade or no motion.');
    if(mot.kf.length)L.push('','Keyframes from my design:','```css',...mot.kf,'```');}
  h(`${mot?12:11}. Responsive and layout`);
  L.push('- Nothing overflows horizontally at 320px wide; long text wraps or truncates with an ellipsis and a full-text tooltip.','- Use relative units for type so it scales with user settings.','- Works inside flex and grid parents without fixed outer margins (the parent controls spacing).');
  h(`${mot?13:12}. Component API`);
  const pr=uniq([...props,'className / style passthrough (or the platform equivalent)']);
  pr.forEach(p=>L.push(`- ${p}`));
  if(fw.ts&&o.ts)L.push('','Write a typed props interface (e.g. `'+P2+'Props`), forward refs to the main interactive element, and spread remaining native attributes onto it.');
  if(o.ref){h(`${mot?14:13}. Reference markup (my current version)`);L.push('This is the exact HTML from my design sandbox. Treat it as a visual reference: the class names come from my sandbox stylesheet, so rebuild the structure semantically for production instead of copying it.','','```html',cleanHTML().replace(/\s+data-ic="[^"]*"/g,'').trim(),'```');}
  let n=(mot?14:13)+(o.ref?1:0);
  if(o.tests){h(`${n++}. Tests`);[...tests,'Renders without errors with only the required props.','Keyboard interaction works as described in Behavior.','No accessibility violations (run axe or the platform’s accessibility checks if available).'].forEach(t=>L.push(`- ${t}`));}
  if(o.story&&fw.story){h(`${n++}. Stories`);L.push(`- One story per variant and per state in section 9${o.dark?', plus a dark-mode story':''}.`,'- An interactive “Playground” story with controls for every prop.');}
  if(o.extra){h(`${n++}. Extra instructions from me`);L.push(o.extra);}
  h(`${n++}. Definition of done`);
  ['The component matches the tokens, measured styles and copy above.','Every state in section 9 is implemented and reachable.','Keyboard and screen reader behavior match sections 8 and 10.',o.dark?'Light and dark themes both pass contrast checks.':null,o.tests?'Lint, type-check and tests all pass. Run them and fix any failures before finishing.':'Lint and type-check pass. Run them and fix any failures before finishing.','No TODOs, placeholders or commented-out code left behind.'].filter(Boolean).forEach(x=>L.push(`- [ ] ${x}`));
  h('When you finish');L.push('Reply with: the files you created or changed, how to import and use the component (a short code example), the commands you ran and their results, and anything you couldn’t match exactly and why.');
  return L.join('\n');
};
const refreshPrompt=()=>{if($('panePrompt').hidden)return;const t=buildPrompt();$('prOut').value=t;$('prCount').textContent=`${t.split('\n').length} lines · ${t.length.toLocaleString()} characters`;};
['prFw','prExtra'].forEach(id=>$(id).addEventListener('input',refreshPrompt));
['prTs','prTests','prStory','prRef','prDark'].forEach(id=>$(id).addEventListener('click',()=>{const b=$(id);const v=!b.classList.contains('on');b.classList.toggle('on',v);b.setAttribute('aria-checked',v);refreshPrompt();}));
$('prCopy').addEventListener('click',()=>{const t=$('prOut').value;const ok='Prompt copied. Paste it into Claude Code.';
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>msg.textContent=ok,()=>{$('prOut').select();msg.textContent='Press Ctrl+C (⌘C) to copy the selected prompt.';});else{$('prOut').select();msg.textContent='Press Ctrl+C (⌘C) to copy the selected prompt.';}});
$('prRegen').addEventListener('click',()=>{refreshPrompt();msg.textContent='Prompt rebuilt from your current version.';});

/* ---------- tabs, tools, stage ---------- */
const showTab=t=>{['Comp','Insp','Theme','Code','Prompt'].forEach(k=>{$('pane'+k).hidden=k!==t;const b=pgm.querySelector(`[data-tab="${k}"]`);b.classList.toggle('on',k===t);b.setAttribute('aria-selected',k===t);});
  if(t==='Insp'){buildTree();buildProps();}if(t==='Code')code.value=pv.innerHTML;if(t==='Prompt')refreshPrompt();};
pgm.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
const setTool=t=>{tool=t;pgm.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('on',b.dataset.tool===t));pv.classList.toggle('selmode',t==='select');pv.contentEditable=t==='type'?'true':'false';
  $('pgHint').textContent={interact:'Interact: the preview works like the real UI.',select:'Select: click any part of the preview to edit it in Inspect.',type:'Type: click any text in the preview and edit it directly.'}[t];};
pgm.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
pv.addEventListener('click',e=>{if(tool!=='select')return;e.preventDefault();e.stopPropagation();let t=e.target;if(t.closest&&t.closest('svg.i'))t=t.closest('svg.i');if(t===pv)return;select(t);},true);
pv.addEventListener('input',e=>{if(tool==='type')changed();});
pv.addEventListener('focusout',()=>{if(tool==='type')changed({rebuild:1});});
$('simSel').addEventListener('change',e=>{[...pv.classList].filter(c=>c.startsWith('sim-')).forEach(c=>pv.classList.remove(c));if(e.target.value)pv.classList.add('sim-'+e.target.value);});
$('zIn').addEventListener('click',()=>{zoom=Math.min(4,+(zoom+.2).toFixed(2));applyTheme();});
$('zOut').addEventListener('click',()=>{zoom=Math.max(.4,+(zoom-.2).toFixed(2));applyTheme();});
$('zFit').addEventListener('click',()=>{zoom=1.6;applyTheme();});
const BGS=['dots','plain','checker','dark'];
$('bgB').addEventListener('click',()=>{bgMode=(bgMode+1)%4;BGS.forEach(b=>pgs.classList.remove('bg-'+b));pgs.classList.add('bg-'+BGS[bgMode]);$('bgB').textContent='Canvas: '+BGS[bgMode];applyTheme();});
$('cmpB').addEventListener('click',()=>{const on=!$('cmp').classList.contains('on');$('cmp').classList.toggle('on',on);$('cmpB').classList.toggle('on',on);});
$('undoB').addEventListener('click',undo);$('redoB').addEventListener('click',redo);
pgs.addEventListener('scroll',updateSel);addEventListener('resize',updateSel);
pgm.addEventListener('keydown',e=>{if(e.target===code||e.target.matches('input[type=text],textarea')||pv.isContentEditable)return;const k=e.key.toLowerCase();
  if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();e.shiftKey?redo():undo();}else if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();redo();}
  else if(sel&&(k==='delete'||k==='backspace')&&tool==='select'){e.preventDefault();const p=sel.parentElement;sel.remove();sel=p!==pv?p:null;changed({rebuild:1});buildTree();buildProps();}});

/* ---------- open / close / save ---------- */
const rebuildAll=()=>{buildComp();if(!$('paneInsp').hidden){buildTree();buildProps();}updateSel();};
const openPG=(i,btn,shared)=>{
  cur=i;lastBtn=btn;const it=ALL[i];const saved=shared||REM[it.n]||{};
  state=Object.assign(DEF(),saved);delete state.html;touched=new Set(Object.keys(saved).filter(k=>k!=='html'));
  $('pgTitle').textContent=it.n;$('pgAka').textContent=it.a;knobs.forEach(k=>{k.value=state[k.dataset.k];});
  pv.innerHTML=saved.html!=null?saved.html:it.demo;syncRanges(pv);{const tmp=document.createElement('div');tmp.innerHTML=it.demo;syncRanges(tmp);baseline=tmp.innerHTML;}
  $('cmpIn').innerHTML=it.demo;syncRanges($('cmpIn'));
  sel=null;zoom=1.6;$('simSel').value='';[...pv.classList].filter(c=>c.startsWith('sim-')).forEach(c=>pv.classList.remove(c));
  setTool('interact');applyTheme();code.value=pv.innerHTML;hist=[];hi=-1;pushHist();
  pgm.classList.add('open');pgm.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  showTab('Comp');buildComp();msg.textContent=shared?'Someone shared this remix with you. Save to card to keep it.':REM[it.n]?'This is your saved remix. Reset brings back the original.':'';
  pgm.querySelector('.pgx').focus();
};
const closePG=()=>{if(!pgm.classList.contains('open'))return;pgm.classList.remove('open');pgm.setAttribute('aria-hidden','true');document.body.style.overflow='';setTool('interact');sel=null;if(lastBtn)lastBtn.focus();};
document.addEventListener('click',e=>{const b=e.target.closest('[data-play]');if(b)openPG(+b.dataset.play,b);if(e.target.closest('[data-pgclose]'))closePG();});
knobs.forEach(k=>k.addEventListener('input',()=>{const key=k.dataset.k;state[key]=(k.type==='range')?+k.value:k.value;touched.add(key);applyTheme();refreshPrompt();clearTimeout(histT);histT=setTimeout(pushHist,350);}));
let codeT;code.addEventListener('input',()=>{clearTimeout(codeT);codeT=setTimeout(()=>{pv.innerHTML=code.value;syncRanges(pv);sel=null;rebuildAll();pushHist();},300);});
const cleanHTML=()=>pv.innerHTML;
$('pgSave').addEventListener('click',()=>{
  const it=ALL[cur];const out={};touched.forEach(k=>out[k]=state[k]);const h=cleanHTML();if(h!==baseline)out.html=h;
  if(Object.keys(out).length)REM[it.n]=out;else delete REM[it.n];const ok=saveREM();refreshCard(cur);
  msg.textContent=Object.keys(out).length?(ok?'Saved. The card shows your version, and it stays in this browser.':'Saved to the card for this visit. Your browser blocked long-term storage.'):'Nothing changed yet, so there’s nothing to save.';});
$('pgReset').addEventListener('click',()=>{delete REM[ALL[cur].n];saveREM();refreshCard(cur);openPG(cur,lastBtn);msg.textContent='Back to the original.';});
const hsl2hex=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');};
$('pgRand').addEventListener('click',()=>{const h=Math.floor(Math.random()*360),dark=Math.random()<.3;
  Object.assign(state,{ink:hsl2hex(h,60,dark?88:16),paper:hsl2hex(h,40,dark?14:97),soft:hsl2hex(h,35,dark?24:86),accent:hsl2hex((h+150)%360,75,52),bg:hsl2hex(h,30,dark?9:92),
    corners:['','sharp','round'][Math.floor(Math.random()*3)],font:['','f-sans','f-serif','f-mono'][Math.floor(Math.random()*4)],bw:[1.5,2,3,4][Math.floor(Math.random()*4)],rot:Math.round(Math.random()*10-5)});
  ['ink','paper','soft','accent','bg','corners','font','bw','rot'].forEach(k=>touched.add(k));knobs.forEach(k=>{k.value=state[k.dataset.k];});applyTheme();pushHist();msg.textContent='New look. Save it to keep it on the card.';});
const copyText=(t,ok)=>{const fail=()=>{code.value=t;showTab('Code');code.select();msg.textContent='Press Ctrl+C (⌘C) to copy the selected code.';};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>msg.textContent=ok,fail);else fail();};
$('pgCopy').addEventListener('click',()=>copyText(cleanHTML(),'HTML copied. It uses this guide’s styles; Copy as page includes them.'));
/* The guide's CSS lives in css/style.css: read it from the loaded sheet, or fetch it if the browser hides the rules. */
const pageCSS=async()=>{const sh=[...document.styleSheets].find(s=>s.href&&/css\/style\.css$/.test(s.href));
  try{return [...sh.cssRules].map(r=>r.cssText).join('\n');}catch(e){}
  try{const r=await fetch('css/style.css');if(r.ok)return await r.text();}catch(e){}return null;};
$('pgCopyAll').addEventListener('click',async()=>{const css=await pageCSS();
  if(css==null){msg.textContent='Couldn’t read the styles here. Run the guide from a local server (see README) to copy a full page.';return;}
  const page=`<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc2(ALL[cur].n)}</title>\n<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=Courier+Prime:wght@400;700&family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100&display=swap" rel="stylesheet">\n<style>${css}\nbody::before{display:none}body{display:grid;place-items:center;min-height:100vh;background:${state.bg}}</style></head>\n<body><div class="${pv.className.replace(/\b(sim-\S+|selmode)\b/g,'')}" style="${varStyle(state)}--zoom:1.6">${cleanHTML()}</div></body></html>`;
  copyText(page,'Full page copied. Paste it into a .html file and open it in a browser.');});

/* ---------- share links (no server: the remix travels inside the URL hash) ---------- */
const slug=s=>s.toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const SLUG=new Map();ALL.forEach((it,i)=>{const s=slug(it.n);if(!SLUG.has(s))SLUG.set(s,i);});
const pageURL=()=>location.href.split('#')[0];
const toB64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
const fromB64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const MAXU=1<<20;
const pipe=async(u8,T)=>{const r=new Blob([u8]).stream().pipeThrough(T).getReader();const parts=[];let n=0;
  for(;;){const{done,value}=await r.read();if(done)break;n+=value.length;if(n>MAXU){r.cancel();throw new Error('too big');}parts.push(value);}
  const out=new Uint8Array(n);let o=0;parts.forEach(p=>{out.set(p,o);o+=p.length;});return out;};
const packShare=async obj=>{const u=new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){try{return 'z'+toB64(await pipe(u,new CompressionStream('deflate-raw')));}catch(e){}}return 'j'+toB64(u);};
const unpackShare=async s=>{if(s.length>200000)throw new Error('too long');const u=fromB64(s.slice(1));
  const b=s[0]==='z'?await pipe(u,new DecompressionStream('deflate-raw')):s[0]==='j'?u:null;if(!b)throw new Error('bad');return JSON.parse(new TextDecoder().decode(b));};
const currentRemix=()=>{const out={};touched.forEach(k=>out[k]=state[k]);const h=cleanHTML();if(h!==baseline)out.html=h;return out;};
const copyLink=(url,ok,where)=>{const fail=()=>{window.prompt('Copy this link:',url);where.textContent=ok;};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(()=>where.textContent=ok,fail);else fail();};
$('pgShare').addEventListener('click',async()=>{const it=ALL[cur],r=currentRemix();
  if(!Object.keys(r).length){copyLink(`${pageURL()}#t=${slug(it.n)}`,'Link to this term copied. Change something first to share a remix.',msg);return;}
  const url=`${pageURL()}#remix=${await packShare({v:1,t:it.n,s:r})}`;
  copyLink(url,url.length>8000?'Remix link copied. It’s long, so some chat apps may cut it off.':'Remix link copied. Anyone who opens it sees your version.',msg);});
const flashCard=i=>{const c=$('c-'+i);if(!c)return;q.value='';doSearch();c.scrollIntoView({block:'center',behavior:'smooth'});c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash');};
const routeHash=async()=>{const h=location.hash.slice(1);
  try{
    if(h.startsWith('t=')){const i=SLUG.get(decodeURIComponent(h.slice(2)));if(i!=null)flashCard(i);}
    else if(h.startsWith('remix=')){const d=await unpackShare(h.slice(6));const i=d&&ALL.findIndex(t=>t.n===d.t);const r=d&&cleanRemix(d.s);
      history.replaceState(null,'',pageURL());
      if(i>=0&&r){flashCard(i);openPG(i,$('c-'+i).querySelector('[data-play]'),r);}}
  }catch(e){try{history.replaceState(null,'',pageURL());}catch(_){}}};
addEventListener('hashchange',routeHash);

/* ---------- back up / restore remixes ---------- */
const remMsg=$('remMsg');
const remCount=()=>{const n=Object.keys(REM).length;$('remCount').textContent=n?`You have ${n} saved remix${n===1?'':'es'} in this browser.`:'Remixes you save stay in this browser. Back them up to move them to another one.';$('remExport').disabled=$('remClear').disabled=!n;};
const _saveREM=saveREM;saveREM=()=>{const ok=_saveREM();remCount();return ok;};
$('remExport').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({app:'ui-field-guide',v:1,remixes:REM},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`ui-field-guide-remixes-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  remMsg.textContent='Backup downloaded.';});
$('remImport').addEventListener('click',()=>$('remFile').click());
$('remFile').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  try{if(f.size>5e6)throw 0;const d=JSON.parse(await f.text());const got=cleanRemixes(d&&d.remixes?d.remixes:d);const n=Object.keys(got).length;
    if(!n){remMsg.textContent='That file has no remixes this guide can use.';return;}
    Object.assign(REM,got);saveREM();ALL.forEach((t,i)=>{if(got[t.n])refreshCard(i);});remMsg.textContent=`Restored ${n} remix${n===1?'':'es'}.`;}
  catch(_){remMsg.textContent='Couldn’t read that file. Pick a backup made with Back up.';}});
$('remClear').addEventListener('click',()=>{const n=Object.keys(REM).length;if(!n||!confirm(`Delete all ${n} saved remix${n===1?'':'es'} from this browser? Back up first if you want to keep them.`))return;
  const names=Object.keys(REM);REM={};saveREM();ALL.forEach((t,i)=>{if(names.includes(t.n))refreshCard(i);});remMsg.textContent='All remixes cleared.';});
remCount();

/* exp bar = reading progress */
const fill=document.getElementById('expFill'),now=document.getElementById('expNow');
const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;const f=h>0?Math.min(1,scrollY/h):0;fill.style.width=(f*100)+'%';now.textContent=`${Math.round(f*total)} terms read`;};
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* active category */
const links=[...document.querySelectorAll('#sideNav a')];
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.dataset.sec===en.target.id.slice(2)));}});},{rootMargin:'-30% 0px -65% 0px'});
document.querySelectorAll('section.cat').forEach(s=>io.observe(s));

/* search */
const q=document.getElementById('q'),cnt=document.getElementById('cnt'),empty=document.getElementById('empty');
const cards=[...document.querySelectorAll('.card')];
const doSearch=()=>{const v=q.value.trim().toLowerCase();let shown=0;
  cards.forEach(c=>{const m=!v||c.dataset.k.includes(v);c.hidden=!m;if(m)shown++;});
  document.querySelectorAll('section.cat').forEach(s=>{s.hidden=!s.querySelector('.card:not([hidden])');});
  cnt.textContent=v?`${shown} found`:`${total} terms`;empty.classList.toggle('on',shown===0);};
q.addEventListener('input',doSearch);doSearch();

/* category sheet */
const sheet=document.getElementById('sheetNav'),menuBtn=document.getElementById('menuBtn');
const setSheet=o=>{sheet.classList.toggle('open',o);sheet.setAttribute('aria-hidden',!o);menuBtn.setAttribute('aria-expanded',o);if(o)sheet.querySelector('a').focus();};
menuBtn.addEventListener('click',()=>setSheet(!sheet.classList.contains('open')));
sheet.addEventListener('click',e=>{if(e.target.closest('[data-close],a'))setSheet(false);});
/* Escape inside an open dropdown only closes that dropdown. Checked while capturing, before the browser closes the picker. */
let escInPicker=false;
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const s=e.target.closest&&e.target.closest('select');
  try{escInPicker=!!s&&s.matches(':open');}catch(_){escInPicker=false;}},true);
addEventListener('keydown',e=>{if(e.key==='Escape'){if(escInPicker){escInPicker=false;return;}setSheet(false);closePG();}
  else if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!pgm.classList.contains('open')&&!e.target.closest('input,textarea,select,[contenteditable="true"]')){e.preventDefault();q.focus();q.select();}});
routeHash();

/* theme */
/* Light is the default for everyone; dark is only ever the visitor's own choice (saved, and applied early in <head>). */
const root=document.documentElement,themeBtn=$('themeBtn'),themeMeta=document.querySelector('meta[name=theme-color]');
const setTheme=t=>{if(t==='dark')root.dataset.theme='dark';else delete root.dataset.theme;
  const dark=t==='dark';themeBtn.setAttribute('aria-pressed',dark);themeBtn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
  if(themeMeta)themeMeta.content=dark?'#121110':'#f4f1ea';};
setTheme(root.dataset.theme==='dark'?'dark':'light');
themeBtn.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';setTheme(next);
  try{localStorage.setItem('ufg-theme',next);}catch(e){}});
