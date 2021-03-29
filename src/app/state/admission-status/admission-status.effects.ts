import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AdmissionStatusService } from "../../../../api";
import * as AdmissionStatusActions from "./admission-status.actions";

@Injectable()
export class AdmissionStatusEffects {
	loadAdmissionStatus$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AdmissionStatusActions.loadAdmissionStatus),
			switchMap(action =>
				this.admissionStatusService.getAdmissionStatusOfParticipants(action.courseId).pipe(
					map(data => AdmissionStatusActions.loadAdmissionStatusSuccess({ data })),
					catchError(({ error }) =>
						of(AdmissionStatusActions.loadAdmissionStatusFailure({ error }))
					)
				)
			)
		)
	);

	constructor(
		private actions$: Actions,
		private admissionStatusService: AdmissionStatusService
	) {}
}
