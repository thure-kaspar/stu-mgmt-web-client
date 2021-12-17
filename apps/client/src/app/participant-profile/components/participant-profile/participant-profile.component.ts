import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Participant } from "@student-mgmt-client/domain-types";
import { ParticipantFacade } from "@student-mgmt-client/services";
import {
	CardComponentModule,
	ParticipantAdmissionStatusComponentModule
} from "@student-mgmt-client/shared-ui";
import { ParticipantAdmissionStatusState } from "@student-mgmt-client/state";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import {
	AdmissionStatusApi,
	AssignmentGroupTuple,
	CourseParticipantsApi,
	GroupEventDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, switchMap, tap } from "rxjs/operators";

@Component({
	selector: "student-mgmt-participant-profile",
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

@NgModule({
	declarations: [ParticipantProfileComponent],
	exports: [ParticipantProfileComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatTabsModule,
		TranslateModule,
		CardComponentModule,
		ParticipantAdmissionStatusComponentModule
	]
})
export class ParticipantProfileComponentModule {}
