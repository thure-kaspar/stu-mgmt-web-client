import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { CourseParticipantsService, ParticipantDto } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ParticipantFacade } from "../../../shared/services/participant.facade";

@Component({
	selector: "app-participant-profile",
	templateUrl: "./participant-profile.component.html",
	styleUrls: ["./participant-profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantProfileComponent extends UnsubscribeOnDestroy implements OnInit {
	/** Participant, whose profile is being viewed. */
	participant$: Observable<ParticipantDto>;

	/** Participant that is currently logged in. */
	userParticipant$: Observable<Participant>;

	showFullProfile$ = new BehaviorSubject<boolean>(false);

	userId: string;
	courseId: string;

	constructor(
		private participantService: CourseParticipantsService,
		private participantFacade: ParticipantFacade,
		private route: ActivatedRoute
	) {
		super();
	}

	ngOnInit(): void {
		this.userId = getRouteParam("userId", this.route);
		this.courseId = getRouteParam("courseId", this.route);

		this.userParticipant$ = this.participantFacade.participant$.pipe(
			filter(p => !!p),
			tap(participant => {
				if (participant.isTeachingStaffMember || this.isViewingOwnProfile(participant)) {
					this.showFullProfile$.next(true);
				}
			})
		);

		this.participant$ = this.participantService.getParticipant(this.courseId, this.userId);
	}

	/**
	 * Returns `true`, if the userId of this route matches the userId of the logged in user.
	 */
	isViewingOwnProfile(participant: Participant): boolean {
		return participant.userId === this.userId;
	}
}
