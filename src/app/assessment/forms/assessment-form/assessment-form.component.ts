import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
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
			achievedPoints: [null, Validators.required],
			userId: [null],
			groupId: [null],
			comment: [null],
			partialAssessments: this.fb.array([])
		});
	}

	ngOnInit(): void {
		this.addPartialAssessment();
	}

	/** Adds a partial assessment to the form. */
	addPartialAssessment(): void {
		this.getPartialAssessments().push(
			this.fb.group({
				title: [null, Validators.required],
				points: [null],
				comment: [null],
				severity: [null],
				type: [null]
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
