(function () {
    'use strict';

    /* ════════════════════════════════════════════════
       CONFIG — edit your stuff here
    ════════════════════════════════════════════════ */
    const DISCORD_ID = '1457132860216709182';
    const TYPED_TEXT = 'developer | creator';

    /* Works: badge = live | ended | sold | removed. link is optional. */
    const WORKS = [
        { title: 'xZenith AI Programmer', kind: 'AI Tool', badge: 'live', label: 'Live', icon: 'fas fa-robot', featured: true,
          desc: 'An AI that connects to Roblox Studio projects to help with Lua coding, powered by the GPT 6 Luna model. It has made 894 people happy in total.',
          tags: ['Lua', 'AI', 'Roblox Studio'], link: { url: 'https://www.xzenith.net/', text: 'Visit', icon: 'fas fa-arrow-up-right-from-square' } },
        { title: 'AirFlex', kind: 'Discord Bot', badge: 'live', label: 'Live', icon: 'fas fa-star',
          desc: 'Rates your Discord profile: username (2c / 4c / OG), badges and avatar, with a live preview and a final score from 0 to 10.',
          tags: ['Discord', 'Bot', 'Profile Rating'], link: { url: 'https://www.airflex.fun/', text: 'Visit', icon: 'fas fa-arrow-up-right-from-square' } },
        { title: 'AirProtect', kind: 'Discord Bot', badge: 'live', label: 'Live', icon: 'fas fa-shield-halved',
          desc: 'An all-in-one bot built to protect one specific server, 0km: anti-raid, welcome messages, boosts, commands, tickets and logs.',
          tags: ['Anti-Raid', 'Tickets', 'Logs', 'Welcome'] },
        { title: 'AntiMalware', kind: 'Security Tool', badge: 'live', label: 'Live', icon: 'fas fa-bug-slash',
          desc: 'A Python program I built for myself and several people whose PCs were suffering from honeypot. Still active today.',
          tags: ['Python', 'Security', 'Still Active'] },
        { title: 'Window Personalizations', kind: 'Windhawk Mod', badge: 'removed', label: 'Removed', icon: 'fab fa-windows',
          desc: 'Windhawk mods built with C/C++, including Taskbar Personalization with 4 customization modes. It reached 8.1k downloads before I removed it from Windhawk; the source is still on GitHub.',
          tags: ['C/C++', 'Windhawk', 'Taskbar'], link: { url: 'https://github.com/zk23/TaskbarWin', text: 'GitHub', icon: 'fab fa-github' } },
        { title: 'Discord Username Checker', kind: 'Discord Tool', badge: 'sold', label: 'Sold', icon: 'fas fa-terminal',
          desc: 'A command-line tool from 2024 that found available 3- and 4-letter Discord usernames. Free at first, then sold to someone who still sells it. I still have my old, outdated copy.',
          tags: ['Discord', 'CMD', '2024'] },
        { title: 'C++ / C# External Injector', kind: 'Roblox External', badge: 'ended', label: 'Discontinued', icon: 'fas fa-crosshairs',
          desc: 'An external I built with a team for one specific Roblox game, with Aimbot + ESP. We sold it, but the game lost its players and the project died with it.',
          tags: ['C++', 'C#', 'Roblox', 'Team Project'] },
        { title: 'TZexecutor', kind: 'Roblox Executor', badge: 'ended', label: 'Abandoned', icon: 'fas fa-microchip',
          desc: 'A Roblox executor built in 2023 with Cheat Engine. I planned for it to be server-side and used it against one game, then got banned. After many Roblox updates I abandoned it, but I still keep the files.',
          tags: ['Roblox', 'Cheat Engine', '2023'] },
        { title: 'DeepSeek Coder Jailbreak', kind: 'AI Model', badge: 'ended', label: 'Abandoned', icon: 'fas fa-brain',
          desc: 'In 2025 I took the MIT-licensed open-source version and jailbroke it for myself only. It lived on another PC, so it was left behind when I moved on from that machine.',
          tags: ['DeepSeek Coder', 'Open Source', '2025'] },
        { title: 'PKX Agent', kind: 'AI Agent', badge: 'removed', label: 'Deleted', icon: 'fas fa-bolt',
          desc: 'My own agent built on Ollama with the qwen3.8:27b model. It helped me with debugging, but it has been deleted.',
          tags: ['Ollama', 'Qwen', 'Debugging'] },
    ];

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* ════════════════ Works render ════════════════ */
    const grid = $('#worksGrid');
    if (grid) {
        grid.innerHTML = WORKS.map(w => `
            <article class="work glass reveal${w.featured ? ' featured' : ''}">
                <div class="pattern" aria-hidden="true">${`<i class="${w.icon}"></i>`.repeat(48)}</div>
                <div class="work-head">
                    <div class="work-tags">${w.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
                    <span class="badge ${w.badge}">${esc(w.label)}</span>
                </div>
                <div class="work-foot">
                    <div>
                        <p class="work-kind">${esc(w.kind)}</p>
                        <h3 class="work-title">${esc(w.title)}</h3>
                        <p class="work-desc">${esc(w.desc)}</p>
                    </div>
                    ${w.link ? `<a class="work-link" href="${esc(w.link.url)}" target="_blank" rel="noopener noreferrer"><i class="${w.link.icon}"></i>${esc(w.link.text)}</a>` : ''}
                </div>
            </article>`).join('');

        if (matchMedia('(hover: hover)').matches) {
            grid.addEventListener('pointermove', e => {
                const card = e.target.closest('.work');
                if (!card) return;
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        }
    }

    /* ════════════════ Lightning ════════════════ */
    const canvas = $('#bgCanvas');
    const ctx = canvas && canvas.getContext('2d');
    if (ctx && !reduceMotion) {
        const INTERVAL = 1300, LIFE = 560;
        let W = 0, H = 0;
        const resize = () => {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            W = innerWidth; H = innerHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        addEventListener('resize', resize);

        const makePath = (x1, y1, x2, y2, spread) => {
            let pts = [[x1, y1], [x2, y2]];
            for (let d = spread; d > 3; d /= 2) {
                const next = [pts[0]];
                for (let i = 1; i < pts.length; i++) {
                    const a = pts[i - 1], b = pts[i];
                    next.push([(a[0] + b[0]) / 2 + (Math.random() - .5) * d, (a[1] + b[1]) / 2 + (Math.random() - .5) * d * .3], b);
                }
                pts = next;
            }
            return pts;
        };
        const bolts = [];
        let lastX = -1;
        const strike = now => {
            let x;
            do { x = W * (.08 + Math.random() * .84); } while (lastX >= 0 && Math.abs(x - lastX) < W * .22);
            lastX = x;
            const main = makePath(x, -10, x + (Math.random() - .5) * W * .12, H * (.55 + Math.random() * .4), H * .2);
            const branches = [];
            for (let i = 0, n = 2 + Math.floor(Math.random() * 3); i < n; i++) {
                const p = main[Math.floor(main.length * (.2 + Math.random() * .55))];
                const dir = Math.random() < .5 ? -1 : 1, len = H * (.12 + Math.random() * .22);
                branches.push(makePath(p[0], p[1], p[0] + dir * len * (.5 + Math.random() * .6), p[1] + len, len * .5));
            }
            bolts.push({ main, branches, born: now });
        };
        const stroke = (pts, w, c) => {
            ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke();
        };
        let lastStrike = -INTERVAL;
        (function loop(now) {
            if (now - lastStrike >= INTERVAL) { lastStrike = now; strike(now); }
            ctx.clearRect(0, 0, W, H);
            ctx.lineJoin = ctx.lineCap = 'round';
            for (let i = bolts.length - 1; i >= 0; i--) {
                const b = bolts[i], age = now - b.born;
                if (age > LIFE) { bolts.splice(i, 1); continue; }
                let a = Math.pow(1 - age / LIFE, 1.5);
                if (age > 110 && age < 170) a *= .4;
                ctx.fillStyle = `rgba(220,225,240,${.04 * a})`; ctx.fillRect(0, 0, W, H);
                ctx.shadowColor = `rgba(220,225,255,${a})`; ctx.shadowBlur = 22;
                stroke(b.main, 6, `rgba(200,210,235,${.22 * a})`);
                stroke(b.main, 2.2, `rgba(235,240,255,${.9 * a})`);
                stroke(b.main, 1, `rgba(255,255,255,${a})`);
                b.branches.forEach(br => { stroke(br, 3, `rgba(200,210,235,${.18 * a})`); stroke(br, 1.1, `rgba(240,244,255,${.8 * a})`); });
                ctx.shadowBlur = 0;
            }
            requestAnimationFrame(loop);
        })(performance.now());
    }

    /* ════════════════ Audio + player ════════════════ */
    const audio = $('#bgAudio');
    const musicIcon = $('#musicIcon'), playIcon = $('#playIcon'), playBtn = $('#playBtn');
    const seek = $('#seek'), tCur = $('#tCur'), tDur = $('#tDur');
    audio.volume = .25;
    const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
    const syncIcons = () => {
        const on = !audio.paused;
        musicIcon.className = on ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
        playIcon.className = on ? 'fas fa-pause' : 'fas fa-play';
        playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
    };
    const play = () => { setupAnalyser(); audio.play().catch(() => {}); };
    const toggle = () => audio.paused ? play() : audio.pause();
    audio.addEventListener('play', syncIcons);
    audio.addEventListener('pause', syncIcons);
    audio.addEventListener('loadedmetadata', () => { tDur.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const p = audio.currentTime / audio.duration;
        if (!seek.matches(':active')) seek.value = p * 1000;
        seek.style.setProperty('--p', (p * 100) + '%');
        tCur.textContent = fmt(audio.currentTime);
    });
    seek.addEventListener('input', () => {
        if (audio.duration) audio.currentTime = seek.value / 1000 * audio.duration;
        seek.style.setProperty('--p', (seek.value / 10) + '%');
    });
    $('#musicToggle').addEventListener('click', toggle);
    playBtn.addEventListener('click', toggle);
    $('#prevBtn').addEventListener('click', () => { audio.currentTime = 0; });
    $('#nextBtn').addEventListener('click', () => { audio.currentTime = Math.min((audio.duration || 0) - .5, audio.currentTime + 10); });

    /* Visualizer: real frequency bars while playing, a calm wave when paused */
    let analyser = null, freq = null;
    function setupAnalyser() {
        if (analyser) return;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            const ac = new AC();
            const src = ac.createMediaElementSource(audio);
            analyser = ac.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = .82;
            src.connect(analyser); analyser.connect(ac.destination);
            freq = new Uint8Array(analyser.frequencyBinCount);
            audio.addEventListener('play', () => ac.state === 'suspended' && ac.resume());
        } catch (e) { analyser = null; }
    }
    const viz = $('#viz'), vctx = viz.getContext('2d');
    let vizVisible = false;
    new IntersectionObserver(([e]) => { vizVisible = e.isIntersecting; }).observe(viz);
    (function drawViz(t) {
        requestAnimationFrame(drawViz);
        if (!vizVisible) return;
        const dpr = Math.min(devicePixelRatio || 1, 2), w = viz.clientWidth, h = viz.clientHeight;
        if (viz.width !== w * dpr || viz.height !== h * dpr) { viz.width = w * dpr; viz.height = h * dpr; }
        vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        vctx.clearRect(0, 0, w, h);
        const bars = Math.max(24, Math.floor(w / 14)), gap = 4, bw = (w - gap * (bars - 1)) / bars;
        const live = analyser && !audio.paused;
        if (live) analyser.getByteFrequencyData(freq);
        for (let i = 0; i < bars; i++) {
            let v;
            if (live) {
                const idx = Math.floor(Math.pow(i / bars, 1.3) * freq.length * .62);
                v = freq[idx] / 255;
            } else {
                v = .08 + .06 * Math.sin(t / 900 + i * .35) + .04 * Math.sin(t / 500 + i * .9);
            }
            const bh = Math.max(3, v * h * .92);
            const x = i * (bw + gap), y = (h - bh) / 2;
            const g = vctx.createLinearGradient(0, y, 0, y + bh);
            g.addColorStop(0, 'rgba(255,255,255,.08)'); g.addColorStop(.5, `rgba(255,255,255,${.35 + v * .6})`); g.addColorStop(1, 'rgba(255,255,255,.08)');
            vctx.fillStyle = g;
            vctx.beginPath();
            vctx.roundRect ? vctx.roundRect(x, y, bw, bh, bw / 2) : vctx.rect(x, y, bw, bh);
            vctx.fill();
        }
    })(0);

    /* ════════════════ Enter screen ════════════════ */
    const overlay = $('#enterOverlay');
    const enter = () => {
        if (document.body.classList.contains('entered')) return;
        document.body.classList.add('entered');
        overlay.classList.add('gone');
        play();
        countUp();
        setTimeout(typeLoop, 600);
    };
    overlay.addEventListener('click', enter);
    overlay.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });
    overlay.focus();

    /* ════════════════ Typewriter ════════════════ */
    const typedEl = $('#devTyped');
    let ti = 0, deleting = false;
    function typeLoop() {
        if (reduceMotion) { typedEl.textContent = TYPED_TEXT; return; }
        ti += deleting ? -1 : 1;
        typedEl.textContent = TYPED_TEXT.slice(0, ti);
        if (!deleting && ti >= TYPED_TEXT.length) { deleting = true; return setTimeout(typeLoop, 2600); }
        if (deleting && ti <= 0) { deleting = false; return setTimeout(typeLoop, 600); }
        setTimeout(typeLoop, deleting ? 45 : 90);
    }

    /* ════════════════ Count up ════════════════ */
    function countUp() {
        $$('[data-count]').forEach(el => {
            const end = parseInt(el.dataset.count, 10) || 0, t0 = performance.now();
            (function tick(t) {
                const p = Math.min(1, (t - t0) / 900);
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        });
    }

    /* ════════════════ About panel ════════════════ */
    const panel = $('#aboutPanel');
    const closePanel = () => panel.classList.remove('open');
    $('#aboutBtn').addEventListener('click', () => { panel.classList.add('open'); $('#aboutClose').focus(); });
    $('#aboutClose').addEventListener('click', closePanel);
    panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

    /* ════════════════ Sections: reveal + dots + scroll buttons ════════════════ */
    const wrapper = $('#siteWrapper');
    const sections = $$('.section', wrapper);
    const dots = $$('.scroll-dot');
    const go = i => sections[i] && sections[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.scrollToSection = go;
    $$('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.section)));

    const revealIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    }), { root: wrapper, threshold: .12 });
    $$('.reveal').forEach(el => revealIO.observe(el));

    const dotIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { const i = sections.indexOf(e.target); dots.forEach((d, j) => d.classList.toggle('active', i === j)); }
    }), { root: wrapper, rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(s => dotIO.observe(s));

    /* Pause the background video when the tab is hidden */
    const bgVideo = $('#bgVideo');
    document.addEventListener('visibilitychange', () => { document.hidden ? bgVideo.pause() : bgVideo.play().catch(() => {}); });

    /* ════════════════ Discord presence (Lanyard) ════════════════
       Works once you join https://discord.gg/lanyard with your account.
       Until then the card just shows your tag and links to your profile. */
    (async function presence() {
        try {
            const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
            if (!r.ok) return;
            const { success, data } = await r.json();
            if (!success || !data) return;
            const u = data.discord_user || {};
            if (u.avatar) $('#dcAvatar').src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`;
            $('#dcName').textContent = u.display_name || u.global_name || u.username || '.xl.r';
            const status = data.discord_status || 'offline';
            $('#dcDot').className = 'dc-dot ' + status;
            const act = (data.activities || []).find(a => a.type !== 4);
            const custom = (data.activities || []).find(a => a.type === 4);
            $('#dcStatus').textContent = data.listening_to_spotify && data.spotify ? `listening to ${data.spotify.song}`
                : act ? `playing ${act.name}`
                : custom && custom.state ? custom.state
                : status === 'offline' ? 'offline' : status === 'dnd' ? 'do not disturb' : status;
        } catch (e) { /* keep the static card */ }
    })();

})();
