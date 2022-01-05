import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { UserApi, UserDto, UserUpdateDto } from "@student-mgmt/api-client";

/**
 * Dialog that allows editing a user.
 */
@Component({
	selector: "student-mgmt-change-role",
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

@NgModule({
	declarations: [UpdateUserDialog],
	exports: [UpdateUserDialog],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		TranslateModule
	]
})
export class UpdateUserDialogModule {}
