class Controller {

	container;
	model;

	constructor(container, model) {
		this.container = container;
		this.model = model;
		this.init();
	}

	init() {
		this.container.addEventListener('game-field-left-click', (event) => {
			const { x, y } = event.detail;
			this.model.selectOne(x, y);
		});
		this.container.addEventListener('game-field-right-click', (event) => {
			const { x, y } = event.detail;
			this.model.markCell(x, y);
		})
		this.container.addEventListener('start-new-game', () => {
			this.model.startNewGame();
		})
	}

	static register(element, eventName, callback) {

	}

}

export default Controller;
