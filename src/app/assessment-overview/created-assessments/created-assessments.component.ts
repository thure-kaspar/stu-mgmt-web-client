import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import {
	AssessmentDto,
	AssignmentDto,
	AssignmentsService,
	AssessmentsService
} from "../../../../api";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { SelectedAssignmentFacade } from "../../assessment/services/selected-assignment.facade";
import { DownloadService } from "../../shared/services/download.service";

@Component({
	selector: "app-created-assessments",
	templateUrl: "./created-assessments.component.html",
	styleUrls: ["./created-assessments.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatedAssessmentsComponent implements OnInit {
	assignment: AssignmentDto;
	assessments: AssessmentDto[];

	courseId: string;
	assignmentId: string;

	displayedColumns: string[] = [
		"view",
		"for",
		"achievedPoints",
		"creator",
		"creationDate",
		"lastUpdatedBy",
		"updateDate"
	];
	dataSource: MatTableDataSource<AssessmentDto>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	stateEnum = AssignmentDto.StateEnum;

	constructor(
		public selectedAssignment: SelectedAssignmentFacade,
		private assignmentService: AssignmentsService,
		private assessmentService: AssessmentsService,
		private downloadService: DownloadService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.loadAssessments();
		this.selectedAssignment.selectedAssignment$.subscribe(
			assignment => (this.assignment = assignment)
		);
	}

	loadAssessments(): void {
		this.assessmentService
			.getAssessmentsForAssignment(this.courseId, this.assignmentId)
			.subscribe(
				result => {
					this.assessments = result;
					this.dataSource = new MatTableDataSource(this.assessments);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				},
				error => console.log(error)
			);
	}

	download(): void {
		this.downloadService.downloadFromApi(
			`csv/courses/${this.courseId}/assignments/${this.assignmentId}/assessments`,
			`${this.courseId}-${this.assignmentId}-assessments.tsv`
		);
	}
}
