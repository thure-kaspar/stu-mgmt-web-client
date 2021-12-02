import { createFeatureSelector, createSelector } from "@ngrx/store";
import { createParticipant } from "../../domain/participant.model";
import * as fromParticipant from "./participant.reducer";

export const _selectParticipantState = createFeatureSelector<fromParticipant.State>(
	fromParticipant.participantFeatureKey
);

export const selectParticipant = createSelector(_selectParticipantState, state => {
	if (state.data) {
		return createParticipant(state.data);
	}

	return null;
});
