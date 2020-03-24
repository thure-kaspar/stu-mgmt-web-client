import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupDto, GroupsService } from "../../../../../../api";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-create-group",
	templateUrl: "./create-group.dialog.html",
	styleUrls: ["./create-group.dialog.scss"]
})
export class CreateGroupDialog implements OnInit {

	form: FormGroup;

	constructor(public dialogRef: MatDialogRef<CreateGroupDialog>,
				@Inject(MAT_DIALOG_DATA) public groupTemplate: Partial<GroupDto>,
				private groupService: GroupsService,
				private fb: FormBuilder,
				private snackbar: MatSnackBar) { 

		this.form = this.fb.group({
			courseId: [groupTemplate.courseId, Validators.required],
			name: [groupTemplate.name, Validators.required],
			password: [null],
			isClosed: [false]
		});
	}

	ngOnInit(): void {
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		const group: GroupDto = this.form.value;

		this.groupService.createGroup(group, group.courseId).subscribe(
			result => {
				this.snackbar.open("Group created!", "OK", { duration: 3000 });
				this.dialogRef.close(result);
			},
			error => console.log(error) // TODO: Display error
		);
	}

}
