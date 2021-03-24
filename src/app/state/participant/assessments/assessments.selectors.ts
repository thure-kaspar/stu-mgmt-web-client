import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromParticipantAssessments from "./assessments.reducer";

const selectParticipantAssessmentsState = createFeatureSelector<fromParticipantAssessments.State>(
	fromParticipantAssessments.participantAssessmentsFeatureKey
);

export const selectAssessmentByAssignmentId = (assignmentId: string) =>
	createSelector(selectParticipantAssessmentsState, state => state.assessments?.[assignmentId]);
