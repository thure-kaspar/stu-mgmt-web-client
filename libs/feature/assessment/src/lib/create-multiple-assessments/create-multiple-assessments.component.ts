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
	AssignmentRegistrationApi,
	CourseParticipantsApi,
	GroupDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { BehaviorSubject, firstValueFrom } from "rxjs";

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

			if ((entity as ParticipantDto).userId) {
				assessment = byUserId.get((entity as ParticipantDto).userId);
			} else {
				assessment = byGroupId.get((entity as GroupDto).id);
			}

			this.form.push(
				this.fb.group({
					entity: [entity],
					achievedPoints: [assessment?.achievedPoints],
					comment: [assessment?.comment],
					assessment: [assessment]
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
			await this.loadEntities("groups");
		}

		if (tabIndex === 1) {
			await this.loadEntities("students");
		}
	}

	async onCreate(tab: "groups" | "students"): Promise<void> {
		const formValue = this.form.value as {
			entity: { id: string } & { userId: string };
			achievedPoints?: number;
			comment?: string;
		}[];

		const assessmentWithPoints = formValue.filter(
			value => typeof value.achievedPoints === "number"
		);

		const assessments: AssessmentCreateDto[] = assessmentWithPoints.map(value => ({
			assignmentId: this.assignmentId,
			isDraft: false,
			achievedPoints: value.achievedPoints,
			comment: value.comment?.length && value.comment.length > 0 ? value.comment : undefined,
			groupId: tab === "groups" ? value.entity.id : undefined,
			userId: tab === "students" ? value.entity.userId : undefined
		}));

		const confirmed = await firstValueFrom(
			this.dialog.open(this.confirmTemplate, { data: assessments }).afterClosed()
		);

		if (confirmed) {
			try {
				await firstValueFrom(
					this.assessmentApi.createAssessments(
						assessments,
						this.courseId,
						this.assignmentId
					)
				);
				this.toast.success();
				this.router.navigate([
					"/courses",
					this.courseId,
					"assignments",
					this.assignmentId,
					"assessments"
				]);
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
}
