import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Course } from "../../domain/course.model";
import * as fromCourse from "./course.reducer";

export const selectCourseState = createFeatureSelector<fromCourse.State>(
	fromCourse.courseFeatureKey
);

export const selectCourse = createSelector(selectCourseState, state => {
	if (state.data && state.groupSettings) {
		return new Course(state.data, state.groupSettings);
	}

	return null;
});
