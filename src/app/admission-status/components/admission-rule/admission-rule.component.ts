import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { AdmissionRuleDto, PassedXPercentWithAtLeastYPercentRuleDto, OverallPercentRuleDto } from "../../../../../api";

@Component({
	selector: "app-admission-rule",
	templateUrl: "./admission-rule.component.html",
	styleUrls: ["./admission-rule.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionRuleComponent implements OnInit {

	@Input() rule: AdmissionRuleDto;
	@Input() index: number;
	
	ruleTypes = AdmissionRuleDto.TypeEnum;

	constructor() { }

	ngOnInit(): void {
	}

	getRuleAsXPercentOfY(rule: AdmissionRuleDto): PassedXPercentWithAtLeastYPercentRuleDto {
		return rule as PassedXPercentWithAtLeastYPercentRuleDto;
	}

	getRuleAs(rule: AdmissionRuleDto): OverallPercentRuleDto {
		return rule as OverallPercentRuleDto;
	}

}
