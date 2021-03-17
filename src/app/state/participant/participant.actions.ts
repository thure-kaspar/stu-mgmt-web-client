import { createAction, props } from "@ngrx/store";
import { Participant } from "../../domain/participant.model";

export const loadParticipant = createAction(
	"[loadCourseSuccess$] Load Participant",
	props<{ courseId: string }>()
);

export const loadParticipantSuccess = createAction(
	"[loadParticipant$] Load Participant Success",
	props<{ data: Participant }>()
);

export const loadParticipantFailure = createAction(
	"[loadParticipant$] Load Participant Failure",
	props<{ error: any }>()
);

export const updateParticipant = createAction(
	"[Participant] Update Participant",
	props<{ changes: Partial<Participant> }>()
);
