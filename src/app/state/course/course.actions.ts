import { createAction, props } from "@ngrx/store";
import { CourseDto, GroupSettingsDto } from "../../../../api";

export const loadCourse = createAction("[Course] Load Course", props<{ courseId: string }>());

export const loadCourseSuccess = createAction(
	"[loadCourse$] Load Course Success",
	props<{ data: CourseDto; groupSettings: GroupSettingsDto }>()
);

export const loadCourseFailure = createAction(
	"[loadCourse$] Load Course Failure",
	props<{ error: any }>()
);
