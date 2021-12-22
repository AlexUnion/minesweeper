import { generateRandomNumber, copyMatrix, stringifyCoords, parseCoords } from "./utils";

/*
* 0 - empty field
* 1-9 - fields numbers
* 10 - closed field
* 11 - mine
* 12 - flag
*/

// matrix structure is [y][x]
class GameModel {

	isGameFinish;
	isGameOver;
	hCells;
	vCells;
	_minesCount;
	view;
	matrix;
	userSelected;
	time;
	timerId;
	flagCounter;

	constructor(hCells, vCells, minesCount, view) {
		this.time = 0;
		this.flagCounter = 0;
		this.timerId = null;
		this.isGameFinish = false;
		this.isGameOver = false;
		this.hCells = hCells;
		this.vCells = vCells;
		this._minesCount = minesCount;
		this.view = view;
		this.init();
	}

	init() {
		const { hCells, vCells, _minesCount } = this;
		this.matrix = GameModel.generateGameMatrix(hCells, vCells, _minesCount);
		this.calculate();
		this.userSelected = GameModel.generateUserSelect(hCells, vCells);
		this.view.init(copyMatrix(this.userSelected), this._minesCount);
	}

	startNewGame() {
		this.isGameFinish = false;
		this.isGameOver = false;
		this.flagCounter = 0;
		this.resetTimer();
		this.generateNewGameField();
		this.view.startGame();
		this.render();
	}

	generateNewGameField() {
		const { hCells, vCells, _minesCount } = this;
		this.matrix = GameModel.generateGameMatrix(hCells, vCells, _minesCount);
		this.calculate();
		this.userSelected = GameModel.generateUserSelect(hCells, vCells);
	}

	render() {
		const valueMatrix = copyMatrix(this.userSelected);
		const minesLeft = this._minesCount - this.flagCounter;
		this.view.render(valueMatrix, minesLeft);
	}

	selectOne(x, y) {
		if (this.isGameOver || this.isGameFinish) return;

		if (this.timerId === null && this.flagCounter === 0) {
			this.startTimer();
		}

		const userValue = this.userSelected[y][x];

		if (!GameModel.isClosed(userValue) || GameModel.isMarked(userValue)) return;

		const value = this.matrix[y][x];

		if (GameModel.isEmpty(value)) {
			const coords = GameModel.getClosestEmptyCells(this.matrix, x, y);
			this.openEmptyCells(coords);
			this.checkGameFinish();
		} else if (GameModel.isMine(value)) {
			this.gameOver();
		} else {
			this.setUserSelect(x, y, this.matrix[y][x]);
			this.checkGameFinish();
		}
		this.render();
	}

	markCell(x, y) {
		if (
			this.isGameOver
			|| this.isGameFinish
			|| this.timerId === null
		) return;

		const value = this.userSelected[y][x];

		if (GameModel.isMarked(value)) {
			this.reduceFlagCounter();
			this.userSelected[y][x] = 10;
		} else if (GameModel.isClosed(value)) {
			this.increaseFlagCounter();
			this.userSelected[y][x] = 12;

			this.checkGameFinish();
		} else {
			return;
		}
		this.render();
	}

	startTimer() {
		this.time = 0;
		this.view.setTime(0);

		if (this.timerId !== null) {
			clearInterval(this.timerId);
		}

		this.timerId = setInterval(() => {
			const time = this.increaseTime();
			this.view.setTime(time);
		}, 1000);
	}

	checkGameFinish() {
		if (this.flagCounter === this._minesCount) {
			if (this.isOpenedAllCells() && this.isFlagsPlacedRight()) {
				this.finishGame();
			}
		}
	}

	finishGame() {
		this.isGameFinish = true;
		this.stopTimer();
		this.view.finishGame();
	}

	resetTimer() {
		this.time = 0;
		this.view.setTime(0);
		if (this.timerId !== null) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
	}

	stopTimer() {
		clearInterval(this.timerId);
		this.timerId = null;
	}

	increaseTime() {
		return ++this.time;
	}

	increaseFlagCounter() {
		this.flagCounter++;
	}

	reduceFlagCounter() {
		this.flagCounter--;
	}

	gameOver() {
		const { userSelected } = this;
		this.stopTimer();

		this.matrix.forEach((row, i) => {
			row.forEach((value, j) => {
				if (GameModel.isMine(value)) {
					userSelected[i][j] = 11;
				}
			});
		});

		this.isGameOver = true;
		this.view.gameOver();
	}

