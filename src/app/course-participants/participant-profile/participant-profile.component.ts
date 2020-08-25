import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { AssessmentDto, CourseParticipantsService, ParticipantDto, UsersService } from "../../../../api";
import { getRouteParam } from "../../../../utils/helper";
import { ParticipantFacade } from "../../course/services/participant.facade";
import { Participant } from "../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-participant-profile",
	templateUrl: "./participant-profile.component.html",
	styleUrls: ["./participant-profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantProfileComponent extends UnsubscribeOnDestroy implements OnInit {

	participant$ = new Subject<ParticipantDto>();

	/** Determines, if the assessments section should be displayed. */
	showAssessments = false;

	assessmentsDataSource$ = new BehaviorSubject(new MatTableDataSource<AssessmentDto>([]));
	displayedColumns = ["view", "assignment", "achievedPoints", "maxPoints", "percent"];

	userId: string;
	courseId: string;

	constructor(
		private participantService: CourseParticipantsService,
		private participantFacade: ParticipantFacade,
		private userService: UsersService,
		private route: ActivatedRoute,
		private router: Router,
	) { super(); }

	ngOnInit(): void {
		this.userId = getRouteParam("userId", this.route);
		this.courseId = getRouteParam("courseId", this.route);

		this.loadParticipant(this.courseId, this.userId);

		this.subs.sink = this.participantFacade.participant$.subscribe(
			participant => {
				if (participant.isLecturerOrTutor() || this.isViewingOwnProfile(participant)) {
					this.loadAssessmentsOfUser();
				}
			}
		);
	}

	/**
	 * Loads the participant and emits him via `participant$`.
	 */
	private loadParticipant(courseId: string, userId: string): void {
		this.subs.sink = this.participantService.getParticipant(courseId, userId).subscribe(
			participant => {
				this.participant$.next(participant);
			}
		);
	}

	/**
	 * Loads the assessments of this participant and emits them via `assessments$`.
	 */
	private loadAssessmentsOfUser(): void {
		this.showAssessments = true;
		this.subs.sink = this.userService.getAssessmentsOfUserForCourse(this.userId, this.courseId).subscribe(
			assessments => {
				this.assessmentsDataSource$.next(new MatTableDataSource(assessments));
			}
		);
	}

	/**
	 * Returns `true`, if the userId of this route matches the userId of the logged in user.
	 */
	private isViewingOwnProfile(participant: Participant): boolean {
		return participant.userId === this.userId;
	}



}
