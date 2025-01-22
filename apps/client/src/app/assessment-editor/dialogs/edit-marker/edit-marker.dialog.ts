import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { MarkerDto } from "@student-mgmt/api-client";

@Component({
    selector: "student-mgmt-edit-marker",
    templateUrl: "./edit-marker.dialog.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class EditMarkerDialog implements OnInit {
	formGroup: UntypedFormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private data: MarkerDto, private fb: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.formGroup = this.fb.group({
			path: [this.data?.path, Validators.required],
			startLineNumber: [this.data?.startLineNumber ?? 0, Validators.required],
			endLineNumber: [this.data?.endLineNumber ?? 0, Validators.required],
			startColumn: [this.data?.startColumn],
			endColumn: [this.data?.endColumn],
			severity: [this.data?.severity],
			comment: [this.data?.comment, Validators.required],
			points: [this.data?.points]
		});
	}
}

@NgModule({
	declarations: [EditMarkerDialog],
	exports: [EditMarkerDialog],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule
	]
})
export class EditMarkerDialogModule {}
