import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmissionRuleDto, OverallPercentRuleDto, RoundingBehavior, IndividualPercentWithAllowedFailuresRuleDto } from "../../../../../api";
import { min } from "rxjs/operators";

@Component({
	selector: "app-admission-criteria-form",
	templateUrl: "./admission-criteria-form.component.html",
	styleUrls: ["./admission-criteria-form.component.scss"]
})
export class AdmissionCriteriaForm implements OnInit {

	@Input() form: FormGroup;

	ruleTypeEnum = AdmissionRuleDto.TypeEnum;
	typeEnum = AdmissionRuleDto.AssignmentTypeEnum;
	roundingTypeEnum = RoundingBehavior.TypeEnum;

	private baseRuleFormGroup = (rule: AdmissionRuleDto) => ({
		assignmentType: [rule?.assignmentType ?? this.typeEnum.HOMEWORK, Validators.required],
		requiredPercent: [rule?.requiredPercent ?? 50, [Validators.required, Validators.min(0), Validators.max(100)]],
		achievedPercentRounding: this.fb.group({
			type: [rule?.achievedPercentRounding.type ?? this.roundingTypeEnum.NONE, Validators.required],
			decimals: [rule?.achievedPercentRounding?.decimals]
		}, Validators.required)
	});

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
	}

	addRule(rule: AdmissionRuleDto): void {
		if (rule?.type === this.ruleTypeEnum.REQUIREDPERCENTOVERALL) {
			this._addRequiredPercentOverallRule(rule);
		} else if (rule?.type === this.ruleTypeEnum.INDIVIDUALPERCENTWITHALLOWEDFAILURES) {
			this._addPassedXPercentWithAtLeastYPercentRule(rule as IndividualPercentWithAllowedFailuresRuleDto);
		} else {
			console.error("Unknown admission rule type", rule);
		}
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addRequiredPercentOverallRule(rule?: OverallPercentRuleDto): void {
		this.getRules()?.push(this.fb.group({
			...this.baseRuleFormGroup(rule),
			type: [this.ruleTypeEnum.REQUIREDPERCENTOVERALL, Validators.required]
		}));
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addPassedXPercentWithAtLeastYPercentRule(rule?: IndividualPercentWithAllowedFailuresRuleDto): void {
		this.getRules()?.push(this.fb.group({
			...this.baseRuleFormGroup(rule),
			type: [this.ruleTypeEnum.INDIVIDUALPERCENTWITHALLOWEDFAILURES, Validators.required],
			allowedFailures: [rule?.allowedFailures ?? 0, [Validators.required, Validators.min(0)]]
		}));
	}

	/** Removes the criteria at the given position. */
	removeCriteria(index: number): void {
		this.getRules().removeAt(index);
	}

	/** Helper methods to retrieve the assignmentCriteria-formArray of the form. */
	getRules(): FormArray {
		return this.form.get("config.admissionCriteria.rules") as FormArray;
	}

	_getRuleAsIndividualPercent(rule: AdmissionRuleDto): IndividualPercentWithAllowedFailuresRuleDto {
		return rule as IndividualPercentWithAllowedFailuresRuleDto;
	}

	_getRuleAsOverallPercent(rule: AdmissionRuleDto): OverallPercentRuleDto {
		return rule as OverallPercentRuleDto;
	}

}
