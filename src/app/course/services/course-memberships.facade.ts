import { Injectable } from "@angular/core";
import { BehaviorSubject, of, Observable, throwError } from "rxjs";
import { CoursesService, UsersService, CourseDto } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { switchMap, catchError } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class CourseMembershipsFacade {

	private coursesSubject = new BehaviorSubject<CourseDto[]>([]);
	public courses$ = this.coursesSubject.asObservable();

	constructor(private courseService: CoursesService,
				private userService: UsersService,
				private authService: AuthService) {

		// Subscribe to login/logout
		this.authService.userInfo$.subscribe(
			userInfo => {
				// If user is logged in
				if (userInfo) {
					this.userService.getCoursesOfUser(userInfo.userId).subscribe(
						courses => { 
							this.coursesSubject.next(courses);
						},
						error => console.log(error)
					);
				} else {
					// User is logged out
					this.coursesSubject.next([]);
				}
			} 
		);
	}

	/** Allows to manually query the API for the user's courses. Results will be emitted via the courses-observable. */
	loadCoursesOfUser(): void {
		const userId = this.getUserId();
		if (userId) {
			this.userService.getCoursesOfUser(userId).subscribe(
				courses => { 
					this.coursesSubject.next(courses);
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
		return this.courseService.addUser({ password }, courseId, userId)
			.pipe(
				switchMap(
					success => {
						this.loadCoursesOfUser();
						return of(null);
					}
				),
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

		return this.courseService.removeUser(courseId, userId)
			.pipe(
				switchMap(
					success => {
						if (success) {
							const courses = this.coursesSubject.getValue().filter(c => c.id !== courseId);
							this.coursesSubject.next(courses);
							return of(null);
						} else {
							return throwError(new Error("Failed to leave the course.")); // TODO: Refactor, when removeUser returns void (or error)
						}
					}
				),
				catchError(error => {
					console.log(error);
					return throwError(error);
				})
			);
	}

	private getUserId(): string {
		return this.authService.getAuthToken()?.userId;
	}
	
}
