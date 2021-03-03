import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { AssignmentDto } from "../../../../../api";
import { AbstractForm } from "../../../shared/abstract-form";

@Component({
	selector: "app-assignment-form",
	templateUrl: "./assignment-form.component.html",
	styleUrls: ["./assignment-form.component.scss"]
})
export class AssignmentForm extends AbstractForm<AssignmentDto> implements OnInit {
	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

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
			links: this.fb.array([])
		});
	}

	ngOnInit(): void {}

	addLink(link?: { name: string; url: string }): void {
		this.getLinks().push(
			this.fb.group({
				name: [link?.name ?? null, Validators.required],
				url: [link?.url ?? null, Validators.required]
			})
		);
	}

	removeLink(index: number): void {
		this.getLinks().removeAt(index);
	}

	getLinks(): FormArray {
		return this.form.get("links") as FormArray;
	}
}
