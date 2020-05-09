import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AssignmentDto } from "../../../../../api";
import { AbstractForm } from "../../../shared/abstract-form";

@Component({
	selector: "app-assignment-form",
	templateUrl: "./assignment-form.component.html",
	styleUrls: ["./assignment-form.component.scss"]
})
export class AssignmentForm extends AbstractForm<AssignmentDto> implements OnInit {

	constructor(private fb: FormBuilder) {
		super(); 
		this.form = this.fb.group({
			name: [null, Validators.required],
			state: [null, Validators.required],
			type: [null, Validators.required],
			collaboration: [null, Validators.required],
			points: [null, [Validators.required, Validators.min(0)]],
			bonusPoints: [null],
			startDate: [null],
			endDate: [null],
			comment: [null],
			link: [null],
		});	
	}

	ngOnInit(): void {
	}

}
