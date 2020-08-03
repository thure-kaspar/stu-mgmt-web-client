import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { GroupsService, GroupDto, CourseConfigService, GroupSettingsDto, CourseParticipantsService, UsersService, UserDto, ParticipantDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateGroupDialog } from "../../dialogs/create-group/create-group.dialog";
import { JoinGroupDialog, JoinGroupDialogData } from "../../dialogs/join-group/join-group.dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { getRouteParam } from "../../../../../utils/helper";
import { CreateGroupStudentDialog } from "../../dialogs/create-group-student/create-group-student.dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { Subject } from "rxjs";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { debounceTime } from "rxjs/operators";

class GroupFilter {
	name?: string;
	onlyClosed?: boolean;
	onlyOpen?: boolean;
}

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"],
})
export class GroupListComponent extends UnsubscribeOnDestroy implements OnInit {

	courseId: string;
	
	groups: GroupDto[];
	groupOfUser: GroupDto;
	groupSettings: GroupSettingsDto;
	
	dataSource: MatTableDataSource<GroupDto>;
	@ViewChild(Paginator, { static: true }) paginator: Paginator;
	displayedColumns = ["action", "hasPassword", "isClosed", "memberCount", "name", "options"]
	
	filter = new GroupFilter();
	nameFilterChangedSubject = new Subject();
	filterSubject = new Subject();

	constructor(public dialog: MatDialog,
				private groupService: GroupsService,
				private courseConfig: CourseConfigService,
				private courseParticipantsService: CourseParticipantsService,
				private userService: UsersService,
				private authService: AuthService,
				private router: Router,
				private route: ActivatedRoute) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.searchGroups();

		this.nameFilterChangedSubject.pipe(debounceTime(300))
			.subscribe(() => this.filterSubject.next());

		this.filterSubject.subscribe(() => {
			this.searchGroups();
		});

		this.courseConfig.getGroupSettings(this.courseId).subscribe(
			result => this.groupSettings = result,
			error => console.log(error)
		);
	}

	/** Loads the groups of the course. */
	searchGroups(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();
		
		let isClosed = undefined;
		if (this.filter?.onlyOpen) {
			isClosed = false;
		} else if (this.filter.onlyClosed) {
			isClosed = true;
		}

		this.groupService.getGroupsOfCourse(
			this.courseId, 
			skip, 
			take, 
			this.filter?.name, 
			isClosed
		).subscribe(
			result => {
				this.groups = result;
				this.dataSource = new MatTableDataSource(this.groups);
				if (triggeredByPaginator) {
					this.paginator.goToFirstPage();
				}
			}
		);
	}

	/**
	 * Opens up a group creation dialog depending on the user's course role.
	 */
	async openCreateGroupDialog(): Promise<void> {
		const userId = this.authService.getAuthToken().userId;
		const participant = await this.courseParticipantsService.getParticipant(this.courseId, userId).toPromise();

		if (participant.role === ParticipantDto.RoleEnum.STUDENT) {
			this.openCreateGroupDialog_Student();
		} else {
			this.openCreateGroupDialog_LecturerOrTutor();
		}
	}

	private openCreateGroupDialog_Student(): void {
		const dialogRef = this.dialog.open(CreateGroupStudentDialog, { data: this.courseId });
		dialogRef.afterClosed().subscribe(
			result => {
				if (result) {
					this.router.navigate(["courses", this.courseId, "groups", result.id]);
				}
			}
		);
	}

	private openCreateGroupDialog_LecturerOrTutor(): void {
		const dialogRef = this.dialog.open(CreateGroupDialog, { data: this.courseId });
		dialogRef.afterClosed().subscribe(
			result => {
				if (result) {
					this.searchGroups();
				}
			}
		);
	}

	openJoinGroupDialog(group: GroupDto): void {
		const data: JoinGroupDialogData = { courseId: this.courseId, groupId: group.id };
		this.dialog.open<JoinGroupDialog, JoinGroupDialogData, boolean>(JoinGroupDialog, { data }).afterClosed().subscribe(
			joined => {
				if (joined) {
					this.router.navigate(["groups", group.id], { relativeTo: this.route });	
				}
			}
		);
	}

	isJoinable(group: GroupDto): boolean {
		return !group.isClosed && group.users.length < this.groupSettings?.sizeMax;
	}

}
