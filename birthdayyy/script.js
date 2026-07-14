const friendName = "BATSY ⸜(｡˃ ᵕ ˂ )⸝🎂";
const customMessage = `Happy birthday to one of the coolest people in the galaxy.
May your year be full of legendary wins, brilliant moves, and moments worthy of a saga.`;

document.getElementById("friendName").textContent = friendName;
document.getElementById("birthdayMessage").textContent = customMessage;

const gameSection = document.getElementById("gameSection");
const surprise = document.getElementById("surprise");
const statusEl = document.getElementById("status");
const board = document.getElementById("board");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const choiceButtons = document.querySelectorAll("#choices button");

const pieces = {
  "a8": "♜",
  "g8": "♚",
  "f7": "♟",
  "g7": "♟",
  "h7": "♟",
  "h6": "♕",
  "f6": "♘",
  "g2": "♙",
  "h2": "♙",
  "g1": "♔",
  "f1": "♖"
};

function createBoard() {
  board.innerHTML = "";
  const files = ["a","b","c","d","e","f","g","h"];

  for (let rank = 8; rank >= 1; rank--) {
    files.forEach((file, fileIndex) => {
      const square = document.createElement("div");
      const id = `${file}${rank}`;
      square.className = `square ${(rank + fileIndex) % 2 === 0 ? "light" : "dark"}`;
      square.dataset.square = id;
      square.setAttribute("role", "gridcell");
      square.textContent = pieces[id] || "";

      if (id === "h7") square.classList.add("target");
      board.appendChild(square);
    });
  }
}

function revealWin() {
  statusEl.textContent = "Checkmate. The dark side has fallen.";
  statusEl.style.borderLeftColor = "var(--green)";
  const target = document.querySelector('[data-square="h7"]');
  target.classList.remove("target");
  target.classList.add("checkmate");
  target.textContent = "♕";

  choiceButtons.forEach(button => button.disabled = true);

  setTimeout(() => {
    surprise.classList.remove("hidden");
    surprise.classList.add("fade-in");
    surprise.scrollIntoView({ behavior: "smooth", block: "center" });
    launchConfetti();
  }, 700);
}

choiceButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.move === "win") {
      revealWin();
    } else {
      statusEl.textContent = "Close — but the Force is pointing toward Queen to H7.";
      statusEl.style.borderLeftColor = "var(--red)";
      button.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 320 }
      );
    }
  });
});

startBtn.addEventListener("click", () => {
  gameSection.classList.remove("hidden");
  gameSection.classList.add("fade-in");
  gameSection.scrollIntoView({ behavior: "smooth" });
});

replayBtn.addEventListener("click", () => {
  surprise.classList.add("hidden");
  choiceButtons.forEach(button => button.disabled = false);
  statusEl.textContent = "May the Force guide your move.";
  statusEl.style.borderLeftColor = "var(--blue)";
  createBoard();
  gameSection.scrollIntoView({ behavior: "smooth" });
});

function launchConfetti() {
  const symbols = ["♟", "♕", "✦", "★"];
  for (let i = 0; i < 42; i++) {
    const item = document.createElement("span");
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    Object.assign(item.style, {
      position: "fixed",
      left: `${Math.random() * 100}vw`,
      top: "-20px",
      zIndex: 9999,
      color: Math.random() > .5 ? "#f5d66f" : "#77b7ff",
      fontSize: `${14 + Math.random() * 18}px`,
      pointerEvents: "none",
      transition: `transform ${2 + Math.random() * 2}s linear, opacity 3s ease`
    });
    document.body.appendChild(item);

    requestAnimationFrame(() => {
      item.style.transform = `translateY(110vh) rotate(${Math.random() * 720}deg)`;
      item.style.opacity = "0";
    });

    setTimeout(() => item.remove(), 4200);
  }
}

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeStars() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from({ length: Math.floor(window.innerWidth / 8) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + .2,
    speed: Math.random() * .25 + .05
  }));
}

function animateStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(255,255,255,.85)";

  stars.forEach(star => {
    star.y += star.speed;
    if (star.y > window.innerHeight) star.y = 0;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resizeStars);
resizeStars();
animateStars();
createBoard();
