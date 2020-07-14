import { Component, OnInit, ViewChild } from "@angular/core";
import { CoursesService, CourseDto } from "../../../../../api";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { getSemester } from "../../../../../utils/helper";

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"]
})
export class CourseListComponent implements OnInit {

	title = "";
	shortname: string;
	selectedSemester = getSemester();

	courseList: CourseDto[];
	displayedColumns: string[] = ["title", "semester"];
	dataSource: MatTableDataSource<CourseDto>;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private courseService: CoursesService) { }

	ngOnInit(): void {
		this.searchCourses();
	}

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

}
