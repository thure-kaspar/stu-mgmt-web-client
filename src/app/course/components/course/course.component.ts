import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseDto, CoursesService } from "../../../../../api";
import { isNotACourseMember } from "../../../shared/api-exceptions";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";
import { CourseMembershipsFacade } from "../../services/course-memberships.facade";
import { CourseFacade } from "../../services/course.facade";
import { ParticipantFacade } from "../../services/participant.facade";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {

	private course: CourseDto;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private courseService: CoursesService,
				private courseMemberships: CourseMembershipsFacade,
				public participantFacade: ParticipantFacade,
				public courseFacade: CourseFacade,
				private dialog: MatDialog,
				private snackbar: SnackbarService) { super(); }

	ngOnInit(): void {
		this.loadCourse();
	}

	/**
	 * Calls the API to load the course. If user is not a member, opens the JoinCourseDialog.
	 */
	loadCourse(): void {
		const courseId = this.route.snapshot.paramMap.get("courseId");
		this.subs.sink = this.courseFacade.loadCourse(courseId).subscribe({
			next: (course) => this.course = course,
			error: (error) => {
				// If user is not a member of this course, open JoinCourseDialog
				if (isNotACourseMember(error)) {
					this.dialog.open<JoinCourseDialog, string, boolean>(JoinCourseDialog, { data: courseId }).afterClosed().subscribe(
						joined => {
							if (joined) {
								// If user joined, try load the course again
								this.loadCourse();
							} else {
								this.router.navigateByUrl("courses");
							}
						}
					);
				} else if (error.status == 404) {
					this.router.navigateByUrl("404");
				}
			}
		});
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

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.courseFacade.clear();
	}

}
