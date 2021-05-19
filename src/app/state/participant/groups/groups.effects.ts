import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { UserService } from "../../../../../api";
import { AuthSelectors } from "../../auth";
import * as ParticipantGroupsActions from "./groups.actions";

@Injectable()
export class ParticipantGroupsEffects {
	loadGroups$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParticipantGroupsActions.loadGroups),
			withLatestFrom(this.store.select(AuthSelectors.selectUser)),
			switchMap(([action, user]) =>
				this.userService.getGroupOfAllAssignments(user.id, action.courseId).pipe(
					map(data => ParticipantGroupsActions.loadGroupsSuccess({ data })),
					catchError(error =>
						of(
							ParticipantGroupsActions.loadGroupsFailure({
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
		private userService: UserService
	) {}
}
