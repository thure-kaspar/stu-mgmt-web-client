import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { USER } from "@student-mgmt-client/testing";
import { NavigationUiComponent, NavigationUiComponentModule } from "./navigation-ui.component";

export default {
	component: NavigationUiComponent,
	title: "NavigationUiComponent",
	decorators: [
		moduleMetadata({
			imports: [
				NavigationUiComponentModule,
				StorybookTranslateModule,
				BrowserAnimationsModule,
				RouterTestingModule
			]
		})
	]
} as Meta<NavigationUiComponent>;

const defaultArgs: Partial<NavigationUiComponent> = {
	user: USER,
	isHandset: false
};

const Template: Story<NavigationUiComponent> = (args: NavigationUiComponent) => ({
	component: NavigationUiComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = defaultArgs;

export const NoUser = Template.bind({});
NoUser.args = {
	...defaultArgs,
	user: null
};

export const Handset = Template.bind({});
Handset.args = {
	...defaultArgs,
	isHandset: true
};
