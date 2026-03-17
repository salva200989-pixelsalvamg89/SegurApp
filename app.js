
function _saveAcredBase(){
  const nombre=document.getElementById('i-acred-nombre').value.trim();
  if(!nombre){showToast('❌ Nombre obligatorio');return;}
  const acred={id:editingAcredId||'a'+Date.now(),nombre,org:document.getElementById('i-acred-org').value.trim(),titular:document.getElementById('i-acred-titular').value.trim(),codigo:document.getElementById('i-acred-codigo').value.trim(),desde:document.getElementById('i-acred-desde').value.trim(),hasta:document.getElementById('i-acred-hasta').value.trim(),color:acredColor,img:acredImgB64||null};
  if(editingAcredId){const idx=state.acred.findIndex(a=>a.id===editingAcredId);if(idx>=0)state.acred[idx]=acred;}
  else state.acred.push(acred);
  saveState();closeSheet();renderAcred();showToast(editingAcredId?'✅ Acreditación actualizada':'✅ Acreditación añadida');editingAcredId=null;acredImgB64='';
}

// ══════════════════════════════════════════════════════════════
// SEGURAPP v8 — app.js  (logic layer)
// ══════════════════════════════════════════════════════════════

// ── CONSTANTS ──────────────────────────────────────────────────
const HAB_ROLES=[
  {key:'vs',label:'Vigilante de Seguridad',  color:'#10B981'},
  {key:'ve',label:'Vigilante de Explosivos', color:'#F59E0B'},
  {key:'ds',label:'Director de Seguridad',   color:'#4F8EF7'},
  {key:'js',label:'Jefe de Seguridad',       color:'#22D3EE'},
];
const CURSO_COLORS=[
  {bg:'linear-gradient(135deg,#1E3A5F,#060d18)',cc:'rgba(79,142,247,.16)',bc:'rgba(79,142,247,.38)',tc:'#4F8EF7'},
  {bg:'linear-gradient(135deg,#1A3A2A,#060f0a)',cc:'rgba(16,185,129,.16)',bc:'rgba(16,185,129,.38)',tc:'#10B981'},
  {bg:'linear-gradient(135deg,#2D1B4E,#090410)',cc:'rgba(168,85,247,.16)',bc:'rgba(168,85,247,.38)',tc:'#A855F7'},
  {bg:'linear-gradient(135deg,#3A1A20,#100608)',cc:'rgba(244,63,94,.16)', bc:'rgba(244,63,94,.38)', tc:'#F43F5E'},
  {bg:'linear-gradient(135deg,#1A2A3A,#060c12)',cc:'rgba(34,211,238,.16)',bc:'rgba(34,211,238,.38)',tc:'#22D3EE'},
];
const ACRED_COLORS={
  blue:  {bg:'linear-gradient(135deg,#1E3A5F,#07111E)',accent:'#4F8EF7',decor:'rgba(79,142,247,.5)'},
  green: {bg:'linear-gradient(135deg,#1A3A2A,#07110C)',accent:'#10B981',decor:'rgba(16,185,129,.5)'},
  purple:{bg:'linear-gradient(135deg,#2D1B4E,#090512)',accent:'#A855F7',decor:'rgba(168,85,247,.5)'},
  gold:  {bg:'linear-gradient(135deg,#3A2800,#120E00)',accent:'#F59E0B',decor:'rgba(245,158,11,.5)'},
  red:   {bg:'linear-gradient(135deg,#3A1A20,#100608)',accent:'#F43F5E',decor:'rgba(244,63,94,.5)'},
};
const DEFAULT_CURSOS=[
  {id:'c1', code:'SEAD071PO',   name:'Centros Comerciales',                        entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c2', code:'SEAD072PO',   name:'Vigilancia con Perros',                      entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c3', code:'SEAD076PO',   name:'Hospitales',                                 entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c4', code:'SEAD077PO',   name:'Infraestructuras Críticas',                  entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c5', code:'SEAD078PO',   name:'Puertos',                                    entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c6', code:'SEAD080PO',   name:'Rayos X / Escáner',                          entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c7', code:'SEAD082PO',   name:'Centros de Internamiento',                   entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c8', code:'SEAD090PO',   name:'Transporte de Seguridad',                    entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c9', code:'SEAD069PO',   name:'Eventos Deportivos',                         entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c10',code:'SEADPO052PO', name:'Jefe de Equipo / Inspector / Coordinador',   entidad:'ISEED',fecha:'2026',horas:'',diploma:null,reciclajes:[]},
  {id:'c11',code:'SEAD290PO',   name:'Primeros Auxilios',                          entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c12',code:'SEAD062PO',   name:'Especialista en Escáner',                    entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c13',code:'SEAD252PO',   name:'Técnicas de Cacheo / Retención / Reducción', entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
  {id:'c14',code:'SEAD292PO',   name:'Terrorismo Yihadista',                       entidad:'SEPE', fecha:'',horas:'',diploma:null,reciclajes:[]},
];

// ── STATE ───────────────────────────────────────────────────────
let state={
  dni:{num:'',nombre:'',apell:'',nac:'',exp:'',sexo:'',nac2:'',lugar:'',dom:'',nfcVerified:false},
  tip:{nombre:'',apell:'',habs:{vs:'',ve:'',ds:'',js:''},habsExtra:{ep:{tip:'',desde:'',hasta:''},dp:{tip:'',desde:'',hasta:''}}},
  aesa:{id:'',nombre:'',apell:'',cat:'A1/A3',op:'',emision:'',exp:''},
  ss:{nombre:'',apell:'',dni:'',naf:''},
  banco:{nombre:'',apell:'',dni:'',iban:'',bic:'',banco:''},
  acred:[],
  cursos:[],
  perfil:{nombre:'',apell:'',nac:'',tel:'',emerg:'',sangre:'',altura:'',peso:'',alergias:'',meds:'',enfermedades:''},
  photos:{},pin:'',bioEnabled:false,gyro:false,theme:'dark',notifEnabled:false,notifDays:[30,60,90],
  empresas:[],pdfLibrary:[],
};
// ══════════════════════════════════════════════════════════════
// STORAGE — Plugin nativo NativeStorage → Android/data/.../files/SegurApp/datos.json
// + localStorage como backup instantáneo
// ══════════════════════════════════════════════════════════════
const DB_KEY = 'segurapp8';

function getNativeStorage() {
  return (window.Capacitor &&
          window.Capacitor.Plugins &&
          window.Capacitor.Plugins.NativeStorage)
    ? window.Capacitor.Plugins.NativeStorage : null;
}

function applyLoadedData(l) {
  Object.assign(state, l);
  if(!state.photos)     state.photos={};
  if(!state.acred)      state.acred=[];
  if(!state.cursos)     state.cursos=[];
  if(!state.empresas)   state.empresas=[];
  if(!state.pdfLibrary) state.pdfLibrary=[];
  if(!state.ss)    state.ss={nombre:'',apell:'',dni:'',naf:''};
  if(!state.banco) state.banco={nombre:'',apell:'',dni:'',iban:'',bic:'',banco:''};
  if(!state.perfil.enfermedades) state.perfil.enfermedades='';
  if(!state.tip.habsExtra) state.tip.habsExtra={ep:{tip:'',desde:'',hasta:''},dp:{tip:'',desde:'',hasta:''}};
  state.cursos.forEach(c=>{if(!c.reciclajes)c.reciclajes=[];});
}

// ── GUARDAR ───────────────────────────────────────────────────
function saveState() {
  const data = JSON.stringify(state);
  // localStorage siempre
  try { localStorage.setItem(DB_KEY, data); } catch(e) {
    try { localStorage.setItem(DB_KEY, JSON.stringify({...state,photos:{}})); } catch(e2) {}
  }
  // window.Droid — JavascriptInterface síncrono, escribe en SharedPreferences inmediatamente
  if (window.Droid) {
    try { window.Droid.save(data); } catch(e) {}
  }
  // Plugin Capacitor backup
  const ns = getNativeStorage();
  if (ns) ns.save({ data }).catch(() => {});
}

// ── CARGAR ────────────────────────────────────────────────────
function loadState() {
  // Carga inmediata desde localStorage
  try {
    const s = localStorage.getItem(DB_KEY);
    if (s) applyLoadedData(JSON.parse(s));
  } catch(e) {}
}

async function loadStateNative() {
  // window.Droid — JavascriptInterface síncrono
  if (window.Droid) {
    try {
      const data = window.Droid.load();
      if (data && data.length > 10) {
        applyLoadedData(JSON.parse(data));
        try { localStorage.setItem(DB_KEY, data); } catch(e) {}
        return;
      }
    } catch(e) {}
  }
  // Plugin Capacitor fallback
  const ns = getNativeStorage();
  if (!ns) return;
  try {
    const result = await ns.load();
    if (result && result.data && result.data.length > 10) {
      applyLoadedData(JSON.parse(result.data));
      try { localStorage.setItem(DB_KEY, result.data); } catch(e) {}
    }
  } catch(e) {}
}

// ── GUARDAR EN TODOS LOS EVENTOS DE SALIDA ────────────────────
function setupExitSave() {
  const saveNow = () => {
    const data = JSON.stringify(state);
    try { localStorage.setItem(DB_KEY, data); } catch(e) {}
    const ns = getNativeStorage();
    if (ns) ns.save({ data }).catch(() => {});
  };
  // Página se descarga
  window.addEventListener('beforeunload', saveNow);
  // App pasa a segundo plano o la matan desde gestor de tareas
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveNow();
  });
  // Eventos específicos de Capacitor/Android
  if (window.Capacitor) {
    document.addEventListener('pause',  saveNow); // app a segundo plano
    document.addEventListener('resign', saveNow); // iOS equivalente
    document.addEventListener('destroy', saveNow); // app destruida
  }
}

function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
}

// ── PIN LOCK ────────────────────────────────────────────────────
let lockEntry='';
function initLock(){if(state.pin){document.getElementById('lock-screen').style.display='flex';updateLockDots();}}
function lPinKey(d){if(lockEntry.length>=4)return;lockEntry+=d;updateLockDots();if(lockEntry.length===4)setTimeout(checkLock,80);}
function lPinBackspace(){lockEntry=lockEntry.slice(0,-1);updateLockDots();document.getElementById('pin-error').textContent='';}
function updateLockDots(){
  for(let i=0;i<4;i++){
    const d=document.getElementById('ld'+i);if(!d)continue;
    d.style.background=i<lockEntry.length?'var(--pri)':'';
    d.style.borderColor=i<lockEntry.length?'var(--pri)':'var(--t3)';
    d.style.boxShadow=i<lockEntry.length?'0 0 10px var(--pri)':'';
  }
}
function checkLock(){
  if(lockEntry===state.pin){
    const ls=document.getElementById('lock-screen');
    ls.style.transition='opacity .3s,transform .3s';ls.style.opacity='0';ls.style.transform='scale(1.04)';
    setTimeout(()=>ls.style.display='none',320);renderAll();
  }else{
    document.getElementById('pin-error').textContent='PIN incorrecto';
    for(let i=0;i<4;i++){const d=document.getElementById('ld'+i);if(d){d.style.background='var(--err)';d.style.borderColor='var(--err)';}}
    setTimeout(()=>{lockEntry='';updateLockDots();document.getElementById('pin-error').textContent='';},500);
  }
}
function bioUnlock(){
  if(!state.pin||!state.bioEnabled)return;
  const ls=document.getElementById('lock-screen');
  ls.style.opacity='0';ls.style.transform='scale(1.04)';
  setTimeout(()=>{ls.style.display='none';renderAll();},320);
}
function handlePinToggle(checked){
  if(checked){document.getElementById('pin-config-area').style.display='block';}
  else{state.pin='';saveState();document.getElementById('pin-config-area').style.display='none';showToast('🔓 PIN desactivado');}
}
function savePin(){
  const o=document.getElementById('pin-old').value,n=document.getElementById('pin-new').value,c=document.getElementById('pin-confirm').value;
  if(state.pin&&o!==state.pin){showToast('❌ PIN actual incorrecto');return;}
  if(!n||n.length!==4||!/^\d+$/.test(n)){showToast('❌ PIN debe tener 4 dígitos');return;}
  if(n!==c){showToast('❌ Los PINs no coinciden');return;}
  state.pin=n;saveState();showToast('✅ PIN guardado');document.getElementById('pin-config-area').style.display='none';
}
function handleBioToggle(checked){state.bioEnabled=checked;saveState();showToast(checked?'👆 Biometría activada':'Biometría desactivada');}

// ── NOTIFICATIONS ───────────────────────────────────────────────
function handleNotifToggle(checked){
  if(checked){
    if(!('Notification'in window)){showToast('⚠️ No soportado');document.getElementById('notif-toggle').checked=false;return;}
    Notification.requestPermission().then(p=>{
      if(p==='granted'){state.notifEnabled=true;saveState();document.getElementById('notif-days-area').style.display='block';showToast('🔔 Notificaciones activadas');}
      else{document.getElementById('notif-toggle').checked=false;showToast('⚠️ Permiso denegado');}
    });
  }else{state.notifEnabled=false;saveState();document.getElementById('notif-days-area').style.display='none';showToast('Notificaciones desactivadas');}
}
function saveNotifDays(){state.notifDays=[];[30,60,90].forEach(d=>{if(document.getElementById('notif-'+d)?.checked)state.notifDays.push(d);});saveState();}
function scheduleExpiryChecks(){
  if(!state.notifEnabled||Notification.permission!=='granted')return;
  const today=new Date();
  const parse=s=>{if(!s)return null;const p=s.split('/');return p.length===3?new Date(+p[2],+p[1]-1,+p[0]):null;};
  [{name:'DNI',exp:state.dni.exp},{name:'AESA',exp:state.aesa.exp}].forEach(d=>{
    const dt=parse(d.exp);if(!dt)return;
    const days=Math.ceil((dt-today)/86400000);
    if(state.notifDays.includes(days))new Notification('⚠️ Documento por expirar',{body:`Tu ${d.name} expira en ${days} días`,icon:'/icons/icon-192.png',tag:'expiry-'+d.name});
  });
}

// ── EXPIRY WIDGET ────────────────────────────────────────────────
function checkExpiry(){
  const today=new Date();
  const parse=s=>{if(!s)return null;const p=s.split('/');return p.length===3?new Date(+p[2],+p[1]-1,+p[0]):null;};
  const items=[];
  [{name:'DNI',exp:state.dni.exp},{name:'AESA',exp:state.aesa.exp}].forEach(d=>{
    const dt=parse(d.exp);if(!dt)return;
    const days=Math.ceil((dt-today)/86400000);
    if(days<90)items.push({name:d.name,days});
  });
  state.acred.forEach(a=>{
    const dt=parse(a.hasta?'01/'+a.hasta:'');if(!dt)return;
    const days=Math.ceil((dt-today)/86400000);
    if(days<90&&days>0)items.push({name:a.nombre,days});
  });
  const w=document.getElementById('expiry-widget');
  if(items.length){
    w.style.display='block';
    document.getElementById('expiry-items').innerHTML=items.map(it=>`
      <div class="expiry-item"><span style="font-size:12px;color:var(--t2);">${it.name}</span>
      <span class="expiry-days ${it.days<30?'ed-crit':it.days<60?'ed-warn':'ed-ok'}">${it.days>0?it.days+' días':'Expirado ⚠️'}</span></div>`).join('');
    const ni=document.getElementById('ni-wallet');
    if(!ni.querySelector('.ni-dot'))ni.insertAdjacentHTML('beforeend','<div class="ni-dot"></div>');
  }else w.style.display='none';
  scheduleExpiryChecks();
}