	calculate() {
		this.matrix = this.matrix.map((currentRow, i, rowArr) => {
			const prevRow = rowArr[i - 1] ?? [];
			const nextRow = rowArr[i + 1] ?? [];

			return currentRow.map((cell, j) => {
				if (GameModel.isMine(cell)) {
					return cell;
				}

				return GameModel.isMine(prevRow[j - 1])
					+ GameModel.isMine(prevRow[j])
					+ GameModel.isMine(prevRow[j + 1])
					+ GameModel.isMine(currentRow[j - 1])
					+ GameModel.isMine(currentRow[j + 1])
					+ GameModel.isMine(nextRow[j - 1])
					+ GameModel.isMine(nextRow[j])
					+ GameModel.isMine(nextRow[j + 1]);
			});

		});
	}

	openEmptyCells(coords) {
		coords.forEach((data) => {
			const [x, y] = parseCoords(data);
			this.setUserSelect(x, y, 0);
			this.openClosestCells(x, y);
		});
	}

	openClosestCells(x, y) {
		const { hCells, vCells } = this;
		const points = [
			[x - 1, y - 1],
			[x, y - 1],
			[x + 1, y - 1],
			[x - 1, y],
			[x + 1, y],
			[x - 1, y + 1],
			[x, y + 1],
			[x + 1, y + 1],
		];
		points.forEach(([pointX, pointY]) => {
			if (
				pointY >= 0
				&& pointY < vCells
				&& pointX >= 0
				&& pointX < hCells
				&& GameModel.isClosed(this.userSelected[pointY][pointX])
			) {
				this.setUserSelect(pointX, pointY, this.matrix[pointY][pointX]);
			}
		});
	}

	setUserSelect(x, y, value) {
		this.userSelected[y][x] = value;
	}

	isFlagsPlacedRight() {
		const { userSelected, matrix } = this;

		const flags = [];

		userSelected.forEach((arr, i) => {
			arr.forEach((value, j) => {
				if (GameModel.isMarked(value)) {
					flags.push([i, j]);
				}
			});
		});

		const idx = flags.findIndex(([i, j]) => (
			!GameModel.isMine(matrix[i][j])
		));
		return idx === -1;
	}

	isOpenedAllCells() {
		const idx = this.userSelected.findIndex((row) => {
			const rowIdx = row.findIndex(
				(value) => GameModel.isClosed(value)
			);
			return rowIdx !== -1;
		});
		return idx === -1;
	}

	static getClosestEmptyCells(matrix, x, y) {
		const coords = new Map();

		(function step(x, y) {
			coords.set(stringifyCoords(x, y), true);

			const points = [
				[x - 1, y - 1],
				[x, y - 1],
				[x + 1, y - 1],
				[x - 1, y],
				[x + 1, y],
				[x - 1, y + 1],
				[x, y + 1],
				[x + 1, y + 1],
			];

			points.forEach(([pointX, pointY]) => {
				const key = stringifyCoords(pointX, pointY);
				if (
					matrix[pointY]
					&& GameModel.isEmpty(matrix[pointY][pointX])
					&& !coords.has(key)
				) {
					step(pointX, pointY);
				}
			});

		})(x, y);

		return Array.from(coords.keys());
	}

	static isMine(value) {
		return value === 11;
	}

	static isClosed(value) {
		return value === 10;
	}

	static isEmpty(value) {
		return value === 0;
	}

	static isMarked(value) {
		return value === 12;
	}

	static generateGameMatrix(hCells, vCells, minesCount) {
		const matrix = [];

		for (let i = 0; i < vCells; i++) {
			const nullableRow = new Array(hCells).fill(0);
			matrix.push(nullableRow);
		}

		(function fillOne(count) {
			if (count === 0) return;
			const x = generateRandomNumber(0, hCells);
			const y = generateRandomNumber(0, vCells);

			if (matrix[y][x] !== 0) {
				return fillOne(count);
			}

			matrix[y][x] = 11;
			fillOne(count - 1);
		})(minesCount);

		return matrix;
	}

	static generateUserSelect(hCells, vCells) {
		const arr = [];

		for (let i = 0; i < vCells; i++) {
			const emptyRow = new Array(hCells).fill(10);
			arr.push(emptyRow);
		}

		return arr;
	}

}

export default GameModel;
