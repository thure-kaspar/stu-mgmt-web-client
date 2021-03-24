import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SubmissionDto, SubmissionService } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { Paginator } from "../../../shared/paginator/paginator.component";

@Component({
	selector: "app-submissions-overview",
	templateUrl: "./submissions-overview.component.html",
	styleUrls: ["./submissions-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionsOverviewComponent implements OnInit {
	courseId: string;
	assignmentId: string;
	dataSource = new MatTableDataSource<SubmissionDto>([]);
	displayedColumns = ["date", "displayName", "groupName"];
	filter = {
		displayName: undefined,
		groupName: undefined
	};

	filterChanged$ = new Subject();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(private submissionService: SubmissionService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
		this.loadSubmissions(this.courseId, this.assignmentId);

		this.filterChanged$
			.pipe(debounceTime(300))
			.subscribe(() => this.loadSubmissions(this.courseId, this.assignmentId));
	}

	loadSubmissions(courseId: string, assignmentId: string): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		const displayName =
			this.filter.displayName?.length > 0 ? this.filter.displayName : undefined;
		const groupName = this.filter.groupName?.length > 0 ? this.filter.groupName : undefined;

		this.submissionService
			.getAllSubmissions(
				courseId,
				skip,
				take,
				undefined,
				assignmentId,
				undefined,
				displayName,
				groupName,
				"response"
			)
			.subscribe(response => {
				this.dataSource.data = response.body;
				this.paginator.setTotalCountFromHttp(response);
			});
	}
}
