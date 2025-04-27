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

// Функция открытия и закрытия окна чата
function toggleChat(open) {
  const chatModal = document.getElementById('chat-modal');
  const chatOutput = document.getElementById('chat-output');

  if (open) {
    chatModal.style.display = 'block';
    document.body.classList.add('noscroll');

    // Очищаем старые сообщения
    chatOutput.innerHTML = '';

    // Добавляем приветственное сообщение
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.innerHTML = `
      <img src="bot.png" class="message-icon" alt="Bot Icon">
      <div class="message-text">Салам алейкум, чем тебе помочь?</div>
    `;
    chatOutput.appendChild(welcomeMessage);

    // Прокручиваем вниз
    chatOutput.scrollTop = chatOutput.scrollHeight;

  } else {
    chatModal.style.display = 'none';
    document.body.classList.remove('noscroll');
  }
}


async function sendToYandexGPT(prompt) {
  const proxyUrl = 'https://yandex-gpt-proxy-production.up.railway.app/api/yandexgpt';

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    });

    if (response.ok) {
      const data = await response.json();
      return data.text; // Возвращаем текст ответа
    } else {
      return 'Произошла ошибка при обращении к прокси.';
    }
  } catch (error) {
    return 'Произошла ошибка при отправке запроса.';
  }
}

// Пример использования:
function toggleChat(open) {
  const chatModal = document.getElementById('chat-modal');
  if (open) {
    chatModal.style.display = 'block';
  } else {
    chatModal.style.display = 'none';
  }
}

// Пример обработчика кнопки отправки сообщения
document.getElementById('send-btn').addEventListener('click', async () => {
  const userInput = document.getElementById('user-input').value;
  if (userInput.trim() !== '') {
    const chatOutput = document.getElementById('chat-output');

    // Добавляем сообщение пользователя с иконкой
    chatOutput.innerHTML += `
      <div class="message user-message">
        <img src="man.png" class="message-icon" alt="User Icon">
        <div class="message-text">${userInput}</div>
      </div>
    `;

    // Добавляем индикатор "Чат-бот печатает..." с иконкой
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message';
    typingIndicator.innerHTML = `
      <img src="bot.png" class="message-icon" alt="Bot Icon">
      <div class="message-text">Чат-бот печатает...</div>
    `;
    chatOutput.appendChild(typingIndicator);

    // Прокрутить вниз
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // Ждём ответа от ЯндексГПТ
    const response = await sendToYandexGPT(userInput);

    // Убираем "Чат-бот печатает..."
    typingIndicator.remove();

    // Добавляем реальный ответ бота с иконкой
    chatOutput.innerHTML += `
      <div class="message bot-message">
        <img src="bot.png" class="message-icon" alt="Bot Icon">
        <div class="message-text">${response}</div>
      </div>
    `;

    // Прокрутить вниз
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // Очищаем поле ввода
    document.getElementById('user-input').value = '';
  }
});


