import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import { PARTICIPANT_STUDENT } from "@student-mgmt-client/testing";
import { RoundingMethod } from "@student-mgmt-client/util-helper";
import {
	AdmissionRuleDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto,
	RoundingBehavior,
	RuleCheckResult
} from "@student-mgmt/api-client";
import {
	ParticipantAdmissionStatusUiComponent,
	ParticipantAdmissionStatusUiComponentModule
} from "./participant-admission-status-ui.component";

export default {
	component: ParticipantAdmissionStatusUiComponent,
	title: "ParticipantAdmissionStatusUiComponent",
	decorators: [
		moduleMetadata({
			imports: [ParticipantAdmissionStatusUiComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<ParticipantAdmissionStatusUiComponent>;

const Template: Story<ParticipantAdmissionStatusUiComponent> = (
	args: ParticipantAdmissionStatusUiComponent
) => ({
	component: ParticipantAdmissionStatusUiComponent,
	props: args
});

const overallHomeworkRule: OverallPercentRuleDto & { result: RuleCheckResult } = {
	assignmentType: "HOMEWORK",
	requiredPercent: 50,
	achievedPercentRounding: {
		type: "NONE"
	},
	type: "REQUIRED_PERCENT_OVERALL",
	result: {
		_assignmentType: "HOMEWORK",
		_rule: "REQUIRED_PERCENT_OVERALL",
		achievedPercent: 75,
		achievedPoints: 75,
		passed: true
	}
};

const individualTestatRule: IndividualPercentWithAllowedFailuresRuleDto & {
	result: RuleCheckResult;
} = {
	assignmentType: "TESTAT",
	requiredPercent: 50,
	allowedFailures: 2,
	achievedPercentRounding: {
		type: "NONE"
	},
	type: "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES",
	result: {
		_assignmentType: "TESTAT",
		_rule: "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES",
		achievedPercent: 33.33,
		achievedPoints: 1,
		passed: true
	}
};

const defaultArgs: Partial<ParticipantAdmissionStatusUiComponent> = {
	isLoading: false,
	noAdmissionCriteria: false,
	admissionStatus: {
		hasAdmission: true,
		fulfillsAdmissionCriteria: true,
		hasAdmissionFromPreviousSemester: false,
		participant: PARTICIPANT_STUDENT,
		results: [] // not required, will be inferred from other properties
	},
	criteriaWithResult: [overallHomeworkRule, individualTestatRule]
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const WithFailedCriteria = Template.bind({});
WithFailedCriteria.args = {
	...defaultArgs,
	admissionStatus: {
		hasAdmission: true,
		fulfillsAdmissionCriteria: false,
		hasAdmissionFromPreviousSemester: false,
		participant: PARTICIPANT_STUDENT,
		results: [] // not required, will be inferred from other properties
	},
	criteriaWithResult: [
		{
			...overallHomeworkRule,
			result: {
				...overallHomeworkRule.result,
				achievedPercent: 25,
				achievedPoints: 25,
				passed: false
			}
		}
	]
};

export const WithAdmissionFromPreviousSemester = Template.bind({});
WithAdmissionFromPreviousSemester.args = {
	...defaultArgs,
	admissionStatus: {
		hasAdmission: true,
		fulfillsAdmissionCriteria: false,
		hasAdmissionFromPreviousSemester: true,
		participant: PARTICIPANT_STUDENT,
		results: [] // not required, will be inferred from other properties
	},
	criteriaWithResult: [
		{
			...overallHomeworkRule,
			result: {
				...overallHomeworkRule.result,
				achievedPercent: 25,
				achievedPoints: 25,
				passed: false
			}
		}
	]
};

export const NoCriteria = Template.bind({});
NoCriteria.args = {
	noAdmissionCriteria: true
};

export const Loading = Template.bind({});
Loading.args = {
	isLoading: true
};
