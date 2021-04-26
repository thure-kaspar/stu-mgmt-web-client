import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { UsersService } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import {
	AssignmentWithAssessment,
	mapAssessmentsToAssignment
} from "../../../domain/assignment.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { AssignmentActions, AssignmentSelectors } from "../../../state/assignment";
import { CourseSelectors } from "../../../state/course";

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

	constructor(
		private userService: UsersService,
		private store: Store,
		private route: ActivatedRoute
	) {
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
				this.userService.getAssessmentsOfUserForCourse(userId, courseId)
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
