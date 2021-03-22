import { RoundingBehavior } from "../api";

export function RoundingMethod(
	type: RoundingBehavior.TypeEnum,
	decimals?: number
): (value: number) => number {
	switch (type) {
		case "NONE":
			return (value: number): number => value;
		case "DECIMALS":
			return (value: number): number =>
				Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
		case "DOWN_NEAREST_INTEGER":
			return (value: number): number => Math.floor(value);
		case "UP_NEAREST_INTEGER":
			return (value: number): number => Math.ceil(value);
		default:
			throw new Error("Unsupported RoundingType!");
	}
}
