import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { POINTS_OVERVIEW } from "@student-mgmt-client/testing";
import {
	PointsOverviewTableUiComponent,
	PointsOverviewTableUiComponentModule
} from "./points-overview-table-ui.component";

export default {
	component: PointsOverviewTableUiComponent,
	title: "PointsOverviewTableUi",
	decorators: [
		moduleMetadata({
			imports: [
				PointsOverviewTableUiComponentModule,
				RouterTestingModule,
				StorybookTranslateModule,
				BrowserAnimationsModule
			]
		})
	]
} as Meta<PointsOverviewTableUiComponent>;

const Template: Story<PointsOverviewTableUiComponent> = (args: PointsOverviewTableUiComponent) => ({
	component: PointsOverviewTableUiComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	props: {
		courseId: "java-wise1920",
		pointsOverview: POINTS_OVERVIEW
	}
};
