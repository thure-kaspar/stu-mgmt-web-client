import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmissionRuleDto, OverallPercentRuleDto, PassedXPercentWithAtLeastYPercentRuleDto, RoundingBehavior } from "../../../../../api";

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

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
	}

	addRule(rule: AdmissionRuleDto): void {
		if (rule?.type === this.ruleTypeEnum.REQUIREDPERCENTOVERALL) {
			this._addRequiredPercentOverallRule(rule);
		} else if (rule?.type === this.ruleTypeEnum.PASSEDXPERCENTWITHATLEASTYPERCENT) {
			this._addPassedXPercentWithAtLeastYPercentRule(rule as PassedXPercentWithAtLeastYPercentRuleDto);
		}
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addRequiredPercentOverallRule(rule?: OverallPercentRuleDto): void {
		this.getRules()?.push(this.fb.group({
			type: [this.ruleTypeEnum.REQUIREDPERCENTOVERALL, Validators.required],
			assignmentType: [rule?.assignmentType ?? this.typeEnum.HOMEWORK, Validators.required],
			requiredPercent: [rule?.requiredPercent ?? 50, [Validators.required, Validators.min(0), Validators.max(100)]],
			achievedPercentRounding: this.fb.group({
				type: [rule?.achievedPercentRounding.type ?? this.roundingTypeEnum.NONE, Validators.required],
				decimals: [rule?.achievedPercentRounding?.decimals]
			}, Validators.required)
		}));
	}

	/** Adds additional input fields to a admission criteria rule?. */
	_addPassedXPercentWithAtLeastYPercentRule(rule?: PassedXPercentWithAtLeastYPercentRuleDto): void {
		this.getRules()?.push(this.fb.group({
			type: [this.ruleTypeEnum.PASSEDXPERCENTWITHATLEASTYPERCENT, Validators.required],
			assignmentType: [rule?.assignmentType ?? this.typeEnum.HOMEWORK, Validators.required],
			requiredPercent: [rule?.requiredPercent ?? 50, [Validators.required, Validators.min(0), Validators.max(100)]],
			achievedPercentRounding: this.fb.group({
				type: [rule?.achievedPercentRounding.type ?? this.roundingTypeEnum.NONE, Validators.required],
				decimals: [rule?.achievedPercentRounding?.decimals]
			}, Validators.required),
			passedAssignmentsPercent: [rule?.passedAssignmentsPercent ?? 50, [Validators.required, Validators.min(0), Validators.max(100)]],
			passedAssignmentsRounding: this.fb.group({
				type: [rule?.passedAssignmentsRounding.type ?? this.roundingTypeEnum.NONE, Validators.required],
				decimals: [rule?.passedAssignmentsRounding?.decimals]
			}, Validators.required),
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

	_getRuleAsXPercentOfY(rule: AdmissionRuleDto): PassedXPercentWithAtLeastYPercentRuleDto {
		return rule as PassedXPercentWithAtLeastYPercentRuleDto;
	}

	_getRuleAs(rule: AdmissionRuleDto): OverallPercentRuleDto {
		return rule as OverallPercentRuleDto;
	}

}
