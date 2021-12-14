import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import {
	AssignmentWithAssessment,
	mapAssessmentsToAssignment
} from "@student-mgmt-client/domain-types";
import {
	AssignmentTypeChipComponentModule,
	ThumbChipComponentModule,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/shared-ui";
import {
	AssignmentActions,
	AssignmentSelectors,
	CourseSelectors
} from "@student-mgmt-client/state";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { UserApi } from "@student-mgmt/api-client";
import { combineLatest, Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";

@Component({
	selector: "app-participant-assessments",
	templateUrl: "./participant-assessments.component.html",
	styleUrls: ["./participant-assessments.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAssessmentsComponent extends UnsubscribeOnDestroy implements OnInit {
	assignmentsWithAssessments$: Observable<AssignmentWithAssessment[]>;

	userId: string;
	courseId: string;

	constructor(private userApi: UserApi, private store: Store, private route: ActivatedRoute) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(
			AssignmentActions.loadAssignments({ courseId: getRouteParam("courseId", this.route) })
		);

		this.subs.sink = this.route.params.subscribe(({ courseId, userId }) => {
			this.userId = userId;
			this.courseId = courseId;
		});

		const assessments$ = this.route.params.pipe(
			switchMap(({ courseId, userId }) =>
				this.userApi.getAssessmentsOfUserForCourse(userId, courseId)
			)
		);

		this.assignmentsWithAssessments$ = combineLatest([
			assessments$,
			this.store.select(AssignmentSelectors.selectAssignments),
			this.store.select(CourseSelectors.selectCourse)
		]).pipe(
			filter(
				([assessments, assignments, course]) => !!assessments && !!assignments && !!course
			),
			map(([assessments, assignments, course]) =>
				mapAssessmentsToAssignment(assessments, assignments, course.admissionCriteria)
			)
		);
	}
}

@NgModule({
	declarations: [ParticipantAssessmentsComponent],
	exports: [ParticipantAssessmentsComponent],
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		AssignmentTypeChipComponentModule,
		ThumbChipComponentModule
	]
})
export class ParticipantAssessmentsComponentModule {}
