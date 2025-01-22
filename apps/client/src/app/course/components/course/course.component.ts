import { CommonModule } from "@angular/common";
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
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { AuthSelectors, CourseActions, CourseSelectors } from "@student-mgmt-client/state";
import { getRouteParam, UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { CourseApi, GroupApi, StudentMgmtException, UserDto } from "@student-mgmt/api-client";
import { firstValueFrom, take, tap } from "rxjs";
import { JoinCourseDialog } from "../../dialogs/join-course/join-course.dialog";

@Component({
    selector: "student-mgmt-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CourseComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	user$ = this.store.select(AuthSelectors.selectUser);
	userRoles = UserDto.RoleEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		public courseFacade: CourseFacade,
		private route: ActivatedRoute,
		private router: Router,
		private courseMemberships: CourseMembershipsFacade,
		private courseApi: CourseApi,
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
			this.courseId = courseId;
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
							this.courseMemberships.leaveCourse(course.id).subscribe({
								next: result => {
									this.router.navigateByUrl("courses");
									this.toast.success("Action.Custom.LeaveCourse");
								},
								error: error => {
									this.toast.apiError(error);
								}
							});
						}
					});
			});
	}

	async deleteCourse(): Promise<void> {
		const course = await firstValueFrom(this.store.select(CourseSelectors.selectCourse));
		const user = await firstValueFrom(this.user$);

		const data: ExtendedConfirmDialogData = {
			title: "Action.Custom.DeleteCourse",
			params: [course.title, course.semester],
			stringToConfirm: course.id
		};

		const confirmed = await firstValueFrom(
			this.dialog
				.open<ExtendedConfirmDialog, ExtendedConfirmDialogData, boolean>(
					ExtendedConfirmDialog,
					{ data }
				)
				.afterClosed()
		);

		if (confirmed) {
			try {
				await firstValueFrom(this.courseApi.deleteCourse(this.courseId));
				this.toast.success();
				this.router.navigateByUrl("/courses");
				this.courseMemberships.loadCoursesOfUser(user.id);
			} catch (error) {
				this.toast.apiError(error);
			}
		}
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
