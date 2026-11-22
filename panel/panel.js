/* global window, navigator, URLSearchParams, location, document, matchMedia, clearTimeout, setTimeout, performance, requestAnimationFrame, fetch, history, scrollTo, setInterval */
const URL_SB = 'https://eqdjmaarjfsdfomkducz.supabase.co';
const CLAVE = 'sb_publishable_ctpCybT7Bxan6aEJhiKjPw_hyapptwg';
const DEMO = new URLSearchParams(location.search).has('demo');
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
const views = { hoy:'Hoy', decisiones:'Decidir', fabrica:'Fábrica', sesiones:'Sesiones', equipo:'Equipo', acceso:'Acceso', redes:'Redes', bugs:'Bugs', versiones:'Versiones', tienda:'Tienda', finanzas:'Finanzas' };
const primaryViews = ['hoy','decisiones','fabrica','sesiones'];
const moreViews = Object.keys(views).filter(key=>!primaryViews.includes(key));
const paths = {
  finanzas:'M3 5h18v14H3z M3 9h18 M7 15h4',
  sesiones:'M2 12h5l3-8 4 16 3-8h5',
  equipo:'M9 3h6v5H9z M12 8v5 M5 16v-3h14v3 M2 16h6v5H2z M16 16h6v5h-6z',
  acceso:'M4 21a8 8 0 0 1 16 0 M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
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
  redes:'M3 9l14-5v16L3 15z M5 16l2 5h3l-2-5 M20 8l2-1 M20 14l2 1',
  versiones:'M3 7l9-5 9 5-9 5z M3 12l9 5 9-5 M3 17l9 5 9-5',
  mas:'M4 12h2 M11 12h2 M18 12h2',
  instagram:'M3 7h4l2-3h6l2 3h4v13H3z M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  facebook:'M3 6h12v8H8l-4 3v-3H3z M16 10h5v9h-2v2l-4-2h-5v-3',
  youtube:'M3 4h18v15H3z M10 8l6 4-6 3z',
  tiktok:'M4 12v2 M8 8v10 M12 4v16 M16 7v10 M20 10v4',
  x:'M4 18h15 M4 13h11 M4 8h16',
  flecha:'M4 12h15 M13 6l6 6-6 6'
};
const icon = name => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${Object.hasOwn(paths,name)?paths[name]:paths.redes}"/></svg>`;
const steps = [
  ['acceso.respuestas_enviadas','Respuestas a «ACCESO»'],
  ['acceso.solicitudes','Solicitudes'], ['beta.instalaciones','Beta por GitHub'],
  ['app.cuentas','Cuentas'], ['app.sesiones_7d','Sesiones en 7 días']
];
const stations = [
  ['Entrada', [], 'muted', 'La fábrica', 'Un bug, una petición o una mejora entra como propuesta y pasa a tu aprobación.'],
  ['Tu aprobación', ['propuesta','needs_human'], 'warn', 'Tú', 'Decide qué propuestas entran a la cola y atiende las tareas que necesitan intervención.'],
  ['Cola', ['aprobada'], 'accent', 'La fábrica', 'Las tareas aprobadas esperan su rama de trabajo.'],
  ['Agente en la nube', ['en_curso'], 'deep', 'La fábrica', 'La rutina implementa el cambio en su rama y prepara la revisión.'],
  ['Puerta', [], 'muted', 'GitHub', 'GitHub ejecuta verify y clasifica el riesgo. Este paso no tiene un estado propio en el registro.'],
  ['Tu revisión', ['revision'], 'warn', 'Tú', 'Hay un PR esperando tu revisión. Abre el cambio y registra tu decisión.'],
  ['Integrada', ['integrada'], 'ok', 'GitHub', 'El cambio ya quedó integrado y la tarea se cerró.'],
  ['Descartes', ['descartada','rechazada'], 'bad', 'Tú', 'Aquí se reúnen las propuestas descartadas y los cambios rechazados.']
];
const stateMarks = {propuesta:'?',needs_human:'!',aprobada:'→',en_curso:'▶',revision:'◎',integrada:'✓',descartada:'×',rechazada:'−'};
const rowsAt = i => data.tareas.filter(t=>stations[i][1].includes(t.estado));
const stateColors={propuesta:'warn',needs_human:'bad',aprobada:'accent',en_curso:'deep',revision:'warn',integrada:'ok',descartada:'muted',rechazada:'bad'};
const stageOf = state => stations.findIndex(s=>s[1].includes(state));
const stale = t => {
  const days = (Date.parse(data.ahora)-Date.parse(t.updated_at))/86400000;
  return !t.closed_at && !['integrada','descartada','rechazada'].includes(t.estado) && days>2 ? 'Detenida '+Math.floor(days)+' días' : '';
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const date = value => new Date(value).toLocaleDateString('es-MX',{day:'numeric',month:'short',timeZone:'UTC'});
const num = value => value == null ? 'Sin dato' : esc(value);
const count = value => value == null ? 'Sin dato' : `<span data-count="${esc(value)}">${esc(value)}</span>`;
const go = (view,label) => `<button class="link" data-ir="${view}">${label} ${icon('flecha')}</button>`;
const chip = (label,tone='muted') => `<span class="chip ${tone}">${esc(label)}</span>`;
const panel = (title,body,cls='') => `<section class="module ${cls}"><h2>${title}</h2>${body}</section>`;
let dataPainted=false;
let sb, data, histories, busy = false, request = 0, toastTimer;
let view = Object.hasOwn(views,location.hash.slice(1)) ? location.hash.slice(1) : 'hoy';
function notice(message) {
  ($('#detalle').open ? $('#detalle-aviso') : $('#aviso')).textContent = message;
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
const series = key => key==='beta.build'
  ? [...new Map(releases().slice().reverse().filter(v=>v.publicada).map(v=>[v.publicada.slice(0,10),v.build])).entries()]
  : histories.get(key) ?? [];
const latest = key => series(key).at(-1)?.[1] ?? null;
const pending = () => data.decisiones.filter(d => d.estado === 'pendiente');
// Respondida y sin cerrar: el dueño ya contestó y ninguna sesión lo ha aplicado. Se dice en pantalla para que no se quede así.
const answeredHours = d => Math.max(0, Math.floor((Date.parse(data.ahora)-Date.parse(d.updated_at))/3600000));
const unapplied = () => data.decisiones.filter(d => d.estado === 'respondida' && answeredHours(d) >= 24);
const answeredNote = d => { const h=answeredHours(d); return `<small class="${h>=24?'warn':''}">Respondida hace ${h>=48?Math.floor(h/24)+' días':h+' h'} · falta que una sesión la aplique y la cierre</small>`; };
const free = () => data.bugs.filter(b => !b.tarea_id);
const waiting = () => data.tareas.filter(t => !t.closed_at && ['propuesta','needs_human','revision'].includes(t.estado));
function attention() {
  const parts = [[pending().length,'Decisiones','decisiones','accent'],[waiting().length,'Tareas','fabrica','warn'],[free().length,'Bugs sin tarea','bugs','bad']];
  const total = parts.reduce((sum,[n]) => sum+n,0);
  let offset = 0;
  const marks = parts.map(([n,label,target,tone]) => {
    if (!n) return '';
    const link = shapes => `<a href="#${target}" aria-label="${label}, ${n}">${shapes}</a>`;
    if (total < 10) return link(Array.from({length:n},() => {
      const angle = (offset++ / 10 * 2 - .5) * Math.PI;
      return `<circle class="${tone} mark" cx="${60+48*Math.cos(angle)}" cy="${60+48*Math.sin(angle)}" r="4"/>`;
    }).join(''));
    const length = 100*n/total;
    const point=p=>[60+48*Math.sin(p*Math.PI/50),60-48*Math.cos(p*Math.PI/50)].join(' ');
    const segment=length===100 ? `<circle class="arc ${tone}" cx="60" cy="60" r="48"/>` :
      `<path class="arc ${tone}" d="M${point(offset)} A48 48 0 ${length>50?1:0} 1 ${point(offset+length)}"/>`;
    offset += length;
    return link(segment);
  }).join('');
  return `<section class="hero"><div class="hero-copy"><div class="kicker">Hoy</div><h2>Esperan tu decisión</h2>
    <div class="attention"><div class="dial"><svg viewBox="0 0 120 120" aria-label="Pendientes por atender">${marks}</svg><strong>${count(total)}</strong></div>
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
function freshness(value) {
  if(!value) return '<small class="fresh">Sin fecha del recolector</small>';
  const dayOnly=/^\d{4}-\d{2}-\d{2}$/.test(value);
  const hours=dayOnly?(Date.parse(dayKey(data.ahora))-Date.parse(value))/3600000:(Date.parse(data.ahora)-Date.parse(value))/3600000;
  const days=Math.floor(hours/24);
  const age=days>=1?`hace ${days} ${days===1?'día':'días'}`:hours>=1?`hace ${Math.floor(hours)} h`:'hoy';
  return `<small class="fresh ${hours>48?'bad':''}" title="Corte: ${esc(stamp(value))}">Dato de ${age}</small>`;
}
const metricFresh=key=>key.startsWith('redes.')||key.startsWith('play.')?freshness(series(key).at(-1)?.[0]):'';
function metricCard(key,label,symbol,period,value=latest(key)) {
  return `<button class="kpi" data-detail="metric" data-key="${key}"><span class="metric-name">${icon(symbol)}${label}</span><strong>${count(value)}</strong><small>${period}</small>${testingCounts(key)}${metricHistory(key)}${metricFresh(key)}</button>`;
}
function kpis() {
  return '<section class="kpis">'+[[2,'instalacion'],[1,'solicitudes'],[3,'cuentas'],[4,'ejercicio']].map(([i,symbol])=>
    metricCard(steps[i][0],i===4?'Sesiones':steps[i][1],symbol,i===4?'Últimos 7 días':'Acumuladas')).join('')+'</section>';
}
const PLAY='https://play.google.com/console/developers/6516826902763385354/app/4974626724056146255';
// Cada paso: clave de la métrica, qué cuenta, de dónde sale y a dónde lleva (página externa o vista del panel).
const journey = () => [
  ['acceso.respuestas_enviadas','Comentaron «ACCESO»','Les respondimos con el enlace en Instagram, Facebook o YouTube.','Respuesta automática',null,'redes','Ver redes'],
  ['acceso.solicitudes','Pidieron acceso','Dejaron su correo en la página de acceso anticipado.','Formulario',null,'acceso','Ver quiénes son'],
  ['acceso.grupo_miembros','Entraron al grupo','Miembros del Grupo de Google de verificadores. Te incluye a ti.','Grupo de Google',groupUrl,null,'Abrir el grupo'],
  ['play.verificadores_inscritos','Aceptaron ser verificadores','Activaron la prueba cerrada en Google Play. Se necesitan 12.','Google Play Console',PLAY+'/app-dashboard',null,'Abrir Play Console'],
  ['play.instalaciones_28d','Instalaron la app','Instalaciones desde Google Play en los últimos 28 días.','Google Play Console',PLAY+'/statistics',null,'Ver estadísticas en Play'],
  ['app.cuentas','Crearon su cuenta','Cuentas registradas dentro de la app.','Servidor de AXTRONIC',null,'acceso','Ver recorrido por persona'],
  ['app.sesiones_7d','Entrenaron esta semana','Sesiones de ejercicio en los últimos 7 días.','Servidor de AXTRONIC',null,null,'']
];
function funnel() {
  const rows = journey();
  const max = Math.max(1,...rows.map(([k])=>latest(k) ?? 0));
  let prev = null;
  const items = rows.map(([key,label,what,source,url,target,action],i)=>{
    const value = latest(key);
    const bars = value==null ? '' : value < 13 ? Array.from({length:value},(_,j)=>`<rect x="${j*100/Math.max(max,12)}" width="${86/Math.max(max,12)}" height="6" rx="1"/>`).join('') : `<rect width="${100*value/max}" height="6" rx="1"/>`;
    // Si un paso tiene más que el anterior, no es un error: son fuentes distintas y hay gente que entró por otra vía.
    const more = value!=null && prev!=null && value>prev ? '<small class="warn">Más que en el paso anterior: incluye personas que entraron por otra vía.</small>' : '';
    if (value!=null) prev = value;
    const link = url ? external(url,action) : target ? go(target,action) : '';
    return `<li><span class="step-n" aria-hidden="true">${i+1}</span><div class="step-body"><span class="spread"><b>${label}</b><strong>${num(value)}</strong></span>
      <small>${what} <span class="chip">${source}</span> ${metricFresh(key)}</small>${testingCounts(key)}${more}
      <svg aria-hidden="true" viewBox="0 0 100 6" preserveAspectRatio="none">${bars}</svg>${link}</div></li>`;
  }).join('');
  return panel('Del comentario al uso',`<p class="note">Siete pasos, de quien comenta en redes a quien ya entrena. Cada número viene de su propia fuente (se indica en cada paso), así que no son siempre las mismas personas. El recorrido de cada persona está en Acceso.</p><ol class="journey">${items}</ol>`,'captacion');
}
function testingCounts(key) {
  if(key!=='play.verificadores_inscritos') return '';
  const group=latest('acceso.grupo_miembros'), accepted=latest(key);
  return `<span class="testing-counts">${num(group)} en el grupo (te incluye) → ${num(accepted)} aceptaron la prueba en Google Play → ${accepted==null?'faltantes para 12 sin dato':'faltan '+num(Math.max(0,12-accepted))+' para 12'}</span><small>Estar en el grupo no basta: cada persona debe abrir el enlace de la prueba y aceptar.</small>`;
}
function storePath() {
  const n = latest('play.verificadores_inscritos');
  const milestones = [['Prueba cerrada','Activa'],['12 verificadores',n==null?'Sin dato':n>=12?'Meta alcanzada':n+' aceptaron'],['14 días seguidos','Empieza al llegar a 12'],['Pedir producción','Después de los 14 días']];
  return panel('Camino a la tienda',`<div>${testingCounts('play.verificadores_inscritos')}${metricFresh('play.verificadores_inscritos')}</div>
    <a class="points" href="${PLAY}/app-dashboard" target="_blank" rel="noopener noreferrer" aria-label="Abrir Play Console: ${n==null?'sin dato':n} de 12 verificadores">${Array.from({length:12},(_,i)=>`<i class="${n!=null && i<n?'filled':''}">${i+1}</i>`).join('')}</a>
    <p class="note">Google pide que los verificadores sigan inscritos durante 14 días seguidos.</p>
    <ol class="timeline">${milestones.map(([label,status],i)=>`<li class="${i===0 || (i===1 && n>=12)?'done':''}"><button class="plain" data-detail="milestone" data-key="${i}"><b>${label}</b><small>${esc(status)}</small></button></li>`).join('')}</ol>
    <div class="actions">${external(PLAY+'/app-dashboard','Abrir Play Console')}${external(PLAY+'/closed-testing','Ver la prueba cerrada')}${external(groupUrl,'Ver miembros del grupo')}${external(playUrl,'Enlace para invitar verificadores')}</div>`,'store');
}
const external = (url,label) => typeof url==='string' && url.startsWith('https://')
  ? `<a class="action-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : '';
const accessSteps = [['solicito','Pidieron acceso'],['correo','Correo enviado'],['grupo','En el grupo'],['cuenta','Cuenta creada'],['primera_sesion','Primera sesión']];
const people = () => data.accesos ?? [];
const lastStep = p => accessSteps.findLastIndex(([field])=>p[field]);
const dayMs = 86400000;
const isStuck = p => {
  const stage=lastStep(p);
  return stage>=0 && stage<4 && Date.parse(data.ahora)-Date.parse(p[accessSteps[stage][0]])>2*dayMs;
};
let accessFilter='all';
const groupUrl='https://groups.google.com/g/axtronic-acceso/members';
const playUrl='https://play.google.com/apps/testing/com.axtronic.app';
function personCard(p,detail=false) {
  const stage=lastStep(p);
  const next=['Falta enviarle el primer correo.','Ya se envió el correo. Comprueba si entró al grupo.','Ya confirmaste el grupo. Falta registrar una cuenta con este correo.','Ya tiene cuenta. Falta su primera sesión registrada.','Ya hizo su primera sesión. No requiere seguimiento para empezar a entrenar.'];
  const stepsHtml=accessSteps.map(([field,label])=>`<li class="${p[field]?'done':''}"><b>${label}</b><small>${p[field]?esc(stamp(p[field])):field==='grupo'||field==='solicito'?'No se sabe':'Pendiente'}</small></li>`).join('');
  return `<article class="item person"><h3>${detail?esc(p.email):detailButton('person',p.id,p.email)}</h3><small>Origen · ${esc(p.origen || 'Directo')} · Correos enviados: ${num(p.correos)}</small><ol class="stepper">${stepsHtml}</ol><p>${next[stage] ?? 'Sin avance registrado.'}</p><div class="actions">${external(groupUrl,'Abrir miembros del grupo')}<button data-op="grupo" data-id="${esc(p.id)}" data-en="${!p.grupo}">${p.grupo?'Quitar la marca':'Marcar que ya está en el grupo'}</button><a class="action-link" href="mailto:${esc(encodeURIComponent(p.email))}?subject=${esc(encodeURIComponent('Tu acceso anticipado a AXTRONIC'))}">Escribirle</a><button data-copy="${esc(p.email)}">Copiar correo</button>${external(playUrl,'Ver la prueba en Google Play')}</div></article>`;
}
function accessView() {
  const rows=people();
  const filterButton=(key,label,n)=>`<button data-filter="${key}" aria-pressed="${key===accessFilter}">${label} <b>${n}</b></button>`;
  const filtered=rows.filter(p=>accessFilter==='all'||(accessFilter==='stuck'?isStuck(p):String(lastStep(p))===accessFilter));
  return panel('Recorrido de acceso',`<div class="access-stages">${accessSteps.map(([field,label],i)=>filterButton(String(i),label,rows.filter(p=>p[field]).length)).join('')}</div><p>Los totales cuentan cada paso registrado. Toca un paso para ver a quienes llegaron hasta ahí.</p><p>El grupo es abierto. Nadie necesita tu aprobación para entrar. Dale seguimiento a quien se atoró y marca su ingreso cuando lo compruebes.</p><p class="note">El servidor desconoce si instalaron la app o activaron la prueba en Google Play. Si usan otra cuenta de Google en la app, no podemos enlazarla con su solicitud. Solo sabemos que entraron al grupo cuando tú lo marcas.</p>`)+
    panel('Personas',`<div class="actions">${filterButton('all','Todas',rows.length)}${filterButton('stuck','Atoradas',rows.filter(isStuck).length)}</div><div class="people">${filtered.map(p=>personCard(p)).join('') || (rows.length?'<p>Nadie en este paso.</p>':'<p>Cuando llegue la primera solicitud, aquí podrás seguir su recorrido.</p>')}</div>`);
}
function stuckCard() {
  const n=people().filter(isStuck).length;
  return panel('Personas atoradas',`<strong class="big">${n}</strong><p>Con más de dos días desde su último paso registrado y sin primera sesión.</p><button data-ir="acceso" data-access="stuck">Ver seguimiento</button>`);
}
function recItem(r) {
  const a=r.accion;
  let action='';
  switch(a.op) {
    case 'ver_decision': action=detailButton('decision',a.id,'Atender decisión',''); break;
    case 'ver_tarea': action=detailButton('task',a.id,'Revisar tarea',''); break;
    case 'proponer': action=`<button data-op="proponer" data-huella="${esc(a.huella)}">Mandar a la fábrica</button>`; break;
    case 'ver_play': action=external(playUrl,'Abrir la prueba en Google Play')+go('acceso','Dar seguimiento'); break;
    case 'ver_fabrica': action='<button data-ir="fabrica" data-compose>Proponer tarea</button>'; break;
  }
  return `<article class="item">${priority(r.prioridad)}<h3>${detailButton('rec',data.recomendaciones.indexOf(r),r.titulo)}</h3><p>${esc(r.evidencia)}</p>${a.op==='ver_play'?metricFresh('play.verificadores_inscritos'):''}<div class="actions">${action}</div></article>`;
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
// Todas las medidas físicas están en celdas. El origen de pantalla es el del viewBox.
const narrowPlant = matchMedia('(max-width: 700px)');
function iso(gx, gy, gz=0) {
  return [20*(gx-gy), 10*(gx+gy)-20*gz];
}
const desktopDeck = {
  view:'-525 -282 1050 580',
  floor:[[-13,-13],[13,-13],[13,13],[-13,13]],
  ports:[[-11,4],[-7,0],[-2.5,-4.5],[2,-9],[12.5,.5],[7.5,5.5],[1.5,11.5],[0,2.5]],
  // Puntos de giro intermedios entre dos estaciones consecutivas.
  turns:{3:[[4,-11],[12.5,-2.5]]},
  ramps:{1:[[-4,0]],5:[[6,5.5]]}, direction:[1,1,1,1,-1,-1,-1,1]
};
const mobileDeck = {
  view:'-176 -84 380 688',
  floor:[[-7.9,.5],[1.5,-7.9],[32.8,24.5],[24.5,32.8]],
  ports:[[-2,2],[2,-2],[9,5],[5,9],[17,21],[21,17],[28.5,24.5],[15,9]],
  turns:{1:[[3,-3],[10,4]],3:[[4,10],[16,22]],5:[[22,16],[29.5,23.5]]},
  ramps:{1:[[4,-4],[16,8]],5:[[23,15],[16,8]]}, direction:[1,1,-1,-1,1,1,-1,-1]
};
const plantDeck = () => narrowPlant.matches ? mobileDeck : desktopDeck;
const shift = ([x,y],dx,dy) => [x+dx,y+dy];
const lerp = (a,b,t) => a.map((n,i)=>n+(b[i]-n)*t);
const path2 = points => 'M'+points.map(p=>p.map(n=>+n.toFixed(2)).join(',')).join(' L');
const outline = (pts,z=0) => path2(pts.map(([x,y])=>iso(x,y,z)));
const face = (cls,points) => `<path class="${cls}" d="${path2(points.map(p=>iso(...p)))} Z"/>`;
function prism(x,y,z,w,d,h) {
  const r=x+w, f=y+d, t=z+h;
  return face('iso-left',[[x,f,z],[r,f,z],[r,f,t],[x,f,t]])+
    face('iso-right',[[r,f,z],[r,y,z],[r,y,t],[r,f,t]])+
    face('iso-top',[[x,y,t],[r,y,t],[r,f,t],[x,f,t]]);
}
function stripe(points,cls='machine-trim') {
  return `<path class="${cls}" d="${path2(points.map(p=>iso(...p)))}"/>`;
}
function loadingDock() {
  return prism(-1,-1,0,1.8,1.6,.52)+prism(-1,-1,.52,.32,1.6,.5)+
    face('iso-top',[[.8,-.8,.52],[1.6,-.8,.05],[1.6,.52,.05],[.8,.52,.52]]);
}
function checkpoint() {
  return prism(-1,-.7,0,1.9,1.45,.23)+prism(-.9,-.5,.23,.54,.65,1)+
    prism(-.85,-.43,1.23,2.05,.32,.24)+stripe([[.05,-.1,1.26],[.2,-.1,1.46]]);
}
function shelving() {
  return prism(-1,-.85,0,.23,1.55,1.65)+prism(.65,-.85,0,.23,1.55,1.65)+
    [0,.72,1.48].map(z=>prism(-1,-.85,z,1.9,1.55,.15)).join('');
}
function agentTower(working) {
  const [x,y]=iso(.76,.04,1.5);
  return prism(-1,-.9,0,1.95,1.8,.23)+prism(-.74,-.73,.23,1.5,1.4,1.75)+
    prism(-.8,-.78,1.98,1.62,1.52,.19)+stripe([[-.5,.68,1.45],[.4,.68,1.45]])+
    stripe([[-.5,.68,1.15],[.4,.68,1.15]])+`<circle class="pilot ${working?'lit':''}" cx="${x}" cy="${y}" r="3.3"/>`;
}
function gantry() {
  // Los pilares flanquean la banda en profundidad; la traviesa cruza sobre ella.
  return prism(-1.45,-.22,0,.38,.48,1.95)+prism(1.08,-.22,0,.38,.48,1.95)+
    prism(-1.45,-.22,1.95,2.91,.48,.32);
}
function inspectionBench() {
  return prism(-.6,-.5,0,1.15,.85,.72)+prism(-1,-.75,.72,2,1.55,.22)+
    stripe([[-.72,-.48,.94],[-.72,-.48,1.7],[.05,-.42,1.98]],'lamp-arm')+
    prism(-.1,-.63,1.8,.58,.46,.2);
}
function shippingDock() {
  return prism(-1,-.8,0,2,1.65,.38)+prism(-.9,-.8,.38,1.6,.3,1.38)+
    stripe([[-.62,-.49,1.09],[-.24,-.49,.85],[.38,-.49,1.6]],'verified');
}
function openBin() {
  return prism(-.96,-.86,0,1.92,1.72,.68)+
    face('bin-mouth',[[-.96,-.86,.69],[.96,-.86,.69],[.96,.86,.69],[-.96,.86,.69]])+
    stripe([[-.85,.87,.3],[.83,.87,.3]]);
}
const machines=[loadingDock,checkpoint,shelving,agentTower,gantry,inspectionBench,shippingDock,openBin];
function machine(i,working) { return machines[i](working); }

function deckFloor(corners) {
  // Intersección de cada línea de la retícula con los bordes de la losa.
  const grid=[];
  for(const axis of [0,1]) {
    const values=corners.map(p=>p[axis]);
    for(let n=Math.ceil(Math.min(...values));n<Math.max(...values);n++) {
      const ends=[];
      corners.forEach((a,i)=>{
        const b=corners[(i+1)%4];
        if((a[axis]<=n && n<b[axis])||(b[axis]<=n && n<a[axis]))
          ends.push(lerp(a,b,(n-a[axis])/(b[axis]-a[axis])));
      });
      if(ends.length===2) grid.push(outline(ends));
    }
  }
  return `<path class="slab-edge" d="${outline(corners,-.33)} Z"/><path class="slab" d="${outline(corners)} Z"/><path class="floor-grid" d="${grid.join(' ')}"/>`;
}
// Muestrear las curvas en el suelo permite reutilizar el eje exacto en travel().
function roundedRoute(points) {
  const out=[points[0]];
  for(let i=1;i<points.length-1;i++) {
    const a=points[i-1],b=points[i],c=points[i+1],before=lerp(b,a,.22),after=lerp(b,c,.22);
    for(let j=0;j<=10;j++) {
      const t=j/10;
      out.push(lerp(lerp(before,b,t),lerp(b,after,t),t));
    }
  }
  return [...out,points.at(-1)];
}
function route(deck,from,to) {
  const bend=to===7?deck.ramps[from]:deck.turns[from];
  return roundedRoute([deck.ports[from],...(bend??[]),deck.ports[to]]);
}
const beltHeight=.32;
function conveyor(points,branch) {
  const left=[],right=[];
  points.forEach(([x,y],i)=>{
    const a=points[Math.max(0,i-1)],b=points[Math.min(i+1,points.length-1)];
    const dx=b[0]-a[0],dy=b[1]-a[1],k=(branch ? .38 : .68)/Math.hypot(dx,dy);
    left.push([x-dy*k,y+dx*k]);right.push([x+dy*k,y-dx*k]);
  });
  const rim=left.concat(right.reverse());
  const mid=Math.floor((points.length-1)/2),a=points[mid],b=points[mid+1];
  const [cx,cy]=iso(...lerp(a,b,.5),beltHeight),[dx,dy]=iso(b[0]-a[0],b[1]-a[1]);
  return `<g class="conveyor${branch?' branch':''}"><path class="belt-edge" d="${outline(rim)} Z"/><path class="belt-surface" d="${outline(rim,beltHeight)} Z"/><path class="rollers" d="${outline(points,beltHeight)}"/><path class="direction" transform="translate(${cx} ${cy}) rotate(${Math.atan2(dy,dx)*180/Math.PI})" d="M-4 -3 L2 0 L-4 3"/></g>`;
}
const stateNames={propuesta:'Propuesta',needs_human:'Necesita intervención',aprobada:'Aprobada',en_curso:'En curso',revision:'En revisión',integrada:'Integrada',descartada:'Descartada',rechazada:'Rechazada'};
function stationCaption(i,rows) {
  if(i===0) return 'Origen de propuestas';
  if(i===4) return 'Verificación';
  if(i===1 && rows.length) return 'Aprueba '+rows.length;
  if(i===5 && rows.length) return 'Revisa '+rows.length;
  return rows.length+' '+(rows.length===1?'tarea':'tareas');
}
function control(kind,key,label) {
  return `role="button" tabindex="0" data-detail="${kind}" data-key="${esc(key)}" aria-label="${esc(label)}"`;
}
function badge(y,label,cls) {
  const w=Math.max(26,label.length*8.2+14);
  return `<g class="badge ${cls}" transform="translate(0 ${y})"><rect x="${-w/2}" y="-12" width="${w}" height="20" rx="6"/><text y="3">${esc(label)}</text></g>`;
}
function slot(deck,i,j,n) {
  const offset=n>6?0:((j%3)-(Math.min(n,3)-1)/2)*.64*deck.direction[i];
  return iso(...shift(deck.ports[i],offset,-offset),beltHeight+(n>6?2:Math.floor(j/3))*.59);
}
function cube(mark) {
  return prism(-.32,-.32,0,.64,.64,.59)+`<text class="crate-mark" y="-8.3">${esc(mark)}</text>`;
}
function box(deck,i,t,j,rows) {
  const pile=rows.length>6,[x,y]=slot(deck,i,j,rows.length);
  const delay=stale(t), label=pile?`${rows.length} tareas en ${stations[i][0]}`:[t.titulo,stateNames[t.estado],delay].filter(Boolean).join(' · ');
  const layers=pile?[2,1].map(n=>`<g transform="translate(0 ${n*11.8})">${cube(stateMarks[t.estado])}</g>`).join(''):'';
  return `<g class="crate-anchor ${stateColors[t.estado]} ${(pile?!rows.some(taskMatches):!taskMatches(t))?'dimmed':''}" transform="translate(${x} ${y})" ${control(pile?'station':'task',pile?i:t.id,label)}><title>${esc(label)}</title><g class="crate-slide">${delay?'<ellipse class="held-ring" cy="-3" rx="16" ry="10"/>':''}${layers}${cube(stateMarks[t.estado])}${pile?badge(-27,String(rows.length),'total'):''}</g></g>`;
}
function plantStation(deck,i,compact) {
  const [name,,tone]=stations[i], rows=rowsAt(i), caption=stationCaption(i,rows);
  const port=deck.ports[i],[px,py]=iso(...port);
  const [x,y]=iso(...(i===4?port:shift(port,-1.08,-1.08)));
  const action=(i===1||i===5)&&rows.length>0;
  const halo=action?face('station-halo',[[-1.4,-1.4],[1.4,-1.4],[1.4,1.4],[-1.4,1.4]]):'';
  const captionSvg=action?badge(40,caption,'action'):`<text class="station-caption" y="44">${esc(caption)}</text>`;
  const delayed=rows.filter(stale);
  const boxes=rows.length>6?(delayed.length?delayed:rows).slice(0,1):rows;
  const holds=[...new Set((rows.length>6?boxes:delayed).map(stale).filter(Boolean))];
  const label=compact?badge(19,String(rows.length),'total'):
    `<g transform="translate(0 ${holds.length*16})"><text class="station-name" y="22">${esc(name)}</text>${captionSvg}</g>`;
  return `<g style="--arrival:${i*38}ms;--slide:${-15*deck.direction[i]}px" class="${tone}"><g class="plant-station" ${compact?'':control('station',i,name+' · '+caption)}>
    <g transform="translate(${x} ${y})">${compact?'':halo}<g class="equipment"><g class="landing">${machine(i,i===3&&rows.length>0)}</g></g></g>
    <g transform="translate(${px} ${py})">${label}</g></g>
    ${compact?'':boxes.map((t,j)=>box(deck,i,t,j,rows)).join('')}
    ${compact?'':holds.map((s,j)=>`<text class="held-label" x="${px}" y="${py+15+j*16}">${esc(s)}</text>`).join('')}</g>`;
}
function plantScene(compact) {
  const deck=plantDeck();
  const belts=Array.from({length:6},(_,i)=>conveyor(route(deck,i,i+1),false)).join('');
  const ramps=[1,5].map(i=>conveyor(route(deck,i,7),true)).join('');
  const terminals=[6,7].map(i=>{
    const port=deck.ports[i], d=deck.direction[i];
    return conveyor([shift(port,-d,d),shift(port,d,-d)],i===7);
  }).join('');
  return `<svg class="factory-scene" viewBox="${deck.view}" ${compact?'aria-hidden="true"':'role="group" aria-label="Recorrido de las tareas por la fábrica"'}>${deckFloor(deck.floor)}${ramps}${belts}${terminals}${stations.map((_,i)=>plantStation(deck,i,compact)).join('')}</svg>`;
}
function plant(compact=false) {
  const alt=stations.map(([name],i)=>{
    const rows=rowsAt(i);
    const delays=rows.filter(stale).map(t=>t.titulo+' · '+stale(t));
    return [name,stationCaption(i,rows),...delays].join(' · ');
  }).join('. ')+'.';
  if(compact) return panel('Flujo de la fábrica',`<button class="mini-plant" data-ir="fabrica" aria-label="Abrir fábrica. ${esc(alt)}">${plantScene(true)}</button>`,'flow');
  const keys=Object.entries(stateNames).map(([state,name])=>`<span><b class="${stateColors[state]}">${esc(stateMarks[state])}</b>${esc(name)}</span>`).join('');
  return panel('Planta de la fábrica',plantScene(false)+`<div class="plant-legend" aria-label="Estados de las tareas">${keys}</div><p class="note">${esc(alt)}</p>`);
}
narrowPlant.addEventListener('change',()=>{
  const scene=$('.factory-scene');
  if(!scene) return;
  const focused=document.activeElement;
  const restoreFocus=scene.contains(focused) && focused.dataset.detail;
  scene.outerHTML=plantScene(Boolean(scene.closest('.mini-plant')));
  if(restoreFocus) [...document.querySelectorAll('.factory-scene [data-detail]')].find(el=>el.dataset.detail===focused.dataset.detail&&el.dataset.key===focused.dataset.key)?.focus({preventScroll:true});
});
const taskNext={propuesta:'Aprueba la propuesta o descártala.',needs_human:'Revisa por qué se detuvo y decide si puede continuar.',aprobada:'Espera la pasada de las 03:30 o las 05:30 de la mañana, hora de México.',en_curso:'La fábrica está trabajando. Por ahora no necesitas intervenir.',revision:'Abre el cambio y, después de revisarlo, márcalo como fusionado o recházalo.',integrada:'El cambio ya se integró. No hay acciones pendientes.',rechazada:'El cambio se rechazó. La tarea está cerrada.',descartada:'La propuesta se descartó. La tarea está cerrada.'};
function taskCard(t,detail=false,expanded=false) {
  const move = (state,label,primary=false)=>`<button class="${primary?'primary':''}" data-op="mover" data-id="${esc(t.id)}" data-a="${state}">${label}</button>`;
  let actions='';
  if (['propuesta','needs_human'].includes(t.estado)) actions=move('aprobada','Aprobar',true)+move('descartada','Descartar');
  if (t.estado==='revision') actions=move('integrada','Marcar fusionada',true)+move('rechazada','Rechazar');
  const state = {needs_human:'Te necesita',descartada:'Descartada',rechazada:'Rechazada'};
  return `<article class="item" tabindex="-1" ${detail===true?'':`id="item-${esc(t.id)}"`}>${chip(segmentName(t.segmento),'accent')} ${chip(t.linea)} ${t.severidad?chip(t.severidad,'warn'):''} ${Object.hasOwn(state,t.estado)?chip(state[t.estado],'warn'):''}
    <h3>${expanded?esc(t.titulo):detailButton('task',t.id,t.titulo)}</h3><small>${esc(date(t.updated_at))} · ${esc(t.estado)} ${esc(stale(t))}</small>
    ${expanded && t.spec?`<h4>Pedido completo</h4><p class="lines">${esc(t.spec)}</p>`:''}${expanded?segmentSelector(t):''}<h4>Qué puedes hacer</h4><p>${esc(Object.hasOwn(taskNext,t.estado)?taskNext[t.estado]:'Consulta el historial de la tarea.')}</p><div class="actions">${/^factory\/[a-z0-9-]{1,60}$/.test(t.rama)?external('https://github.com/axtronic/axtronic/tree/'+t.rama,'Ver la rama'):''}${external(t.pr,'Ver el cambio')}${actions}</div></article>`;
}
const segmentKeys=['app','diseno','reloj','datos','redes','publicacion','finanzas','legal','fabrica'];
let team=null, factorySegment='', openTasksOnly=false, sessionSegment='', sessionFilter='';
const segmentInfo=key=>team?.segmentos.find(s=>s.clave===key);
const segmentName=key=>segmentInfo(key)?.nombre || key || 'Sin segmento';
const openTask=t=>!t.closed_at && !['integrada','rechazada','descartada'].includes(t.estado);
const taskMatches=t=>(!factorySegment || t.segmento===factorySegment) && (!openTasksOnly || openTask(t));
function segmentSelector(t) {
  const options=segmentKeys.map(key=>`<option value="${esc(key)}" ${key===t.segmento?'selected':''}>${esc(segmentName(key))}</option>`).join('');
  return `<p>La atiende: ${esc(segmentInfo(t.segmento)?.agente || 'Sin agente registrado')}</p><label for="segmento-tarea">Cambiar segmento</label><div class="actions"><select id="segmento-tarea">${t.segmento?'':'<option selected disabled>Elige un segmento</option>'}${options}</select><button data-op="segmentar" data-id="${esc(t.id)}">Guardar segmento</button></div>`;
}
function factory() {
  const lanes=stations.map(([name,states,tone],i)=>{
    if(!states.length) return '';
    const rows=rowsAt(i).filter(taskMatches);
    return `<section class="lane"><h2><button class="plain spread" data-detail="station" data-key="${i}"><i class="${tone}"></i>${name}<b>${rows.length}</b></button></h2>${rows.map(t=>taskCard(t)).join('') || '<small>Sin tareas</small>'}</section>`;
  }).join('');
  const others=data.tareas.filter(t=>stageOf(t.estado)<0 && taskMatches(t));
  const filters=['',...segmentKeys].map(k=>`<button data-factory-segment="${esc(k)}" aria-pressed="${factorySegment===k}">${esc(k?segmentName(k):'Todos')}</button>`).join('');
  return plant()+`<h2>Vista de lista</h2><div class="actions" role="group" aria-label="Filtrar tareas por segmento">${filters}</div><button class="scope" data-open-tasks aria-pressed="${openTasksOnly}">Solo tareas abiertas</button>`+'<section class="board" aria-label="Tablero de tareas">'+lanes+(others.length?panel('Otros estados',others.map(t=>taskCard(t)).join('')):'')+'</section>'+
    panel('Pedir algo nuevo','<label for="nueva">¿Qué quieres cambiar y dónde?</label><textarea id="nueva" rows="3" maxlength="20000"></textarea><small>Puede ser largo: la primera línea queda como título y el resto se guarda entero.</small><button class="primary" data-op="nueva">Proponer tarea</button>');
}
function decision(d,detail=false) {
  const age = Math.max(0, Math.floor((new Date(data.ahora)-new Date(d.created_at))/86400000));
  const options = d.opciones ?? [];
  const prefix=detail===true?'detalle-':'';
  const wait = d.estado==='pendiente';
  return `<article class="module decision" tabindex="-1" id="${prefix}item-${esc(d.id)}">${wait?`<small>${num(age)} ${age===1?'día':'días'} esperando</small><div class="age"><i class="${age>=7?'bad':age>=3?'warn':'accent'}" style="width:${100*(age+1)/(age+7)}%"></i></div>`:d.estado==='respondida'?answeredNote(d):chip(d.estado)}
    <h3>${detail===true?esc(d.titulo):detailButton('decision',d.id,d.titulo)}</h3><p>${esc(d.contexto)}</p>${wait?`<label for="${prefix}c-${esc(d.id)}">Comentario opcional</label><textarea id="${prefix}c-${esc(d.id)}" data-comment rows="2"></textarea>
    <div class="actions">${options.map((o,i)=>`<button class="${i?'':'primary'}" data-op="decidir" data-id="${esc(d.id)}" data-opcion="${esc(o)}">${esc(o)}</button>`).join('')}</div>`:d.respuesta?`<p>Elegiste: ${esc(d.respuesta.opcion)}</p>`:''}
    ${d.resolucion?`<p>Qué se hizo · ${esc(d.resolucion)}</p>`:''}
    <div class="actions">${(d.enlaces??[]).map(e=>e.doc?detailButton('documento',e.doc,e.texto,''):external(e.url,e.texto)).join('')}</div>
    ${d.estado!=='resuelta'?`<label for="${prefix}r-${esc(d.id)}">Qué se hizo (opcional)</label><textarea id="${prefix}r-${esc(d.id)}" data-resolution maxlength="2000" rows="2"></textarea>`:''}
    <div class="actions">${d.estado!=='resuelta'?`<button data-op="resolver_decision" data-id="${esc(d.id)}">${wait?'Ya está resuelta':'Marcar resuelta'}</button>`:''}${wait?'':`<button data-op="reabrir_decision" data-id="${esc(d.id)}">Reabrir</button>`}</div></article>`;
}
const sessions=()=>data.sesiones ?? [];
const sessionTitle=s=>s.tema || 'Sin instrucción todavía';
const elapsed=s=>Math.max(0,Date.parse(data.ahora)-Date.parse(s.ultima));
const lostSignal=s=>s.estado==='trabajando' && (!Number.isFinite(elapsed(s)) || elapsed(s)>30*60000);
const working=s=>s.estado==='trabajando' && !lostSignal(s);
const activeSession=s=>working(s) || s.estado==='esperando';
function sessionLink(segment,label,filter='',id='') {
  return `<button data-ir="sesiones" data-segment="${esc(segment)}" data-session-state="${esc(filter)}" data-target="${esc(id)}">${esc(label)}</button>`;
}
function taskLink(segment,label,open=false) {
  return `<button data-ir="fabrica" data-segment="${esc(segment)}" ${open?'data-only-open':''}>${esc(label)}</button>`;
}
function sessionSummary() {
  const rows=sessions();
  const silent=rows.filter(lostSignal).length;
  return panel('Sesiones',`<p><b>${rows.filter(working).length}</b> trabajando ahora · <b>${rows.filter(s=>s.estado==='esperando').length}</b> esperándote${silent?' · '+num(silent)+' sin señal':''}</p>${go('sesiones','Ver sesiones')}`);
}
function sessionAge(time) {
  const minutes=Math.max(0,Math.floor((Date.parse(data.ahora)-Date.parse(time))/60000));
  return !Number.isFinite(minutes)?'Sin fecha':minutes<1?'hace menos de 1 min':minutes<60?`hace ${minutes} min`:minutes<1440?`hace ${Math.floor(minutes/60)} h`:`hace ${Math.floor(minutes/1440)} ${minutes<2880?'día':'días'}`;
}
function sessionStatus(s) {
  let status=chip('Terminada');
  if(working(s)) status=chip('Trabajando','ok signal');
  if(lostSignal(s)) status=chip('Sin señal','bad');
  if(s.estado==='esperando') status=chip('Esperándote','warn');
  return status;
}
const queued=s=>(s.ordenes ?? []).filter(o=>o.estado==='pendiente').length;
// Las respuestas que la sesión dejó junto a su pregunta: cada botón la manda como instrucción. Llega cuando la sesión vuelve a moverse.
const sessionAnswers=s=>s.estado==='esperando' && s.opciones?.length?`<div class="actions session-answers" data-session="${esc(s.id)}" role="group" aria-label="Responder a la sesión">${s.opciones.map((o,i)=>`<button class="${i?'':'primary'}" data-op="ordenar" data-text="${esc(o)}">${esc(o)}</button>`).join('')}</div><small>Tu respuesta le llega cuando la sesión vuelve a moverse.</small>`:'';
const sessionQuestion=s=>s.pregunta?`<p class="session-question"><small>La sesión te pregunta</small>${esc(s.pregunta)}</p>${sessionAnswers(s)}`:'';
function sessionCard(s) {
  const plan=s.plan ?? [], done=plan.filter(p=>p.e==='hecha').length;
  const step=plan.find(p=>p.e==='en_curso');
  return `<article class="module session-card" data-session-card tabindex="-1" id="item-${esc(s.id)}">
    <div class="spread"><span>${sessionStatus(s)} ${chip(segmentName(s.segmento))}</span>${chip(queued(s)+' en cola',queued(s)?'accent':'muted')}</div>
    <h3>${detailButton('session',s.id,sessionTitle(s))}</h3><small>Rama · ${esc(s.rama || 'Sin rama')}</small><small>Carpeta · ${esc(s.carpeta || 'Sin carpeta')}</small>
    <small>Última actividad ${esc(sessionAge(s.ultima))} · ${num(s.turnos)} turnos</small>
    ${lostSignal(s)?'<p>La sesión pudo haberse cerrado sin avisar.</p>':''}
    <div class="plan-progress">${plan.length?`<small>Plan · ${done}/${plan.length} pasos completados</small><progress aria-label="Avance del plan" value="${done}" max="${plan.length}"></progress>${step?'<p>En curso · '+esc(step.t)+'</p>':''}`:'<small>Sin plan registrado</small>'}</div>
    ${sessionQuestion(s)}<div class="actions">${detailButton('session',s.id,s.estado==='terminada'?'Ver contexto':'Abrir sesión','')}${s.segmento?taskLink(s.segmento,'Ver tareas de este segmento'):''}</div></article>`;
}
const sessionSections={plan:'Pendiente',context:'Contexto',conversation:'Conversación'};
function sessionPlan(s) {
  const labels={pendiente:'Pendiente',en_curso:'En curso',hecha:'Hecha'};
  const steps=(s.plan ?? []).map(p=>`<li>${chip(labels[p.e],p.e==='hecha'?'ok':p.e==='en_curso'?'accent':'muted')} <span>${esc(p.t)}</span></li>`);
  return sessionQuestion(s)+(steps.length?`<ol class="session-plan">${steps.join('')}</ol>`:'<p>Sin plan registrado.</p>');
}
function sessionContext(s) {
  return `<h3>Último turno</h3>${documentBody(s.recap || 'Sin recapitulación registrada.')}<h3>Último mensaje de la sesión</h3>${documentBody(s.resumen || 'Sin mensaje registrado.')}`;
}
function orderThread(s) {
  const rows=(s.ordenes ?? []).slice().reverse().map(o=>{
    const pending=o.estado==='pendiente';
    const status=pending?'En cola':o.estado==='entregada'?'Entregada · '+sessionAge(o.entregada):'Cancelada';
    return `<li><small>${o.tipo==='finalizar'?'Finalizar trabajo':'Tu instrucción'} · ${esc(stamp(o.creada))}</small><p class="lines">${esc(o.texto)}</p>${chip(status,pending?'warn':o.estado==='entregada'?'ok':'muted')}
      ${pending?`<button class="plain" data-op="cancelar_orden" data-id="${esc(o.id)}">Cancelar orden</button>`:''}</li>`;
  });
  return rows.length?`<ol class="order-thread">${rows.join('')}</ol>`:'<p>Aún no has enviado órdenes a esta sesión.</p>';
}
function sessionDelivery(s) {
  return s.estado==='esperando'?'La recibirá cuando vuelvas a abrir la sesión o le escribas en Claude Code.':'La recibirá cuando termine su turno actual.';
}
function sessionConversation(s) {
  return `<div id="session-thread">${orderThread(s)}</div><div class="session-compose"><label for="instruction">Tu instrucción</label>
    <small id="session-delivery">${sessionDelivery(s)} Si pasan 24 h sin entregarse, se cancela.</small>
    <textarea id="instruction" maxlength="2000" rows="3" aria-describedby="session-delivery instruction-count"></textarea>
    <div class="spread"><small id="instruction-count">0/2000</small><button class="primary" data-op="ordenar" id="send-instruction" aria-keyshortcuts="Control+Enter">Enviar instrucción</button></div>
    <small>Ctrl+Enter para enviar</small><div class="actions">${['Continúa','Resume qué falta'].map(t=>`<button data-op="ordenar" data-text="${t}">${t}</button>`).join('')}<button data-op="ordenar" data-type="finalizar">Finalizar trabajo</button></div></div>`;
}
function sessionDetail(s) {
  const active=s.estado!=='terminada';
  const sections=active?Object.keys(sessionSections):['context'];
  const bodies={plan:sessionPlan,context:sessionContext,conversation:sessionConversation};
  return `<div class="session-detail" data-session="${esc(s.id)}"><div id="session-status">${sessionStatus(s)} ${chip(segmentName(s.segmento))}</div>
    ${active?`<div class="actions section-switch" role="group" aria-label="Secciones de la sesión">${sections.map((k,i)=>`<button data-section="${k}" aria-controls="section-${k}" aria-pressed="${i===0}">${sessionSections[k]}</button>`).join('')}</div>`:''}
    ${sections.map((k,i)=>`<section id="section-${k}" aria-label="${sessionSections[k]}" ${i?'hidden':''}>${bodies[k](s)}</section>`).join('')}
    <footer><button data-op="archivar_sesion" data-id="${esc(s.id)}">Quitar del panel</button></footer></div>`;
}
function refreshSessionDetail(id) {
  const s=sessions().find(row=>row.id===id);
  if(!s) return closeDetail();
  if((s.estado!=='terminada')!==Boolean($('#instruction'))) return showDetail(sessionTitle(s),sessionDetail(s));
  $('#detalle-titulo').textContent=sessionTitle(s);
  $('#session-status').innerHTML=sessionStatus(s)+' '+chip(segmentName(s.segmento));
  $('#section-context').innerHTML=sessionContext(s);
  if(!$('#instruction')) return;
  $('#section-plan').innerHTML=sessionPlan(s);
  $('#session-delivery').textContent=sessionDelivery(s)+' Si pasan 24 h sin entregarse, se cancela.';
  const thread=$('#session-thread');
  const focusedOrder=thread.contains(document.activeElement)?document.activeElement.dataset.id:null;
  thread.innerHTML=orderThread(s);
  if(focusedOrder) {
    const replacement=[...thread.querySelectorAll('button')].find(button=>button.dataset.id===focusedOrder);
    (replacement || $('#instruction')).focus({preventScroll:true});
  }
}
function sessionsView() {
  const rows=sessions().filter(s=>(!sessionSegment || s.segmento===sessionSegment) && (s.estado!=='terminada' || elapsed(s)<=3*dayMs));
  const filters=[['trabajando','Trabajando ahora',working],['esperando','Te esperan',s=>s.estado==='esperando'],['terminada','Terminadas (3 días)',s=>s.estado==='terminada']];
  const controls=filters.map(([key,label,test])=>`<button data-session-filter="${key}" aria-pressed="${sessionFilter===key}"><strong>${rows.filter(test).length}</strong>${label}</button>`).join('');
  const test=sessionFilter==='activas'?activeSession:filters.find(([key])=>key===sessionFilter)?.[2];
  const list=rows.filter(s=>!test || test(s)).sort((a,b)=>Date.parse(b.ultima)-Date.parse(a.ultima));
  return `<div class="session-counts">${controls}</div><div>${sessionSegment?chip(segmentName(sessionSegment)):''} ${sessionFilter==='activas'?chip('Sesiones activas'):''} ${sessionFilter || sessionSegment?go('sesiones','Ver todas las sesiones'):''}</div><div class="grid">${list.map(sessionCard).join('') || '<p>No hay sesiones para esta selección.</p>'}</div>`;
}
function teamDiagram(columns) {
  const segments=team.segmentos, width=columns*240, center=width/2;
  const rows=Math.ceil(segments.length/columns), base=174+rows*74;
  function node(key,label,x,y) {
    return `<g role="button" tabindex="0" aria-label="${esc(label)}" data-team-node="${esc(key)}" transform="translate(${x} ${y})"><path class="org-edge" d="M-94 4l8-6h179l-7 6z"/><rect x="-94" y="4" width="188" height="44" rx="4"/><text y="31" text-anchor="middle">${esc(label)}</text></g>`;
  }
  let wires=`M${center} 51v25 M${center} 124v14`;
  const nodes=segments.map((s,i)=>{
    const x=120+240*(i%columns), y=154+74*Math.floor(i/columns);
    wires+=` M${center} 138H${x-110}V${y+26}h16 M${x+94} ${y+26}h16V${base-14}H${center}V${base}`;
    return node(s.clave,s.nombre,x,y);
  }).join('');
  return `<svg class="org-chart cols-${columns}" viewBox="0 0 ${width} ${base+55}" role="group" aria-label="Organización de AXTRONIC"><path class="org-wire" d="${wires}"/>${node('dueno','Dueño',center,3)}${node('director',team.director.nombre,center,76)}${nodes}${node('compartido',team.compartido.nombre,center,base)}</svg>`;
}
function focusTeamCard(node) {
  const card=document.getElementById('equipo-'+node.dataset.teamNode);
  card.focus({preventScroll:true});
  card.scrollIntoView({block:'start'});
}
function teamView() {
  if(!team) return panel('Equipo','<p>No se pudo cargar la organización del equipo.</p>');
  const {director,compartido,segmentos}=team;
  const card=(key,title,body)=>`<article class="module" data-team-card tabindex="-1" id="equipo-${esc(key)}"><h2>${esc(title)}</h2>${body}</article>`;
  const cards=segmentos.map(s=>{
    const tasks=data.tareas.filter(t=>t.segmento===s.clave && openTask(t)).length;
    const active=sessions().filter(row=>row.segmento===s.clave && activeSession(row)).length;
    return card(s.clave,s.nombre,`<p>${esc(s.hace)}</p><p>La atiende: <b>${esc(s.agente)}</b></p><h3>Cerebro del segmento</h3><code>${esc(s.cerebro)}</code><h3>Skills</h3>${s.skills.map(x=>chip(x)).join(' ') || '<small>Sin skills registradas.</small>'}<h3>Flujo de trabajo</h3><ol class="team-steps">${s.pasos.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h3>Lo que te toca a ti</h3><p>${esc(s.te_toca)}</p><div class="actions">${taskLink(s.clave,'Ver tareas abiertas · '+tasks,true)}${sessionLink(s.clave,'Ver sesiones activas · '+active,'activas')}</div>`);
  });
  return panel('Organización',teamDiagram(1)+teamDiagram(3))+'<div class="grid">'+card('dueno','Dueño','<p>Tú decides qué aprobar. Cada segmento indica cuándo necesita tu intervención.</p>')+
    card('director',director.nombre,`<p>${esc(director.hace)}</p>${director.cerebro.map(x=>`<p><code>${esc(x)}</code></p>`).join('')}`)+cards.join('')+
    card('compartido',compartido.nombre,`<ul>${compartido.archivos.map(f=>`<li><code>${esc(f.ruta)}</code><p>${esc(f.que)}</p></li>`).join('')}</ul><h3>Cómo aprende</h3><p>${esc(compartido.como_aprende)}</p>`)+'</div>';
}
function documentLists() {
  const docs=data.documentos ?? [];
  const buttons=rows=>rows.map(d=>detailButton('documento',d.clave,d.titulo,'search-hit')).join('');
  const answered=docs.filter(d=>d.respondido!=null);
  return panel('Documentos que esperan tu respuesta',buttons(docs.filter(d=>d.respondido==null)) || '<p>Todo contestado.</p>')+
    `<details class="module" data-group="documentos"><summary>Ya contestados · ${answered.length}</summary>${buttons(answered) || '<p>Aún no hay respuestas.</p>'}</details>`;
}
function documentBody(value) {
  const html=[];
  let tag='', lines=[];
  function flush() {
    if(tag==='p') html.push('<p>'+lines.join(' ')+'</p>');
    else if(tag) html.push('<'+tag+'>'+lines.join('')+'</'+tag+'>');
    tag=''; lines=[];
  }
  for(const line of esc(value).split(/\r?\n/)) {
    if(!line.trim()) { flush(); continue; }
    if(line.startsWith('## ')) { flush(); html.push('<h3>'+line.slice(3)+'</h3>'); continue; }
    const number=/^(\d+)\. (.*)$/.exec(line);
    const next=number?'ol':line.startsWith('- ')?'ul':'p';
    if(next!==tag) flush();
    tag=next;
    lines.push(number?`<li value="${number[1]}">${number[2]}</li>`:tag==='ul'?'<li>'+line.slice(2)+'</li>':line);
  }
  flush();
  return html.join('');
}
function decisions() {
  const groups = [['Aplicando',data.decisiones.filter(d=>d.estado==='aplicando')],['Otras respuestas',data.decisiones.filter(d=>!['pendiente','aplicando'].includes(d.estado))]];
  return documentLists()+`<h2 class="section-title">Pendientes <span>${pending().length}</span></h2><div class="grid">${pending().sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(decision).join('') || '<p>Todo atendido.</p>'}</div>`+
    groups.filter(([,rows])=>rows.length).map(([title,rows])=>`<details class="module" data-group="${title}"><summary>${title} · ${rows.length}</summary><div class="grid">${rows.map(decision).join('')}</div></details>`).join('');
}
function bugAction(b) {
  return `<p>${b.tarea_id?'La fábrica ya tiene este caso. Abre la tarea para ver su estado y su historial.':'Al enviarlo se crea una propuesta. Luego podrás aprobarla o descartarla en Fábrica.'}</p><div class="actions">${b.tarea_id?detailButton('task',b.tarea_id,'Ver la tarea',''):`<button data-op="proponer" data-huella="${esc(b.huella)}">Mandar a la fábrica</button>`}</div>`;
}
function bugs() {
  const reports = data.bugs.filter(b=>b.fuente==='reporte').reduce((sum,b)=>sum+Number(b.veces),0);
  const installs = latest('beta.instalaciones');
  const labels = {reporte:'Reporte',crash:'Fallo automático',ejercicio:'Ejercicio'};
  return panel(detailButton('inbox','','Bandeja de bugs'),`<strong class="big">${count(data.bugs.length)}</strong> casos · ${free().length} sin tarea<p>${num(reports)} ${reports===1?'reporte':'reportes'} ${installs==null?'· instalaciones sin dato':'de '+num(installs)+' instalaciones'}</p>`)+
    `<div class="grid">${data.bugs.map(b=>`<article class="module"><div class="metric-name">${icon(Object.hasOwn(labels,b.fuente)?b.fuente:'bugs')}${esc(Object.hasOwn(labels,b.fuente)?labels[b.fuente]:b.fuente)}</div><h3>${detailButton('bug',b.huella,b.titulo)}</h3><p>${esc(b.detalle)}</p>
    <small>${num(b.veces)} ${b.veces===1?'vez':'veces'} · ${esc(date(b.ultimo))}${b.build?' · Versión '+esc(b.build):''}</small>${bugAction(b)}</article>`).join('')}</div>`;
}
const channels={instagram:'Instagram',facebook:'Facebook',youtube:'YouTube',tiktok:'TikTok',x:'X'};
const socialStates=[
  ['publicada','publicadas','Publicadas','ok'],['programada','programadas','Programadas','accent'],
  ['sin_enviar','sin_enviar','Sin enviar','warn'],['pausada','pausadas','Pausadas','muted']
];
const queue=()=>data.ajustes?.['redes.cola'];
const pauseSetting=()=>data.ajustes?.['redes.pausa'];
const releases=()=>data.versiones ?? [];
const channelName=c=>Object.hasOwn(channels,c)?channels[c]:c;
const outputLabels={publicada:'Publicada',programada:'Programada',sin_enviar:'Sin enviar',pausada:'Pausada',lista:'Lista',pendiente_revision:'Pendiente de revisión',reservada:'Reservada',en_espera:'En espera'};
const stateName=s=>Object.hasOwn(outputLabels,s)?outputLabels[s]:s;
const zone='America/Mexico_City';
function stamp(value) {
  if(!value || !Number.isFinite(Date.parse(value))) return 'Sin fecha';
  const dayOnly=/^\d{4}-\d\d-\d\d$/.test(value);
  return new Date(value).toLocaleString('es-MX',{dateStyle:'medium',...(dayOnly?{}:{timeStyle:'short'}),timeZone:dayOnly?'UTC':zone});
}
function detailButton(kind,key,label,cls='plain') {
  return `<button class="${cls}" data-detail="${kind}" data-key="${esc(key)}">${esc(label)}</button>`;
}
function outputRow(o) {
  const label=esc(channelName(o.canal))+' · '+esc(stateName(o.estado))+(o.cuando?' · '+esc(stamp(o.cuando)):'');
  return typeof o.url==='string' && o.url.startsWith('https://') ? `<a class="output" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>` : `<span class="output">${label}</span>`;
}
function pieces() { return queue()?.piezas ?? []; }
const pieceHints={publicada:'Abre la publicación para verla en su red.',programada:'Consulta las fechas por red. Los ajustes de programación se hacen en la sesión de redes.',lista:'Programa la pieza en la sesión de redes.',pendiente_revision:'Aprueba la pieza en la sesión de redes. Hasta entonces no se publica en ningún sitio.',reservada:'Está apartada en el banco. Revisa su destino en la sesión de redes.',en_espera:'Queda en el banco hasta que se retome en la sesión de redes.',pausada:'Consulta el motivo antes de retomarla en la sesión de redes.'};
function preview(p) {
  const valid=typeof p.mini==='string' && /^[0-9a-f]{12}\.webp$/.test(p.mini);
  const type=String(p.tipo || '');
  const symbol=/video|reel|short/i.test(type)?'youtube':/carrusel|imagen|historia/i.test(type)?'instagram':'reporte';
  return `<div class="preview"><span>${icon(symbol)} Sin vista previa</span>${valid?`<img loading="lazy" src="media/${esc(p.mini)}" alt="Miniatura de ${esc(type)}: ${esc(p.campana || p.id)}">`:''}</div>`;
}
document.addEventListener('error',event=>{
  if(event.target.matches?.('.preview img')) event.target.remove();
},true);
function pieceCard(p,o) {
  return `<article class="item">${p.estado==='pendiente_revision'?'':preview(p)}${chip(p.tipo)} ${chip(stateName(p.estado))}<h3>${detailButton('piece',p.id,p.campana || p.id)}</h3>${o?outputRow(o):''}</article>`;
}
const dayKey=value=>new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
function publicationCalendar(outputs) {
  const today=dayKey(data.ahora),days=new Map([[today,[]]]);
  for(const row of outputs) {
    const day=dayKey(row.o.cuando);
    if(!days.has(day)) days.set(day,[]);
    days.get(day).push(row);
  }
  const mondays=new Set([...days.keys()].map(day=>{
    const t=Date.parse(day);
    return t-((new Date(t).getUTCDay()+6)%7)*dayMs;
  }));
  return [...mondays].sort((a,b)=>a-b).map(start=>{
    const cells=Array.from({length:7},(_,i)=>{
      const day=new Date(start+i*dayMs).toISOString().slice(0,10),rows=days.get(day)??[];
      const label=new Date(day).toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
      return `<section class="cal-day ${day===today?'today':''} ${rows.length?'':'empty'}"><h4>${esc(label)}${day===today?' · Hoy':''}</h4>${rows.map(({p,o})=>{
        const label=p.campana||p.tipo, published=o.estado==='publicada';
        return `<div class="cal-entry">${preview(p)}${chip(stateName(o.estado),published?'ok':'accent')}<small>${icon(o.canal)} ${esc(channelName(o.canal))} · ${esc(new Date(o.cuando).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',timeZone:zone}))}</small>${detailButton('piece',p.id,label)}${published?external(o.url,'Ver publicación'):''}</div>`;
      }).join('') || '<small>Sin publicaciones</small>'}</section>`;
    });
    return `<div class="cal-week">${cells.join('')}</div>`;
  }).join('');
}
function pieceLane(title,rows,empty,description='') {
  return panel(title,description+`<div class="piece-lane">${rows.map(({p,o})=>pieceCard(p,o)).join('') || '<p>'+empty+'</p>'}</div>`);
}
function social() {
  const pause=pauseSetting(),q=queue();
  const brake=panel('Freno de publicaciones',`<div class="brake ${pause?.activa?'paused':''}"><div><strong>${pause?.activa?'Publicaciones en pausa desde '+esc(stamp(pause._al)):pause?'Publicaciones habilitadas':'Estado de pausa sin dato'}</strong><p>La tarea de la mañana consulta este freno antes de publicar. Lo ya programado dentro de cada red no se cancela desde aquí.</p></div><button class="switch" role="switch" aria-checked="${!!pause?.activa}" aria-label="Pausa de publicaciones" data-detail="pause"><i></i>${pause?.activa?'Reanudar':'Pausar publicaciones'}</button></div>`);
  const kpi='<section class="kpis">'+metricCard('redes.piezas','Piezas','redes','En la cola')+socialStates.map(([,key,title])=>metricCard('redes.'+key,title,'redes','Salidas')).join('')+'</section>';
  if(!q) return brake+kpi+panel('Cola de redes','<p>El recolector de la PC aún no la ha subido.</p>');
  const outputs=pieces().flatMap(p=>(p.salidas??[]).map(o=>({p,o})));
  const bars=Object.entries(channels).map(([key,label])=>{
    const groups=socialStates.map(([state,,title,tone])=>{
      const n=outputs.filter(({o})=>o.canal===key && o.estado===state).length;
      return `<span class="ticks ${tone}"><small>${title} · ${n}</small><i style="--ticks:${Math.min(n,12)}"></i></span>`;
    }).join('');
    return `<button class="channel" data-detail="channel" data-key="${key}"><b>${icon(key)} ${label}</b>${groups}</button>`;
  }).join('');
  const dated=outputs.filter(({o})=>Number.isFinite(Date.parse(o.cuando))).sort((a,b)=>Date.parse(a.o.cuando)-Date.parse(b.o.cuando));
  const byState=state=>pieces().filter(p=>p.estado===state).map(p=>({p}));
  const bank=pieces().filter(p=>['reservada','en_espera'].includes(p.estado));
  return brake+kpi+panel('Por red',freshness(q._al)+bars)+panel('Calendario de publicaciones',freshness(q._al)+publicationCalendar(dated))+
    pieceLane('Lo que viene',dated.filter(({o})=>o.estado==='programada'),'Sin publicaciones programadas.',freshness(q._al))+
    pieceLane('Listas para programar',byState('lista').filter(({p})=>!p.salidas?.some(o=>o.cuando)),'Sin piezas listas.',freshness(q._al))+
    pieceLane('Esperan tu revisión',byState('pendiente_revision'),'Sin piezas por revisar.',freshness(q._al)+'<p>Apruébalas en la sesión de redes. Hasta entonces no se publican en ningún sitio.</p>')+
    (byState('pausada').length?pieceLane('Piezas pausadas',byState('pausada'),'',freshness(q._al)):'')+
    `<details class="module" data-group="banco"><summary>Banco de piezas · ${bank.length}</summary>${freshness(q._al)}<div class="piece-lane">${bank.map(p=>pieceCard(p)).join('') || '<p>El banco está vacío.</p>'}</div></details>`;
}
function versions() {
  const items=releases().map((v,i)=>`<li><small>${esc(stamp(v.publicada))}</small><h3>${detailButton('release',i,'Beta '+v.version+' · Build '+v.build)}</h3><p class="lines">${esc(v.notas)}</p></li>`);
  const integrated=rowsAt(6).slice().sort((a,b)=>(b.closed_at??b.updated_at).localeCompare(a.closed_at??a.updated_at));
  return '<section class="kpis">'+metricCard('beta.build','Último build de la beta','versiones','Beta',releases()[0]?.build ?? null)+metricCard('play.build','Build en Google Play','tienda','Google Play')+'</section>'+
    panel('Versiones de la beta',items.length?`<ol class="events">${items.join('')}</ol>`:'<p>Aún no hay versiones registradas.</p>')+
    panel('Cambios hechos por la fábrica',integrated.length?`<ol class="events">${integrated.map(t=>`<li><small>${esc(stamp(t.closed_at??t.updated_at))}</small>${detailButton('task',t.id,t.titulo)}</li>`).join('')}</ol>`:'<p>Aún no hay tareas integradas.</p>');
}
let helpCatalog={},helpAnchor,helpPinned=false,helpTimer;
const helpCard=document.createElement('div');
helpCard.id='ayuda';
helpCard.setAttribute('role','tooltip');
helpCard.hidden=true;
document.body.append(helpCard);
function info(key) {
  if(!Object.hasOwn(helpCatalog,key)) return '';
  return `<button type="button" class="info" data-ayuda="${esc(key)}" aria-label="Explicación: ${esc(helpCatalog[key].que)}"><span aria-hidden="true">i</span></button>`;
}
function hideHelp() {
  clearTimeout(helpTimer);
  helpAnchor?.removeAttribute('aria-describedby');
  helpAnchor=null;
  helpPinned=false;
  helpCard.hidden=true;
}
function positionHelp() {
  if(!helpAnchor) return;
  const r=helpAnchor.getBoundingClientRect();
  if(r.bottom<0 || r.top>window.innerHeight) return hideHelp();
  const gap=6,pad=8,w=window.innerWidth,h=window.innerHeight;
  const width=helpCard.offsetWidth;
  const area=(helpAnchor.closest('.kpi') || helpAnchor).getBoundingClientRect();
  // En un título, lo explicado queda debajo y al lado: ahí la tarjeta va arriba para no taparlo.
  const heading=helpAnchor.closest('h2,h3');
  const side=!heading && (area.right+gap+width<=w-pad || area.left-gap-width>=pad);
  const below=h-pad-area.bottom-gap;
  const above=area.top-pad-gap;
  const down=heading?above<helpCard.scrollHeight:below>=helpCard.scrollHeight || below>=above;
  helpCard.style.maxHeight=`${side?h-2*pad:Math.max(44,down?below:above)}px`;
  const height=helpCard.offsetHeight;
  const x=side?(area.right+gap+width<=w-pad?area.right+gap:area.left-gap-width):r.left;
  const y=side?r.top:down?area.bottom+gap:area.top-gap-height;
  helpCard.style.left=`${Math.max(pad,Math.min(x,w-width-pad))}px`;
  helpCard.style.top=`${Math.max(pad,Math.min(y,h-height-pad))}px`;
}
function showHelp(button) {
  clearTimeout(helpTimer);
  if(helpAnchor===button) return;
  hideHelp();
  helpAnchor=button;
  const entry=helpCatalog[button.dataset.ayuda];
  helpCard.replaceChildren();
  for(const [key,label] of [['que','Qué es'],['calculo','Cómo se calcula'],['fuente','De dónde sale'],['hacer','Qué hacer']]) {
    const line=document.createElement('div'),heading=document.createElement('b'),body=document.createElement('span');
    heading.textContent=label;
    body.textContent=entry[key];
    line.append(heading,body);
    helpCard.append(line);
  }
  button.setAttribute('aria-describedby','ayuda');
  helpCard.hidden=false;
  positionHelp();
}
document.addEventListener('pointerover',e=>{
  const b=e.target.closest('[data-ayuda]');
  if(e.pointerType==='touch') return;
  if(b && (!helpPinned || b===helpAnchor)) showHelp(b);
  if(helpCard.contains(e.target)) clearTimeout(helpTimer);
});
document.addEventListener('pointerout',e=>{
  if(helpPinned || !helpAnchor || (!helpAnchor.contains(e.target) && !helpCard.contains(e.target))) return;
  if(helpAnchor.contains(e.relatedTarget) || helpCard.contains(e.relatedTarget)) return;
  if(document.activeElement!==helpAnchor) helpTimer=setTimeout(hideHelp,250);
});
document.addEventListener('focusin',e=>{
  const b=e.target.closest('[data-ayuda]');
  if(b) showHelp(b);
  else if(!helpCard.contains(e.target)) hideHelp();
});
document.addEventListener('focusout',e=>{
  if(helpAnchor===e.target && !helpCard.contains(e.relatedTarget) && !helpCard.matches(':hover')) hideHelp();
});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-ayuda]');
  if(b) {
    if(helpAnchor===b && helpPinned) return hideHelp();
    showHelp(b);
    helpPinned=true;
  } else if(!helpCard.contains(e.target)) hideHelp();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && helpAnchor) hideHelp();});
window.addEventListener('scroll',positionHelp,true);
window.addEventListener('resize',positionHelp);

const financeSummary=()=>data.ajustes?.['finanzas.resumen'];
const pesos=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:0,maximumFractionDigits:2});
const netPesos=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'});
const money=n=>Number.isFinite(n)?pesos.format(n):'Sin dato';
const source=s=>`<small class="fin-source">Resumen de finanzas · ${esc(s.corte)} · MXN</small>`;
const amount=n=>Number.isFinite(n)?`<span data-count="${esc(n)}" data-money>${esc(money(n))}</span>`:'Sin dato';
const expenseRange=(cost,format)=>cost.min===cost.max?format(cost.min):`${format(cost.min)} a ${format(cost.max)}`;
const subRange=row=>row.min===row.max?`${row.min} ${row.min===1?'suscriptor':'suscriptores'}`:`de ${row.min} a ${row.max} suscriptores`;
const finList=items=>items.length?`<ul class="fin-list">${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'<p>Sin renglones registrados.</p>';
const costLine=r=>`${r.nombre} · ${money(r.importe)}${r.confirmado?'':' · Por confirmar'}${r.nota?' · '+r.nota:''}`;
const uncertain=c=>c.renglones.filter(r=>!r.confirmado);
const monthName=k=>/^\d{4}-(0[1-9]|1[0-2])$/.test(k)?new Intl.DateTimeFormat('es-MX',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${k}-01T00:00:00Z`)):String(k);
const monthNote=(s,m)=>`${monthName(m.clave)} · ${m.completo?'mes completo':s.corte?.startsWith(m.clave+'-')?'al día '+Number(s.corte.slice(8,10)):'corte parcial'}`;
function financeKpis(s) {
  const c=s.costo_mensual;
  const cards=[
    ['Costo mensual',expenseRange(c,amount),uncertain(c).map(costLine).join(' · ') || 'Presupuesto confirmado',info('fin.costo_mensual'),'costo'],
    ['Gasto acumulado',amount(s.acumulado),'Desde el primer gasto',info('fin.acumulado'),'acumulado'],
    ['Este mes',amount(s.mes.importe),monthNote(s,s.mes),info('fin.mes'),'mes'],
    ['Mes anterior',amount(s.mes_anterior.importe),monthNote(s,s.mes_anterior),info('fin.anterior'),'mes_anterior']
  ];
  return `<section class="kpis fin-kpis">${cards.map(([label,value,note,help,key])=>`<article class="kpi"><h2>${label}</h2>${help}<button class="fin-kpi-value" data-detail="fin-kpi" data-key="${key}" aria-label="Ver detalle de ${label}"><strong>${value}</strong></button><p>${esc(note)}</p>${source(s)}</article>`).join('')}</section>`;
}
function financeRecs(s) {
  const cards=s.recomendaciones.map((r,i)=>{
    const a=r.accion;
    let action='';
    if(a?.tipo==='url') action=external(a.valor,a.texto);
    if(a?.tipo==='doc') action=detailButton('documento',a.valor,a.texto);
    if(a?.tipo==='decision') action=detailButton('decision',a.valor,a.texto);
    if(a?.tipo==='detalle') action=detailButton('fin-rec',i,a.texto);
    return `<article class="fin-rec"><h3>${esc(r.titulo)}</h3><p>${esc(r.porque)}</p><p class="fin-impact">${esc(r.impacto)}</p>${action}</article>`;
  });
  return panel('Recomendaciones'+info('fin.recomendaciones'),source(s)+`<div class="fin-rec-grid">${cards.join('') || '<p>Sin recomendaciones en este corte.</p>'}</div>`);
}
function financeBars(s) {
  const maxProvider=Math.max(1,...s.proveedores.map(p=>p.importe));
  const maxMonth=Math.max(1,...s.meses.map(m=>m[1]));
  function bar(kind,key,label,value,max,i) {
    return `<button class="fin-bar" data-detail="${kind}" data-key="${esc(key)}"><span>${esc(label)}</span><b>${esc(money(value))}</b><i aria-hidden="true" style="--width:${Math.max(0,value/max)*100}%;--delay:${Math.min(i,10)*35}ms"></i></button>`;
  }
  const group=service=>s.proveedores.map((p,i)=>(p.tipo==='servicio')===service?bar('fin-proveedor',i,p.nombre,p.importe,maxProvider,i):'').join('') || '<p>Sin gastos registrados.</p>';
  return `<div class="fin-pair">${panel('Gasto por proveedor'+info('fin.proveedores'),source(s)+'<h3>Se repite</h3>'+group(true)+'<h3>Compra de una vez</h3>'+group(false))}${panel('Gasto por mes'+info('fin.historial'),source(s)+s.meses.map(([m,n],i)=>bar('fin-periodo',m,monthName(m),n,maxMonth,i)).join(''))}</div>`;
}
let financePlan,financeFee;
function financeScenario(s) {
  return s.equilibrio.find(r=>r.plan===financePlan && r.comision===financeFee) ?? s.equilibrio[0];
}
function scenarioResult(s,r) {
  const open=uncertain(s.costo_mensual);
  return `<strong class="fin-result">${esc(subRange(r))}</strong><div class="fin-net"><span>Neto al mes por suscriptor · <b>${esc(netPesos.format(r.neto))}</b></span>${info('fin.neto')}</div>${open.length?'<h3>Qué mueve el rango</h3>'+finList(open.map(costLine)):''}<small>Estimación; lo confirma el contador</small>${source(s)}`;
}
function financeProgress(s) {
  const r=financeScenario(s);
  const dial=`<div class="attention"><div class="dial fin-dial"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" pathLength="100"/><circle cx="50" cy="50" r="44" pathLength="100" stroke-dasharray="${r?.max>0?Math.max(0,Math.min(100,100*s.suscriptores/r.max)):0} 100"/></svg><strong>${esc(s.suscriptores)}</strong></div><p>Suscriptores de pago${r?`<br>Meta del escenario · ${esc(r.max)}`:''}</p></div>`;
  const steps=`<h3>Metas${info('fin.metas')}</h3><ol class="fin-steps">${s.metas.map((m,i)=>`<li style="--delay:${Math.min(i,10)*45}ms"><button data-detail="fin-meta" data-key="${i}"><span class="chip ${m.actual?'accent':'muted'}">${m.hecha?'Cumplida':m.actual?'Siguiente paso':'Pendiente'}</span> ${esc(m.titulo)}</button></li>`).join('')}</ol>`;
  const opts=(values,selected)=>[...new Map(values)].map(([v,label])=>`<option value="${esc(v)}"${v===selected?' selected':''}>${esc(label)}</option>`).join('');
  const calc=r?`<div class="fin-selects"><label>Plan<select id="fin-plan">${opts(s.equilibrio.map(x=>[x.plan,x.etiqueta]),r.plan)}</select></label><div><div class="fin-field-title"><label for="fin-fee">Comisión</label>${info('fin.comision')}</div><select id="fin-fee">${opts(s.equilibrio.filter(x=>x.plan===r.plan).map(x=>[x.comision,`${x.comision*100} %`]),r.comision)}</select></div></div><h3>Rango de equilibrio${info('fin.rango')}</h3><div aria-live="polite" id="fin-result">${scenarioResult(s,r)}</div>`:'<p>Sin escenarios cargados.</p>';
  return panel('¿Cuánto falta?'+info('fin.equilibrio'),source(s)+`<div class="fin-pair"><div><div id="fin-meter">${dial}</div>${steps}</div><div><h3>Calculadora${info('fin.calculadora')}</h3>${calc}</div></div>`);
}
document.addEventListener('change',e=>{
  if(!['fin-plan','fin-fee'].includes(e.target.id)) return;
  const s=financeSummary();
  const rows=s.equilibrio.filter(r=>r.plan===$('#fin-plan').value);
  const r=rows.find(x=>x.comision===Number($('#fin-fee').value)) ?? rows[0];
  financePlan=r.plan;
  financeFee=r.comision;
  const oldFee=$('#fin-fee');
  oldFee.replaceChildren(...rows.map(x=>{
    const option=document.createElement('option');
    option.value=String(x.comision);
    option.textContent=`${x.comision*100} %`;
    option.selected=x.comision===r.comision;
    return option;
  }));
  $('#fin-result').innerHTML=scenarioResult(s,r);
  $('#fin-meter p').innerHTML=`Suscriptores de pago<br>Meta del escenario · ${esc(r.max)}`;
  $('#fin-meter circle:last-child').setAttribute('stroke-dasharray',`${r.max>0?Math.max(0,Math.min(100,100*s.suscriptores/r.max)):0} 100`);
});
function finances() {
  const s=financeSummary();
  if(!s) return '<p class="module">Todavía no hay resumen de finanzas cargado</p>';
  const decisions=pending().filter(d=>d.id.startsWith('fin-'));
  return `<div class="finances">${s.demo===true?'<div>'+chip('Datos de demostración','accent')+'</div>':''}${financeKpis(s)}${financeRecs(s)}${financeBars(s)}${financeProgress(s)}${panel('¿Qué hago ahora?'+info('fin.pendientes'),source(s)+`<div class="fin-pending">${decisions.map(d=>detailButton('decision',d.id,d.titulo)).join('') || '<p>Sin decisiones pendientes.</p>'}</div><div class="fin-receipts">${detailButton('fin-comprobantes','lista',`${s.sin_comprobante.length} gastos sin comprobante`)}${info('fin.comprobantes')}</div>`)}</div>`;
}
function financeDetail(kind,key) {
  const s=financeSummary();
  if(!s) return;
  function detail(title,summary,lines) {
    showDetail(title,`<p class="fin-detail">${esc(summary)}</p>${lines?finList(lines):''}${source(s)}`);
  }
  function period(k) {
    return s.proveedores.flatMap(p=>p.meses.filter(([m])=>m===k).map(([,n])=>`${p.nombre} · ${money(n)}`));
  }
  if(kind==='fin-kpi') {
    if(key==='costo') return detail('Costo mensual',expenseRange(s.costo_mensual,money),s.costo_mensual.renglones.map(costLine));
    if(key==='acumulado') return detail('Gasto acumulado',money(s.acumulado),s.meses.map(([m,n])=>`${monthName(m)} · ${money(n)}`));
    const m=key==='mes'?s.mes:s.mes_anterior;
    return detail(key==='mes'?'Este mes':'Mes anterior',`${money(m.importe)} · ${monthNote(s,m)}`,period(m.clave));
  }
  if(kind==='fin-proveedor') {
    const p=s.proveedores[key];
    return detail(p.nombre,`${money(p.importe)} · ${p.cargos} ${p.cargos===1?'cargo':'cargos'}`,p.meses.map(([m,n])=>`${monthName(m)} · ${money(n)}`));
  }
  if(kind==='fin-periodo') return detail(monthName(key),money(s.meses.find(([m])=>m===key)?.[1]),period(key));
  if(kind==='fin-meta') return detail(s.metas[key].titulo,s.metas[key].detalle);
  if(kind==='fin-rec') return detail(s.recomendaciones[key].titulo,s.recomendaciones[key].accion.valor);
  if(kind==='fin-comprobantes') return detail('Gastos sin comprobante',`${s.sin_comprobante.length} gastos`,s.sin_comprobante.map(x=>`${x.proveedor} · ${x.concepto}`));
}

const drawer=$('#detalle');
let opener,detailGeneration=0, documentDraft=null;
const dirtyDocument=()=>documentDraft && $('#respuesta-doc')?.value!==documentDraft.saved;
window.addEventListener('beforeunload',event=>{
  if(!dirtyDocument()) return;
  event.preventDefault();
  event.returnValue='';
});
function mayLeaveDocument() {
  return !dirtyDocument() || window.confirm('Hay cambios sin guardar en tu respuesta. ¿Quieres descartarlos?');
}
async function openDocument(key,generation) {
  showDetail('Documento','<p role="status">Cargando documento…</p>');
  drawer.classList.add('document-drawer');
  try {
    let doc;
    if(DEMO) {
      const fixture=data.documentos_demo;
      if(fixture && Object.hasOwn(fixture,key)) doc={...data.documentos?.find(d=>d.clave===key),...fixture[key]};
    } else {
      const result=await sb.rpc('panel',{p_op:'documento',p_args:{clave:key}});
      if(result.error) throw Error(result.error.message);
      doc=result.data;
    }
    if(generation!==detailGeneration) return;
    if(!doc || typeof doc.cuerpo!=='string') throw Error('No se encontró el documento.');
    const saved=doc.respuesta ?? '';
    showDetail(doc.titulo,`<small>Origen · ${esc(doc.origen)}</small><small id="fecha-respuesta">${doc.respondido?'Contestado · '+esc(stamp(doc.respondido)):'Sin contestar'}</small><div class="document-body">${documentBody(doc.cuerpo)}</div><label for="respuesta-doc">Tu respuesta</label><textarea id="respuesta-doc" maxlength="20000" rows="9" aria-describedby="cuenta-respuesta">${'\n'+esc(saved)}</textarea><small id="cuenta-respuesta"></small><button class="primary" data-op="responder_documento">Guardar respuesta</button>`);
    documentDraft={key,saved:$('#respuesta-doc').value};
    responseCount();
  } catch(err) {
    if(generation===detailGeneration) showDetail('Documento','<p>'+esc(err.message)+'</p>'+detailButton('documento',key,'Reintentar'));
  }
}
function responseCount() {
  $('#cuenta-respuesta').textContent=$('#respuesta-doc').value.length.toLocaleString('es-MX')+' de 20,000 caracteres';
}
function showDetail(title,body) {
  if(!drawer.open) {
    opener=document.activeElement;
    drawer.showModal();
  }
  $('#detalle-titulo').textContent=title;
  $('#detalle-cuerpo').innerHTML=body;
  $('#detalle-aviso').textContent='';
  drawer.scrollTop=0;
  $('#cerrar').focus();
}
function closeDetail() {
  if(!drawer.open) return true;
  if(!mayLeaveDocument()) return false;
  documentDraft=null;
  drawer.classList.remove('document-drawer');
  ++detailGeneration;
  drawer.close();
  $('#detalle-cuerpo').replaceChildren();
  const original=opener?.isConnected?opener:[...document.querySelectorAll('button,[role=button]')].find(el=>
    el.dataset.detail===opener?.dataset.detail && el.dataset.key===opener?.dataset.key && el.textContent===opener?.textContent && el.getClientRects().length);
  (original || $('#contenido')).focus({preventScroll:true});
  return true;
}
drawer.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
drawer.addEventListener('click',e=>{
  if(e.target!==drawer) return;
  const r=drawer.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) closeDetail();
});
const metricNames={'acceso.grupo_miembros':'En el grupo de Google','play.verificadores_inscritos':'Verificadores que aceptaron','play.instalaciones_28d':'Instalaciones desde Play','play.dispositivos_activos':'Dispositivos activos','play.build':'Build en Google Play'};
const metricInfo={
  'acceso.grupo_miembros':'Miembros del Grupo de Google de verificadores (te incluye a ti). El grupo es la lista que usa Google Play para la prueba cerrada.',
  'play.instalaciones_28d':'Instalaciones de la app desde Google Play en los últimos 28 días, según Play Console.',
  'play.dispositivos_activos':'Dispositivos que usaron la app en el último mes, según Play Console.',
  'acceso.respuestas_enviadas':'Respuestas enviadas a quienes escribieron «ACCESO».',
  'acceso.solicitudes':'Solicitudes de acceso recibidas.',
  'beta.instalaciones':'Instalaciones acumuladas de la beta.',
  'app.cuentas':'Cuentas registradas en la aplicación.',
  'app.sesiones_7d':'Sesiones de entrenamiento registradas en los siete días previos a cada corte.',
  'play.verificadores_inscritos':'Personas inscritas en la prueba cerrada de Google Play.',
  'redes.piezas':'Piezas de contenido registradas por el recolector. Una pieza puede aparecer en varias redes.',
  'play.verificadores_lista':'Correos registrados en la lista de verificadores de Google Play. La inscripción se mide por separado.',
  'redes.publicadas':'Salidas que la cola registra como publicadas. Una pieza puede tener salidas en varias redes.',
  'redes.programadas':'Salidas enviadas a programación para publicarse más adelante.',
  'redes.sin_enviar':'Salidas pendientes de envío a su red.',
  'redes.pausadas':'Salidas que la cola conserva en pausa.',
  'play.build':'Número de build registrado en Google Play.',
  'beta.build':'Build de la publicación más reciente del registro de versiones de la beta.'
};
function historyTable(rows) {
  if(!rows.length) return '<p>Sin historia registrada.</p>';
  if(rows.length<7) return '<p>Historia desde '+esc(stamp(rows[0][0]))+'</p>';
  return '<table><caption>Últimos siete días con dato</caption><thead><tr><th>Día</th><th>Valor</th></tr></thead><tbody>'+rows.slice(-7).map(([day,v])=>`<tr><td>${esc(stamp(day))}</td><td>${num(v)}</td></tr>`).join('')+'</tbody></table>';
}
function metricDetail(key,title,explain='') {
  const beta=key==='beta.build', socialKey=key.startsWith('redes.');
  const rows=series(key);
  const target=beta||key==='play.build'?'versiones':socialKey?'redes':'tienda';
  const definition=metricInfo[key] ?? 'Salidas con estado «'+title.toLowerCase()+'» en el corte de redes.';
  const source=beta?'Registro de versiones':socialKey||key.startsWith('play.')?'Recolector de la PC':'Métricas diarias del panel';
  showDetail(title,`<strong class="big">${num(beta?releases()[0]?.build:latest(key))}</strong><p>${esc(explain || definition)}</p>${testingCounts(key)}<small>${source} · ${esc(stamp(rows.at(-1)?.[0]))}</small>${metricFresh(key)}${historyTable(rows)}${key==='acceso.grupo_miembros'?external(groupUrl,'Abrir el grupo'):key.startsWith('play.')?external(PLAY+(key==='play.verificadores_inscritos'?'/app-dashboard':'/statistics'),'Abrir en Play Console'):''}${go(target,'Ver '+views[target])}`);
}
async function openDetail(kind,key) {
  if(!mayLeaveDocument()) return;
  documentDraft=null;
  drawer.classList.remove('document-drawer');
  const generation=++detailGeneration;
  if(kind==='session') {
    const s=sessions().find(row=>row.id===key);
    if(s) showDetail(sessionTitle(s),sessionDetail(s));
    return;
  }
  if(kind.startsWith('fin-')) return financeDetail(kind,key);
  if(kind==='documento') return openDocument(key,generation);
  if(kind==='search') {
    showDetail('Buscar en el panel','<label for="consulta">Buscar</label><input id="consulta" type="search" autocomplete="off"><div id="resultados" aria-live="polite">'+searchResults('')+'</div>');
    $('#consulta').focus();
    return;
  }
  if(kind==='inbox') {
    return showDetail('Bandeja de bugs',`<p>La bandeja agrupa los reportes por huella. Hay ${data.bugs.length} casos y ${free().length} todavía pueden enviarse a la fábrica.</p><small>Resumen del panel · ${esc(stamp(data.ahora))}</small><p>Solo hay datos del corte actual.</p>${free().map(b=>detailButton('bug',b.huella,b.titulo)).join('') || go('bugs','Ver bugs')}`);
  }
  if(kind==='person') {
    const person=people().find(p=>String(p.id)===key);
    if(person) showDetail(person.email,personCard(person,true));
    return;
  }
  if(kind==='more') return showDetail('Más','<div class="more-links">'+moreViews.map(k=>go(k,views[k])).join('')+'</div>');
  if(kind==='pause') {
    const paused=!!pauseSetting()?.activa;
    return showDetail(paused?'Reanudar publicaciones':'Pausar publicaciones',`<p>${paused?'La tarea de la mañana podrá volver a publicar.':'La tarea de la mañana dejará de publicar mientras el freno esté activo.'} Lo ya programado en cada red conserva su fecha.</p><div class="actions"><button class="primary" data-op="pausar" data-active="${!paused}">Confirmar ${paused?'reanudación':'pausa'}</button><button data-close>Cancelar</button></div>`);
  }
  if(kind==='task') {
    showDetail('Detalle de tarea','<p role="status">Cargando historial…</p>');
    try {
      let task;
      if(DEMO) task={...data.tareas.find(t=>t.id===key),eventos:data.eventos_demo?.[key]};
      else {
        const result=await sb.rpc('panel',{p_op:'tarea',p_args:{id:key}});
        if(result.error) throw Error(result.error.message);
        task=result.data;
      }
      if(generation!==detailGeneration || !drawer.open) return;
      if(!task?.id) throw Error('No se encontró la tarea.');
      task={...data.tareas.find(t=>t.id===key),...task};
      const events=[...(task.eventos??[])].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
      showDetail(task.titulo,taskCard(task,true,true)+`<h3>Historial</h3><ol class="events">${events.map(e=>`<li><small>${esc(stamp(e.at))}</small><b>${esc(e.actor)} · ${esc(e.tipo)}</b><p class="lines">${esc(typeof e.detalle==='object' && e.detalle!==null?JSON.stringify(e.detalle):e.detalle)}</p></li>`).join('')}</ol>${events.length?'':'<p>Sin eventos registrados.</p>'}`);
    } catch(err) { if(generation===detailGeneration) showDetail('Detalle de tarea','<p>'+esc(err.message)+'</p>'+detailButton('task',key,'Reintentar')); }
    return;
  }
  if(kind==='station') {
    const [name,states,,actor,description]=stations[key];
    const rows=(Number(key)===0?data.tareas.filter(t=>t.estado==='propuesta'):rowsAt(Number(key))).filter(taskMatches);
    return showDetail(name,`<p>${description}</p><small>Actúa: ${actor} · Registro de fábrica · ${esc(stamp(data.ahora))}</small>${Number(key)===0?'<h3>Propuestas en aprobación</h3>':''}${rows.map(t=>taskCard(t,true)).join('') || (states.length?'<p>Sin tareas.</p>':'')}${go('fabrica','Ver la planta')}`);
  }
  if(kind==='point'||kind==='milestone') {
    const names=['Prueba cerrada','12 verificadores','14 días seguidos','Pedir producción'];
    const notes=['La beta está en prueba cerrada. El registro diario cuenta los inscritos.','La meta de la prueba cerrada es llegar a 12 inscritos.','Se requieren 14 días seguidos con 12 inscritos. La duración está por confirmar.','La solicitud de producción está por confirmar.'];
    const n=latest('play.verificadores_inscritos');
    const status=n==null?'Aún no hay medición.':Number(key)<=n?'Este lugar ya está cubierto.':'Este lugar sigue pendiente.';
    return metricDetail('play.verificadores_inscritos',kind==='point'?'Lugar '+key+' de 12':names[key],kind==='point'?status+' El número muestra el total de inscritos registrados.':notes[key]);
  }
  if(kind==='metric') {
    const title=steps.find(([k])=>k===key)?.[1] ?? socialStates.find(([,k])=>'redes.'+k===key)?.[2] ?? (key==='beta.build'?'Último build de la beta':metricNames[key] ?? key);
    return metricDetail(key,key==='redes.piezas'?'Piezas':key==='play.verificadores_lista'?'Lista de verificadores':title);
  }
  if(kind==='piece'||kind==='channel') {
    const list=kind==='piece'?pieces().filter(p=>p.id===key):pieces().filter(p=>p.salidas?.some(o=>o.canal===key));
    const body=list.map(p=>`<article class="item"><h3>${esc(p.campana || p.tipo)}</h3>${p.estado==='pendiente_revision'?'':preview(p)}${chip(p.tipo)} ${chip(stateName(p.estado))}<p>${esc(Object.hasOwn(pieceHints,p.estado)?pieceHints[p.estado]:'Consulta esta pieza en la sesión de redes.')}</p><p>${esc(p.cta)}</p>${(p.salidas??[]).filter(o=>kind==='piece'||o.canal===key).map(outputRow).join('') || '<small>Sin salidas registradas.</small>'}</article>`).join('');
    return showDetail(kind==='piece'?'Detalle de pieza':channelName(key),`${freshness(queue()?._al)}<small>Cola de publicaciones · ${esc(stamp(queue()?._al))}</small>${body || '<p>Sin salidas para este canal.</p>'}${go('redes','Ver redes')}`);
  }
  if(kind==='decision') {
    const d=data.decisiones.find(row=>row.id===key);
    return d && showDetail(d.titulo,decision(d,true));
  }
  if(kind==='bug') {
    const b=data.bugs.find(row=>row.huella===key);
    return showDetail(b.titulo,`<p>${esc(b.detalle)}</p><small>Bandeja de bugs · ${esc(stamp(b.ultimo))} · ${num(b.veces)} apariciones</small>${bugAction(b)}`);
  }
  if(kind==='rec') {
    const row=data.recomendaciones[key];
    return showDetail(row.titulo,recItem(row)+'<small>Recomendaciones · '+esc(stamp(data.ahora))+'</small>');
  }
  if(kind==='release') {
    const v=releases()[key];
    return showDetail('Beta '+v.version,`<small>Registro de versiones · ${esc(stamp(v.publicada))}</small><strong class="big">Build ${num(v.build)}</strong><p class="lines">${esc(v.notas)}</p>${go('versiones','Ver versiones')}`);
  }
}
function todayList() {
  const queues=[
    pending().slice().sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(d=>['Decisión',d.titulo,detailButton('decision',d.id,'Elegir respuesta','')]),
    unapplied().map(d=>['Respondida, sin aplicar',d.titulo,detailButton('decision',d.id,'Ver','')]),
    free().map(b=>['Bug',b.titulo,`<button data-op="proponer" data-huella="${esc(b.huella)}">Mandar a la fábrica</button>`]),
    data.tareas.filter(t=>t.estado==='propuesta').map(t=>['Tarea',t.titulo,`<button data-op="mover" data-id="${esc(t.id)}" data-a="aprobada">Aprobar</button>`]),
    people().filter(isStuck).sort((a,b)=>Date.parse(a[accessSteps[lastStep(a)][0]])-Date.parse(b[accessSteps[lastStep(b)][0]])).map(p=>['Acceso',p.email,detailButton('person',p.id,'Dar seguimiento','')]),
    pauseSetting()?.activa?[['Redes','Publicaciones en pausa',detailButton('pause','','Revisar el freno','')]]:[]
  ];
  const rows=[];
  while(rows.length<7 && queues.some(q=>q.length)) {
    for(const q of queues) if(q.length && rows.length<7) rows.push(q.shift());
  }
  rows.unshift(...sessions().filter(s=>s.estado==='esperando').map(s=>['Sesión',sessionTitle(s),sessionLink(s.segmento,'Ver sesión','esperando',s.id)]));
  return panel('Tu lista de hoy',rows.length?`<ol class="today-list">${rows.map(([type,title,action])=>`<li><div><small>${type}</small><b>${esc(title)}</b></div>${action}</li>`).join('')}</ol>`:'<p>Todo atendido por ahora.</p>');
}
function searchResults(query) {
  const norm=text=>String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const terms=norm(query).trim().split(/\s+/);
  if(!terms[0]) return '<p>Busca por título, correo, campaña o versión.</p>';
  const entries=[
    ...data.tareas.map(t=>['task',t.id,'Tarea',t.titulo,[t.estado,t.rama]]),
    ...data.decisiones.map(d=>['decision',d.id,'Decisión',d.titulo,[d.contexto,d.estado]]),
    ...people().map(p=>['person',p.id,'Persona',p.email,[p.origen]]),
    ...pieces().map(p=>['piece',p.id,'Pieza',p.campana || p.id,[p.tipo,stateName(p.estado),p.cta]]),
    ...releases().map((v,i)=>['release',i,'Versión','Beta '+v.version+' · Build '+v.build,[v.notas]])
  ];
  return entries.filter(([,key,type,label,extra])=>terms.every(term=>norm([type,key,label,...extra].join(' ')).includes(term))).map(([kind,key,type,label])=>detailButton(kind,key,type+' · '+label,'search-hit')).join('') || '<p>Sin coincidencias.</p>';
}
document.addEventListener('input',e=>{
  if(e.target.id==='instruction') $('#instruction-count').textContent=e.target.value.length+'/2000';
  if(e.target.id==='respuesta-doc') responseCount();
  if(e.target.id==='consulta') $('#resultados').innerHTML=searchResults(e.target.value);
});
function draw() {
  const render = {hoy:()=>attention()+todayList()+kpis()+'<div class="grid">'+sessionSummary()+funnel()+stuckCard()+storePath()+recommendations()+plant(true)+'</div>',
    finanzas:finances,equipo:teamView,sesiones:sessionsView,decisiones:decisions,acceso:accessView,fabrica:factory,redes:social,versiones:versions,bugs,tienda:()=>'<section class="kpis">'+metricCard('acceso.grupo_miembros','En el grupo de Google','cuentas','Miembros hoy')+metricCard('play.verificadores_inscritos','Verificadores','tienda','Aceptaron en Play')+metricCard('play.instalaciones_28d','Instalaciones','instalacion','Play, últimos 28 días')+metricCard('play.dispositivos_activos','Dispositivos activos','ejercicio','Play, último mes')+'</section><div class="grid">'+storePath()+funnel()+'</div>'};
  hideHelp();
  $('#buscar').hidden=false;
  $('#navegacion').hidden=false;
  $('#navegacion').innerHTML=Object.entries(views).map(([k,label])=>`${k==='hoy'?'<span class="nav-label">Decidir</span>':k==='fabrica'?'<span class="nav-label">Operación</span>':''}<button class="${moreViews.includes(k)?'secondary-nav':''}" data-ir="${k}" ${view===k?'aria-current="page"':''}>${icon(k)}${label}</button>`).join('')+`<button class="more" data-detail="more" aria-haspopup="dialog" ${moreViews.includes(view)?'aria-current="true"':''}>${icon('mas')}Más</button>`;
  $('#titulo').textContent=view==='hoy'?'Vista general':views[view];
  $('#app').innerHTML=render[view]();
  if (!reduced.matches && !document.hidden) {
    const nodes=[...document.querySelectorAll('[data-count]')];
    const start=performance.now();
    function frame(now) {
      const progress=Math.min(1,(now-start)/200);
      for (const node of nodes) {
        const value=Number(node.dataset.count);
        node.textContent=node.hasAttribute('data-money')?money(progress===1?value:Math.round(value*progress)):Math.round(value*progress);
      }
      if (progress<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}
function status() {
  const time=new Date(data.ahora).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});
  $('#estado').innerHTML=`${DEMO?'<span>Demo</span> · ':''}<i></i> Al día ${esc(time)}`;
}
let demoSessions, demoDecisions, demoFinanceDocument, demoOrderId=0;
function demoSessionOp(op,args,sessionId) {
  const s=demoSessions.find(row=>row.id===sessionId);
  if(!s) throw Error('Esa sesión ya no está en el panel.');
  if(op==='archivar_sesion') {
    demoSessions=demoSessions.filter(row=>row!==s);
    return;
  }
  if(s.estado==='terminada') throw Error('Esa sesión ya terminó.');
  if(op==='cancelar_orden') {
    const order=s.ordenes?.find(o=>o.id===args.id && o.estado==='pendiente');
    if(!order) throw Error('Esa instrucción ya se entregó o no existe.');
    order.estado='cancelada';
    return;
  }
  if(queued(s)>=5) throw Error('Esa sesión ya tiene 5 instrucciones sin entregar.');
  const texto=args.tipo==='finalizar'?'Cierra el trabajo de esta sesión: termina o deja anotado lo que esté a medias, verifica lo hecho, resume qué queda pendiente y detente. No empieces nada nuevo.':args.texto;
  s.ordenes=[{id:'demo-'+(++demoOrderId),tipo:args.tipo,texto,estado:'pendiente',creada:data.ahora,entregada:null},...(s.ordenes ?? [])];
}
async function load(refresh=false) {
  const generation=++request;
  let next;
  if (DEMO) {
    const response=await fetch('demo.json',{cache:'no-store'});
    if (!response.ok) throw Error('No se pudo leer la demostración.');
    next=await response.json();
    demoDecisions ??= next.decisiones;
    next.decisiones=demoDecisions.map(d=>({...d}));
    if(demoFinanceDocument) {
      const {clave,respuesta,respondido}=demoFinanceDocument;
      const doc=next.documentos.find(d=>d.clave===clave);
      if(doc && next.documentos_demo[clave]) {
        doc.respondido=respondido;
        Object.assign(next.documentos_demo[clave],{respuesta,respondido});
      }
    }
    demoSessions ??= next.sesiones ?? [];
    next.sesiones=demoSessions.map(s=>({...s,ordenes:(s.ordenes ?? []).slice(0,10).map(o=>({...o}))}));
  } else {
    const {data:summary,error}=await sb.rpc('panel',{p_op:'resumen'});
    if (error) throw Error(error.message);
    next=summary;
  }
  if (generation!==request) return;
  // Un refresco conserva el comentario, el foco y los grupos abiertos.
  const liveView=['sesiones','equipo','fabrica'].includes(view);
  const sessionId=drawer.querySelector('[data-session]')?.dataset.session;
  if (refresh && (busy || (drawer.open && !sessionId) || $('#app a:focus') || $('#app select:focus, #app textarea:focus, #app details[open]') || (!liveView && $('#app button:focus')) || [...document.querySelectorAll('#app textarea')].some(t=>t.value))) return;
  const changed=!data || ['metricas','bugs','tareas','decisiones','recomendaciones','ajustes','versiones','accesos','sesiones','documentos'].some(k=>JSON.stringify(data[k])!==JSON.stringify(next[k])) || (['hoy','acceso','fabrica','redes','versiones','tienda','sesiones','equipo'].includes(view) && data.ahora!==next.ahora) || data.ahora.slice(0,10)!==next.ahora.slice(0,10);
  data=next;
  histories=indexMetrics(data.metricas);
  status();
  if (!refresh && !dataPainted) { draw(); dataPainted=true; }
  else if (!refresh) refreshView();
  else if (changed) refreshView();
  if(sessionId && (!refresh || changed)) refreshSessionDetail(sessionId);
}
function refreshView() {
  const fields = [...document.querySelectorAll('#app textarea')].map(el => [el.id,el.value]);
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
    [...document.querySelectorAll('button,summary,[role=button]')].find(el =>
      el.tagName === active.tagName && (el.textContent === active.textContent || active.hasAttribute('data-session-filter') || active.hasAttribute('data-team-node') || active.hasAttribute('data-segment')) && el.getClientRects().length &&
      JSON.stringify(el.dataset) === JSON.stringify(active.dataset) && group === el.closest('details')?.dataset.group);
  replacement?.focus({preventScroll:true});
  if (active.tagName === 'TEXTAREA') replacement?.setSelectionRange(active.selectionStart,active.selectionEnd);
}
async function travel(id,state) {
  const scene=$('.factory-scene');
  if(!scene || scene.closest('.mini-plant') || reduced.matches || document.hidden) return;
  const task=data.tareas.find(t=>t.id===id);
  if(!task) return;
  const from=stageOf(task.estado),to=stageOf(state),deck=plantDeck();
  if(from<0 || to<=from || (to===7 && !deck.ramps[from])) return;
  const rows=rowsAt(from), index=rows.indexOf(task);
  const start=slot(deck,from,index,rows.length);
  const incoming=data.tareas.filter(t=>t===task||stageOf(t.estado)===to);
  const end=slot(deck,to,incoming.indexOf(task),incoming.length);
  const points=[start];
  for(let i=from;i<to;i++) {
    const next=to===7?7:i+1;
    points.push(...route(deck,i,next).map(p=>iso(...p,beltHeight)));
    if(next===7) break;
  }
  points.push(end);
  const source=[...scene.querySelectorAll('[data-detail="task"]')].find(el=>el.dataset.key===id);
  const flight=document.createElementNS('http://www.w3.org/2000/svg','g');
  flight.setAttribute('class','moving-crate '+stateColors[task.estado]);
  flight.setAttribute('aria-hidden','true');
  flight.innerHTML=cube(stateMarks[task.estado]);
  scene.append(flight);
  if(source) source.style.visibility='hidden';
  // Distancia acumulada para mantener la velocidad también en las curvas.
  let distance=0;
  const frames=points.map(([x,y],i)=>{
    if(i) distance+=Math.hypot(x-points[i-1][0],y-points[i-1][1]);
    return {transform:`translate(${x}px,${y}px)`,offset:distance};
  });
  frames.forEach(f=>f.offset/=distance);
  let motion;
  const stop=()=>motion?.cancel();
  try {
    motion=flight.animate(frames,{duration:Math.min(1300,420+distance),easing:'ease-in-out',fill:'forwards'});
    reduced.addEventListener('change',stop);
    await motion.finished;
  } catch { /* Una animación interrumpida permite refrescar la operación ya guardada. */ }
  finally {
    reduced.removeEventListener('change',stop);
    flight.remove();
    if(source) source.style.visibility='';
  }
}
window.addEventListener('hashchange',()=>{
  if(!data || location.hash==='#contenido') return;
  if(!closeDetail()) { history.replaceState(null,'','#'+view); return; }
  view=Object.hasOwn(views,location.hash.slice(1))?location.hash.slice(1):'hoy';
  draw();
  $('#contenido').focus();
});
function navigate(button) {
  view=button.dataset.ir;
  if(view==='fabrica') {
    factorySegment=button.dataset.segment || '';
    openTasksOnly=button.hasAttribute('data-only-open');
  }
  if(view==='sesiones') {
    sessionSegment=button.dataset.segment || '';
    sessionFilter=button.dataset.sessionState || '';
  }
  const target=button.dataset.target;
  history.replaceState(null,'','#'+view);
  const paint=()=>{
    refreshView();
    scrollTo(0,0);
    const el=button.hasAttribute('data-compose')?$('#nueva'):target && document.getElementById('item-'+target);
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
document.addEventListener('keydown',e=>{
  if(e.target.id==='instruction' && e.ctrlKey && e.key==='Enter') {
    e.preventDefault();
    if(!busy && !e.repeat && !e.isComposing) $('#send-instruction').click();
    return;
  }
  if(e.key==='/' && data && !busy && !drawer.open && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest('input,textarea,[contenteditable]')) {
    e.preventDefault();
    openDetail('search','');
    return;
  }
  if(e.key!=='Enter' && e.key!==' ') return;
  const target=e.target.closest('.factory-scene [role=button],[data-team-node]');
  if(!target) return;
  e.preventDefault();
  if(busy || e.repeat) return;
  if(target.hasAttribute('data-team-node')) focusTeamCard(target);
  else openDetail(target.dataset.detail,target.dataset.key);
});
document.addEventListener('click',async e=>{
  let b=e.target.closest('button,.factory-scene [role=button],[data-team-node]');
  // En el espacio libre de una tarjeta se abre su control de lectura.
  if(!b && !e.target.closest('a,summary,textarea,label,input,dialog,[data-team-card],.finances,#ayuda') && !window.getSelection()?.toString()) {
    const card=e.target.closest('.item,.module,.hero,.lane,.calendar li,.events li');
    b=card?.querySelector('button[data-detail],button[data-ir]');
  }
  if (!b) return;
  if (b.id==='cerrar' || b.hasAttribute('data-close')) return closeDetail();
  if (busy) return;
  if(b.dataset.section) {
    for(const control of drawer.querySelectorAll('[data-section]')) {
      const selected=control===b;
      control.setAttribute('aria-pressed',String(selected));
      document.getElementById(control.getAttribute('aria-controls')).hidden=!selected;
    }
    return;
  }
  if(b.hasAttribute('data-copy')) {
    try { await navigator.clipboard.writeText(b.dataset.copy); notice('Copiado'); }
    catch { notice('No se pudo copiar. Selecciona el correo para copiarlo.'); }
    return;
  }
  if(b.hasAttribute('data-team-node')) return focusTeamCard(b);
  if(b.hasAttribute('data-factory-segment') || b.hasAttribute('data-open-tasks') || b.hasAttribute('data-session-filter')) {
    if(b.hasAttribute('data-factory-segment')) factorySegment=b.dataset.factorySegment;
    if(b.hasAttribute('data-open-tasks')) openTasksOnly=!openTasksOnly;
    if(b.hasAttribute('data-session-filter')) sessionFilter=sessionFilter===b.dataset.sessionFilter?'':b.dataset.sessionFilter;
    refreshView();
    return;
  }
  if(b.dataset.filter) {
    accessFilter=b.dataset.filter;
    refreshView();
    return;
  }
  if(b.dataset.ir==='acceso') accessFilter=b.dataset.access || 'all';
  if (b.dataset.detail) {
    b.focus({preventScroll:true});
    return openDetail(b.dataset.detail,b.dataset.key);
  }
  if (b.dataset.ir && drawer.open && !closeDetail()) return;
  if (b.dataset.ir) return navigate(b);
  if (b.id==='entrar') return sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
  if (b.id==='salir') { await sb.auth.signOut(); return location.reload(); }
  const {op,id,a,opcion,huella}=b.dataset;
  if (!op) return;
  const sessionId=b.closest('[data-session]')?.dataset.session;
  const demoDecision=DEMO && id?.startsWith('fin-') && ['decidir','resolver_decision','reabrir_decision'].includes(op);
  const demoFinanceReply=DEMO && op==='responder_documento' && documentDraft?.key==='finanzas-preguntas';
  if (DEMO && !sessionId && !demoDecision && !demoFinanceReply) return notice('Demostración. Los cambios no se guardan.');
  let args;
  switch (op) {
    case 'ordenar': {
      args={sesion:sessionId,tipo:b.dataset.type || 'instruccion'};
      if(args.tipo==='instruccion') {
        args.texto=(b.dataset.text ?? $('#instruction').value).trim();
        if(!args.texto || args.texto.length>2000) {
          $('#instruction').focus();
          return notice('Escribe una instrucción de 1 a 2000 caracteres.');
        }
      }
      break;
    }
    case 'archivar_sesion':
      if(!window.confirm('¿Quitar esta sesión del panel? Dejará de verse aquí y se cancelarán sus órdenes en cola.')) return;
      args={id}; break;
    case 'cancelar_orden': args={id}; break;
    case 'segmentar': args={id,segmento:$('#segmento-tarea').value}; if(!segmentKeys.includes(args.segmento)) return; break;
    case 'responder_documento': args={clave:documentDraft.key,respuesta:$('#respuesta-doc').value}; break;
    case 'pausar': args={activa:b.dataset.active==='true'}; break;
    case 'nueva': {
      const titulo=$('#nueva').value.trim();
      if (titulo.length<3) return notice('Escribe qué quieres cambiar.');
      args={titulo}; break;
    }
    case 'decidir': args={id,opcion,comentario:b.closest('article').querySelector('[data-comment]').value}; break;
    case 'resolver_decision': args={id,resolucion:b.closest('article').querySelector('[data-resolution]').value.trim()}; break;
    case 'reabrir_decision': args={id}; break;
    case 'grupo': args={id,en:b.dataset.en==='true'}; break;
    case 'mover': args={id,a}; break;
    case 'proponer': args={huella}; break;
    default: return;
  }
  busy=true; b.disabled=true;
  try {
    if(demoDecision) {
      const d=demoDecisions.find(row=>row.id===id);
      d.estado=op==='decidir'?'respondida':op==='resolver_decision'?'resuelta':'pendiente';
      if(op==='decidir') d.respuesta={opcion,comentario:args.comentario};
      if(op==='reabrir_decision') d.respuesta=null;
      d.resolucion=op==='resolver_decision'?args.resolucion:null;
    } else if(demoFinanceReply) demoFinanceDocument={...args,respondido:new Date().toISOString()};
    else if(DEMO) demoSessionOp(op,args,sessionId);
    else {
      const {error}=await sb.rpc('panel',{p_op:op==='nueva'?'proponer':op,p_args:args});
      if (error) throw Error(error.message);
    }
    if(sessionId) {
      if(op==='archivar_sesion' && b.isConnected) closeDetail();
      if(b.id==='send-instruction' && b.isConnected && $('#instruction').value.trim()===args.texto) {
        $('#instruction').value='';
        $('#instruction-count').textContent='0/2000';
      }
      try { await load(); }
      catch { return notice('Cambio guardado. No se pudo actualizar el resumen.'); }
      if(drawer.querySelector('[data-session]')?.dataset.session===sessionId && (op==='cancelar_orden' || b.id==='send-instruction')) $('#instruction')?.focus();
      notice(op==='archivar_sesion'?'Sesión retirada del panel.':op==='ordenar'?'Orden en cola.':'Orden cancelada.');
      return;
    }
    if(op==='responder_documento') {
      if(b.isConnected) documentDraft.saved=args.respuesta;
      try { await load(); }
      catch { return notice('Respuesta guardada. No se pudo actualizar el resumen.'); }
      if(b.isConnected) {
        const answered=data.documentos?.find(d=>d.clave===args.clave)?.respondido;
        $('#fecha-respuesta').textContent=answered?'Contestado · '+stamp(answered):'Respuesta guardada';
        notice($('#respuesta-doc').value===args.respuesta?'Respuesta guardada.':'Respuesta guardada. Hay cambios nuevos sin guardar.');
      }
      return;
    }
    if(op==='segmentar') {
      await load();
      if(drawer.open && b.isConnected) await openDetail('task',id);
      notice('Segmento guardado.');
      return;
    }
    const keepPerson=op==='grupo' && drawer.open && b.isConnected;
    if(!keepPerson) closeDetail();
    if(op==='mover') await travel(id,a);
    if(op==='nueva' && $('#nueva')?.value.trim()===args.titulo) $('#nueva').value='';
    if(op==='decidir' && document.getElementById('c-'+id)?.value===args.comentario) document.getElementById('c-'+id).value='';
    await load();
    if(keepPerson && drawer.open && b.isConnected) await openDetail('person',id);
    notice(demoDecision?'Decisión actualizada en la demostración.':'Cambio guardado.');
  } catch (error) { notice(error.message); }
  finally { busy=false; b.disabled=false; }
});
function gate(message,button) {
  $('#buscar').hidden=true;
  $('#navegacion').hidden=true;
  $('#app').innerHTML=panel('Acceso al panel',`<p>${esc(message)}</p>${button}`);
}
async function init() {
  if (!DEMO) {
    const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
    sb=createClient(URL_SB,CLAVE);
    const {data:{session}}=await sb.auth.getSession();
    if (!session) return gate('Solo para la cuenta de AXTRONIC.','<button class="primary" id="entrar">Entrar con Google</button>');
  }
  try {
    const response=await fetch('ayuda.json',{cache:'no-cache'});
    if(response.ok) helpCatalog=(await response.json()) ?? {};
  } catch { /* El panel funciona sin explicaciones emergentes. */ }
  try {
    const response=await fetch('equipo.json');
    if(response.ok) {
      const catalog=await response.json();
      if(Array.isArray(catalog?.segmentos) && catalog.director && catalog.compartido) team=catalog;
    }
  } catch { /* Equipo muestra su estado vacío. */ }
  await load();
  setInterval(()=>{
    if (!document.hidden && !busy) load(true).catch(()=>$('#estado').textContent='Actualización pendiente');
  },60000);
}
init().catch(error=>gate(/permiso/.test(error.message)?'Esta cuenta no tiene acceso.':error.message,sb?'<button id="salir">Cambiar de cuenta</button>':''));
