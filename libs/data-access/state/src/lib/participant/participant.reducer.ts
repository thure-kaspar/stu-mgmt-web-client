import { createReducer, on } from "@ngrx/store";
import { Participant } from "../../domain/participant.model";
import { MetaState } from "../interfaces";
import * as ParticipantActions from "./participant.actions";

export const participantFeatureKey = "participant";

export interface State extends MetaState {
	data: Participant;
}

export const initialState: State = {
	data: null,
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(ParticipantActions.loadParticipant, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(
		ParticipantActions.loadParticipantSuccess,
		(state, action): State => ({
			data: action.data,
			isLoading: false,
			hasLoaded: true,
			error: null
		})
	),
	on(
		ParticipantActions.loadParticipantFailure,
		(state, action): State => ({
			...state,
			error: action.error,
			isLoading: false,
			hasLoaded: true
		})
	),
	on(
		ParticipantActions.updateParticipant,
		(state, action): State => ({
			...state,
			data: {
				...state.data,
				...action.changes
			}
		})
	)
);
