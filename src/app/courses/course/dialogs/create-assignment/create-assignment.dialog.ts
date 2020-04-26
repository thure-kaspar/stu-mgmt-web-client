import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentDto, AssignmentsService, CourseConfigService, AssignmentTemplateDto } from "../../../../../../api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * Dialog that allows the creation of new assignments. Expects the courseId. Returns the created assignment.
 */
@Component({
	selector: "app-create-assignment",
	templateUrl: "./create-assignment.dialog.html",
	styleUrls: ["./create-assignment.dialog.scss"]
})
export class CreateAssignmentDialog implements OnInit {

	/** Form with the structure of an AssignmentDto. */
	form: FormGroup;
	/** Assignment templates of the course. */
	templates: AssignmentTemplateDto[];
	/** The selected template. */
	selectedTemplate: AssignmentTemplateDto;

	constructor(public dialogRef: MatDialogRef<CreateAssignmentDialog>,
				@Inject(MAT_DIALOG_DATA) private courseId: string,
				private assignmentService: AssignmentsService,
				private courseConfigService: CourseConfigService,
				private fb: FormBuilder,
				private snackbar: MatSnackBar) { 
					
		this.form = this.fb.group({
			courseId: [courseId, Validators.required],
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
		// Load assignment templates
		this.courseConfigService.getAssignmentTemplates(this.courseId).subscribe(
			templates => this.templates = templates
		);
	}

	fillInTemplate(template: AssignmentTemplateDto): void {
		this.selectedTemplate = template;
		this.form.patchValue(template);
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		const assignment: AssignmentDto = this.form.value; 

		this.assignmentService.createAssignment(assignment, assignment.courseId).subscribe(
			result => {
				this.dialogRef.close(result);
				this.snackbar.open("Assignment created!", "OK", { duration: 3000 });
			},
			error => console.log(error) // TODO: Display error
		);
	}

}
