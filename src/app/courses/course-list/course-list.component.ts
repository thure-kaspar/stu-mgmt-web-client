import { Component, OnInit, ViewChild } from "@angular/core";
import { CoursesService, CourseDto } from "../../../../api/typescript-angular-client-generated";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"]
})
export class CourseListComponent implements OnInit {

	title = "";
	selectedSemester = "wise1920";

	courseList: CourseDto[];
	displayedColumns: string[] = ["title", "semester"];
	dataSource: MatTableDataSource<CourseDto>;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(private courseService: CoursesService) { }

	ngOnInit(): void {

	}

	searchCourses(): void {
		this.courseService.getCourses(this.title, this.selectedSemester).subscribe(
			result => {
				console.log(result);
				
				this.courseList = result;
				this.dataSource = new MatTableDataSource(this.courseList);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

}
