import { CommonModule } from "@angular/common";
import { Component, Input, NgModule } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { SemesterPipeModule } from "@student-mgmt-client/pipes";
import {
	AddableListHeaderComponentModule,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { getSemesterList } from "@student-mgmt-client/util-helper";

@Component({
	selector: "student-mgmt-course-form",
	templateUrl: "./course-form.component.html",
	styleUrls: ["./course-form.component.scss"]
})
export class CourseFormComponent {
	@Input() form: UntypedFormGroup;
	@Input() isEditMode = false;

	semesters = getSemesterList();

	constructor(private fb: UntypedFormBuilder) {}

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

	getLinks(): UntypedFormArray {
		return this.form.get("links") as UntypedFormArray;
	}
}

@NgModule({
	declarations: [CourseFormComponent],
	exports: [CourseFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule,
		IconComponentModule,
		SemesterPipeModule,
		AddableListHeaderComponentModule
	]
})
export class CourseFormComponentModule {}
