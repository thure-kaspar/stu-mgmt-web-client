import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "student-mgmt-confirm-dialog-ui",
    templateUrl: "./confirm-dialog-ui.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ConfirmDialogUiComponent {
	/**
	 * ALlows overwriting the dialog's default title.
	 */
	@Input() title?: string;
	/**
	 * Allows overwriting the dialog's default message.
	 */
	@Input() message?: string;
	/**
	 * Information that can be displayed after the message (i.e name of the entity that will be changed if user confirms).
	 */
	@Input() params?: string[];

	/** Triggered, when the user clicked the `confirm` button. */
	@Output() confirmClicked = new EventEmitter<void>();

	/** Triggered, when the user clicked the `cancel` button. */
	@Output() cancelClicked = new EventEmitter<void>();
}

@NgModule({
	declarations: [ConfirmDialogUiComponent],
	exports: [ConfirmDialogUiComponent],
	imports: [CommonModule, TranslateModule, MatCardModule, MatButtonModule, MatDialogModule]
})
export class ConfirmDialogUiComponentModule {}
