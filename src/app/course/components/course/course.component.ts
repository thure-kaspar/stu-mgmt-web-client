import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CourseDto, GroupsService } from "../../../../../api";
import { isNotACourseMember } from "../../../shared/api-exceptions";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import {
	ExtendedConfirmDialog,
	ExtendedConfirmDialogData
} from "../../../shared/components/dialogs/extended-confirm-dialog/extended-confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { CourseMembershipsFacade } from "../../../shared/services/course-memberships.facade";
import { CourseFacade } from "../../../shared/services/course.facade";
import { ParticipantFacade } from "../../../shared/services/participant.facade";
import { ToastService } from "../../../shared/services/toast.service";
import { CourseActions } from "../../../state/course";
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
		private courseMemberships: CourseMembershipsFacade,
		public participantFacade: ParticipantFacade,
		public courseFacade: CourseFacade,
		private groupService: GroupsService,
		private dialog: MatDialog,
		private toast: ToastService,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.params.subscribe(({ courseId }) => {
			this.loadCourse(courseId);
		});
	}

	/**
	 * Calls the API to load the course. If user is not a member, opens the JoinCourseDialog.
	 */
	loadCourse(courseId: string): void {
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
								this.courseFacade.loadCourse(courseId).subscribe(course => {
									this.course = course;

									if (course.groupSettings.autoJoinGroupOnCourseJoined) {
										this.suggestGroupJoin();
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

	/**
	 * Opens a `ConfirmDialog` that suggest the user to automatically join a random group.
	 */
	suggestGroupJoin(): void {
		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
				data: {
					title: "Title.JoinGroup",
					message: "Text.Dialog.SuggestGroupJoin"
				}
			})
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.groupService.joinOrCreateGroup(this.course.id).subscribe({
						next: group => {
							this.participantFacade.changeGroup(group);
							this.toast.info("Message.Custom.AutoJoinedGroup", "", {
								groupName: group.name
							});
						},
						error: error => this.toast.apiError(error)
					});
				}
			});
	}

	/** Allows the user to leave the course, if he gives confirmation. */
	leaveCourse(): void {
		const data: ExtendedConfirmDialogData = {
			title: "Action.Custom.LeaveCourse",
			params: [this.course.title, this.course.semester],
			stringToConfirm: this.course.id
		};

		this.dialog
			.open<ExtendedConfirmDialog, ExtendedConfirmDialogData, boolean>(
				ExtendedConfirmDialog,
				{ data }
			)
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
