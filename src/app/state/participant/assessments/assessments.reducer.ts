import { createReducer, on } from "@ngrx/store";
import { AssessmentDto } from "../../../../../api";
import { createDictionary } from "../../../../../utils/helper";
import { MetaState } from "../../interfaces";
import * as ParticipantAssessmentsActions from "./assessments.actions";

export const participantAssessmentsFeatureKey = "pAssessments";

export interface State extends MetaState {
	assessments?: { [assignmentId: string]: AssessmentDto };
}

export const initialState: State = {
	isLoading: false,
	hasLoaded: false,
	error: null
};

export const reducer = createReducer(
	initialState,

	on(ParticipantAssessmentsActions.loadAssessments, state => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(ParticipantAssessmentsActions.loadAssessmentsSuccess, (state, action) => ({
		assessments: createDictionary(action.data, a => a.assignmentId),
		isLoading: false,
		hasLoaded: true,
		error: null
	})),
	on(ParticipantAssessmentsActions.loadAssessmentsFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: action.error
	}))
);
