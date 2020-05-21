import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { AssignmentForm } from "../../forms/assignment-form/assignment-form.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentsService } from "../../../../../api";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

export class EditAssignmentDialogData {
	courseId: string;
	assignmentId: string;
}

@Component({
	selector: "app-edit-assignment",
	templateUrl: "./edit-assignment.dialog.html",
	styleUrls: ["./edit-assignment.dialog.scss"]
})
export class EditAssignmentDialog implements OnInit {

	@ViewChild(AssignmentForm, { static: true }) form: AssignmentForm;
	private assignmentId: string;
	private courseId: string;

	constructor(public dialogRef: MatDialogRef<EditAssignmentDialog>,
		@Inject(MAT_DIALOG_DATA) { courseId, assignmentId }: EditAssignmentDialogData,
		private assignmentManagement: AssignmentManagementFacade,
		private snackbar: MatSnackBar) {

		this.courseId = courseId;
		this.assignmentId = assignmentId;
	}

	ngOnInit(): void {
		this.assignmentManagement.get(this.assignmentId, this.courseId).subscribe(
			result => this.form.patchModel(result),
			error => console.log(error)
		);
	}

	onCancel(): void {
		return this.dialogRef.close();
	}

	onSave(): void {
		const assignment = this.form.getModel();
		assignment.courseId = this.courseId;
		assignment.id = this.assignmentId;

		this.assignmentManagement.update(assignment, this.assignmentId, this.courseId).subscribe(
			result => {
				this.dialogRef.close(result);
				this.snackbar.open("Success", "OK", { duration: 3000 });
			},
			error => {
				this.snackbar.open("Failed", "OK", { duration: 3000 });
			}
		);
	}

}
