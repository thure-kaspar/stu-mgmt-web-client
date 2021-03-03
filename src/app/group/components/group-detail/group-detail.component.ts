import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { filter, take } from "rxjs/operators";
import {
	AssessmentDto,
	AssessmentsService,
	GroupSettingsDto,
	GroupsService,
	ParticipantDto
} from "../../../../../api";
import { Group } from "../../../domain/group.model";
import { Participant } from "../../../domain/participant.model";
import { SearchParticipantDialog } from "../../../shared/components/dialogs/search-participant/search-participant.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { DialogService } from "../../../shared/services/dialog.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { EditGroupDialog } from "../../dialogs/edit-group/edit-group.dialog";
import { ParticipantFacade } from "../../../shared/services/participant.facade";
import { CourseFacade } from "../../../shared/services/course.facade";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailComponent extends UnsubscribeOnDestroy implements OnInit {
	private groupSubject = new Subject<Group>();
	group$ = this.groupSubject.asObservable();
	private group: Group;

	participant$: Observable<Participant>;
	private participant: Participant;

	groupSettings: GroupSettingsDto;

	courseId: string;
	groupId: string;

	displayedColumns: string[] = ["name", "type", "score"];
	assessmentsDataSource$ = new Subject<MatTableDataSource<AssessmentDto>>();
	private assessmentsDataSource: MatTableDataSource<AssessmentDto>;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private groupService: GroupsService,
		private assessmentService: AssessmentsService,
		public participantFacade: ParticipantFacade,
		private courseFacade: CourseFacade,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService,
		private dialog: MatDialog,
		private snackbar: SnackbarService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.groupId = this.route.snapshot.paramMap.get("groupId");

		this.loadGroup();

		this.subs.sink = this.participantFacade.participant$.pipe(filter(p => !!p)).subscribe(p => {
			this.participant = p;

			if (this.participant.isTeachingStaffMember) {
				this.loadAssessmentsOfGroup();
			}
		});
		this.subs.sink = this.courseFacade.course$.subscribe(
			c => (this.groupSettings = c?.groupSettings)
		);
	}

	loadGroup(): void {
		this.groupService.getGroup(this.courseId, this.groupId).subscribe(
			result => {
				this.group = new Group(result);
				this.groupSubject.next(this.group);
			},
			error => console.log(error)
		);
	}

	loadAssessmentsOfGroup(): void {
		this.groupService.getAssessmentsOfGroup(this.courseId, this.groupId).subscribe({
			next: assessments => {
				this.assessmentsDataSource = new MatTableDataSource(assessments);
				this.assessmentsDataSource.sort = this.sort;
				this.assessmentsDataSource$.next(this.assessmentsDataSource);
			},
			error: error => this.snackbar.openApiExceptionMessage(error)
		});
	}

	/**
	 * Opens the `EditGroupDialog`.
	 * If the user edited the group successfully, reloads the group.
	 */
	onEditGroup(): void {
		this.dialog
			.open(EditGroupDialog, { data: this.groupId })
			.afterClosed()
			.subscribe(updated => {
				if (updated) {
					this.loadGroup();
				}
			});
	}

	/**
	 * Opens the `SearchParticipantDialog` and tries to add the selected participant to this group.
	 * If successful, the group is reloaded.
	 */
	onAddParticipant(): void {
		this.dialog
			.open<SearchParticipantDialog, string, ParticipantDto[]>(SearchParticipantDialog, {
				data: this.courseId
			})
			.afterClosed()
			.subscribe(participants => {
				if (participants?.length > 0) {
					this.addParticipantToGroup(participants[0]);
				}
			});
	}

	private addParticipantToGroup(participant: ParticipantDto): void {
		this.groupService
			.addUserToGroup(
				{ password: undefined },
				this.courseId,
				this.groupId,
				participant.userId
			)
			.subscribe({
				next: () => {
					this.snackbar.openSuccessMessage();
					this.loadGroup();
				},
				error: error => {
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
			this.dialogService
				.openConfirmDialog({
					title: "Action.Custom.RemoveUserFromGroup",
					params: [participant.displayName]
				})
				.subscribe(confirmed => {
					if (confirmed) {
						this.groupService
							.removeUserFromGroup(this.courseId, this.group.id, participant.userId)
							.subscribe(
								success => {
									this.snackbar.openSuccessMessage();
									this.loadGroup();
								},
								error => {
									this.snackbar.openApiExceptionMessage(error);
								}
							);
					}
				});
		}
	}

	/**
	 * Removes the current user from this group and navigates him away from the component,
	 * if successful. User will be asked to confirm this action.
	 */
	onLeaveGroup(): void {
		this.participantFacade
			.leaveGroup(this.group)
			.pipe(take(1))
			.subscribe(leftGroup => {
				if (leftGroup) {
					this.router.navigate(["/courses", this.courseId, "groups"]);
				}
			});
	}

	/**
	 * Removes the group, if the user confirms the action.
	 */
	onRemoveGroup(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.RemoveGroup",
				params: [this.group.name]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.groupService.deleteGroup(this.courseId, this.groupId).subscribe({
						next: () => {
							if (this.isGroupMember(this.participant)) {
								this.handleRemovalOfOwnGroup();
							}

							this.snackbar.openSuccessMessage();
							this.router.navigate(["/courses", this.courseId, "groups"]);
						},
						error: error => {
							console.log(error);
							this.snackbar.openErrorMessage();
						}
					});
				}
			});
	}

	isGroupMember(participant: ParticipantDto): boolean {
		return !!this.group.members.find(m => m.userId === this.participant.userId);
	}

	private handleRemovalOfOwnGroup(): void {
		// Reload the participant to remove his current group
		this.participantFacade.reload();
	}
}
