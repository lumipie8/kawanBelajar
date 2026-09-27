document.addEventListener('DOMContentLoaded', () => {
  // Ambil level tertinggi yang terbuka dan daftar level yang selesai
  const unlockedLevel = parseInt(localStorage.getItem('tebakLagu_unlockedLevel')) || 1;
  const completedLevels = JSON.parse(localStorage.getItem('tebakLagu_completedLevels')) || [];

  const levelButtons = document.querySelectorAll('.level-btn');

  levelButtons.forEach((btn, index) => {
    const levelNumber = index + 1;

    // Bersihkan state kelas terlebih dahulu
    btn.classList.remove('unlocked', 'completed');
    btn.removeAttribute('disabled');

    if (completedLevels.includes(levelNumber)) {
      // Level Selesai -> Warna Hijau
      btn.classList.add('completed');
    } else if (levelNumber <= unlockedLevel) {
      // Level Terbuka -> Warna Pink Muda
      btn.classList.add('unlocked');
    } else {
      // Level Terkunci -> Abu-abu
      btn.setAttribute('disabled', 'true');
    }

    // Event Listener navigasi saat tombol level diklik
    if (!btn.hasAttribute('disabled')) {
      btn.addEventListener('click', () => {
        window.location.href = `play.html?level=${levelNumber}`;
      });
    }
  });
});