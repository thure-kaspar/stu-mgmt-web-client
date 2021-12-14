import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import {
	AdmissionRuleDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto,
	RoundingBehavior
} from "@student-mgmt/api-client";

@Component({
	selector: "app-admission-criteria-form",
	templateUrl: "./admission-criteria-form.component.html",
	styleUrls: ["./admission-criteria-form.component.scss"]
})
export class AdmissionCriteriaFormComponent implements OnInit {
	@Input() form: FormGroup;

	ruleTypeEnum = AdmissionRuleDto.TypeEnum;
	typeEnum = AdmissionRuleDto.AssignmentTypeEnum;
	roundingTypeEnum = RoundingBehavior.TypeEnum;

	private baseRuleFormGroup = (rule: AdmissionRuleDto) => ({
		assignmentType: [rule?.assignmentType ?? this.typeEnum.HOMEWORK, Validators.required],
		requiredPercent: [
			rule?.requiredPercent ?? 50,
			[Validators.required, Validators.min(0), Validators.max(100)]
		],
		achievedPercentRounding: this.fb.group(
			{
				type: [
					rule?.achievedPercentRounding.type ?? this.roundingTypeEnum.NONE,
					Validators.required
				],
				decimals: [rule?.achievedPercentRounding?.decimals]
			},
			Validators.required
		)
	});

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {}

	addRule(rule: AdmissionRuleDto): void {
		if (rule?.type === this.ruleTypeEnum.REQUIRED_PERCENT_OVERALL) {
			this._addRequiredPercentOverallRule(rule);
		} else if (rule?.type === this.ruleTypeEnum.INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES) {
			this._addPassedXPercentWithAtLeastYPercentRule(
				rule as IndividualPercentWithAllowedFailuresRuleDto
			);
		} else {
			console.error("Unknown admission rule type", rule);
		}
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addRequiredPercentOverallRule(rule?: OverallPercentRuleDto): void {
		this.getRules()?.push(
			this.fb.group({
				...this.baseRuleFormGroup(rule),
				type: [this.ruleTypeEnum.REQUIRED_PERCENT_OVERALL, Validators.required]
			})
		);
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addPassedXPercentWithAtLeastYPercentRule(
		rule?: IndividualPercentWithAllowedFailuresRuleDto
	): void {
		this.getRules()?.push(
			this.fb.group({
				...this.baseRuleFormGroup(rule),
				type: [
					this.ruleTypeEnum.INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES,
					Validators.required
				],
				allowedFailures: [
					rule?.allowedFailures ?? 0,
					[Validators.required, Validators.min(0)]
				]
			})
		);
	}

	/** Removes the criteria at the given position. */
	removeCriteria(index: number): void {
		this.getRules().removeAt(index);
	}

	/** Helper methods to retrieve the assignmentCriteria-formArray of the form. */
	getRules(): FormArray {
		return this.form.get("config.admissionCriteria.rules") as FormArray;
	}

	_getRuleAsIndividualPercent(
		rule: AdmissionRuleDto
	): IndividualPercentWithAllowedFailuresRuleDto {
		return rule as IndividualPercentWithAllowedFailuresRuleDto;
	}

	_getRuleAsOverallPercent(rule: AdmissionRuleDto): OverallPercentRuleDto {
		return rule as OverallPercentRuleDto;
	}
}

@NgModule({
	declarations: [AdmissionCriteriaFormComponent],
	exports: [AdmissionCriteriaFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatTooltipModule,
		TranslateModule,
		IconComponentModule
	]
})
export class AdmissionCriteriaFormComponentModule {}
