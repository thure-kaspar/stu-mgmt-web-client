import { createAction, props } from "@ngrx/store";
import { Participant } from "@student-mgmt-client/domain-types";

export const loadParticipant = createAction(
	"[loadCourse$] Load Participant",
	props<{ courseId: string }>()
);

export const loadParticipantSuccess = createAction(
	"[loadParticipant$] Load Participant Success",
	props<{ courseId: string; data: Participant }>()
);

export const loadParticipantFailure = createAction(
	"[loadParticipant$] Load Participant Failure",
	props<{ error: any }>()
);

export const updateParticipant = createAction(
	"[Participant] Update Participant",
	props<{ changes: Partial<Participant> }>()
);
