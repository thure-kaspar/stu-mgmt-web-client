import { FirstCharacterPipe } from "./first-character.pipe";
describe("FirstCharacterPipe", () => {
	let firstCharacterPipe: FirstCharacterPipe;

	beforeAll(() => {
		firstCharacterPipe = new FirstCharacterPipe();
	});

	it("Should be defined", () => {
		expect(firstCharacterPipe).toBeDefined();
	});

	it("John Doe -> Returns JD", () => {
		expect(firstCharacterPipe.transform("John Doe")).toEqual("JD");
	});

	it("Mustermann -> Returns M", () => {
		expect(firstCharacterPipe.transform("Mustermann")).toEqual("M");
	});

	it("A B C -> Returns A", () => {
		expect(firstCharacterPipe.transform("A B C")).toEqual("A");
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
