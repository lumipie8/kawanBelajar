document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. HERO SECTION (STAR BURST & SMOOTH SCROLL)
  // ==========================================
  const btnMulai = document.getElementById('btnMulai');
  const lottieContainer = document.getElementById('lottie-burst');
  const menuSection = document.getElementById('menu-section');

  if (btnMulai) {
    // Animasi Lottie Star Burst pada tombol Mulai
    if (lottieContainer && typeof lottie !== 'undefined') {
      const burstAnim = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/gif/star burst.json'
      });

      btnMulai.addEventListener('click', () => {
        burstAnim.stop();
        burstAnim.play();
      });
    }

    // Smooth Scroll menuju Menu Section
    if (menuSection) {
      btnMulai.addEventListener('click', () => {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 2. EFEK TOUCH/CLICK DI LAYAR (STAR BURST)
  // ==========================================
  const spawnStarBurstEffect = (x, y) => {
    if (typeof lottie === 'undefined') return;

    const starElement = document.createElement('div');
    starElement.className = 'click-star-effect';
    starElement.style.left = `${x}px`;
    starElement.style.top = `${y}px`;
    document.body.appendChild(starElement);

    const starAnim = lottie.loadAnimation({
      container: starElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/gif/star burst.json'
    });

    starAnim.addEventListener('complete', () => {
      starAnim.destroy();
      starElement.remove();
    });
  };

  window.addEventListener('pointerdown', (e) => {
    // Abaikan jika yang diklik adalah tombol Mulai agar animasi tidak bertumpuk
    if (e.target.closest('#btnMulai')) return;
    spawnStarBurstEffect(e.clientX, e.clientY);
  });

  // ==========================================
  // 3. CAROUSEL LOGIC
  // ==========================================
  const track = document.getElementById('cardsTrack');
  const cards = document.querySelectorAll('.game-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    const totalCards = cards.length;

    // Generate Dots Navigasi
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
          currentIndex = index;
          updateSlide();
        });

        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.dot');

    function updateSlide() {
      const cardGap = 40; // Gap antar kartu di CSS
      const cardWidth = cards[0].offsetWidth + cardGap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Update Indicator Active Dot
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Navigasi Tombol Prev & Next
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
          currentIndex++;
          updateSlide();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlide();
        }
      });
    }

    // Scroll Wheel / Touchpad Horizontal
    if (track.parentElement) {
      track.parentElement.addEventListener(
        'wheel',
        (e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (e.deltaX > 20 && currentIndex < totalCards - 1) {
              currentIndex++;
              updateSlide();
            } else if (e.deltaX < -20 && currentIndex > 0) {
              currentIndex--;
              updateSlide();
            }
          }
        },
        { passive: false }
      );
    }

    // Touch Swipe Mobile / Tablet
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 50 && currentIndex < totalCards - 1) {
        currentIndex++;
        updateSlide();
      } else if (endX - startX > 50 && currentIndex > 0) {
        currentIndex--;
        updateSlide();
      }
    });
  }

  // ==========================================
  // 4. TRANSIKSI STARDUST + SOFT OVERLAY NAVIGASI
  // ==========================================
  const playButtons = document.querySelectorAll('.btn-stardust');
  const pageOverlay = document.getElementById('page-transition-overlay');

  playButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');

      // 1. Tambahkan efek pencetan tombol lentur
      this.classList.add('animating');

      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 2. Ledakan partikel stardust
      createStardustBurst(centerX, centerY, 28);
      setTimeout(() => createStardustBurst(centerX, centerY, 12), 150);

      // 3. Munculkan overlay tirai secara halus
      setTimeout(() => {
        if (pageOverlay) pageOverlay.classList.add('active');
      }, 350);

      // 4. Perpindahan halaman setelah tirai menutup sempurna
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 900);
    });
  });

  function createStardustBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'stardust-particle';

      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 110;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance}px`;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);

      const size = 6 + Math.random() * 12;
      const duration = 0.8 + Math.random() * 0.4;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${duration}s`;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
  }
});