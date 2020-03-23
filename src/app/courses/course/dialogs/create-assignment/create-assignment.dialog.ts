import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentDto, AssignmentsService } from "../../../../../../api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-create-assignment",
	templateUrl: "./create-assignment.dialog.html",
	styleUrls: ["./create-assignment.dialog.scss"]
})
export class CreateAssignmentDialog {

	form: FormGroup;

	constructor(public dialogRef: MatDialogRef<CreateAssignmentDialog>,
				@Inject(MAT_DIALOG_DATA) public assignmentTemplate: Partial<AssignmentDto>,
				private assignmentService: AssignmentsService,
				private fb: FormBuilder,
				private snackbar: MatSnackBar) { 
					
		this.form = this.fb.group({
			courseId: [assignmentTemplate.courseId, Validators.required],
			name: [assignmentTemplate.name, Validators.required],
			state: [assignmentTemplate.state, Validators.required],
			type: [assignmentTemplate.type, Validators.required],
			collaborationType: [assignmentTemplate.collaborationType, Validators.required],
			maxPoints: [assignmentTemplate.maxPoints, [Validators.required, Validators.min(0)]],
			startDate: [null],
			endDate: [null],
			comment: [null],
			link: [null],
		});			
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
