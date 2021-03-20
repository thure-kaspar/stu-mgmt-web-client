import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, assignmentsFeatureKey, State } from "./assignment.reducer";

export const selectAssignmentState = createFeatureSelector<State>(assignmentsFeatureKey);
const { selectAll } = adapter.getSelectors();

export const selectAssignments = createSelector(selectAssignmentState, selectAll);

export const selectAssignment = (assignmentId: string) =>
	createSelector(selectAssignmentState, state => state.entities[assignmentId]);
