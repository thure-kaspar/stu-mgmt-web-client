import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { createParticipant } from "@student-mgmt-client/domain-types";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	ASSESSMENTS,
	GROUP_1,
	PARTICIPANT_LECTURER,
	PARTICIPANT_STUDENT
} from "@student-mgmt-client/testing";
import { GroupDetailUiComponent, GroupDetailUiComponentModule } from "./group-detail-ui.component";

export default {
	component: GroupDetailUiComponent,
	title: "GroupDetailUiComponent",
	decorators: [
		moduleMetadata({
			imports: [GroupDetailUiComponentModule, StorybookTranslateModule, RouterTestingModule]
		})
	]
} as Meta<GroupDetailUiComponent>;

const Template: Story<GroupDetailUiComponent> = (args: GroupDetailUiComponent) => ({
	component: GroupDetailUiComponent,
	props: args
});

const defaultArgs: Partial<GroupDetailUiComponent> = {
	group: { ...GROUP_1, isClosed: true, hasPassword: true },
	courseId: "java-wise1920",
	participant: createParticipant(PARTICIPANT_LECTURER),
	assessments: ASSESSMENTS
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const AsStudent = Template.bind({});
AsStudent.args = { ...defaultArgs, participant: createParticipant(PARTICIPANT_STUDENT) };

export const NoTags = Template.bind({});
NoTags.args = { ...defaultArgs, group: { ...GROUP_1, isClosed: false, hasPassword: false } };

export const NoMembers = Template.bind({});
NoMembers.args = { ...defaultArgs, group: { ...GROUP_1, members: [] } };

export const NoAssessments = Template.bind({});
NoAssessments.args = { ...defaultArgs, assessments: [] };
