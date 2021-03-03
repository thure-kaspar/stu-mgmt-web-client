import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentTemplateDto, CourseConfigService } from "../../../../../api";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AssignmentTemplatesForm } from "../../forms/assignment-templates-form/assignment-templates-form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { ToastService } from "../../../shared/services/toast.service";

export class EditAssignmentTemplateDialogData {
	template: AssignmentTemplateDto;
	courseId: string;
}

/**
 * Dialog that allows the user to edit an assignment template.
 * If the update was successful, returns the updated template.
 */
@Component({
	selector: "app-edit-assignment-template",
	templateUrl: "./edit-assignment-template.dialog.html",
	styleUrls: ["./edit-assignment-template.dialog.scss"]
})
export class EditAssignmentTemplateDialog implements OnInit {
	form: FormGroup;
	@ViewChild(AssignmentTemplatesForm, { static: true })
	assignmentTemplatesForm: AssignmentTemplatesForm;

	constructor(
		private dialogRef: MatDialogRef<EditAssignmentTemplateDialog>,
		@Inject(MAT_DIALOG_DATA) private data: EditAssignmentTemplateDialogData,
		private courseConfigService: CourseConfigService,
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
		this.assignmentTemplatesForm.addAssignmentTemplate(this.data.template);
	}

	/** Closes the dialog without returning anything to the dialog opener. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Updates the assignment template and returns the updated assignment template.
	 */
	onSave(): void {
		if (this.form.valid && this.assignmentTemplatesForm.getAssignmentTemplates().length == 1) {
			const template = this.assignmentTemplatesForm.getAssignmentTemplates()
				.value[0] as AssignmentTemplateDto;
			this.courseConfigService
				.updateAssignmentTemplate(template, this.data.courseId, this.data.template.id)
				.subscribe(
					result => {
						this.toast.success("Domain.AssignmentTemplate", "Message.Saved");
						this.dialogRef.close(result);
					},
					error => {
						this.toast.apiError(error);
					}
				);
		}
	}
}
