import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { AssessmentDto, AssessmentsService, AssignmentDto } from "../../../../api";
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
	filter: string;
	dataSource = new MatTableDataSource<AssessmentDto>([]);
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	stateEnum = AssignmentDto.StateEnum;

	constructor(
		public selectedAssignment: SelectedAssignmentFacade,
		private assessmentService: AssessmentsService,
		private downloadService: DownloadService,
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef
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
					this.dataSource.filterPredicate = (assessment, filter): boolean => {
						const _filter = filter.toLowerCase();
						return (
							assessment.group?.name.toLowerCase().includes(_filter) ||
							assessment.participant?.displayName.toLowerCase().includes(_filter) ||
							!!assessment.group?.members?.find(member =>
								member.displayName.toLowerCase().includes(_filter)
							)
						);
					};
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					this.cdRef.detectChanges();
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
