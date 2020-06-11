import { Component, OnInit, ViewChild } from "@angular/core";
import { AssessmentsService, AssessmentDto, AssignmentsService, AssignmentDto } from "../../../../api";
import { ActivatedRoute } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
	selector: "app-assessment-overview",
	templateUrl: "./assessment-overview.component.html",
	styleUrls: ["./assessment-overview.component.scss"]
})
export class AssessmentOverviewComponent implements OnInit {

	assignment: AssignmentDto;
	assessments: AssessmentDto[];

	courseId: string;
	assignmentId: string;

	displayedColumns: string[] = ["view", "for", "achievedPoints", "creator"];
	dataSource: MatTableDataSource<AssessmentDto>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	stateEnum = AssignmentDto.StateEnum;

	constructor(private assignmentService: AssignmentsService,
				private assessmentService: AssessmentsService,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.loadAssignment();
		this.loadAssessments();
	}

	loadAssignment(): void {
		this.assignmentService.getAssignmentById(this.courseId, this.assignmentId).subscribe(
			result => this.assignment = result,
			error => console.log(error)
		);
	}

	loadAssessments(): void {
		this.assessmentService.getAllAssessmentsForAssignment(this.courseId, this.assignmentId).subscribe(
			result => {
				this.assessments = result;
				console.log(result);
				this.dataSource = new MatTableDataSource(this.assessments);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

}
