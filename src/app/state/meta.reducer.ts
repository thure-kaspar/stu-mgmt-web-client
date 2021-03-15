import { ActionReducer, ActionReducerMap, combineReducers } from "@ngrx/store";
import * as fromAuth from "./auth/auth.reducer";
import * as fromCourse from "./course/course.reducer";
import * as fromAdmissionStatus from "./participant/admission-status/admission-status.reducer";
import * as fromAssignment from "./assignment/assignment.reducer";
import * as fromAssessments from "./participant/assessments/assessments.reducer";
import * as fromGroups from "./participant/groups/groups.reducer";
import * as fromParticipant from "./participant/participant.reducer";

export const reducerMap: ActionReducerMap<any> = {
	auth: fromAuth.reducer,
	assignments: fromAssignment.reducer,
	course: fromCourse.reducer,
	participant: combineReducers({
		data: fromParticipant.reducer,
		admissionStatus: fromAdmissionStatus.reducer,
		assessments: fromAssessments.reducer,
		groups: fromGroups.reducer
	})
};

export function clearCourse(reducer: ActionReducer<any>): ActionReducer<any> {
	return function (state, action): any {
		if (action.type === "[Meta] Clear Course") {
			return reducer(
				{
					auth: state.auth,
					course: fromCourse.initialState,
					assignments: fromAssignment.initialState,
					participant: {
						data: fromParticipant.initialState,
						admissionStatus: fromAdmissionStatus.initialState,
						assessments: fromAssessments.initialState,
						groups: fromGroups.initialState
					}
				},
				action
			);
		}

		return reducer(state, action);
	};
}
