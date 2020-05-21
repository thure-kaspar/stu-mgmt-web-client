import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentsService, CourseConfigService, AssignmentTemplateDto } from "../../../../../api";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AssignmentForm } from "../../forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

/**
 * Dialog that allows the creation of new assignments. Expects the courseId. Returns the created assignment.
 */
@Component({
	selector: "app-create-assignment",
	templateUrl: "./create-assignment.dialog.html",
	styleUrls: ["./create-assignment.dialog.scss"]
})
export class CreateAssignmentDialog implements OnInit {

	@ViewChild(AssignmentForm, { static: true }) form: AssignmentForm;
	/** Assignment templates of the course. */
	templates: AssignmentTemplateDto[];
	/** The selected template. */
	selectedTemplate: AssignmentTemplateDto;

	constructor(public dialogRef: MatDialogRef<CreateAssignmentDialog>,
				@Inject(MAT_DIALOG_DATA) private courseId: string,
				private assignmentManagement: AssignmentManagementFacade,
				private courseConfigService: CourseConfigService,
				private snackbar: MatSnackBar) { }

	ngOnInit(): void {
		// Load assignment templates
		this.courseConfigService.getAssignmentTemplates(this.courseId).subscribe(
			templates => this.templates = templates
		);
	}

	fillInTemplate(template: AssignmentTemplateDto): void {
		this.selectedTemplate = template;
		this.form.patchModel(template);
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		const assignment = this.form.getModel(); 
		this.assignmentManagement.create(assignment, this.courseId).subscribe(
			created => {
				this.dialogRef.close(created);
				this.snackbar.open("Assignment created!", "OK", { duration: 3000 });
			},
			error => {
				// TODO: Display error
			}
		);
	}

}
