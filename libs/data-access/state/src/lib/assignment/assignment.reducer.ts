import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { AssignmentDto } from "@student-mgmt/api-client";
import * as AssignmentActions from "./assignment.actions";

export const assignmentsFeatureKey = "assignments";

export interface State extends EntityState<AssignmentDto> {
	isLoading: boolean;
	hasLoaded: boolean;
	error: any;
}

export const adapter = createEntityAdapter<AssignmentDto>();

export const initialState: State = adapter.getInitialState({
	isLoading: false,
	hasLoaded: false,
	error: null
});

export const reducer = createReducer(
	initialState,

	on(AssignmentActions.loadAssignments, (state, action) => ({
		...state,
		isLoading: true,
		error: null
	})),
	on(AssignmentActions.loadAssignmentsSuccess, (state, action) => ({
		...adapter.setAll(action.assignments, state),
		isLoading: false,
		hasLoaded: true,
		error: null
	})),
	on(AssignmentActions.loadAssignmentsFailure, (state, action) => ({
		...state,
		isLoading: false,
		hasLoaded: true,
		error: action.error
	})),

	on(AssignmentActions.loadAssignmentById, (state, action) => state),
	on(AssignmentActions.loadAssignmentByIdSuccess, (state, action) =>
		adapter.setOne(action.assignment, state)
	),
	on(AssignmentActions.loadAssignmentByIdFailure, (state, action) => state)

	// on(AssignmentActions.addAssignment, (state, action) =>
	// 	adapter.addOne(action.assignment, state)
	// ),
	// on(AssignmentActions.upsertAssignment, (state, action) =>
	// 	adapter.upsertOne(action.assignment, state)
	// ),
	// on(AssignmentActions.addAssignments, (state, action) =>
	// 	adapter.addMany(action.assignments, state)
	// ),
	// on(AssignmentActions.upsertAssignments, (state, action) =>
	// 	adapter.upsertMany(action.assignments, state)
	// ),
	// on(AssignmentActions.updateAssignment, (state, action) =>
	// 	adapter.updateOne(action.assignment, state)
	// ),
	// on(AssignmentActions.updateAssignments, (state, action) =>
	// 	adapter.updateMany(action.assignments, state)
	// ),
	// on(AssignmentActions.deleteAssignment, (state, action) => adapter.removeOne(action.id, state)),
	// on(AssignmentActions.deleteAssignments, (state, action) =>
	// 	adapter.removeMany(action.ids, state)
	// ),
	// on(AssignmentActions.clearAssignments, state => adapter.removeAll(state))
);
