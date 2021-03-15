import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, assignmentsFeatureKey } from "./assignment.reducer";

export const selectAssignmentState = createFeatureSelector(assignmentsFeatureKey);
const { selectEntities, selectAll } = adapter.getSelectors();

export const selectAssignments = createSelector(selectAssignmentState, selectAll);

export const selectAssignment = (assignmentId: string) =>
	createSelector(selectAssignmentState, selectEntities, assignments => assignments[assignmentId]);
