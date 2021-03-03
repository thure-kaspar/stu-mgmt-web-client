import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { CourseDto, CoursesService } from "../../../../../api";
import { getSemester } from "../../../../../utils/helper";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

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
	selectedSemester = getSemester();

	displayedColumns: string[] = ["select", "title", "semester", "action"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]));
	selection = new SelectionModel<CourseDto>(false, []);

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		public dialogRef: MatDialogRef<SearchCourseDialog, CourseDto[]>,
		private courseService: CoursesService
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

		this.subs.sink = this.courseService
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
