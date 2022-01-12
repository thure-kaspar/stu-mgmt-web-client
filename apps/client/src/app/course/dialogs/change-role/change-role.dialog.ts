import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { CourseParticipantsApi, ParticipantDto } from "@student-mgmt/api-client";

export type ChangeRoleDialogData = {
	courseId: string;
	participant: ParticipantDto;
};

/**
 * A dialog can change the user's role in a course. The course and user are specified
 * in the input data of this dialog. Performs the role change and returns the selected
 * courseRole, which enables the calling component to update the user object without having
 * to refetch its data.
 */
@Component({
	selector: "student-mgmt-change-role",
	templateUrl: "./change-role.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ChangeRoleDialog implements OnInit {
	roles = ParticipantDto.RoleEnum;
	selectedRole: ParticipantDto.RoleEnum;

	constructor(
		public dialogRef: MatDialogRef<ChangeRoleDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ChangeRoleDialogData,
		private courseParticipantsApi: CourseParticipantsApi,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		this.selectedRole = this.data.participant.role;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		// No action necessary, if role hasn't been changed
		if (this.data.participant.role === this.selectedRole) {
			this.dialogRef.close(true);
			return;
		}

		// Update the role (if it has changed)
		this.courseParticipantsApi
			.updateUserRole(
				{ role: this.selectedRole },
				this.data.courseId,
				this.data.participant.userId
			)
			.subscribe({
				next: () => {
					this.toast.success();
					this.dialogRef.close(true);
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}
}

@NgModule({
	declarations: [ChangeRoleDialog],
	exports: [ChangeRoleDialog],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatRadioModule,
		TranslateModule
	]
})
export class ChangeRoleDialogModule {}
