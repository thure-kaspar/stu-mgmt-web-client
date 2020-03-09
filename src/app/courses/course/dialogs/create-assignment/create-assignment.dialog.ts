import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssignmentDto, AssignmentsService } from "../../../../../../api/typescript-angular-client-generated";

@Component({
	selector: "app-create-assignment",
	templateUrl: "./create-assignment.dialog.html",
	styleUrls: ["./create-assignment.dialog.scss"]
})
export class CreateAssignmentDialog {

	assignment: AssignmentDto;

	constructor(public dialogRef: MatDialogRef<CreateAssignmentDialog>,
				@Inject(MAT_DIALOG_DATA) public assignmentTemplate: Partial<AssignmentDto>,
				private assignmentService: AssignmentsService) { 
					
		this.assignment = {
			courseId: assignmentTemplate.courseId,
			name: "",
			state: AssignmentDto.StateEnum.INPROGRESS,
			startDate: null,
			endDate: null,
			type: AssignmentDto.TypeEnum.HOMEWORK,
			maxPoints: null,
			comment: null,
			link: null,
			collaborationType: AssignmentDto.CollaborationTypeEnum.GROUP
		};

	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		this.assignmentService.createAssignment(this.assignment, this.assignment.courseId).subscribe(
			result => console.log(result),
			error => console.log(error)
		);
	}

	isValid(): boolean {
		return false;
	}

}
