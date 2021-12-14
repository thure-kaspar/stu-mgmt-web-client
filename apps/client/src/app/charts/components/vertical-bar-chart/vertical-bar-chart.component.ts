import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";

export type VerticalBarChartData = {
	name: string;
	value: number;
}[];

export class VerticalBarChartOptions {
	/** Bar color */
	//colorScheme = "var(--accent)";
	/** Allows assigning a specific color to an entry, i.e. `customColors = [{ name: "10", value: "#ffffff"}`] */
	customColors: { name: string; value: string }[];
	showXAxis = true;
	showYAxis = true;
	showXAxisLabel = true;
	showYAxisLabel = true;
	showDataLabel = true;
	showLegend = false;
	showAnimations = true;
	useGradient = false;

	constructor(options?: Partial<VerticalBarChartOptions>) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

@Component({
	selector: "student-mgmt-vertical-bar-chart",
	templateUrl: "./vertical-bar-chart.component.html",
	styleUrls: ["./vertical-bar-chart.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalBarChartComponent implements OnInit {
	@Input() xAxisLabel: string;
	@Input() yAxisLabel: string;
	@Input() data: VerticalBarChartData;
	@Input() options = new VerticalBarChartOptions();

	constructor() {}

	ngOnInit(): void {}
}
