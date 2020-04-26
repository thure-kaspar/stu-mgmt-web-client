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
		this.dialog.open(CreateAssignmentDialog, { data: this.courseId }).afterClosed().subscribe(
			assignment => {
				// Ensure assignment has been created
				if ((assignment as AssignmentDto)?.id) {
					this.assignments.push(assignment);
				}
			}
		); 
	}

}
