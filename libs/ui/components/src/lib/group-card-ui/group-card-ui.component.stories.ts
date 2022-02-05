import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { createParticipant } from "@student-mgmt-client/domain-types";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	COURSE_JAVA_WISE1920,
	PARTICIPANT_LECTURER,
	PARTICIPANT_STUDENT
} from "@student-mgmt-client/testing";
import { GroupDto } from "@student-mgmt/api-client";
import {
	GroupCardUiComponent,
	GroupCardUiComponentModule,
	GroupCardUiComponentProps
} from "./group-card-ui.component";

export default {
	component: GroupCardUiComponent,
	title: "Group/GroupCard",
	decorators: [
		moduleMetadata({
			imports: [
				GroupCardUiComponentModule,
				StorybookTranslateModule,
				RouterTestingModule,
				BrowserAnimationsModule
			]
		})
	]
} as Meta<GroupCardUiComponent>;

const Template: Story<GroupCardUiComponent> = (args: GroupCardUiComponent) => ({
	component: GroupCardUiComponent,
	props: args
});

const defaultGroup: GroupDto = {
	id: "group-id",
	name: "Testgroup 1",
	hasPassword: true,
	isClosed: true,
	size: 2,
	members: [PARTICIPANT_STUDENT, PARTICIPANT_LECTURER]
};

const defaultProps: GroupCardUiComponentProps = {
	course: COURSE_JAVA_WISE1920,
	participant: createParticipant(PARTICIPANT_LECTURER),
	isJoinable: true,
	group: defaultGroup
};

export const AsLecturer = Template.bind({});
AsLecturer.args = {
	props: defaultProps
};

export const AsLecturerNoMembers = Template.bind({});
AsLecturerNoMembers.args = {
	props: {
		...defaultProps,
		group: {
			...defaultGroup,
			members: []
		}
	}
};

export const AsStudentJoinable = Template.bind({});
AsStudentJoinable.args = {
	props: {
		...defaultProps,
		participant: createParticipant(PARTICIPANT_STUDENT)
	}
};

export const AsStudentNotJoinable = Template.bind({});
AsStudentNotJoinable.args = {
	props: {
		...defaultProps,
		participant: createParticipant(PARTICIPANT_STUDENT),
		group: {
			...defaultGroup
		},
		isJoinable: false
	}
};

export const AsStudentNoFlags = Template.bind({});
AsStudentNoFlags.args = {
	props: {
		...defaultProps,
		participant: createParticipant(PARTICIPANT_STUDENT),
		group: {
			...defaultGroup,
			isClosed: false,
			hasPassword: false
		}
	}
};
