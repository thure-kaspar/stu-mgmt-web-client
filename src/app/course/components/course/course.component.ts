import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseDto, CoursesService, StudentMgmtException } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"]
})
export class CourseComponent implements OnInit {

	course: CourseDto;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private courseService: CoursesService,
				private dialog: MatDialog) { }

	ngOnInit(): void {
		this.loadCourse();
	}

	/**
	 * Calls the API to load the course. If user is not a member, opens the JoinCourseDialog.
	 */
	loadCourse(): void {
		const courseId = this.route.snapshot.paramMap.get("courseId");
		this.courseService.getCourseById(courseId).subscribe(
			result => {
				this.course = result;
			},
			error => {
				// If user is not a member of this course, open JoinCourseDialog
				if (error.error?.message === StudentMgmtException.NameEnum.NotACourseMemberException) {
					this.dialog.open<JoinCourseDialog, string, boolean>(JoinCourseDialog, { data: courseId }).afterClosed().subscribe(
						joined => {
							if (joined) {
								// If user joined, try load the course again
								this.courseService.getCourseById(courseId).subscribe(result => this.course = result);
							} else {
								this.router.navigateByUrl("courses");
							}
						}
					);
				} else if (error.status == 404) {
					this.router.navigateByUrl("404");
				}
			}
		);
	}

}
