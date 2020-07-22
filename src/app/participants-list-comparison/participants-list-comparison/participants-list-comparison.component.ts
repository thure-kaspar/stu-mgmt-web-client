import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SearchCourseDialog } from "../../course/dialogs/search-course/search-course.dialog";
import { MatTableDataSource } from "@angular/material/table";
import { UserDto, CourseDto, CourseParticipantsService, ParticipantsComparisonDto } from "../../../../api";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../../utils/helper";
import { SnackbarService } from "../../shared/services/snackbar.service";

@Component({
	selector: "app-participants-list-comparison",
	templateUrl: "./participants-list-comparison.component.html",
	styleUrls: ["./participants-list-comparison.component.scss"]
})
export class ParticipantsListComparisonComponent extends UnsubscribeOnDestroy implements OnInit {
	/** Selected courses that should be compared to the currently opened course. */
	selectedCourses: CourseDto[] = [];
	courseId: string;

	comparison: ParticipantsComparisonDto;
	inCoursesDataSource: MatTableDataSource<UserDto>;
	notInCoursesDataSource: MatTableDataSource<UserDto>;

	displayedColumns = ["username", "email"];

	constructor(private courseParticipantsService: CourseParticipantsService,
				private route: ActivatedRoute,
				private dialog: MatDialog,
				private snackbar: SnackbarService) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
	}

	openSearchCourseDialog(): void {
		this.dialog.open<SearchCourseDialog, undefined, CourseDto[]>(SearchCourseDialog).afterClosed().subscribe(
			selected => {
				if (selected?.length > 0) {
					this.selectedCourses = [...this.selectedCourses, ...selected];
				}
			},
		);
	}

	removeSelectedCourse(course: CourseDto): void {
		this.selectedCourses = this.selectedCourses.filter(c => c.id !== course.id);
	}

	loadComparison(): void {
		const compareToCourseIds = this.selectedCourses.map(c => c.id);
		this.subs.sink = this.courseParticipantsService.compareParticipantsList(this.courseId, compareToCourseIds).subscribe(
			result => {
				this.comparison = result;
				this.inCoursesDataSource = new MatTableDataSource(this.comparison.inComparedCourses);
				this.notInCoursesDataSource = new MatTableDataSource(this.comparison.notInComparedCourses);
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

}
