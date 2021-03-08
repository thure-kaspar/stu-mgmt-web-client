import { createReducer, on } from "@ngrx/store";
import { UserDto } from "../../../../api";
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

export const reducer = createReducer(
	initialState,

	on(
		AuthActions.login,
		(state): State => ({
			token: null,
			user: null,
			isLoading: true,
			hasLoaded: false,
			error: null
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
			token: null,
			user: null,
			isLoading: false,
			hasLoaded: true,
			error: action.error
		})
	)
);
