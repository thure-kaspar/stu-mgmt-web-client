import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CourseDto, CoursesService, CourseConfigService, GroupSettingsDto } from "../../../../api";
import { Course } from "../../domain/course.model";

@Injectable()
export class CourseFacade {

	private courseSubject = new BehaviorSubject<Course>(undefined);
	/** Emits the currently loaded course. */
	course$ = this.courseSubject.asObservable();

	private groupSettingsSubject = new BehaviorSubject<GroupSettingsDto>(undefined);
	/** Emits the group settings of the currently loaded course. */
	groupSettings$ = this.groupSettingsSubject.asObservable();

	constructor(private courseService: CoursesService,
				private courseConfigService: CourseConfigService,
				private router: Router,
				private dialog: MatDialog) { }

	loadCourse(courseId: string): Observable<CourseDto> {
		return this.courseService.getCourseById(courseId).pipe(
			tap(course => {
				this.courseSubject.next(new Course(course));
				//console.log("Current course:", course);
			})
		);
	}

	/**
	 * Loads the group settings of a course and emits them via `groupSettings$`.
	 */
	loadGroupSettings(courseId: string): void {
		this.courseConfigService.getGroupSettings(courseId).subscribe(
			settings => {
				const course = new Course(this.courseSubject.getValue());
				course.setGroupSettings(settings);

				this.courseSubject.next(course);
				this.groupSettingsSubject.next(settings);

				//console.log("Current course:", course);
				//console.log("Group settings:", settings);
			}
		);
	}
}
