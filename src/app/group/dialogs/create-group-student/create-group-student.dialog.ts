import { Component, OnInit, ChangeDetectionStrategy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService, CourseConfigService, GroupSettingsDto, GroupDto } from "../../../../../api";
import { AuthService } from "../../../auth/services/auth.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

/**
 * Dialog that allows students to create groups.
 * @param courseId
 * @returns `GroupDto`
 */
@Component({
	selector: "app-create-group-student",
	templateUrl: "./create-group-student.dialog.html",
	styleUrls: ["./create-group-student.dialog.scss"],
})
export class CreateGroupStudentDialog extends UnsubscribeOnDestroy implements OnInit {

	name: string;
	password: string;
	
	groupSettings: GroupSettingsDto;
	userId: string;

	constructor(private dialogRef: MatDialogRef<CreateGroupStudentDialog>,
				@Inject(MAT_DIALOG_DATA) public courseId: string,
				private courseConfig: CourseConfigService,
				private groupService: GroupsService,
				private authService: AuthService,
				private snackbar: SnackbarService) { super(); }

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
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

	private loadUserId(): void {
		this.subs.sink = this.authService.user$.subscribe(
			user => this.userId = user.id
		);
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
			name: this.name
		};

		this.subs.sink = this.groupService.createGroup(group, this.courseId).subscribe(
			created => {
				this.snackbar.openSuccessMessage();
				this.dialogRef.close(created);
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

}
