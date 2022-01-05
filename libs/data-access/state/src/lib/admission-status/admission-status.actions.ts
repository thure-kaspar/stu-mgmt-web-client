import { createAction, props } from "@ngrx/store";
import { AdmissionStatusDto } from "@student-mgmt/api-client";

export const loadAdmissionStatus = createAction(
	"[AdmissionStatus] Load AdmissionStatus",
	props<{ courseId: string }>()
);

export const loadAdmissionStatusSuccess = createAction(
	"[loadAdmissionStatus$] Load AdmissionStatus Success",
	props<{ data: AdmissionStatusDto[] }>()
);

export const loadAdmissionStatusFailure = createAction(
	"[loadAdmissionStatus$] Load AdmissionStatus Failure",
	props<{ error: any }>()
);
