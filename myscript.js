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

 /*window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log("✅ Service Worker зарегистрирован"))
      .catch(err => console.error("❌ Ошибка регистрации SW:", err));
  }
}); */

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

  // Для айфона
  if (isIOS() && !isInStandaloneMode()) {
    if (!localStorage.getItem('pwaInstallPromptShown')) {
      banner.querySelector('p').innerHTML =
        'А ты знал, что у нас есть приложение? :<br>Нажми Поделиться → На экран «Домой» и стань ближе к PRO-игроку!';
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

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (localStorage.getItem('pwaInstallPromptShown')) return;

    banner.classList.add('show');
    overlay.classList.add('show');
    document.body.classList.add('noscroll');
    localStorage.setItem('pwaInstallPromptShown', 'true');

  
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        deferredPrompt = null;
        banner.classList.remove('show');
        overlay.classList.remove('show');
        document.body.classList.remove('noscroll');
      });
    });

   
    installBtnFooter.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        deferredPrompt = null;
        banner.classList.remove('show');
        overlay.classList.remove('show');
        document.body.classList.remove('noscroll');
      });
    });

    closeBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      overlay.classList.remove('show');
      document.body.classList.remove('noscroll');
    });
  });
});
