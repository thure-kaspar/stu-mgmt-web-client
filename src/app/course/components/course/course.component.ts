import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseDto, CoursesService, StudentMgmtException } from "../../../../../api";
import { MatDialog } from "@angular/material/dialog";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { CourseMembershipsFacade } from "../../services/course-memberships.facade";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { isNotACourseMember } from "../../../shared/api-exceptions";

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
				private courseMemberships: CourseMembershipsFacade,
				private dialog: MatDialog,
				private snackbar: SnackbarService) { }

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
				if (isNotACourseMember(error)) {
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

	/** Allows the user to leave the course, if he gives confirmation. */
	leaveCourse(): void {
		const data: ConfirmDialogData = {
			title: "Action.Custom.LeaveCourse",
			params: [this.course.title, this.course.semester] 
		};
		this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed().subscribe(
				confirmed => {
					if (confirmed) {
						this.courseMemberships.leaveCourse(this.course.id).subscribe(
							success => {
								this.router.navigateByUrl("");
								this.snackbar.openSuccessMessage();
							},
							error => {
								this.snackbar.openErrorMessage();
							}
						);
					}
				}
			);
	}

}
