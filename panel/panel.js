/* global window, navigator, URLSearchParams, location, document, matchMedia, clearTimeout, setTimeout, performance, requestAnimationFrame, fetch, history, scrollTo, setInterval */
const URL_SB = 'https://eqdjmaarjfsdfomkducz.supabase.co';
const CLAVE = 'sb_publishable_ctpCybT7Bxan6aEJhiKjPw_hyapptwg';
const DEMO = new URLSearchParams(location.search).has('demo');
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
const views = { hoy:'Hoy', decisiones:'Decidir', acceso:'Acceso', fabrica:'Fábrica', redes:'Redes', bugs:'Bugs', versiones:'Versiones', tienda:'Tienda' };
const paths = {
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
  return `<button class="kpi" data-detail="metric" data-key="${key}"><span class="metric-name">${icon(symbol)}${label}</span><strong>${count(value)}</strong><small>${period}</small>${metricHistory(key)}${metricFresh(key)}</button>`;
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
      <small>${what} <span class="chip">${source}</span> ${metricFresh(key)}</small>${more}
      <svg aria-hidden="true" viewBox="0 0 100 6" preserveAspectRatio="none">${bars}</svg>${link}</div></li>`;
  }).join('');
  return panel('Del comentario al uso',`<p class="note">Siete pasos, de quien comenta en redes a quien ya entrena. Cada número viene de su propia fuente (se indica en cada paso), así que no son siempre las mismas personas. El recorrido de cada persona está en Acceso.</p><ol class="journey">${items}</ol>`,'captacion');
}
function storePath() {
  const n = latest('play.verificadores_inscritos');
  const milestones = [['Prueba cerrada','Activa'],['12 verificadores',n==null?'Sin dato':n>=12?'Meta alcanzada':n+' aceptaron'],['14 días seguidos','Empieza al llegar a 12'],['Pedir producción','Después de los 14 días']];
  return panel('Camino a la tienda',`<div class="store-number">${metricFresh('play.verificadores_inscritos')}<strong>${count(n)}</strong> de 12 verificadores aceptaron</div>
    <a class="points" href="${PLAY}/app-dashboard" target="_blank" rel="noopener noreferrer" aria-label="Abrir Play Console: ${n==null?'sin dato':n} de 12 verificadores">${Array.from({length:12},(_,i)=>`<i class="${n!=null && i<n?'filled':''}">${i+1}</i>`).join('')}</a>
    <p class="note">${n==null?'El recolector de la PC sube este número cada mañana.':'Google pide 12 verificadores que acepten y sigan 14 días seguidos. Faltan '+Math.max(0,12-n)+'.'}</p>
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
  const subject=encodeURIComponent('Tu acceso anticipado a AXTRONIC');
  const stepsHtml=accessSteps.map(([field,label])=>`<li class="${p[field]?'done':''}"><b>${label}</b><small>${p[field]?esc(stamp(p[field])):field==='grupo'||field==='solicito'?'No se sabe':'Pendiente'}</small></li>`).join('');
  return `<article class="item person"><h3>${detail?esc(p.email):detailButton('person',p.id,p.email)}</h3><small>Origen · ${esc(p.origen || 'Directo')} · Correos enviados: ${num(p.correos)}</small><ol class="stepper">${stepsHtml}</ol><p>${next[stage] ?? 'Sin avance registrado.'}</p><div class="actions">${external(groupUrl,'Abrir miembros del grupo')}<button data-op="grupo" data-id="${esc(p.id)}" data-en="${!p.grupo}">${p.grupo?'Quitar la marca':'Marcar que ya está en el grupo'}</button><a class="action-link" href="mailto:${esc(encodeURIComponent(p.email))}?subject=${esc(subject)}">Escribirle</a><button data-copy="${esc(p.email)}">Copiar correo</button>${external(playUrl,'Ver la prueba en Google Play')}</div></article>`;
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
  return `<g class="crate-anchor ${stateColors[t.estado]}" transform="translate(${x} ${y})" ${control(pile?'station':'task',pile?i:t.id,label)}><title>${esc(label)}</title><g class="crate-slide">${delay?'<ellipse class="held-ring" cy="-3" rx="16" ry="10"/>':''}${layers}${cube(stateMarks[t.estado])}${pile?badge(-27,String(rows.length),'total'):''}</g></g>`;
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
  return `<article class="item" tabindex="-1" ${detail===true?'':`id="item-${esc(t.id)}"`}>${chip(t.linea)} ${t.severidad?chip(t.severidad,'warn'):''} ${Object.hasOwn(state,t.estado)?chip(state[t.estado],'warn'):''}
    <h3>${expanded?esc(t.titulo):detailButton('task',t.id,t.titulo)}</h3><small>${esc(date(t.updated_at))} · ${esc(t.estado)} ${esc(stale(t))}</small>
    <h4>Qué puedes hacer</h4><p>${esc(Object.hasOwn(taskNext,t.estado)?taskNext[t.estado]:'Consulta el historial de la tarea.')}</p><div class="actions">${/^factory\/[a-z0-9-]{1,60}$/.test(t.rama)?external('https://github.com/axtronic/axtronic/tree/'+t.rama,'Ver la rama'):''}${external(t.pr,'Ver el cambio')}${actions}</div></article>`;
}
function factory() {
  const lanes=stations.map(([name,states,tone],i)=>states.length ? `<section class="lane"><h2><button class="plain spread" data-detail="station" data-key="${i}"><i class="${tone}"></i>${name}<b>${rowsAt(i).length}</b></button></h2>${rowsAt(i).map(t=>taskCard(t)).join('') || '<small>Sin tareas</small>'}</section>`:'').join('');
  const others=data.tareas.filter(t=>stageOf(t.estado)<0);
  return plant()+'<h2>Vista de lista</h2><section class="board" aria-label="Tablero de tareas">'+lanes+(others.length?panel('Otros estados',others.map(t=>taskCard(t)).join('')):'')+'</section>'+
    panel('Pedir algo nuevo','<label for="nueva">¿Qué quieres cambiar y dónde?</label><textarea id="nueva" rows="2"></textarea><button class="primary" data-op="nueva">Proponer tarea</button>');
}
function decision(d,detail=false) {
  const age = Math.max(0, Math.floor((new Date(data.ahora)-new Date(d.created_at))/86400000));
  const options = d.opciones ?? [];
  const prefix=detail===true?'detalle-':'';
  const wait = d.estado==='pendiente';
  return `<article class="module decision" tabindex="-1" id="${prefix}item-${esc(d.id)}">${wait?`<small>${num(age)} ${age===1?'día':'días'} esperando</small><div class="age"><i class="${age>=7?'bad':age>=3?'warn':'accent'}" style="width:${100*(age+1)/(age+7)}%"></i></div>`:chip(d.estado)}
    <h3>${detail===true?esc(d.titulo):detailButton('decision',d.id,d.titulo)}</h3><p>${esc(d.contexto)}</p>${wait?`<label for="${prefix}c-${esc(d.id)}">Comentario opcional</label><textarea id="${prefix}c-${esc(d.id)}" data-comment rows="2"></textarea>
    <div class="actions">${options.map((o,i)=>`<button class="${i?'':'primary'}" data-op="decidir" data-id="${esc(d.id)}" data-opcion="${esc(o)}">${esc(o)}</button>`).join('')}</div>`:d.respuesta?`<p>Elegiste: ${esc(d.respuesta.opcion)}</p>`:''}
    ${d.resolucion?`<p>Qué se hizo · ${esc(d.resolucion)}</p>`:''}
    <div class="actions">${(d.enlaces??[]).map(e=>external(e.url,e.texto)).join('')}</div>
    ${d.estado!=='resuelta'?`<label for="${prefix}r-${esc(d.id)}">Qué se hizo (opcional)</label><textarea id="${prefix}r-${esc(d.id)}" data-resolution maxlength="2000" rows="2"></textarea>`:''}
    <div class="actions">${d.estado!=='resuelta'?`<button data-op="resolver_decision" data-id="${esc(d.id)}">${wait?'Ya está resuelta':'Marcar resuelta'}</button>`:''}${wait?'':`<button data-op="reabrir_decision" data-id="${esc(d.id)}">Reabrir</button>`}</div></article>`;
}
function decisions() {
  const groups = [['Aplicando',data.decisiones.filter(d=>d.estado==='aplicando')],['Otras respuestas',data.decisiones.filter(d=>!['pendiente','aplicando'].includes(d.estado))]];
  return `<h2 class="section-title">Pendientes <span>${pending().length}</span></h2><div class="grid">${pending().sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(decision).join('') || '<p>Todo atendido.</p>'}</div>`+
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
const drawer=$('#detalle');
let opener,detailGeneration=0;
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
  if(!drawer.open) return;
  ++detailGeneration;
  drawer.close();
  $('#detalle-cuerpo').replaceChildren();
  opener?.focus({preventScroll:true});
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
  showDetail(title,`<strong class="big">${num(beta?releases()[0]?.build:latest(key))}</strong><p>${esc(explain || definition)}</p><small>${source} · ${esc(stamp(rows.at(-1)?.[0]))}</small>${metricFresh(key)}${historyTable(rows)}${key==='acceso.grupo_miembros'?external(groupUrl,'Abrir el grupo'):key.startsWith('play.')?external(PLAY+(key==='play.verificadores_inscritos'?'/app-dashboard':'/statistics'),'Abrir en Play Console'):''}${go(target,'Ver '+views[target])}`);
}
async function openDetail(kind,key) {
  const generation=++detailGeneration;
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
  if(kind==='more') return showDetail('Más',['redes','bugs','versiones','tienda'].map(k=>go(k,views[k])).join(''));
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
      const events=[...(task.eventos??[])].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
      showDetail(task.titulo,taskCard(task,true,true)+`<h3>Historial</h3><ol class="events">${events.map(e=>`<li><small>${esc(stamp(e.at))}</small><b>${esc(e.actor)} · ${esc(e.tipo)}</b><p class="lines">${esc(typeof e.detalle==='object' && e.detalle!==null?JSON.stringify(e.detalle):e.detalle)}</p></li>`).join('')}</ol>${events.length?'':'<p>Sin eventos registrados.</p>'}`);
    } catch(err) { if(generation===detailGeneration) showDetail('Detalle de tarea','<p>'+esc(err.message)+'</p>'+detailButton('task',key,'Reintentar')); }
    return;
  }
  if(kind==='station') {
    const [name,states,,actor,description]=stations[key];
    const rows=Number(key)===0?data.tareas.filter(t=>t.estado==='propuesta'):rowsAt(Number(key));
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
    free().map(b=>['Bug',b.titulo,`<button data-op="proponer" data-huella="${esc(b.huella)}">Mandar a la fábrica</button>`]),
    data.tareas.filter(t=>t.estado==='propuesta').map(t=>['Tarea',t.titulo,`<button data-op="mover" data-id="${esc(t.id)}" data-a="aprobada">Aprobar</button>`]),
    people().filter(isStuck).sort((a,b)=>Date.parse(a[accessSteps[lastStep(a)][0]])-Date.parse(b[accessSteps[lastStep(b)][0]])).map(p=>['Acceso',p.email,detailButton('person',p.id,'Dar seguimiento','')]),
    pauseSetting()?.activa?[['Redes','Publicaciones en pausa',detailButton('pause','','Revisar el freno','')]]:[]
  ];
  const rows=[];
  while(rows.length<7 && queues.some(q=>q.length)) {
    for(const q of queues) if(q.length && rows.length<7) rows.push(q.shift());
  }
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
  if(e.target.id==='consulta') $('#resultados').innerHTML=searchResults(e.target.value);
});
function draw() {
  const render = {hoy:()=>attention()+todayList()+kpis()+'<div class="grid">'+funnel()+stuckCard()+storePath()+recommendations()+plant(true)+'</div>',
    decisiones:decisions,acceso:accessView,fabrica:factory,redes:social,versiones:versions,bugs,tienda:()=>'<section class="kpis">'+metricCard('acceso.grupo_miembros','En el grupo de Google','cuentas','Miembros hoy')+metricCard('play.verificadores_inscritos','Verificadores','tienda','Aceptaron en Play')+metricCard('play.instalaciones_28d','Instalaciones','instalacion','Play, últimos 28 días')+metricCard('play.dispositivos_activos','Dispositivos activos','ejercicio','Play, último mes')+'</section><div class="grid">'+storePath()+funnel()+'</div>'};
  $('#buscar').hidden=false;
  $('nav').hidden=false;
  $('nav').innerHTML=Object.entries(views).map(([k,label])=>`${k==='hoy'?'<span class="nav-label">Decidir</span>':k==='fabrica'?'<span class="nav-label">Operación</span>':''}<button class="${['redes','bugs','versiones','tienda'].includes(k)?'secondary-nav':''}" data-ir="${k}" ${view===k?'aria-current="page"':''}>${icon(k)}${label}</button>`).join('')+`<button class="more" data-detail="more" aria-haspopup="dialog" ${['redes','bugs','versiones','tienda'].includes(view)?'aria-current="true"':''}>${icon('mas')}Más</button>`;
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
  if (refresh && (busy || drawer.open || $('#app a:focus') || $('#app textarea:focus, #app details[open], #app button:focus, .factory-scene [role="button"]:focus') || [...document.querySelectorAll('textarea')].some(t=>t.value))) return;
  const changed=!data || ['metricas','bugs','tareas','decisiones','recomendaciones','ajustes','versiones','accesos'].some(k=>JSON.stringify(data[k])!==JSON.stringify(next[k])) || (['hoy','acceso','fabrica','redes','versiones','tienda'].includes(view) && data.ahora!==next.ahora) || data.ahora.slice(0,10)!==next.ahora.slice(0,10);
  data=next;
  histories=indexMetrics(data.metricas);
  status();
  if (!refresh && !dataPainted) { draw(); dataPainted=true; }
  else if (!refresh) refreshView();
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
    [...document.querySelectorAll('button,summary,.factory-scene [role=button]')].find(el =>
      el.tagName === active.tagName && el.textContent === active.textContent &&
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
  closeDetail();
  view=Object.hasOwn(views,location.hash.slice(1))?location.hash.slice(1):'hoy';
  draw();
  $('#contenido').focus();
});
function navigate(button) {
  view=button.dataset.ir;
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
  if(e.key==='/' && data && !busy && !drawer.open && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest('input,textarea,[contenteditable]')) {
    e.preventDefault();
    openDetail('search','');
    return;
  }
  if(e.key!=='Enter' && e.key!==' ') return;
  const target=e.target.closest('.factory-scene [role=button]');
  if(!target) return;
  e.preventDefault();
  if(!busy && !e.repeat) openDetail(target.dataset.detail,target.dataset.key);
});
document.addEventListener('click',async e=>{
  let b=e.target.closest('button,.factory-scene [role=button]');
  // En el espacio libre de una tarjeta se abre su control de lectura.
  if(!b && !e.target.closest('a,summary,textarea,label,input,dialog') && !window.getSelection()?.toString()) {
    const card=e.target.closest('.item,.module,.hero,.lane,.calendar li,.events li');
    b=card?.querySelector('button[data-detail],button[data-ir]');
  }
  if (!b) return;
  if (b.id==='cerrar' || b.hasAttribute('data-close')) return closeDetail();
  if (busy) return;
  if(b.hasAttribute('data-copy')) {
    try { await navigator.clipboard.writeText(b.dataset.copy); notice('Copiado'); }
    catch { notice('No se pudo copiar. Selecciona el correo para copiarlo.'); }
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
  if (b.dataset.ir && drawer.open) closeDetail();
  if (b.dataset.ir) return navigate(b);
  if (b.id==='entrar') return sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
  if (b.id==='salir') { await sb.auth.signOut(); return location.reload(); }
  const {op,id,a,opcion,huella}=b.dataset;
  if (!op) return;
  if (DEMO) return notice('Demostración. Los cambios no se guardan.');
  let args;
  switch (op) {
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
    const {error}=await sb.rpc('panel',{p_op:op==='nueva'?'proponer':op,p_args:args});
    if (error) throw Error(error.message);
    const keepPerson=op==='grupo' && drawer.open && b.isConnected;
    if(!keepPerson) closeDetail();
    if(op==='mover') await travel(id,a);
    if(op==='nueva' && $('#nueva')?.value.trim()===args.titulo) $('#nueva').value='';
    if(op==='decidir' && document.getElementById('c-'+id)?.value===args.comentario) document.getElementById('c-'+id).value='';
    await load();
    if(keepPerson && drawer.open && b.isConnected) await openDetail('person',id);
    notice('Cambio guardado.');
  } catch (error) { notice(error.message); }
  finally { busy=false; b.disabled=false; }
});
function gate(message,button) {
  $('#buscar').hidden=true;
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
