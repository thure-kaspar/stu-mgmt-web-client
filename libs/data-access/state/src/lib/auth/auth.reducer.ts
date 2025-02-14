import { createReducer, on } from "@ngrx/store";
import { AuthResultDto } from "@student-mgmt/api-client";
import * as AuthActions from "./auth.actions";

export const authFeatureKey = "auth";

export interface State {
	authResult: AuthResultDto;
}

export const initialState: State = {
	authResult: null
};

// TODO: Find out if this file is important for authentication with API backend
function createInitialState(): State {
	let initial = initialState;
	const authState = JSON.parse(localStorage.getItem("auth")) as AuthResultDto;

	if (authState && authState.user && authState.accessToken) {
		initial = {
			authResult: authState
		};
	}

	return initial;
}

export const reducer = createReducer(
	createInitialState(),

	on(
		AuthActions.login,
		(_state, action): State => ({
			authResult: action.authResult
		})
	),
	on(
		AuthActions.logout,
		(_state): State => ({
			authResult: null
		})
	),
	on(AuthActions.setCourses, (state, action) => ({
		...state,
		authResult: {
			...state.authResult,
			user: {
				...state.authResult.user,
				courses: action.courses
			}
		}
	}))
);
