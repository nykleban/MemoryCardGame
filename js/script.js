// #region БГ МУЗИКА
document.addEventListener("DOMContentLoaded", function () {
  const volumeBtn = document.getElementById("volume-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const audio = document.getElementById("bg-music");

  // Встановити початкову гучність на 20%
  audio.volume = 0.2;

  // Показати/сховати повзунок
  volumeBtn.addEventListener("click", function () {
    volumeSlider.style.display =
      volumeSlider.style.display === "none" ? "block" : "none";
  });

  // Зміна гучності повзунком
  volumeSlider.addEventListener("input", function () {
    audio.volume = parseFloat(this.value);
  });

  // Дозвіл на автозапуск після взаємодії (для деяких браузерів)
  document.body.addEventListener(
    "click",
    () => {
      audio.play().catch(() => {});
    },
    { once: true }
  );
});

  const difficultyLabel = document.getElementById("current-difficulty");
  let selectedDifficulty = "Просто"; 
  difficultyLabel.textContent = selectedDifficulty;
  const difficultyOptions = document.querySelectorAll(".difficulty-option");

document.addEventListener("DOMContentLoaded", function () {
  difficultyOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      selectedDifficulty = this.textContent;
      difficultyLabel.textContent = selectedDifficulty;
      console.log("Складність обрана:", selectedDifficulty);
    });
  });
});

