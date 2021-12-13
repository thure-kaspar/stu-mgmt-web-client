import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentTypeChipComponentModule } from "@student-mgmt-client/shared-ui";
import {
	AdmissionRuleDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto,
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

@NgModule({
	declarations: [AdmissionRuleComponent],
	exports: [AdmissionRuleComponent],
	imports: [CommonModule, MatCardModule, TranslateModule, AssignmentTypeChipComponentModule]
})
export class AdmissionRuleComponentModule {}
