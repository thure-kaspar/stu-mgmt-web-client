import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import {
	AdmissionRuleDto,
	OverallPercentRuleDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	RuleCheckResult
} from "@student-mgmt/api-client";

@Component({
	selector: "app-admission-rule",
	templateUrl: "./admission-rule.component.html",
	styleUrls: ["./admission-rule.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionRuleComponent implements OnInit {
	@Input() rule: AdmissionRuleDto;
	@Input() index: number;
	@Input() result?: RuleCheckResult;

	ruleTypes = AdmissionRuleDto.TypeEnum;

	constructor() {}

	ngOnInit(): void {}

	getRuleAsXPercentOfY(rule: AdmissionRuleDto): IndividualPercentWithAllowedFailuresRuleDto {
		return rule as IndividualPercentWithAllowedFailuresRuleDto;
	}

	getRuleAs(rule: AdmissionRuleDto): OverallPercentRuleDto {
		return rule as OverallPercentRuleDto;
	}
}
