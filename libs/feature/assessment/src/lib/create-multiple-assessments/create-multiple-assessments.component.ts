import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { AssignmentSelectors } from "@student-mgmt-client/state";
import {
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

	constructor(
		private registrations: AssignmentRegistrationApi,
		private participants: CourseParticipantsApi,
		private fb: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly store: Store
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

		console.log(this.form);

		this.isLoading$.next(false);
	}

	fillFormArray(entities: GroupDto[] | ParticipantDto[]): void {
		this.form.clear();

		for (const entity of entities) {
			this.form.push(
				this.fb.group({
					entity: [entity],
					achievedPoints: [0, Validators.required]
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

	async onCreate(): Promise<void> {
		// TODO
	}
}
