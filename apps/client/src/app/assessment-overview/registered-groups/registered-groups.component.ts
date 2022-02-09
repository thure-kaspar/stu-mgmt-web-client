import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { RegisteredGroupCardUiComponentModule } from "@student-mgmt-client/components";
import {
	DialogService,
	DownloadService,
	ParticipantFacade,
	ToastService
} from "@student-mgmt-client/services";
import {
	IconComponentModule,
	SearchParticipantDialog,
	SearchParticipantDialogModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { getRouteParam, UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { AssignmentRegistrationApi, GroupDto, ParticipantDto } from "@student-mgmt/api-client";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import {
	SearchGroupDialog,
	SearchGroupDialogModule
} from "../../group/dialogs/search-group/search-group.dialog";

type RegisteredGroupsState = {
	data: GroupDto[];
	isLoading: boolean;
};

@Component({
	selector: "student-mgmt-registered-groups",
	templateUrl: "./registered-groups.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisteredGroupsComponent extends UnsubscribeOnDestroy implements OnInit {
	_groups: GroupDto[] = [];
	registeredGroups$ = new BehaviorSubject<RegisteredGroupsState>({ data: [], isLoading: true });

	courseId: string;
	assignmentId: string;
	filter: string;

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

	async ngOnInit(): Promise<void> {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);

		await this.loadRegistrations();
	}

	/**
	 * Loads all registered groups for this assignment and emits them via {@link registeredGroups$}.
	 */
	async loadRegistrations(): Promise<void> {
		this.registeredGroups$.next({ data: [], isLoading: true });

		this._groups = await firstValueFrom(
			this.registrations.getRegisteredGroups(this.courseId, this.assignmentId)
		);

		this.filterUpdated();
	}

	filterUpdated(): void {
		const filteredGroups = this.applyFilter(this._groups, this.filter);
		this.registeredGroups$.next({
			data: filteredGroups,
			isLoading: false
		});
	}

	/**
	 * Matches groups by ...
	 * - `group.name`
	 * - `member.displayName`
	 * @param groups
	 * @param [filter]
	 * @return {*}
	 */
	applyFilter(groups: GroupDto[], filter?: string): GroupDto[] {
		if (!filter || filter.trim() === "") {
			return groups;
		}

		const filterInLowerCase = this.filter.toLowerCase();

		return groups.filter(group => {
			if (group.name.toLowerCase().includes(filterInLowerCase)) {
				return true;
			}

			for (const member of group.members) {
				if (member.displayName.toLowerCase().includes(filterInLowerCase)) {
					return true;
				}
			}

			return false;
		});
	}

	/**
	 * Opens the `SearchGroupDialog` and registers the selected groups with their members.
	 */
	registerGroup(): void {
		this.subs.sink = this.dialog
			.open<SearchGroupDialog, string, GroupDto>(SearchGroupDialog, { data: this.courseId })
			.afterClosed()
			.subscribe(group => {
				if (group) {
					this.registrations
						.registerGroup(this.courseId, this.assignmentId, group.id)
						.subscribe({
							next: async () => {
								this.toast.success();
								await this.loadRegistrations();
							},
							error: error => {
								this.toast.apiError(error, group.name);
							}
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
							next: async () => {
								this.toast.success();
								await this.loadRegistrations();
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
						next: async () => {
							this.toast.success();
							await this.loadRegistrations();
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
			.open<SearchParticipantDialog, string, ParticipantDto[]>(SearchParticipantDialog, {
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
							next: async () => {
								this.toast.success();
								await this.loadRegistrations();
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
							next: async () => {
								this.toast.success();
								await this.loadRegistrations();
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
							next: async () => {
								this.toast.success();
								await this.loadRegistrations();
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

@NgModule({
	declarations: [RegisteredGroupsComponent],
	exports: [RegisteredGroupsComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatChipsModule,
		TranslateModule,
		IconComponentModule,
		TitleComponentModule,
		RegisteredGroupCardUiComponentModule,
		SearchGroupDialogModule,
		SearchParticipantDialogModule
	]
})
export class RegisteredGroupsComponentModule {}
