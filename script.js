'use strict';
/* ============ CONFIG — edit values here ============ */
const CONFIG = {
  server: { name: 'VISION ROLEPLAY', ip: 'connect.VISION-rp.com', port: 7777, maxPlayers: 1000, players: 0, ping: 24, online: true },
  // Set to a real endpoint later, e.g. '/api/status' returning { online, players, maxPlayers, ping }
  statusApi: null,
  simulateLive: true,
  discordMembers: 10570,
  discordUrl: 'https://VISION-rp.com/discord'
};
const STATS = [
  { label: 'حساب مسجّل', value: 3438 }, { label: 'لاعب في القائمة البيضاء', value: 786 },
  { label: 'عضو إدارة', value: 10 }, { label: 'من أفضل اللاعبين', value: 136 },
  { label: 'عضو في ديسكورد', value: 10570 }
];
const FEATURES = [
  ['💼','الوظائف','مهن قانونية وغير قانونية لبناء حياة شخصيتك.'],
  ['🏴','الفصائل','انضم إلى فصائل منظمة برتب ومسؤوليات واضحة.'],
  ['🏪','الأعمال التجارية','امتلك مشاريعك وأدِرها ونمِّها في أنحاء سان أندرياس.'],
  ['🚗','المركبات','اشترِ مجموعة واسعة من المركبات وخصّصها وأمّنها.'],
  ['🏠','العقارات','منازل وشقق تجعلها ملكك الخاص.'],
  ['🎒','نظام الحقيبة','حقيبة قائمة على العناصر لتجربة لعب واقعية.'],
  ['💰','الاقتصاد','اقتصاد متوازن يحرّكه اللاعبون.'],
  ['🚓','قسم الشرطة','طبّق القانون بإجراءات واقعية.'],
  ['🚑','القسم الطبي','أنقذ الأرواح كمسعف أو طبيب.'],
  ['🏛️','الحكومة','شارك في صنع القرار في المدينة عبر السياسة والإدارة.'],
  ['🕶️','المنظمات','عصابات وعائلات وفرق بقصص عميقة.'],
  ['🎉','الفعاليات','فعاليات مجتمعية دورية وأنشطة خاصة.'],
  ['⚙️','أنظمة مخصصة','سكربتات فريدة صُنعت خصيصًا لـ VISION.']
];
// Staff from the current website. Add `link` (e.g. Discord profile) per member when available.
const STAFF = [
  { name: 'SiMo', role: 'مطوّر' }, { name: 'REDSHELBY', role: 'المالك' },
  { name: 'Jvvvvvck', role: 'شريك المالك' }, { name: 'Amine', role: 'مدير' },
  { name: 'ILYASS', role: 'الإدارة العليا' }, { name: 'RED', role: 'الإدارة العليا' },
  { name: 'R O B O C O', role: 'مشرف دعم أول' }, { name: 'aya', role: 'مشرف دعم أول' },
  { name: 'Chrollo', role: 'دعم' }, { name: 'Monster', role: 'دعم' }
].map(s => ({ link: CONFIG.discordUrl, ...s }));
// Paste real YouTube links / thumbnails here. thumb can be '' for a placeholder.
const VIDEOS = [
  { title: 'عنوان الفيديو قريبًا', creator: 'اسم صانع المحتوى', url: 'https://youtube.com/@VISION_roleplay', thumb: '' },
  { title: 'عنوان الفيديو قريبًا', creator: 'اسم صانع المحتوى', url: 'https://youtube.com/@VISION_roleplay', thumb: '' },
  { title: 'عنوان الفيديو قريبًا', creator: 'اسم صانع المحتوى', url: 'https://youtube.com/@VISION_roleplay', thumb: '' }
];
const ALL = 'الكل'; // label of the "show everything" news filter
const NEWS = [
  { title: 'أهلًا بكم في الموقع الجديد', desc: 'بيت جديد لمجتمع VISION.', date: '2026-09-28', cat: 'إعلان' },
  { title: 'تحديث كبير للسيرفر', desc: 'أنظمة جديدة وإصلاحات وتحسينات تجعل اللعب أسهل.', date: '2026-09-20', cat: 'تحديث' },
  { title: 'فعالية لعب أدوار مجتمعية', desc: 'شارك مع الإدارة واللاعبين في فعالية تعمّ المدينة كلها.', date: '2026-09-12', cat: 'فعالية' },
  { title: 'فتح باب التقديم للقائمة البيضاء', desc: 'تتم مراجعة الطلبات يوميًا من قبل الإدارة.', date: '2026-09-05', cat: 'أخبار السيرفر' },
  { title: 'التوظيف في قسم الشرطة', desc: 'باب التقديم لقسم الشرطة مفتوح الآن.', date: '2026-08-30', cat: 'إعلان' },
  { title: 'اكتمال صيانة السيرفر', desc: 'انتهت الصيانة المجدولة مع تحسينات في الأداء.', date: '2026-08-22', cat: 'أخبار السيرفر' }
];
const FAQ = [
  ['ما هو VISION RolePlay؟', 'VISION RolePlay مجتمع جاد للعب الأدوار في GTA San Andreas على SA-MP، يقوم على الانغماس والمجتمع والجودة.'],
  ['كيف يمكنني الانضمام؟', 'ثبّت GTA San Andreas وSA-MP، ثم اتصل بعنوان السيرفر الموضح في قسم التحميل.'],
  ['هل أحتاج إلى القائمة البيضاء؟', 'نعم. يقدّم اللاعبون الجدد طلب انضمام إلى القائمة البيضاء، وتراجعه الإدارة.'],
  ['ما هو عنوان السيرفر؟', 'عنوان السيرفر هو ' + CONFIG.server.ip + ' ويمكنك نسخه بزر «نسخ العنوان».'],
  ['كيف أتواصل مع الإدارة؟', 'انضم إلى سيرفر ديسكورد الخاص بنا، ثم افتح تذكرة دعم أو راسل أحد أعضاء الإدارة.'],
  ['كيف أتقدم للعمل ضمن الإدارة؟', 'يُعلَن عن التقديم للإدارة في ديسكورد عند توفر شواغر. ونفضّل اللاعبين النشطين الناضجين والمتعاونين.'],
  ['كيف أصبح صانع محتوى؟', 'زر صفحة صناع المحتوى في الموقع الرئيسي، أو اسأل في ديسكورد عن الشروط.'],
  ['كيف يمكنني التبرع؟', 'ستتوفر التبرعات عبر المتجر بعد اكتمال ربط الدفع. تابع ديسكورد لمعرفة المستجدات.']
];

