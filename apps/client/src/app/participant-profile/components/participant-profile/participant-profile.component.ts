import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, switchMap, tap } from "rxjs/operators";
import {
	AdmissionStatusDto,
	AdmissionStatusApi,
	AssignmentGroupTuple,
	CourseParticipantsApi,
	GroupEventDto,
	ParticipantDto,
	UserApi
} from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ParticipantFacade } from "../../../shared/services/participant.facade";
import { State as ParticipantAdmissionStatusState } from "../../../state/participant/admission-status/admission-status.reducer";

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

	admissionStatus$ = new BehaviorSubject<ParticipantAdmissionStatusState>(null);
	assignmentGroups$: Observable<AssignmentGroupTuple[]>;
	groupHistory$: Observable<GroupEventDto[]>;

	showFullProfile$ = new BehaviorSubject<boolean>(false);

	userId: string;
	courseId: string;

	constructor(
		private participantsApi: CourseParticipantsApi,
		private admissionStatusApi: AdmissionStatusApi,
		private participantFacade: ParticipantFacade,
		private route: ActivatedRoute
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.params.subscribe(({ userId, courseId }) => {
			this.userId = userId;
			this.courseId = courseId;
		});

		this.participant$ = this.route.params.pipe(
			switchMap(({ courseId, userId }) =>
				this.participantsApi.getParticipant(courseId, userId)
			)
		);

		this.userParticipant$ = this.participantFacade.participant$;

		this.subs.sink = combineLatest([this.participant$, this.userParticipant$])
			.pipe(
				filter(([participant, loggedInUser]) => !!participant && !!loggedInUser),
				tap(([participant, loggedInUser]) => {
					if (
						loggedInUser.isTeachingStaffMember ||
						this.isViewingOwnProfile(participant, loggedInUser)
					) {
						this.loadAdmissionStatus(this.courseId, participant.userId);
						this.showFullProfile$.next(true);
					}
				})
			)
			.subscribe();
	}

	private loadAdmissionStatus(courseId: string, userId: string): void {
		this.admissionStatusApi
			.getAdmissionStatusOfParticipant(courseId, userId)
			.pipe(
				map(admissionStatus => ({
					admissionStatus,
					isLoading: false,
					hasLoaded: true
				}))
			)
			.subscribe(state => this.admissionStatus$.next(state));
	}

	private isViewingOwnProfile(p1: ParticipantDto, p2: ParticipantDto): boolean {
		return p1.userId === p2.userId;
	}
}
