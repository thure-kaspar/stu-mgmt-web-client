import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import {
	AssignmentFormComponent,
	AssignmentFormComponentModule
} from "../../forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

export class EditAssignmentDialogData {
	courseId: string;
	assignmentId: string;
}

@Component({
	selector: "student-mgmt-edit-assignment",
	templateUrl: "./edit-assignment.dialog.html",
	styleUrls: ["./edit-assignment.dialog.scss"]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class EditAssignmentDialog implements OnInit {
	@ViewChild(AssignmentFormComponent, { static: true }) form: AssignmentFormComponent;
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
				this.form.form.patchValue(result);
				if (result.links?.length > 0) {
					result.links.forEach(link => {
						this.form.addLink(link);
					});
				}
				if (result.configs?.length > 0) {
					result.configs.forEach(config => {
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
		const assignment = this.form.form.value;
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

@NgModule({
	declarations: [EditAssignmentDialog],
	exports: [EditAssignmentDialog],
	imports: [
		CommonModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		TranslateModule,
		AssignmentFormComponentModule
	]
})
export class EditAssignmentDialogModule {}
