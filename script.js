/**
 * ==========================================================================
 * RAHUL & MINI — HINGLISH INTERACTIVE ENGINE
 * Manual Finale Song Trigger at 1:00 min (60s), Mobile Touch & 3D Physics
 * ==========================================================================
 */

let ytPlayer = null;
let isYtReady = false;
let isMusicPlaying = false;
const YOUTUBE_VIDEO_ID = 'IfEMfcYbFt8'; // Labb Par Aaye - Bandish Bandits
const SONG_START_TIME = 60; // 1:00 minute in seconds

// Asynchronously load YouTube Iframe Player API
(function loadYouTubeApi() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

// YouTube API Ready Callback
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('ytAudioPlayer', {
    height: '100',
    width: '100',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      start: SONG_START_TIME
    },
    events: {
      onReady: () => {
        isYtReady = true;
        try {
          ytPlayer.seekTo(SONG_START_TIME, true);
        } catch (_) {}
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          isMusicPlaying = true;
          updateFinaleMusicUI(true);
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
          isMusicPlaying = false;
          updateFinaleMusicUI(false);
        }
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initBackgroundCanvas();
  initCustomCursor();
  init3DTilt();
  initFinaleMusicController();
  initPerspectiveSwitcher();
  initPhotoModal();
  initHeartbeatAndFireworks();
  initScrollTracker();
  initThemeSwitcher();
});

/* ==========================================================================
   1. CINEMATIC PRELOADER (SILENT DISMISS)
   ========================================================================== */
function initPreloader() {
  const loader = document.getElementById('cinematicLoader');
  const lineFill = document.getElementById('loaderLineFill');
  const enterBtn = document.getElementById('enterUniverseBtn');

  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (lineFill) lineFill.style.width = '100%';
      if (enterBtn) {
        enterBtn.style.opacity = '1';
        enterBtn.style.pointerEvents = 'all';
      }
    } else {
      if (lineFill) lineFill.style.width = `${progress}%`;
    }
  }, 100);

  const dismissLoader = () => {
    loader.classList.add('hidden');
  };

  if (enterBtn) {
    enterBtn.addEventListener('click', dismissLoader);
  }

  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      if (enterBtn) {
        enterBtn.style.opacity = '1';
        enterBtn.style.pointerEvents = 'all';
      }
    }
  }, 2200);
}

/* ==========================================================================
   2. GRAND FINALE MUSIC CONTROLLER (STARTS AT 1:00 MIN)
   ========================================================================== */
function playFinaleSong() {
  if (ytPlayer && isYtReady && typeof ytPlayer.playVideo === 'function') {
    try {
      ytPlayer.seekTo(SONG_START_TIME, true);
      ytPlayer.playVideo();
      ytPlayer.unMute();
      ytPlayer.setVolume(100);
    } catch (_) {}
  } else {
    const checkReady = setInterval(() => {
      if (ytPlayer && isYtReady && typeof ytPlayer.playVideo === 'function') {
        try {
          ytPlayer.seekTo(SONG_START_TIME, true);
          ytPlayer.playVideo();
          ytPlayer.unMute();
          ytPlayer.setVolume(100);
        } catch (_) {}
        clearInterval(checkReady);
      }
    }, 300);
    setTimeout(() => clearInterval(checkReady), 4000);
  }
}

function pauseFinaleSong() {
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    try {
      ytPlayer.pauseVideo();
    } catch (_) {}
  }
}

function toggleFinaleSong() {
  if (isMusicPlaying) {
    pauseFinaleSong();
  } else {
    playFinaleSong();
  }
}

function updateFinaleMusicUI(playing) {
  const playIcon = document.getElementById('finaleBtnPlayIcon');
  const btnText = document.getElementById('finaleBtnText');
  const theater = document.getElementById('finaleMusicTheater');
  const theaterBtn = document.getElementById('theaterToggleBtn');

  if (playing) {
    if (playIcon) playIcon.textContent = '❚❚';
    if (btnText) btnText.textContent = 'playing what i feel in 3 days...';
    if (theater) theater.classList.add('active');
    if (theaterBtn) theaterBtn.textContent = 'Pause Music';
  } else {
    if (playIcon) playIcon.textContent = '▶';
    if (btnText) btnText.textContent = 'listen in music what i feel in 3 days';
    if (theaterBtn) theaterBtn.textContent = 'Play Song';
  }
}

function initFinaleMusicController() {
  const playFinaleBtn = document.getElementById('playFinaleSongBtn');
  const theaterBtn = document.getElementById('theaterToggleBtn');

  if (playFinaleBtn) {
    playFinaleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFinaleSong();
      createFireworkBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    });
  }

  if (theaterBtn) {
    theaterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFinaleSong();
    });
  }
}

