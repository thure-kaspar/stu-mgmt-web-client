import { Component, OnInit, Input } from "@angular/core";
import { AssignmentDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateAssignmentDialog } from "../dialogs/create-assignment/create-assignment.dialog";

@Component({
	selector: "app-assignment-list",
	templateUrl: "./assignment-list.component.html",
	styleUrls: ["./assignment-list.component.scss"]
})
export class AssignmentListComponent implements OnInit {

	@Input() courseId: string;
	@Input() assignments: AssignmentDto[];

	constructor(public dialog: MatDialog) { }

	ngOnInit(): void { }

	openAddDialog(): void {
		const creationTemplate: Partial<AssignmentDto> = {
			courseId: this.courseId,
			state: AssignmentDto.StateEnum.INPROGRESS,
			// TODO: Fill Template with configured default values for this course
		};

		const dialogRef = this.dialog.open(CreateAssignmentDialog, {
			data: creationTemplate
		});
		
		dialogRef.afterClosed().subscribe(
			result => {
				// Ensure assignment has been created
				if ((result as AssignmentDto).id) {
					this.assignments.push(result);
				}
			},
			error => console.log(error)
		); 
	}

}
