import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { AssignmentDto, AssignmentTemplateDto, CourseConfigApi } from "@student-mgmt/api-client";
import {
	AssignmentFormComponent,
	AssignmentFormComponentModule
} from "../../forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

/**
 * Dialog that allows the creation of new assignments. Expects the courseId. Returns the created assignment.
 */
@Component({
	selector: "student-mgmt-create-assignment",
	templateUrl: "./create-assignment.dialog.html",
	styleUrls: ["./create-assignment.dialog.scss"]
})
export class CreateAssignmentDialog implements OnInit {
	@ViewChild(AssignmentFormComponent, { static: true }) form: AssignmentFormComponent;
	/** Assignment templates of the course. */
	templates: AssignmentTemplateDto[];
	/** The selected template. */
	selectedTemplate: AssignmentTemplateDto;

	constructor(
		public dialogRef: MatDialogRef<CreateAssignmentDialog>,
		@Inject(MAT_DIALOG_DATA) private courseId: string,
		private assignmentManagement: AssignmentManagementFacade,
		private courseConfigApi: CourseConfigApi,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		// Load assignment templates
		this.courseConfigApi
			.getAssignmentTemplates(this.courseId)
			.subscribe(templates => (this.templates = templates));

		this.form.form.patchValue({
			type: AssignmentDto.TypeEnum.HOMEWORK,
			collaboration: AssignmentDto.CollaborationEnum.GROUP
		});
	}

	fillInTemplate(template: AssignmentTemplateDto): void {
		this.selectedTemplate = template;
		this.form.form.patchValue(template);
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		const assignment = this.form.form.value;
		this.assignmentManagement.create(assignment, this.courseId).subscribe(
			created => {
				this.dialogRef.close(created);
				this.toast.success(assignment.name, "Message.Created");
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}
}

@NgModule({
	declarations: [CreateAssignmentDialog],
	exports: [CreateAssignmentDialog],
	imports: [
		CommonModule,
		MatCardModule,
		MatMenuModule,
		MatButtonModule,
		TranslateModule,
		IconComponentModule,
		AssignmentFormComponentModule
	]
})
export class CreateAssignmentDialogModule {}
