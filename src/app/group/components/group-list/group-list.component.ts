import { Component, OnInit, Input } from "@angular/core";
import { GroupsService, GroupDto, CourseConfigService, GroupSettingsDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateGroupDialog } from "../../dialogs/create-group/create-group.dialog";
import { JoinGroupDialog, JoinGroupDialogData } from "../../dialogs/join-group/join-group.dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent implements OnInit {

	@Input() courseId: string;
	groups: GroupDto[];
	groupOfUser: GroupDto;
	groupSettings: GroupSettingsDto;

	constructor(public dialog: MatDialog,
				private groupService: GroupsService,
				private courseConfig: CourseConfigService,
				private authService: AuthService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.groupService.getGroupsOfCourse(this.courseId).subscribe(
			result => {
				this.groups = result;

				// Search groups for group containing the current user
				this.groupOfUser = this.groups.find(g => {
					return !!g.users.find(u => u.id === this.authService.getAuthToken().userId);
				});

				// Exclude user's group from the rest of groups
				this.groups = this.groups.filter(g => g !== this.groupOfUser);
			},
			error => console.log(error)
		);

		this.courseConfig.getGroupSettings(this.courseId).subscribe(
			result => this.groupSettings = result,
			error => console.log(error)
		);
	}

	openAddDialog(): void {
		const dialogRef = this.dialog.open(CreateGroupDialog, { data: this.courseId });
		dialogRef.afterClosed().subscribe(
			result => {
				// If multiple groups were created
				if (Array.isArray(result)) {
					result.forEach(group => this.groups.push(group));
				} else {
					// Ensure group has been created
					if ((result as GroupDto)?.id) {
						this.groups.push(result);
					}
				}
			}
		);
	}

	openJoinGroupDialog(group: GroupDto): void {
		const data: JoinGroupDialogData = { courseId: this.courseId, groupId: group.id };
		this.dialog.open<JoinGroupDialog, JoinGroupDialogData, boolean>(JoinGroupDialog, { data }).afterClosed().subscribe(
			joined => {
				if (joined) {
					this.router.navigate([group.id], { relativeTo: this.route });	
				}
			}
		);
	}

	isJoinable(group: GroupDto): boolean {
		return !group.isClosed && group.users.length < this.groupSettings.sizeMax;
	}

}
