import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { UsersService } from "../../../../../api";
import { AuthSelectors } from "../../auth";

import * as ParticipantAssessmentsActions from "./assessments.actions";

@Injectable()
export class ParticipantAssessmentsEffects {
	loadAssessments$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParticipantAssessmentsActions.loadAssessments),
			withLatestFrom(this.store.select(AuthSelectors.selectUser)),
			switchMap(([action, user]) =>
				this.userService.getAssessmentsOfUserForCourse(user.id, action.courseId).pipe(
					map(data => ParticipantAssessmentsActions.loadAssessmentsSuccess({ data })),
					catchError(error =>
						of(
							ParticipantAssessmentsActions.loadAssessmentsFailure({
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
		private userService: UsersService
	) {}
}
