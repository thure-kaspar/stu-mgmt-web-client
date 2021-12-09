import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserDto, UserApi, UserUpdateDto } from "@student-mgmt/api-client";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { ToastService } from "../../../shared/services/toast.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Dialog that allows editing a user.
 */
@Component({
	selector: "app-change-role",
	templateUrl: "./update-user.dialog.html",
	styleUrls: ["./update-user.dialog.scss"]
})
export class UpdateUserDialog extends UnsubscribeOnDestroy implements OnInit {
	form: FormGroup;
	roles = UserDto.RoleEnum;

	constructor(
		public dialogRef: MatDialogRef<UpdateUserDialog, UserDto>,
		@Inject(MAT_DIALOG_DATA) public user: UserDto,
		private fb: FormBuilder,
		private userApi: UserApi,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: [this.user.email],
			displayName: [this.user.displayName, Validators.required],
			role: [this.user.role, Validators.required]
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.form.valid) {
			const update: UserUpdateDto = this.form.value;

			this.subs.sink = this.userApi.updateUser(update, this.user.id).subscribe({
				next: user => {
					this.toast.success(this.user.username, "Message.Saved");
					this.dialogRef.close(user);
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
		}
	}
}