/* ==========================================================================
   3. DYNAMIC CONSTELLATION CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const particles = [];
  const particleCount = Math.min(50, Math.floor(width / 24));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 345 : 38
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0) p1.x = width;
      if (p1.x > width) p1.x = 0;
      if (p1.y < 0) p1.y = height;
      if (p1.y > height) p1.y = 0;

      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p1.hue}, 85%, 65%, ${p1.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsla(${p1.hue}, 85%, 65%, 0.4)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const lineAlpha = (1 - dist / 120) * 0.16;
          ctx.strokeStyle = `hsla(${p1.hue}, 80%, 70%, ${lineAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. CUSTOM MAGNETIC GLOW CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactiveElems = document.querySelectorAll('button, a, .tilt-card, .moment-card');
  interactiveElems.forEach(elem => {
    elem.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    elem.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   5. 3D PERSPECTIVE TILT CARDS
   ========================================================================== */
function init3DTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    const intensity = parseFloat(card.dataset.tiltIntensity) || 15;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   6. PERSPECTIVE SWITCHER (OFFICE MASK vs TRUE RAHUL)
   ========================================================================== */
function initPerspectiveSwitcher() {
  const btnReal = document.getElementById('btnRealView');
  const btnMask = document.getElementById('btnMaskView');
  const viewReal = document.getElementById('viewReal');
  const viewMask = document.getElementById('viewMask');

  if (!btnReal || !btnMask) return;

  btnReal.addEventListener('click', () => {
    btnReal.classList.add('active');
    btnMask.classList.remove('active');
    viewReal.classList.add('active');
    viewMask.classList.remove('active');
  });

  btnMask.addEventListener('click', () => {
    btnMask.classList.add('active');
    btnReal.classList.remove('active');
    viewMask.classList.add('active');
    viewReal.classList.remove('active');
  });
}

/* ==========================================================================
   7. PHOTO ZOOM MODAL
   ========================================================================== */
function initPhotoModal() {
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');

  const cards = document.querySelectorAll('.moment-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const photoSrc = card.dataset.photo;
      const title = card.dataset.title;
      const desc = card.dataset.desc;

      if (modalImg) modalImg.src = photoSrc;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      if (modal) modal.classList.add('active');
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   8. MINI'S HEARTBEAT PULSE & FIREWORKS
   ========================================================================== */
function createFireworkBurst(originX, originY) {
  const count = 32;
  const colors = ['#FF5E7E', '#FF758C', '#E2B170', '#FFD166', '#FFFFFF'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';

    const size = Math.random() * 5 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 10px ${color}`;

    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;

    document.body.appendChild(particle);

    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5);
    const velocity = Math.random() * 160 + 70;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy + 60}px) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 800 + 800,
      easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
      fill: 'forwards'
    });

    setTimeout(() => particle.remove(), 1600);
  }
}

function initHeartbeatAndFireworks() {
  const heartBtn = document.getElementById('kineticHeartBtn');
  const countBadge = document.getElementById('heartCountBadge');
  let pulseCount = parseInt(localStorage.getItem('mini_pulse_count') || '0', 10);

  if (countBadge) countBadge.textContent = `${pulseCount} Dhadkanein`;

  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      pulseCount++;
      localStorage.setItem('mini_pulse_count', pulseCount.toString());
      if (countBadge) countBadge.textContent = `${pulseCount} Dhadkanein`;

      createFireworkBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);

      if ('vibrate' in navigator) {
        try { navigator.vibrate([50, 30, 50]); } catch (_) {}
      }
    });
  }

  // Vault Note System
  const saveNoteBtn = document.getElementById('saveVaultNoteBtn');
  const noteInput = document.getElementById('vaultNoteInput');
  const statusText = document.getElementById('vaultStatusText');
  const notesList = document.getElementById('vaultNotesList');

  function renderVaultNotes() {
    if (!notesList) return;
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('mini_rahul_vault_notes') || '[]');

    notes.forEach(n => {
      const item = document.createElement('div');
      item.className = 'vault-note-item';
      item.innerHTML = `
        <span class="vault-note-time">${n.time} &bull; MINI SE RAHUL KO</span>
        <p class="vault-note-text">&ldquo;${escapeHtml(n.text)}&rdquo;</p>
      `;
      notesList.prepend(item);
    });
  }

  if (saveNoteBtn && noteInput) {
    saveNoteBtn.addEventListener('click', () => {
      const text = noteInput.value.trim();
      if (!text) return;

      const notes = JSON.parse(localStorage.getItem('mini_rahul_vault_notes') || '[]');
      const newEntry = {
        text: text,
        time: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      notes.push(newEntry);
      localStorage.setItem('mini_rahul_vault_notes', JSON.stringify(notes));

      noteInput.value = '';
      if (statusText) {
        statusText.textContent = 'Vault mein pyaar ke saath save ho gaya ✨';
        setTimeout(() => { statusText.textContent = ''; }, 3500);
      }

      renderVaultNotes();
      createFireworkBurst(window.innerWidth / 2, window.innerHeight / 2);
    });
  }

  renderVaultNotes();
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ==========================================================================
   9. SCROLL PROGRESS TRACKER
   ========================================================================== */
function initScrollTracker() {
  const scrollFill = document.getElementById('scrollFill');
  if (!scrollFill) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollFill.style.width = `${pct}%`;
  }, { passive: true });
}

/* ==========================================================================
   10. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const btn = document.getElementById('themeSwitchBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-light')) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-obsidian');
    } else {
      document.body.classList.remove('theme-obsidian');
      document.body.classList.add('theme-light');
    }
  });
}
