import { Component, OnInit } from "@angular/core";
import { CoursesService, CourseDto } from "../../../../api/typescript-angular-client-generated";

@Component({
	selector: "app-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"]
})
export class CourseListComponent implements OnInit {

	title = "";
	selectedSemester = "wise1920";
	courseList: CourseDto[];

	constructor(private courseService: CoursesService) { }

	ngOnInit(): void {

	}

	searchCourses(): void {
		this.courseService.getCourses(this.title, this.selectedSemester).subscribe(
			result => console.log(result),
			error => console.log(error)
		);
	}

}
