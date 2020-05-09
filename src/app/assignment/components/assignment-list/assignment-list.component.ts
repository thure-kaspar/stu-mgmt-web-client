import { Component, OnInit, Input } from "@angular/core";
import { AssignmentDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateAssignmentDialog } from "../../dialogs/create-assignment/create-assignment.dialog";
import { EditAssignmentDialog, EditAssignmentDialogData } from "../../dialogs/edit-assignment/edit-assignment.dialog";

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

	openEditDialog(assignment: AssignmentDto): void {
		const data: EditAssignmentDialogData = { courseId: this.courseId, assignmentId: assignment.id };
		this.dialog.open(EditAssignmentDialog, { data }).afterClosed().subscribe(
			updatedAssignment => {
				if (updatedAssignment) {
					// Apply update locally
					const index = this.assignments.findIndex(a => a.id === assignment.id);
					this.assignments[index] = updatedAssignment;
				}
			}
		);
	}

}
