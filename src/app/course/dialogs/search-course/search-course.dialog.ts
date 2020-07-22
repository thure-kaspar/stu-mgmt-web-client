import { Component, OnInit, ViewChild } from "@angular/core";
import { CourseDto, CoursesService } from "../../../../../api";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialogRef } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";
import { getSemester } from "../../../../../utils/helper";

/**
 * Dialog that allows searching for courses.
 * @returns `CourseDto[]` - The selected courses.
 */
@Component({
	selector: "app-search-course",
	templateUrl: "./search-course.dialog.html",
	styleUrls: ["./search-course.dialog.scss"]
})
export class SearchCourseDialog implements OnInit {

	title = "";
	shortname: string;
	selectedSemester = getSemester();

	courseList: CourseDto[];
	displayedColumns: string[] = ["select", "title", "semester", "action"];
	dataSource: MatTableDataSource<CourseDto>;
	selection = new SelectionModel<CourseDto>(true, []);

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(public dialogRef: MatDialogRef<SearchCourseDialog, CourseDto[]>,
				private courseService: CoursesService) { }

	ngOnInit(): void {

	}

	/** Closes the dialog without returning data. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**Closes the dialog and returns the selected courses. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected);
	}

	/** Retrieves all courses that match the specified filters and inserts them into the table. */
	searchCourses(): void {
		this.courseService.getCourses(undefined, undefined, this.shortname, this.selectedSemester, this.title).subscribe(
			result => {
				this.courseList = result;
				this.dataSource = new MatTableDataSource(this.courseList);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

	/** Selects the given row. Removes selection, if already selected. */
	select(row: CourseDto): void {
		if (this.selection.isSelected(row)) {
			this.selection.deselect(row);
		} else {
			this.selection.select(row);
		}
		
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle(): void {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

}
