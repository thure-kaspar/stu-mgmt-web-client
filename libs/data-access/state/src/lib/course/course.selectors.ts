import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Course } from "@student-mgmt-client/domain-types";
import * as fromCourse from "./course.reducer";

export const selectCourseState = createFeatureSelector<fromCourse.State>(
	fromCourse.courseFeatureKey
);

export const selectCourse = createSelector(selectCourseState, state => {
	return state.data ? new Course(state.data) : null;
});
