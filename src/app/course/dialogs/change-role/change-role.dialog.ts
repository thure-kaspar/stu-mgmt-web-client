import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CourseParticipantsService, UserDto } from "../../../../../api";
import { SnackbarService } from "../../../shared/services/snackbar.service";

export class ChangeRoleDialogData {
	courseId: string;
	user: UserDto
}

/**
 * A dialog can change the user's role in a course. The course and user are specified 
 * in the input data of this dialog. Performs the role change and returns the selected
 * courseRole, which enables the calling component to update the user object without having
 * to refetch its data.
 */
@Component({
	selector: "app-change-role",
	templateUrl: "./change-role.dialog.html",
	styleUrls: ["./change-role.dialog.scss"]
})
export class ChangeRoleDialog implements OnInit {
	roles = UserDto.CourseRoleEnum;
	selectedRole: UserDto.CourseRoleEnum;

	constructor(public dialogRef: MatDialogRef<ChangeRoleDialog, UserDto.CourseRoleEnum>,
				@Inject(MAT_DIALOG_DATA) public data: ChangeRoleDialogData,
				private courseParticipantsService: CourseParticipantsService,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.selectedRole = this.data.user.courseRole; 
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		// No action necessary, if role hasn't been changed 
		if (this.data.user.courseRole === this.selectedRole) {
			this.dialogRef.close(this.selectedRole);
			return;
		}
		
		// Update the role (if it has changed)
		this.courseParticipantsService.updateUserRole({ role: this.selectedRole }, this.data.courseId, this.data.user.id)
			.subscribe(
				result => {
					if (result) {
						this.snackbar.openSuccessMessage("User's role has been updated!");
						this.dialogRef.close(this.selectedRole);
					} else {
						throw new Error("Update failed");
					}
				},
				error => {
					console.log(error);
					this.snackbar.openErrorMessage("Failed to update the user's role.");
				}
			);
	}

}
