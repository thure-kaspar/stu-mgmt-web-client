import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
	ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import {
	AssessmentCreateDto,
	AssessmentsService,
	AssignmentDto,
	AssignmentRegistrationService,
	AssignmentsService,
	CourseParticipantsService,
	GroupDto,
	GroupsService,
	ParticipantDto
} from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { DialogService } from "../../shared/services/dialog.service";
import { ParticipantFacade } from "../../shared/services/participant.facade";
import { ToastService } from "../../shared/services/toast.service";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";
import { AssessmentTargetPickerComponent } from "../../assessment-target-picker/assessment-target-picker/assessment-target-picker.component";

@Component({
	selector: "app-create-assessment",
	templateUrl: "./create-assessment.component.html",
	styleUrls: ["./create-assessment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAssessmentComponent extends UnsubscribeOnDestroy implements OnInit {
	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;
	@ViewChild(AssessmentTargetPickerComponent, { static: true })
	targetPicker: AssessmentTargetPickerComponent;

	selectedId: string;
	forParticipant$ = new Subject<ParticipantDto>();
	forGroup$ = new Subject<GroupDto>();

	assignment: AssignmentDto;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		public assignmentService: AssignmentsService,
		private assessmentService: AssessmentsService,
		private registrationService: AssignmentRegistrationService,
		private groupService: GroupsService,
		private participantService: CourseParticipantsService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private toast: ToastService,
		private dialog: DialogService,
		private cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.subs.sink = this.assignmentService
			.getAssignmentById(this.courseId, this.assignmentId)
			.subscribe(assignment => {
				this.assignment = assignment;
				this.cdRef.detectChanges();
			});

		this.setPreselectedGroupOrUser();
	}

	/**
	 * If the URL-fragment contains `#group` or `#user` followed by the corresponding ID,
	 * i.e. `#groupb4f24e81-dfa4-4641-af80-8e34e02d9c4a`, then this will select the specified group or user.
	 */
	private setPreselectedGroupOrUser(): void {
		const fragment = this.route.snapshot.fragment;
		const groupMatch = fragment?.match(/^group(.+)/);
		const userMatch = fragment?.match(/^user(.+)/);

		if (groupMatch) {
			// Only pass id to handler, because it will query for group data itself
			this.groupSelectedHandler({ id: groupMatch[1] } as any);
		} else if (userMatch) {
			this.participantService.getParticipant(this.courseId, userMatch[1]).subscribe(
				user => this.userSelectedHandler(user),
				error => {
					this.toast.apiError(error);
				}
			);
		}
	}

	onSave(): void {
		const assessment: AssessmentCreateDto = this.form.getModel();
		assessment.assignmentId = this.assignmentId;

		this.assessmentService
			.createAssessment(assessment, this.courseId, this.assignmentId)
			.subscribe(
				created => {
					this.form.form.reset({ achievedPoints: 0 });
					this.selectedId = undefined;
					this.forGroup$.next(undefined);
					this.forParticipant$.next(undefined);
					this.targetPicker.updateNameFilter(); // Trigger reload of targets to remove current selection
					this.toast.success("Message.Saved");
				},
				error => {
					this.toast.apiError(error);
				}
			);
	}

	/** Sets the selected group and loads its members. Removes the selected user, if it exists. */
	groupSelectedHandler(group: GroupDto): void {
		this.forParticipant$.next(undefined);

		// Set route fragment
		this.router.navigate([], { fragment: "group" + group.id });

		// Load members of the group
		this.registrationService
			.getRegisteredGroup(this.courseId, this.assignmentId, group.id)
			.subscribe(
				result => {
					this.selectedId = group.id;
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
		this.selectedId = participant.userId;
		this.forParticipant$.next(participant);

		// Set route fragment
		this.router.navigate([], { fragment: "user" + participant.userId });
	}

	/**
	 * Navigates to the edit component of the specified assessment.
	 * If the user has unsaved changes in the form, the user will be asked to confirm this action.
	 */
	switchToEdit(assessmentId: string): void {
		// Route to the assessment
		const routeCmds = [
			"courses",
			this.courseId,
			"assignments",
			this.assignmentId,
			"assessments",
			"editor",
			"edit",
			assessmentId
		];
		// If user has inserted data in the form
		if (this.form.form.dirty) {
			// Ask user, if he wants to discard his unsaved changes
			this.dialog.openUnsavedChangesDialog().subscribe(confirmed => {
				if (confirmed) {
					this.router.navigate(routeCmds);
				}
			});
		} else {
			this.router.navigate(routeCmds);
		}
	}
}
