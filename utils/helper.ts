import { ActivatedRoute } from "@angular/router";

/**
 * Returns the current semester.
 * Winter semesters will be represented as "wise" followed by the last two digits of the years that the semester will take place in.
 * Summer semesters will be represented as "sose" followed by the corresponding year.
 * - Example 1: "wise1819"
 * - Example 2: "sose2021"
 */
export function getSemester(): string {
	const now = new Date();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();
	let semester = undefined;

	if (month <= 9 && month >= 4) {
		semester = "sose" + year;
	} else {
		const yearLastTwoDigits = year % 100;
		if (month >= 1 && month <= 3) {
			semester = "wise" + (yearLastTwoDigits - 1) + yearLastTwoDigits;
		} else {
			semester = "wise" + yearLastTwoDigits + (yearLastTwoDigits + 1);
		}
	}

	return semester;
}

export function getSemesterString(value: string): string {
	if (!value || value === "") {
		return value;
	}

	if (!/^(wise|sose)\d{4}$/g.test(value)) return "?";

	let semName = value.substring(0, 4); // wise or sose
	let semYear = value.substring(4); // i.e 2020

	if (semName === "wise") {
		semName = "WiSe";
		semYear = value.substring(4, 6) + "/" + value.substring(6); // i.e 1920 -> 19/20
	} else {
		semName = "SoSe";
	}

	return `${semName} ${semYear}`;
}

/** Returns the specified route parameter. */
export function getRouteParam(param: string, route: ActivatedRoute): string | null {
	return route.snapshot.paramMap.get(param);
}

export function createDictionary<T>(
	data: T[],
	property: (item: T) => string
): { [key: string]: T } {
	const map = {};
	for (const value of data) {
		map[property(value)] = value;
	}
	return map;
}
