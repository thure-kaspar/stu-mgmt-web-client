import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, take } from "rxjs/operators";
import { AssessmentDto, GroupApi, ParticipantDto } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { Group } from "@student-mgmt-client/domain-types";
import { Participant } from "@student-mgmt-client/domain-types";
import { SearchParticipantDialog } from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { DialogService } from "@student-mgmt-client/services";
import { ParticipantFacade } from "@student-mgmt-client/services";
import { ToastService } from "@student-mgmt-client/services";
import { EditGroupDialog } from "../../dialogs/edit-group/edit-group.dialog";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	groupId: string;
	group$ = new BehaviorSubject<Group>(null);
	private group: Group;
	private participant: Participant;
	displayedColumns: string[] = ["name", "type", "score"];
	assessmentsDataSource$ = new Subject<MatTableDataSource<AssessmentDto>>();
	private assessmentsDataSource: MatTableDataSource<AssessmentDto>;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		readonly participantFacade: ParticipantFacade,
		private groupApi: GroupApi,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService,
		private dialog: MatDialog,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.groupId = getRouteParam("groupId", this.route);

		this.loadGroup();

		this.subs.sink = this.participantFacade.participant$.pipe(filter(p => !!p)).subscribe(p => {
			this.participant = p;

			if (this.participant.isTeachingStaffMember) {
				this.loadAssessmentsOfGroup();
			}
		});
	}

	loadGroup(): void {
		this.groupApi.getGroup(this.courseId, this.groupId).subscribe(
			result => {
				this.group = new Group(result);
				this.group$.next(this.group);
			},
			error => this.toast.apiError(error)
		);
	}

	loadAssessmentsOfGroup(): void {
		this.groupApi.getAssessmentsOfGroup(this.courseId, this.groupId).subscribe({
			next: assessments => {
				this.assessmentsDataSource = new MatTableDataSource(assessments);
				this.assessmentsDataSource.sort = this.sort;
				this.assessmentsDataSource$.next(this.assessmentsDataSource);
			},
			error: error => this.toast.apiError(error)
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
		this.groupApi
			.addUserToGroup(
				{ password: undefined },
				this.courseId,
				this.groupId,
				participant.userId
			)
			.subscribe({
				next: () => {
					this.toast.success();
					this.loadGroup();
				},
				error: error => {
					console.log(error);
					this.toast.success();
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
						this.groupApi
							.removeUserFromGroup(this.courseId, this.group.id, participant.userId)
							.subscribe(
								() => {
									this.toast.success();
									this.loadGroup();
								},
								error => {
									this.toast.apiError(error);
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
					this.groupApi.deleteGroup(this.courseId, this.groupId).subscribe({
						next: () => {
							if (this.isGroupMember(this.participant)) {
								this.participantFacade.changeGroup(null);
							}

							this.toast.success();
							this.router.navigate(["/courses", this.courseId, "groups"]);
						},
						error: error => {
							this.toast.apiError(error);
						}
					});
				}
			});
	}

	isGroupMember(participant: ParticipantDto): boolean {
		return !!this.group.members.find(m => m.userId === participant.userId);
	}
}
