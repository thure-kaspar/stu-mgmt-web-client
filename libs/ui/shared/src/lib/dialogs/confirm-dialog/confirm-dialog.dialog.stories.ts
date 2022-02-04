import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	ConfirmDialogUiComponent,
	ConfirmDialogUiComponentModule
} from "./confirm-dialog-ui/confirm-dialog-ui.component";

export default {
	component: ConfirmDialogUiComponent,
	title: "ConfirmDialogUi",
	decorators: [
		moduleMetadata({
			imports: [ConfirmDialogUiComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<ConfirmDialogUiComponent>;

const Template: Story<ConfirmDialogUiComponent> = (args: ConfirmDialogUiComponent) => ({
	component: ConfirmDialogUiComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {};

export const CustomTitleAndMessage = Template.bind({});
CustomTitleAndMessage.args = {
	title: "Gruppe verlassen",
	message: "Möchtest du diese Gruppe wirklich verlassen ?"
};

export const WithParams = Template.bind({});
WithParams.args = {
	title: "Gruppe verlassen",
	message: "Möchtest du diese Gruppe wirklich verlassen ?",
	params: ["Programmierpraktikum I: Java", "JAVA-001", "Max Mustermann"]
};
