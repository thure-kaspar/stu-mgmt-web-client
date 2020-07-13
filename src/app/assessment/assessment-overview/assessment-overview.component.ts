import { Component, OnInit } from "@angular/core";
import { AssessmentsService, AssignmentsService, AssignmentDto } from "../../../../api";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"]
})
export class AssessmentOverviewComponent implements OnInit {

	assignment: AssignmentDto;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(private assignmentService: AssignmentsService,
				private assessmentService: AssessmentsService,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.loadAssignment();
	}

	loadAssignment(): void {
		this.assignmentService.getAssignmentById(this.courseId, this.assignmentId).subscribe(
			result => this.assignment = result,
			error => console.log(error)
		);
	}

}
