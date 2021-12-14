import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SnackbarService } from "@student-mgmt-client/services";
import { IconComponentModule, UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { getRouteParam, SemesterPipeModule } from "@student-mgmt-client/util-helper";
import {
	CourseDto,
	CourseParticipantsApi,
	ParticipantsComparisonDto,
	UserDto
} from "@student-mgmt/api-client";
import { SearchCourseDialog } from "../course/dialogs/search-course/search-course.dialog";

@Component({
	selector: "student-mgmt-participants-list-comparison",
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

	constructor(
		private courseParticipantsApi: CourseParticipantsApi,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private snackbar: SnackbarService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
	}

	openSearchCourseDialog(): void {
		this.dialog
			.open<SearchCourseDialog, undefined, CourseDto[]>(SearchCourseDialog)
			.afterClosed()
			.subscribe(selected => {
				if (selected?.length > 0) {
					this.selectedCourses = [...this.selectedCourses, ...selected];
				}
			});
	}

	removeSelectedCourse(course: CourseDto): void {
		this.selectedCourses = this.selectedCourses.filter(c => c.id !== course.id);
	}

	loadComparison(): void {
		const compareToCourseIds = this.selectedCourses.map(c => c.id);
		this.subs.sink = this.courseParticipantsApi
			.compareParticipantsList(this.courseId, compareToCourseIds)
			.subscribe(
				result => {
					this.comparison = result;
					this.inCoursesDataSource = new MatTableDataSource(
						this.comparison.inComparedCourses
					);
					this.notInCoursesDataSource = new MatTableDataSource(
						this.comparison.notInComparedCourses
					);
				},
				error => {
					console.log(error);
					this.snackbar.openErrorMessage();
				}
			);
	}
}

@NgModule({
	declarations: [ParticipantsListComparisonComponent],
	exports: [ParticipantsListComparisonComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatTableModule,
		MatPaginatorModule,
		TranslateModule,
		IconComponentModule,
		SemesterPipeModule
	]
})
export class ParticipantsListComparisonComponentModule {}
