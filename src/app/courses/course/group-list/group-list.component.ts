import { Component, OnInit, Input } from "@angular/core";
import { GroupsService, GroupDto } from "../../../../../api/typescript-angular-client-generated";
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
			isClosed: false,
			//name: this.course.groupNamePreset // TODO: Implement
		};

		const dialogRef = this.dialog.open(CreateGroupDialog, {
			data: creationTemplate
		});

		dialogRef.afterClosed().subscribe(
			result => console.log(result),
			error => console.log(error)
		);
	}

}
