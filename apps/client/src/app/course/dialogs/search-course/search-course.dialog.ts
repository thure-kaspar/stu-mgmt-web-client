import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { CourseDto, CourseApi } from "@student-mgmt/api-client";
import { getSemester, getSemesterList } from "@student-mgmt-client/util-helper";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";

/**
 * Dialog that allows searching for courses.
 * @returns `CourseDto[]` - The selected courses.
 */
@Component({
	selector: "app-search-course",
	templateUrl: "./search-course.dialog.html",
	styleUrls: ["./search-course.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCourseDialog extends UnsubscribeOnDestroy implements OnInit {
	title = "";
	shortname: string;
	selectedSemester = getSemester(new Date());
	semesters = getSemesterList();

	displayedColumns: string[] = ["select", "title", "semester", "action"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]));
	selection = new SelectionModel<CourseDto>(false, []);

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		public dialogRef: MatDialogRef<SearchCourseDialog, CourseDto[]>,
		private courseApi: CourseApi
	) {
		super();
	}

	ngOnInit(): void {
		this.searchCourses();
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
	searchCourses(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		this.subs.sink = this.courseApi
			.getCourses(skip, take, this.shortname, this.selectedSemester, this.title, "response")
			.subscribe(
				response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.dataSource$.next(new MatTableDataSource(response.body));
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
}
