import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	AssignmentTypeChipComponent,
	AssignmentTypeChipComponentModule
} from "./assignment-type-chip.component";

export default {
	component: AssignmentTypeChipComponent,
	title: "Assignment/AssignmentTypeChip",
	decorators: [
		moduleMetadata({
			imports: [AssignmentTypeChipComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<AssignmentTypeChipComponent>;

const Template: Story<AssignmentTypeChipComponent> = (args: AssignmentTypeChipComponent) => ({
	component: AssignmentTypeChipComponent,
	props: args
});

export const Homework = Template.bind({});
Homework.args = {
	type: "HOMEWORK"
};

export const Testat = Template.bind({});
Testat.args = {
	type: "TESTAT"
};

export const Project = Template.bind({});
Project.args = {
	type: "PROJECT"
};

export const Seminar = Template.bind({});
Seminar.args = {
	type: "SEMINAR"
};

export const Other = Template.bind({});
Other.args = {
	type: "OTHER"
};