// ── GYROSCOPE ────────────────────────────────────────────────────
let gyroActive=false;
function toggleGyro(){
  gyroActive=!gyroActive;state.gyro=gyroActive;saveState();
  document.getElementById('gyro-label').textContent=gyroActive?'Desactivar giroscopio':'Activar giroscopio';
  gyroActive?startGyro():stopGyro();showToast(gyroActive?'📱 Giroscopio activado':'Giroscopio desactivado');
}
function startGyro(){
  const go=()=>window.addEventListener('deviceorientation',handleGyro);
  if(typeof DeviceOrientationEvent?.requestPermission==='function'){DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')go();});}else go();
}
function stopGyro(){
  window.removeEventListener('deviceorientation',handleGyro);
  ['dni-holo','tip-holo','aesa-holo'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.transform='';});
}
function handleGyro(e){
  const rx=Math.min(Math.max(-e.beta,-20),20)/20*5,ry=Math.min(Math.max(e.gamma,-20),20)/20*5;
  ['dni-holo','tip-holo','aesa-holo'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.transition='transform .05s';el.style.transform=`perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;}
  });
}

// ── NAVIGATION ───────────────────────────────────────────────────
let cur='wallet';
function nav(id){
  // Block navigation if no name set
  if (!state.perfil?.nombre || !state.perfil?.apell) { showOnboarding(); return; }
  const p=document.getElementById('s-'+cur),n=document.getElementById('s-'+id);
  if(!n||cur===id)return;
  p.classList.remove('active');p.classList.add('out-left');
  setTimeout(()=>p.classList.remove('out-left'),280);
  n.classList.add('active');n.scrollTop=0;cur=id;
}
function showSheet(id){
  // Only block if truly no name (not settings sheet which is always accessible)
  if (id !== 'settings' && id !== 'app-info' && (!state.perfil?.nombre || !state.perfil?.apell)) {
    showOnboarding(); return;
  }
  document.getElementById('overlay').classList.add('on');
  document.getElementById('sheet-'+id).classList.add('on');
}
function closeSheet(){document.getElementById('overlay').classList.remove('on');document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('on'));}
function openCursoForm(){closeSheet();setTimeout(()=>showSheet('curso-form'),200);}
function toggleSection(bodyId,chevId){
  const b=document.getElementById(bodyId),c=document.getElementById(chevId);
  if(b.style.display==='none'){b.style.display='block';c.style.transform='';}
  else{b.style.display='none';c.style.transform='rotate(-90deg)';}
}

// ── VIEWER & PHOTO ───────────────────────────────────────────────
function openViewer(src,title){if(!src)return;document.getElementById('iv-img').src=src;document.getElementById('iv-title').textContent=title||'';document.getElementById('img-viewer').classList.add('on');}
function closeViewer(){document.getElementById('img-viewer').classList.remove('on');}
function triggerPhoto(id){document.getElementById(id).click();}
function photoTap(key,label){
  const b64=state.photos[key];
  if(b64){openViewer(b64,label);return;}
  const m={'dni-front':'inp-dni-front','dni-back':'inp-dni-back','tip-front':'inp-tip-front','tip-back':'inp-tip-back','tip-face':'inp-tip-face','aesa-qr':'inp-aesa-qr-c','aesa-cert':'inp-aesa-cert','banco-cert':'inp-banco-cert','ss-doc':'inp-ss-doc'};
  if(m[key])document.getElementById(m[key]).click();
}
function facePhotoTap(){if(state.photos['tip-face'])openViewer(state.photos['tip-face'],'Foto perfil');else document.getElementById('inp-tip-face').click();}

const AI_KEYS=['dni-front','tip-front','aesa-cert'];
function handlePhoto(inp,key){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    const b64=e.target.result;
    if(AI_KEYS.includes(key)){
      document.getElementById('ai-overlay').classList.add('on');
      setTimeout(()=>{document.getElementById('ai-overlay').classList.remove('on');state.photos[key]=b64;saveState();applyPhoto(key,b64);},1500);
    }else{state.photos[key]=b64;saveState();applyPhoto(key,b64);}
  };r.readAsDataURL(f);inp.value='';
}
function applyPhoto(key,b64){
  const safe=b64.replace(/'/g,"\\'");
  const map={'dni-front':{p:'prev-dni-front',ph:'ph-dni-front'},'dni-back':{p:'prev-dni-back',ph:'ph-dni-back'},'tip-front':{p:'prev-tip-front',ph:'ph-tip-front'},'tip-back':{p:'prev-tip-back',ph:'ph-tip-back'},'aesa-cert':{p:'prev-aesa-cert',ph:'ph-aesa-cert'},'banco-cert':{p:'prev-banco-cert',ph:'ph-banco-cert'},'ss-doc':{p:'prev-ss-doc',ph:'ph-ss-doc'}};
  if(map[key]){
    const m=map[key],p=document.getElementById(m.p);
    p.innerHTML=`<img src="${b64}" style="width:100%;border-radius:10px;" onclick="event.stopPropagation();openViewer('${safe}','${key}')">`;
    p.style.display='block';document.getElementById(m.ph).style.display='none';
  }else if(key==='tip-face'){
    const p=document.getElementById('prev-tip-face');
    p.innerHTML=`<img src="${b64}" style="width:100%;height:100%;object-fit:cover;" onclick="event.stopPropagation();openViewer('${safe}','Foto')">`;
    p.style.display='block';document.getElementById('ph-tip-face').style.display='none';
  }else if(key==='dni-face'){
    document.getElementById('dni-face-img').src=b64;document.getElementById('dni-face-row').style.display='flex';
  }else if(key==='aesa-qr'){
    const p=document.getElementById('prev-aesa-qr');
    p.innerHTML=`<img src="${b64}" style="width:100%;height:100%;object-fit:contain;">`;p.style.display='flex';
    document.getElementById('ph-aesa-qr').style.display='none';
    document.getElementById('aesa-qr-status').className='qr-ok';document.getElementById('aesa-qr-status').innerHTML='✅ QR añadido';
    document.getElementById('aesa-qr-img').onclick=()=>openViewer(b64,'QR AESA');
  }else if(key.startsWith('diploma-')){
    const cid=key.replace('diploma-','');
    const body=document.getElementById('diploma-body');
    if(body){body.innerHTML=`<img src="${b64}" style="width:100%;border-radius:8px;" onclick="openViewer('${safe}','Diploma')">`;body.onclick=null;}
    const c=state.cursos.find(x=>x.id===cid);if(c){c.diploma=b64;saveState();renderCursos();}
  }
}
function loadAllPhotos(){Object.entries(state.photos).forEach(([k,v])=>applyPhoto(k,v));}

// ── OCR ──────────────────────────────────────────────────────────
let ocrContext='',ocrImageB64='';
function startOCR(ctx){ocrContext=ctx;document.getElementById('inp-ocr').click();}
function openDiplomaOCR(){ocrContext='diploma-'+activeCursoId;document.getElementById('inp-ocr').click();}
function handleOCRFile(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    ocrImageB64=e.target.result;
    document.getElementById('ocr-img').src=ocrImageB64;
    document.getElementById('ocr-overlay').classList.add('on');
    document.getElementById('ocr-bar').style.width='0%';
    document.getElementById('ocr-pct').textContent='Iniciando…';
    document.getElementById('ocr-fields').innerHTML='';
    runTesseract(ocrImageB64);
  };r.readAsDataURL(f);inp.value='';
}
async function runTesseract(img){
  try{
    const result=await Tesseract.recognize(img,'spa+eng',{logger:m=>{if(m.status==='recognizing text'){const p=Math.round(m.progress*100);document.getElementById('ocr-bar').style.width=p+'%';document.getElementById('ocr-pct').textContent='Reconociendo… '+p+'%';}}});
    document.getElementById('ocr-pct').textContent='✅ OCR completado';renderOCRFields(result.data.text);
  }catch(e){document.getElementById('ocr-pct').textContent='⚠️ Error — Completa manualmente';renderOCRFields('');}
}
const extr=(text,pats)=>{for(const p of pats){const m=text.match(p);if(m&&m[1])return m[1].trim();}return '';};
function renderOCRFields(text){
  let fields=[];
  if(ocrContext==='dni'){fields=[{key:'num',label:'Número DNI',val:extr(text,[/(\d{8}[A-Z])/,/DNI[\s:]+([A-Z0-9]+)/i])},{key:'nombre',label:'Nombre',val:extr(text,[/NOMBRE[\s:]+([A-ZÁÉÍÓÚÑ\s]+)/i])},{key:'apell',label:'Apellidos',val:extr(text,[/APELLIDOS?[\s:]+([A-ZÁÉÍÓÚÑ\s]+)/i])},{key:'nac',label:'Fecha nacimiento',val:extr(text,[/(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/])}];}
  else if(ocrContext.startsWith('diploma')){fields=[{key:'code',label:'Código SEAD',val:extr(text,[/(SEAD[\w]+PO)/i])},{key:'nombre',label:'Nombre curso',val:extr(text,[/CURSO[\s:DE]+([A-ZÁÉÍÓÚÑ\s]+)/i])},{key:'entidad',label:'Entidad',val:extr(text,[/(SEPE|FUNDAE|FOREM|ISEED)/i])},{key:'horas',label:'Horas',val:extr(text,[/(\d+)\s*HORAS?/i])},{key:'fecha',label:'Fecha',val:extr(text,[/(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/])}];}
  else{fields=[{key:'texto',label:'Texto reconocido',val:text.slice(0,200)}];}
  document.getElementById('ocr-fields').innerHTML=fields.map(f=>`<div class="ocr-field"><label class="ocr-field-lbl">${f.label}</label><input class="ocr-field-inp" id="ocrf-${f.key}" value="${(f.val||'').replace(/"/g,'&quot;').substring(0,80)}" placeholder="—"></div>`).join('');
}
const getOCRF=id=>{const el=document.getElementById('ocrf-'+id);return el?el.value.trim():'';}
function applyOCRData(){
  if(ocrContext==='dni'){
    if(getOCRF('num'))state.dni.num=getOCRF('num');if(getOCRF('nombre'))state.dni.nombre=getOCRF('nombre');
    if(getOCRF('apell'))state.dni.apell=getOCRF('apell');if(getOCRF('nac'))state.dni.nac=getOCRF('nac');
    state.photos['dni-front']=ocrImageB64;saveState();renderDNI();applyPhoto('dni-front',ocrImageB64);
    closeOCR();cancelEdit('dni');showToast('✅ Datos del DNI actualizados');
  }else if(ocrContext.startsWith('diploma-')){
    const cid=ocrContext.replace('diploma-','');
    if(cid==='new'){state.cursos.push({id:'c'+Date.now(),code:getOCRF('code'),name:getOCRF('nombre')||'Nuevo curso',entidad:getOCRF('entidad'),fecha:getOCRF('fecha'),horas:getOCRF('horas'),diploma:ocrImageB64,reciclajes:[]});saveState();renderCursos();}
    else{const c=state.cursos.find(x=>x.id===cid);if(c){if(getOCRF('code'))c.code=getOCRF('code');if(getOCRF('nombre'))c.name=getOCRF('nombre');if(getOCRF('entidad'))c.entidad=getOCRF('entidad');if(getOCRF('horas'))c.horas=getOCRF('horas');if(getOCRF('fecha'))c.fecha=getOCRF('fecha');c.diploma=ocrImageB64;saveState();renderCursos();openCursoDetail(cid);}}
    closeOCR();showToast('✅ Diploma añadido con OCR');
  }else closeOCR();
}
function closeOCR(){document.getElementById('ocr-overlay').classList.remove('on');}

// ── ACREDITACIONES (Google Wallet carousel) ─────────────────────
let acredColor='blue',editingAcredId=null,acredImgB64='',currentAcredId=null,acredCodeType='barcode';
function selectAcredColor(color){
  acredColor=color;
  document.querySelectorAll('.acred-color-opt').forEach(el=>{el.style.border=el.dataset.color===color?'2px solid white':'2px solid var(--b)';});
}
function openAcredDetail(id){
  currentAcredId=id;const a=state.acred.find(x=>x.id===id);if(!a)return;
  document.getElementById('acred-detail-title').textContent=a.nombre;
  const col=ACRED_COLORS[a.color]||ACRED_COLORS.blue;const safe=a.img?a.img.replace(/'/g,"\\'"):'';
  const card=document.getElementById('acred-detail-card-holo');
  card.className='acred-detail-card acred-holo';card.style.background=col.bg;
  card.innerHTML=`
    <div class="acred-stripe"></div>
    <div class="acred-card-decor" style="background:${col.decor}"></div>
    <div style="position:relative;z-index:2;">
      <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--t2);text-transform:uppercase;margin-bottom:6px;">${a.org||'Acreditación temporal'}</div>
      <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--t1);">${a.nombre}</div>
      <div style="font-size:13px;color:var(--t2);margin-top:3px;">${a.titular||''}</div>
    </div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between;position:relative;z-index:2;">
      <div class="acred-code-img" style="width:64px;height:64px;">${a.img?`<img src="${a.img}" onclick="openViewer('${safe}','${a.nombre}')" style="width:100%;height:100%;object-fit:contain;">`:`<span style="font-size:28px;color:var(--t3)">🪪</span>`}</div>
      <div style="text-align:right;">${a.codigo?`<div style="font-size:8px;color:var(--t3);">CÓDIGO</div><div style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:${col.accent};">${a.codigo}</div>`:''} ${a.hasta?`<div style="font-size:8px;color:var(--t3);margin-top:4px;">EXPIRA</div><div style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:${col.accent};">${a.hasta}</div>`:''}</div>
    </div>`;
  document.getElementById('acred-detail-data').innerHTML=`
    <div class="data-title">Detalles</div>
    <div class="field"><span class="field-ico">🏢</span><div><div class="field-lbl">Organización</div><div class="field-val">${a.org||'—'}</div></div></div>
    <div class="field"><span class="field-ico">👤</span><div><div class="field-lbl">Titular</div><div class="field-val">${a.titular||'—'}</div></div></div>
    <div class="field"><span class="field-ico">🔢</span><div><div class="field-lbl">Código</div><div class="field-val t-mono">${a.codigo||'—'}</div></div></div>
    <div class="field"><span class="field-ico">📅</span><div><div class="field-lbl">Válida desde</div><div class="field-val t-mono">${a.desde||'—'}</div></div></div>
    <div class="field"><span class="field-ico">⏱️</span><div><div class="field-lbl">Válida hasta</div><div class="field-val t-mono">${a.hasta||'—'}</div></div></div>`;
  nav('acred-detail');
}
async function shareAcredPDF(){
  const a=state.acred.find(x=>x.id===currentAcredId);if(!a)return;
  showToast('📄 Generando PDF…');
  const lines=[`Acreditación: ${a.nombre}`,`Organización: ${a.org||'—'}`,`Titular: ${a.titular||'—'}`,`Código: ${a.codigo||'—'}`,`Válida desde: ${a.desde||'—'}`,`Válida hasta: ${a.hasta||'—'}`];
  const blob=await generatePDFBlob('ACREDITACIÓN',lines,'acred-detail-card-holo');
  await shareBlob(blob,`segurapp-acred-${Date.now()}.pdf`);
}

// ── PDF & SHARE ──────────────────────────────────────────────────
let presentDocType='';
function shareDocPDF(doc){presentDocType=doc;presentDoc(doc);setTimeout(()=>sharePresentDoc(),200);}
async function generatePDFBlob(title,lines,cardId){
  try{
    const {jsPDF}=window.jspdf,pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}),w=pdf.internal.pageSize.getWidth();
    pdf.setFillColor(5,8,15);pdf.rect(0,0,w,297,'F');
    pdf.setFont('helvetica','bold');pdf.setTextColor(240,246,255);pdf.setFontSize(12);pdf.text('SEGURAPP — '+title.toUpperCase(),w/2,14,{align:'center'});
    pdf.setTextColor(139,165,196);pdf.setFontSize(8);pdf.text('Generado el '+new Date().toLocaleDateString('es-ES'),w/2,19,{align:'center'});
    let y=30;
    if(cardId){try{const canvas=await html2canvas(document.getElementById(cardId),{backgroundColor:'#000',scale:2,useCORS:true,logging:false});const imgData=canvas.toDataURL('image/png');const margin=15,imgW=w-margin*2,imgH=(canvas.height/canvas.width)*imgW;pdf.addImage(imgData,'PNG',margin,28,imgW,imgH);y=32+imgH+8;}catch(e){}}
    pdf.setTextColor(240,246,255);pdf.setFontSize(10);lines.forEach((l,i)=>pdf.text(l,15,y+i*7));
    pdf.setTextColor(61,84,112);pdf.setFontSize(7);pdf.text('SegurApp · Documento generado localmente · No es un documento oficial',w/2,290,{align:'center'});
    return pdf.output('blob');
  }catch(e){showToast('⚠️ Error generando PDF');return null;}
}
async function shareBlob(blob,filename){
  if(!blob)return;
  try{
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[new File([blob],'x.pdf',{type:'application/pdf'})]})){
      await navigator.share({title:'SegurApp — Documento',text:'Documento generado con SegurApp',files:[new File([blob],filename,{type:'application/pdf'})]});
    }else{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);showToast('📥 PDF descargado');}
  }catch(e){if(e.name!=='AbortError'){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);showToast('📥 PDF descargado');}}
}
async function sharePresentDoc(){
  showToast('📄 Generando PDF…');
  const d=presentDocType==='dni'?state.dni:presentDocType==='tip'?state.tip:state.aesa;
  let lines=[];
  if(presentDocType==='dni')lines=[`Nombre: ${d.nombre} ${d.apell}`,`DNI: ${d.num}`,`Nacimiento: ${d.nac}`,`Expiración: ${d.exp}`,`Nacionalidad: ${d.nac2}`,`Domicilio: ${d.dom}`];
  else if(presentDocType==='tip'){const habs=d.habs||{};lines=[`Nombre: ${d.nombre} ${d.apell}`,...HAB_ROLES.filter(r=>habs[r.key]).map(r=>`${r.label}: TIP ${habs[r.key]}`)];}
  else lines=[`Titular: ${d.nombre} ${d.apell}`,`Licencia: ${d.id}`,`Categoría: ${d.cat}`,`Expiración: ${d.exp}`];
  const blob=await generatePDFBlob(presentDocType.toUpperCase(),lines,'present-card');
  await shareBlob(blob,`segurapp-${presentDocType}-${Date.now()}.pdf`);
}
async function generateSSPDF(){showToast('📄 Generando…');const d=state.ss;const blob=await generatePDFBlob('SEGURIDAD SOCIAL',[`Nombre: ${d.nombre||'—'} ${d.apell||'—'}`,`DNI: ${d.dni||'—'}`,`NAF: ${d.naf||'—'}`],null);await shareBlob(blob,`segurapp-ss-${Date.now()}.pdf`);}
async function generateBancoPDF(){showToast('📄 Generando…');const d=state.banco;const blob=await generatePDFBlob('DATOS BANCARIOS',[`Titular: ${d.nombre||'—'} ${d.apell||'—'}`,`DNI: ${d.dni||'—'}`,`IBAN: ${d.iban||'—'}`,`BIC/SWIFT: ${d.bic||'—'}`,`Banco: ${d.banco||'—'}`],null);await shareBlob(blob,`segurapp-banco-${Date.now()}.pdf`);}

function closeCVOverlay(){document.getElementById('cv-overlay').classList.remove('on');}
async function exportCVPDF(){
  showToast('📄 Generando informe PDF…');
  try{
    const {jsPDF}=window.jspdf,pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}),w=pdf.internal.pageSize.getWidth(),p=state.perfil;
    let y=20;
    const addLine=(text,size=10,color=[240,246,255],bold=false)=>{pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);pdf.setTextColor(...color);if(y>270){pdf.addPage();pdf.setFillColor(5,8,15);pdf.rect(0,0,w,297,'F');y=20;}pdf.text(String(text),15,y);y+=size*0.5+3;};
    pdf.setFillColor(5,8,15);pdf.rect(0,0,w,297,'F');
    pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.setTextColor(240,246,255);pdf.text(`${p.nombre} ${p.apell}`,w/2,y,{align:'center'});y+=8;
    pdf.setFontSize(10);pdf.setTextColor(16,185,129);pdf.text('Vigilante de Seguridad Privada · Grupo Eulen',w/2,y,{align:'center'});y+=6;
    pdf.setFontSize(8);pdf.setTextColor(139,165,196);pdf.text('Informe generado el '+new Date().toLocaleDateString('es-ES')+' · SegurApp',w/2,y,{align:'center'});y+=10;
    // Docs profesionales
    y+=2;pdf.setFillColor(15,24,40);pdf.rect(0,y-5,w,10,'F');addLine('DOCUMENTOS PROFESIONALES',11,[79,142,247],true);y+=2;
    const d=state.dni,tip=state.tip,habs=tip.habs||{};
    if(d.num)addLine(`DNI: ${d.num}  |  Nacimiento: ${d.nac}  |  Expira: ${d.exp||'—'}`,9);
    HAB_ROLES.filter(r=>habs[r.key]).forEach(r=>addLine(`TIP ${r.label}: ${habs[r.key]}`,9,[139,165,196]));
    if(state.aesa.id)addLine(`AESA Drones ${state.aesa.cat}: ${state.aesa.id}  |  Expira: ${state.aesa.exp||'—'}`,9);
    // Cursos
    y+=2;pdf.setFillColor(15,24,40);pdf.rect(0,y-5,w,10,'F');addLine('FORMACIÓN Y CURSOS',11,[79,142,247],true);y+=2;
    const sortedC=[...state.cursos].sort((a,b)=>{if(a.fecha&&b.fecha)return b.fecha.localeCompare(a.fecha);if(a.fecha)return -1;if(b.fecha)return 1;return 0;});
    sortedC.forEach(c=>{addLine(`${c.code}  ${c.name}`,9,[240,246,255],true);addLine(`  ${c.entidad||''}${c.horas?' · '+c.horas+'h':''}${c.fecha?' · '+c.fecha:''}${c.reciclajes?.length?' · ⭐ Reciclado x'+c.reciclajes.length:''}`,8,[139,165,196]);});
    // SS y Banco
    if(state.ss.naf||state.banco.iban){y+=2;pdf.setFillColor(15,24,40);pdf.rect(0,y-5,w,10,'F');addLine('DATOS PERSONALES',11,[79,142,247],true);y+=2;if(state.ss.naf)addLine(`SS NAF: ${state.ss.naf}  |  DNI: ${state.ss.dni||'—'}`,9);if(state.banco.iban)addLine(`IBAN: ${state.banco.iban}  |  ${state.banco.banco||'—'}  |  BIC: ${state.banco.bic||'—'}`,9);}
    // Acreditaciones
    if(state.acred.length){y+=2;pdf.setFillColor(15,24,40);pdf.rect(0,y-5,w,10,'F');addLine('ACREDITACIONES TEMPORALES',11,[79,142,247],true);y+=2;state.acred.forEach(a=>addLine(`${a.nombre}  ${a.org?'· '+a.org:''}${a.codigo?' · Cód: '+a.codigo:''}${a.hasta?' · Hasta: '+a.hasta:''}`,9));}
    pdf.setFontSize(7);pdf.setTextColor(61,84,112);pdf.text('SegurApp · Informe profesional generado localmente',w/2,290,{align:'center'});
    const blob=pdf.output('blob');await shareBlob(blob,`segurapp-informe-${p.apell}-${Date.now()}.pdf`);
  }catch(e){showToast('⚠️ Error: '+e.message);}
}
async function shareCV(){await exportCVPDF();}

