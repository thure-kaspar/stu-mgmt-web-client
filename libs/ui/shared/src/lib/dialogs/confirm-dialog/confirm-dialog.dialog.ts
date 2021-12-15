import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";

export type ConfirmDialogData = {
	/**
	 * ALlows overwriting the dialog's default title.
	 */
	title?: string;
	/**
	 * Allows overwriting the dialog's default message.
	 */
	message?: string;
	/**
	 * Information that can be displayed after the message (i.e name of the entity that will be changed if user confirms).
	 */
	params?: string[];
};

@Component({
	selector: "student-mgmt-confirm-dialog",
	templateUrl: "./confirm-dialog.dialog.html"
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ConfirmDialog {
	constructor(
		public dialogRef: MatDialogRef<ConfirmDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
	) {}

	onCancel(): void {
		this.dialogRef.close(false);
	}

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	getTitle(): string {
		return this.data?.title ?? "Action.Confirm";
	}

	getMessage(): string {
		return this.data?.message ?? "Prompt.Question.AreYouSure";
	}
}

@NgModule({
	declarations: [ConfirmDialog],
	exports: [ConfirmDialog],
	imports: [CommonModule, TranslateModule, MatCardModule, MatButtonModule, MatDialogModule]
})
export class ConfirmDialogModule {}
