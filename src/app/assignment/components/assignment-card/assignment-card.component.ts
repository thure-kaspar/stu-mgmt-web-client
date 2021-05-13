import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, pipe } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import {
	AdmissionCriteriaDto,
	AssessmentDto,
	AssignmentDto,
	GroupDto,
	UsersService
} from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { RoundingMethod } from "../../../../../utils/math";
import { Course } from "../../../domain/course.model";
import { Participant } from "../../../domain/participant.model";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ToastService } from "../../../shared/services/toast.service";
import { ParticipantSelectors } from "../../../state/participant";
import { State } from "../../../state/participant/groups/groups.reducer";
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
	selector: "app-assignment-card",
	templateUrl: "./assignment-card.component.html",
	styleUrls: ["./assignment-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardComponent extends UnsubscribeOnDestroy implements OnInit {
	@Input() assignment: AssignmentDto;
	@Input() course: Course;
	@Input() participant: Participant;

	/** If the course has defined admission criteria for this type of assignment,
	 * this will contain the required points for this assignment.
	 */
	requiredPoints: number | undefined;
	/**
	 * Can be used to display a warning about this assignment, i.e. "You have no group for this assignment."
	 * Will be translated in the template.
	 */
	warning?: string | undefined;
	courseId: string;
	group$: Observable<GroupDto>;
	assessment$: Observable<AssessmentDtoExtended>;
	assessmentState$: Observable<AssessmentState>;

	typeEnum = AssignmentDto.TypeEnum;
	stateEnum = AssignmentDto.StateEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private assignmentManagement: AssignmentManagementFacade,
		private userService: UsersService,
		private translate: TranslateService,
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
	}

	private tryFindGroupOfParticipant(): void {
		this.group$ = this.store.select(ParticipantSelectors.selectParticipantGroupsState).pipe(
			tap(state => {
				if (this.studentHasNoGroup(state)) {
					if (
						this.assignment.state === "IN_PROGRESS" &&
						this.studentShouldHaveAGroup(this.assignment, this.participant)
					) {
						this.warning = this.translate.instant("Text.Group.NoGroupForAssignment");
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
			this.requiredPoints = (this.assignment.points * rule.requiredPercent) / 100;

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
									hasPassed: roundedPoints > this.requiredPoints
								};
							}

							return null;
						})
					);

				this.assessmentState$ = this.assessment$.pipe(
					filter(assessment => !!assessment),
					map(assessment => (assessment.hasPassed ? "passed" : "failed"))
				);
			}
		}
	}

	private studentHasNoGroup(state: State): boolean {
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
		this.subs.sink = this.userService
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
