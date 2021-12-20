import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { createParticipant } from "@student-mgmt-client/domain-types";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	ASSESSMENTS,
	PARTICIPANT_LECTURER,
	PARTICIPANT_STUDENT
} from "@student-mgmt-client/testing";
import { AssignmentDto } from "@student-mgmt/api-client";
import {
	AssignmentCardUiComponent,
	AssignmentCardUiComponentModule,
	AssignmentCardUiComponentProps
} from "./assignment-card-ui.component";

export default {
	component: AssignmentCardUiComponent,
	title: "AssignmentCardUiComponent",
	decorators: [
		moduleMetadata({
			imports: [
				AssignmentCardUiComponentModule,
				StorybookTranslateModule,
				RouterTestingModule
			]
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
	type: "HOMEWORK",
	startDate: new Date(2022, 4, 20, 11, 0).toString(),
	endDate: new Date(2022, 4, 20, 12, 0).toString(),
	links: [
		{ name: "Student-Management-System", url: "example.url" },
		{ name: "Learnweb", url: "example.url" }
	],
	comment: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem doloremque quos exercitationem quae saepe repellat libero possimus laudantium obcaecati asperiores dolore iusto recusandae earum reprehenderit vero, ad totam ipsa enim.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem doloremque quos exercitationem quae saepe repellat libero possimus laudantium obcaecati asperiores dolore iusto recusandae earum reprehenderit vero, ad totam ipsa enim.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem doloremque quos exercitationem quae saepe repellat libero possimus laudantium obcaecati asperiores dolore iusto recusandae earum reprehenderit vero, ad totam ipsa enim.`
};

const defaultProps: AssignmentCardUiComponentProps = {
	assignment: defaultAssignment,
	participant: createParticipant(PARTICIPANT_STUDENT),
	group: PARTICIPANT_STUDENT.group,
	courseId: "java-wise1920"
};

export const Default = Template.bind({});
Default.args = {
	props: defaultProps
};

export const WithBonusPoints = Template.bind({});
WithBonusPoints.args = {
	props: {
		...defaultProps,
		assignment: {
			...defaultAssignment,
			bonusPoints: 7
		}
	}
};

export const WithMenu = Template.bind({});
WithMenu.args = {
	props: {
		assignment: defaultAssignment,
		participant: createParticipant(PARTICIPANT_LECTURER),
		courseId: "java-wise1920"
	}
};

export const WithAssessment = Template.bind({});
WithAssessment.args = {
	props: {
		...defaultProps,
		assessment: ASSESSMENTS[0]
	}
};

export const WithAssessmentAndFailState = Template.bind({});
WithAssessmentAndFailState.args = {
	props: {
		...defaultProps,
		assessment: ASSESSMENTS[0],
		passFailSubmittedState: "passed"
	}
};

export const NoDates = Template.bind({});
NoDates.args = {
	props: {
		...defaultProps,
		assignment: {
			...defaultAssignment,
			startDate: undefined,
			endDate: undefined
		}
	}
};

export const NoDescription = Template.bind({});
NoDescription.args = {
	props: {
		...defaultProps,
		assignment: {
			...defaultAssignment,
			comment: undefined
		}
	}
};

export const NoLinks = Template.bind({});
NoLinks.args = {
	props: {
		...defaultProps,
		assignment: {
			...defaultAssignment,
			links: []
		}
	}
};

export const NoGroup = Template.bind({});
NoGroup.args = {
	props: {
		...defaultProps,
		group: null,
		assignment: {
			...defaultAssignment,
			startDate: new Date(2022, 4, 20, 11, 0).toString(),
			endDate: new Date(2022, 4, 20, 12, 0).toString()
		}
	}
};

export const NoGroupAndWarning = Template.bind({});
NoGroupAndWarning.args = {
	props: {
		...defaultProps,
		group: null,
		displayNoGroupWarning: true
	}
};
