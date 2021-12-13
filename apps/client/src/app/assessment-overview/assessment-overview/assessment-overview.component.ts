import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentActions, AssignmentSelectors } from "@student-mgmt-client/state";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { AssignmentDto } from "@student-mgmt/api-client";
import { Observable } from "rxjs";

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

@NgModule({
	declarations: [AssessmentOverviewComponent],
	exports: [AssessmentOverviewComponent],
	imports: [CommonModule, RouterModule, MatTabsModule, TranslateModule]
})
export class AssessmentOverviewComponentModule {}
