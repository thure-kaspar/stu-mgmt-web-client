import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmDialog, ConfirmDialogData } from "@student-mgmt-client/shared-ui";
import { Observable } from "rxjs";

/**
 * Service that can be used by components to open common dialogs.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
	constructor(private dialog: MatDialog) {}

	/**
	 * Opens the ConfirmDialog.
	 * @returns true, if user pressed confirm.
	 */
	openConfirmDialog(data?: ConfirmDialogData): Observable<boolean> {
		return this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed();
	}

	/**
	 * Opens a ```ConfirmDialog``` informing the user about unsaved changes.
	 */
	openUnsavedChangesDialog(): Observable<boolean> {
		return this.openConfirmDialog({
			title: "Misc.UnsavedChanges",
			message: "Prompt.ContinueWithUnsavedChanges"
		});
	}
}
