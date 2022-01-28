import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "@student-mgmt-client/auth";
import { ToastService } from "@student-mgmt-client/services";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { CourseConfigApi, GroupApi, GroupDto, GroupSettingsDto } from "@student-mgmt/api-client";

/**
 * Dialog that allows students to create groups.
 * @param courseId
 * @returns `GroupDto`
 */
@Component({
	selector: "student-mgmt-create-group-student",
	templateUrl: "./create-group-student.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CreateGroupStudentDialog extends UnsubscribeOnDestroy implements OnInit {
	name: string;
	password: string;

	groupSettings: GroupSettingsDto;
	userId: string;

	constructor(
		private dialogRef: MatDialogRef<CreateGroupStudentDialog>,
		@Inject(MAT_DIALOG_DATA) public courseId: string,
		private courseConfig: CourseConfigApi,
		private groupApi: GroupApi,
		private authService: AuthService,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		if (!this.courseId) {
			throw new Error("Required parameter 'courseId' is missing");
		}

		this.loadGroupSettings();
		this.loadUserId();
	}

	private loadGroupSettings(): void {
		this.subs.sink = this.courseConfig.getGroupSettings(this.courseId).subscribe(
			result => {
				this.groupSettings = result;

				if (this.groupSettings.nameSchema) {
					// Name field will be disabled and full name (unique symbol/number) will be determined server-side
					this.name = this.groupSettings.nameSchema;
				}
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}

	private loadUserId(): void {
		this.subs.sink = this.authService.user$.subscribe(user => (this.userId = user.id));
	}

	/** Closes the dialog without any return value. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Closes the dialog, if group creation was successful.
	 * Returns the created group. The user is automatically added to the group.
	 */
	onSave(): void {
		const group: GroupDto = {
			id: null,
			name: this.name,
			password: this.password?.length > 0 ? this.password : undefined
		};

		this.subs.sink = this.groupApi.createGroup(group, this.courseId).subscribe(
			created => {
				this.toast.success(created.name, "Message.Custom.CreatedGroup");
				this.dialogRef.close(created);
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}
}

@NgModule({
	declarations: [CreateGroupStudentDialog],
	exports: [CreateGroupStudentDialog],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule
	]
})
export class CreateGroupStudentDialogModule {}
