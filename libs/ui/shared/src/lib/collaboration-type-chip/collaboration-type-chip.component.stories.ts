import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { AssignmentDto } from "@student-mgmt/api-client";
import {
	CollaborationTypeChipComponent,
	CollaborationTypeChipComponentModule
} from "./collaboration-type-chip.component";

export default {
	component: CollaborationTypeChipComponent,
	title: "Assignment/CollaborationTypeChip",
	decorators: [
		moduleMetadata({
			imports: [CollaborationTypeChipComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<CollaborationTypeChipComponent>;

const Template: Story<CollaborationTypeChipComponent> = (args: CollaborationTypeChipComponent) => ({
	component: CollaborationTypeChipComponent,
	props: args
});

export const Group = Template.bind({});
Group.args = {
	collaborationType: AssignmentDto.CollaborationEnum.GROUP
};

export const Single = Template.bind({});
Single.args = {
	collaborationType: AssignmentDto.CollaborationEnum.SINGLE
};

export const GroupOrSingle = Template.bind({});
GroupOrSingle.args = {
	collaborationType: AssignmentDto.CollaborationEnum.GROUP_OR_SINGLE
};
