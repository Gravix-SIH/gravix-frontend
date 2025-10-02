export function randomString(length: number = 8) {
	return Math.random().toString(36).substring(2, 2 + length);
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
