import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, take, tap } from "rxjs/operators";
import { GroupDto, GroupApi, ParticipantDto } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { Group } from "@student-mgmt-client/domain-types";
import { Participant } from "@student-mgmt-client/domain-types";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { CourseFacade } from "@student-mgmt-client/services";
import { ParticipantFacade } from "@student-mgmt-client/services";
import { ToastService } from "@student-mgmt-client/services";
import { CreateGroupStudentDialog } from "../../dialogs/create-group-student/create-group-student.dialog";
import { CreateGroupDialog } from "../../dialogs/create-group/create-group.dialog";

class GroupFilter {
	name?: string;
	onlyClosed?: boolean;
	onlyOpen?: boolean;
	excludeEmpty?: boolean;

	constructor(defaults: Partial<GroupFilter>) {
		Object.assign(this, defaults);
	}
}

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupListComponent extends UnsubscribeOnDestroy implements OnInit {
	private participant: Participant;
	participant$ = this.participantFacade.participant$.pipe(tap(p => (this.participant = p)));

	groups$ = new BehaviorSubject<Group[]>([]);
	private allGroups: Group[] = [];

	/** Count of groups matching the filter. */
	totalCount = 0;
	courseId: string;

	filter = new GroupFilter({ excludeEmpty: true });
	nameFilterChangedSubject = new Subject<void>();
	filterSubject = new Subject<void>();

	constructor(
		private dialog: MatDialog,
		public participantFacade: ParticipantFacade,
		public courseFacade: CourseFacade,
		private groupApi: GroupApi,
		private toast: ToastService,
		private router: Router,
		private route: ActivatedRoute
	) {
		super();
	}

	private updateGroups(groups: Group[]): void {
		const filteredGroups = this.applyGroupFilter(groups);
		this.totalCount = filteredGroups.length;
		this.groups$.next(filteredGroups);
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadGroups();

		this.filterSubject.subscribe(() => {
			this.updateGroups(this.allGroups);
		});
	}

	loadGroups(): void {
		this.groupApi
			.getGroupsOfCourse(
				this.courseId,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				"response"
			)
			.subscribe(response => {
				this.allGroups = response.body.map(g => new Group(g));
				this.updateGroups(this.allGroups);
			});
	}

	applyGroupFilter(groups: Group[]): Group[] {
		return groups.filter(group => {
			const { onlyOpen, onlyClosed, excludeEmpty, name } = this.filter;

			if (onlyOpen && group.isClosed) return false;
			if (onlyClosed && !group.isClosed) return false;
			if (excludeEmpty && group.size == 0) return false;

			if (name?.length > 0) {
				const _name = name.toLowerCase();
				const matchesName =
					group.name.toLowerCase().includes(_name) ||
					group.members?.find(member => member.displayName.toLowerCase().includes(_name));
				if (!matchesName) return false;
			}

			return true;
		});
	}

	/**
	 * Opens up a group creation dialog depending on the user's course role.
	 */
	openCreateGroupDialog(): void {
		if (this.participant.isStudent) {
			if (this.participant.groupId) {
				this.participantFacade
					.leaveGroup(this.participant.group, "Text.Group.LeaveToJoinOther")
					.pipe(take(1))
					.subscribe(leftGroup => {
						if (leftGroup) {
							this.openCreateGroupDialog_Student();
						}
					});
			} else {
				this.openCreateGroupDialog_Student();
			}
		} else {
			this.openCreateGroupDialog_LecturerOrTutor();
		}
	}

	/**
	 * Calls the API to remove the given group and updates the `groups` list.
	 */
	onRemoveGroup(group: GroupDto): void {
		this.groupApi.deleteGroup(this.courseId, group.id).subscribe({
			next: () => {
				this.allGroups = this.allGroups.filter(g => g.id !== group.id);
				this.groups$.next(this.allGroups);
				this.toast.success("Message.Deleted", group.name);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	/**
	 * Calls the API to add the given participant to the given group.
	 */
	onAddParticipant(event: { group: GroupDto; participant: ParticipantDto }): void {
		console.log(`Adding ${event.participant.username} to ${event.group.name}.`);

		this.groupApi
			.addUserToGroup(
				{ password: undefined }, // Password not required for lecturers/tutors
				this.courseId,
				event.group.id,
				event.participant.userId
			)
			.subscribe({
				next: () => {
					const index = this.allGroups.findIndex(g => g.id === event.group.id);
					this.allGroups[index] = new Group({
						...this.allGroups[index],
						members: [...this.allGroups[index].members, event.participant],
						size: this.allGroups[index].size + 1
					});
					this.groups$.next(this.allGroups);
					this.toast.success("Message.Custom.ParticipantAddedToGroup", "", {
						name: event.participant.displayName,
						groupName: event.group.name
					});
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	private openCreateGroupDialog_Student(): void {
		const dialogRef = this.dialog.open(CreateGroupStudentDialog, { data: this.courseId });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.participantFacade.reload();
				this.router.navigate(["courses", this.courseId, "groups", result.id]);
			}
		});
	}

	private openCreateGroupDialog_LecturerOrTutor(): void {
		const dialogRef = this.dialog.open(CreateGroupDialog, { data: this.courseId });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.loadGroups();
			}
		});
	}
}
