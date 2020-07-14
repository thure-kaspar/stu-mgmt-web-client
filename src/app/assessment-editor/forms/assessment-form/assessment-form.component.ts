import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup, ValidatorFn, AbstractControl } from "@angular/forms";
import { AbstractForm } from "../../../shared/abstract-form";
import { AssessmentCreateDto, PartialAssessmentDto, AssignmentDto } from "../../../../../api";

@Component({
	selector: "app-assessment-form",
	templateUrl: "./assessment-form.component.html",
	styleUrls: ["./assessment-form.component.scss"]
})
export class AssessmentForm extends AbstractForm<AssessmentCreateDto> implements OnInit {

	@Input() assignment: AssignmentDto;

	severityEnum = PartialAssessmentDto.SeverityEnum;

	constructor(private fb: FormBuilder) {
		super();
		this.form = this.fb.group({
			achievedPoints: [0, [Validators.required, this.achievedPointsMaxValueValidator()]],
			userId: [null],
			groupId: [null],
			comment: [null],
			partialAssessments: this.fb.array([])
		});
	}

	ngOnInit(): void {
	}

	/** Validates that the achieved points do not exceed the max. possible amount of points. */
	private achievedPointsMaxValueValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: unknown } | null => {
			let isTooBig = false;
			// Only validate, if assignment is loaded and has can awards points
			if (this.assignment?.points) {
				isTooBig = control.value > this.assignment.points + (this.assignment.bonusPoints ?? 0);
			}
			return isTooBig ? { "achievedPointsMaxValue": { value: control.value } } : null;
		};
	}

	/** Returns translation strings of form errors, which can be used in the component. */
	getErrors(): string[] {
		const errors = [];
		if (this.form.hasError("required", ["achievedPoints"])) {
			errors.push("Error.ValueMissing");
		}
		if (this.form.hasError("achievedPointsMaxValue", ["achievedPoints"])) {
			errors.push("Error.Assessment.AchievedPointsMaxValueExceeded");
		}
		return errors;
	}

	/** Adds a partial assessment to the form. */
	addPartialAssessment(partialAssessment?: PartialAssessmentDto): void {
		this.getPartialAssessments().push(
			this.fb.group({
				id: [partialAssessment?.id ?? null],
				title: [partialAssessment?.title ?? null, Validators.required],
				points: [partialAssessment?.points ?? null],
				comment: [partialAssessment?.comment ?? null],
				severity: [partialAssessment?.severity ?? null],
				type: [partialAssessment?.type ?? null]
			})
		);
	}

	/** Removes a partial assessment from the form. */
	removePartialAssessment(index: number): void {
		this.getPartialAssessments().removeAt(index);
	}

	getPartialAssessments(): FormArray {
		return this.form.get("partialAssessments") as FormArray;
	}

	getPartialAssessment(index: number): FormGroup {
		return this.getPartialAssessments().at(index) as FormGroup;
	}

}
