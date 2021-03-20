import { createReducer, on } from "@ngrx/store";
import { CourseDto } from "../../../../api";
import { MetaState } from "../interfaces";
import * as CourseActions from "./course.actions";

export const courseFeatureKey = "course";

export interface State extends MetaState {
	data: CourseDto;
}

export const initialState: State = {
	data: null,
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(CourseActions.loadCourse, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(CourseActions.loadCourseSuccess, (state, action) => ({
		...state,
		data: action.data,
		isLoading: false,
		hasLoaded: true,
		error: null
	})),
	on(CourseActions.loadCourseFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: null
	}))
);
