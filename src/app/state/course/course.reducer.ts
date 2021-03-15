import { Action, createReducer, on } from "@ngrx/store";
import { CourseDto, GroupSettingsDto } from "../../../../api";
import { MetaState } from "../interfaces";
import * as CourseActions from "./course.actions";

export const courseFeatureKey = "course";

export interface State extends MetaState {
	data: CourseDto;
	groupSettings: GroupSettingsDto;
}

export const initialState: State = {
	data: null,
	groupSettings: null,
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
		groupSettings: action.groupSettings,
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
