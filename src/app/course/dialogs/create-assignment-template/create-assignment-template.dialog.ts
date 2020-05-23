import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AssignmentTemplatesForm } from "../../forms/assignment-templates-form/assignment-templates-form.component";
import { CourseConfigService, AssignmentTemplateDto } from "../../../../../api";
import { MatSnackBar } from "@angular/material/snack-bar";

export class CreateAssignmentTemplateDialogData {
	courseId: string;
	configId: number;
}

/**
 * Dialog that allows the user to create an assignment template. Returns the created assignment template.
 * Expects the courseId and configId as inputs.
 */
@Component({
	selector: "app-create-assignment-template",
	templateUrl: "./create-assignment-template.dialog.html",
	styleUrls: ["./create-assignment-template.dialog.scss"]
})
export class CreateAssignmentTemplateDialog implements OnInit {

	form: FormGroup;
	@ViewChild(AssignmentTemplatesForm, { static: true }) assignmentTemplatesForm: AssignmentTemplatesForm;

	constructor(private dialogRef: MatDialogRef<CreateAssignmentTemplateDialog>,
				@Inject(MAT_DIALOG_DATA) private data: CreateAssignmentTemplateDialogData,
				private courseConfigService: CourseConfigService,
				private fb: FormBuilder,
				private snackbar: MatSnackBar) { 
	
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
			const template = this.assignmentTemplatesForm.getAssignmentTemplates().value[0] as AssignmentTemplateDto;
			this.courseConfigService.createAssignmentTemplate(template, this.data.courseId, this.data.configId).subscribe(
				result => {
					this.dialogRef.close(result);
				},
				error => {
					console.log(error);
					this.snackbar.open("Failed", "OK", { duration: 3000, panelClass: ["mat-toolbar", "mat-accent"] });
				}
			);
		}
	}

}
