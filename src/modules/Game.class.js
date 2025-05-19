'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = [...initialState];
    } else {
      this.board = Array.from({ length: this.size }, () => {
        return Array(this.size).fill(0);
      });
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = this.board[row];
      const newRow = this.mergeRow(originalRow);

      if (!this.arraysCompare(originalRow, newRow)) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = this.board[row];
      const reversedRow = originalRow.slice().reverse();
      const newRowReversed = this.mergeRow(reversedRow);
      const newRow = newRowReversed.reverse();

      if (!this.arraysCompare(originalRow, newRow)) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.mergeRow(column);

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          this.board[row][col] = newColumn[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const reversedColumn = column.reverse();

      const newColumnReversed = this.mergeRow(reversedColumn);
      const newColumn = newColumnReversed.reverse();

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          this.board[row][col] = newColumn[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return [...this.board];
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.status === 'win' || this.status === 'lose') {
      return this.status;
    }

    // Перевірка на перемогу
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return this.status;
    }

    this.status = 'playing';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array.from({ length: this.size }, () => {
      return Array(this.size).fill(0);
    });

    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row: r, col: c } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  mergeRow(row) {
    const filtered = row.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < row.length) {
      result.push(0);
    }

    return result;
  }

  arraysCompare(arr1, arr2) {
    return arr1.every((value, index) => {
      return value === arr2[index];
    });
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          return true;
        }

        if (col < this.size - 1 && this.board[row][col + 1] === value) {
          return true;
        }

        if (row < this.size - 1 && this.board[row + 1][col] === value) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
