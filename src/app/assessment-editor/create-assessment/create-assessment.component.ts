import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import {
	AssessmentCreateDto,
	AssessmentsService,
	AssignmentDto,
	AssignmentRegistrationService,
	AssignmentsService,
	CourseParticipantsService,
	GroupDto,
	ParticipantDto
} from "../../../../api";
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

	selectedId: string;
	forParticipant$ = new Subject<ParticipantDto>();
	forGroup$ = new Subject<GroupDto>();

	assignment$: Observable<AssignmentDto>;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		public assignmentService: AssignmentsService,
		private assessmentService: AssessmentsService,
		private registrationService: AssignmentRegistrationService,
		private participantService: CourseParticipantsService,
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

		// TODO: Search Group dialog should use registered groups?
	}

	onSave(): void {
		const assessment: AssessmentCreateDto = this.form.getModel();
		assessment.assignmentId = this.assignmentId;

		this.assessmentService
			.createAssessment(assessment, this.courseId, this.assignmentId)
			.subscribe(
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
					this.forGroup$.next(group);
					this.forParticipant$.next(null);
				}
			});
	}

	openSearchParticipantDialog(): void {
		this.dialog
			.open(SearchParticipantDialog, { data: this.courseId })
			.afterClosed()
			.subscribe(p => {
				if (p?.length > 0) {
					this.forParticipant$.next(p[0]);
					this.forGroup$.next(null);
				}
			});
	}
}
