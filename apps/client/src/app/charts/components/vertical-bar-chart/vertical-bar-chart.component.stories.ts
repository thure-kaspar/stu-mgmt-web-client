import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { ChartsModule } from "../../charts.module";
import { VerticalBarChartComponent, VerticalBarChartOptions } from "./vertical-bar-chart.component";

export default {
	component: VerticalBarChartComponent,
	title: "VerticalBarChartComponent",
	decorators: [
		moduleMetadata({
			imports: [ChartsModule, BrowserAnimationsModule]
		})
	]
} as Meta<VerticalBarChartComponent>;

const Template: Story<VerticalBarChartComponent> = (args: VerticalBarChartComponent) => ({
	component: VerticalBarChartComponent,
	props: args
});

const defaultArgs: Partial<VerticalBarChartComponent> = {
	xAxisLabel: "X-Axis-Label",
	yAxisLabel: "Y-Axis-Label",
	data: [
		{
			name: "0",
			value: 0
		},
		{
			name: "1",
			value: 1
		},
		{
			name: "2",
			value: 4
		},
		{
			name: "3",
			value: 6
		},
		{
			name: "4",
			value: 5
		},
		{
			name: "5",
			value: 3
		}
	]
};

const withCustomColorsArgs: Partial<VerticalBarChartComponent> = {
	xAxisLabel: "X-Axis-Label",
	yAxisLabel: "Y-Axis-Label",
	data: [
		{
			name: "0",
			value: 0
		},
		{
			name: "1",
			value: 1
		},
		{
			name: "2",
			value: 4
		},
		{
			name: "3",
			value: 6
		},
		{
			name: "4",
			value: 5
		},
		{
			name: "5",
			value: 3
		}
	],
	options: new VerticalBarChartOptions({
		customColors: defaultArgs.data.map(d => ({
			name: d.name,
			value: d.value % 2 == 0 ? "var(--accent)" : "var(--primary)"
		}))
	})
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const WithCustomColors = Template.bind({});
WithCustomColors.args = withCustomColorsArgs;
