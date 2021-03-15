import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromParticipantGroups from "./groups.reducer";

export const selectParticipantGroupsState = createFeatureSelector<fromParticipantGroups.State>(
	fromParticipantGroups.participantGroupsFeatureKey
);
