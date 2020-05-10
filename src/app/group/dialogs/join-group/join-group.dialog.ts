import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService } from "../../../../../api";
import { AuthService } from "../../../auth/services/auth.service";

export class JoinGroupDialogData {
	courseId: string;
	groupId: string;
}

/**
 * Dialog that allows the user to join a group. 
 * Returns a boolean, indicating, wether the user has joined the group.
 */
@Component({
	selector: "app-join-group",
	templateUrl: "./join-group.dialog.html",
	styleUrls: ["./join-group.dialog.scss"]
})
export class JoinGroupDialog implements OnInit {

	password: string;
	error: string;

	constructor(private dialogRef: MatDialogRef<JoinGroupDialog, boolean>,
				@Inject(MAT_DIALOG_DATA) private data: JoinGroupDialogData,
				private groupService: GroupsService,
				private authService: AuthService) { }

	ngOnInit(): void {
	}

	onCancel(): void {
		return this.dialogRef.close(false);
	}

	onJoin(): void {
		const userId =  this.authService.getAuthToken().userId;
		this.groupService.addUserToGroup({ password: this.password }, this.data.courseId, this.data.groupId, userId).subscribe(
			joined => {
				this.dialogRef.close(true);
			},
			error => {
				console.log(error);
				this.error = error.error.message;
			}
		);
	}

}
