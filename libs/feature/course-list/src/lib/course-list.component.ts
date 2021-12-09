import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { getSemesterList } from "@student-mgmt-client/util-helper";
import { CourseApi, CourseDto, UserDto } from "@student-mgmt/api-client";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { AuthService } from "../../../../../apps/client/src/app/auth/services/auth.service";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { Paginator } from "../../../../../apps/client/src/app/shared/paginator/paginator.component";

type CourseFilter = {
	title?: string;
	shortname?: string;
	selectedSemester?: string;
};

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseListComponent extends UnsubscribeOnDestroy implements OnInit {
	displayedColumns: string[] = ["semester", "title"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]));

	filter: CourseFilter = {};
	nameFilterChanged = new Subject<void>();

	roles = UserDto.RoleEnum;
	semesters = getSemesterList();

	@ViewChild(Paginator, { static: true }) private paginator!: Paginator;

	constructor(private courseApi: CourseApi, public auth: AuthService) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.nameFilterChanged
			.pipe(debounceTime(300))
			.subscribe(() => this.searchCourses());

		this.searchCourses();
	}

	searchCourses(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		this.courseApi
			.getCourses(
				skip,
				take,
				this.filter.shortname,
				this.filter.selectedSemester,
				this.filter.title,
				"response"
			)
			.subscribe({
				next: response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.dataSource$.next(new MatTableDataSource(response.body!));
				},
				error: error => {
					console.log(error);
				}
			});
	}
}

@NgModule({
	imports: [CommonModule, TranslateModule, MatFormFieldModule, FormsModule]
})
export class CourseListComponentModule {}
