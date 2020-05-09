import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService, GroupDto } from "../../../../../api";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CreateGroupMultipleComponent } from "./create-group-multiple/create-group-multiple.component";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
	selector: "app-create-group",
	templateUrl: "./create-group.dialog.html",
	styleUrls: ["./create-group.dialog.scss"]
})
export class CreateGroupDialog implements OnInit {

	@ViewChild("createMultiple") createMultiple: CreateGroupMultipleComponent;
	@ViewChild("tabs") tabGroup: MatTabGroup;
	form: FormGroup;

	constructor(public dialogRef: MatDialogRef<CreateGroupDialog>,
				@Inject(MAT_DIALOG_DATA) public courseId: string,
				private groupService: GroupsService,
				private fb: FormBuilder,
				private snackbar: MatSnackBar) { 

		this.form = this.fb.group({
			courseId: [this.courseId, Validators.required],
			name: [null, Validators.required],
			password: [null],
			isClosed: [false]
		});
	}

	ngOnInit(): void {
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onGroupsCreatedHandler(groups: GroupDto[]): void {
		this.snackbar.open("Groups created!", "OK", { duration: 3000 });
		this.dialogRef.close(groups);
	}

	/** Calls the onSave-Method of the selected tab. */
	onSave(): void {
		if (this.tabGroup.selectedIndex == 0) { // Single-Tab
			this.onSaveSingle();
		} else if (this.tabGroup.selectedIndex == 1) { // Multiple-Tab
			this.createMultiple.onSave();
		}
	}

	onSaveSingle(): void {
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
