import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	OnInit,
	Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Course, Group, Participant } from "@student-mgmt-client/domain-types";
import { DialogService, ParticipantFacade } from "@student-mgmt-client/services";
import {
	CardComponentModule,
	ChipComponentModule,
	IconComponentModule,
	SearchParticipantDialog
} from "@student-mgmt-client/shared-ui";
import { GroupDto, ParticipantDto } from "@student-mgmt/api-client";
import { take } from "rxjs/operators";
import { JoinGroupDialog, JoinGroupDialogData } from "../../dialogs/join-group/join-group.dialog";

@Component({
	selector: "student-mgmt-group-card",
	templateUrl: "./group-card.component.html",
	styleUrls: ["./group-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent implements OnInit {
	@Input() group: Group;
	@Input() course: Course;
	@Input() participant: Participant;

	/** Emits a group that should be removed. */
	@Output() onRemoveGroup = new EventEmitter<GroupDto>();
	/** Emits a `participant` and the group that the participant should be added to. */
	@Output() onAddParticipant = new EventEmitter<{
		group: GroupDto;
		participant: ParticipantDto;
	}>();

	cssClass = "text-light";

	constructor(
		private dialog: MatDialog,
		private participantFacade: ParticipantFacade,
		private router: Router,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		if (this.group.hasNotEnoughMembers(this.course)) {
			this.cssClass = "WARNING";
		}
	}

	/**
	 * Opens the `JoinGroupDialog`.
	 * If the students is already in a group, the `ConfirmDialog` will be opened and
	 * if confirmed, student will be removed from current group before the `JoinGroupDialog` is opened.
	 */
	onJoinGroup(): void {
		if (this.participant.groupId) {
			this.participantFacade
				.leaveGroup(this.participant.group, "Text.Group.LeaveToJoinOther")
				.pipe(take(1))
				.subscribe(leftGroup => {
					if (leftGroup) {
						this.openJoinGroupDialog();
					}
				});
		} else {
			this.openJoinGroupDialog();
		}
	}

	/**
	 * Opens the `JoinGroupDialog` and navigates to the group if the user joined
	 * this group.
	 */
	openJoinGroupDialog(): void {
		const data: JoinGroupDialogData = {
			courseId: this.course.id,
			group: this.group,
			participant: this.participant
		};
		this.dialog
			.open<JoinGroupDialog, JoinGroupDialogData, boolean>(JoinGroupDialog, { data })
			.afterClosed()
			.subscribe(joined => {
				if (joined) {
					this.participantFacade.reload();
					this.router.navigate(["/courses", this.course.id, "groups", this.group.id]);
				}
			});
	}

	/**
	 * Opens the `SearchParticipantDialog` and emits the selected Participant (and Group) via `onAddParticipant`.
	 */
	addParticipant(): void {
		this.dialog
			.open<SearchParticipantDialog, string, ParticipantDto[]>(SearchParticipantDialog, {
				data: this.course.id
			})
			.afterClosed()
			.subscribe(participants => {
				// Emit the selected participant, if one was selected
				if (participants?.length > 0) {
					this.onAddParticipant.emit({
						group: this.group,
						participant: participants[0]
					});
				}
			});
	}

	/**
	 * Emits that this group should be removed, if the user confirms it.
	 */
	removeGroup(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.RemoveGroup",
				params: [this.group.name]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.onRemoveGroup.emit(this.group);
				}
			});
	}
}

@NgModule({
	declarations: [GroupCardComponent],
	exports: [GroupCardComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatMenuModule,
		TranslateModule,
		IconComponentModule,
		ChipComponentModule,
		CardComponentModule
	]
})
export class GroupCardComponentModule {}
