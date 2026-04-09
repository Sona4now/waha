/* ============================================================
 WAAHA Common JS Utilities
 ============================================================ */

/* ---- localStorage helpers ---- */
const store = {
 get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
 set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
 del(key) { try { localStorage.removeItem(key); } catch {} },
};

/* ---- Navbar ---- */
function initNavbar() {
 const nav = document.getElementById('navbar');
 if (!nav) return;

 // Scroll shadow
 const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
 window.addEventListener('scroll', onScroll, { passive: true });
 onScroll();

 // Hamburger
 const ham = document.getElementById('nav-hamburger');
 if (ham) ham.addEventListener('click', () => nav.classList.toggle('menu-open'));

 // Active link
 const page = location.pathname.split('/').pop() || 'home.html';
 nav.querySelectorAll('.nav-links a').forEach(a => {
 if (a.getAttribute('href') === page) a.classList.add('active');
 });
}

/* ---- Personalized banner (home.html) ---- */
function initPersonalBanner() {
 const banner = document.getElementById('personal-banner');
 if (!banner) return;
 const saved = store.get('waaha_recommendation');
 if (!saved || !saved.destinationId) return;
 const dest = getDestinationById(saved.destinationId);
 if (!dest) return;

 banner.classList.remove('hidden');
 const nameEl = banner.querySelector('[data-rec-name]');
 const linkEl = banner.querySelector('[data-rec-link]');
 if (nameEl) nameEl.textContent = dest.name;
 if (linkEl) linkEl.href = `destination.html?id=${dest.id}`;
}

/* ---- Scroll animations ---- */
function initScrollAnimations() {
 const obs = new IntersectionObserver(entries => {
 entries.forEach(e => {
 if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
 });
 }, { threshold: 0.12 });
 document.querySelectorAll('.anim').forEach(el => obs.observe(el));
}

/* ---- Counter animation ---- */
function animateCounters() {
 const obs = new IntersectionObserver(entries => {
 entries.forEach(e => {
 if (!e.isIntersecting) return;
 const el = e.target;
 const target = parseInt(el.dataset.count);
 const suffix = el.dataset.suffix || '';
 const dur = 1800;
 const step = target / (dur / 16);
 let cur = 0;
 const t = setInterval(() => {
 cur += step;
 if (cur >= target) { cur = target; clearInterval(t); }
 el.textContent = Math.floor(cur).toLocaleString('ar-EG') + suffix;
 }, 16);
 obs.unobserve(el);
 });
 }, { threshold: 0.4 });
 document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ---- Smooth page navigation ---- */
function goTo(url) {
 document.body.style.transition = 'opacity 0.3s ease';
 document.body.style.opacity = '0';
 setTimeout(() => { window.location.href = url; }, 290);
}

/* ---- Page fade-in ---- */
function pageIn() {
 document.body.style.opacity = '0';
 requestAnimationFrame(() => {
 document.body.style.transition = 'opacity 0.45s ease';
 requestAnimationFrame(() => { document.body.style.opacity = '1'; });
 });
}

/* ---- Floating AI assistant button ---- */
function initAIFloatingBtn() {
 // Don't show on the AI guide page itself or the cinematic intro
 const page = location.pathname.split('/').pop() || '';
 if (page === 'ai-guide.html' || page === 'index.html' || page === '') return;

 const style = document.createElement('style');
 style.textContent = `
 #ai-fab {
 position: fixed;
 bottom: 28px;
 left: 28px;
 z-index: 9999;
 display: flex;
 align-items: center;
 gap: 10px;
 background: #1d5770;
 color: #fff;
 border: none;
 border-radius: 50px;
 padding: 12px 20px 12px 16px;
 font-family: 'Cairo', sans-serif;
 font-size: 0.88rem;
 font-weight: 700;
 cursor: pointer;
 box-shadow: 0 6px 28px rgba(27,79,114,0.45);
 transition: all 0.3s ease;
 text-decoration: none;
 white-space: nowrap;
 animation: fabIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
 animation-delay: 1.2s;
 }
 #ai-fab:hover {
 background: #91b149;
 transform: translateY(-3px);
 box-shadow: 0 10px 36px rgba(42,172,170,0.5);
 }
 #ai-fab:hover #fab-tooltip { opacity: 1; transform: translateY(0); pointer-events: none; }
 #ai-fab .fab-icon {
 width: 30px; height: 30px;
 background: rgba(255,255,255,0.15);
 border-radius: 50%;
 display: flex; align-items: center; justify-content: center;
 font-size: 1rem;
 flex-shrink: 0;
 animation: fabPulse 3s ease infinite;
 animation-delay: 2s;
 }
 #fab-tooltip {
 position: absolute;
 bottom: calc(100% + 10px);
 left: 0;
 background: #1d5770;
 color: #fff;
 font-size: 0.78rem;
 font-weight: 600;
 padding: 6px 12px;
 border-radius: 8px;
 white-space: nowrap;
 opacity: 0;
 transform: translateY(6px);
 transition: all 0.25s ease;
 pointer-events: none;
 }
 #fab-tooltip::after {
 content: '';
 position: absolute;
 top: 100%; left: 20px;
 border: 5px solid transparent;
 border-top-color: #1d5770;
 }
 @keyframes fabIn {
 from { opacity: 0; transform: translateY(20px) scale(0.8); }
 to { opacity: 1; transform: translateY(0) scale(1); }
 }
 @keyframes fabPulse {
 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
 50% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
 }
 @media (max-width: 600px) {
 #ai-fab span.fab-label { display: none; }
 #ai-fab { padding: 13px; border-radius: 50%; bottom: 20px; left: 20px; }
 }
 `;
 document.head.appendChild(style);

 const btn = document.createElement('a');
 btn.id = 'ai-fab';
 btn.href = 'ai-guide.html';
 btn.innerHTML = `
 <div id="fab-tooltip">اسألني عن وجهتك المثالية</div>
 <div class="fab-icon" style="font-size:0.75rem;font-weight:900;letter-spacing:-0.5px;">AI</div>
 <span class="fab-label">اسأل المساعد</span>
 `;
 document.body.appendChild(btn);
}

/* ---- Init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
 pageIn();
 initNavbar();
 initPersonalBanner();
 initScrollAnimations();
 animateCounters();
 initAIFloatingBtn();
});
