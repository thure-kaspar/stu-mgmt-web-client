import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupDto, GroupsService, CourseDto, GroupSettingsDto, GroupUpdateDto } from "../../../../../api";
import { CourseFacade } from "../../../course/services/course.facade";
import { Participant } from "../../../domain/participant.model";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { Course } from "../../../domain/course.model";
import { Group } from "../../../domain/group.model";

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

	constructor(private dialogRef: MatDialogRef<EditGroupDialog, GroupDto>,
				@Inject(MAT_DIALOG_DATA) private groupId: string,
				private groupService: GroupsService,
				private courseFacade: CourseFacade,
				private participantFacade: ParticipantFacade,
				private snackbar: SnackbarService) { super(); }

	ngOnInit(): void {
		this.subs.sink = this.courseFacade.course$.subscribe(c => this.course = c);
		this.subs.sink = this.courseFacade.groupSettings$.subscribe(settings => this.groupSettings);
		this.subs.sink = this.participantFacade.participant$.subscribe(p => this.participant = p);

		this.loadGroup();
	}

	private loadGroup(): void {
		this.groupService.getGroup(this.course.id, this.groupId).subscribe(
			group => {
				this.group = new Group(group);
				this.update = {
					name: group.name,
					password: group.password,
					isClosed: group.isClosed	
				};
			}
		);
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
		this.groupService.updateGroup(this.update, this.course.id, this.groupId).subscribe({
			next: (group) => {
				this.snackbar.openSuccessMessage();
				this.dialogRef.close(group);
			},
			error: (error) => this.snackbar.openApiExceptionMessage(error)
		});
	}

	isRenamingLocked(): boolean {
		return !this.group.canBeRenamed(this.participant, this.course);
	}

	isClosingLocked(): boolean {
		return !this.group.canBeClosed(this.participant, this.course);
	}

}
