import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from "@ngx-translate/core";
import { SnackbarService } from "@student-mgmt-client/services";
import { GroupApi, GroupDto } from "@student-mgmt/api-client";
import {
	CreateGroupMultipleComponent,
	CreateGroupMultipleComponentModule
} from "./create-group-multiple/create-group-multiple.component";

@Component({
	selector: "app-create-group",
	templateUrl: "./create-group.dialog.html",
	styleUrls: ["./create-group.dialog.scss"]
})
export class CreateGroupDialog implements OnInit {
	@ViewChild("createMultiple") createMultiple: CreateGroupMultipleComponent;
	@ViewChild("tabs") tabGroup: MatTabGroup;
	form: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<CreateGroupDialog>,
		@Inject(MAT_DIALOG_DATA) public courseId: string,
		private groupApi: GroupApi,
		private fb: FormBuilder,
		private snackbar: SnackbarService
	) {
		this.form = this.fb.group({
			courseId: [this.courseId, Validators.required],
			name: [null, Validators.required],
			password: [null],
			isClosed: [false]
		});
	}

	ngOnInit(): void {}

	onCancel(): void {
		this.dialogRef.close();
	}

	onGroupsCreatedHandler(groups: GroupDto[]): void {
		this.snackbar.openSuccessMessage("Groups created!");
		this.dialogRef.close(groups);
	}

	/** Calls the onSave-Method of the selected tab. */
	onSave(): void {
		if (this.tabGroup.selectedIndex == 0) {
			// Single-Tab
			this.onSaveSingle();
		} else if (this.tabGroup.selectedIndex == 1) {
			// Multiple-Tab
			this.createMultiple.onSave();
		}
	}

	onSaveSingle(): void {
		const group: GroupDto = this.form.value;

		this.groupApi.createGroup(group, this.courseId).subscribe(
			result => {
				this.snackbar.openSuccessMessage("Group created!");
				this.dialogRef.close(result);
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}
}

@NgModule({
	declarations: [CreateGroupDialog],
	exports: [CreateGroupDialog],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule,
		CreateGroupMultipleComponentModule
	]
})
export class CreateGroupDialogModule {}
