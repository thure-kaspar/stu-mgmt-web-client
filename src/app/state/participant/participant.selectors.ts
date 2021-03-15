import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromParticipant from "./participant.reducer";

export const _selectParticipantState = createFeatureSelector<fromParticipant.State>(
	fromParticipant.participantFeatureKey
);

export const selectParticipant = createSelector(_selectParticipantState, state => state.data);
