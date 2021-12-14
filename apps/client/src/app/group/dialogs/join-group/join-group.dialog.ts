import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { Participant } from "@student-mgmt-client/domain-types";
import { ToastService } from "@student-mgmt-client/services";
import { GroupApi, GroupDto } from "@student-mgmt/api-client";

export class JoinGroupDialogData {
	courseId: string;
	group: GroupDto;
	participant: Participant;
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
	participant: Participant;
	group: GroupDto;

	password: string;
	error: string;

	constructor(
		private dialogRef: MatDialogRef<JoinGroupDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) private data: JoinGroupDialogData,
		private groupApi: GroupApi,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		this.participant = this.data.participant;
		this.group = this.data.group;
	}

	onCancel(): void {
		return this.dialogRef.close(false);
	}

	onJoin(): void {
		this.groupApi
			.addUserToGroup(
				{ password: this.password },
				this.data.courseId,
				this.group.id,
				this.participant.userId
			)
			.subscribe(
				joined => {
					this.toast.success(this.data.group.name, "Message.Custom.JoinedGroup");
					this.dialogRef.close(true);
				},
				error => {
					this.error = error.error.error;
					this.toast.apiError(error);
				}
			);
	}
}

@NgModule({
	declarations: [JoinGroupDialog],
	exports: [JoinGroupDialog],
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule
	]
})
export class JoinGroupDialogModule {}
