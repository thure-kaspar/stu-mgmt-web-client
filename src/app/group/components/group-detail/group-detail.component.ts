import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentDto, GroupDto, GroupsService, ParticipantDto, GroupSettingsDto, AssessmentsService } from "../../../../../api";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { SearchParticipantDialog } from "../../../shared/components/dialogs/search-participant/search-participant.dialog";
import { DialogService } from "../../../shared/services/dialog.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { CourseFacade } from "../../../course/services/course.facade";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"]
})
export class GroupDetailComponent extends UnsubscribeOnDestroy implements OnInit {

	group: GroupDto;
	participant: Participant;
	groupSettings: GroupSettingsDto;

	courseId: string;
	groupId: string;

	displayedColumns: string[] = ["name", "type", "score", "action"];
	dataSource: MatTableDataSource<AssessmentDto>;
	@ViewChild(MatSort) sort: MatSort;
	
	constructor(private groupService: GroupsService,
				private assessmentService: AssessmentsService,
				private participantFacade: ParticipantFacade,
				private courseFacade: CourseFacade,
				private route: ActivatedRoute,
				private router: Router,
				private dialogService: DialogService,
				private dialog: MatDialog,
				private snackbar: SnackbarService) { super(); }

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.groupId = this.route.snapshot.paramMap.get("groupId");

		this.loadGroup();
		this.loadAssessmentsOfGroup();

		this.subs.sink = this.participantFacade.p$.subscribe(p => this.participant = p);
		this.subs.sink = this.courseFacade.groupSettings$.subscribe(settings => this.groupSettings = settings);
	}

	loadGroup(): void {
		this.groupService.getGroup(this.courseId, this.groupId).subscribe(
			result => { 
				this.group = result;
			},
			error => console.log(error)
		);
	}

	loadAssessmentsOfGroup(): void {
		this.groupService.getAssessmentsOfGroup(this.courseId, this.groupId).subscribe({
			next: (assessments) => {
				this.dataSource = new MatTableDataSource(assessments);
				this.dataSource.sort = this.sort;
			},
			error: (error) => this.snackbar.openApiExceptionMessage(error)
		});
	}

	/**
	 * Opens the `SearchParticipantDialog` and tries to add the selected participant to this group.
	 * If successful, the group is reloaded.
	 */
	onAddParticipant(): void {
		this.dialog.open<SearchParticipantDialog, string, ParticipantDto[]>(SearchParticipantDialog, { data: this.courseId })
			.afterClosed().subscribe(
				participants => {
					if (participants?.length > 0) {
						this.addParticipantToGroup(participants[0]);
					}
				}
			);
	}

	private addParticipantToGroup(participant: ParticipantDto): void {
		this.groupService.addUserToGroup({ password: undefined }, this.courseId, this.groupId, participant.userId)
			.subscribe({
				next: () => {
					this.snackbar.openSuccessMessage();
					this.loadGroup();
				},
				error: (error) => {
					console.log(error);
					this.snackbar.openErrorMessage();
				}
			});
	}

	/** Removes the selected member from the group, if user confirms the action. */
	onRemoveUser(participant: ParticipantDto): void {
		// If participant is removing himself
		if (participant.userId === this.participant.userId) {
			this.onLeaveGroup();
		} else {
			this.dialogService.openConfirmDialog({ 
				title: "Action.Custom.RemoveUserFromGroup",
				params: [participant.username], 
			}).subscribe(
				confirmed => {
					if (confirmed) {
						this.groupService.removeUserFromGroup(this.courseId, this.group.id, participant.userId).subscribe(
							success => {
								this.snackbar.openSuccessMessage();
								this.loadGroup();
							},
							error => {
								this.snackbar.openApiExceptionMessage(error);
							}
						);
					}
				}
			);
		}
	}

	/**
	 * Removes the current user from this group and navigates him away from the component,
	 * if successful. User will be asked to confirm this action.
	 */
	onLeaveGroup(): void {
		this.participantFacade.leaveGroup(this.group);
	}

	/**
	 * Removes the group, if the user confirms the action.
	 */
	onRemoveGroup(): void {
		this.dialogService.openConfirmDialog({
			title: "Action.Custom.RemoveGroup",
			params: [this.group.name]
		}).subscribe(
			confirmed => {
				if (confirmed) {
					this.groupService.deleteGroup(this.courseId, this.groupId).subscribe({
						next: () => {
							if (this.isGroupMember(this.participant)) {
								this.handleRemovalOfOwnGroup();
							}

							this.snackbar.openSuccessMessage();
							this.router.navigate(["/courses", this.courseId, "groups"]);
						},
						error: (error) => {
							console.log(error);
							this.snackbar.openErrorMessage();
						}
					});
				}
			}
		);
	}

	isGroupMember(participant: ParticipantDto): boolean {
		return !!this.group.members.find(m => m.userId === this.participant.userId);
	}

	private handleRemovalOfOwnGroup(): void {
		// Reload the participant to remove his current group
		this.participantFacade.reload();
	}

}
