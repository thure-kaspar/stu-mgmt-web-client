import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MarkerDto } from "@student-mgmt/api-client";

@Component({
	selector: "app-edit-marker",
	templateUrl: "./edit-marker.dialog.html",
	styleUrls: ["./edit-marker.dialog.scss"]
})
export class EditMarkerDialog implements OnInit {
	formGroup: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private data: MarkerDto, private fb: FormBuilder) {}

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
