document.addEventListener('DOMContentLoaded', () => {
  // --- EFEK BUTTON STAR BURST ---
  const btnMulai = document.getElementById('btnMulai');
  const lottieContainer = document.getElementById('lottie-burst');

  if (btnMulai && lottieContainer && typeof lottie !== 'undefined') {
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

  // --- EFEK KLIK (TOUCH LOVE) ---
  const spawnHeartEffect = (x, y) => {
    if (typeof lottie === 'undefined') return;

    const heartElement = document.createElement('div');
    heartElement.className = 'click-heart-effect';
    heartElement.style.left = `${x}px`;
    heartElement.style.top = `${y}px`;
    document.body.appendChild(heartElement);

    const heartAnim = lottie.loadAnimation({
      container: heartElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/gif/Like Button.json'
    });

    heartAnim.addEventListener('complete', () => {
      heartAnim.destroy();
      heartElement.remove();
    });
  };

  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#btnMulai')) return;
    spawnHeartEffect(e.clientX, e.clientY);
  });

  // --- SMOOTH SCROLL DARI HERO SECTION ---
  const btnScroll = document.getElementById('btnMulai');
  const menuSection = document.getElementById('menu-section');

  if (btnScroll && menuSection) {
    btnScroll.addEventListener('click', () => {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- CAROUSEL LOGIC ---
  const track = document.getElementById('cardsTrack');
  const cards = document.querySelectorAll('.game-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    const totalCards = cards.length;

    // 1. GENERATE DOTS OTOMATIS SESUAI JUMLAH KARTU
    if (dotsContainer) {
      dotsContainer.innerHTML = ''; // bersihkan container
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
      const cardGap = 40; // Sesuaikan gap antar kartu di CSS
      const cardWidth = cards[0].offsetWidth + cardGap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Update Active Dot
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

    // Scroll Wheel / Touchpad
    if (track.parentElement) {
      track.parentElement.addEventListener('wheel', (e) => {
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
      }, { passive: false });
    }

    // Touch Swipe Mobile/Tablet
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
});