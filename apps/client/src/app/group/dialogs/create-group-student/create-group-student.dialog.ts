import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CourseConfigApi, GroupDto, GroupSettingsDto, GroupApi } from "@student-mgmt/api-client";
import { AuthService } from "@student-mgmt-client/auth";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { ToastService } from "@student-mgmt-client/services";

/**
 * Dialog that allows students to create groups.
 * @param courseId
 * @returns `GroupDto`
 */
@Component({
	selector: "app-create-group-student",
	templateUrl: "./create-group-student.dialog.html",
	styleUrls: ["./create-group-student.dialog.scss"]
})
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
