import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { CourseDto, CoursesService, UserDto } from "../../../../../api";
import { getSemester } from "../../../../../utils/helper";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { AuthService } from "../../../auth/services/auth.service";

class CourseFilter {
	title = "";
	shortname: string;
	selectedSemester = getSemester();
	
	constructor(partial: Partial<CourseFilter>) {
		Object.assign(this, partial);
	}
}

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseListComponent implements OnInit {

	displayedColumns: string[] = ["title", "semester"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]))

	filter = new CourseFilter({});
	filterSubject = new BehaviorSubject(this.filter);

	roles = UserDto.RoleEnum;

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	constructor(private courseService: CoursesService,
				public auth: AuthService) { }

	ngOnInit(): void {
		this.filterSubject.pipe(
			map(filter => new CourseFilter(filter)), // Create new reference (otherwise we would compare object to itself)
			distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)) // Only reload, if filter changed
		).subscribe(
			filter => this.searchCourses()
		);
	}

	searchCourses(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();
		
		this.courseService.getCourses(
			skip, 
			take, 
			this.filter.shortname, 
			this.filter.selectedSemester, 
			this.filter.title
		)
			.subscribe(
				result => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.dataSource$.next(new MatTableDataSource(result));
				},
				error => console.log(error)
			);
	}

}
