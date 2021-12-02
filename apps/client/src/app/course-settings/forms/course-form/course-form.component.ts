import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { getSemesterList } from "@student-mgmt-client/util-helper";

@Component({
	selector: "app-course-form",
	templateUrl: "./course-form.component.html",
	styleUrls: ["./course-form.component.scss"]
})
export class CourseForm implements OnInit {
	@Input() form: FormGroup;
	@Input() isEditMode = false;

	semesters = getSemesterList();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {}

	addLink(link?: { name: string; url: string }): void {
		this.getLinks().push(
			this.fb.group({
				name: [link?.name ?? null, Validators.required],
				url: [link?.url ?? null, Validators.required]
			})
		);
	}

	removeLink(index: number): void {
		this.getLinks().removeAt(index);
	}

	getLinks(): FormArray {
		return this.form.get("links") as FormArray;
	}
}
