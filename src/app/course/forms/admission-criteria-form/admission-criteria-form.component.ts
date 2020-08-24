import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AssignmentDto } from "../../../../../api";

@Component({
	selector: "app-admission-criteria-form",
	templateUrl: "./admission-criteria-form.component.html",
	styleUrls: ["./admission-criteria-form.component.scss"]
})
export class AdmissionCriteriaForm implements OnInit {

	@Input() form: FormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
	}

	/** Adds additional input fields to a admission criteria rule. */
	addCriteria(criteria?: any): void {
		// this.getCriteria().push(this.fb.group({
		// 	scope: [criteria?.scope || null, Validators.required],
		// 	type: [criteria?.type || null, Validators.required],
		// 	requiredPercent: [criteria?.requiredPercent || 50, [Validators.required, Validators.min(0), Validators.max(100)]]
		// }));

		//console.log(this.form.get("admissionCriteria"));
	}

	/** Removes the criteria at the given position. */
	removeCriteria(index: number): void {
		this.getCriteria().removeAt(index);
	}

	/** Helper methods to retrieve the assignmentCriteria-formArray of the form. */
	getCriteria(): FormArray {
		return this.form.get("config.admissionCriteria.criteria") as FormArray;
	}

}
