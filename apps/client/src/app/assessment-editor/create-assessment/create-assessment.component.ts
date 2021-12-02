import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import {
	AssessmentCreateDto,
	AssessmentApi,
	AssignmentDto,
	AssignmentRegistrationApi,
	AssignmentApi,
	CourseParticipantsApi,
	GroupDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { SearchGroupDialog } from "../../group/dialogs/search-group/search-group.dialog";
import { SearchParticipantDialog } from "../../shared/components/dialogs/search-participant/search-participant.dialog";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { ParticipantFacade } from "../../shared/services/participant.facade";
import { ToastService } from "../../shared/services/toast.service";
import { AssignmentSelectors } from "../../state/assignment";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";

@Component({
	selector: "app-create-assessment",
	templateUrl: "./create-assessment.component.html",
	styleUrls: ["./create-assessment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAssessmentComponent extends UnsubscribeOnDestroy implements OnInit {
	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;

	forParticipant$ = new Subject<ParticipantDto>();
	forGroup$ = new Subject<GroupDto>();

	assignment$: Observable<AssignmentDto>;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		public assignmentApi: AssignmentApi,
		private assessmentApi: AssessmentApi,
		private registrationApi: AssignmentRegistrationApi,
		private participantsApi: CourseParticipantsApi,
		private route: ActivatedRoute,
		private router: Router,
		private toast: ToastService,
		private dialog: MatDialog,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.assignment$ = this.store.select(
			AssignmentSelectors.selectAssignment(this.assignmentId)
		);

		this.setPreselectedGroupOrUser();

		// TODO: Search Group dialog should use registered groups?
	}

	onSave(): void {
		const assessment: AssessmentCreateDto = this.form.getModel();
		assessment.assignmentId = this.assignmentId;

		this.assessmentApi.createAssessment(assessment, this.courseId, this.assignmentId).subscribe(
			created => {
				this.router.navigate([
					"/courses",
					this.courseId,
					"assignments",
					created.assignmentId,
					"assessments",
					"view",
					created.id
				]);
				this.toast.success("Message.Saved");
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}

	openSearchGroupDialog(): void {
		this.dialog
			.open(SearchGroupDialog, { data: this.courseId })
			.afterClosed()
			.subscribe(group => {
				if (group) {
					this.groupSelectedHandler(group);
				}
			});
	}

	openSearchParticipantDialog(): void {
		this.dialog
			.open(SearchParticipantDialog, { data: this.courseId })
			.afterClosed()
			.subscribe((participants: ParticipantDto[]) => {
				if (participants?.length > 0) {
					this.userSelectedHandler(participants[0]);
				}
			});
	}

	/**
	 * If the URL-fragment contains `#group` or `#user` followed by the corresponding ID,
	 * i.e. `#groupb4f24e81-dfa4-4641-af80-8e34e02d9c4a`, then this will select the specified group or user.
	 */
	private setPreselectedGroupOrUser(): void {
		const fragment = this.route.snapshot.fragment;
		const groupMatch = fragment?.match(/^group-(.+)/);
		const userMatch = fragment?.match(/^user-(.+)/);

		if (groupMatch) {
			// Only pass id to handler, because it will query for group data itself
			this.groupSelectedHandler({ id: groupMatch[1] } as any);
		} else if (userMatch) {
			this.participantsApi.getParticipant(this.courseId, userMatch[1]).subscribe(
				user => this.userSelectedHandler(user),
				error => {
					this.toast.apiError(error);
				}
			);
		}
	}

	/** Sets the selected group and loads its members. Removes the selected user, if it exists. */
	groupSelectedHandler(group: GroupDto): void {
		this.forParticipant$.next(undefined);

		// Set route fragment
		this.router.navigate([], { fragment: "group-" + group.id });

		// Load members of the group
		this.registrationApi
			.getRegisteredGroup(this.courseId, this.assignmentId, group.id)
			.subscribe(
				result => {
					this.forGroup$.next(result);
					this.form.patchModel({ groupId: group.id, userId: null });
				},
				error => {
					this.toast.apiError(error);
				}
			);
	}

	/** Sets the selected user and removes the selected group, it it exists. */
	userSelectedHandler(participant: ParticipantDto): void {
		this.forGroup$.next(undefined);
		this.form.patchModel({ userId: participant.userId, groupId: null });
		this.forParticipant$.next(participant);

		// Set route fragment
		this.router.navigate([], { fragment: "user-" + participant.userId });
	}
}
