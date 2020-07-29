import { Component, OnInit, Input } from "@angular/core";
import { GroupsService, GroupDto, CourseConfigService, GroupSettingsDto, CoursesService, CourseParticipantsService, UsersService, UserDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateGroupDialog } from "../../dialogs/create-group/create-group.dialog";
import { JoinGroupDialog, JoinGroupDialogData } from "../../dialogs/join-group/join-group.dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { getRouteParam } from "../../../../../utils/helper";
import { CreateGroupStudentDialog } from "../../dialogs/create-group-student/create-group-student.dialog";

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent implements OnInit {

	courseId: string;
	groups: GroupDto[];
	groupOfUser: GroupDto;
	groupSettings: GroupSettingsDto;

	/** Filter for group names or username. */
	filter: string;
	/** this.groups-Array with applied filter. */
	filteredGroups: GroupDto[];

	constructor(public dialog: MatDialog,
				private groupService: GroupsService,
				private courseConfig: CourseConfigService,
				private courseParticipantsService: CourseParticipantsService,
				private userService: UsersService,
				private authService: AuthService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadGroups();

		this.courseConfig.getGroupSettings(this.courseId).subscribe(
			result => this.groupSettings = result,
			error => console.log(error)
		);

		this.openCreateGroupDialog();
	}

	/** Loads the groups of the course. */
	loadGroups(): void {
		this.groupService.getGroupsOfCourse(this.courseId).subscribe(
			result => {
				this.groups = result;
				// Search groups for group containing the current user
				this.groupOfUser = this.groups.find(g => {
					return !!g.users.find(u => u.id === this.authService.getAuthToken().userId);
				});

				// Exclude user's group from the rest of groups
				this.groups = this.groups.filter(g => g !== this.groupOfUser);
				this.filteredGroups = [...this.groups];
			},
			error => console.log(error)
		);
	}

	applyFilter(): void {
		const filteredGroups = this.groups.filter(g => {
			const filter = this.filter.toLowerCase();
			return g.name.toLowerCase().includes(filter) 
				|| g.users.find(u => u.username.toLowerCase().includes(filter));
		});
		this.filteredGroups = filteredGroups;
	}

	/**
	 * Opens up a group creation dialog depending on the user's course role.
	 */
	async openCreateGroupDialog(): Promise<void> {
		const userId = this.authService.getAuthToken().userId;
		const participant = await this.courseParticipantsService.getParticipant(this.courseId, userId).toPromise();

		if (participant.courseRole === UserDto.CourseRoleEnum.STUDENT) {
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
					this.loadGroups();
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
		return !group.isClosed && group.users.length < this.groupSettings.sizeMax;
	}

}
