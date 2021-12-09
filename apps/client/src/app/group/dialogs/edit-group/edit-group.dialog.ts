import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupDto, GroupSettingsDto, GroupApi, GroupUpdateDto } from "@student-mgmt/api-client";
import { Course } from "@student-mgmt-client/domain-types";
import { Group } from "@student-mgmt-client/domain-types";
import { Participant } from "@student-mgmt-client/domain-types";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { CourseFacade } from "../../../shared/services/course.facade";
import { ParticipantFacade } from "../../../shared/services/participant.facade";
import { ToastService } from "../../../shared/services/toast.service";

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
