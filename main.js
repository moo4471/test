const cursor = document.querySelector(".cursor");
const holes = [...document.querySelectorAll(".hole")];
const scoreEl = document.querySelector(".score span");
const timerEl = document.querySelector(".timer span");
const gameOverEl = document.querySelector(".game-over");
const finalScoreEl = document.querySelector("#final-score");
const startBtn = document.querySelector(".start-btn");
const difficultySelect = document.querySelector(".difficulty");
const hitSound = document.getElementById("hit-sound");
const backgroundMusic = document.getElementById("background-music");

const highScoresPopup = document.querySelector(".high-scores");
const highScoresList = document.querySelector("#high-scores-list");
const playerSelect = document.querySelector("#player-select");
const selectedScoreEl = document.querySelector("#selected-score");
const closeBtn = document.querySelector(".close-btn");
const playerNameInput = document.querySelector("#player-name");
const saveScoreBtn = document.querySelector(".save-score-btn");
const viewHighScoresBtn = document.querySelector(".view-high-scores-btn");

let score = 0;
let timeLeft = 30;
let gameActive = false;
let gameInterval;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];  


function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
}

function getFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error("Error loading from localStorage", e);
    return [];
  }
}

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = "00";
  timerEl.textContent = timeLeft;
  gameOverEl.classList.add("hidden");
  highScoresPopup.classList.add("hidden");

  backgroundMusic.play();

  const difficulty = difficultySelect.value;
  let nasrallahSpeed = 1500;
  let maxnasrallahs = 1;

  if (difficulty === "medium") {
    nasrallahSpeed = 1000;
    maxnasrallahs = 2;
  }
  if (difficulty === "hard") {
    nasrallahSpeed = 700;
    maxnasrallahs = 3;
  }
  if (difficulty === "extreme") {
    nasrallahSpeed = 500;
    maxnasrallahs = 4;
  }

  runnasrallahs(nasrallahSpeed, maxnasrallahs);
  startTimer();
}

function startTimer() {
  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  gameOverEl.classList.remove("hidden");
  finalScoreEl.textContent = score;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function saveScore() {
  const playerName = playerNameInput.value.trim();
  if (!playerName) return;

  const newScore = { name: playerName, score: score };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);

  saveToLocalStorage('highScores', highScores);

  displayHighScores();
}

function displayHighScores() {
  highScoresList.innerHTML = "";
  playerSelect.innerHTML = '<option value="">Select a Player</option>';
  highScores.forEach(({ name, score }) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${score}`;
    highScoresList.appendChild(li);


    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    playerSelect.appendChild(option);
  });

  highScoresPopup.classList.remove("hidden");
}


playerSelect.addEventListener("change", function () {
  const selectedPlayer = playerSelect.value;
  const player = highScores.find(p => p.name === selectedPlayer);
  if (player) {
    selectedScoreEl.textContent = player.score;
  } else {
    selectedScoreEl.textContent = "";
  }
});

function runnasrallahs(speed, maxnasrallahs) {
  const nasrallahInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(nasrallahInterval);
      return;
    }

    for (let i = 0; i < maxnasrallahs; i++) {
      const randomHole = Math.floor(Math.random() * holes.length);
      const hole = holes[randomHole];

      if (hole.querySelector(".nasrallah")) continue;

      const img = document.createElement("img");
      img.classList.add("nasrallah");
      img.src = "nasrallah.png";

      img.addEventListener("click", () => {
        score += 10;
        scoreEl.textContent = score < 10 ? "0" + score : score;
        img.src = "nasrallah-hited.png";
        hitSound.play();

        setTimeout(() => hole.removeChild(img), 500);
      });

      hole.appendChild(img);

      setTimeout(() => {
        if (hole.contains(img)) {
          hole.removeChild(img);
        }
      }, speed);
    }
  }, speed);
}

startBtn.addEventListener("click", startGame);
saveScoreBtn.addEventListener("click", saveScore);
viewHighScoresBtn.addEventListener("click", displayHighScores);

window.addEventListener("mousemove", (e) => {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

window.addEventListener("mousedown", () => {
  cursor.classList.add("active");
});

window.addEventListener("mouseup", () => {
  cursor.classList.remove("active");
});

closeBtn.addEventListener("click", () => {
  highScoresPopup.classList.add("hidden");
});
