import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import {
	CourseFacade,
	CourseMembershipsFacade,
	ParticipantFacade,
	ToastService
} from "@student-mgmt-client/services";
import {
	ConfirmDialog,
	ConfirmDialogData,
	ExtendedConfirmDialog,
	ExtendedConfirmDialogData,
	IconComponentModule,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/shared-ui";
import { CourseActions, CourseSelectors } from "@student-mgmt-client/state";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { GroupApi, StudentMgmtException } from "@student-mgmt/api-client";
import { take, tap } from "rxjs/operators";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent extends UnsubscribeOnDestroy implements OnInit {
	constructor(
		public participantFacade: ParticipantFacade,
		public courseFacade: CourseFacade,
		private route: ActivatedRoute,
		private router: Router,
		private courseMemberships: CourseMembershipsFacade,
		private groupApi: GroupApi,
		private dialog: MatDialog,
		private toast: ToastService,
		private store: Store,
		private actions: Actions
	) {
		super();
	}

	ngOnInit(): void {
		this.handleNotACourseMember();

		this.subs.sink = this.route.params.subscribe(({ courseId }) => {
			this.store.dispatch({ type: "[Meta] Clear Course" });
			this.store.dispatch(CourseActions.loadCourse({ courseId }));
		});
	}

	private handleNotACourseMember(): void {
		this.subs.sink = this.actions
			.pipe(
				ofType(CourseActions.loadCourseFailure),
				take(1),
				tap(error => {
					const courseId = getRouteParam("courseId", this.route);
					// If user is not a member of this course, open JoinCourseDialog
					console.log(error);
					if (this.isNotACourseMember(error)) {
						this.dialog
							.open<JoinCourseDialog, string, boolean>(JoinCourseDialog, {
								data: courseId
							})
							.afterClosed()
							.subscribe(joined => {
								if (joined) {
									this.onUserJoinedCourse(courseId);
								} else {
									this.router.navigateByUrl("courses");
								}
							});
					} else if (error.error.status == 404) {
						this.router.navigateByUrl("404");
					}
				})
			)
			.subscribe();
	}

	private isNotACourseMember(error: any): boolean {
		return error.error?.error === StudentMgmtException.NameEnum.NotACourseMemberException;
	}

	private onUserJoinedCourse(courseId: string): void {
		this.actions
			.pipe(
				ofType(CourseActions.loadCourseSuccess),
				take(1),
				tap(({ data }) => {
					if (data.groupSettings.autoJoinGroupOnCourseJoined) {
						this.suggestGroupJoin(courseId);
					}
				})
			)
			.subscribe();
		this.store.dispatch(CourseActions.loadCourse({ courseId }));
	}

	/**
	 * Opens a `ConfirmDialog` that suggest the user to automatically join a random group.
	 */
	suggestGroupJoin(courseId: string): void {
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
					this.groupApi.joinOrCreateGroup(courseId).subscribe({
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
		this.store
			.select(CourseSelectors.selectCourse)
			.pipe(take(1))
			.subscribe(course => {
				const data: ExtendedConfirmDialogData = {
					title: "Action.Custom.LeaveCourse",
					params: [course.title, course.semester],
					stringToConfirm: course.id
				};

				this.dialog
					.open<ExtendedConfirmDialog, ExtendedConfirmDialogData, boolean>(
						ExtendedConfirmDialog,
						{ data }
					)
					.afterClosed()
					.subscribe(confirmed => {
						if (confirmed) {
							this.courseMemberships.leaveCourse(course.id).subscribe(
								success => {
									this.router.navigateByUrl("courses");
									this.toast.success("Action.Custom.LeaveCourse");
								},
								error => {
									this.toast.apiError(error);
								}
							);
						}
					});
			});
	}
}

@NgModule({
	declarations: [CourseComponent],
	exports: [CourseComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatTabsModule,
		MatCardModule,
		MatMenuModule,
		TranslateModule,
		IconComponentModule
	]
})
export class CourseComponentModule {}
