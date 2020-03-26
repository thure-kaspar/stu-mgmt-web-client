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
		const creationTemplate: Partial<GroupDto> = {
			courseId: this.courseId,
			//name: this.course.groupNamePreset // TODO: Implement
		};

		const dialogRef = this.dialog.open(CreateGroupDialog, {
			data: creationTemplate
		});

		dialogRef.afterClosed().subscribe(
			result => {
				// Ensure group has been created
				if ((result as GroupDto)?.id) {
					this.groups.push(result);
				}
			},
			error => console.log(error)
		);
	}

}