function closePresent(){document.getElementById('present-mode').classList.remove('on');}

// ── CLIPBOARD ────────────────────────────────────────────────────
function copyText(text,msg){
  if(!text){showToast('⚠️ Sin datos');return;}
  navigator.clipboard.writeText(text).then(()=>showToast('📋 '+msg)).catch(()=>{const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a);showToast('📋 '+msg);});
}

// ── DNI ───────────────────────────────────────────────────────────
function editDoc(doc){
  if(doc==='dni'){
    if(state.dni.nfcVerified){showToast('🔒 Datos NFC — no editables');return;}
    const d=state.dni;['num','nombre','apell','nac','exp','sexo','nac2','lugar','dom'].forEach(k=>{const el=document.getElementById('i-dni-'+k);if(el)el.value=d[k]||'';});
    document.getElementById('dni-view').style.display='none';document.getElementById('dni-form').style.display='block';
  }else if(doc==='tip'){
    const d=state.tip;document.getElementById('i-tip-nombre').value=d.nombre||'';document.getElementById('i-tip-apell').value=d.apell||'';renderHabEditList();
    document.getElementById('tip-view').style.display='none';document.getElementById('tip-form').style.display='block';
  }else if(doc==='aesa'){
    const d=state.aesa;['id','nombre','apell','cat','op','emision','exp'].forEach(k=>{const el=document.getElementById('i-aesa-'+k);if(el)el.value=d[k]||'';});
    document.getElementById('aesa-view').style.display='none';document.getElementById('aesa-form').style.display='block';
  }else if(doc==='ss'){
    document.getElementById('ss-view').style.display='none';document.getElementById('ss-form').style.display='block';
    ['nombre','apell','dni','naf'].forEach(k=>{const el=document.getElementById('i-ss-'+k);if(el)el.value=state.ss[k]||'';});
  }else if(doc==='banco'){
    document.getElementById('banco-view').style.display='none';document.getElementById('banco-form').style.display='block';
    ['nombre','apell','dni','iban','bic','banco'].forEach(k=>{const el=document.getElementById('i-banco-'+k);if(el)el.value=state.banco[k]||'';});
  }
}
function cancelEdit(doc){document.getElementById(doc+'-view').style.display='block';document.getElementById(doc+'-form').style.display='none';}
function cancelEditDoc(doc){document.getElementById(doc+'-view').style.display='block';document.getElementById(doc+'-form').style.display='none';}
function saveDNI(){
  const d=state.dni;['num','nombre','apell','nac','exp','sexo','nac2','lugar','dom'].forEach(k=>{const el=document.getElementById('i-dni-'+k);if(el)d[k]=el.value;});
  saveState();renderDNI();cancelEdit('dni');checkExpiry();showToast('✅ DNI guardado');
}
function renderDNI(){
  const d=state.dni;
  document.getElementById('dni-name-hero').textContent=d.apell||'APELLIDOS';document.getElementById('dni-fname-hero').textContent=d.nombre||'Nombre';document.getElementById('dni-num-hero').textContent=d.num||'· · · · · · · ·';
  document.getElementById('f-dni-num').textContent=d.num||'—';document.getElementById('f-dni-nombre').textContent=(d.nombre+' '+d.apell).trim()||'—';document.getElementById('f-dni-nac').textContent=d.nac||'—';document.getElementById('f-dni-exp').textContent=d.exp||'—';document.getElementById('f-dni-nac2').textContent=d.nac2||'—';document.getElementById('f-dni-lugar').textContent=d.lugar||'—';document.getElementById('f-dni-dom').textContent=d.dom||'—';
  document.getElementById('nfc-row').style.display=d.nfcVerified?'flex':'none';
  if(d.nombre)document.getElementById('dni-wm').textContent=`${d.nombre} ${d.apell} · DNI ${d.num||'—'} · VÁLIDO`;
  if(state.photos['dni-face']){document.getElementById('dni-face-img').src=state.photos['dni-face'];document.getElementById('dni-face-row').style.display='flex';}
}
function saveAESA(){
  const d=state.aesa;['id','nombre','apell','cat','op','emision','exp'].forEach(k=>{const el=document.getElementById('i-aesa-'+k);if(el)d[k]=el.value;});
  saveState();renderAESA();cancelEdit('aesa');checkExpiry();showToast('✅ AESA guardado');
}
function renderAESA(){
  const d=state.aesa;
  document.getElementById('aesa-cat-badge').textContent='Categoría '+(d.cat||'—');document.getElementById('aesa-titular').textContent=(d.nombre+' '+d.apell).trim()||'—';document.getElementById('aesa-id-hero').textContent=(d.id||'—').slice(-10);
  document.getElementById('f-aesa-cat').textContent=d.cat||'—';document.getElementById('f-aesa-id').textContent=d.id||'—';document.getElementById('f-aesa-titular').textContent=(d.nombre+' '+d.apell).trim()||'—';document.getElementById('f-aesa-op').textContent=d.op||'—';document.getElementById('f-aesa-emision').textContent=d.emision||'—';document.getElementById('f-aesa-exp').textContent=d.exp||'—';
  if(d.nombre)document.getElementById('aesa-wm').textContent=`${d.nombre} ${d.apell} · AESA ${d.id||''} · VÁLIDO`;
}
function saveSS(){['nombre','apell','dni','naf'].forEach(k=>{const el=document.getElementById('i-ss-'+k);if(el)state.ss[k]=el.value;});saveState();renderDocs();cancelEditDoc('ss');showToast('✅ SS guardada');}
function saveBanco(){['nombre','apell','dni','iban','bic','banco'].forEach(k=>{const el=document.getElementById('i-banco-'+k);if(el)state.banco[k]=el.value;});saveState();renderDocs();cancelEditDoc('banco');showToast('✅ Banco guardado');}
function renderDocs(){
  const s=state.ss,b=state.banco;
  document.getElementById('f-ss-nombre').textContent=(s.nombre+' '+s.apell).trim()||'—';document.getElementById('f-ss-dni').textContent=s.dni||'—';document.getElementById('f-ss-naf').textContent=s.naf||'—';
  document.getElementById('f-banco-nombre').textContent=(b.nombre+' '+b.apell).trim()||'—';document.getElementById('f-banco-dni').textContent=b.dni||'—';document.getElementById('f-banco-iban').textContent=b.iban||'—';document.getElementById('f-banco-bic').textContent=b.bic||'—';document.getElementById('f-banco-banco').textContent=b.banco||'—';
  if(state.photos['banco-cert']){const p=document.getElementById('prev-banco-cert');const safe=state.photos['banco-cert'].replace(/'/g,"\\'");p.innerHTML=`<img src="${state.photos['banco-cert']}" style="width:100%;border-radius:10px;" onclick="event.stopPropagation();openViewer('${safe}','Certificado')">`;p.style.display='block';document.getElementById('ph-banco-cert').style.display='none';}
}

function delCurso(id){if(!confirm('¿Eliminar?'))return;state.cursos=state.cursos.filter(c=>c.id!==id);saveState();renderCursos();}
function saveCurso(){
  const n=document.getElementById('i-c-nombre').value.trim();if(!n){showToast('❌ Nombre obligatorio');return;}
  state.cursos.push({id:'c'+Date.now(),code:document.getElementById('i-c-code').value.trim(),name:n,entidad:document.getElementById('i-c-entidad').value.trim(),fecha:document.getElementById('i-c-fecha').value.trim(),horas:document.getElementById('i-c-horas').value.trim(),diploma:null,reciclajes:[]});
  saveState();closeSheet();renderCursos();['i-c-code','i-c-nombre','i-c-entidad','i-c-fecha','i-c-horas'].forEach(id=>document.getElementById(id).value='');showToast('✅ Curso añadido');
}
function openCursoEditSheet(){
  const c=state.cursos.find(x=>x.id===activeCursoId);if(!c)return;
  document.getElementById('ie-c-code').value=c.code||'';document.getElementById('ie-c-nombre').value=c.name||'';document.getElementById('ie-c-entidad').value=c.entidad||'';document.getElementById('ie-c-fecha').value=c.fecha||'';document.getElementById('ie-c-horas').value=c.horas||'';
  showSheet('curso-edit');
}
function saveCursoEdit(){
  const c=state.cursos.find(x=>x.id===activeCursoId);if(!c)return;
  c.code=document.getElementById('ie-c-code').value.trim();c.name=document.getElementById('ie-c-nombre').value.trim();c.entidad=document.getElementById('ie-c-entidad').value.trim();c.fecha=document.getElementById('ie-c-fecha').value.trim();c.horas=document.getElementById('ie-c-horas').value.trim();
  saveState();closeSheet();openCursoDetail(activeCursoId);
}
let activeCursoId='';
function openCursoDetail(id){
  const c=state.cursos.find(x=>x.id===id); if(!c) return;
  activeCursoId=id;

  // Header
  document.getElementById('cd-title').textContent = c.code||c.name;
  document.getElementById('cd-code-badge').textContent = c.code||'';
  document.getElementById('cd-name').textContent = c.name;

  // Data fields
  document.getElementById('cd-f-code').textContent    = c.code||'—';
  document.getElementById('cd-f-name').textContent    = c.name||'—';
  document.getElementById('cd-f-entidad').textContent = c.entidad||'—';
  document.getElementById('cd-f-fecha').textContent   = c.fecha||'—';
  document.getElementById('cd-f-horas').textContent   = c.horas ? c.horas+'h' : '—';

  // Reciclaje badge
  const hasRec = c.reciclajes && c.reciclajes.length > 0;
  const rb = document.getElementById('cd-recicl-badge');
  if(rb){
    rb.style.display = hasRec ? 'inline-flex' : 'none';
    rb.style.cssText += ';background:rgba(168,85,247,.1);color:#A855F7;';
    rb.textContent = hasRec ? `⭐ Reciclado (${c.reciclajes.length})` : '';
  }

  // Diploma section
  const body = document.getElementById('diploma-body');
  const dipB64 = state.photos['diploma-'+id] || c.diploma;
  if(dipB64){
    const safe = dipB64.replace(/'/g,"\\'");
    body.innerHTML = `<img src="${dipB64}" style="width:100%;border-radius:8px;" onclick="openViewer('${safe}','Diploma')">`;
    body.onclick = null;
    // Add change/delete buttons below diploma head
    const head = document.querySelector('.diploma-head');
    if(head && !head.querySelector('.dip-change-btn')){
      const changeBtn = document.createElement('button');
      changeBtn.className='qr-btn dip-change-btn';
      changeBtn.style.cssText='width:auto;padding:4px 9px;margin-left:6px;';
      changeBtn.textContent='📷 Cambiar';
      changeBtn.onclick = ()=> document.getElementById('inp-diploma-file-'+id).click();
      const delBtn2 = document.createElement('button');
      delBtn2.className='qr-btn dip-change-btn';
      delBtn2.style.cssText='width:auto;padding:4px 9px;margin-left:4px;color:var(--err);border-color:rgba(244,63,94,.3);background:rgba(244,63,94,.08);';
      delBtn2.textContent='🗑️';
      delBtn2.onclick = ()=> deleteDiploma(id);
      head.appendChild(changeBtn);
      head.appendChild(delBtn2);
    }
  } else {
    // Remove any leftover change/delete buttons
    document.querySelectorAll('.dip-change-btn').forEach(b=>b.remove());
    body.innerHTML = `<div id="diploma-ph"><span style="font-size:26px">📜</span><span style="font-size:11px;color:var(--t3)">Toca para añadir</span></div>`;
    body.onclick = diplomaTap;
  }

  // Create diploma file inputs if not exist
  if(!document.getElementById('inp-diploma-file-'+id)){
    // Gallery/file input (image + PDF)
    const inpFile = document.createElement('input');
    inpFile.type='file'; inpFile.accept='image/*,.pdf'; inpFile.className='file-inp';
    inpFile.id='inp-diploma-file-'+id;
    inpFile.onchange = function(){ handleDiplomaFile(this, id); };
    document.body.appendChild(inpFile);
    // Camera input
    const inpCam = document.createElement('input');
    inpCam.type='file'; inpCam.accept='image/*'; inpCam.capture='environment'; inpCam.className='file-inp';
    inpCam.id='inp-diploma-cam-'+id;
    inpCam.onchange = function(){ handleDiplomaFile(this, id); };
    document.body.appendChild(inpCam);
  }

  renderReciclajes(c);
  nav('curso-detail');
}

function handleDiplomaFile(inp, id){
  const f = inp.files[0]; if(!f) return; inp.value='';
  const isPDF = f.type==='application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  // Show progress
  const aiOverlay = document.getElementById('ai-overlay');
  const aiSub = document.getElementById('ai-sub');
  const aiBar = document.getElementById('ai-progress-bar');
  const aiPct = document.getElementById('ai-percent');
  if(aiSub) aiSub.textContent = isPDF ? 'Procesando PDF…' : 'Guardando diploma…';
  if(aiBar) aiBar.style.width = '30%';
  if(aiPct) aiPct.textContent = '30%';
  if(aiOverlay) aiOverlay.classList.add('on');

  const reader = new FileReader();
  reader.onload = async e => {
    let b64 = e.target.result;
    if(isPDF && typeof pdfjsLib !== 'undefined'){
      try{
        if(aiBar) aiBar.style.width = '60%'; if(aiPct) aiPct.textContent = '60%';
        const arr = new Uint8Array(atob(b64.split(',')[1]).split('').map(c=>c.charCodeAt(0)));
        const pdf = await pdfjsLib.getDocument({data:arr}).promise;
        const page = await pdf.getPage(1);
        const vp = page.getViewport({scale:2});
        const canvas = document.createElement('canvas');
        canvas.width=vp.width; canvas.height=vp.height;
        await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
        b64 = canvas.toDataURL('image/jpeg',0.9);
      }catch(err){}
    }
    if(aiBar) aiBar.style.width = '100%'; if(aiPct) aiPct.textContent = '100%';
    setTimeout(()=>{
      if(aiOverlay) aiOverlay.classList.remove('on');
      state.photos['diploma-'+id] = b64;
      const c = state.cursos.find(x=>x.id===id);
      if(c) c.diploma = b64;
      saveState();
      renderCursos();
      openCursoDetail(id); // refresh view
      showToast('✅ Diploma guardado');
    }, 300);
  };
  reader.readAsDataURL(f);
}

function deleteDiploma(id){
  if(!confirm('¿Eliminar el diploma?')) return;
  delete state.photos['diploma-'+id];
  const c = state.cursos.find(x=>x.id===id);
  if(c) c.diploma = null;
  saveState(); renderCursos();
  openCursoDetail(id);
  showToast('🗑️ Diploma eliminado');
}
function openDiplomaInput(){ document.getElementById('inp-diploma-file-'+activeCursoId)?.click(); }
function diplomaTap(){
  const b64 = state.photos['diploma-'+activeCursoId]||(state.cursos.find(x=>x.id===activeCursoId)||{}).diploma;
  if(b64){ openViewer(b64,'Diploma'); return; }
  showSheet('add-diploma');
}

// ── RECICLAJES ────────────────────────────────────────────────────
let recFotoB64='';
function handleRecFoto(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{recFotoB64=e.target.result;const prev=document.getElementById('prev-rec-foto');prev.innerHTML=`<img src="${recFotoB64}" style="width:100%;border-radius:10px;">`;prev.style.display='block';document.getElementById('ph-rec-foto').style.display='none';};r.readAsDataURL(f);inp.value='';}
function saveReciclaje(){
  const titulo=document.getElementById('i-rec-titulo').value.trim();if(!titulo){showToast('❌ Título obligatorio');return;}
  const c=state.cursos.find(x=>x.id===activeCursoId);if(!c)return;if(!c.reciclajes)c.reciclajes=[];
  const rid='r'+Date.now();c.reciclajes.push({id:rid,titulo,fecha:document.getElementById('i-rec-fecha').value.trim(),foto:recFotoB64||null});
  if(recFotoB64)state.photos['reciclaje-'+activeCursoId+'-'+rid]=recFotoB64;
  saveState();closeSheet();renderReciclajes(c);renderCursos();
  document.getElementById('i-rec-titulo').value='';document.getElementById('i-rec-fecha').value='';
  recFotoB64='';document.getElementById('prev-rec-foto').style.display='none';document.getElementById('ph-rec-foto').style.display='flex';showToast('✅ Reciclaje añadido');
}
function renderReciclajes(c){
  const list=document.getElementById('reciclajes-list');
  if(!c.reciclajes||c.reciclajes.length===0){list.innerHTML='<div style="font-size:12px;color:var(--t3);font-style:italic;padding:3px 0;">Sin reciclajes</div>';return;}
  list.innerHTML=[...c.reciclajes].reverse().map(rec=>{
    const foto=rec.foto||state.photos['reciclaje-'+c.id+'-'+rec.id];const safe=foto?foto.replace(/'/g,"\\'"):'';
    return `<div class="reciclaje-item" ${foto?`onclick="openViewer('${safe}','Reciclaje')"`:'style="cursor:default"'}><div class="reciclaje-thumb">${foto?`<img src="${foto}" style="width:100%;height:100%;object-fit:cover;">`:'🔄'}</div><div style="flex:1;"><div style="font-size:13px;font-weight:600;">🔄 ${rec.titulo}</div>${rec.fecha?`<div style="font-size:11px;color:var(--t2);margin-top:2px;">📅 ${rec.fecha}</div>`:''}</div><button onclick="event.stopPropagation();delReciclaje('${c.id}','${rec.id}')" style="background:none;border:none;color:var(--t3);font-size:14px;cursor:pointer;padding:4px;">🗑️</button></div>`;
  }).join('');
}
function delReciclaje(cid,rid){
  if(!confirm('¿Eliminar reciclaje?'))return;const c=state.cursos.find(x=>x.id===cid);if(!c)return;
  c.reciclajes=c.reciclajes.filter(r=>r.id!==rid);delete state.photos['reciclaje-'+cid+'-'+rid];saveState();renderReciclajes(c);renderCursos();
}
// ── UTILS ─────────────────────────────────────────────────────────
function exportDocs(){
  try{
    const data={...state,exportDate:new Date().toISOString()};
    const json=JSON.stringify(data,null,2);
    const blob=new Blob([json],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;
    a.download='segurapp-backup-completo-'+new Date().toISOString().slice(0,10)+'.json';
    a.click();URL.revokeObjectURL(url);closeSheet();
    const sizeKB=Math.round(blob.size/1024);
    showToast('📤 Backup exportado ('+sizeKB+' KB, con imágenes)');
  }catch(e){
    // If too large, try without photos
    try{
      const data={...state,photos:{},exportDate:new Date().toISOString()};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='segurapp-backup-sin-fotos-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);closeSheet();
      showToast('⚠️ Exportado sin fotos (archivo demasiado grande)');
    }catch(e2){showToast('❌ Error al exportar');}
  }
}
function clearAll(){
  if(!confirm('¿Borrar todos los datos?')) return;
  localStorage.removeItem(DB_KEY);
  const ns = getNativeStorage();
  if (ns) ns.save({ data: '{}' }).catch(() => {});
  location.reload();
}

// ── PWA ───────────────────────────────────────────────────────────
let dp=null;
window.addEventListener('beforeinstallprompt_disabled',e=>{e.preventDefault();dp=e;document.getElementById('install-banner').classList.add('show');});
document.getElementById('ib-btn').addEventListener('click',()=>{if(dp){dp.prompt();dp.userChoice.then(()=>{dp=null;document.getElementById('install-banner').classList.remove('show');});}});
window.addEventListener('appinstalled',()=>document.getElementById('install-banner').classList.remove('show'));
// Service worker not used in native app

// ── THEME: dark only ──────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme','dark');
}
function toggleTheme() { /* dark only */ }

// ── NAVIGATION override: add empresas + pdf-viewer screens ────────
function switchTab(t) {
  // Block if no name set
  if (!state.perfil?.nombre || !state.perfil?.apell) { showOnboarding(); return; }
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('on'));
  const niEl = document.getElementById('ni-'+t);
  if (niEl) niEl.classList.add('on');
  const curScreen = document.getElementById('s-'+cur);
  if (curScreen) curScreen.classList.remove('active');
  const newScreen = document.getElementById('s-'+t);
  if (newScreen) { newScreen.classList.add('active'); newScreen.scrollTop = 0; }
  cur = t;
  if (t === 'cursos')   renderCursosV9();
  if (t === 'perfil')   { renderPerfilFull(); renderPDFBankSS(); }
  if (t === 'docs')     renderPDFLibrary();
  if (t === 'empresas') renderEmpresas();
  if (t === 'search')   { setTimeout(() => { const si = document.getElementById('search-overlay-input'); if(si) si.focus(); }, 300); doSearch(''); }
};

// ── SEARCH OVERLAY ────────────────────────────────────────────────
function openSearchOverlay() {
  const ov = document.getElementById('search-overlay');
  if (!ov) return;
  ov.style.cssText = 'position:fixed;inset:0;z-index:200;background:var(--bg);display:flex;flex-direction:column;';
  const inp = document.getElementById('search-overlay-input');
  if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 180); }
  const res = document.getElementById('search-overlay-results');
  if (res) res.innerHTML = '<div style="padding:30px;text-align:center;color:var(--t3);">Escribe para buscar…</div>';
}
function closeSearchOverlay() {
  const ov = document.getElementById('search-overlay');
  if (ov) ov.style.display = 'none';
}

// Override doSearch to target the overlay
function doSearch(q) {
  const res = document.getElementById('search-overlay-results')
           || document.getElementById('search-results');
  if (!res) return;
  if (!q || !q.trim()) {
    res.innerHTML = '<div style="padding:30px;text-align:center;color:var(--t3);">Escribe para buscar…</div>';
    return;
  }
  const qq = q.toLowerCase();
  const results = [];

  // Wallet docs
  [
    {icon:'🪪',title:'DNI',sub:(state.dni.num||'')+ ' '+(state.dni.nombre||'')+(state.dni.apell?' '+state.dni.apell:''),act:()=>{closeSearchOverlay();nav('dni');}},
    {icon:'🛡️',title:'TIP',sub:(state.tip.nombre||'')+' '+(state.tip.apell||''),act:()=>{closeSearchOverlay();nav('tip');}},
    {icon:'✈️',title:'AESA',sub:state.aesa.id||'',act:()=>{closeSearchOverlay();nav('aesa');}},
  ].forEach(d=>{if((d.title+d.sub).toLowerCase().includes(qq)) results.push({group:'Wallet',...d});});

  // Acreditaciones
  state.acred.forEach(a => {
    if ((a.nombre+(a.org||'')+(a.codigo||'')).toLowerCase().includes(qq))
      results.push({group:'Acreditaciones',icon:'🪪',title:a.nombre,sub:a.org||'',
        act:()=>{closeSearchOverlay();openAcredDetailV9(a.id);}});
  });

  // Cursos
  state.cursos.forEach(c => {
    if ((c.name+c.code+(c.entidad||'')).toLowerCase().includes(qq))
      results.push({group:'Cursos',icon:'🎓',title:c.code+' '+c.name,sub:c.entidad||'',
        act:()=>{closeSearchOverlay();switchTab('cursos');setTimeout(()=>openCursoDetail(c.id),300);}});
  });

  // Empresas
  (state.empresas||[]).forEach(e => {
    if ((e.nombre+(e.contacto||'')).toLowerCase().includes(qq))
      results.push({group:'Empresas',icon:'🏢',title:e.nombre,sub:e.tel||'',
        act:()=>{closeSearchOverlay();switchTab('empresas');setTimeout(()=>openEmpresaDetail(e.id),300);}});
  });

  // PDF Library
  (state.pdfLibrary||[]).forEach(d => {
    if (d.titulo.toLowerCase().includes(qq))
      results.push({group:'Documentos',icon:'📄',title:d.titulo,sub:(PDF_CATS[d.cat]||PDF_CATS.otro).label,
        act:()=>{closeSearchOverlay();switchTab('docs');setTimeout(()=>openPDFViewer(d.id),300);}});
  });

  if (!results.length) {
    res.innerHTML = '<div style="padding:30px;text-align:center;color:var(--t3);">Sin resultados</div>';
    return;
  }

  res.innerHTML = '';
  let lastGroup = '';
  results.forEach(r => {
    if (r.group !== lastGroup) {
      lastGroup = r.group;
      const h = document.createElement('div');
      h.style.cssText = 'font-size:10px;font-weight:700;color:var(--t3);letter-spacing:1px;text-transform:uppercase;padding:8px 13px 3px;';
      h.textContent = r.group;
      res.appendChild(h);
    }
    const row = document.createElement('div');
    row.className = 'search-result';
    row.innerHTML = `<div class="sr-icon" style="background:var(--pri-g)">${r.icon}</div><div><div class="sr-title">${r.title}</div><div class="sr-sub">${r.sub||''}</div></div>`;
    row.addEventListener('click', r.act);
    res.appendChild(row);
  });
};

// ── CURSOS: DOM-based render with working delete + drag ───────────
let dragSrcId = null;

function renderCursos() { renderCursosV9(); };

function renderCursosV9() {
  const el = id => document.getElementById(id);
  const n  = state.cursos.length;
  if (el('cursos-num'))       el('cursos-num').textContent       = n;
  if (el('cursos-count-lbl')) el('cursos-count-lbl').textContent = n + ' cursos realizados';
  if (el('cursos-doc-num'))   el('cursos-doc-num').textContent   = state.cursos.filter(c=>c.diploma).length;
  if (el('cursos-rec-num'))   el('cursos-rec-num').textContent   = state.cursos.filter(c=>c.reciclajes&&c.reciclajes.length>0).length;

  const list = el('cursos-list');
  if (!list) return;
  list.innerHTML = '';

  if (!state.cursos.length) {
    list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);">Sin cursos · pulsa ＋ para añadir</div>';
    return;
  }

  state.cursos.forEach((c, i) => {
    const col = CURSO_COLORS[i % CURSO_COLORS.length];
    const hasRec = c.reciclajes && c.reciclajes.length > 0;

    const wrap = document.createElement('div');
    wrap.className = 'curso';
    wrap.setAttribute('draggable', 'true');
    wrap.dataset.id = c.id;

    const inner = document.createElement('div');
    inner.className = 'curso-in';
    inner.style.background = col.bg;

    // Top row
    const top = document.createElement('div');
    top.className = 'curso-top';

    const code = document.createElement('div');
    code.className = 'curso-code';
    code.style.cssText = `background:${col.cc};border-color:${col.bc};color:${col.tc}`;
    code.textContent = c.code || '—';
    top.appendChild(code);

    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;align-items:center;gap:4px;';

    const dragHandle = document.createElement('span');
    dragHandle.textContent = '⠿';
    dragHandle.style.cssText = 'font-size:18px;color:var(--t3);cursor:grab;padding:4px 6px;user-select:none;';
    dragHandle.title = 'Arrastrar para reordenar';
    btns.appendChild(dragHandle);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.style.cssText = 'background:none;border:none;font-size:15px;cursor:pointer;padding:4px 6px;line-height:1;';
    editBtn.title = 'Editar curso';
    (function(curso) {
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        activeCursoId = curso.id;
        openCursoEditSheet();
      });
    })(c);
    btns.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.style.cssText = 'background:none;border:none;font-size:16px;cursor:pointer;padding:4px 6px;color:var(--err);line-height:1;';
    delBtn.title = 'Eliminar curso';
    (function(curso) {
      delBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!confirm('¿Eliminar "' + curso.name + '"?')) return;
        state.cursos = state.cursos.filter(x => x.id !== curso.id);
        saveState();
        renderCursosV9();
        showToast('🗑️ Curso eliminado');
      });
    })(c);
    btns.appendChild(delBtn);
    top.appendChild(btns);
    inner.appendChild(top);

    const name = document.createElement('div');
    name.className = 'curso-name';
    name.textContent = c.name;
    inner.appendChild(name);

    // Tags
    const tags = document.createElement('div');
    tags.className = 'tags';
    const tagsData = [];
    if (c.fecha)  tagsData.push({txt:'📅 '+c.fecha,             style:''});
    if (c.horas)  tagsData.push({txt:'⏱️ '+c.horas+'h',         style:''});
    tagsData.push(  {txt:'✅ Completado',style:'background:rgba(16,185,129,.1);color:var(--ok)'});
    if (c.diploma)  tagsData.push({txt:'📜 Diploma',style:'background:rgba(245,158,11,.1);color:var(--gold)'});
    if (hasRec)     tagsData.push({txt:'⭐ Reciclado'+(c.reciclajes.length>1?' x'+c.reciclajes.length:''),style:'background:rgba(168,85,247,.1);color:#A855F7'});
    tagsData.forEach(t => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      if (t.style) tag.style.cssText = t.style;
      tag.textContent = t.txt;
      tags.appendChild(tag);
    });
    inner.appendChild(tags);
    wrap.appendChild(inner);

    // Click → open detail (only if not delete button)
    wrap.addEventListener('click', function(e) {
      if (e.target === delBtn || delBtn.contains(e.target)) return;
      openCursoDetail(c.id);
    });

    // Drag & drop
    wrap.addEventListener('dragstart', function(e) {
      dragSrcId = c.id;
      setTimeout(() => wrap.style.opacity = '0.4', 0);
      e.dataTransfer.effectAllowed = 'move';
    });
    wrap.addEventListener('dragend', function() {
      wrap.style.opacity = '1';
      list.querySelectorAll('.curso').forEach(el => el.style.borderColor = '');
    });
    wrap.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      wrap.style.borderColor = 'var(--pri)';
    });
    wrap.addEventListener('dragleave', function() {
      wrap.style.borderColor = '';
    });
    wrap.addEventListener('drop', function(e) {
      e.preventDefault();
      wrap.style.borderColor = '';
      if (!dragSrcId || dragSrcId === c.id) return;
      const si = state.cursos.findIndex(x => x.id === dragSrcId);
      const ti = state.cursos.findIndex(x => x.id === c.id);
      if (si < 0 || ti < 0) return;
      const [moved] = state.cursos.splice(si, 1);
      state.cursos.splice(ti, 0, moved);
      saveState();
      renderCursosV9();
      showToast('✅ Orden guardado');
    });

    list.appendChild(wrap);
  });
}

