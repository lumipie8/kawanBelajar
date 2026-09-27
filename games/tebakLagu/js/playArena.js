let currentLevelIndex = 0;
let isMuted = false;

// Elemen DOM
const playBtn = document.getElementById('playBtn');
const audio = document.getElementById('bgAudio');
const progressText = document.getElementById('currentQuestionText');
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('userAnswerInput');
const btnPrev = document.getElementById('btnPrevAudio');
const btnNext = document.getElementById('btnNextAudio');
const btnToggleSound = document.getElementById('btnToggleSound');

// Ambil parameter level dari URL (misal: play.html?level=2)
function getLevelFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const lvl = parseInt(urlParams.get('level'));
  return lvl && lvl >= 1 && lvl <= tebakLaguData.length ? lvl - 1 : 0;
}

// Cek status Unlocked dari LocalStorage
function getUnlockedLevel() {
  return parseInt(localStorage.getItem('tebakLagu_unlockedLevel')) || 1;
}

// Load data lagu berdasarkan index level saat ini
function loadLevel(index) {
  currentLevelIndex = index;
  const currentData = tebakLaguData[currentLevelIndex];

  // Update Teks Header (1/10 - 10/10)
  if (progressText) {
    progressText.innerText = `${currentData.level}/${tebakLaguData.length}`;
  }

  // Update Audio Source
  if (audio) {
    audio.src = currentData.audio;
    audio.load();
  }

  // Reset State Tombol Play
  if (playBtn) {
    playBtn.classList.remove('playing');
  }

  // Clear Input Jawaban
  if (answerInput) {
    answerInput.value = '';
  }

  // Update tampilan tombol Prev & Next (Enable / Disable)
  updateNavButtons();
}

// Update Kondisi Tombol Prev & Next (Lock / Unlock)
function updateNavButtons() {
  const unlockedLevel = getUnlockedLevel();

  // Tombol Prev: Nonaktif jika di level 1
  if (btnPrev) {
    if (currentLevelIndex <= 0) {
      btnPrev.style.opacity = '0.5';
      btnPrev.style.cursor = 'not-allowed';
    } else {
      btnPrev.style.opacity = '1';
      btnPrev.style.cursor = 'pointer';
    }
  }

  // Tombol Next: Nonaktif jika level berikutnya BELUM terbuka
  if (btnNext) {
    const nextLevelNumber = currentLevelIndex + 2; // Index 0 = Level 1, Next Level = Level 2
    if (nextLevelNumber > unlockedLevel || currentLevelIndex >= tebakLaguData.length - 1) {
      btnNext.style.opacity = '0.5';
      btnNext.style.cursor = 'not-allowed';
    } else {
      btnNext.style.opacity = '1';
      btnNext.style.cursor = 'pointer';
    }
  }
}

// Simpan status level selesai di LocalStorage
function finishLevel(levelNum) {
  let completed = JSON.parse(localStorage.getItem('tebakLagu_completedLevels')) || [];
  
  if (!completed.includes(levelNum)) {
    completed.push(levelNum);
    localStorage.setItem('tebakLagu_completedLevels', JSON.stringify(completed));
  }

  const nextLevel = levelNum + 1;
  const currentUnlocked = getUnlockedLevel();
  if (nextLevel > currentUnlocked) {
    localStorage.setItem('tebakLagu_unlockedLevel', nextLevel);
  }
}

// Event Play / Pause Audio
if (playBtn && audio) {
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.classList.add('playing');
    } else {
      audio.pause();
      playBtn.classList.remove('playing');
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
  });
}

// Event Tombol Volume (Mute / Unmute)
if (btnToggleSound && audio) {
  btnToggleSound.addEventListener('click', () => {
    isMuted = !isMuted;
    audio.muted = isMuted;

    if (isMuted) {
      btnToggleSound.style.opacity = '0.4';
    } else {
      btnToggleSound.style.opacity = '1';
    }
  });
}

// Event Navigasi Prev
if (btnPrev) {
  btnPrev.addEventListener('click', () => {
    if (currentLevelIndex > 0) {
      loadLevel(currentLevelIndex - 1);
    }
  });
}

// Event Navigasi Next
if (btnNext) {
  btnNext.addEventListener('click', () => {
    const unlockedLevel = getUnlockedLevel();
    const nextLevelNumber = currentLevelIndex + 2;

    // Hanya bisa pindah jika level berikutnya sudah terbuka
    if (nextLevelNumber <= unlockedLevel && currentLevelIndex < tebakLaguData.length - 1) {
      loadLevel(currentLevelIndex + 1);
    } else {
      alert('Selesaikan level ini terlebih dahulu untuk membuka level selanjutnya!');
    }
  });
}

// Event Submit Jawaban
if (answerForm) {
  answerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userAns = answerInput.value.trim().toLowerCase();
    const currentData = tebakLaguData[currentLevelIndex];

    if (currentData.answers.includes(userAns)) {
      finishLevel(currentData.level);
      alert('Selamat! Jawaban Kamu Benar 🎉');

      if (currentLevelIndex < tebakLaguData.length - 1) {
        loadLevel(currentLevelIndex + 1);
      } else {
        alert('Hebat! Kamu telah menyelesaikan semua level!');
        window.location.href = 'index.html';
      }
    } else {
      alert('Jawaban masih kurang tepat, coba lagi ya!');
    }
  });
}

// Inisialisasi awal
document.addEventListener('DOMContentLoaded', () => {
  const initialIndex = getLevelFromUrl();
  loadLevel(initialIndex);
});