import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
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
	selector: "app-extended-confirm-dialog",
	templateUrl: "./extended-confirm-dialog.dialog.html",
	styleUrls: ["./extended-confirm-dialog.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtendedConfirmDialog implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ExtendedConfirmDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ExtendedConfirmDialogData
	) {}

	ngOnInit(): void {}
}

@NgModule({
	declarations: [ExtendedConfirmDialog],
	exports: [ExtendedConfirmDialog],
	imports: [CommonModule, MatCardModule, MatFormFieldModule, TranslateModule]
})
export class ExtendedConfirmDialogModule {}
