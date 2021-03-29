export class Range {
	label: string;

	constructor(readonly lower: number, readonly upper: number, customLabel?: string) {
		this.label = customLabel ? customLabel : `${lower}-${upper}`;
	}
}

/**
 * Finds the appropriate range label for the given `value` by sorting the ranges in descending order
 * and checking if the condition `value >= range.lower` is `true`.
 *
 * @throws `Error` if there is no matching range.
 */
export function mapToRangeLabel(ranges: Range[], value: number): string {
	const copiedRangesDesc = [...ranges].sort((a, b) => b.upper - a.upper);
	for (const range of copiedRangesDesc) {
		if (value >= range.lower) {
			return range.label;
		}
	}

	throw new Error("Failed to find a matching range for: " + value);
}
