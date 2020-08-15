import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { CourseDto, CoursesService } from "../../../../../api";
import { getSemester } from "../../../../../utils/helper";
import { Paginator } from "../../../shared/paginator/paginator.component";

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
	styleUrls: ["./course-list.component.scss"]
})
export class CourseListComponent implements OnInit {

	
	courseList: CourseDto[];
	displayedColumns: string[] = ["title", "semester"];
	dataSource: MatTableDataSource<CourseDto>;

	filter = new CourseFilter({});
	filterSubject = new BehaviorSubject(this.filter);

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	constructor(private courseService: CoursesService) { }

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
					this.courseList = result;
					this.dataSource = new MatTableDataSource(this.courseList);

					if (!triggeredByPaginator) this.paginator.goToFirstPage();
				},
				error => console.log(error)
			);
	}

}
