import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AssignmentDto } from "../../../../api";
import { getRouteParam } from "../../../../utils/helper";
import { AssignmentActions, AssignmentSelectors } from "../../state/assignment";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentOverviewComponent implements OnInit {
	assignment$: Observable<AssignmentDto>;

	constructor(private store: Store, private route: ActivatedRoute) {}

	ngOnInit(): void {
		const courseId = getRouteParam("courseId", this.route);
		const assignmentId = getRouteParam("assignmentId", this.route);
		this.store.dispatch(AssignmentActions.loadAssignmentById({ courseId, assignmentId }));
		this.assignment$ = this.store.select(AssignmentSelectors.selectAssignment(assignmentId));
	}
}
