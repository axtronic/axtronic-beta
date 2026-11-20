/* global URLSearchParams, location, document, matchMedia, clearTimeout, setTimeout, performance, requestAnimationFrame, fetch, history, scrollTo, setInterval */
const URL_SB = 'https://eqdjmaarjfsdfomkducz.supabase.co';
const CLAVE = 'sb_publishable_ctpCybT7Bxan6aEJhiKjPw_hyapptwg';
const DEMO = new URLSearchParams(location.search).has('demo');
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
const views = { hoy:'Hoy', decisiones:'Decidir', fabrica:'Fábrica', bugs:'Bugs', tienda:'Tienda' };
const paths = {
  hoy:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  decisiones:'M8 5H4v16h16V5h-4 M8 3h8v4H8z M8 14l3 3 5-6',
  fabrica:'M3 4h5v12H3z M10 4h5v16h-5z M17 4h4v8h-4z',
  bugs:'M7 9h10v7a5 5 0 0 1-10 0z M9 9V7a3 3 0 0 1 6 0v2 M3 10l4 2 M21 10l-4 2 M3 16h4 M17 16h4 M5 21l3-3 M19 21l-3-3',
  tienda:'M5 9h14l1 12H4z M8 10V7a4 4 0 0 1 8 0v3',
  instalacion:'M12 2v13 M7 10l5 5 5-5 M4 16v5h16v-5',
  solicitudes:'M3 5h18v14H3z M3 6l9 7 9-7',
  cuentas:'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21a8 8 0 0 1 16 0',
  ejercicio:'M2 13h5l3-8 4 14 3-8 2 2h3',
  reporte:'M3 4h18v13H9l-6 4z M7 9h10 M7 13h6',
  crash:'M12 3l10 18H2z M12 9v5 M12 17v1',
  flecha:'M4 12h15 M13 6l6 6-6 6'
};
const icon = name => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[name] ?? paths.bugs}"/></svg>`;
const steps = [
  ['acceso.respuestas_enviadas','Respuestas a «ACCESO»'],
  ['acceso.solicitudes','Solicitudes'], ['beta.instalaciones','Instalaciones'],
  ['app.cuentas','Cuentas'], ['app.sesiones_7d','Sesiones en 7 días']
];
const stages = [
  ['Propuesta',['propuesta','needs_human'],'warn'], ['Aprobada',['aprobada'],'muted'],
  ['En curso',['en_curso'],'deep'], ['Para revisar',['revision'],'accent'], ['Hecha',['integrada'],'ok']
];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const date = value => new Date(value).toLocaleDateString('es-MX',{day:'numeric',month:'short',timeZone:'UTC'});
const num = value => value == null ? 'Sin dato' : esc(value);
const count = value => value == null ? 'Sin dato' : `<span data-count="${esc(value)}">${esc(value)}</span>`;
const go = (view,label) => `<button class="link" data-ir="${view}">${label} ${icon('flecha')}</button>`;
const chip = (label,tone='muted') => `<span class="chip ${tone}">${esc(label)}</span>`;
const panel = (title,body,cls='') => `<section class="module ${cls}"><h2>${title}</h2>${body}</section>`;
let sb, data, histories, busy = false, request = 0, toastTimer;
let view = Object.hasOwn(views,location.hash.slice(1)) ? location.hash.slice(1) : 'hoy';
function notice(message) {
  $('#aviso').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#aviso').textContent = '', 3500);
}
function indexMetrics(rows) {
  const byKey = new Map();
  for (const [day,key,value] of rows) {
    if (value == null || !Number.isFinite(Number(value))) continue;
    if (!byKey.has(key)) byKey.set(key,new Map());
    byKey.get(key).set(day,Number(value));
  }
  return new Map(Array.from(byKey, ([key,days]) => [key,[...days].sort(([a],[b]) => a.localeCompare(b))]));
}
const series = key => histories.get(key) ?? [];
const latest = key => series(key).at(-1)?.[1] ?? null;
const pending = () => data.decisiones.filter(d => d.estado === 'pendiente');
const free = () => data.bugs.filter(b => !b.tarea_id);
const waiting = () => data.tareas.filter(t => !t.closed_at && ['propuesta','needs_human','revision'].includes(t.estado));
function attention() {
  const parts = [[pending().length,'Decisiones','decisiones','accent'],[waiting().length,'Tareas','fabrica','warn'],[free().length,'Bugs sin tarea','bugs','bad']];
  const total = parts.reduce((sum,[n]) => sum+n,0);
  let offset = 0;
  const marks = parts.map(([n,,,tone]) => {
    if (!n) return '';
    if (total < 10) return Array.from({length:n},() => {
      const angle = (offset++ / 10 * 2 - .5) * Math.PI;
      return `<circle class="${tone} mark" cx="${60+48*Math.cos(angle)}" cy="${60+48*Math.sin(angle)}" r="4"/>`;
    }).join('');
    const length = 100*n/total;
    const segment = `<circle class="arc ${tone}" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="${length} ${100-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)"/>`;
    offset += length;
    return segment;
  }).join('');
  return `<section class="hero"><div class="hero-copy"><div class="kicker">Hoy</div><h2>Esperan tu decisión</h2>
    <div class="attention"><div class="dial"><svg viewBox="0 0 120 120" aria-hidden="true">${marks}</svg><strong>${count(total)}</strong></div>
    <div class="legend">${parts.map(([n,label,target,tone]) => `<button data-ir="${target}"><i class="${tone}"></i>${label}<b>${n}</b></button>`).join('')}</div></div>
    ${total ? `<button class="primary" data-ir="${parts.find(([n])=>n)[2]}">Resolver ahora ${icon('flecha')}</button>` : '<p>Todo atendido.</p>'}</div></section>`;
}
function metricHistory(key) {
  const all = series(key);
  if (!all.length) return '<small>Sin mediciones</small>';
  if (all.length < 7) return `<small>Historia desde ${esc(date(all[0][0]))}</small>`;
  const days = all.slice(-14), max = Math.max(1,...days.map(([,v])=>v));
  const bars = days.map(([day,v],i) => {
    const h = 25*v/max;
    return `<g><title>${esc(date(day))} · ${num(v)}</title><rect x="${i*7}" y="${26-h}" width="4" height="${h || 1}"/></g>`;
  }).join('');
  return `<svg class="spark" role="img" aria-label="Mediciones diarias: ${days.map(([day,v])=>esc(date(day))+' '+num(v)).join(', ')}" viewBox="0 0 ${days.length*7} 28" preserveAspectRatio="none">${bars}</svg><small>${esc(date(days[0][0]))} – ${esc(date(days.at(-1)[0]))}</small>`;
}
function kpis() {
  return `<section class="kpis" aria-label="Indicadores de la beta">${[
    [2,'instalacion','Acumuladas'],[1,'solicitudes','Acumuladas'],[3,'cuentas','Acumuladas'],[4,'ejercicio','Últimos 7 días']
  ].map(([idx,symbol,period])=>{
    const [key,label] = steps[idx];
    return `<article class="kpi"><div class="metric-name">${icon(symbol)}<h2>${idx===4?'Sesiones':label}</h2></div><strong>${count(latest(key))}</strong><p>${period}</p>${metricHistory(key)}</article>`;
  }).join('')}</section>`;
}
function funnel() {
  const max = Math.max(1,...steps.map(([k])=>latest(k) ?? 0));
  return panel('Embudo de captación',`<ol class="funnel">${steps.map(([key,label])=>{
    const value = latest(key);
    const bars = max < 10 ? Array.from({length:value ?? 0},(_,i)=>`<rect x="${i*100/max}" width="${86/max}" height="6" rx="1"/>`).join('') : `<rect width="${100*(value??0)/max}" height="6" rx="1"/>`;
    return `<li><div><span>${label}</span><b>${num(value)}</b></div><svg aria-hidden="true" viewBox="0 0 100 6" preserveAspectRatio="none">${bars}</svg></li>`;
  }).join('')}</ol><p class="note">Cada fuente cuenta por separado. Los pasos pueden incluir personas distintas.</p>`,'captacion');
}
function storePath() {
  const n = latest('play.verificadores_inscritos');
  const milestones = [['Prueba cerrada','Activa'],['12 verificadores',n==null?'Sin dato':n>=12?'Meta alcanzada':n+' inscritos'],['14 días seguidos','Por confirmar'],['Pedir producción','Por confirmar']];
  return panel('Camino a la tienda',`<div class="store-number"><strong>${count(n)}</strong> de 12 verificadores</div>
    <div class="points" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i class="${n!=null && i<n?'filled':''}">${i+1}</i>`).join('')}</div>
    <p class="note">${n==null?'El recolector de la PC sube el número de inscritos.':'Se necesitan 12 inscritos durante 14 días seguidos.'}</p>
    <ol class="timeline">${milestones.map(([label,status],i)=>`<li class="${i===0 || (i===1 && n>=12)?'done':''}"><b>${label}</b><small>${esc(status)}</small></li>`).join('')}</ol>`,'store');
}
const destinations = {ver_play:'tienda',ver_decision:'decisiones',ver_fabrica:'fabrica',ver_tarea:'fabrica'};
function recItem(r) {
  const a = r.accion;
  const button = a.op === 'proponer' ? `<button data-op="proponer" data-huella="${esc(a.huella)}">Mandar a la fábrica</button>` :
    `<button data-ir="${destinations[a.op] ?? 'hoy'}" data-target="${esc(a.id)}">Ver ${({ver_play:'tienda',ver_decision:'decisión',ver_tarea:'tarea',ver_fabrica:'fábrica'})[a.op] ?? 'detalle'}</button>`;
  return `<article class="item">${priority(r.prioridad)}<h3>${esc(r.titulo)}</h3><p>${esc(r.evidencia)}</p>${button}</article>`;
}
const priority = p => p===1 ? chip('Urgente','bad') : p===2 ? chip('Conviene','warn') : chip('Prioridad baja');
function recommendations() {
  const groups = new Map();
  for (const r of data.recomendaciones) {
    if (!groups.has(r.regla)) groups.set(r.regla,[]);
    groups.get(r.regla).push(r);
  }
  const labels = {aplicando_atascada:'respuestas tuyas sin terminar de aplicar',bug_sin_tarea:'bugs sin tarea',revision_esperando:'tareas por revisar'};
  return panel('Recomendaciones',[...groups].map(([key,rows])=>rows.length===1 ? recItem(rows[0]) :
    `<details data-group="${esc(key)}"><summary>${priority(Math.min(...rows.map(r=>r.prioridad)))} ${rows.length} ${Object.hasOwn(labels,key)?labels[key]:'recomendaciones del mismo tipo'}</summary>${rows.map(recItem).join('')}</details>`).join('') || '<p>Todo atendido.</p>','recs');
}
function factorySummary() {
  const columns = stages.map(([name,states,color])=>[name,data.tareas.filter(t=>states.includes(t.estado)),color]);
  const other = data.tareas.filter(t=>!stages.some(([,states])=>states.includes(t.estado)));
  if (other.length) columns.push(['Otros estados',other,'muted']);
  const bar = columns.map(([,rows,color]) => {
    if (data.tareas.length < 10) return rows.map(() => `<i class="${color}" style="flex-grow:1"></i>`).join('');
    return rows.length ? `<i class="${color}" style="flex-grow:${rows.length}"></i>` : '';
  }).join('');
  return {columns, summary:panel('Flujo de la fábrica',`<strong class="big">${count(data.tareas.length)}</strong> tareas en el tablero
    <div class="stack" aria-hidden="true">${bar}</div>
    <div class="keys">${columns.map(([name,rows,color])=>`<span><i class="${color}"></i>${name} <b>${rows.length}</b></span>`).join('')}</div>${view==='hoy'?go('fabrica','Abrir fábrica'):''}`,'flow')};
}
function taskCard(t) {
  const move = (state,label,primary=false)=>`<button class="${primary?'primary':''}" data-op="mover" data-id="${esc(t.id)}" data-a="${state}">${label}</button>`;
  let actions='';
  if (['propuesta','needs_human'].includes(t.estado)) actions=move('aprobada','Aprobar',true)+move('descartada','Descartar');
  if (t.estado==='revision') actions=move('integrada','Marcar fusionada',true)+move('rechazada','Rechazar');
  const state = {needs_human:'Te necesita',descartada:'Descartada',rechazada:'Rechazada'};
  return `<article class="item" tabindex="-1" id="item-${esc(t.id)}">${chip(t.linea)} ${t.severidad?chip(t.severidad,'warn'):''} ${Object.hasOwn(state,t.estado)?chip(state[t.estado],'warn'):''}
    <h3>${esc(t.titulo)}</h3><small>${esc(date(t.updated_at))}</small>
    ${/^https?:\/\//i.test(t.pr)?`<a href="${esc(t.pr)}">Ver cambio</a>`:''}<div class="actions">${actions}</div></article>`;
}
function factory() {
  const {columns,summary} = factorySummary();
  return summary+`<section class="board" tabindex="0" aria-label="Tablero de tareas. Desplázate horizontalmente.">${columns.map(([name,rows,color])=>`<section class="lane"><h2><i class="${color}"></i>${name}<b>${rows.length}</b></h2>${rows.map(taskCard).join('') || '<small>Sin tareas</small>'}</section>`).join('')}</section>`+
    panel('Pedir algo nuevo','<label for="nueva">¿Qué quieres cambiar y dónde?</label><textarea id="nueva" rows="2"></textarea><button class="primary" data-op="nueva">Proponer tarea</button>');
}
function decision(d) {
  const age = Math.max(0, Math.floor((new Date(data.ahora)-new Date(d.created_at))/86400000));
  const options = d.opciones.length ? d.opciones : ['Hecho'];
  const wait = d.estado==='pendiente';
  return `<article class="module decision" tabindex="-1" id="item-${esc(d.id)}">${wait?`<small>${num(age)} ${age===1?'día':'días'} esperando</small><div class="age"><i class="${age>=7?'bad':age>=3?'warn':'accent'}" style="width:${100*(age+1)/(age+7)}%"></i></div>`:chip(d.estado)}
    <h3>${esc(d.titulo)}</h3><p>${esc(d.contexto)}</p>${wait?`<label for="c-${esc(d.id)}">Comentario opcional</label><textarea id="c-${esc(d.id)}" rows="2"></textarea>
    <div class="actions">${options.map((o,i)=>`<button class="${i?'':'primary'}" data-op="decidir" data-id="${esc(d.id)}" data-opcion="${esc(o)}">${esc(o)}</button>`).join('')}</div>`:d.respuesta?`<p>Elegiste: ${esc(d.respuesta.opcion)}</p>`:''}</article>`;
}
function decisions() {
  const groups = [['Aplicando',data.decisiones.filter(d=>d.estado==='aplicando')],['Otras respuestas',data.decisiones.filter(d=>!['pendiente','aplicando'].includes(d.estado))]];
  return `<h2 class="section-title">Pendientes <span>${pending().length}</span></h2><div class="grid">${pending().sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(decision).join('') || '<p>Todo atendido.</p>'}</div>`+
    groups.filter(([,rows])=>rows.length).map(([title,rows])=>`<details class="module" data-group="${title}"><summary>${title} · ${rows.length}</summary><div class="grid">${rows.map(decision).join('')}</div></details>`).join('');
}
function bugs() {
  const reports = data.bugs.filter(b=>b.fuente==='reporte').reduce((sum,b)=>sum+Number(b.veces),0);
  const installs = latest('beta.instalaciones');
  const labels = {reporte:'Reporte',crash:'Fallo automático',ejercicio:'Ejercicio'};
  return panel('Bandeja de bugs',`<strong class="big">${count(data.bugs.length)}</strong> casos · ${free().length} sin tarea<p>${num(reports)} ${reports===1?'reporte':'reportes'} ${installs==null?'· instalaciones sin dato':'de '+num(installs)+' instalaciones'}</p>`)+
    `<div class="grid">${data.bugs.map(b=>`<article class="module"><div class="metric-name">${icon(Object.hasOwn(labels,b.fuente)?b.fuente:'bugs')}${esc(Object.hasOwn(labels,b.fuente)?labels[b.fuente]:b.fuente)}</div><h3>${esc(b.titulo)}</h3><p>${esc(b.detalle)}</p>
    <small>${num(b.veces)} ${b.veces===1?'vez':'veces'} · ${esc(date(b.ultimo))}${b.build?' · Versión '+esc(b.build):''}</small><div class="actions">${b.tarea_id?
    `<button data-ir="fabrica" data-target="${esc(b.tarea_id)}">Ver tarea · ${esc(b.tarea_estado)}</button>`:`<button class="primary" data-op="proponer" data-huella="${esc(b.huella)}">Mandar a la fábrica</button>`}</div></article>`).join('')}</div>`;
}
function draw() {
  const render = {hoy:()=>attention()+kpis()+'<div class="grid">'+funnel()+storePath()+recommendations()+factorySummary().summary+'</div>',
    decisiones:decisions,fabrica:factory,bugs,tienda:()=>'<div class="grid">'+storePath()+funnel()+'</div>'};
  $('nav').hidden=false;
  $('nav').innerHTML=Object.entries(views).map(([k,label])=>`<button data-ir="${k}" ${view===k?'aria-current="page"':''}>${icon(k)}${label}</button>`).join('');
  $('#titulo').textContent=view==='hoy'?'Vista general':views[view];
  $('#app').innerHTML=render[view]();
  if (!reduced.matches && !document.hidden) {
    const nodes=[...document.querySelectorAll('[data-count]')];
    const start=performance.now();
    function frame(now) {
      const progress=Math.min(1,(now-start)/200);
      for (const node of nodes) node.textContent=Math.round(Number(node.dataset.count)*progress);
      if (progress<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}
function status() {
  const time=new Date(data.ahora).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});
  $('#estado').innerHTML=`${DEMO?'<span>Demo</span> · ':''}<i></i> Al día ${esc(time)}`;
}
async function load(refresh=false) {
  const generation=++request;
  let next;
  if (DEMO) {
    const response=await fetch('demo.json',{cache:'no-store'});
    if (!response.ok) throw Error('No se pudo leer la demostración.');
    next=await response.json();
  } else {
    const {data:summary,error}=await sb.rpc('panel',{p_op:'resumen'});
    if (error) throw Error(error.message);
    next=summary;
  }
  if (generation!==request) return;
  // Un refresco conserva el comentario, el foco y los grupos abiertos.
  if (refresh && (busy || $('#app textarea:focus, #app details[open], #app button:focus') || [...document.querySelectorAll('textarea')].some(t=>t.value))) return;
  const changed=!data || ['metricas','bugs','tareas','decisiones','recomendaciones'].some(k=>JSON.stringify(data[k])!==JSON.stringify(next[k])) || data.ahora.slice(0,10)!==next.ahora.slice(0,10);
  data=next;
  histories=indexMetrics(data.metricas);
  status();
  if (!refresh) draw();
  else if (changed) refreshView();
}
function refreshView() {
  const fields = [...document.querySelectorAll('textarea')].map(el => [el.id,el.value]);
  const open = new Set([...document.querySelectorAll('details[open]')].map(el => el.dataset.group));
  const active = document.activeElement;
  const group = active.closest('details')?.dataset.group;
  const boardScroll = $('.board')?.scrollLeft;
  draw();
  for (const [id,value] of fields) {
    const field = document.getElementById(id);
    if (field) field.value = value;
  }
  for (const el of document.querySelectorAll('details')) el.open = open.has(el.dataset.group);
  if (boardScroll != null && $('.board')) $('.board').scrollLeft = boardScroll;
  if (active.isConnected) return;
  const replacement = active.id ? document.getElementById(active.id) :
    [...document.querySelectorAll('button,summary')].find(el =>
      el.tagName === active.tagName && el.textContent === active.textContent &&
      JSON.stringify(el.dataset) === JSON.stringify(active.dataset) && group === el.closest('details')?.dataset.group);
  replacement?.focus({preventScroll:true});
  if (active.tagName === 'TEXTAREA') replacement?.setSelectionRange(active.selectionStart,active.selectionEnd);
}
function navigate(button) {
  view=button.dataset.ir;
  const target=button.dataset.target;
  history.replaceState(null,'','#'+view);
  const paint=()=>{
    draw();
    scrollTo(0,0);
    const el=target && document.getElementById('item-'+target);
    if (el) {
      const details=el.closest('details');
      if (details) details.open=true;
      el.focus();
      el.scrollIntoView({block:'center',inline:'nearest'});
    } else $('#contenido').focus({preventScroll:true});
  };
  if (document.startViewTransition && !reduced.matches && !document.hidden) {
    // Una transición que otra interrumpe rechaza sus promesas: no es un error.
    const t = document.startViewTransition(paint);
    for (const p of [t.ready, t.finished, t.updateCallbackDone]) p.catch(() => {});
  } else paint();
}
document.addEventListener('click',async e=>{
  const b=e.target.closest('button');
  if (!b || busy) return;
  if (b.dataset.ir) return navigate(b);
  if (b.id==='entrar') return sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
  if (b.id==='salir') { await sb.auth.signOut(); return location.reload(); }
  const {op,id,a,opcion,huella}=b.dataset;
  if (!op) return;
  if (DEMO) return notice('Demostración. Los cambios no se guardan.');
  let args;
  switch (op) {
    case 'nueva': {
      const titulo=$('#nueva').value.trim();
      if (titulo.length<3) return notice('Escribe qué quieres cambiar.');
      args={titulo}; break;
    }
    case 'decidir': args={id,opcion,comentario:document.getElementById('c-'+id).value}; break;
    case 'mover': args={id,a}; break;
    case 'proponer': args={huella}; break;
    default: return;
  }
  busy=true; b.disabled=true;
  try {
    const {error}=await sb.rpc('panel',{p_op:op==='nueva'?'proponer':op,p_args:args});
    if (error) throw Error(error.message);
    await load();
    notice('Cambio guardado.');
  } catch (error) { notice(error.message); }
  finally { busy=false; b.disabled=false; }
});
function gate(message,button) {
  $('nav').hidden=true;
  $('#app').innerHTML=panel('Acceso al panel',`<p>${esc(message)}</p>${button}`);
}
async function init() {
  if (!DEMO) {
    const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
    sb=createClient(URL_SB,CLAVE);
    const {data:{session}}=await sb.auth.getSession();
    if (!session) return gate('Solo para la cuenta de AXTRONIC.','<button class="primary" id="entrar">Entrar con Google</button>');
  }
  await load();
  setInterval(()=>{
    if (!document.hidden && !busy) load(true).catch(()=>$('#estado').textContent='Actualización pendiente');
  },60000);
}
init().catch(error=>gate(/permiso/.test(error.message)?'Esta cuenta no tiene acceso.':error.message,sb?'<button id="salir">Cambiar de cuenta</button>':''));
