import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { forkJoin, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { CourseConfigService, CoursesService } from "../../../../api";
import * as CourseActions from "./course.actions";

@Injectable()
export class CourseEffects {
	loadCourse$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CourseActions.loadCourse),
			switchMap(({ courseId }) =>
				forkJoin([
					this.courseService.getCourseById(courseId),
					this.courseConfigService.getGroupSettings(courseId)
				]).pipe(
					map(([course, groupSettings]) =>
						CourseActions.loadCourseSuccess({ data: course, groupSettings })
					),
					catchError(error => of(CourseActions.loadCourseFailure({ error: error.error })))
				)
			)
		)
	);

	constructor(
		private actions$: Actions,
		private courseService: CoursesService,
		private courseConfigService: CourseConfigService
	) {}
}
