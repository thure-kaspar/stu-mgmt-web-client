import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromParticipantAssessments from "./assessments.reducer";

export const selectParticipantAssessmentsState = createFeatureSelector<fromParticipantAssessments.State>(
	fromParticipantAssessments.participantAssessmentsFeatureKey
);
