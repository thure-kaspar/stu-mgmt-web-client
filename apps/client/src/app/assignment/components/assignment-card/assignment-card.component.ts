import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
	AssignmentCardUiComponentModule,
	AssignmentCardUiComponentProps
} from "@student-mgmt-client/components";
import { Course, Participant } from "@student-mgmt-client/domain-types";
import { ToastService } from "@student-mgmt-client/services";
import { ConfirmDialog, ConfirmDialogData } from "@student-mgmt-client/shared-ui";
import { ParticipantGroupsState, ParticipantSelectors } from "@student-mgmt-client/state";
import {
	getRouteParam,
	RoundingMethod,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	AssessmentDto,
	AssignmentDto,
	GroupDto,
	UserApi
} from "@student-mgmt/api-client";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import {
	EditAssignmentDialog,
	EditAssignmentDialogData
} from "../../dialogs/edit-assignment/edit-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

type AssessmentDtoExtended = AssessmentDto & {
	roundedPoints?: number;
	hasPassed?: boolean;
};

type AssessmentState = "passed" | "failed" | "submitted" | null;

@Component({
	selector: "student-mgmt-assignment-card",
	templateUrl: "./assignment-card.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardComponent extends UnsubscribeOnDestroy implements OnInit {
	@Input() assignment: AssignmentDto;
	@Input() course: Course;
	@Input() participant: Participant;

	/** If the course has defined admission criteria for this type of assignment,
	 * this will contain the required points for this assignment.
	 */
	requiredPoints$ = new BehaviorSubject<number | undefined>(undefined);
	/**
	 * Can be used to display a warning about this assignment, i.e. "You have no group for this assignment."
	 * Will be translated in the template.
	 */
	displayNoGroupWarning$ = new BehaviorSubject(false);
	courseId: string;
	group$: Observable<GroupDto>;
	assessment$: Observable<AssessmentDtoExtended>;
	passFailSubmittedState$: Observable<AssessmentState>;

	props$: Observable<AssignmentCardUiComponentProps>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private assignmentManagement: AssignmentManagementFacade,
		private userApi: UserApi,
		private toast: ToastService,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);

		if (this.participant.isStudent) {
			this.tryFindGroupOfParticipant();
		}

		this.tryFindRequiredPoints(this.course.admissionCriteria);

		this.props$ = combineLatest([
			this.requiredPoints$,
			this.displayNoGroupWarning$,
			this.assessment$,
			this.passFailSubmittedState$
		]).pipe(
			map(
				([
					requiredPoints,
					displayNoGroupWarning,
					assessment,
					passFailSubmittedState
				]): AssignmentCardUiComponentProps => ({
					assignment: this.assignment,
					courseId: this.course.id,
					participant: this.participant,
					requiredPoints,
					displayNoGroupWarning,
					assessment,
					passFailSubmittedState
				})
			)
		);
	}

	private tryFindGroupOfParticipant(): void {
		this.group$ = this.store.select(ParticipantSelectors.selectParticipantGroupsState).pipe(
			tap(state => {
				if (this.studentHasNoGroup(state)) {
					if (
						this.assignment.state === "IN_PROGRESS" &&
						this.studentShouldHaveAGroup(this.assignment, this.participant)
					) {
						this.displayNoGroupWarning$.next(true);
						this.toast.warning("Text.Group.NoGroupForAssignment", this.assignment.name);
					}
				}
			}),
			map(state => state.data?.[this.assignment.id])
		);
	}

	private tryFindRequiredPoints(admissionCriteria: AdmissionCriteriaDto): void {
		const rule = admissionCriteria?.rules.find(
			r =>
				r.type === "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES" &&
				r.assignmentType === this.assignment.type
		);

		if (rule) {
			const requiredPoints = (this.assignment.points * rule.requiredPercent) / 100;
			this.requiredPoints$.next(requiredPoints);

			if (this.participant.isStudent) {
				const round = RoundingMethod(
					rule.achievedPercentRounding.type,
					rule.achievedPercentRounding.decimals
				);

				this.assessment$ = this.store
					.select(ParticipantSelectors.selectAssessmentByAssignmentId(this.assignment.id))
					.pipe(
						map(assessment => {
							if (assessment?.achievedPoints) {
								const roundedPoints = round(assessment.achievedPoints);
								return {
									...assessment,
									roundedPoints,
									hasPassed: roundedPoints >= requiredPoints
								};
							}

							return null;
						})
					);

				this.passFailSubmittedState$ = this.assessment$.pipe(
					filter(assessment => !!assessment),
					map(assessment => (assessment.hasPassed ? "passed" : "failed"))
				);
			}
		}
	}

	private studentHasNoGroup(state: ParticipantGroupsState): boolean {
		return state.hasLoaded && !state.data?.[this.assignment.id];
	}

	private studentShouldHaveAGroup(assignment: AssignmentDto, participant: Participant): boolean {
		return (
			assignment.collaboration === AssignmentDto.CollaborationEnum.GROUP &&
			participant.isStudent
		);
	}

	openEditDialog(): void {
		const data: EditAssignmentDialogData = {
			courseId: this.courseId,
			assignmentId: this.assignment.id
		};
		this.dialog.open(EditAssignmentDialog, { data });
	}

	onDelete(): void {
		const data: ConfirmDialogData = { title: "Action.Delete", params: [this.assignment.name] };
		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.subs.sink = this.assignmentManagement
						.remove(this.assignment, this.courseId)
						.subscribe(() => {
							this.toast.success(this.assignment.name, "Message.Removed");
						});
				}
			});
	}

	/**
	 * Navigates the user to his assessment for this assignment.
	 */
	goToAssessment(): void {
		this.subs.sink = this.userApi
			.getAssessmentOfUser(this.participant.userId, this.courseId, this.assignment.id)
			.subscribe({
				next: assessment => {
					this.router.navigate([
						"/courses",
						this.courseId,
						"assignments",
						this.assignment.id,
						"assessments",
						"view",
						assessment.id
					]);
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}
}

@NgModule({
	declarations: [AssignmentCardComponent],
	exports: [AssignmentCardComponent],
	imports: [CommonModule, AssignmentCardUiComponentModule]
})
export class AssignmentCardComponentModule {}