// ── EMPRESAS ─────────────────────────────────────────────────────
let currentEmpresaId = null;
let editingEmpresaId = null;

function renderEmpresas() {
  patchState();
  const list  = document.getElementById('empresas-list');
  const empty = document.getElementById('empresa-empty');
  if (!list) return;
  if (!state.empresas.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  list.innerHTML = state.empresas.map(e => `
    <div onclick="openEmpresaDetail('${e.id}')" style="background:var(--bg2);border-radius:14px;border:1px solid var(--b);padding:13px 14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;">
      <div style="width:42px;height:42px;border-radius:10px;background:rgba(79,142,247,.14);border:1px solid rgba(79,142,247,.3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🏢</div>
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--t1);">${e.nombre}</div>
        ${e.contacto ? `<div style="font-size:11px;color:var(--t2);margin-top:2px;">👤 ${e.contacto}</div>` : ''}
        ${e.tel      ? `<div style="font-size:11px;color:var(--t2);">📞 ${e.tel}</div>` : ''}
      </div>
      <button onclick="event.stopPropagation();deleteEmpresa('${e.id}')" style="background:none;border:none;color:var(--t3);font-size:18px;cursor:pointer;padding:6px;">🗑️</button>
    </div>`).join('');
}

function openAddEmpresaSheet() {
  editingEmpresaId = null;
  document.getElementById('emp-form-title') && (document.getElementById('emp-form-title').textContent = 'Añadir empresa');
  ['nombre','contacto','tel','email'].forEach(k => {
    const el = document.getElementById('i-emp-'+k);
    if (el) el.value = '';
  });
  ['mc','ml','pan','abr','chaq','sind','gorra'].forEach(k => {
    const el = document.getElementById('i-emp-t-'+k);
    if (el) el.value = '';
  });
  showSheet('add-empresa');
}

function openEmpresaDetail(id) {
  currentEmpresaId = id;
  const e = state.empresas.find(x => x.id === id);
  if (!e) return;
  document.getElementById('emp-detail-title').textContent = e.nombre;
  const tallas = e.tallas || {};
  const tallaKeys = [
    {k:'mc',l:'Camiseta m/c'},{k:'ml',l:'Camiseta m/l'},{k:'pan',l:'Pantalón'},
    {k:'abr',l:'Abrigo'},{k:'chaq',l:'Chaqueta'},{k:'sind',l:'Sindotación'},{k:'gorra',l:'Gorra'}
  ];
  const hayTallas = tallaKeys.some(t => tallas[t.k]);
  const body = document.getElementById('emp-detail-body');
  if (!body) return;
  body.innerHTML = `
    <div class="data-box">
      <div class="data-title">Contacto</div>
      <div class="field"><span class="field-ico">🏢</span><div><div class="field-lbl">Empresa</div><div class="field-val">${e.nombre}</div></div></div>
      ${e.contacto?`<div class="field"><span class="field-ico">👤</span><div><div class="field-lbl">Contacto</div><div class="field-val">${e.contacto}</div></div></div>`:''}
      ${e.tel?`<div class="field"><span class="field-ico">📞</span><div><div class="field-lbl">Teléfono</div><div class="field-val"><a href="tel:${e.tel}" style="color:var(--pri)">${e.tel}</a></div></div></div>`:''}
      ${e.email?`<div class="field"><span class="field-ico">📧</span><div><div class="field-lbl">Email</div><div class="field-val"><a href="mailto:${e.email}" style="color:var(--pri)">${e.email}</a></div></div></div>`:''}
    </div>
    ${hayTallas ? `<div class="data-box"><div class="data-title">Tallas de ropa</div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
        ${tallaKeys.filter(t=>tallas[t.k]).map(t=>`
          <div style="background:var(--bg3);border-radius:10px;padding:8px 10px;border:1px solid var(--b);">
            <div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;">${t.l}</div>
            <div style="font-size:14px;font-weight:700;color:var(--t1);margin-top:2px;">${tallas[t.k]}</div>
          </div>`).join('')}
      </div></div>` : ''}
    <div style="display:flex;gap:7px;padding:0 13px 9px;">
      <button class="pri-btn" style="margin:0;flex:1;padding:11px;font-size:12px;" onclick="editCurrentEmpresa()">✏️ Editar</button>
      <button class="ghost-btn" style="margin:0;flex:1;padding:11px;font-size:12px;color:var(--err);" onclick="deleteEmpresa('${e.id}')">🗑️ Eliminar</button>
    </div>`;
  nav('empresa-detail');
}

function editCurrentEmpresa() {
  const e = state.empresas.find(x => x.id === currentEmpresaId);
  if (!e) return;
  editingEmpresaId = e.id;
  const ft = document.getElementById('emp-form-title');
  if (ft) ft.textContent = 'Editar empresa';
  document.getElementById('i-emp-nombre').value   = e.nombre   || '';
  document.getElementById('i-emp-contacto').value = e.contacto || '';
  document.getElementById('i-emp-tel').value      = e.tel      || '';
  document.getElementById('i-emp-email').value    = e.email    || '';
  const tallas = e.tallas || {};
  ['mc','ml','pan','abr','chaq','sind','gorra'].forEach(k => {
    const el = document.getElementById('i-emp-t-'+k);
    if (el) el.value = tallas[k] || '';
  });
  showSheet('add-empresa');
}

function saveEmpresa() {
  if (!state.empresas) state.empresas = [];
  const nombre = (document.getElementById('i-emp-nombre')?.value || '').trim();
  if (!nombre) { showToast('❌ Nombre obligatorio'); return; }
  const tallas = {};
  ['mc','ml','pan','abr','chaq','sind','gorra'].forEach(k => {
    const v = (document.getElementById('i-emp-t-'+k)?.value || '').trim();
    if (v) tallas[k] = v;
  });
  const emp = {
    id:       editingEmpresaId || ('e' + Date.now()),
    nombre,
    contacto: (document.getElementById('i-emp-contacto')?.value || '').trim(),
    tel:      (document.getElementById('i-emp-tel')?.value      || '').trim(),
    email:    (document.getElementById('i-emp-email')?.value    || '').trim(),
    tallas,
  };
  if (editingEmpresaId) {
    const idx = state.empresas.findIndex(x => x.id === editingEmpresaId);
    if (idx >= 0) state.empresas[idx] = emp;
  } else {
    state.empresas.push(emp);
  }
  editingEmpresaId = null;
  saveState();
  closeSheet();
  renderEmpresas();
  showToast(emp.id === ('e' + Date.now()) ? '✅ Empresa añadida' : '✅ Empresa actualizada');
}

function deleteEmpresa(id) {
  if (!confirm('¿Eliminar esta empresa?')) return;
  state.empresas = state.empresas.filter(x => x.id !== id);
  saveState();
  if (cur === 'empresa-detail') nav('empresas');
  renderEmpresas();
  showToast('Empresa eliminada');
}

// ── TIP with Escolta + Detective ──────────────────────────────────
function renderHabEditList() {
  const habs  = state.tip.habs  || {};
  const extra = state.tip.habsExtra || {ep:{tip:'',desde:'',hasta:''},dp:{tip:'',desde:'',hasta:''}};
  const list  = document.getElementById('hab-edit-list');
  if (!list) return;
  list.innerHTML = HAB_ROLES_V9.filter(r => !r.hasExp).map(r => `
    <div style="background:var(--bg3);border-radius:10px;padding:9px 11px;border:1px solid var(--b);">
      <div style="font-size:11px;font-weight:700;color:${r.color};margin-bottom:5px;">${r.label}</div>
      <input class="inp" id="i-hab-${r.key}" placeholder="Nº TIP (vacío si no aplica)" value="${habs[r.key]||''}" style="font-size:13px;padding:8px 10px;">
    </div>`).join('');

  const extraList = document.getElementById('hab-extra-list');
  if (!extraList) return;
  extraList.innerHTML = HAB_ROLES_V9.filter(r => r.hasExp).map(r => `
    <div style="background:var(--bg3);border-radius:10px;padding:9px 11px;border:1px solid var(--b);">
      <div style="font-size:11px;font-weight:700;color:${r.color};margin-bottom:6px;">${r.label}</div>
      <input class="inp" id="i-hab-${r.key}" placeholder="Nº TIP (vacío si no aplica)" value="${extra[r.key]?.tip||''}" style="font-size:13px;padding:8px 10px;margin-bottom:5px;">
      <div style="display:flex;gap:6px;">
        <div style="flex:1;"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px;">Fecha expedición</div><input class="inp" id="i-hab-${r.key}-desde" placeholder="DD/MM/YYYY" value="${extra[r.key]?.desde||''}" style="font-size:12px;padding:7px 9px;"></div>
        <div style="flex:1;"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px;">Caducidad</div><input class="inp" id="i-hab-${r.key}-hasta" placeholder="DD/MM/YYYY" value="${extra[r.key]?.hasta||''}" style="font-size:12px;padding:7px 9px;"></div>
      </div>
    </div>`).join('');
};

function saveTIP() {
  const d = state.tip;
  d.nombre = document.getElementById('i-tip-nombre')?.value || d.nombre;
  d.apell  = document.getElementById('i-tip-apell')?.value  || d.apell;
  if (!d.habs)      d.habs      = {};
  if (!d.habsExtra) d.habsExtra = {};
  HAB_ROLES_V9.filter(r => !r.hasExp).forEach(r => {
    const el = document.getElementById('i-hab-'+r.key);
    if (el) d.habs[r.key] = el.value.trim();
  });
  HAB_ROLES_V9.filter(r => r.hasExp).forEach(r => {
    d.habsExtra[r.key] = {
      tip:   (document.getElementById('i-hab-'+r.key)          ?.value || '').trim(),
      desde: (document.getElementById('i-hab-'+r.key+'-desde') ?.value || '').trim(),
      hasta: (document.getElementById('i-hab-'+r.key+'-hasta') ?.value || '').trim(),
    };
  });
  saveState();
  renderTIPFull();
  cancelEdit('tip');
  showToast('✅ TIP guardado');
};

function renderTIP() { renderTIPFull(); };

function renderTIPFull() {
  const d     = state.tip;
  const habs  = d.habs  || {};
  const extra = d.habsExtra || {};
  const el    = id => document.getElementById(id);

  if (el('tip-name-hero'))   el('tip-name-hero').textContent   = d.apell  || 'APELLIDOS';
  if (el('tip-fname-hero'))  el('tip-fname-hero').textContent  = d.nombre || 'Nombre';
  if (el('tip-wm'))          el('tip-wm').textContent          = `${d.nombre} ${d.apell} · SEGURIDAD PRIVADA · VÁLIDO`;

  const activeBase  = HAB_ROLES_V9.filter(r => !r.hasExp && habs[r.key]);
  const activeExtra = HAB_ROLES_V9.filter(r =>  r.hasExp && extra[r.key]?.tip);
  const allActive   = [...activeBase, ...activeExtra];

  const summary = el('tip-nums-summary');
  if (summary) {
    summary.innerHTML = allActive.length
      ? allActive.map(r => {
          const val = r.hasExp ? extra[r.key]?.tip : habs[r.key];
          return `<div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:10px;color:var(--t2);">${r.label}</span>
            <span style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:${r.color};">${val}</span>
          </div>`;
        }).join('')
      : '<span style="font-size:11px;color:var(--t3);">Sin habilitaciones</span>';
  }

  const habList = el('hab-list-view');
  if (habList) {
    habList.innerHTML = allActive.length === 0
      ? '<div style="font-size:12px;color:var(--t3);font-style:italic;padding:3px 0;">Sin habilitaciones · pulsa ✏️</div>'
      : allActive.map(r => {
          const val   = r.hasExp ? extra[r.key]?.tip : habs[r.key];
          const dates = r.hasExp
            ? `${extra[r.key]?.desde ? '<div style="font-size:10px;color:var(--t3);">Exp: '+extra[r.key].desde+'</div>' : ''}
               ${extra[r.key]?.hasta ? '<div style="font-size:10px;color:var(--gold);">Cad: '+extra[r.key].hasta+'</div>' : ''}` : '';
          return `<div class="hab-item">
            <div class="hab-dot" style="background:${r.color}"></div>
            <div style="flex:1"><div style="font-size:13px;font-weight:600;">${r.label}</div>
              <div style="font-size:11px;color:var(--t2);">TIP: ${val}</div>${dates}</div>
            <div style="font-size:10px;color:var(--ok)">✓</div>
          </div>`;
        }).join('');
  }
}

// ── PERFIL: enfermedades + face photo + SS/Banco ──────────────────
function renderPerfil() { renderPerfilFull(); renderPDFBankSS(); };

function renderPerfilFull() {
  const p  = state.perfil;
  const el = id => document.getElementById(id);
  if (el('p-name-disp')) el('p-name-disp').textContent = (p.nombre+' '+p.apell).trim() || '—';
  if (el('p-avatar'))    el('p-avatar').textContent    = (p.nombre[0]||'')+(p.apell[0]||'');
  ['nombre','apell','nac','tel','emerg'].forEach(k => {
    const e = el('p-r-'+k);
    if (e) e.textContent = p[k] || '—';
  });
  if (el('p-r-sangre')) el('p-r-sangre').textContent = p.sangre || '—';
  if (el('p-r-altura')) el('p-r-altura').textContent = p.altura ? p.altura+' cm' : '—';
  if (el('p-r-peso'))   el('p-r-peso').textContent   = p.peso   ? p.peso+' kg'   : '—';

  // Multiline fields
  ['alergias','meds','enfermedades'].forEach(k => {
    const e = el('p-r-'+k);
    if (e) { e.textContent = p[k] || 'Ninguna'; e.style.whiteSpace = 'pre-line'; }
  });

  // Face photo
  const faceImg = el('perfil-face-img');
  const facePrev= el('prev-perfil-face');
  const facePh  = el('ph-perfil-face');
  const src     = state.photos['perfil-face'] || state.photos['tip-face'];
  if (src && faceImg && facePrev) {
    faceImg.src = src;
    facePrev.style.display = 'block';
    if (facePh) facePh.style.display = 'none';
  }

  // Toggles
  if (el('pin-toggle'))   el('pin-toggle').checked   = !!state.pin;
  if (el('notif-toggle')) el('notif-toggle').checked = !!state.notifEnabled;
  if (el('bio-toggle'))   el('bio-toggle').checked   = !!state.bioEnabled;
  if (state.notifEnabled && el('notif-days-area')) el('notif-days-area').style.display = 'block';
  if (state.notifDays) [30,60,90].forEach(d => {
    const e = el('notif-'+d); if (e) e.checked = state.notifDays.includes(d);
  });
}

function togglePerfilEdit() {
  const reading = document.getElementById('perfil-read');
  const editing = document.getElementById('perfil-edit');
  if (!reading || !editing) return;
  const isEditing = editing.style.display !== 'none';
  if (isEditing) {
    reading.style.display = 'block';
    editing.style.display = 'none';
  } else {
    const p = state.perfil;
    ['nombre','apell','nac','tel','emerg','sangre','altura','peso'].forEach(k => {
      const el = document.getElementById('i-p-'+k);
      if (el) el.value = p[k] || '';
    });
    ['alergias','meds','enfermedades'].forEach(k => {
      const el = document.getElementById('i-p-'+k);
      if (el) el.value = p[k] || '';
    });
    reading.style.display = 'none';
    editing.style.display = 'block';
  }
};

function savePerfil() {
  const p = state.perfil;
  ['nombre','apell','nac','tel','emerg','sangre','altura','peso'].forEach(k => {
    const el = document.getElementById('i-p-'+k);
    if (el) p[k] = el.value;
  });
  ['alergias','meds','enfermedades'].forEach(k => {
    const el = document.getElementById('i-p-'+k);
    if (el) p[k] = el.value.trim();
  });
  saveState();
  togglePerfilEdit();
  renderPerfilFull();
  updateHoloBadge();
  showToast('✅ Perfil guardado');
};

// Face photo from perfil
function changeFacePhoto() {
  document.getElementById('inp-perfil-face')?.click();
}
function handlePerfilFacePhoto(inp) {
  const f = inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    state.photos['perfil-face'] = e.target.result;
    state.photos['tip-face']    = e.target.result;
    saveState();
    renderPerfilFull();
    applyPhoto('tip-face', e.target.result);
    showToast('✅ Foto actualizada');
  };
  r.readAsDataURL(f); inp.value = '';
}

