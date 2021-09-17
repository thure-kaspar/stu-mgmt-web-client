import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CourseDto, CourseService, UserDto } from "../../../../../api";
import { getSemester, getSemesterList } from "../../../../../utils/helper";
import { AuthService } from "../../../auth/services/auth.service";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { Paginator } from "../../../shared/paginator/paginator.component";

class CourseFilter {
	title: string;
	shortname: string;
	selectedSemester = getSemester(new Date());
}

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseListComponent extends UnsubscribeOnDestroy implements OnInit {
	displayedColumns: string[] = ["semester", "title"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]));

	filter = new CourseFilter();
	nameFilterChanged = new Subject();

	roles = UserDto.RoleEnum;
	semesters = getSemesterList();

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	constructor(private courseService: CourseService, public auth: AuthService) {
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

		this.courseService
			.getCourses(
				skip,
				take,
				this.filter.shortname,
				this.filter.selectedSemester,
				this.filter.title,
				"response"
			)
			.subscribe(
				response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.dataSource$.next(new MatTableDataSource(response.body));
				},
				error => console.log(error)
			);
	}
}
