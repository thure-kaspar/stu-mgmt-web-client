import { ActionReducer, ActionReducerMap } from "@ngrx/store";
import * as fromAdmissionStatus from "./admission-status/admission-status.reducer";
import * as fromAssignment from "./assignment/assignment.reducer";
import * as fromAuth from "./auth/auth.reducer";
import * as fromCourse from "./course/course.reducer";
import * as fromParticipantAdmissionStatus from "./participant/admission-status/admission-status.reducer";
import * as fromAssessments from "./participant/assessments/assessments.reducer";
import * as fromGroups from "./participant/groups/groups.reducer";
import * as fromParticipant from "./participant/participant.reducer";

export const reducerMap: ActionReducerMap<any> = {
	auth: fromAuth.reducer,
	course: fromCourse.reducer,
	assignments: fromAssignment.reducer,
	admissionStatus: fromAdmissionStatus.reducer,
	participant: fromParticipant.reducer,
	pAdmissionStatus: fromParticipantAdmissionStatus.reducer,
	pAssessments: fromAssessments.reducer,
	pGroups: fromGroups.reducer
};

export function clearCourse(reducer: ActionReducer<any>): ActionReducer<any> {
	return function (state, action): any {
		if (action.type === "[Meta] Clear Course") {
			return reducer(
				{
					...state,
					// Reset course related state
					course: fromCourse.initialState,
					assignments: fromAssignment.initialState,
					admissionStatus: fromAdmissionStatus.initialState,
					participant: fromParticipant.initialState,
					pAdmissionStatus: fromParticipantAdmissionStatus.initialState,
					pAssessments: fromAssessments.initialState,
					pGroups: fromGroups.initialState
				},
				action
			);
		}

		return reducer(state, action);
	};
}
