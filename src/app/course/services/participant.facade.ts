import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { CourseParticipantsService, GroupDto, GroupsService, ParticipantDto } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { Participant } from "../../domain/participant.model";
import { DialogService } from "../../shared/services/dialog.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { ToastService } from "../../shared/services/toast.service";
import { CourseFacade } from "./course.facade";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class ParticipantFacade {

	private participantSubject = new BehaviorSubject<Participant>(undefined);
	participant$ = this.participantSubject.asObservable();

	private userId: string;
	private courseId: string;

	constructor(private courseParticipants: CourseParticipantsService,
				private groupService: GroupsService,
				private courseFacade: CourseFacade,
				private authService: AuthService,
				private snackbar: SnackbarService,
				private dialogService: DialogService,
				private router: Router,
				private toast: ToastService) {
		
		this.authService.userInfo$.subscribe(info => {
			//console.log("new UserId:", info?.userId);
			if (info) {
				this.userId = info.userId;
			} else {
				this.participantSubject.next(undefined);
				this.userId = undefined;
			}
		});

		this.loadParticipantWhenCourseLoaded();
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
	leaveGroup(group: GroupDto): void {
		this.dialogService.openConfirmDialog({
			title: "Action.Custom.LeaveGroup",
			params: [group.name]
		}).subscribe(
			confirmed => {
				if (confirmed) {
					this.groupService.removeUserFromGroup(this.courseId, group.id, this.userId).subscribe({
						next: () => {
							// Update the participant and emit new value
							this.setGroup(undefined);
							
							this.snackbar.openSuccessMessage();
							this.router.navigate(["/courses", this.courseId, "groups"]);
						},
						error: (error) => {
							console.log(error);
							this.snackbar.openErrorMessage();
						}
					});
				}
			}
		);
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
				this.participantSubject.next(new Participant(participant));
				this.toast.info("Enum.CourseRole." + participant.role, courseId);
				console.log("Current participant:", participant);
			},
			error => {
				console.log(error);
				this.participantSubject.next(undefined);
			}
		);
	}

	/**
	 * Loads the 
	 */
	private loadParticipantWhenCourseLoaded(): void {
		this.courseFacade.course$.pipe(
			distinctUntilChanged((a, b) => a?.id === b?.id) // Only load when course has changed
		).subscribe(
			course => {
				this.courseId = course?.id;
				if (course) {
					this.loadParticipant(course.id, this.userId);	
				} else {
					this.participantSubject.next(undefined);
				}
			}
		);
	}

}
