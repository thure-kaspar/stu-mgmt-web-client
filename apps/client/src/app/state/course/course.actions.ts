import { createAction, props } from "@ngrx/store";
import { CourseDto } from "@student-mgmt/api-client";

export const loadCourse = createAction("[Course] Load Course", props<{ courseId: string }>());

export const loadCourseSuccess = createAction(
	"[loadCourse$] Load Course Success",
	props<{ data: CourseDto }>()
);

export const loadCourseFailure = createAction(
	"[loadCourse$] Load Course Failure",
	props<{ error: any }>()
);
