import { fillZero, parseTime, stringifyCoords } from "./utils";

const flagSrc = new URL(
	'/public/img/flag.svg',
	import.meta.url,
);
const mineSrc = new URL(
	'/public/img/mine.svg?width=22&height=22',
	import.meta.url,
);

class GameView {

	gameField;
	currentMatrix;
	newGameButton;
	gameOverButton;
	gameTimer;
	minesCount;


	constructor(gameField) {
		this.gameField = gameField;
		this.currentMatrix = [];

		this.newGameButton = document.getElementById('start-game');
		this.gameOverButton = document.getElementById('game-over');
		this.gameWinButton = document.getElementById('game-win');
		this.minesCount = document.getElementById('mines-count');
		this.gameTimer = document.getElementById('game-timer');
	}

	init(matrix, minesLeft) {
		this.currentMatrix = matrix;
		GameView.generateGameField(matrix, this.gameField);

		this.setFlagCount(minesLeft);

		const listener = () => {
			const event = new CustomEvent('start-new-game', {
				bubbles: true,
			});
			this.newGameButton.dispatchEvent(event);
		};

		this.newGameButton.addEventListener('click', listener);
		this.gameOverButton.addEventListener('click', listener);
		this.gameWinButton.addEventListener('click', listener);
	}

	render(matrix, minesLeft) {
		const { currentMatrix } = this;

		matrix.forEach((row, i) => {
			row.forEach((value, j) => {
				if (currentMatrix[i][j] !== value) {
					const id = stringifyCoords(j, i);
					const element = document.getElementById(id);

					this.updateElement(element, value);
				}
			});
		});

		this.setFlagCount(minesLeft);
		this.currentMatrix = matrix;
	}

	updateElement(element, value) {
		switch (value) {
			case 0: {
				element.innerText = '';
				element.setAttribute('class', 'game-cell empty-cell');
				break;
			}
			case 1: {
				element.setAttribute('class', 'game-cell one');
				break;
			}
			case 2: {
				element.setAttribute('class', 'game-cell two');
				break;
			}
			case 3: {
				element.setAttribute('class', 'game-cell three');
				break;
			}
			case 10: {
				element.innerHTML = '';
				element.setAttribute('class', 'game-cell closed-cell');
				break;
			}
			case 11: {
				if (element.innerHTML.length) {
					element.setAttribute('class', 'game-cell background-green');
					break;
				}
				const mine = GameView.createImage(mineSrc, '');
				element.insertAdjacentElement('beforeend', mine);
				element.setAttribute('class', 'game-cell background-red');
				break;
			}
			case 12: {
				const flag = GameView.createImage(flagSrc, 'game-flag');
				element.insertAdjacentElement('beforeend', flag);
				break;
			}
			default: {
				element.setAttribute('class', 'game-cell other');
			}
		}
		if (value > 0 && value < 10) {
			element.innerText = value;
		}
	}

	gameOver() {
		GameView.setStatus(this.gameOverButton, this.newGameButton);
	}

	startGame() {
		GameView.setStatus(this.newGameButton, this.gameOverButton, this.gameWinButton);
	}

	finishGame() {
		GameView.setStatus(this.gameWinButton, this.newGameButton);
	}

	setTime(time) {
		this.gameTimer.innerText = parseTime(time);
	}

	setFlagCount(value) {
		if (value < 0) {
			return this.minesCount.innerText = '000';
		}
		this.minesCount.innerText = fillZero`000${value}`;
	}

	static createImage(src, classes) {
		const image = document.createElement('img');
		image.setAttribute('class', classes);
		image.setAttribute('src', src);
		return image;
	}

	static setStatus(elementShow, ...elementsHide) {
		elementsHide.forEach((el) => el.classList.add('d-none'))
		elementShow.classList.remove('d-none');
	}

	static createRowComponent() {
		const row = document.createElement('div');
		row.setAttribute('class', 'game-row');
		return row;
	}

	static createCellComponent(x, y) {
		const cell = document.createElement('div');
		const id = stringifyCoords(x, y);

		cell.setAttribute('id', id);
		cell.setAttribute('class', 'game-cell closed-cell');

		cell.addEventListener('click', () => {
			const customEvent = new CustomEvent('game-field-left-click', {
				bubbles: true,
				detail: { x, y },
			});
			cell.dispatchEvent(customEvent);
		});
		cell.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			const customEvent = new CustomEvent('game-field-right-click', {
				bubbles: true,
				detail: { x, y },
			});
			cell.dispatchEvent(customEvent);
		});

		return cell;
	}

	static generateGameField(matrix, container) {
		matrix.forEach((row, i) => {
			const rowComponent = GameView.createRowComponent();
			row.forEach((_, j) => {
				const cell = GameView.createCellComponent(j, i);
				rowComponent.insertAdjacentElement('beforeend', cell);
			});
			container.insertAdjacentElement('beforeend', rowComponent);
		});
	}

}

export default GameView;
