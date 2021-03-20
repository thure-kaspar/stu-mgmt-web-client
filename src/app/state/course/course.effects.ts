import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { CoursesService } from "../../../../api";
import * as CourseActions from "./course.actions";

@Injectable()
export class CourseEffects {
	loadCourse$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CourseActions.loadCourse),
			switchMap(({ courseId }) =>
				this.courseService.getCourseById(courseId).pipe(
					map(course => CourseActions.loadCourseSuccess({ data: course })),
					catchError(error => of(CourseActions.loadCourseFailure({ error: error.error })))
				)
			)
		)
	);

	constructor(private actions$: Actions, private courseService: CoursesService) {}
}
