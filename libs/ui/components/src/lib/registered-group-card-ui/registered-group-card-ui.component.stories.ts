import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { GROUP_1 } from "@student-mgmt-client/testing";
import {
	RegisteredGroupCardUiComponent,
	RegisteredGroupCardUiComponentModule
} from "./registered-group-card-ui.component";

export default {
	component: RegisteredGroupCardUiComponent,
	title: "RegisteredGroupCardUiComponent",
	decorators: [
		moduleMetadata({
			imports: [
				RegisteredGroupCardUiComponentModule,
				RouterTestingModule,
				StorybookTranslateModule,
				BrowserAnimationsModule
			]
		})
	]
} as Meta<RegisteredGroupCardUiComponent>;

const Template: Story<RegisteredGroupCardUiComponent> = (args: RegisteredGroupCardUiComponent) => ({
	component: RegisteredGroupCardUiComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	group: GROUP_1,
	courseId: "java-wise1920"
};

export const EmptyGroup = Template.bind({});
EmptyGroup.args = {
	group: {
		name: "Empty Group",
		size: 0,
		members: []
	},
	courseId: "java-wise1920"
};
