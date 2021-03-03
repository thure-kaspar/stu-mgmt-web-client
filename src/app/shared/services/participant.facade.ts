import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, distinctUntilChanged, map, switchMap, take } from "rxjs/operators";
import {
	AssignmentGroupTuple,
	CourseParticipantsService,
	GroupDto,
	GroupsService,
	ParticipantDto,
	UsersService
} from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { Participant } from "../../domain/participant.model";
import { DialogService } from "../../shared/services/dialog.service";
import { ToastService } from "../../shared/services/toast.service";
import { CourseFacade } from "./course.facade";

@Injectable({ providedIn: "root" })
export class ParticipantFacade {
	private participantSubject = new BehaviorSubject<Participant>(undefined);
	participant$ = this.participantSubject.asObservable();

	private assignmentGroupsSubject = new BehaviorSubject<AssignmentGroupTuple[]>(undefined);
	assignmentGroups$ = this.assignmentGroupsSubject.asObservable();

	private userId: string;
	private courseId: string;

	constructor(
		private courseParticipants: CourseParticipantsService,
		private groupService: GroupsService,
		private courseFacade: CourseFacade,
		private userService: UsersService,
		private authService: AuthService,
		private dialogService: DialogService,
		private router: Router,
		private toast: ToastService
	) {
		this.authService.user$.subscribe(user => {
			//console.log("new UserId:", info?.userId);
			if (user) {
				this.userId = user.id;
			} else {
				this.clear();
				this.userId = undefined;
			}
		});

		this.loadParticipantWhenCourseLoaded();
	}

	getParticipant(): Observable<Participant> {
		return this.participant$;
	}

	/**
	 * Changes the participants group to the given group and emits
	 * the changed participant via `participant$`.
	 */
	changeGroup(group: GroupDto): void {
		this.setGroup(group);
	}

	/**
	 * Opens the `ConfirmDialog` and if confirmed
	 * causes the participant to leave the group and emits the changed participant via `participant$`.
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
						return this.groupService
							.removeUserFromGroup(this.courseId, group.id, this.userId)
							.pipe(
								take(1),
								map(() => {
									this.setGroup(undefined);
									this.toast.success(group.name, "Action.Custom.LeaveGroup");
									return true;
								}),
								catchError(error => {
									this.toast.apiError(error);
									return throwError(error);
								})
							);
					} else {
						return of(false);
					}
				})
			);
	}

	loadAssignmentGroups(): void {
		this.userService.getGroupOfAllAssignments(this.userId, this.courseId).subscribe(tuples => {
			this.assignmentGroupsSubject.next(tuples);
		});
	}

	clearAssignmentGroups(): void {
		this.assignmentGroupsSubject.next(undefined);
	}

	/**
	 * Reloads the current participant.
	 */
	reload(): void {
		this.loadParticipant(this.courseId, this.userId);
	}

	/**
	 * Sets the participants group to the given `group` or `undefined` and emits
	 * the changed participant via `participant$`.
	 */
	private setGroup(group?: GroupDto): void {
		const participant = this.participantSubject.getValue();

		const dto: ParticipantDto = {
			...participant,
			group: group,
			groupId: group?.id
		};

		this.participantSubject.next(new Participant(dto));
	}

	/**
	 * Loads the participant information of logged in user and emits it via `participant$`.
	 * Should be invoked whenever a course is loaded.
	 */
	private loadParticipant(courseId: string, userId: string): void {
		this.courseParticipants.getParticipant(courseId, userId).subscribe(
			participant => {
				const p = new Participant(participant);
				this.participantSubject.next(p);
				this.toast.info("Enum.CourseRole." + participant.role, courseId);

				if (p.isStudent) {
					this.displayGroupSettingsViolationWarnings(p);
				}

				//console.log("Current participant:", participant);
			},
			error => {
				console.log(error);
				this.clear();
			}
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

	/**
	 * Loads the
	 */
	private loadParticipantWhenCourseLoaded(): void {
		this.courseFacade.course$
			.pipe(
				distinctUntilChanged((a, b) => a?.id === b?.id) // Only load when course has changed
			)
			.subscribe(course => {
				this.courseId = course?.id;
				if (course) {
					this.loadParticipant(course.id, this.userId);
				} else {
					this.clear();
				}
			});
	}

	clear(): void {
		this.participantSubject.next(undefined);
		this.clearAssignmentGroups();
	}
}
