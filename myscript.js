let map = document.getElementsByClassName("map-card");
function cardanimation() {
  for (let i = 0; i < map.length; i++) {
    map[i].addEventListener("mouseover", function () {
      map[i].style.transform = "scale(1.1)";
    });
    map[i].addEventListener("mouseout", function () {
      map[i].style.transform = "scale(1)";
    });
  }
}
cardanimation();
window.addEventListener("resize", cardanimation);

function resetAnimations() {
  const mapCards = document.querySelectorAll('.map-card');
  mapCards.forEach(card => {
      card.classList.remove('active'); // Сброс класса active
      card.style.transform = ''; // Сброс трансформации
  });
}

// Добавьте вызов функции resetAnimations при возвращении на главную страницу
window.addEventListener('load', resetAnimations);

 window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log("✅ Service Worker зарегистрирован"))
      .catch(err => console.error("❌ Ошибка регистрации SW:", err));
  }
});

// установка прилож
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const wasBannerShown = localStorage.getItem('pwaInstallPromptShown');
  if (wasBannerShown) return;

  const banner = document.getElementById('installBanner');
  const overlay = document.getElementById('installOverlay');
  const closeBtn = document.getElementById('closeBanner');

  banner?.classList.add('show');
  overlay?.classList.add('show');
  document.body.classList.add('noscroll');

  localStorage.setItem('pwaInstallPromptShown', 'true');

  closeBtn?.addEventListener('click', () => {
    banner.classList.remove('show');
    overlay.classList.remove('show');
    document.body.classList.remove('noscroll');
  });
});

// Универсальная установка (для обеих кнопок)
function handleInstallClick() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    console.log(choice.outcome === 'accepted' ? '✅ Установлено' : '❌ Отказ');
    deferredPrompt = null;

    document.getElementById('installBanner')?.classList.remove('show');
    document.getElementById('installOverlay')?.classList.remove('show');
    document.body.classList.remove('noscroll');
  });
}

// Обработчики кнопок
document.getElementById('installAppBtnBanner')?.addEventListener('click', handleInstallClick);
document.getElementById('installAppBtnFooter')?.addEventListener('click', handleInstallClick);