import { createAction, props } from "@ngrx/store";
import { AdmissionStatusDto } from "@student-mgmt/api-client";

export const loadAdmissionsStatus = createAction(
	"[loadParticipantSuccess$] Load AdmissionStatus",
	props<{ courseId: string }>()
);

export const loadAdmissionsStatusSuccess = createAction(
	"[loadAdmissionsStatus$] Load AdmissionStatus Success",
	props<{ data: AdmissionStatusDto }>()
);

export const loadAdmissionsStatusFailure = createAction(
	"[loadAdmissionsStatus$] Load AdmissionStatus Failure",
	props<{ error: any }>()
);
