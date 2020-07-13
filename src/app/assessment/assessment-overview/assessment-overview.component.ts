import { Component, OnInit } from "@angular/core";
import { AssignmentDto } from "../../../../api";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../../utils/helper";
import { SelectedAssignmentFacade } from "../services/selected-assignment.facade";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"]
})
export class AssessmentOverviewComponent implements OnInit {

	assignment: AssignmentDto;

	constructor(private selectedAssignment: SelectedAssignmentFacade,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		const courseId = getRouteParam("courseId", this.route);
		const assignmentId = getRouteParam("assignmentId", this.route);
		this.selectedAssignment.loadAssignment(courseId, assignmentId).subscribe(
			assignment => this.assignment = assignment
		);
	}

}