/* ============ HELPERS ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => n.toLocaleString('en-US');

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============ NAVBAR ============ */
function initNav() {
  const nav = $('#navbar'), burger = $('#burger'), links = $('#navLinks'), top = $('#toTop');
  const close = () => { links.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open'); burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach(a => a.addEventListener('click', close));
  const onScroll = () => { nav.classList.toggle('scrolled', scrollY > 40); top.classList.toggle('show', scrollY > 600); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  // active link highlighting
  const map = new Map($$('.nav-links a[href^="#"]').map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && map.has(e.target.id)) { $$('.nav-links a').forEach(a => a.classList.remove('active')); map.get(e.target.id).classList.add('active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ============ SERVER STATUS (simulated, API-ready) ============ */
let lastFetch = Date.now();
function renderStatus() {
  const s = CONFIG.server;
  const set = (k, v) => $$(`[data-server="${k}"]`).forEach(el => el.textContent = v);
  set('players', s.players); set('max', s.maxPlayers); set('ip', s.ip); set('ping', s.ping);
  set('statusText', s.online ? 'السيرفر متصل' : 'السيرفر غير متصل');
  $$('.status-pill').forEach(p => p.classList.toggle('offline', !s.online));
  $('#playerBar').style.width = Math.min(100, s.players / s.maxPlayers * 100) + '%';
}
async function fetchServerStatus() {
  // Replace with a real SA-MP query/API. Expected shape: { online, players, maxPlayers, ping }
  if (CONFIG.statusApi) {
    const r = await fetch(CONFIG.statusApi); return r.json();
  }
  const s = CONFIG.server; // simulation for front-end demo
  const base = s.players || 120;
  return { online: true, players: Math.max(0, Math.min(s.maxPlayers, base + Math.round((Math.random() - .45) * 12))), maxPlayers: s.maxPlayers, ping: 18 + Math.floor(Math.random() * 30) };
}
async function updateStatus(manual) {
  try { Object.assign(CONFIG.server, await fetchServerStatus()); lastFetch = Date.now(); renderStatus(); if (manual) toast('تم تحديث الحالة'); }
  catch { CONFIG.server.online = false; renderStatus(); if (manual) toast('تعذّر الوصول إلى واجهة الحالة'); }
}
function initStatus() {
  if (CONFIG.simulateLive) CONFIG.server.players = 120 + Math.floor(Math.random() * 60);
  renderStatus(); updateStatus();
  $('#refreshStatus').addEventListener('click', () => updateStatus(true));
  setInterval(() => $('#lastUpdate').textContent = Math.floor((Date.now() - lastFetch) / 1000), 1000);
  setInterval(() => updateStatus(), 30000);
}

/* ============ COPY IP ============ */
function initCopy() {
  $('#copyIp').addEventListener('click', async () => {
    const ip = CONFIG.server.ip;
    try { await navigator.clipboard.writeText(ip); }
    catch { const t = document.createElement('textarea'); t.value = ip; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    toast('تم النسخ!');
  });
}

/* ============ RENDERERS ============ */
function renderLists() {
  $('#featureGrid').innerHTML = FEATURES.map(f => `<article class="card reveal"><div class="icon">${f[0]}</div><h3>${esc(f[1])}</h3><p>${esc(f[2])}</p></article>`).join('');
  $('#statsGrid').innerHTML = STATS.map(s => `<div class="stat glass reveal"><b data-count="${s.value}">0</b><span>${esc(s.label)}</span></div>`).join('');
  $('#staffGrid').innerHTML = STAFF.map(s => `<article class="card staff-card reveal"><div class="pfp">${esc(s.name[0].toUpperCase())}</div><h3>${esc(s.name)}</h3><span class="role">${esc(s.role)}</span><br><a class="btn btn-ghost" href="${esc(s.link)}" target="_blank" rel="noopener">ديسكورد</a></article>`).join('');
  $('#videoGrid').innerHTML = VIDEOS.map(v => `<article class="card video reveal"><div class="thumb">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" loading="lazy">` : ''}<span class="play">▶</span></div><h3>${esc(v.title)}</h3><p>بواسطة ${esc(v.creator)}</p><a class="btn btn-red" href="${esc(v.url)}" target="_blank" rel="noopener">يوتيوب</a></article>`).join('');
  $('#faqList').innerHTML = FAQ.map((f, i) => `<div class="faq-item reveal"><button class="faq-q" aria-expanded="false" aria-controls="fa${i}">${esc(f[0])}</button><div class="faq-a" id="fa${i}"><p>${esc(f[1])}</p></div></div>`).join('');
  const cats = [ALL, ...new Set(NEWS.map(n => n.cat))];
  $('#newsFilters').innerHTML = cats.map((c, i) => `<button class="chip${i ? '' : ' active'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  $('#newsGrid').innerHTML = NEWS.map(n => `<article class="card news" data-cat="${esc(n.cat)}"><div class="meta"><span class="cat">${esc(n.cat)}</span><time datetime="${n.date}">${new Date(n.date).toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p><button class="btn btn-ghost" data-toast="المقالات الكاملة قادمة قريبًا.">اقرأ المزيد</button></article>`).join('');
  $('#discordCount').textContent = fmt(CONFIG.discordMembers);
}

/* ============ FAQ / NEWS / TABS / SHOP ============ */
function initFaq() {
  $('#faqList').addEventListener('click', e => {
    const q = e.target.closest('.faq-q'); if (!q) return;
    const item = q.parentElement, opening = !item.classList.contains('open');
    $$('.faq-item').forEach(i => { i.classList.remove('open'); $('.faq-q', i).setAttribute('aria-expanded', 'false'); $('.faq-a', i).style.maxHeight = null; });
    if (opening) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); const a = $('.faq-a', item); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
}
function initNews() {
  $('#newsFilters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip').forEach(x => x.classList.toggle('active', x === c));
    $$('#newsGrid .news').forEach(n => n.classList.toggle('hide', c.dataset.cat !== ALL && n.dataset.cat !== c.dataset.cat));
  });
}
function initTabs() {
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('active', x === t));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + t.dataset.tab));
  }));
}
function initShop() {
  const modal = $('#checkout'); let plan = '';
  $$('[data-plan]').forEach(b => b.addEventListener('click', () => { plan = b.dataset.plan; $('#coPlan').textContent = plan; modal.hidden = false; }));
  const close = () => modal.hidden = true;
  $('#coClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  $('#coConfirm').addEventListener('click', () => { close(); toast('باقة ' + plan + ': الدفع غير مفعّل بعد (نسخة تجريبية).'); });
}

/* ============ WHITELIST FORM ============ */
const RULES = {
  username: v => /^[A-Za-z]+_[A-Za-z]+$/.test(v) || 'استخدم الصيغة Firstname_Lastname بالأحرف اللاتينية، مثل John_Doe.',
  discord: v => /^[A-Za-z0-9._]{2,32}$/.test(v) || 'أدخل اسم مستخدم ديسكورد صحيحًا.',
  age: v => (+v >= 13 && +v <= 99) || 'يجب أن يكون العمر بين 13 و99 سنة.',
  experience: v => !!v || 'اختر مستوى خبرتك.',
  why: v => v.trim().length >= 30 || 'اكتب 30 حرفًا على الأقل.',
  story: v => v.trim().length >= 100 || 'قصة الشخصية تحتاج إلى 100 حرف على الأقل.'
};
// Backend hook: replace with fetch('/api/whitelist', { method:'POST', body: JSON.stringify(data) })
async function submitWhitelist(data) { console.info('Whitelist payload (not sent anywhere):', data); return { ok: true }; }
function initForm() {
  const form = $('#wlForm');
  const check = f => {
    const el = form.elements[f], res = RULES[f](el.value), label = el.closest('label');
    label.classList.toggle('invalid', res !== true); $('em', label).textContent = res === true ? '' : res; return res === true;
  };
  Object.keys(RULES).forEach(f => form.elements[f].addEventListener('blur', () => check(f)));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = Object.keys(RULES).map(check).every(Boolean);
    if (!ok) return toast('يرجى تصحيح الحقول المظللة.');
    await submitWhitelist(Object.fromEntries(new FormData(form)));
    form.reset(); toast('تم التحقق من الطلب (نسخة تجريبية، لم يُرسل شيء).');
  });
  $('#checkStatus').addEventListener('click', () => toast('سيتوفر التحقق من حالة الطلب بعد ربط الخادم الخلفي.'));
  document.addEventListener('click', e => { const t = e.target.closest('[data-toast]'); if (t) toast(t.dataset.toast); });
}

/* ============ REVEAL + COUNTERS ============ */
function animateCount(el) {
  const target = +el.dataset.count, dur = 1600, t0 = performance.now();
  (function tick(t) {
    const p = Math.min(1, (t - t0) / dur); el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    $$('[data-count]', e.target).forEach(animateCount); io.unobserve(e.target);
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ============ HERO PARTICLES ============ */
function initParticles() {
  const c = $('#particles'), ctx = c.getContext('2d');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let w, h, ps = [], running = true;
  const resize = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; ps = Array.from({ length: Math.min(60, w / 22) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .1, a: Math.random() * .5 + .15 })); };
  resize(); addEventListener('resize', resize);
  new IntersectionObserver(e => running = e[0].isIntersecting).observe(c);
  (function draw() {
    if (running) {
      ctx.clearRect(0, 0, w, h);
      ps.forEach(p => { p.y -= p.v; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(255,60,70,${p.a})`; ctx.shadowColor = '#e11d2e'; ctx.shadowBlur = 8; ctx.fill(); });
    }
    requestAnimationFrame(draw);
  })();
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  renderLists(); initNav(); initStatus(); initCopy(); initFaq(); initNews(); initTabs(); initShop(); initForm(); initReveal(); initParticles();
});
