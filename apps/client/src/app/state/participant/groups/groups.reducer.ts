import { createReducer, on } from "@ngrx/store";
import { GroupDto } from "@student-mgmt/api-client";
import { MetaState } from "../../interfaces";
import * as ParticipantGroupsActions from "./groups.actions";

export const pGroupsFeatureKey = "pGroups";

export interface State extends MetaState {
	data: { [assignmentId: string]: GroupDto };
}

export const initialState: State = {
	data: null,
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(ParticipantGroupsActions.loadGroups, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(ParticipantGroupsActions.loadGroupsSuccess, (state, action) => {
		const dictionary = {};
		action.data.forEach(tuple => {
			dictionary[tuple.assignment.id] = tuple.group;
		});

		const nextState: State = {
			data: dictionary,
			isLoading: false,
			hasLoaded: true,
			error: null
		};

		return nextState;
	}),
	on(ParticipantGroupsActions.loadGroupsFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: action.error
	}))
);
