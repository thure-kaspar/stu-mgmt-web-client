import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SnackbarService } from "@student-mgmt-client/services";
import { AssignmentForm } from "../../forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { ToastService } from "@student-mgmt-client/services";

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

	constructor(
		public dialogRef: MatDialogRef<EditAssignmentDialog>,
		@Inject(MAT_DIALOG_DATA) { courseId, assignmentId }: EditAssignmentDialogData,
		private assignmentManagement: AssignmentManagementFacade,
		private toast: ToastService
	) {
		this.courseId = courseId;
		this.assignmentId = assignmentId;
	}

	ngOnInit(): void {
		this.assignmentManagement.get(this.assignmentId, this.courseId).subscribe(
			result => {
				this.form.patchModel(result);
				if (result.links?.length > 0) {
					result.links.forEach(link => {
						this.form.addLink(link);
					});
				}
				if ((result as any).configs?.length > 0) {
					(result as any).configs.forEach(config => {
						this.form.addConfig(config);
					});
				}
			},
			error => console.log(error)
		);
	}

	onCancel(): void {
		return this.dialogRef.close();
	}

	onSave(): void {
		const assignment = this.form.getModel();
		assignment.id = this.assignmentId;

		this.assignmentManagement.update(assignment, this.assignmentId, this.courseId).subscribe(
			result => {
				this.dialogRef.close(result);
				this.toast.success(assignment.name, "Message.Saved");
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}
}
