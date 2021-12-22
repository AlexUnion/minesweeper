import GameView from "./game/gameView";
import GameModel from "./game/gameModel";
import Controller from "./game/controller";

const vCells = 16;
const hCells = 16;
const minesCount = 40;

const gameContainer = document.getElementById('game-container');
const gameField = document.getElementById('game-field');

const gameView = new GameView(gameField);
const gameModel = new GameModel(hCells, vCells, minesCount, gameView);

new Controller(gameContainer, gameModel);