// SS + Banco rendered inside Perfil (they are now in s-perfil HTML)
function renderPDFBankSS() {
  const s = state.ss || {};
  const b = state.banco || {};
  const el = id => document.getElementById(id);
  if (el('f-ss-nombre')) el('f-ss-nombre').textContent = (s.nombre+' '+(s.apell||'')).trim() || '—';
  if (el('f-ss-dni'))    el('f-ss-dni').textContent    = s.dni || '—';
  if (el('f-ss-naf'))    el('f-ss-naf').textContent    = s.naf || '—';
  if (el('f-banco-nombre')) el('f-banco-nombre').textContent = (b.nombre+' '+(b.apell||'')).trim() || '—';
  if (el('f-banco-dni'))    el('f-banco-dni').textContent    = b.dni  || '—';
  if (el('f-banco-iban'))   el('f-banco-iban').textContent   = b.iban || '—';
  if (el('f-banco-bic'))    el('f-banco-bic').textContent    = b.bic  || '—';
  if (el('f-banco-banco'))  el('f-banco-banco').textContent  = b.banco|| '—';
}

// ── ACREDITACIONES with PDF support ──────────────────────────────
// Override acred scan to support PDF
function startAcredOCR() {
  document.getElementById('inp-acred-scan')?.click();
};

// Handle acred scan/img (supports both image and PDF)
function handleAcredScan(inp) {
  const f = inp.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    acredImgB64 = e.target.result;
    const prev = document.getElementById('prev-acred-img');
    const ph   = document.getElementById('ph-acred-img');
    if (prev) {
      prev.innerHTML = `<img src="${acredImgB64}" style="width:100%;border-radius:10px;">`;
      prev.style.display = 'block';
    }
    if (ph) ph.style.display = 'none';
    // Pre-fill titular
    const t = document.getElementById('i-acred-titular');
    if (t && !t.value) t.value = (state.perfil.nombre+' '+state.perfil.apell).trim();
    showToast('📷 Imagen cargada');
  };
  reader.readAsDataURL(f); inp.value = '';
};

function handleAcredImg(inp) { handleAcredScan(inp); };

// ── PDF LIBRARY ───────────────────────────────────────────────────
let pdfViewerDoc  = null;
let pdfCurrentPage= 1;
let pdfCurrentId  = null;
let pdfTempData   = null;

function openAddPDFSheet() {
  pdfTempData = null;
  const t  = document.getElementById('i-pdf-titulo');
  const pv = document.getElementById('prev-pdf-file');
  const ph = document.getElementById('ph-pdf-file');
  const fn = document.getElementById('pdf-file-name');
  if (t)  t.value = '';
  if (pv) { pv.style.display='none'; pv.innerHTML=''; }
  if (ph) ph.style.display = 'flex';
  if (fn) fn.textContent = '';
  showSheet('add-pdf');
}

function handlePDFFileSelect(inp) {
  const f = inp.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    pdfTempData = e.target.result;
    const fn = document.getElementById('pdf-file-name');
    const pv = document.getElementById('prev-pdf-file');
    const ph = document.getElementById('ph-pdf-file');
    if (fn) fn.textContent = f.name;
    if (pv) { pv.style.display='block'; }
    if (ph) ph.style.display = 'none';
    // Auto-fill title
    const t = document.getElementById('i-pdf-titulo');
    if (t && !t.value.trim()) {
      t.value = f.name.replace(/\.(pdf|png|jpg|jpeg)$/i,'').replace(/[-_]/g,' ');
    }
  };
  reader.readAsDataURL(f); inp.value = '';
}

function savePDFDoc() {
  if (!state.pdfLibrary) state.pdfLibrary = [];
  const titulo = (document.getElementById('i-pdf-titulo')?.value || '').trim();
  if (!titulo)   { showToast('❌ Añade un título'); return; }
  if (!pdfTempData) { showToast('❌ Selecciona un archivo primero'); return; }
  const cat   = document.getElementById('i-pdf-cat')?.value || 'otro';
  const isPDF = pdfTempData.includes('application/pdf') || pdfTempData.startsWith('data:application/pdf');
  if (!state.pdfLibrary) state.pdfLibrary = [];
  state.pdfLibrary.push({
    id: 'pdf'+Date.now(), titulo, cat, data: pdfTempData,
    fecha: new Date().toLocaleDateString('es-ES'), isPDF,
  });
  saveState(); closeSheet(); renderPDFLibrary();
  showToast('✅ Documento guardado');
  pdfTempData = null;
}

function renderPDFLibrary() {
  if (!state.pdfLibrary) state.pdfLibrary = [];
  const list  = document.getElementById('pdf-library-list');
  const empty = document.getElementById('pdf-library-empty');
  if (!list) return;
  if (!state.pdfLibrary.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  // Group by category
  const groups = {};
  state.pdfLibrary.forEach(d => {
    if (!groups[d.cat]) groups[d.cat] = [];
    groups[d.cat].push(d);
  });
  list.innerHTML = Object.entries(groups).map(([cat, docs]) => {
    const cfg = PDF_CATS[cat] || PDF_CATS.otro;
    return `<div style="margin-bottom:14px;">
      <div style="font-size:10px;font-weight:700;color:var(--t3);letter-spacing:1px;text-transform:uppercase;margin-bottom:7px;">${cfg.icon} ${cfg.label}</div>
      ${docs.map(d => `
        <div onclick="openPDFViewer('${d.id}')" style="display:flex;align-items:center;gap:12px;background:var(--bg2);border-radius:13px;border:1px solid var(--b);padding:13px 14px;margin-bottom:7px;cursor:pointer;">
          <div style="width:42px;height:42px;border-radius:10px;background:${cfg.color}20;border:1px solid ${cfg.color}40;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${cfg.icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.titulo}</div>
            <div style="font-size:11px;color:var(--t2);margin-top:2px;">${d.isPDF?'PDF':'Imagen'} · ${d.fecha||'—'}</div>
          </div>
          <div style="color:var(--t3);font-size:18px;">›</div>
        </div>`).join('')}
    </div>`;
  }).join('');
}

async function openPDFViewer(id) {
  const doc = (state.pdfLibrary||[]).find(x => x.id === id);
  if (!doc) { showToast('❌ No encontrado'); return; }
  pdfCurrentId = id;
  const t = document.getElementById('pdf-viewer-title');
  if (t) t.textContent = doc.titulo;
  nav('pdf-viewer');
  // Scroll canvas wrap to top
  const wrap = document.getElementById('pdf-canvas-wrap');
  if (wrap) wrap.scrollTop = 0;

  const canvas = document.getElementById('pdf-canvas');
  if (!canvas) return;

  if (doc.isPDF && typeof pdfjsLib !== 'undefined') {
    try {
      showToast('📄 Cargando…');
      const b64 = doc.data.split(',')[1] || doc.data;
      const bin = atob(b64);
      const buf = new Uint8Array(bin.length);
      for (let i=0;i<bin.length;i++) buf[i] = bin.charCodeAt(i);
      pdfViewerDoc   = await pdfjsLib.getDocument({data:buf}).promise;
      pdfCurrentPage = 1;
      const tot = document.getElementById('pdf-page-total');
      if (tot) tot.textContent = pdfViewerDoc.numPages;
      await renderPDFPage(1);
    } catch(e) { showToast('⚠️ Error: '+e.message); }
  } else {
    // Image — fill full width
    pdfViewerDoc = null;
    const num = document.getElementById('pdf-page-num');
    const tot = document.getElementById('pdf-page-total');
    if (num) num.textContent = '1';
    if (tot) tot.textContent = '1';
    const img = new Image();
    img.onload = () => {
      const cW = (wrap ? wrap.clientWidth : window.innerWidth) || window.innerWidth;
      const scale = cW / img.width;
      canvas.width  = img.width;
      canvas.height = img.height;
      canvas.style.width  = '100%';
      canvas.style.height = 'auto';
      canvas.getContext('2d').drawImage(img, 0, 0);
    };
    img.src = doc.data;
  }
}

async function renderPDFPage(pageNum) {
  if (!pdfViewerDoc) return;
  const page   = await pdfViewerDoc.getPage(pageNum);
  const canvas = document.getElementById('pdf-canvas');
  if (!canvas) return;
  const wrap = document.getElementById('pdf-canvas-wrap');
  // Use window.innerWidth for guaranteed full width (wrap may have 0 during transition)
  const cW   = window.innerWidth || 390;
  const unscaled = page.getViewport({scale:1});
  const scale    = cW / unscaled.width;
  const viewport = page.getViewport({scale});
  canvas.width  = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width  = '100%';
  canvas.style.height = 'auto';
  canvas.style.display = 'block';
  await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
  const num = document.getElementById('pdf-page-num');
  if (num) num.textContent = pageNum;
  if (wrap) wrap.scrollTop = 0;
}

function pdfNextPage() {
  if (!pdfViewerDoc || pdfCurrentPage >= pdfViewerDoc.numPages) return;
  pdfCurrentPage++;
  renderPDFPage(pdfCurrentPage);
}
function pdfPrevPage() {
  if (!pdfViewerDoc || pdfCurrentPage <= 1) return;
  pdfCurrentPage--;
  renderPDFPage(pdfCurrentPage);
}
function deleteCurrentPDF() {
  if (!pdfCurrentId || !confirm('¿Eliminar este documento?')) return;
  state.pdfLibrary = state.pdfLibrary.filter(x => x.id !== pdfCurrentId);
  saveState(); nav('docs'); renderPDFLibrary();
  showToast('Documento eliminado');
}
async function shareCurrentPDF() {
  const doc = (state.pdfLibrary||[]).find(x => x.id === pdfCurrentId);
  if (!doc) return;
  try {
    const b64  = doc.data.split(',')[1] || doc.data;
    const bin  = atob(b64);
    const buf  = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) buf[i] = bin.charCodeAt(i);
    const blob = new Blob([buf], {type: doc.isPDF ? 'application/pdf' : 'image/jpeg'});
    const name = doc.titulo.replace(/[^a-z0-9]/gi,'_') + (doc.isPDF?'.pdf':'.jpg');
    const file = new File([blob], name, {type:blob.type});
    if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({title:doc.titulo, files:[file]});
    } else {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a'); a.href=url; a.download=name; a.click();
      URL.revokeObjectURL(url); showToast('📥 Descargado');
    }
  } catch(e) { if (e.name !== 'AbortError') showToast('⚠️ Error al compartir'); }
}

// ── CV/INFORME PROFESIONAL (comprehensive, per-item checkboxes) ───
let cvShareMethod = 'download';

