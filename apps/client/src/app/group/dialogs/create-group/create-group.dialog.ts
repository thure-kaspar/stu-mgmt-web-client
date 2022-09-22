import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { GroupApi, GroupDto } from "@student-mgmt/api-client";
import {
	CreateGroupMultipleComponent,
	CreateGroupMultipleComponentModule
} from "./create-group-multiple/create-group-multiple.component";

@Component({
	selector: "student-mgmt-create-group",
	templateUrl: "./create-group.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CreateGroupDialog {
	@ViewChild("createMultiple") createMultiple: CreateGroupMultipleComponent;
	@ViewChild("tabs") tabGroup: MatTabGroup;
	form: UntypedFormGroup;

	constructor(
		public dialogRef: MatDialogRef<CreateGroupDialog>,
		@Inject(MAT_DIALOG_DATA) public courseId: string,
		private router: Router,
		private groupApi: GroupApi,
		private fb: UntypedFormBuilder,
		private toast: ToastService
	) {
		this.form = this.fb.group({
			courseId: [this.courseId, Validators.required],
			name: [null, Validators.required],
			password: [null],
			isClosed: [false]
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onGroupsCreatedHandler(groups: GroupDto[]): void {
		this.displaySuccessMessage();
		this.dialogRef.close(groups);
	}

	/** Calls the onSave-Method of the selected tab. */
	create(): void {
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
				this.displaySuccessMessage();
				this.dialogRef.close(result);
				this.router.navigate(["/courses", this.courseId, "groups", result.id]);
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}

	private displaySuccessMessage() {
		this.toast.success("Message.CreatedGroup");
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
