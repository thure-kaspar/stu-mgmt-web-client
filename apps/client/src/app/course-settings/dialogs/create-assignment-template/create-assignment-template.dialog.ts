import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { AssignmentTemplateDto, CourseConfigApi } from "@student-mgmt/api-client";
import {
	AssignmentTemplatesFormComponent,
	AssignmentTemplatesFormComponentModule
} from "../../forms/assignment-templates-form/assignment-templates-form.component";

export class CreateAssignmentTemplateDialogData {
	courseId: string;
	configId: number;
}

/**
 * Dialog that allows the user to create an assignment template. Returns the created assignment template.
 * Expects the courseId and configId as inputs.
 */
@Component({
	selector: "student-mgmt-create-assignment-template",
	templateUrl: "./create-assignment-template.dialog.html",
	styleUrls: ["./create-assignment-template.dialog.scss"]
})
export class CreateAssignmentTemplateDialog implements OnInit {
	form: FormGroup;
	@ViewChild(AssignmentTemplatesFormComponent, { static: true })
	assignmentTemplatesForm: AssignmentTemplatesFormComponent;

	constructor(
		private dialogRef: MatDialogRef<CreateAssignmentTemplateDialog>,
		@Inject(MAT_DIALOG_DATA) private data: CreateAssignmentTemplateDialogData,
		private courseConfigApi: CourseConfigApi,
		private fb: FormBuilder,
		private toast: ToastService
	) {
		this.form = this.fb.group({
			config: this.fb.group({
				assignmentTemplates: this.fb.array([]) // TODO: Currently form needs to be nested
			})
		});
	}

	ngOnInit(): void {
		this.assignmentTemplatesForm.form = this.form;
		this.assignmentTemplatesForm.addAssignmentTemplate();
	}

	/** Closes the dialog without returning anything to the dialog opener. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Creates the assignment template and returns the created assignment template.
	 */
	onSave(): void {
		if (this.form.valid && this.assignmentTemplatesForm.getAssignmentTemplates().length == 1) {
			const template = this.assignmentTemplatesForm.getAssignmentTemplates()
				.value[0] as AssignmentTemplateDto;
			this.courseConfigApi
				.createAssignmentTemplate(template, this.data.courseId, this.data.configId)
				.subscribe(
					result => {
						this.toast.success("Domain.AssignmentTemplate", "Message.Created");
						this.dialogRef.close(result);
					},
					error => {
						this.toast.apiError(error);
					}
				);
		}
	}
}

@NgModule({
	declarations: [CreateAssignmentTemplateDialog],
	exports: [CreateAssignmentTemplateDialog],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		TranslateModule,
		AssignmentTemplatesFormComponentModule
	]
})
export class CreateAssignmentTemplateDialogModule {}
