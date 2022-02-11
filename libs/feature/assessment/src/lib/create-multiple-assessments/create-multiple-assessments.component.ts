import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ToastService } from "@student-mgmt-client/services";
import { AssignmentSelectors } from "@student-mgmt-client/state";
import {
	AssessmentApi,
	AssessmentCreateDto,
	AssessmentDto,
	AssessmentUpdateDto,
	AssignmentRegistrationApi,
	CourseParticipantsApi,
	GroupDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { BehaviorSubject, firstValueFrom } from "rxjs";

type AssessmentState = "updated" | "new" | "unchanged" | "isIncludedInOtherAssessment" | null;

@Component({
	selector: "student-mgmt-create-multiple-assessments",
	templateUrl: "./create-multiple-assessments.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMultipleAssessmentsComponent implements OnInit {
	courseId = this.route.snapshot.params["courseId"];
	assignmentId = this.route.snapshot.params["assignmentId"];
	assignment$ = this.store.select(AssignmentSelectors.selectAssignment(this.assignmentId));

	isLoading$ = new BehaviorSubject<boolean>(true);

	form = this.fb.array([]);

	private currentTab: "groups" | "students" = "groups";

	@ViewChild("confirmDialogContent") confirmTemplate!: TemplateRef<unknown>;

	constructor(
		private registrations: AssignmentRegistrationApi,
		private readonly assessmentApi: AssessmentApi,
		private participants: CourseParticipantsApi,
		private fb: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly toast: ToastService,
		private readonly store: Store,
		private readonly dialog: MatDialog
	) {}

	async ngOnInit(): Promise<void> {
		await this.loadEntities("groups");
	}

	async loadEntities(kind: "groups" | "students"): Promise<void> {
		this.isLoading$.next(true);

		let entitiesPromise: Promise<GroupDto[] | ParticipantDto[]>;

		if (kind === "groups") {
			entitiesPromise = firstValueFrom(
				this.registrations.getRegisteredGroups(this.courseId, this.assignmentId)
			);
		} else if (kind === "students") {
			entitiesPromise = firstValueFrom(
				this.participants.getUsersOfCourse(this.courseId, undefined, undefined, ["STUDENT"])
			);
		} else {
			throw new Error("'kind' must be 'groups' or 'students'");
		}

		const [entities, assessments] = await Promise.all([
			entitiesPromise,
			firstValueFrom(
				this.assessmentApi.getAssessmentsForAssignment(this.courseId, this.assignmentId)
			)
		]);

		this.fillFormArray(entities, assessments);

		this.isLoading$.next(false);
	}

	fillFormArray(entities: GroupDto[] | ParticipantDto[], assessments: AssessmentDto[]): void {
		this.form.clear();

		const { byGroupId, byUserId } = this.matchAssessmentToIds(assessments);

		for (const entity of entities) {
			let assessment: AssessmentDto | undefined = undefined;
			let state: AssessmentState = null;
			let isIncludedInOtherAssessment = false;

			if ((entity as ParticipantDto).userId) {
				assessment = byUserId.get((entity as ParticipantDto).userId);

				if (assessment?.groupId) {
					isIncludedInOtherAssessment = true;
				}
			} else {
				assessment = byGroupId.get((entity as GroupDto).id);

				for (const member of (entity as GroupDto).members ?? []) {
					const otherAssessment = byUserId.get(member.userId);

					if (otherAssessment && otherAssessment.id !== assessment?.id) {
						isIncludedInOtherAssessment = true;
					}
				}
			}

			if (assessment && !isIncludedInOtherAssessment) {
				state = "unchanged";
			} else if (isIncludedInOtherAssessment) {
				state = "isIncludedInOtherAssessment";
			}

			this.form.push(
				this.fb.group({
					entity: [entity],
					achievedPoints: [assessment?.achievedPoints],
					comment: [assessment?.comment],
					assessment: [assessment],
					state: [state]
				})
			);
		}
	}

	private matchAssessmentToIds(assessments: AssessmentDto[]) {
		const byGroupId = new Map<string, AssessmentDto>();
		const byUserId = new Map<string, AssessmentDto>();

		for (const assessment of assessments) {
			// Group assessment
			if (assessment.groupId) {
				byGroupId.set(assessment.groupId, assessment);
				assessment.group?.members?.forEach(member =>
					byUserId.set(member.userId, assessment)
				);
			}

			// Single user assessment
			if (assessment.userId) {
				byUserId.set(assessment.userId, assessment);
			}
		}

		return { byGroupId, byUserId };
	}

	async selectedTabChanged(tabIndex: number): Promise<void> {
		if (tabIndex === 0) {
			this.currentTab = "groups";
			await this.loadEntities("groups");
		}

		if (tabIndex === 1) {
			this.currentTab = "students";
			await this.loadEntities("students");
		}
	}

	markAsChanged(index: number): void {
		let state: AssessmentState;
		const control = this.form.at(index);

		// Do no change state, if creation would fail due to conflict
		if ((control.value.state as AssessmentState) === "isIncludedInOtherAssessment") {
			return;
		}

		const { achievedPoints, comment } = control.value;
		const assessment = control.value.assessment;

		const hasPoints = typeof achievedPoints === "number";
		const hasPointsBefore = typeof assessment?.achievedPoints === "number";
		const hasComment = typeof comment === "string";
		const hasCommentBefore = typeof assessment?.comment === "string";

		// no assessment: has points or comment -> new , else undefined
		// assessment: points before and changed -> updated, comment changed -> updated; unchanged

		state = assessment ? "unchanged" : null;

		if (!hasPointsBefore && hasPoints) {
			state = assessment ? "updated" : "new";
		} else if (hasPointsBefore && assessment.achievedPoints !== achievedPoints) {
			state = assessment ? "updated" : "new";
		} else if (!hasCommentBefore && hasComment && comment.length > 0) {
			state = assessment ? "updated" : "new";
		} else if (hasCommentBefore && assessment.comment !== comment) {
			state = assessment ? "updated" : "new";
		}

		control.patchValue({ state });
	}

	async onSave(tab: "groups" | "students"): Promise<void> {
		const formValue = this.form.value as {
			entity: { id: string } & { userId: string };
			achievedPoints?: number;
			comment?: string;
			state: AssessmentState;
			assessment: AssessmentDto;
		}[];

		const newAssessments = formValue.filter(value => value.state === "new");
		const updatedAssessments = formValue.filter(value => value.state === "updated");

		const assessmentsToCreate: AssessmentCreateDto[] = newAssessments.map(value => ({
			assignmentId: this.assignmentId,
			isDraft: false,
			achievedPoints: value.achievedPoints,
			comment: value.comment?.length && value.comment.length > 0 ? value.comment : undefined,
			groupId: tab === "groups" ? value.entity.id : undefined,
			userId: tab === "students" ? value.entity.userId : undefined
		}));

		const assessmentsToUpdate: (AssessmentUpdateDto & { assessmentId: string })[] =
			updatedAssessments.map(value => ({
				assessmentId: value.assessment.id,
				achievedPoints: value.achievedPoints,
				comment: value.comment,
				isDraft: false,
				partialAssessments: []
			}));

		const confirmed = await firstValueFrom(
			this.dialog
				.open(this.confirmTemplate, {
					data: {
						newCount: assessmentsToCreate.length,
						updatedCount: assessmentsToUpdate.length
					}
				})
				.afterClosed()
		);

		if (confirmed) {
			if (assessmentsToCreate.length > 0) {
				await this.createAssessments(assessmentsToCreate);
			}
			if (assessmentsToUpdate.length > 0) {
				await this.updateAssessments(assessmentsToUpdate);
			}

			this.loadEntities(this.currentTab);
		}
	}

	private async updateAssessments(
		assessmentsToUpdate: (AssessmentUpdateDto & { assessmentId: string })[]
	) {
		for (const updatedAssessment of assessmentsToUpdate) {
			try {
				await firstValueFrom(
					this.assessmentApi.updateAssessment(
						updatedAssessment,
						this.courseId,
						this.assignmentId,
						updatedAssessment.assessmentId
					)
				);
			} catch (error) {
				if (error instanceof HttpErrorResponse) {
					this.toast.apiError(error);
				}
			}
		}

		this.toast.success(assessmentsToUpdate.length + " Bewertungen aktualisiert.");
	}

	private async createAssessments(assessmentsToCreate: AssessmentCreateDto[]) {
		try {
			await firstValueFrom(
				this.assessmentApi.createAssessments(
					assessmentsToCreate,
					this.courseId,
					this.assignmentId
				)
			);
			this.toast.success(assessmentsToCreate.length + " neue Bewertungen erstellt.");
		} catch (error) {
			if (error instanceof HttpErrorResponse) {
				if (error.status === 409) {
					this.toast.error("Error.ParticipantAlreadyHasAssessment");
				} else {
					this.toast.apiError(error);
				}
			}
		}
	}
}
