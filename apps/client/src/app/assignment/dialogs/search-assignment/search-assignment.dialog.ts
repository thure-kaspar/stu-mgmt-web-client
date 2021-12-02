import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AssignmentDto, AssignmentApi } from "@student-mgmt/api-client";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";

/**
 * Dialogs that allows searching and selecting for assignments of a course.
 * @param courseId Id of the course.
 * @returns The selected assignment(s).
 */
@Component({
	selector: "app-search-assignment",
	templateUrl: "./search-assignment.dialog.html",
	styleUrls: ["./search-assignment.dialog.scss"]
})
export class SearchAssignmentDialog implements OnInit {
	dataSource: MatTableDataSource<AssignmentDto>;
	selection = new SelectionModel<AssignmentDto>(false, null);
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns = ["select", "name", "action"];

	constructor(
		private assignmentApi: AssignmentApi,
		@Inject(MAT_DIALOG_DATA) public courseId: string,
		private dialogRef: MatDialogRef<SearchAssignmentDialog>
	) {}

	ngOnInit(): void {
		this.assignmentApi.getAssignmentsOfCourse(this.courseId).subscribe(assignments => {
			this.dataSource = new MatTableDataSource(assignments);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	/** Closes the dialog without returning data. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/** Closes the dialog and returns the selected users. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects the given row. Removes selection, if already selected. */
	select(row: AssignmentDto): void {
		if (this.selection.isSelected(row)) {
			this.selection.deselect(row);
		} else {
			this.selection.select(row);
		}
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle(): void {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}
}
