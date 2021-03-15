import { createReducer, on } from "@ngrx/store";
import { AdmissionStatusDto } from "../../../../../api";
import { MetaState } from "../../interfaces";
import * as ParticipantAdmissionStatusActions from "./admission-status.actions";

export const participantAdmissionStatusFeatureKey = "participantAdmissionStatus";

export interface State extends MetaState {
	admissionStatus: AdmissionStatusDto;
}

export const initialState: State = {
	admissionStatus: null,
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(ParticipantAdmissionStatusActions.loadAdmissionsStatus, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(ParticipantAdmissionStatusActions.loadAdmissionsStatusSuccess, (state, action) => ({
		admissionStatus: action.data,
		isLoading: true,
		hasLoaded: true,
		error: null
	})),
	on(ParticipantAdmissionStatusActions.loadAdmissionsStatusFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: action.error
	}))
);
