import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../../utils/helper";
import { SelectedAssignmentFacade } from "../../assessment/services/selected-assignment.facade";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentOverviewComponent implements OnInit {

	constructor(public selectedAssignment: SelectedAssignmentFacade,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		const courseId = getRouteParam("courseId", this.route);
		const assignmentId = getRouteParam("assignmentId", this.route);
		this.selectedAssignment.loadAssignment(courseId, assignmentId);
	}

}
