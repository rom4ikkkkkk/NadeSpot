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
let deferredPrompt;

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && window.navigator.standalone;
}

window.addEventListener('load', () => {
  const banner = document.getElementById('installBanner');
  const overlay = document.getElementById('installOverlay');
  const closeBtn = document.getElementById('closeBanner');
  const installBtn = document.getElementById('installAppBtnBanner');
  const installBtnFooter = document.getElementById('installAppBtnFooter');

  // iOS: показать инструкцию, скрыть кнопки
  if (isIOS() && !isInStandaloneMode()) {
    if (!localStorage.getItem('pwaInstallPromptShown')) {
      banner.querySelector('p').innerHTML =
        'На устройствах Apple установка вручную:<br>Нажмите Поделиться → На экран «Домой».';
      installBtn.style.display = 'none';
      installBtnFooter.style.display = 'none';

      banner.classList.add('show');
      overlay.classList.add('show');
      document.body.classList.add('noscroll');
      localStorage.setItem('pwaInstallPromptShown', 'true');

      closeBtn.addEventListener('click', () => {
        banner.classList.remove('show');
        overlay.classList.remove('show');
        document.body.classList.remove('noscroll');
      });
    }
    return;
  }

  // Android / Desktop: ловим событие установки
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Показываем баннер только один раз
    if (!localStorage.getItem('pwaInstallPromptShown')) {
      banner.classList.add('show');
      overlay.classList.add('show');
      document.body.classList.add('noscroll');
      localStorage.setItem('pwaInstallPromptShown', 'true');
    }

    // Кнопка в баннере
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      }
    });

    // Кнопка снизу работает всегда
    installBtnFooter.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        alert("Установка недоступна. Попробуйте позже.");
      }
    });

    closeBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      overlay.classList.remove('show');
      document.body.classList.remove('noscroll');
    });
  });
});

//проверка на пва если уст то не показ кнопка
function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Убираем кнопку и баннер, если уже в PWA
if (isStandaloneMode()) {
  document.addEventListener('DOMContentLoaded', () => {
    const bannerBtn = document.getElementById('installAppBtnBanner');
    const footerBtn = document.getElementById('installAppBtnFooter');
    const overlay = document.getElementById('installOverlay');
    const banner = document.getElementById('installBanner');

    if (bannerBtn) bannerBtn.style.display = 'none';
    if (footerBtn) footerBtn.style.display = 'none';
    if (overlay) overlay.remove();
    if (banner) banner.remove();
  });
}
