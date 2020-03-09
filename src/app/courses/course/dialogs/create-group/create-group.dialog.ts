import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupDto, GroupsService } from "../../../../../../api/typescript-angular-client-generated";

@Component({
	selector: "app-create-group",
	templateUrl: "./create-group.dialog.html",
	styleUrls: ["./create-group.dialog.scss"]
})
export class CreateGroupDialog implements OnInit {

	group: GroupDto;
	
	constructor(public dialogRef: MatDialogRef<CreateGroupDialog>,
				@Inject(MAT_DIALOG_DATA) public groupTemplate: Partial<GroupDto>,
				private groupService: GroupsService) { 

		this.group = {
			courseId: groupTemplate.courseId,
			name: null, // TODO: Allow to inforce fixed group name prefix
			isClosed: false,
			password: null
		};
	}

	ngOnInit(): void {
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		this.groupService.createGroup(this.group, this.group.courseId).subscribe(
			result => console.log(result),
			error => console.log(error)
		);
	}

	isValid(): boolean {
		return false;
	}

}
