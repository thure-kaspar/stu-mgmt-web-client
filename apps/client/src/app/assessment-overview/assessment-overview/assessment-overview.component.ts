import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AssignmentDto } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { AssignmentActions, AssignmentSelectors } from "@student-mgmt-client/state";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentOverviewComponent implements OnInit {
	assignment$: Observable<AssignmentDto>;
	courseId: string;

	constructor(private store: Store, public route: ActivatedRoute) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		const assignmentId = getRouteParam("assignmentId", this.route);
		this.store.dispatch(
			AssignmentActions.loadAssignmentById({ courseId: this.courseId, assignmentId })
		);
		this.assignment$ = this.store.select(AssignmentSelectors.selectAssignment(assignmentId));
	}
}
