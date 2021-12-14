import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { getSemesterList, SemesterPipeModule } from "@student-mgmt-client/util-helper";

@Component({
	selector: "student-mgmt-course-form",
	templateUrl: "./course-form.component.html",
	styleUrls: ["./course-form.component.scss"]
})
export class CourseFormComponent implements OnInit {
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

@NgModule({
	declarations: [CourseFormComponent],
	exports: [CourseFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule,
		IconComponentModule,
		SemesterPipeModule
	]
})
export class CourseFormComponentModule {}
