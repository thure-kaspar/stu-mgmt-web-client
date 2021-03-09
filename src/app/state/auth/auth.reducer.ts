import { createReducer, on } from "@ngrx/store";
import { AuthTokenDto, UserDto } from "../../../../api";
import { MetaState } from "../interfaces";
import * as AuthActions from "./auth.actions";

export const authFeatureKey = "auth";

export interface State extends MetaState {
	token: {
		accessToken: string;
		expiration: Date;
	};
	user: UserDto;
}

export const initialState: State = {
	token: null,
	user: null,
	hasLoaded: false,
	isLoading: false
};

function hasExpired(token: AuthTokenDto): boolean {
	return new Date(token.expiration) <= new Date();
}

function createInitialState(): State {
	const initial = initialState;
	const token = JSON.parse(localStorage.getItem("studentMgmtToken")) as AuthTokenDto;
	if (token) {
		if (hasExpired(token)) {
			localStorage.removeItem("studentMgmtToken");
		} else {
			initial.user = token.user;
			initial.token = {
				accessToken: token.accessToken,
				expiration: token.expiration
			};
		}
	}
	return initial;
}

export const reducer = createReducer(
	createInitialState(),

	on(
		AuthActions.login,
		(state): State => ({
			...state,
			isLoading: true,
			hasLoaded: false,
			error: undefined
		})
	),
	on(
		AuthActions.loginSuccess,
		(state, action): State => ({
			token: {
				accessToken: action.token.accessToken,
				expiration: action.token.expiration
			},
			user: action.token.user,
			isLoading: false,
			hasLoaded: true
		})
	),
	on(
		AuthActions.loginFailure,
		(state, action): State => ({
			...state,
			isLoading: false,
			hasLoaded: true,
			error: action.error
		})
	),
	on(
		AuthActions.logout,
		(state): State => ({
			token: null,
			user: null,
			isLoading: false,
			hasLoaded: false,
			error: undefined
		})
	)
);
