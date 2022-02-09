import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AuthService } from "@student-mgmt-client/auth";
import { ToastService } from "@student-mgmt-client/services";
import { AssignmentSelectors } from "@student-mgmt-client/state";
import {
	AssessmentCreateDto,
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
		private participants: CourseParticipantsApi,
		private fb: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly toast: ToastService,
		private readonly store: Store,
		private readonly http: HttpClient,
		private readonly dialog: MatDialog
	) {}

	async ngOnInit(): Promise<void> {
		await this.loadEntities("groups");
	}

	async loadEntities(kind: "groups" | "students"): Promise<void> {
		this.isLoading$.next(true);

		let entities: GroupDto[] | ParticipantDto[];

		if (kind === "groups") {
			entities = await firstValueFrom(
				this.registrations.getRegisteredGroups(this.courseId, this.assignmentId)
			);
		} else if (kind === "students") {
			entities = await firstValueFrom(
				this.participants.getUsersOfCourse(this.courseId, undefined, undefined, ["STUDENT"])
			);
		} else {
			throw new Error("'kind' must be 'groups' or 'students'");
		}

		this.fillFormArray(entities);

		this.isLoading$.next(false);
	}

	fillFormArray(entities: GroupDto[] | ParticipantDto[]): void {
		this.form.clear();

		for (const entity of entities) {
			this.form.push(
				this.fb.group({
					entity: [entity],
					achievedPoints: [],
					comment: []
				})
			);
		}
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
					this.http.post(
						`http://localhost:3000/courses/${this.courseId}/assignments/${this.assignmentId}/assessments/bulk`,
						assessments,
						{
							headers: {
								Authorization: `Bearer ${AuthService.getAccessToken()}`
							}
						}
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
