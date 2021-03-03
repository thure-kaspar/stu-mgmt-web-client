import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { take, takeLast, delay, filter } from "rxjs/operators";
import { CourseDto, CoursesService } from "../../../../../api";
import { isNotACourseMember } from "../../../shared/api-exceptions";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { CourseMembershipsFacade } from "../../../shared/services/course-memberships.facade";
import { CourseFacade } from "../../../shared/services/course.facade";
import { ParticipantFacade } from "../../../shared/services/participant.facade";
import { ToastService } from "../../../shared/services/toast.service";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	private course: CourseDto;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private courseService: CoursesService,
		private courseMemberships: CourseMembershipsFacade,
		public participantFacade: ParticipantFacade,
		public courseFacade: CourseFacade,
		private dialog: MatDialog,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.loadCourse();
	}

	/**
	 * Calls the API to load the course. If user is not a member, opens the JoinCourseDialog.
	 */
	loadCourse(): void {
		const courseId = this.route.snapshot.paramMap.get("courseId");
		this.subs.sink = this.courseFacade.loadCourse(courseId).subscribe({
			next: course => (this.course = course),
			error: error => {
				// If user is not a member of this course, open JoinCourseDialog
				if (isNotACourseMember(error)) {
					this.dialog
						.open<JoinCourseDialog, string, boolean>(JoinCourseDialog, {
							data: courseId
						})
						.afterClosed()
						.subscribe(joined => {
							if (joined) {
								// If user joined, try load the course again
								this.loadCourse();

								this.subs.sink = this.participantFacade.participant$
									.pipe(
										filter(p => !!p),
										take(1)
									)
									.subscribe(participant => {
										if (participant.group) {
											this.toast.info("Message.Custom.AutoJoinedGroup", "", {
												groupName: participant.group.name
											});
										}
									});
							} else {
								this.router.navigateByUrl("courses");
							}
						});
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
		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.courseMemberships.leaveCourse(this.course.id).subscribe(
						success => {
							this.router.navigateByUrl("");
							this.toast.success("Action.Custom.LeaveCourse");
						},
						error => {
							this.toast.apiError(error);
						}
					);
				}
			});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.courseFacade.clear();
	}
}