// #endregion
document.addEventListener("DOMContentLoaded", function () {
  // #region РЕКОРД КНОПКА
  const recordBtn = document.getElementById("record-btn");
  const recordDisplay = document.getElementById("record-display");
  const recordEasy = document.getElementById("record-easy");
  const recordNormal = document.getElementById("record-normal");
  const recordHard = document.getElementById("record-hard");

  recordBtn.addEventListener("click", () => {
    recordDisplay.classList.toggle("d-none");
    if (!recordDisplay.classList.contains("d-none")) {
      recordEasy.textContent =
        localStorage.getItem("record-easy") || "--:--:--";
      recordNormal.textContent =
        localStorage.getItem("record-normal") || "--:--:--";
      recordHard.textContent =
        localStorage.getItem("record-hard") || "--:--:--";
    }
  });

    function stopAndSaveRecord(stopedTime) {
      clearInterval(intervalID);

      const difficulty = difficultyLabel.textContent.trim();
      let key;
      if (difficulty === "Просто") key = "record-easy";
      else if (difficulty === "Нормально") key = "record-normal";
      else key = "record-hard";

      const prev = localStorage.getItem(key);
      if (!prev || isBetterTime(stopedTime, prev)) {
        localStorage.setItem(key, stopedTime);
        console.log("Новий рекорд:", stopedTime);
      }
    }
  
    function isBetterTime(newTime, oldTime) {
      const [nm, ns, nms] = newTime.split(":").map(Number);
      const [om, os, oms] = oldTime.split(":").map(Number);

      if (nm < om) return true;
      if (nm === om && ns < os) return true;
      if (nm === om && ns === os && nms < oms) return true;
      return false;
    }

  // #endregion

  const newGameBtn = document.querySelector(".btn-primary");
  const menu = document.querySelector(".center-page");
  const gameBoard = document.getElementById("game-board");
  const btnreturn = document.getElementById("returnID");
  btnreturn.classList.add("d-none");
  const timerID = document.getElementById("timerID");
  timerID.classList.add("d-none");

  //дані для таймера
  let timerS = 0;
  let timerM = 0;
  let timerMS = 0;
  let intervalID;

  //дані для зупинки секундоміра
  let countFlippedCards = 0;
  let stopedTime = null;

  newGameBtn.addEventListener("click", function () {
    const difficulty = difficultyLabel.textContent.trim();
    let gridSize;

    if (difficulty === "Просто") gridSize = 4;
    else if (difficulty === "Нормально") gridSize = 6;
    else gridSize = 8;

    // Приховуємо меню
    menu.classList.add("d-none");

    // Показуємо поле гри
    gameBoard.classList.remove("d-none");

    // Генеруємо картки
    generateCards(gridSize);


    btnreturn.classList.remove("d-none");
    btnreturn.classList.add("d-flex");
    btnreturn.innerHTML = `<button class="btn btn-lg btn-danger btn-return" type="button">Повернутися до меню</button>`;
    timerID.classList.remove("d-none");
    timerID.classList.add("d-flex");
    timerMS = 0;
    timerS = 0;
    timerM = 0;

    // Якщо вже є інтервал — очищаємо його
    clearInterval(intervalID);

    // Запускаємо новий таймер
    intervalID = setInterval(clock, 10); // 10мс точність

    back_to_navigation = function () {
      menu.classList.remove("d-none");
      gameBoard.innerHTML = "";
      gameBoard.classList.add("d-none");
      difficultyLabel.textContent = selectedDifficulty;
      btnreturn.classList.add("d-none");
      clearInterval(intervalID);
      timerID.classList.add("d-none");
      timerID.innerHTML = "";
    }

    // Обробник кнопки повернення
    btnreturn.addEventListener("click", function () {
      back_to_navigation();
    });
  });

  function clock() {
    timerMS += 10;

    if (timerMS >= 1000) {
      timerS += 1;
      timerMS = 0;
    }

    if (timerS >= 60) {
      timerM += 1;
      timerS = 0;
    }

    const formattedM = timerM.toString().padStart(2, "0");
    const formattedS = timerS.toString().padStart(2, "0");
    const formattedMS = Math.floor(timerMS / 10)
      .toString()
      .padStart(2, "0");

    timerID.innerHTML = `<h1>${formattedM}:${formattedS}:${formattedMS}</h1>`;
  }

  function generateCards(size) {
    gameBoard.innerHTML = ""; 
    gameBoard.style.display = "grid";
    gameBoard.style.gap = "10px";
    if (size == 8) {
      gameBoard.style.gridTemplateColumns = `repeat(${size}, 75px)`;
      gameBoard.style.gridTemplateRows = `repeat(${size}, 75px)`;
    } else if (size == 6) {
      gameBoard.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    } else {
      gameBoard.style.gridTemplateColumns = `repeat(${size}, 150px)`;
    }

    let totalCards = size * size;
    let cards = [];

    let allValues = brands.map(item => item.value);
    let randomValues = getRandomValues(allValues, totalCards / 2);

    randomValues.forEach((value, index) => {
        cards.push(value);
        cards.push(value);
    });
    // це вже не потрібно, оскільки ми отримали всі значення з brands з функції getRandomValues, але для впевненості перемішаємо ще раз
    shuffle(cards);

    // створити HTML-елементи
    cards.forEach((value) => {
      const card = document.createElement("div");
      card.classList.add("memory-card");

      if (size == 4) {
        card.style.fontSize = "4.5vw";
      } else if (size == 6) {
        card.style.fontSize = "3vw";
      } else {
        card.style.fontSize = "2.5vw";
      }
      card.innerHTML = ""; 
      card.dataset.value = value;
      card.dataset.icon = brands.find(item => item.value === value).brand;
      card.dataset.color = brands.find(item => item.value === value).color;
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  function shuffle(array) {
    for (let i = 0; i < array.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let firstCard = null;
  let lockBoard = false;

  function flipCard(card) {
    if (lockBoard || card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    card.innerHTML = "<i class='fa-brands " + card.dataset.icon + "' style='color: " + card.dataset.color + "'></i>";

    if (!firstCard) {
      firstCard = card;
      return;
    }

    // перевірка пари
    if (card.dataset.value === firstCard.dataset.value) {
      firstCard = null;
      countFlippedCards += 2;
      if (countFlippedCards === gameBoard.children.length) {
        clearInterval(intervalID);
        setTimeout(() => {
          alert("Вітаємо! Ви виграли!");
          gameBoard.innerHTML = ""; 
          timerID.classList.add("d-none");
          stopedTime = `${timerM.toString().padStart(2, "0")}:${timerS
            .toString()
            .padStart(2, "0")}:${Math.floor(timerMS / 10)
            .toString()
            .padStart(2, "0")}`;
          alert(`Ваш час: ${stopedTime}`);
          stopAndSaveRecord(stopedTime);
          countFlippedCards = 0; 
          firstCard = null; 
          back_to_navigation();
        }, 500);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card.classList.remove("flipped");
        firstCard.classList.remove("flipped");
        card.textContent = "";
        firstCard.textContent = "";
        firstCard = null;
        lockBoard = false;
      }, 500);
    }
  }
});
