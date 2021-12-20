import { FirstCharacterPipe } from "./first-character.pipe";
describe("FirstCharacterPipe", () => {
	let firstCharacterPipe: FirstCharacterPipe;

	beforeAll(() => {
		firstCharacterPipe = new FirstCharacterPipe();
	});

	it("Should be defined", () => {
		expect(firstCharacterPipe).toBeDefined();
	});

	it("String -> Returns first character", () => {
		expect(firstCharacterPipe.transform("Max Mustermann")).toEqual("M");
	});

	it("Empty string -> Returns ?", () => {
		expect(firstCharacterPipe.transform("")).toEqual("?");
	});

	it("Null -> Returns ?", () => {
		expect(firstCharacterPipe.transform(null)).toEqual("?");
	});

	it("Undefined -> Returns ?", () => {
		expect(firstCharacterPipe.transform(undefined)).toEqual("?");
	});
});
