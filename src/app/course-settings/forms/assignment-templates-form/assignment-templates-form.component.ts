import { Component, OnInit, Input } from "@angular/core";
import { AssignmentDto, AssignmentTemplateDto } from "../../../../../api";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";

@Component({
	selector: "app-assignment-templates-form",
	templateUrl: "./assignment-templates-form.component.html",
	styleUrls: ["./assignment-templates-form.component.scss"]
})
export class AssignmentTemplatesForm implements OnInit {

	@Input() form: FormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
	}

	addAssignmentTemplate(template?: AssignmentTemplateDto): void {
		this.getAssignmentTemplates().push(this.fb.group({
			id: [template?.id],
			templateName: [template?.templateName || "Unnamed template", Validators.required],
			name: [template?.name || null],
			state: [template?.state || null],
			type: [template?.type || null],
			collaboration: [template?.collaboration || null],
			points: [template?.points ||null],
			bonusPoints: [template?.bonusPoints || null],
			timespanDays: [template?.timespanDays || null]
		}));
	}

	removeAssignmentTemplate(index: number): void {
		this.getAssignmentTemplates().removeAt(index);
	}

	getAssignmentTemplates(): FormArray {
		return this.form.get("config.assignmentTemplates") as FormArray;
	}

	getAssignmentTemplateName(index: number): string {
		return this.form.get("config.assignmentTemplates." + index ).get("templateName").value as string;
	}

}
