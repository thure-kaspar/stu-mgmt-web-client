import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Group } from "../../../domain/group.model";
import { Participant } from "../../../domain/participant.model";
import { JoinGroupDialog, JoinGroupDialogData } from "../../dialogs/join-group/join-group.dialog";
import { GroupSettingsDto, GroupDto, ParticipantDto } from "../../../../../api";
import { DialogService } from "../../../shared/services/dialog.service";
import { SearchParticipantDialog } from "../../../shared/components/dialogs/search-participant/search-participant.dialog";

@Component({
	selector: "app-group-card",
	templateUrl: "./group-card.component.html",
	styleUrls: ["./group-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent implements OnInit {

	@Input() courseId: string;
	@Input() group: Group;
	@Input() groupSettings: GroupSettingsDto;
	@Input() participant: Participant;

	/** Emits a group that should be removed. */
	@Output() onRemoveGroup = new EventEmitter<GroupDto>();
	/** Emits a `participant` and the group that the participant should be added to. */
	@Output() onAddParticipant = new EventEmitter<{ group: GroupDto; participant: ParticipantDto }>();

	constructor(private dialog: MatDialog,
				private router: Router,
				private dialogService: DialogService) { }

	ngOnInit(): void {
	}

	/**
	 * Opens the `JoinGroupDialog` and navigates to the group if the user joined
	 * this group.
	 */
	openJoinGroupDialog(): void {
		const data: JoinGroupDialogData = { courseId: this.courseId, groupId: this.group.id };
		this.dialog.open<JoinGroupDialog, JoinGroupDialogData, boolean>(JoinGroupDialog, { data }).afterClosed().subscribe(
			joined => {
				if (joined) {
					this.router.navigate(["/courses", this.courseId, "groups", this.group.id]);
				}
			}
		);
	}

	/**
	 * Opens the `SearchParticipantDialog` and emits the selected Participant (and Group) via `onAddParticipant`.
	 */
	addParticipant(): void {
		this.dialog.open<SearchParticipantDialog, string, ParticipantDto[]>(SearchParticipantDialog, { data: this.courseId })
			.afterClosed().subscribe(
				participants => {
					// Emit the selected participant, if one was selected
					if (participants?.length > 0) {
						this.onAddParticipant.emit({
							group: this.group,
							participant: participants[0]
						});	
					}
				}
			);
	}

	/**
	 * Emits that this group should be removed, if the user confirms it.
	 */
	removeGroup(): void {
		this.dialogService.openConfirmDialog({ 
			title: "Action.Custom.RemoveGroup",
			params: [this.group.name]
		}).subscribe(
			confirmed => {
				if (confirmed) {
					this.onRemoveGroup.emit(this.group);
				}
			}
		);
	}

}
