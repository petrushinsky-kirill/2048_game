'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

getStatusMessage();

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const scores = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      const value = state[row][col];
      const index = row * 4 + col;

      cells[index].textContent = value === 0 ? '' : value;
    }
  }

  styleCells();
}

function renderScore() {
  scores.textContent = game.score;
}

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  renderScore();
  getStatusMessage();
});

restartButton.addEventListener('click', () => {
  game.restart();
  renderBoard();
  renderScore();
  getStatusMessage();
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    moved = true;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    moved = true;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    moved = true;
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    moved = true;
  }

  if (moved) {
    renderBoard();
    renderScore();
    getStatusMessage();
  }
});

function getStatusMessage() {
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  const gameStatus = game.status;

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (gameStatus === 'playing') {
    startMessage.classList.add('hidden');
  }
}

function styleCells() {
  cells.forEach((cell) => {
    const num = cell.textContent;

    cell.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        cell.classList.remove(cls);
      }
    });

    if (num) {
      cell.classList.add(`field-cell--${num}`);
    }
  });
}
