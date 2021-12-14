import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { Course, Group, Participant } from "@student-mgmt-client/domain-types";
import { CourseFacade, ParticipantFacade, ToastService } from "@student-mgmt-client/services";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { GroupApi, GroupDto, GroupSettingsDto, GroupUpdateDto } from "@student-mgmt/api-client";

/**
 * Dialogs that allows users to edit a group.
 * @param groupId
 * @returns `GroupDto`
 */
@Component({
	selector: "app-edit-group",
	templateUrl: "./edit-group.dialog.html",
	styleUrls: ["./edit-group.dialog.scss"]
})
export class EditGroupDialog extends UnsubscribeOnDestroy implements OnInit {
	update: GroupUpdateDto;

	group: Group;
	course: Course;
	groupSettings: GroupSettingsDto;
	participant: Participant;

	constructor(
		private dialogRef: MatDialogRef<EditGroupDialog, GroupDto>,
		@Inject(MAT_DIALOG_DATA) private groupId: string,
		private groupApi: GroupApi,
		private courseFacade: CourseFacade,
		private participantFacade: ParticipantFacade,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.courseFacade.course$.subscribe(c => {
			this.course = c;
			this.groupSettings = c.groupSettings;
		});
		this.subs.sink = this.participantFacade.participant$.subscribe(p => (this.participant = p));

		this.loadGroup();
	}

	private loadGroup(): void {
		this.groupApi.getGroup(this.course.id, this.groupId).subscribe(group => {
			this.group = new Group(group);
			this.update = {
				name: group.name,
				password: group.password,
				isClosed: group.isClosed
			};
		});
	}

	/**
	 * Closes the dialog and returns `undefined`;
	 */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Calls the API to update the group.
	 * If successful, closes the dialog and returns the updated group.
	 */
	onSave(): void {
		this.groupApi.updateGroup(this.update, this.course.id, this.groupId).subscribe({
			next: group => {
				this.toast.success("Message.Saved");
				this.dialogRef.close(group);
			},
			error: error => this.toast.apiError(error)
		});
	}

	isRenamingLocked(): boolean {
		return !this.group.canBeRenamed(this.participant, this.course);
	}

	isClosingLocked(): boolean {
		return !this.group.canBeClosed(this.participant, this.course);
	}
}

@NgModule({
	declarations: [EditGroupDialog],
	exports: [EditGroupDialog],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule
	]
})
export class EditGroupDialogModule {}
