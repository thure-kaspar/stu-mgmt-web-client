import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";
import {
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto,
	RoundingBehavior
} from "@student-mgmt/api-client";
import {
	AdmissionRuleUiComponent,
	AdmissionRuleUiComponentModule
} from "./admission-rule-ui.component";

export default {
	component: AdmissionRuleUiComponent,
	title: "Admission Status/AdmissionRule",
	decorators: [
		moduleMetadata({
			imports: [AdmissionRuleUiComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<AdmissionRuleUiComponent>;

const Template: Story<AdmissionRuleUiComponent> = (args: AdmissionRuleUiComponent) => ({
	component: AdmissionRuleUiComponent,
	props: args
});

const overallPercentRule: OverallPercentRuleDto = {
	type: "REQUIRED_PERCENT_OVERALL",
	requiredPercent: 50,
	assignmentType: "HOMEWORK",
	achievedPercentRounding: {
		type: RoundingBehavior.TypeEnum.NONE
	}
};

const overallPercentRuleWithRounding: OverallPercentRuleDto = {
	type: "REQUIRED_PERCENT_OVERALL",
	requiredPercent: 50,
	assignmentType: "HOMEWORK",
	achievedPercentRounding: {
		type: RoundingBehavior.TypeEnum.UP_NEAREST_INTEGER
	}
};

const overallPercentRuleWithDecimals: OverallPercentRuleDto = {
	type: "REQUIRED_PERCENT_OVERALL",
	requiredPercent: 50,
	assignmentType: "TESTAT",
	achievedPercentRounding: {
		type: RoundingBehavior.TypeEnum.DECIMALS,
		decimals: 1
	}
};

const individualPercentWithAllowedFailures: IndividualPercentWithAllowedFailuresRuleDto = {
	type: "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES",
	requiredPercent: 50,
	allowedFailures: 2,
	assignmentType: "HOMEWORK",
	achievedPercentRounding: {
		type: RoundingBehavior.TypeEnum.NONE
	}
};

export const OverallPercentRule = Template.bind({});
OverallPercentRule.args = {
	rule: overallPercentRule,
	index: 1
};

export const OverallPercentWithRounding = Template.bind({});
OverallPercentWithRounding.args = {
	rule: overallPercentRuleWithRounding,
	index: 1
};

export const OverallPercentRuleWithDecimals = Template.bind({});
OverallPercentRuleWithDecimals.args = {
	rule: overallPercentRuleWithDecimals,
	index: 1
};

export const IndividualPercentWithAllowedFailures = Template.bind({});
IndividualPercentWithAllowedFailures.args = {
	rule: individualPercentWithAllowedFailures,
	index: 1
};
