import { Component, OnInit } from "@angular/core";
import { AssignmentDto } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { CreateAssignmentDialog } from "../../dialogs/create-assignment/create-assignment.dialog";
import { EditAssignmentDialog, EditAssignmentDialogData } from "../../dialogs/edit-assignment/edit-assignment.dialog";
import { ActivatedRoute } from "@angular/router";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";

@Component({
	selector: "app-assignment-list",
	templateUrl: "./assignment-list.component.html",
	styleUrls: ["./assignment-list.component.scss"]
})
export class AssignmentListComponent implements OnInit {

	courseId: string;
	assignments: AssignmentDto[];

	constructor(public assignmentManagement: AssignmentManagementFacade,
				private route: ActivatedRoute,
				public dialog: MatDialog) { }

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.assignmentManagement.loadAssignmentsOfCourse(this.courseId);
	}

	openAddDialog(): void {
		this.dialog.open(CreateAssignmentDialog, { data: this.courseId });
	}

	openEditDialog(assignment: AssignmentDto): void {
		const data: EditAssignmentDialogData = { courseId: this.courseId, assignmentId: assignment.id };
		this.dialog.open(EditAssignmentDialog, { data });
	}

	onDelete(assignment: AssignmentDto): void {
		const data: ConfirmDialogData = { params: [assignment.name] };
		this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data }).afterClosed().subscribe(
			confirmed => {
				if (confirmed) {
					this.assignmentManagement.remove(assignment, this.courseId).subscribe(
						deleted => {
							if (deleted) {
								// TODO: Support undo ?
							}
						},
					);
				}
			}
		);
	}

}
