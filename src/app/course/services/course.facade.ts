import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CourseConfigService, CoursesService } from "../../../../api";
import { Course } from "../../domain/course.model";

@Injectable({ providedIn: "root" })
export class CourseFacade {

	private courseSubject = new BehaviorSubject<Course>(undefined);
	/** Emits the currently loaded course (includes group settings). */
	course$ = this.courseSubject.asObservable();

	constructor(private courseService: CoursesService,
				private courseConfigService: CourseConfigService,
				private router: Router,
				private dialog: MatDialog) { }

	loadCourse(courseId: string): Observable<Course> {
		return forkJoin([
			this.courseService.getCourseById(courseId),
			this.courseConfigService.getGroupSettings(courseId)
		]).pipe(
			map((value) => {
				const course = new Course(value[0]);
				course.setGroupSettings(value[1]);
				return course;
			}),
			tap((course) => {
				this.courseSubject.next(course);
				console.log("Current course:", course);
			}),
		//	catchError(error => of)
		);
	}

	/**
	 * Clears the current course and group settings.
	 * Should be called when a user navigates away from a course.
	 */
	clear(): void {
		this.courseSubject.next(undefined);
	}

}
