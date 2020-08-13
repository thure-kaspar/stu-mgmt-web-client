import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CourseDto, CoursesService } from "../../../../api";

@Injectable()
export class CourseFacade {

	/** Contains the currently loaded course. */
	course: Readonly<CourseDto>;

	private courseSubject = new BehaviorSubject<CourseDto>(undefined);
	/** Emits the currently loaded course. */
	course$ = this.courseSubject.asObservable();

	constructor(private courseService: CoursesService,
				private router: Router,
				private dialog: MatDialog) { }

	loadCourse(courseId: string): Observable<CourseDto> {
		return this.courseService.getCourseById(courseId).pipe(
			tap(course => {
				this.course = course;
				this.courseSubject.next(course);
				console.log("Current course:", course);
			}),
		);
	}

}
