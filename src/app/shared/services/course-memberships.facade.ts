import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { CourseParticipantsService, UserService } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { AuthActions } from "../../state/auth";

@Injectable({ providedIn: "root" })
export class CourseMembershipsFacade {
	constructor(
		private courseParticipantsService: CourseParticipantsService,
		private userService: UserService,
		private authService: AuthService,
		private store: Store
	) {}

	/** Allows to manually query the API for the user's courses. Results will be emitted via the courses-observable. */
	loadCoursesOfUser(userId: string): void {
		if (userId) {
			this.userService.getCoursesOfUser(userId).subscribe(
				courses => {
					this.store.dispatch(AuthActions.setCourses({ courses }));
				},
				error => console.log(error)
			);
		}
	}

	/**
	 * Adds the user to the course and updates the user's courses.
	 * If joining fails, the error will be passed on to the caller.
	 */
	joinCourse(courseId: string, password?: string): Observable<void> {
		const userId = this.getUserId();
		return this.courseParticipantsService.addUser({ password }, courseId, userId).pipe(
			switchMap(success => {
				this.loadCoursesOfUser(userId);
				return of(null);
			}),
			catchError(error => {
				console.log(error);
				return throwError(error);
			})
		);
	}

	/**
	 * Removes the user from the course and updates the user's courses.
	 * If leaving fails, the error will be passed on to the caller.
	 */
	leaveCourse(courseId: string): Observable<void> {
		const userId = this.getUserId();

		return this.courseParticipantsService.removeUser(courseId, userId).pipe(
			switchMap(success => {
				this.loadCoursesOfUser(userId);
				return of(null);
			}),
			catchError(error => {
				console.log(error);
				return throwError(error);
			})
		);
	}

	private getUserId(): string {
		return AuthService.getUser()?.id;
	}
}
