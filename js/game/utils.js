export function fillZero(strings, value) {
	if (typeof value === 'number') {
		value += '';
	}
	const { length: parseLength } = strings[0];
	if (value.length === parseLength) {
		return value;
	}
	const numbers = value.split('').reverse();
	for (let i = numbers.length; i < parseLength; i++) {
		numbers.push('0');
	}
	return numbers.reverse().join('');
}

export const generateRandomNumber = (min, max) => (
	Math.floor(Math.random() * (max - min)) + min
);

export const copyMatrix = (matrix) => (
	matrix.map((arr) => [...arr])
);

export const stringifyCoords = (x, y) => `${x}-${y}`;
export const parseCoords = (coordinate) => coordinate.split('-').map(((value) => Number(value)));

export const parseTime = (value) => {
	const minutes = Math.floor(value / 60);
	const seconds = value % 60;
	const parsedMinutes = fillZero`00${minutes}`;
	const parsedSeconds = fillZero`00${seconds}`;
	return `${parsedMinutes}:${parsedSeconds}`;
};
