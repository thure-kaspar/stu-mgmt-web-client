import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { AssignmentDto, AssignmentTemplateDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-assignment-templates-form",
	templateUrl: "./assignment-templates-form.component.html",
	styleUrls: ["./assignment-templates-form.component.scss"]
})
export class AssignmentTemplatesFormComponent implements OnInit {
	@Input() form: FormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {}

	addAssignmentTemplate(template?: AssignmentTemplateDto): void {
		this.getAssignmentTemplates().push(
			this.fb.group({
				id: [template?.id],
				templateName: [template?.templateName || "Unnamed template", Validators.required],
				name: [template?.name || null],
				state: [template?.state || null],
				type: [template?.type || null],
				collaboration: [template?.collaboration || null],
				points: [template?.points || null],
				bonusPoints: [template?.bonusPoints || null],
				timespanDays: [template?.timespanDays || null]
			})
		);
	}

	removeAssignmentTemplate(index: number): void {
		this.getAssignmentTemplates().removeAt(index);
	}

	getAssignmentTemplates(): FormArray {
		return this.form.get("config.assignmentTemplates") as FormArray;
	}

	getAssignmentTemplateName(index: number): string {
		return this.form.get("config.assignmentTemplates." + index).get("templateName")
			.value as string;
	}
}

@NgModule({
	declarations: [AssignmentTemplatesFormComponent],
	exports: [AssignmentTemplatesFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatCardModule,
		TranslateModule,
		IconComponentModule
	]
})
export class AssignmentTemplatesFormComponentModule {}
