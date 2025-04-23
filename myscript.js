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