function openInformeSheet(method) {
  cvShareMethod = method || 'download';
  populateCVItems();
  showSheet('cv-select');
}
// Called from perfil buttons
function generateCVReport() { openInformeSheet('download'); }
generateCVReportV9 = generateCVReport;

function populateCVItems() {
  const container = document.getElementById('cv-items-container');
  if (!container) return;
  const items = buildCVItemList();
  container.innerHTML = items.map(item => {
    if (item.header) {
      return `<div style="font-size:9px;font-weight:800;color:var(--pri);letter-spacing:1.5px;text-transform:uppercase;padding:10px 2px 3px;display:flex;align-items:center;gap:5px;">
        <div style="flex:1;height:1px;background:rgba(79,142,247,.2);"></div>
        <span>${item.label}</span>
        <div style="flex:1;height:1px;background:rgba(79,142,247,.2);"></div>
      </div>`;
    }
    if (item.disabled) {
      return `<div style="display:flex;align-items:center;gap:10px;font-size:12px;color:var(--t3);background:var(--bg3);border-radius:10px;padding:8px 12px;border:1px solid var(--b);opacity:.5;font-style:italic;">
        <span style="width:16px;text-align:center;">${item.icon||'·'}</span>
        <span>${item.label}</span>
      </div>`;
    }
    return `<label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;background:var(--bg3);border-radius:10px;padding:9px 12px;border:1px solid var(--b);transition:background .15s;" onpointerdown="this.style.background='var(--bg2)'" onpointerup="this.style.background='var(--bg3)'">
      <input type="checkbox" data-cv-key="${item.key}" ${item.checked?'checked':''} style="accent-color:var(--pri);width:16px;height:16px;flex-shrink:0;">
      <span style="flex:1;line-height:1.3;">${item.icon?item.icon+' ':''}${item.label}</span>
      ${item.hasMedia?'<span style="font-size:10px;color:var(--ok);" title="Incluye fotos/imágenes">📷</span>':''}
    </label>`;
  }).join('');
}

function buildCVItemList() {
  patchState();
  const items = [];
  const d=state.dni, tip=state.tip, aesa=state.aesa;
  const habs=tip.habs||{}, extra=tip.habsExtra||{};
  const p = state.perfil;

  const has = v => !!(v && String(v).trim());

  // ══ DOCUMENTOS PROFESIONALES ══════════════════════════════════
  items.push({key:'_hdr_docs', header:true, label:'DOCUMENTOS PROFESIONALES'});

  // DNI
  items.push({key:'dni', icon:'🪪',
    label:'DNI' + (d.num ? ' · '+d.num : ' · Sin datos'),
    checked:has(d.num),
    hasMedia:!!(state.photos['dni-front']||state.photos['dni-back'])});

  // TIP — una línea por habilitación que tenga número
  const activeTips = HAB_ROLES_V9.filter(r => {
    const val = r.hasExp ? extra[r.key]?.tip : habs[r.key];
    return has(val);
  });
  if (activeTips.length) {
    activeTips.forEach(r => {
      const val = r.hasExp ? extra[r.key]?.tip : habs[r.key];
      items.push({key:'tip-'+r.key, icon:'🛡️',
        label:r.label+' · TIP '+val,
        checked:true,
        hasMedia:!!(state.photos['tip-front']||state.photos['tip-back'])});
    });
  } else {
    items.push({key:'tip', icon:'🛡️', label:'TIP · Sin habilitaciones añadidas',
      checked:false, hasMedia:false});
  }

  // AESA
  items.push({key:'aesa', icon:'✈️',
    label:'Licencia AESA' + (aesa.id ? ' · '+aesa.cat+' · '+aesa.id : ' · Sin datos'),
    checked:has(aesa.id),
    hasMedia:!!(state.photos['aesa-qr']||state.photos['aesa-cert'])});

  // ══ FORMACIÓN ═════════════════════════════════════════════════
  items.push({key:'_hdr_cursos', header:true, label:'FORMACIÓN Y CURSOS'});
  if (state.cursos.length) {
    items.push({key:'cursos_todos', icon:'🎓',
      label:'Todos los cursos ('+state.cursos.length+') con diplomas y reciclajes',
      checked:true,
      hasMedia:state.cursos.some(c=>!!(state.photos['diploma-'+c.id]||c.diploma))});
  } else {
    items.push({key:'cursos_todos', icon:'🎓', label:'Cursos · Sin cursos añadidos',
      checked:false, hasMedia:false});
  }

  // ══ ACREDITACIONES ════════════════════════════════════════════
  items.push({key:'_hdr_acred', header:true, label:'ACREDITACIONES TEMPORALES'});
  if (state.acred.length) {
    state.acred.forEach(a => items.push({key:'acred-'+a.id, icon:'🪪',
      label:a.nombre+(a.org?' · '+a.org:'')+(a.hasta?' · hasta '+a.hasta:''),
      checked:true, hasMedia:!!(a.img)}));
  } else {
    items.push({key:'_no_acred', icon:'🪪', label:'Sin acreditaciones añadidas',
      checked:false, hasMedia:false, disabled:true});
  }

  // ══ DATOS PERSONALES ══════════════════════════════════════════
  items.push({key:'_hdr_perfil', header:true, label:'DATOS PERSONALES'});
  items.push({key:'perfil_datos', icon:'👤',
    label:'Datos personales · nombre, teléfono, contacto emergencia'+(has(p.nombre)?' · '+p.nombre+' '+p.apell:''),
    checked:has(p.nombre), hasMedia:false});

  // ══ DATOS DE SALUD ════════════════════════════════════════════
  items.push({key:'_hdr_salud', header:true, label:'DATOS DE SALUD'});
  const hasSalud = has(p.sangre)||has(p.altura)||has(p.peso)||has(p.alergias)||has(p.meds)||has(p.enfermedades);
  items.push({key:'perfil_salud', icon:'🏥',
    label:'Salud · grupo sanguíneo, alergias, medicamentos, enfermedades'+(has(p.sangre)?' · '+p.sangre:''),
    checked:hasSalud, hasMedia:false});

  // ══ SEGURIDAD SOCIAL ══════════════════════════════════════════
  items.push({key:'_hdr_ss', header:true, label:'SEGURIDAD SOCIAL'});
  items.push({key:'ss', icon:'🟢',
    label:'Seguridad Social' + (has(state.ss?.naf) ? ' · NAF: '+state.ss.naf : ' · Sin datos'),
    checked:has(state.ss?.naf),
    hasMedia:!!(state.photos['ss-doc'])});

  // ══ DATOS BANCARIOS ═══════════════════════════════════════════
  items.push({key:'_hdr_banco', header:true, label:'DATOS BANCARIOS'});
  items.push({key:'banco', icon:'🏦',
    label:'Datos bancarios' + (has(state.banco?.iban) ? ' · IBAN …'+state.banco.iban.slice(-4) : ' · Sin datos'),
    checked:has(state.banco?.iban),
    hasMedia:!!(state.photos['banco-cert'])});

  // ══ EMPRESAS ══════════════════════════════════════════════════
  items.push({key:'_hdr_empresas', header:true, label:'EMPRESAS'});
  if ((state.empresas||[]).length) {
    (state.empresas||[]).forEach(e => items.push({key:'empresa-'+e.id, icon:'🏢',
      label:e.nombre+(e.tel?' · '+e.tel:'')+(e.contacto?' · '+e.contacto:''),
      checked:true, hasMedia:false}));
  } else {
    items.push({key:'_no_emp', icon:'🏢', label:'Sin empresas añadidas',
      checked:false, hasMedia:false, disabled:true});
  }

  return items;
}
  const d=state.dni, tip=state.tip, aesa=state.aesa;
  const habs=tip.habs||{}, extra=tip.habsExtra||{};
  const p = state.perfil;

  // ── DOCUMENTOS PROFESIONALES ──────────────────────────────────
  items.push({key:'_hdr_docs', icon:'', label:'── DOCUMENTOS PROFESIONALES ──', checked:false, header:true});

  // DNI
  items.push({key:'dni', icon:'🪪', label:'DNI — '+(d.num||'Sin datos'),
    checked:!!(d.num), hasMedia:!!(state.photos['dni-front']||state.photos['dni-back'])});
  // TIP por habilitación
  HAB_ROLES_V9.forEach(r => {
    const val = r.hasExp ? extra[r.key]?.tip : habs[r.key];
    if (!val) return;
    items.push({key:'tip-'+r.key, icon:'🛡️', label:r.label+' (TIP '+val+')',
      checked:true, hasMedia:!!(state.photos['tip-front']||state.photos['tip-back'])});
  });
  // AESA
  if (aesa.id) items.push({key:'aesa', icon:'✈️', label:'Licencia AESA '+aesa.cat,
    checked:true, hasMedia:!!(state.photos['aesa-qr']||state.photos['aesa-cert'])});

  // ── FORMACIÓN ────────────────────────────────────────────────
  if (state.cursos.length) {
    items.push({key:'_hdr_cursos', icon:'', label:'── FORMACIÓN Y CURSOS ──', checked:false, header:true});
    // Todos los cursos como UN solo bloque (completo con diplomas y reciclajes)
    items.push({key:'cursos_todos', icon:'🎓',
      label:'Todos los cursos ('+state.cursos.length+') · con diplomas y reciclajes',
      checked:true,
      hasMedia: state.cursos.some(c=>!!(state.photos['diploma-'+c.id]||c.diploma))});
  }

function selectAllCV(val) {
  document.querySelectorAll('#cv-items-container input[type=checkbox]').forEach(cb => {
    cb.checked = val;
  });
}

async function exportCVPDFV9() {
  const keys = new Set();
  document.querySelectorAll('#cv-items-container input[type=checkbox]:checked')
    .forEach(cb => keys.add(cb.dataset.cvKey));
  if (!keys.size) { showToast('⚠️ Selecciona al menos un elemento'); return; }

  showToast('📄 Generando PDF…');
  try {
    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W = pdf.internal.pageSize.getWidth();
    const p = state.perfil;
    let y = 20;

    const chk = () => {
      if (y > 265) {
        pdf.addPage();
        pdf.setFillColor(5,8,15); pdf.rect(0,0,W,297,'F');
        y = 18;
      }
    };
    const ln = (txt, sz=10, col=[240,246,255], bold=false, indent=0) => {
      chk();
      pdf.setFont('helvetica', bold?'bold':'normal');
      pdf.setFontSize(sz); pdf.setTextColor(...col);
      const lines = pdf.splitTextToSize(String(txt||''), W-30-indent);
      lines.forEach(l => { chk(); pdf.text(l, 15+indent, y); y += sz*0.45+2.5; });
    };
    const sec = (title, col=[79,142,247]) => {
      chk(); y+=4;
      pdf.setFillColor(15,24,40); pdf.rect(0,y-5,W,10,'F');
      pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(...col);
      pdf.text(title, 15, y); y += 7;
    };
    const img = async (b64, mH=35) => {
      if (!b64) return;
      try {
        const im = new Image();
        await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=b64;});
        const r  = im.width/im.height;
        const iW = Math.min(W-30, r*mH);
        const iH = iW/r;
        chk(); if(y+iH>265){pdf.addPage();pdf.setFillColor(5,8,15);pdf.rect(0,0,W,297,'F');y=18;}
        pdf.addImage(b64,'JPEG',15,y,iW,iH); y+=iH+4;
      } catch(e){}
    };

    // Dark background + header
    pdf.setFillColor(5,8,15); pdf.rect(0,0,W,297,'F');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(20); pdf.setTextColor(240,246,255);
    pdf.text(`${p.nombre} ${p.apell}`, W/2, y, {align:'center'}); y+=8;
    pdf.setFontSize(10); pdf.setTextColor(16,185,129);
    pdf.text('Vigilante de Seguridad Privada', W/2, y, {align:'center'}); y+=5;
    pdf.setFontSize(8); pdf.setTextColor(139,165,196);
    pdf.text('Informe · '+new Date().toLocaleDateString('es-ES')+' · SegurApp v2.0', W/2, y, {align:'center'}); y+=12;

    const d=state.dni; const habs=state.tip.habs||{}; const extra=state.tip.habsExtra||{};

    // DNI
    if (keys.has('dni')) {
      sec('🪪 DOCUMENTO NACIONAL DE IDENTIDAD');
      if(d.num) ln(`Nº: ${d.num}  |  Nac: ${d.nac||'—'}  |  Expira: ${d.exp||'—'}`, 9);
      if(d.nombre) ln(`${d.nombre} ${d.apell}`, 9,[139,165,196]);
      await img(state.photos['dni-front'],40);
      await img(state.photos['dni-back'],40);
    }

    // TIP
    const tipKeys = [...keys].filter(k=>k.startsWith('tip-'));
    if (tipKeys.length || keys.has('tip')) {
      sec('🛡️ TARJETA IDENTIDAD PROFESIONAL',[16,185,129]);
      ln(`${state.tip.nombre} ${state.tip.apell}`, 10,[240,246,255],true);
      HAB_ROLES_V9.forEach(r => {
        if (!keys.has('tip-'+r.key)) return;
        const val = r.hasExp ? extra[r.key]?.tip : habs[r.key];
        if (!val) return;
        ln(`${r.label}: TIP ${val}${r.hasExp&&extra[r.key]?.hasta?' | Cad: '+extra[r.key].hasta:''}`, 9,[139,165,196],false,4);
      });
      await img(state.photos['tip-front'],38);
    }

    // AESA
    if (keys.has('aesa') && state.aesa.id) {
      sec('✈️ LICENCIA AESA — PILOTO DE DRONES',[168,85,247]);
      ln(`ID: ${state.aesa.id}  |  Cat: ${state.aesa.cat}  |  ${state.aesa.nombre} ${state.aesa.apell}`, 9);
      if(state.aesa.exp) ln(`Expiración: ${state.aesa.exp}`, 9,[139,165,196],false,4);
      await img(state.photos['aesa-qr'],28);
      await img(state.photos['aesa-cert'],40);
    }

    // Cursos
    const cursoKeys = [...keys].filter(k=>k.startsWith('curso-'));
    if (cursoKeys.length || keys.has('cursos_todos')) {
      sec('🎓 FORMACIÓN Y CURSOS',[245,158,11]);
      const selCursos = keys.has('cursos_todos')
        ? state.cursos
        : state.cursos.filter(c=>keys.has('curso-'+c.id));
      const sorted = [...selCursos].sort((a,b)=>{
        if(a.fecha&&b.fecha) return b.fecha.localeCompare(a.fecha);
        return a.fecha?-1:b.fecha?1:0;
      });
      for (const c of sorted) {
        ln(`${c.code}  ${c.name}`, 9,[240,246,255],true);
        const sub=`${c.entidad||''}${c.horas?' · '+c.horas+'h':''}${c.fecha?' · '+c.fecha:''}${c.reciclajes?.length?' · ⭐ x'+c.reciclajes.length:''}`;
        if(sub.trim()) ln(sub,8,[139,165,196],false,4);
        await img(state.photos['diploma-'+c.id]||c.diploma, 28);
        for(const rec of (c.reciclajes||[])) {
          if(rec.titulo) ln(`🔄 ${rec.titulo}${rec.fecha?' — '+rec.fecha:''}`,8,[100,120,150],false,8);
          await img(rec.foto||state.photos['reciclaje-'+c.id+'-'+rec.id],18);
        }
      }
    }

    // SS
    if (keys.has('ss') && state.ss?.naf) {
      sec('🏥 SEGURIDAD SOCIAL');
      if(state.ss.nombre||state.ss.apell) ln(`Titular: ${(state.ss.nombre||'')+' '+(state.ss.apell||'')}`.trim(),9);
      ln(`NAF: ${state.ss.naf}`,9,[240,246,255],true);
      if(state.ss.dni) ln(`DNI: ${state.ss.dni}`,9,[139,165,196],false,4);
      if(state.photos['ss-doc']) {
        ln('Documento adjunto:',8,[139,165,196],false,4);
        await img(state.photos['ss-doc'], 45);
      }
    }

    // Banco
    if (keys.has('banco') && state.banco?.iban) {
      sec('🏦 DATOS BANCARIOS');
      if(state.banco.nombre||state.banco.apell) ln(`Titular: ${(state.banco.nombre||'')+' '+(state.banco.apell||'')}`.trim(),9);
      ln(`IBAN: ${state.banco.iban}`,9,[240,246,255],true);
      if(state.banco.bic)   ln(`BIC/SWIFT: ${state.banco.bic}`,9,[139,165,196],false,4);
      if(state.banco.banco) ln(`Banco: ${state.banco.banco}`,9,[139,165,196],false,4);
      if(state.banco.dni)   ln(`DNI: ${state.banco.dni}`,9,[139,165,196],false,4);
      if(state.photos['banco-cert']) {
        ln('Certificado bancario:',8,[139,165,196],false,4);
        await img(state.photos['banco-cert'], 45);
      }
    }

    // Acreditaciones
    const acredKeys = [...keys].filter(k=>k.startsWith('acred-'));
    if (acredKeys.length) {
      sec('🪪 ACREDITACIONES TEMPORALES');
      for (const a of state.acred.filter(a=>keys.has('acred-'+a.id))) {
        ln(`${a.nombre}${a.org?' · '+a.org:''}`, 9,[240,246,255],true);
        if(a.codigo) {
          ln(`Código: ${a.codigo}${a.hasta?' | Hasta: '+a.hasta:''}`,9,[139,165,196],false,4);
          const bc = await getBarcodeDataURL(a.codigo);
          if(bc) await img(bc,14);
        }
        await img(a.img,32);
      }
    }

    // Empresas
    const empKeys = [...keys].filter(k=>k.startsWith('empresa-'));
    if (empKeys.length) {
      sec('🏢 EMPRESAS');
      for(const e of (state.empresas||[]).filter(e=>keys.has('empresa-'+e.id))) {
        ln(e.nombre, 9,[240,246,255],true);
        if(e.contacto) ln(`Contacto: ${e.contacto}`,9,[139,165,196],false,4);
        if(e.tel)      ln(`Tel: ${e.tel}`,9,[139,165,196],false,4);
        if(e.email)    ln(`Email: ${e.email}`,9,[139,165,196],false,4);
        const tallaKeys = [{k:'mc',l:'Camiseta m/c'},{k:'ml',l:'Camiseta m/l'},{k:'pan',l:'Pantalón'},{k:'abr',l:'Abrigo'},{k:'chaq',l:'Chaqueta'},{k:'sind',l:'Sindotación'},{k:'gorra',l:'Gorra'}];
        const tallas = tallaKeys.filter(t=>(e.tallas||{})[t.k]).map(t=>t.l+': '+(e.tallas||{})[t.k]).join('  ·  ');
        if(tallas) ln('Tallas — '+tallas,8,[139,165,196],false,4);
      }
    }

    // Perfil médico
    if (keys.has('perfil_datos') || keys.has('perfil')) {
      sec('👤 DATOS PERSONALES');
      ln(`${p.nombre} ${p.apell}  |  Nac: ${p.nac||'—'}${p.tel?' | Tel: '+p.tel:''}`,9);
    }
    // Perfil salud
    if (keys.has('perfil_salud') || keys.has('perfil')) {
      sec('🏥 DATOS DE SALUD');
      if(p.sangre||p.altura||p.peso) ln(`Sangre: ${p.sangre||'—'}  |  Altura: ${p.altura||'—'}cm  |  Peso: ${p.peso||'—'}kg`,8,[139,165,196],false,4);
      if(p.alergias&&p.alergias!=='Ninguna') ln(`Alergias: ${p.alergias}`,8,[244,63,94],false,4);
      if(p.meds&&p.meds!=='Ninguno') ln(`Meds: ${p.meds}`,8,[139,165,196],false,4);
      if(p.enfermedades&&p.enfermedades!=='Ninguna') ln(`Enfermedades: ${p.enfermedades}`,8,[245,158,11],false,4);
    }

    // Footer
    pdf.setFontSize(7); pdf.setTextColor(61,84,112);
    pdf.text('SegurApp v2.0 · Creado por Salvador M.G.', W/2, 290, {align:'center'});

    const blob     = pdf.output('blob');
    const filename = `segurapp-${(p.apell||'informe').replace(/\s+/g,'_')}-${new Date().toISOString().slice(0,10)}.pdf`;
    const file     = new File([blob], filename, {type:'application/pdf'});

    if (cvShareMethod !== 'download' && navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({title:'SegurApp — Informe', files:[file]});
    } else {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a'); a.href=url; a.download=filename; a.click();
      URL.revokeObjectURL(url);
      showToast('📥 PDF guardado en descargas');
    }
  } catch(e) {
    console.error(e);
    showToast('⚠️ Error: '+e.message);
  }
}
exportCVPDF = exportCVPDFV9;

