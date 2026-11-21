const emojis = [
  "🐱", "🐱",
  "🦝", "🦝",
  "🦊", "🦊",
  "🐶", "🐶",
  "🐵", "🐵",
  "🦁", "🦁",
  "🐯", "🐯",
  "🐮", "🐮"
];

const translations = {
  "en-US": {
    title: "MEMORY GAME",
    reset: "RESET GAME",
    win: "You won!",
    selectLanguage: "Select Language",
    cardHidden: "Hidden card",
    cardRevealed: "Revealed card:"
  },
  "pt-BR": {
    title: "JOGO DA MEMÓRIA",
    reset: "REINICIAR JOGO",
    win: "Você venceu!",
    selectLanguage: "Selecionar Idioma",
    cardHidden: "Carta oculta",
    cardRevealed: "Carta revelada:"
  },
  "es-ES": {
    title: "JUEGO DE MEMORIA",
    reset: "REINICIAR JUEGO",
    win: "¡Has ganado!",
    selectLanguage: "Seleccionar Idioma",
    cardHidden: "Carta oculta",
    cardRevealed: "Carta revelada:"
  }
};

let currentLang = "en-US";
let openCards = [];
let isLocked = false;

const gameBoard = document.querySelector(".game");
const statusMessage = document.getElementById("status-message");
const resetBtn = document.getElementById("reset-btn");
const langSelect = document.getElementById("lang-select");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  if (statusMessage.textContent !== "") {
    statusMessage.textContent = translations[lang].win;
  }

  updateCardsAria();
}

function updateCardsAria() {
  const cards = document.querySelectorAll(".item");
  cards.forEach((card) => {
    const isRevealed = card.classList.contains("boxOpen") || card.classList.contains("boxMatch");
    card.setAttribute(
      "aria-label",
      isRevealed
        ? `${translations[currentLang].cardRevealed} ${card.dataset.emoji}`
        : translations[currentLang].cardHidden
    );
  });
}

function initGame() {
  gameBoard.innerHTML = "";
  statusMessage.textContent = "";
  openCards = [];
  isLocked = false;

  const shuffledEmojis = shuffle(emojis);

  shuffledEmojis.forEach((emoji) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "item";
    card.dataset.emoji = emoji;
    card.textContent = emoji;
    card.setAttribute("aria-label", translations[currentLang].cardHidden);
    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
}

function handleCardClick() {
  if (isLocked) return;
  if (this.classList.contains("boxOpen") || this.classList.contains("boxMatch")) return;

  this.classList.add("boxOpen");
  this.setAttribute("aria-label", `${translations[currentLang].cardRevealed} ${this.dataset.emoji}`);
  openCards.push(this);

  if (openCards.length === 2) {
    isLocked = true;
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const [firstCard, secondCard] = openCards;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("boxMatch");
    secondCard.classList.add("boxMatch");
  } else {
    firstCard.classList.remove("boxOpen");
    secondCard.classList.remove("boxOpen");
    firstCard.setAttribute("aria-label", translations[currentLang].cardHidden);
    secondCard.setAttribute("aria-label", translations[currentLang].cardHidden);
  }

  openCards = [];
  isLocked = false;

  if (document.querySelectorAll(".boxMatch").length === emojis.length) {
    statusMessage.textContent = translations[currentLang].win;
  }
}

themeToggle.addEventListener("click", () => {
  const htmlEl = document.documentElement;
  const isDark = htmlEl.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";

  htmlEl.setAttribute("data-theme", nextTheme);
  themeIcon.textContent = nextTheme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
});

langSelect.addEventListener("change", (e) => {
  updateLanguage(e.target.value);
});

resetBtn.addEventListener("click", initGame);

initGame();
