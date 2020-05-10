import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CoursesService, UsersService, CourseDto } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({ providedIn: "root" })
export class CourseMembershipsFacade {

	private coursesSubject = new BehaviorSubject<CourseDto[]>([]);
	public courses$ = this.coursesSubject.asObservable();

	constructor(private courseService: CoursesService,
				private userService: UsersService,
				private authService: AuthService) { }

	loadCoursesOfUser(): void {
		const userId = this.getUserId();
		if (userId) {
			this.userService.getCoursesOfUser(userId).subscribe(
				courses => { 
					console.log(courses);
					this.coursesSubject.next(courses);
				},
				error => console.log(error)
			);
		}
	}

	getCourses(): CourseDto[] {
		return this.coursesSubject.getValue();
	}

	joinCourse(courseId: string, password?: string): void {
		const userId = this.authService.getAuthToken().userId;

		this.courseService.addUser({ password }, courseId, userId).subscribe(
			async success => {
				const courses = await this.userService.getCoursesOfUser(userId).toPromise();
				this.coursesSubject.next(courses);
			},
			error => {
				console.log(error);
				throw new Error("Failed to join the course.");
			}
		);
	}

	leaveCourse(courseId: string): void {
		const userId = this.authService.getAuthToken().userId;

		this.courseService.removeUser(courseId, userId).subscribe(
			async success => {
				const courses = await this.userService.getCoursesOfUser(userId).toPromise();
				this.coursesSubject.next(courses);
			},
			error => {
				console.log(error);
				throw new Error("Failed to leave course.");
			}
		);
	}

	private getUserId(): string {
		return this.authService.getAuthToken()?.userId;
	}
	
}