// Share selector buttons call this
function shareVia(method) {
  cvShareMethod = method;
  closeSheet();
  populateCVItems();
  showSheet('cv-select');
}

// Barcode helper
function getBarcodeDataURL(value) {
  return new Promise(resolve => {
    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.id = 'tmp-bc-'+Date.now();
      document.body.appendChild(svg);
      JsBarcode(svg, value, {format:'CODE128',lineColor:'#000',width:2.5,height:70,displayValue:true,fontSize:13,margin:6,background:'#fff'});
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas  = document.createElement('canvas');
      const im      = new Image();
      im.onload = () => {
        canvas.width=im.width; canvas.height=im.height;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='white'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(im,0,0);
        document.body.removeChild(svg);
        resolve(canvas.toDataURL('image/png'));
      };
      im.onerror = () => { document.body.removeChild(svg); resolve(null); };
      im.src = 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svgData)));
    } catch(e) { resolve(null); }
  });
}

// Barcode in acred card
function generateBarcode(value, svgId) {
  const el = document.getElementById(svgId);
  if (!el || !value) return;
  try {
    JsBarcode('#'+svgId, value, {format:'CODE128',lineColor:'#000',width:2.5,height:75,displayValue:true,fontSize:13,margin:6,background:'#fff'});
  } catch(e) {}
}

// ── ACREDITACIONES (Google Wallet style) ──────────────────────────

function renderAcred() { renderAcredV9(); };

