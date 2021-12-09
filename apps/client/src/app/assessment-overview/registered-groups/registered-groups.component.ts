import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AssignmentRegistrationApi, GroupDto, ParticipantDto } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { SearchGroupDialog } from "../../group/dialogs/search-group/search-group.dialog";
import { SearchParticipantDialog } from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { DialogService } from "@student-mgmt-client/services";
import { DownloadService } from "@student-mgmt-client/services";
import { ParticipantFacade } from "@student-mgmt-client/services";
import { ToastService } from "@student-mgmt-client/services";

@Component({
	selector: "app-registered-groups",
	templateUrl: "./registered-groups.component.html",
	styleUrls: ["./registered-groups.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisteredGroupsComponent extends UnsubscribeOnDestroy implements OnInit {
	dataSource$ = new BehaviorSubject(new MatTableDataSource<GroupDto>([]));
	hasRegisteredGroups = false;
	courseId: string;
	assignmentId: string;
	displayedColumns = ["action", "name", "members"];
	filter: string;
	private groups: GroupDto[] = [];

	constructor(
		public participantFacade: ParticipantFacade,
		private registrations: AssignmentRegistrationApi,
		private route: ActivatedRoute,
		private dialogService: DialogService,
		private downloadService: DownloadService,
		private dialog: MatDialog,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);

		this.loadRegistrations();
	}

	/**
	 * Loads all registered groups for this assignment and emits them via `groups$`.
	 */
	private loadRegistrations(): void {
		this.subs.sink = this.registrations
			.getRegisteredGroups(this.courseId, this.assignmentId)
			.subscribe({
				next: result => {
					this.hasRegisteredGroups = result.length > 0;
					this.groups = result;
					this.dataSource$.next(new MatTableDataSource(result));
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	filterUpdated(): void {
		if (this.filter?.length > 0) {
			const filteredGroups = this.groups.filter(group => {
				const _filter = this.filter.trim().toLowerCase();
				const groupName = group.name.toLowerCase();

				if (groupName.includes(_filter)) {
					return true;
				}

				for (const member of group.members) {
					if (
						member.displayName.toLowerCase().includes(_filter) ||
						member.username.toLowerCase().includes(_filter)
					) {
						return true;
					}
				}

				return false;
			});
			this.dataSource$.next(new MatTableDataSource(filteredGroups));
		} else {
			this.dataSource$.next(new MatTableDataSource(this.groups));
		}
	}

	/**
	 * Opens the `SearchGroupDialog` and registers the selected groups with their members.
	 */
	registerGroup(): void {
		this.subs.sink = this.dialog
			.open<SearchGroupDialog, any, GroupDto[]>(SearchGroupDialog, { data: this.courseId })
			.afterClosed()
			.subscribe(groups => {
				if (groups?.length > 0) {
					groups.forEach(group => {
						this.registrations
							.registerGroup(this.courseId, this.assignmentId, group.id)
							.subscribe({
								next: () => {
									this.toast.success();
									this.loadRegistrations();
								},
								error: error => {
									this.toast.apiError(error, group.name);
								}
							});
					});
				}
			});
	}

	/**
	 * Registers all groups and their members for this assignment.
	 * Existing registrations should be removed beforehand.
	 */
	registerCurrentGroups(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.RegisterAllGroups"
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.registrations
						.registerAllGroups(this.courseId, this.assignmentId)
						.subscribe({
							next: () => {
								this.toast.success();
								this.loadRegistrations();
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}

	/**
	 * Unregisters all groups from this assignment.
	 */
	unregisterAllGroups(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.UnregisterAllGroups"
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.registrations.unregisterAll(this.courseId, this.assignmentId).subscribe({
						next: () => {
							this.toast.success();
							this.loadRegistrations();
						},
						error: error => {
							this.toast.apiError(error);
						}
					});
				}
			});
	}

	/**
	 * Registers the participant as a member of the given group.
	 */
	registerParticipant(group: GroupDto): void {
		this.dialog
			.open<SearchParticipantDialog, any, ParticipantDto[]>(SearchParticipantDialog, {
				data: this.courseId
			})
			.afterClosed()
			.subscribe(participants => {
				if (participants?.length > 0) {
					console.log("Adding:", participants[0]);
					this.registrations
						.registerParticipantAsGroupMember(
							this.courseId,
							this.assignmentId,
							group.id,
							participants[0].userId
						)
						.subscribe({
							next: () => {
								this.toast.success();
								this.loadRegistrations();
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}

	/**
	 * Unregisters the participant from this assignment and thereby removes him from his group.
	 */
	unregisterParticipant(participant: ParticipantDto): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.RemoveParticipant",
				params: [participant.displayName]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.registrations
						.unregisterUser(this.courseId, this.assignmentId, participant.userId)
						.subscribe({
							next: () => {
								this.toast.success();
								this.loadRegistrations();
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}

	/**
	 * Unregisters the group and its members from the assignment.
	 */
	unregisterGroup(group: GroupDto): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.RemoveGroup",
				params: [group.name]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.registrations
						.unregisterGroup(this.courseId, this.assignmentId, group.id)
						.subscribe({
							next: () => {
								this.toast.success();
								this.loadRegistrations();
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}

	exportToExcel(): void {
		this.downloadService.downloadFromApi(
			`export/${this.courseId}/registrations?assignmentId=${this.assignmentId}`,
			`${this.courseId}-${this.assignmentId}-registered-groups.xlsx`
		);
	}
}
