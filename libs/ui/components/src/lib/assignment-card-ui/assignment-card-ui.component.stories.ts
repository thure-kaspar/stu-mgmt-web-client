import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { createParticipant } from "@student-mgmt-client/domain-types";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { AssignmentDto } from "@student-mgmt/api-client";
import { PARTICIPANT_STUDENT } from "libs/testing/src";
import {
	AssignmentCardUiComponent,
	AssignmentCardUiComponentModule
} from "./assignment-card-ui.component";

export default {
	component: AssignmentCardUiComponent,
	title: "AssignmentCardUiComponent",
	decorators: [
		moduleMetadata({
			imports: [AssignmentCardUiComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<AssignmentCardUiComponent>;

const Template: Story<AssignmentCardUiComponent> = (args: AssignmentCardUiComponent) => ({
	component: AssignmentCardUiComponent,
	props: args
});

const defaultAssignment: AssignmentDto = {
	id: "assignment-id",
	collaboration: "GROUP",
	name: "Hausaufgabe 01",
	state: "IN_PROGRESS",
	points: 12,
	type: "HOMEWORK"
};

export const Default = Template.bind({});
Default.args = {
	props: {
		assignment: defaultAssignment,
		participant: createParticipant(PARTICIPANT_STUDENT),
		group: PARTICIPANT_STUDENT.group,
		courseId: "java-wise1920"
	}
};
