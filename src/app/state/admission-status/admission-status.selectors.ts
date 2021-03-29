import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromAdmissionStatus from "./admission-status.reducer";

export const selectAdmissionStatusState = createFeatureSelector<fromAdmissionStatus.State>(
	fromAdmissionStatus.admissionStatusFeatureKey
);
