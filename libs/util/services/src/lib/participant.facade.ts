import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import {
	AuthSelectors,
	CourseSelectors,
	ParticipantActions,
	ParticipantSelectors
} from "@student-mgmt-client/state";
import { CourseParticipantsApi, GroupApi, GroupDto } from "@student-mgmt/api-client";
import { combineLatest, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take } from "rxjs/operators";
import { Participant } from "@student-mgmt-client/domain-types";
import { DialogService } from "./dialog.service";
import { ToastService } from "./toast.service";

@Injectable({ providedIn: "root" })
export class ParticipantFacade {
	userId: string;
	courseId: string;
	participant$ = this.store.select(ParticipantSelectors.selectParticipant);

	constructor(
		private store: Store,
		private groupApi: GroupApi,
		private courseParticipants: CourseParticipantsApi,
		private dialogService: DialogService,
		private toast: ToastService
	) {
		this.store
			.select(CourseSelectors.selectCourse)
			.subscribe(course => (this.courseId = course?.id));

		this.store.select(AuthSelectors.selectUser).subscribe(user => (this.userId = user?.id));
	}

	/** Fetches the current participant from the API and dispatches an `updateParticipant` action. */
	reload(): void {
		this.courseParticipants
			.getParticipant(this.courseId, this.userId)
			.subscribe(participant => {
				this.store.dispatch(ParticipantActions.updateParticipant({ changes: participant }));
			});
	}

	/**
	 * Changes the participants group to the given group.
	 */
	changeGroup(group: GroupDto): void {
		this.setGroup(group);
	}

	/**
	 * Opens the `ConfirmDialog` and if confirmed causes the participant to leave the group.
	 */
	leaveGroup(group: GroupDto, message?: string): Observable<boolean> {
		return this.dialogService
			.openConfirmDialog({
				title: "Action.Custom.LeaveGroup",
				message,
				params: [group.name]
			})
			.pipe(
				take(1),
				switchMap(confirmed => {
					if (confirmed) {
						return combineLatest([
							this.store.select(CourseSelectors.selectCourse),
							this.participant$
						]).pipe(
							take(1),
							switchMap(([course, participant]) => {
								return this.groupApi
									.removeUserFromGroup(course.id, group.id, participant.userId)
									.pipe(
										take(1),
										map(() => {
											this.setGroup(null);
											this.toast.success(
												group.name,
												"Action.Custom.LeaveGroup"
											);
											return true;
										}),
										catchError(error => {
											this.toast.apiError(error);
											return throwError(error);
										})
									);
							})
						);
					} else {
						return of(false);
					}
				})
			);
	}

	/**
	 * Sets the current group of the participant.
	 */
	private setGroup(group?: GroupDto): void {
		this.store.dispatch(
			ParticipantActions.updateParticipant({
				changes: {
					group: group,
					groupId: group?.id
				}
			})
		);
	}

	/**
	 * Displays warnings about missing or invalid group of participant.
	 * // TODO: Should not be hardcoded
	 */
	private displayGroupSettingsViolationWarnings(p: Participant): void {
		if (!p.groupId) {
			this.toast.warning("Text.Group.ParticipantHasNoGroup");
		} else if (p.group.members.length < 2) {
			this.toast.warning("Text.Group.NotEnoughMembers", p.group.name, { minSize: 2 });
		}
	}
}
