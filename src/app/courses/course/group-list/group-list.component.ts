import { Component, OnInit, Input } from "@angular/core";
import { GroupsService, GroupDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateGroupDialog } from "../dialogs/create-group/create-group.dialog";

@Component({
	selector: "app-group-list",
	templateUrl: "./group-list.component.html",
	styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent implements OnInit {

	@Input() courseId: string;
	groups: GroupDto[];

	constructor(public dialog: MatDialog,
				private groupService: GroupsService) { }

	ngOnInit(): void {
		this.groupService.getGroupsOfCourse(this.courseId).subscribe(
			result => this.groups = result,
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

}