function renderAcredV9() {
  const scroll = document.getElementById('acred-scroll');
  if (!scroll) return;
  document.getElementById('acred-count') && (document.getElementById('acred-count').textContent = state.acred.length);
  scroll.innerHTML = '';
  state.acred.forEach(a => {
    const col  = ACRED_COLORS[a.color] || ACRED_COLORS.blue;
    const safe = (a.img||'').replace(/'/g,"\\'");
    const card = document.createElement('div');
    card.className = 'acred-card acred-holo';
    card.style.background = col.bg;
    if (a.img) {
      card.style.padding = '0';
      card.innerHTML = `
        <div class="acred-stripe"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,.05) 40%,rgba(0,0,0,.65) 100%);z-index:2;border-radius:inherit;"></div>
        <img src="${a.img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;z-index:1;">
        <div style="position:absolute;bottom:0;left:0;right:0;z-index:3;padding:10px 12px;">
          <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.7);">${a.nombre}</div>
          ${a.org?`<div style="font-size:10px;color:rgba(255,255,255,.75);">${a.org}</div>`:''}
          ${a.codigo?`<div style="font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:${col.accent};text-shadow:0 1px 3px rgba(0,0,0,.6);">${a.codigo}</div>`:''}
          ${a.hasta?`<div style="font-size:9px;color:rgba(255,255,255,.55);">Expira: ${a.hasta}</div>`:''}
        </div>`;
    } else {
      const codeType = a.codeType || 'barcode';
      const showBarcode = a.codigo && codeType === 'barcode';
      const showQR      = a.codigo && codeType === 'qr';
      card.innerHTML = `
        <div class="acred-stripe"></div>
        <div class="acred-card-decor" style="background:${col.decor}"></div>
        <div class="acred-top">
          <div class="acred-org">${a.org||'Acreditación'}</div>
          <div class="acred-type" style="color:${col.accent}">Temporal</div>
        </div>
        <div class="acred-mid">
          <div class="acred-name">${a.nombre}</div>
          <div class="acred-holder">${a.titular||''}</div>
        </div>
        ${showBarcode ? `<div class="acred-barcode-wrap"><svg id="bc-${a.id}"></svg></div>` : ''}
        ${showQR ? `<div style="display:flex;justify-content:center;padding:4px 0;position:relative;z-index:2;"><canvas id="qrc-${a.id}" style="width:90px;height:90px;"></canvas></div>` : ''}
        ${!showBarcode&&!showQR&&a.hasta?`<div class="acred-dates"><div class="acred-exp-lbl">EXPIRA</div><div class="acred-exp" style="color:${col.accent}">${a.hasta}</div></div>`:''}
        ${a.codigo&&!showBarcode&&!showQR?`<div style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:${col.accent};text-align:center;position:relative;z-index:2;padding-top:4px;">${a.codigo}</div>`:''}`;
    }
    card.addEventListener('click', () => openAcredDetailV9(a.id));
    scroll.appendChild(card);
    if (!a.img) {
      const ct = a.codeType || 'barcode';
      if (a.codigo && ct === 'barcode') setTimeout(() => generateBarcode(a.codigo,'bc-'+a.id), 60);
      if (a.codigo && ct === 'qr')      setTimeout(() => generateQROnCanvas(a.codigo, document.getElementById('qrc-'+a.id)), 60);
    }
  });
  // Add button
  const addBtn = document.createElement('button');
  addBtn.className = 'acred-add-btn';
  addBtn.innerHTML = '<span style="font-size:26px;">＋</span><span>Añadir<br>acreditación</span>';
  addBtn.addEventListener('click', () => showSheet('add-acred'));
  scroll.appendChild(addBtn);
  // Dots
  const dots = document.getElementById('acred-dots');
  if (dots) {
    dots.innerHTML = state.acred.map((_,i)=>`<div style="width:6px;height:6px;border-radius:50%;background:${i===0?'var(--pri)':'var(--b)'};" data-i="${i}"></div>`).join('');
    scroll.onscroll = () => {
      const idx = Math.round(scroll.scrollLeft / 292);
      dots.querySelectorAll('div').forEach((d,i) => d.style.background = i===idx?'var(--pri)':'var(--b)');
    };
  }
}

function openAcredDetailV9(id) {
  currentAcredId = id;
  const a = state.acred.find(x => x.id === id); if (!a) return;
  document.getElementById('acred-detail-title').textContent = a.nombre;
  const col  = ACRED_COLORS[a.color] || ACRED_COLORS.blue;
  const card = document.getElementById('acred-detail-card-holo');
  card.className = 'acred-detail-card acred-holo';
  card.style.background = col.bg;
  if (a.img) {
    const safe = a.img.replace(/'/g,"\\'");
    card.style.padding = '0'; card.style.overflow = 'hidden';
    card.innerHTML = `<div class="acred-stripe"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.65) 100%);z-index:2;border-radius:inherit;"></div>
      <img src="${a.img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;z-index:1;">
      <div style="position:absolute;bottom:0;left:0;right:0;z-index:3;padding:14px 16px;">
        <div style="font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7);">${a.nombre}</div>
        ${a.org?`<div style="font-size:12px;color:rgba(255,255,255,.7);">${a.org}</div>`:''}
        ${a.codigo?`<div style="font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:${col.accent};">${a.codigo}</div>`:''}
      </div>`;
  } else {
    card.style.padding = '16px';
    card.innerHTML = `<div class="acred-stripe"></div>
      <div class="acred-card-decor" style="background:${col.decor}"></div>
      <div style="position:relative;z-index:2;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--t2);text-transform:uppercase;margin-bottom:6px;">${a.org||'Acreditación temporal'}</div>
        <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--t1);">${a.nombre}</div>
        <div style="font-size:13px;color:var(--t2);margin-top:3px;">${a.titular||''}</div>
      </div>
      ${a.codigo?`<div class="acred-barcode-wrap" style="position:relative;z-index:2;margin-top:10px;"><svg id="bc-detail-${id}"></svg></div>`:''}`;
    if (a.codigo) setTimeout(() => generateBarcode(a.codigo,'bc-detail-'+id), 60);
  }
  document.getElementById('acred-detail-data').innerHTML = `
    <div class="data-title">Detalles</div>
    <div class="field"><span class="field-ico">🏢</span><div><div class="field-lbl">Organización</div><div class="field-val">${a.org||'—'}</div></div></div>
    <div class="field"><span class="field-ico">👤</span><div><div class="field-lbl">Titular</div><div class="field-val">${a.titular||'—'}</div></div></div>
    <div class="field"><span class="field-ico">🔢</span><div><div class="field-lbl">Código</div><div class="field-val t-mono">${a.codigo||'—'}</div></div></div>
    <div class="field"><span class="field-ico">📅</span><div><div class="field-lbl">Desde</div><div class="field-val t-mono">${a.desde||'—'}</div></div></div>
    <div class="field"><span class="field-ico">⏱️</span><div><div class="field-lbl">Hasta</div><div class="field-val t-mono">${a.hasta||'—'}</div></div></div>`;
  nav('acred-detail');
}

openAcredDetail = openAcredDetailV9;

function editCurrentAcred() {
  const a = state.acred.find(x => x.id === currentAcredId);
  if (a) openAcredForm(a);
}
function deleteCurrentAcred() {
  if (!confirm('¿Eliminar esta acreditación?')) return;
  state.acred = state.acred.filter(a => a.id !== currentAcredId);
  saveState(); renderAcredV9(); nav('wallet');
  showToast('Acreditación eliminada');
}

// ── PRESENTAR ────────────────────────────────────────────────────
function presentDoc(doc) {
  const pm = document.getElementById('present-mode');
  const pc = document.getElementById('present-card');
  if (!pm || !pc) return;
  pm.classList.add('on');
  const H = (bg,decor,wm,content) => `
    <div class="holo-card" style="background:${bg};border-radius:20px;padding:20px;border:1px solid rgba(255,255,255,.08);position:relative;overflow:hidden;">
      <div class="sec-border"></div><div class="holo-stripe"></div>
      <div class="holo-wm"><div class="holo-wm-text">${wm}</div></div>
      <div style="position:absolute;width:190px;height:190px;border-radius:50%;background:${decor};top:-55px;right:-45px;filter:blur(32px);"></div>
      ${content}</div>`;
  if (doc==='dni') {
    const d = state.dni;
    pc.innerHTML = H('linear-gradient(135deg,#1E3A5F,#040d1a)','rgba(79,142,247,.4)','DNI · ESPAÑA · VÁLIDO',`
      <div style="text-align:center;font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,.4);margin-bottom:14px;position:relative;z-index:2;">REINO DE ESPAÑA</div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;position:relative;z-index:2;">
        <div style="width:52px;height:52px;border-radius:9px;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-size:28px;">🇪🇸</div>
        <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;">${d.apell||'APELLIDOS'}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.55);">${d.nombre||'Nombre'}</div>
          <div style="font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:#4F8EF7;letter-spacing:3px;margin-top:4px;">${d.num||'· · · · · · · ·'}</div></div>
      </div>
      <div style="display:flex;gap:18px;border-top:1px solid rgba(255,255,255,.06);padding-top:10px;position:relative;z-index:2;">
        <div><div style="font-size:8px;color:rgba(255,255,255,.3);font-weight:700;letter-spacing:2px;">NAC.</div><div style="font-family:'Space Mono',monospace;font-size:11px;">${d.nac||'—'}</div></div>
        <div><div style="font-size:8px;color:rgba(255,255,255,.3);font-weight:700;letter-spacing:2px;">EXPIRA</div><div style="font-family:'Space Mono',monospace;font-size:11px;">${d.exp||'—'}</div></div>
      </div>`);
  } else if (doc==='tip') {
    const d=state.tip; const habs=d.habs||{}; const extra=d.habsExtra||{};
    const active=[...HAB_ROLES_V9.filter(r=>!r.hasExp&&habs[r.key]),...HAB_ROLES_V9.filter(r=>r.hasExp&&extra[r.key]?.tip)];
    pc.innerHTML = H('linear-gradient(135deg,#1A3A2A,#040e08)','rgba(16,185,129,.35)','SEGURIDAD PRIVADA · TIP VÁLIDO',`
      <div style="text-align:center;font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,.38);margin-bottom:14px;position:relative;z-index:2;">TARJETA IDENTIDAD PROFESIONAL</div>
      <div style="display:flex;align-items:center;gap:13px;margin-bottom:13px;position:relative;z-index:2;">
        <div style="width:50px;height:50px;border-radius:50%;border:2px solid rgba(16,185,129,.38);background:rgba(16,185,129,.09);display:flex;align-items:center;justify-content:center;font-size:24px;">🛡️</div>
        <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;">${d.apell||'APELLIDOS'}</div><div style="font-size:12px;color:rgba(255,255,255,.52);">${d.nombre||'Nombre'}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;border-top:1px solid rgba(255,255,255,.06);padding-top:10px;position:relative;z-index:2;">
        ${active.map(r=>{const val=r.hasExp?extra[r.key]?.tip:habs[r.key];return`<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,.04);border-radius:8px;padding:6px 9px;"><span style="font-size:11px;color:rgba(255,255,255,.58);">${r.label}</span><span style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:${r.color};">${val}</span></div>`;}).join('')}
      </div>`);
  } else if (doc==='aesa') {
    const d = state.aesa;
    const qr = state.photos['aesa-qr'];
    pc.innerHTML = H('linear-gradient(135deg,#2D1B4E,#07040F)','rgba(168,85,247,.35)','AESA · LICENCIA PILOTO',`
      <div style="display:flex;justify-content:center;margin-bottom:14px;position:relative;z-index:2;"><div style="background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.26);border-radius:20px;padding:3px 12px;font-size:11px;font-weight:800;color:#F59E0B;letter-spacing:3px;">✈️ AESA</div></div>
      <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;position:relative;z-index:2;">
        <div style="font-size:36px;margin-bottom:5px;">🚁</div>
        <div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,.38);">PILOTO DE DRONES</div>
        <div style="background:rgba(245,158,11,.13);border:1px solid rgba(245,158,11,.33);border-radius:20px;padding:5px 18px;font-size:13px;font-weight:700;color:#F59E0B;margin-top:9px;">${d.cat||'A1/A3'}</div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:10px;position:relative;z-index:2;text-align:center;">
        <div style="font-size:8px;font-weight:700;color:rgba(255,255,255,.3);letter-spacing:2px;margin-bottom:3px;">TITULAR</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${(d.nombre+' '+d.apell).trim()}</div>
        <div style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:#F59E0B;">${d.id||'—'}</div>
      </div>
      ${qr?`<div style="display:flex;justify-content:center;margin-top:14px;position:relative;z-index:2;">
        <div style="background:white;border-radius:16px;padding:10px;cursor:pointer;" onclick="openViewer(state.photos['aesa-qr'],'QR verificación AESA')">
          <img src="${qr}" style="width:min(55vw,220px);height:min(55vw,220px);object-fit:contain;display:block;">
        </div>
      </div>
      <div style="text-align:center;font-size:10px;color:rgba(255,255,255,.35);margin-top:6px;position:relative;z-index:2;">Toca el QR para ampliar</div>`:
      `<div style="text-align:center;margin-top:14px;font-size:11px;color:rgba(255,255,255,.3);">Sin QR · añade uno en la pantalla AESA</div>`}
      `);
  }
};

// ── MASTER renderAll ──────────────────────────────────────────────
function renderAll() {
  patchState();
  document.documentElement.setAttribute('data-theme','dark');
  try { renderDNI();        } catch(e) { console.warn('renderDNI',e); }
  try { renderTIPFull();    } catch(e) { console.warn('renderTIP',e); }
  try { renderAESA();       } catch(e) { console.warn('renderAESA',e); }
  try { renderCursosV9();   } catch(e) { console.warn('renderCursos',e); }
  try { renderPerfilFull(); } catch(e) { console.warn('renderPerfil',e); }
  try { renderPDFBankSS();  } catch(e) { console.warn('renderSS',e); }
  try { renderDocs();       } catch(e) { /* SS/banco no longer in docs */ }
  try { renderAcredV9();    } catch(e) { console.warn('renderAcred',e); }
  try { renderEmpresas();   } catch(e) { console.warn('renderEmpresas',e); }
  try { renderPDFLibrary(); } catch(e) { console.warn('renderPDFLib',e); }
  try { loadAllPhotos();    } catch(e) { console.warn('loadPhotos',e); }
  try { checkExpiry();      } catch(e) { console.warn('checkExpiry',e); }
  try { updateHoloBadge();  } catch(e) {}
  if (state.gyro) try { startGyro(); } catch(e) {}
};

// ── INIT ──────────────────────────────────────────────────────────

// ── ACRED FORM: Code type selector + live preview ──────────────

function selectAcredCodeType(type) {
  acredCodeType = type;
  // Update button styles
  document.querySelectorAll('.acred-code-type-btn').forEach(btn => {
    const isOn = btn.dataset.type === type;
    btn.style.border = isOn ? '2px solid var(--pri)' : '2px solid var(--b)';
    btn.style.background = isOn ? 'var(--pri-g)' : 'transparent';
    btn.style.color = isOn ? 'var(--pri)' : 'var(--t2)';
    if (isOn) btn.classList.add('on'); else btn.classList.remove('on');
  });
  document.getElementById('i-acred-code-type').value = type;
  // Refresh preview
  const val = document.getElementById('i-acred-codigo')?.value?.trim();
  onAcredCodigoInput(val || '');
}

function onAcredCodigoInput(value) {
  const preview = document.getElementById('acred-code-preview');
  const bcSvg   = document.getElementById('acred-form-bc-svg');
  const qrCanvas= document.getElementById('acred-form-qr-canvas');
  if (!preview) return;

  const type = acredCodeType || 'barcode';
  const val  = (value || '').trim();

  if (!val || type === 'none') {
    preview.style.display = 'none';
    return;
  }
  preview.style.display = 'block';

  if (type === 'barcode' && bcSvg) {
    if (qrCanvas) qrCanvas.style.display = 'none';
    bcSvg.style.display = '';
    try {
      JsBarcode(bcSvg, val, {
        format:'CODE128', lineColor:'#000', width:2.5, height:75,
        displayValue:true, fontSize:13, margin:8, background:'#fff'
      });
    } catch(e) { /* value too short or invalid */ }
  } else if (type === 'qr' && qrCanvas) {
    bcSvg.style.display = 'none';
    qrCanvas.style.display = '';
    qrCanvas.style.width = '130px';
    qrCanvas.style.height = '130px';
    // Generate QR using a simple approach
    generateQROnCanvas(val, qrCanvas);
  }
}

// Simple QR generation using a data URL approach
// We'll use a free QR API for display purposes, or generate inline
function generateQROnCanvas(text, canvas) {
  // Use Google Charts QR API as fallback
  const size = 130;
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = size; canvas.height = size;
    ctx.fillStyle = 'white'; ctx.fillRect(0,0,size,size);
    ctx.drawImage(img, 0, 0, size, size);
  };
  img.onerror = () => {
    // Fallback: just show text
    const ctx = canvas.getContext('2d');
    canvas.width = 130; canvas.height = 130;
    ctx.fillStyle = 'white'; ctx.fillRect(0,0,130,130);
    ctx.fillStyle = '#333'; ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR: '+text.slice(0,20), 65, 65);
  };
  // Use QR API (works offline would need a lib, online use API)
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(text)}`;
}

// Override openAcredForm to reset code type and preview
function openAcredForm(acred=null){
  editingAcredId = acred ? acred.id : null;
  acredImgB64 = '';
  // Title
  const titleEl = document.getElementById('acred-form-title');
  if(titleEl) titleEl.textContent = acred ? 'Editar acreditación' : 'Nueva acreditación';
  // Fill fields
  const g = id => document.getElementById(id);
  if(g('i-acred-nombre'))  g('i-acred-nombre').value  = acred?.nombre  || '';
  if(g('i-acred-org'))     g('i-acred-org').value     = acred?.org     || '';
  if(g('i-acred-titular')) g('i-acred-titular').value = acred?.titular || (state.perfil.nombre+' '+state.perfil.apell).trim();
  if(g('i-acred-codigo'))  g('i-acred-codigo').value  = acred?.codigo  || '';
  if(g('i-acred-desde'))   g('i-acred-desde').value   = acred?.desde   || '';
  if(g('i-acred-hasta'))   g('i-acred-hasta').value   = acred?.hasta   || '';
  // Color
  acredColor = acred?.color || 'blue';
  selectAcredColor(acredColor);
  // Image preview
  const prev = g('prev-acred-img');
  const ph   = g('ph-acred-img');
  if(acred?.img){
    acredImgB64 = acred.img;
    if(prev){ prev.innerHTML=`<img src="${acred.img}" style="width:100%;border-radius:10px;">`; prev.style.display='block'; }
    if(ph) ph.style.display='none';
  } else {
    if(prev){ prev.innerHTML=''; prev.style.display='none'; }
    if(ph) ph.style.display='flex';
  }
  // Code type selector
  acredCodeType = acred?.codeType || 'barcode';
  try { selectAcredCodeType(acredCodeType); } catch(e) {}
  // Live barcode/QR preview
  const codigo = acred?.codigo || '';
  try { if(codigo) onAcredCodigoInput(codigo); else { const p = g('acred-code-preview'); if(p) p.style.display='none'; } } catch(e) {}
  // Open sheet
  showSheet('acred-form');
};

// saveAcred extended to save codeType
// The original saveAcred in app.js creates the acred object.
// We patch it to add codeType after saving.
function saveAcred() {
  const prevLen = state.acred.length;
  _saveAcredBase();
  // If a new acred was added, attach codeType
  if (state.acred.length > prevLen) {
    state.acred[state.acred.length - 1].codeType = acredCodeType;
    saveState();
    renderAcredV9();
  }
};

(function init() {
  patchState();
  // Nav: empresas tab
  const niEmp = document.getElementById('ni-empresas');
  if (niEmp) niEmp.onclick = () => switchTab('empresas');
  // Gyro label
  const gl = document.getElementById('gyro-label');
  if (gl) gl.textContent = state.gyro ? 'Desactivar giroscopio' : 'Activar giroscopio';
})();

console.log('SegurApp v9 ✅ loaded');




// ── OCR DATA EXTRACTION ─────────────────────────────────────────
function extractData(text, context){
  if(!text) return {};
  const t = text.toUpperCase();
  const result = {};
  const ex = (pats) => { for(const p of pats){ const m=text.match(p)||t.match(p); if(m&&m[1]) return m[1].trim(); } return null; };

  if(context==='dni'){
    const n=ex([/(\d{8}[A-Z])/]);if(n)result.num=n;
    const nom=ex([/NOMBRE[:\s]+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,25})/i]);if(nom)result.nombre=nom.trim();
    const ap=ex([/APELLIDOS?[:\s]+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,35})/i]);if(ap)result.apell=ap.trim();
    const dates=text.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/g)||[];
    if(dates[0])result.nac=dates[0].replace(/[-\.]/g,'/');
    if(dates[1])result.exp=dates[1].replace(/[-\.]/g,'/');
  } else if(context==='aesa'){
    const id=ex([/(ESP-RP-\d{6,15})/]);if(id)result.id=id;
    const cat=ex([/(A1\/A3|A1|A2|A3)/]);if(cat)result.cat=cat;
  } else if(context==='banco'){
    const iban=ex([/(ES\d{2}[\s\d]{18,26})/,/IBAN[:\s]+(ES[\d\s]{20,26})/]);if(iban)result.iban=iban.replace(/\s+/g,'');
    const bic=ex([/BIC[:\s]+([A-Z]{4}ES[A-Z0-9]{2,5})/,/([A-Z]{4}ES[A-Z0-9]{2,5})/]);if(bic)result.bic=bic;
    const banco=ex([/(CAIXABANK|SANTANDER|BBVA|SABADELL|BANKINTER|UNICAJA)/i]);if(banco)result.banco=banco;
  } else if(context==='diploma'){
    const code=ex([/(SEAD\w+PO)/i]);if(code)result.code=code.toUpperCase();
    const ent=ex([/(SEPE|FUNDAE|FOREM|ISEED|CSIF)/i]);if(ent)result.entidad=ent;
    const h=ex([/(\d{2,3})\s*HORAS?/i]);if(h&&parseInt(h)<500)result.horas=h;
    const f=text.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/);if(f)result.fecha=f[0].replace(/[-\.]/g,'/');
  } else if(context==='acred'){
    const org=ex([/EMPRESA[:\s]+([A-ZÁÉÍÓÚÑ][^\.]{3,30})/i]);if(org)result.org=org;
    const cod=ex([/N[ºO][:\s]+([A-Z0-9\-]{4,20})/,/C[OÓ]DIGO[:\s]+([A-Z0-9\-]{4,20})/i]);if(cod)result.codigo=cod;
  }
  return result;
}

function autoFillFields(data, context, rawText){
  if(context==='dni'){
    if(document.getElementById('dni-view')?.style.display!=='none') editDoc('dni');
    if(data.num){state.dni.num=data.num;const el=document.getElementById('i-dni-num');if(el)el.value=data.num;}
    if(data.nombre){state.dni.nombre=data.nombre;const el=document.getElementById('i-dni-nombre');if(el)el.value=data.nombre;}
    if(data.apell){state.dni.apell=data.apell;const el=document.getElementById('i-dni-apell');if(el)el.value=data.apell;}
    if(data.nac){state.dni.nac=data.nac;const el=document.getElementById('i-dni-nac');if(el)el.value=data.nac;}
    if(data.exp){state.dni.exp=data.exp;const el=document.getElementById('i-dni-exp');if(el)el.value=data.exp;}
    saveState(); renderDNI();
  } else if(context==='aesa'){
    if(document.getElementById('aesa-view')?.style.display!=='none') editDoc('aesa');
    if(data.id){const el=document.getElementById('i-aesa-id');if(el)el.value=data.id;}
    if(data.cat){const el=document.getElementById('i-aesa-cat');if(el)el.value=data.cat;}
  } else if(context==='banco'){
    if(document.getElementById('banco-view')?.style.display!=='none') editDoc('banco');
    if(data.iban){const el=document.getElementById('i-banco-iban');if(el)el.value=data.iban;}
    if(data.bic){const el=document.getElementById('i-banco-bic');if(el)el.value=data.bic;}
    if(data.banco){const el=document.getElementById('i-banco-banco');if(el)el.value=data.banco;}
  } else if(context==='diploma'){
    const c=state.cursos.find(x=>x.id===activeCursoId);
    if(c){
      if(data.code){c.code=data.code;const el=document.getElementById('ie-c-code');if(el)el.value=data.code;}
      if(data.entidad){c.entidad=data.entidad;const el=document.getElementById('ie-c-entidad');if(el)el.value=data.entidad;}
      if(data.horas){c.horas=data.horas;const el=document.getElementById('ie-c-horas');if(el)el.value=data.horas;}
      if(data.fecha){c.fecha=data.fecha;const el=document.getElementById('ie-c-fecha');if(el)el.value=data.fecha;}
      saveState(); renderCursosV9();
      openCursoEditSheet();
    }
  } else if(context==='acred'){
    if(data.org){const el=document.getElementById('i-acred-org');if(el)el.value=data.org;}
    if(data.codigo){const el=document.getElementById('i-acred-codigo');if(el){el.value=data.codigo;onAcredCodigoInput(data.codigo);}}
  }
}

// ── SMART CAPTURE (photo + PDF with auto OCR) ─────────────────
async function smartCapture(inp, photoKey, context){
  const f = inp.files[0]; if(!f) return; inp.value='';
  const isPDF = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  const aiOverlay = document.getElementById('ai-overlay');
  const aiText = document.getElementById('ai-text');
  const aiSub  = document.getElementById('ai-sub');
  const aiBar  = document.getElementById('ai-progress-bar');
  const aiPct  = document.getElementById('ai-percent');
  const aiTimer= document.getElementById('ai-timer');

  const setProgress = (pct, msg) => {
    if(aiBar)  aiBar.style.width = pct+'%';
    if(aiPct)  aiPct.textContent = Math.round(pct)+'%';
    if(msg && aiSub) aiSub.textContent = msg;
  };

  // Start timer
  let elapsed = 0;
  const timerInterval = setInterval(() => {
    elapsed++;
    if(aiTimer) aiTimer.textContent = elapsed+'s';
  }, 1000);

  if(aiText) aiText.innerHTML = 'Analizando<span class="ai-dots"><span>.</span><span>.</span><span>.</span></span>';
  setProgress(5, isPDF ? 'Leyendo PDF…' : 'Cargando imagen…');
  if(aiOverlay) aiOverlay.classList.add('on');

  try{
    let imageB64 = null, ocrText = '';

    if(isPDF && typeof pdfjsLib !== 'undefined'){
      setProgress(15, 'Procesando PDF…');
      const ab = await f.arrayBuffer();
      setProgress(30, 'Renderizando página…');
      const pdf = await pdfjsLib.getDocument({data: ab}).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({scale:2.0});
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
      imageB64 = canvas.toDataURL('image/jpeg', 0.9);
      setProgress(55, 'Extrayendo texto del PDF…');
      try{
        const tc = await page.getTextContent();
        ocrText = tc.items.map(i=>i.str).join(' ');
      }catch(e){}
      setProgress(75, ocrText ? 'Texto extraído ✓' : 'Sin capa de texto, usando OCR…');
    } else {
      setProgress(20, 'Leyendo imagen…');
      imageB64 = await new Promise((res,rej)=>{
        const r = new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsDataURL(f);
      });
      setProgress(40, 'Imagen cargada ✓');
    }

    if(!ocrText && imageB64 && typeof Tesseract !== 'undefined'){
      setProgress(50, 'Iniciando OCR…');
      try{
        const result = await Tesseract.recognize(imageB64,'spa+eng',{
          logger: m => {
            if(m.status==='recognizing text'){
              const pct = 50 + Math.round(m.progress*35);
              setProgress(pct, 'OCR: '+Math.round(m.progress*100)+'%');
            }
          }
        });
        ocrText = result.data.text || '';
      }catch(e){}
    }

    setProgress(90, 'Guardando…');
    clearInterval(timerInterval);
    if(aiOverlay) aiOverlay.classList.remove('on');

    // Save photo
    if(imageB64){
      if(photoKey==='rec-foto'){
        recFotoB64=imageB64;
        const prev=document.getElementById('prev-rec-foto');
        if(prev){prev.innerHTML=`<img src="${imageB64}" style="width:100%;border-radius:10px;">`;prev.style.display='block';}
        const ph=document.getElementById('ph-rec-foto');if(ph)ph.style.display='none';
      } else if(photoKey==='acred-img'){
        acredImgB64=imageB64;
        const prev=document.getElementById('prev-acred-img');
        if(prev){prev.innerHTML=`<img src="${imageB64}" style="width:100%;border-radius:10px;">`;prev.style.display='block';}
        const ph=document.getElementById('ph-acred-img');if(ph)ph.style.display='none';
      } else {
        state.photos[photoKey]=imageB64; saveState(); applyPhoto(photoKey,imageB64);
      }
    }

    // Auto-fill from OCR
    if(ocrText.trim()){
      const data = extractData(ocrText, context);
      if(Object.keys(data).length>0){
        autoFillFields(data, context, ocrText);
        showToast('✅ '+Object.keys(data).length+' campos rellenados automáticamente');
      } else {
        showToast('📷 Guardado · Sin datos detectados');
      }
    } else {
      showToast('📷 Archivo guardado');
    }
  }catch(err){
    clearInterval(timerInterval);
    if(aiOverlay) aiOverlay.classList.remove('on');
    console.error('smartCapture error:', err);
    showToast('⚠️ Error procesando archivo');
  }
}

// ── DELETE PHOTO ────────────────────────────────────────────────
function deletePhoto(key){
  if(!confirm('¿Eliminar esta foto?')) return;
  delete state.photos[key]; saveState();
  const photoMap = {
    'dni-front':{p:'prev-dni-front',ph:'ph-dni-front'},
    'dni-back' :{p:'prev-dni-back', ph:'ph-dni-back'},
    'tip-front':{p:'prev-tip-front',ph:'ph-tip-front'},
    'tip-back' :{p:'prev-tip-back', ph:'ph-tip-back'},
    'aesa-cert':{p:'prev-aesa-cert',ph:'ph-aesa-cert'},
    'banco-cert':{p:'prev-banco-cert',ph:'ph-banco-cert'},
    'ss-doc'   :{p:'prev-ss-doc',   ph:'ph-ss-doc'},
  };
  const m = photoMap[key];
  if(m){
    const prev=document.getElementById(m.p);if(prev){prev.innerHTML='';prev.style.display='none';}
    const ph=document.getElementById(m.ph);if(ph)ph.style.display='flex';
  }
  if(key==='aesa-qr'){
    const p=document.getElementById('prev-aesa-qr');if(p){p.innerHTML='';p.style.display='none';}
    const ph=document.getElementById('ph-aesa-qr');if(ph)ph.style.display='flex';
    const st=document.getElementById('aesa-qr-status');if(st){st.className='qr-empty';st.textContent='QR no añadido';}
    const hero=document.getElementById('aesa-qr-hero');if(hero)hero.style.display='none';
    const delRow=document.getElementById('aesa-qr-del-row');if(delRow)delRow.style.display='none';
  }
  showToast('🗑️ Foto eliminada');
}

// ── IMPORT BACKUP ───────────────────────────────────────────────
function importBackup(inp){
  const f=inp.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!data.perfil||!data.cursos) throw new Error('Formato inválido');
      if(!confirm('¿Importar backup?\nSe reemplazarán todos los datos actuales.')) return;
      Object.assign(state, data);
      patchState();
      saveState();
      renderAll();
      showToast('✅ Backup importado correctamente');
    }catch(e){
      showToast('❌ Error: archivo no válido');
    }
  };
  r.readAsText(f); inp.value='';
}

// ── ONBOARDING ────────────────────────────────────────────────
function checkOnboarding() {
  const p = state.perfil;
  if (!p.nombre || !p.apell) {
    showOnboarding();
  } else {
    updateHoloBadge();
  }
}

function showOnboarding() {
  const ob = document.getElementById('onboarding');
  ob.style.display = 'flex';
  ob.style.opacity = '1';
  ob.style.transform = 'none';
  // Clear any previous border errors
  ['ob-nombre','ob-apell'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.borderColor = ''; el.value = ''; }
  });
  setTimeout(() => document.getElementById('ob-nombre')?.focus(), 300);
}

function finishOnboarding() {
  const nombre = (document.getElementById('ob-nombre')?.value || '').trim();
  const apell  = (document.getElementById('ob-apell')?.value  || '').trim();
  if (!nombre) { document.getElementById('ob-nombre').style.borderColor='var(--err)'; return; }
  if (!apell)  { document.getElementById('ob-apell').style.borderColor='var(--err)';  return; }
  state.perfil.nombre = nombre;
  state.perfil.apell  = apell;
  saveState();
  // Animate out
  const ob = document.getElementById('onboarding');
  ob.style.transition = 'opacity .4s, transform .4s';
  ob.style.opacity = '0';
  ob.style.transform = 'scale(1.04)';
  setTimeout(() => {
    ob.style.display = 'none';
    updateHoloBadge();
    renderAll();
  }, 420);
}

// ── HOLOGRAPHIC SECURITY BADGE ────────────────────────────────
function updateHoloBadge() {
  const p = state.perfil;
  if (!p.nombre || !p.apell) return;
  const badge = document.getElementById('holo-badge');
  if (!badge) return;
  badge.style.display = 'block';

  // Full name
  const nameEl = document.getElementById('holo-name');
  if (nameEl) nameEl.textContent = (p.apell + ', ' + p.nombre).toUpperCase();

  // Security code derived from name + TIP
  const tip = state.tip.habs?.vs || state.tip.habs?.ve || '';
  const seed = (p.nombre + p.apell + tip).toUpperCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  const code = 'SP-' + Math.abs(hash).toString(16).toUpperCase().padStart(8,'0').slice(0,8);
  const codeEl = document.getElementById('holo-code');
  if (codeEl) codeEl.textContent = code;

  // Microtext strip (repeating name)
  const micro = document.getElementById('holo-microtext');
  if (micro) {
    const repeat = (p.apell + ' · ' + p.nombre + ' · ').repeat(6);
    micro.textContent = repeat;
  }
}

// ── BOOT ─────────────────────────────────────────────────────
function bootApp() {
  // Carga desde Droid (JavascriptInterface nativo) si está disponible
  if (window.Droid) {
    try {
      const nativeData = window.Droid.load();
      if (nativeData && nativeData.length > 10) {
        applyLoadedData(JSON.parse(nativeData));
        try { localStorage.setItem(DB_KEY, nativeData); } catch(e) {}
      }
    } catch(e) {}
  }
  // Fallback localStorage
  loadState();
  document.documentElement.setAttribute('data-theme','dark');
  patchState();
  setupExitSave();
  initLock();
  if (!state.pin) {
    renderAll();
    checkOnboarding();
  }
}

// Espera a que window.Droid esté disponible (JavascriptInterface tarda un poco)
// Si no está en 3 segundos, arranca sin él (navegador web normal)
let _bootTries = 0;
function waitForDroidAndBoot() {
  if (window.Droid) {
    bootApp();
  } else if (_bootTries < 30) {
    _bootTries++;
    setTimeout(waitForDroidAndBoot, 100);
  } else {
    // No hay Droid (navegador web) — arranca normal
    bootApp();
  }
}
waitForDroidAndBoot();
