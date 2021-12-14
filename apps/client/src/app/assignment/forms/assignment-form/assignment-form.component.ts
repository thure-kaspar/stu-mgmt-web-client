import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { DateTimePickerComponentModule, IconComponentModule } from "@student-mgmt-client/shared-ui";
import { AssignmentDto } from "@student-mgmt/api-client";
import { AbstractForm } from "../../../shared/abstract-form";

@Component({
	selector: "app-assignment-form",
	templateUrl: "./assignment-form.component.html",
	styleUrls: ["./assignment-form.component.scss"]
})
export class AssignmentFormComponent extends AbstractForm<AssignmentDto> implements OnInit {
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
			links: this.fb.array([]),
			configs: this.fb.array([])
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

	addConfig(config?: { tool: string; config: string }): void {
		this.getConfigs().push(
			this.fb.group({
				tool: [config?.tool ?? null, Validators.required],
				config: [config?.config ?? null, Validators.required]
			})
		);
	}

	removeConfig(index: number): void {
		this.getConfigs().removeAt(index);
	}

	getConfigs(): FormArray {
		return this.form.get("configs") as FormArray;
	}

	getConfigValue(index: number): string {
		return this.getConfigs().at(index).value;
	}
}

@NgModule({
	declarations: [AssignmentFormComponent],
	exports: [AssignmentFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		TranslateModule,
		IconComponentModule,
		DateTimePickerComponentModule
	]
})
export class AssignmentFormComponentModule {}
