import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export class ExtendedConfirmDialogData {
	stringToConfirm: string;
	title?: string;
	message?: string;
	params?: string[];
}

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
