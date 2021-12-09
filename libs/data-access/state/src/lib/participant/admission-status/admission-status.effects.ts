import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { AdmissionStatusApi } from "@student-mgmt/api-client";
import { AuthSelectors } from "../../auth";
import * as ParticipantAdmissionStatusActions from "./admission-status.actions";

@Injectable()
export class ParticipantAdmissionStatusEffects {
	loadAdmissionStatus$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParticipantAdmissionStatusActions.loadAdmissionsStatus),
			withLatestFrom(this.store.select(AuthSelectors.selectUser)),
			switchMap(([action, user]) =>
				this.admissionStatusApi
					.getAdmissionStatusOfParticipant(action.courseId, user.id)
					.pipe(
						map(data =>
							ParticipantAdmissionStatusActions.loadAdmissionsStatusSuccess({ data })
						),
						catchError(error =>
							of(
								ParticipantAdmissionStatusActions.loadAdmissionsStatusFailure({
									error: error.error
								})
							)
						)
					)
			)
		)
	);

	constructor(
		private actions$: Actions,
		private store: Store,
		private admissionStatusApi: AdmissionStatusApi
	) {}
}
