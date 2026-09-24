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

    // Kontainer div sementara
    const heartElement = document.createElement('div');
    heartElement.className = 'click-heart-effect';
    heartElement.style.left = `${x}px`;
    heartElement.style.top = `${y}px`;
    document.body.appendChild(heartElement);

    // Load animasi Like Button.json
    const heartAnim = lottie.loadAnimation({
      container: heartElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/gif/Like Button.json'
    });

    // Hapus elemen DOM setelah animasi selesai diputar
    heartAnim.addEventListener('complete', () => {
      heartAnim.destroy();
      heartElement.remove();
    });
  };

  // Efek saat diklik kursor / disentuh jari
  window.addEventListener('pointerdown', (e) => {
    // Mencegah efek tumpang tindih
    if (e.target.closest('#btnMulai')) return;

    spawnHeartEffect(e.clientX, e.clientY);
  });
});