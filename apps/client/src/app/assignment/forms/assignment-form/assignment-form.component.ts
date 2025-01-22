import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import {
	AddableListHeaderComponentModule,
	AssignmentTypeChipComponentModule,
	CollaborationTypeChipComponentModule,
	DateTimePickerComponentModule,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssignmentDto } from "@student-mgmt/api-client";

@Component({
    selector: "student-mgmt-assignment-form",
    templateUrl: "./assignment-form.component.html",
    standalone: false
})
export class AssignmentFormComponent {
	form: UntypedFormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	stateEnumValues = Object.values(AssignmentDto.StateEnum);
	typeEnumValues = Object.values(AssignmentDto.TypeEnum);
	collaborationEnumValues = [
		AssignmentDto.CollaborationEnum.GROUP,
		AssignmentDto.CollaborationEnum.SINGLE,
		AssignmentDto.CollaborationEnum.GROUP_OR_SINGLE
	];

	constructor(private fb: UntypedFormBuilder) {
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

	getLinks(): UntypedFormArray {
		return this.form.get("links") as UntypedFormArray;
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

	getConfigs(): UntypedFormArray {
		return this.form.get("configs") as UntypedFormArray;
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
		MatDividerModule,
		TranslateModule,
		IconComponentModule,
		AssignmentTypeChipComponentModule,
		CollaborationTypeChipComponentModule,
		DateTimePickerComponentModule,
		AddableListHeaderComponentModule
	]
})
export class AssignmentFormComponentModule {}
