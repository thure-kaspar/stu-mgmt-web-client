import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { ParticipantFacade, ToastService } from "@student-mgmt-client/services";
import {
	IconComponentModule,
	SearchParticipantDialog,
	SearchParticipantDialogModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssignmentSelectors } from "@student-mgmt-client/state";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import {
	AssessmentApi,
	AssessmentCreateDto,
	AssignmentApi,
	AssignmentDto,
	AssignmentRegistrationApi,
	CourseParticipantsApi,
	GroupDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { Observable, Subject } from "rxjs";
import { AssessmentTargetComponentModule } from "../../assessment/components/assessment-target/assessment-target.component";
import {
	SearchGroupDialog,
	SearchGroupDialogModule
} from "../../group/dialogs/search-group/search-group.dialog";
import {
	AssessmentFormComponent,
	AssessmentFormComponentModule
} from "../forms/assessment-form/assessment-form.component";

@Component({
	selector: "student-mgmt-create-assessment",
	templateUrl: "./create-assessment.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAssessmentComponent extends UnsubscribeOnDestroy implements OnInit {
	@ViewChild(AssessmentFormComponent, { static: true }) form: AssessmentFormComponent;

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
		const assessment: AssessmentCreateDto = this.form.form.value;
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
	 * i.e. `#groupb-4f24e81-dfa4-4641-af80-8e34e02d9c4a`, then this will select the specified group or user.
	 */
	private setPreselectedGroupOrUser(): void {
		const fragment = this.route.snapshot.fragment;
		const groupMatch = fragment?.match(/^group-(.+)/);
		const userMatch = fragment?.match(/^user-(.+)/);

		if (groupMatch) {
			this.groupSelectedHandler({ id: groupMatch[1] });
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
	groupSelectedHandler(group: { id: string }): void {
		this.forParticipant$.next(undefined);

		// Set route fragment
		this.router.navigate([], { fragment: "group-" + group.id });

		// Load members of the group
		this.registrationApi
			.getRegisteredGroup(this.courseId, this.assignmentId, group.id)
			.subscribe(
				result => {
					this.forGroup$.next(result);
					this.form.form.patchValue({ groupId: group.id, userId: null });
				},
				error => {
					this.toast.apiError(error);
				}
			);
	}

	/** Sets the selected user and removes the selected group, it it exists. */
	userSelectedHandler(participant: ParticipantDto): void {
		this.forGroup$.next(undefined);
		this.form.form.patchValue({ userId: participant.userId, groupId: null });
		this.forParticipant$.next(participant);

		// Set route fragment
		this.router.navigate([], { fragment: "user-" + participant.userId });
	}
}

@NgModule({
	declarations: [CreateAssessmentComponent],
	exports: [CreateAssessmentComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		TranslateModule,
		AssessmentFormComponentModule,
		AssessmentTargetComponentModule,
		IconComponentModule,
		TitleComponentModule,
		SearchGroupDialogModule,
		SearchParticipantDialogModule
	]
})
export class CreateAssessmentComponentModule {}
