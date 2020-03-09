import { Component, OnInit, Input } from "@angular/core";
import { AssignmentsService, AssignmentDto } from "../../../../../api/typescript-angular-client-generated";
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

	constructor(public dialog: MatDialog,
				private assignmentService: AssignmentsService) { }

	ngOnInit(): void {

	}

	openAddDialog(): void {
		const creationTemplate: Partial<AssignmentDto> = {
			courseId: this.courseId
		};

		const dialogRef = this.dialog.open(CreateAssignmentDialog, {
			data: creationTemplate
		});

		dialogRef.afterClosed().subscribe(
			result => console.log(result),
			error => console.log(error)
		); 
	}

}
