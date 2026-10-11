(function () {

    /* ── Detect phone only (NOT touchscreen laptops ≥ 1024px) ── */
    const isPhone = (
        window.matchMedia('(hover: none) and (pointer: coarse)').matches
        || navigator.maxTouchPoints > 0
    ) && window.innerWidth <= 768;

    /* ── Default browser cursor ── */

    /* ── Lightning background: one bolt every 1.3 s, always in a new spot ── */
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas && ctx) {
        const INTERVAL = 1300;           // ms between strikes
        const LIFE = 560;                // ms a bolt stays visible
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let W = 0, H = 0;
        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        /* Jagged line by midpoint displacement */
        function makePath(x1, y1, x2, y2, spread) {
            let pts = [[x1, y1], [x2, y2]];
            for (let d = spread; d > 3; d /= 2) {
                const next = [pts[0]];
                for (let i = 1; i < pts.length; i++) {
                    const a = pts[i - 1], b = pts[i];
                    next.push([
                        (a[0] + b[0]) / 2 + (Math.random() - 0.5) * d,
                        (a[1] + b[1]) / 2 + (Math.random() - 0.5) * d * 0.3
                    ], b);
                }
                pts = next;
            }
            return pts;
        }

        const bolts = [];
        let lastX = -1;
        function strike(now) {
            let x;
            do { x = W * (0.08 + Math.random() * 0.84); }
            while (lastX >= 0 && Math.abs(x - lastX) < W * 0.22);   // never the same place twice in a row
            lastX = x;
            const endX = x + (Math.random() - 0.5) * W * 0.12;
            const endY = H * (0.55 + Math.random() * 0.4);
            const main = makePath(x, -10, endX, endY, H * 0.2);
            const branches = [];
            const n = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < n; i++) {
                const p = main[Math.floor(main.length * (0.2 + Math.random() * 0.55))];
                const dir = Math.random() < 0.5 ? -1 : 1;
                const len = H * (0.12 + Math.random() * 0.22);
                branches.push(makePath(p[0], p[1], p[0] + dir * len * (0.5 + Math.random() * 0.6), p[1] + len, len * 0.5));
            }
            bolts.push({ main, branches, born: now });
        }

        function stroke(pts, width, color) {
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        let lastStrike = -INTERVAL;
        let wasEmpty = true;
        (function lightningLoop(now) {
            if (now - lastStrike >= INTERVAL) { lastStrike = now; strike(now); }

            if (bolts.length || !wasEmpty) {
                ctx.clearRect(0, 0, W, H);
                wasEmpty = bolts.length === 0;
            }
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            for (let i = bolts.length - 1; i >= 0; i--) {
                const b = bolts[i];
                const age = now - b.born;
                if (age > LIFE) { bolts.splice(i, 1); continue; }
                let a = Math.pow(1 - age / LIFE, 1.5);
                if (age > 110 && age < 170) a *= 0.4;        // quick flicker, like a real strike

                if (!reduceMotion) {                          // soft flash of the whole sky
                    ctx.fillStyle = 'rgba(190,210,255,' + (0.05 * a) + ')';
                    ctx.fillRect(0, 0, W, H);
                }
                ctx.shadowColor = 'rgba(170,200,255,' + a + ')';
                ctx.shadowBlur = 22;
                stroke(b.main, 6, 'rgba(150,180,255,' + (0.22 * a) + ')');
                stroke(b.main, 2.2, 'rgba(215,230,255,' + (0.9 * a) + ')');
                stroke(b.main, 1, 'rgba(255,255,255,' + a + ')');
                b.branches.forEach(br => {
                    stroke(br, 3, 'rgba(150,180,255,' + (0.18 * a) + ')');
                    stroke(br, 1.1, 'rgba(225,238,255,' + (0.8 * a) + ')');
                });
                ctx.shadowBlur = 0;
            }
            requestAnimationFrame(lightningLoop);
        })(performance.now());
    }

    /* ── Count-up for hero stats ── */
    function countUp() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const end = parseInt(el.dataset.count, 10) || 0;
            const t0 = performance.now(), dur = 900;
            (function tick(t) {
                const p = Math.min(1, (t - t0) / dur);
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        });
    }

    /* ── Enter overlay ── */
    const overlay = document.getElementById('enterOverlay');
    const audio   = document.getElementById('bgAudio');
    const mIcon   = document.getElementById('musicIcon');
    let   musicOn = false;

    function tryPlayMusic() {
        if (!audio || musicOn) return;
        audio.volume = 0.18;
        audio.play().then(() => {
            musicOn = true;
            if (mIcon) mIcon.className = 'fas fa-volume-high';
        }).catch(() => {});
    }

    if (!overlay) document.body.classList.add('entered');
    if (overlay) {
        overlay.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            document.body.classList.add('entered');
            countUp();
            tryPlayMusic();
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 700);
        });
    }

    /* ── About panel toggle ── */
    const aboutBtn   = document.getElementById('aboutBtn');
    const aboutPanel = document.getElementById('aboutPanel');
    const aboutClose = document.getElementById('aboutClose');

    if (aboutBtn && aboutPanel) {
        aboutBtn.addEventListener('click', () => {
            aboutPanel.classList.toggle('panel-open');
        });
    }
    if (aboutClose && aboutPanel) {
        aboutClose.addEventListener('click', () => {
            aboutPanel.classList.remove('panel-open');
        });
    }

    /* ── Music toggle ── */
    const mToggle = document.getElementById('musicToggle');
    if (mToggle) {
        mToggle.addEventListener('click', () => {
            if (!audio) return;
            musicOn = !musicOn;
            if (mIcon) mIcon.className = musicOn ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
            if (musicOn) {
                audio.volume = 0.18;
                audio.play().catch(() => {});
            } else {
                audio.pause();
            }
        });
    }


    /* ── "developer | creator" typewriter ── */
    const devTypedEl = document.getElementById('devTyped');
    const DEV_TEXT   = 'developer | creator';
    let   dIdx       = 0;
    let   dDeleting  = false;

    function devTick() {
        if (!devTypedEl) return;
        if (!dDeleting) {
            dIdx++;
            devTypedEl.textContent = DEV_TEXT.slice(0, dIdx);
            if (dIdx >= DEV_TEXT.length) {
                dDeleting = true;
                setTimeout(devTick, 2800);
                return;
            }
            setTimeout(devTick, 85);
        } else {
            dIdx--;
            devTypedEl.textContent = DEV_TEXT.slice(0, dIdx);
            if (dIdx <= 0) {
                dDeleting = false;
                setTimeout(devTick, 700);
                return;
            }
            setTimeout(devTick, 48);
        }
    }
    setTimeout(devTick, 300);

    /* ── Skill cards: light that follows the cursor ── */
    document.querySelectorAll('.skills-grid').forEach(grid => {
        grid.addEventListener('pointermove', e => {
            const card = e.target.closest('.skill-card');
            if (!card) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ── Work cards: 3D glass tilt ── */
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canTilt) {
        document.querySelectorAll('.work-card').forEach(card => {
            let raf = 0;
            card.addEventListener('pointerenter', () => card.classList.add('tilting'));
            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.setProperty('--ry', ((px - 0.5) * 5).toFixed(2) + 'deg');
                    card.style.setProperty('--rx', ((0.5 - py) * 4).toFixed(2) + 'deg');
                    card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                    card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
                });
            });
            card.addEventListener('pointerleave', () => {
                cancelAnimationFrame(raf);
                card.classList.remove('tilting');
                ['--rx', '--ry', '--mx', '--my'].forEach(p => card.style.removeProperty(p));
            });
        });
    }

    /* ── Scroll reveal — IntersectionObserver ── */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if (revealEls.length) {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { root: document.getElementById('siteWrapper'), threshold: 0.15 });
        revealEls.forEach(el => revealIO.observe(el));
    }


    /* ── Scroll dots — IntersectionObserver ── */
    const sections = document.querySelectorAll('.section');
    const dots     = document.querySelectorAll('.scroll-dot');

    if (sections.length && dots.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = [...sections].indexOf(entry.target);
                    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                }
            });
        }, { root: document.getElementById('siteWrapper'), threshold: 0.55 });

        sections.forEach(s => io.observe(s));

        /* Dot click → scroll to that section */
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.section, 10);
                scrollToSection(idx);
            });
        });
    }

    /* ── Visitor counter ── */
    (function () {
        const KEY = 'vuid_4kryx';
        let vid = localStorage.getItem(KEY);
        if (!vid) {
            vid = (crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(36) + Math.random().toString(36).slice(2)
            );
            localStorage.setItem(KEY, vid);
        }

        fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: vid }),
        })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('visitorCount');
            if (el && data.count !== undefined) {
                el.textContent = data.count.toLocaleString();
            }
        })
        .catch(() => {});
    })();

})();

/* ── Global: scroll to section by index ── */
function scrollToSection(idx) {
    const wrapper  = document.getElementById('siteWrapper');
    const sections = wrapper ? wrapper.querySelectorAll('.section') : [];
    if (sections[idx]) {
        sections[idx].scrollIntoView({ behavior: 'smooth' });
    }
}
