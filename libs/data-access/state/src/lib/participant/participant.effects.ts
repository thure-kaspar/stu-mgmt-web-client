import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { firstValueFrom, of } from "rxjs";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs";
import { CourseParticipantsApi, UserDto } from "@student-mgmt/api-client";
import { createParticipant } from "@student-mgmt-client/domain-types";
import { AuthSelectors } from "../auth";
import { CourseActions, CourseSelectors } from "../course";
import { loadAdmissionsStatus } from "./admission-status/admission-status.actions";
import { loadAssessments } from "./assessments/assessments.actions";
import { loadGroups } from "./groups/groups.actions";
import * as ParticipantActions from "./participant.actions";

function isAdmin(role: UserDto.RoleEnum): boolean {
	return (
		role == UserDto.RoleEnum.SYSTEM_ADMIN ||
		role == UserDto.RoleEnum.MGMT_ADMIN ||
		role == UserDto.RoleEnum.ADMIN_TOOL
	);
}

@Injectable()
export class ParticipantEffects {
	loadCourse$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CourseActions.loadCourse),
			map(action => ParticipantActions.loadParticipant({ courseId: action.courseId }))
		)
	);

	LoadParticipant$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(ParticipantActions.loadParticipant),
				withLatestFrom(this.store.select(AuthSelectors.selectUser)),
				tap(async ([action, user]) => {
					if (!user) {
						return;
					}
					// Admin Accounts will always be considered as LECTURER
					// This prevents
					if (isAdmin(user.role)) {
						this.store.dispatch(
							ParticipantActions.loadParticipantSuccess({
								courseId: action.courseId,
								data: createParticipant({
									username: user.username,
									displayName: user.displayName,
									userId: user.id,
									role: "LECTURER"
								})
							})
						);
					} else {
						try {
							const participant = await firstValueFrom(
								this.courseParticipants.getParticipant(action.courseId, user.id)
							);

							this.store.dispatch(
								ParticipantActions.loadParticipantSuccess({
									courseId: action.courseId,
									data: createParticipant(participant)
								})
							);
						} catch (error) {
							this.store.dispatch(
								ParticipantActions.loadParticipantFailure({ error: error.error })
							);
						}
					}
				})
			),
		{ dispatch: false }
	);

	loadParticipantSuccess$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParticipantActions.loadParticipantSuccess),
			switchMap(action => {
				if (action.data.role === "STUDENT") {
					const props = { courseId: action.courseId };
					return [loadAssessments(props), loadGroups(props), loadAdmissionsStatus(props)];
				}

				return [];
			})
		)
	);

	constructor(
		private actions$: Actions,
		private store: Store,
		private courseParticipants: CourseParticipantsApi
	) {}
}
