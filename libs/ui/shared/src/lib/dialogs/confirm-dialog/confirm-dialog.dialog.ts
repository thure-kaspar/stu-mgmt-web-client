import { Component, Inject, NgModule } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmDialogUiComponentModule } from "./confirm-dialog-ui/confirm-dialog-ui.component";

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
    templateUrl: "./confirm-dialog.dialog.html",
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ConfirmDialog {
	constructor(
		public dialogRef: MatDialogRef<ConfirmDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
	) {}
}

@NgModule({
	declarations: [ConfirmDialog],
	exports: [ConfirmDialog],
	imports: [ConfirmDialogUiComponentModule, TranslateModule]
})
export class ConfirmDialogModule {}
