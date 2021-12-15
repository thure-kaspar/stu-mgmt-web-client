import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";

export type ExtendedConfirmDialogData = {
	stringToConfirm: string;
	title?: string;
	message?: string;
	params?: string[];
};

/**
 * Dialog that asks the user to confirm an action by typing the specified text into a textfield.
 * @param `ExtendedConfirmDialogData`
 * @returns boolean - `true` if user confirmed the action.
 */
@Component({
	selector: "student-mgmt-extended-confirm-dialog",
	templateUrl: "./extended-confirm-dialog.dialog.html",
	styleUrls: ["./extended-confirm-dialog.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ExtendedConfirmDialog {
	constructor(
		public dialogRef: MatDialogRef<ExtendedConfirmDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ExtendedConfirmDialogData
	) {}
}

@NgModule({
	declarations: [ExtendedConfirmDialog],
	exports: [ExtendedConfirmDialog],
	imports: [
		CommonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatDialogModule,
		MatButtonModule,
		TranslateModule
	]
})
export class ExtendedConfirmDialogModule {}
