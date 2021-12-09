import { createReducer, on } from "@ngrx/store";
import { AdmissionStatusDto } from "@student-mgmt/api-client";
import { MetaState } from "../interfaces";
import * as AdmissionStatusActions from "./admission-status.actions";

export const admissionStatusFeatureKey = "admissionStatus";

export interface State extends MetaState {
	data: AdmissionStatusDto[];
}

export const initialState: State = {
	data: null,
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(AdmissionStatusActions.loadAdmissionStatus, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(AdmissionStatusActions.loadAdmissionStatusSuccess, (state, action) => ({
		...state,
		data: action.data,
		isLoading: false,
		hasLoaded: true,
		error: null
	})),
	on(AdmissionStatusActions.loadAdmissionStatusFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: action.error
	}))
);
