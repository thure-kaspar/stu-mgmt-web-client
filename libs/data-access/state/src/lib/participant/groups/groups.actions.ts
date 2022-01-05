import { createAction, props } from "@ngrx/store";
import { AssignmentGroupTuple } from "@student-mgmt/api-client";

export const loadGroups = createAction(
	"[loadParticipantSuccess$] Load Groups",
	props<{ courseId: string }>()
);

export const loadGroupsSuccess = createAction(
	"[loadGroups$] Load Groups Success",
	props<{ data: AssignmentGroupTuple[] }>()
);

export const loadGroupsFailure = createAction(
	"[loadGroups$] Load Groups Failure",
	props<{ error: any }>()
);
