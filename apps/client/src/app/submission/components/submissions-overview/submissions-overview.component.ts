import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Paginator, PaginatorModule } from "@student-mgmt-client/shared-ui";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { SubmissionApi, SubmissionDto } from "@student-mgmt/api-client";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: "student-mgmt-submissions-overview",
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

	filterChanged$ = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(private submissionApi: SubmissionApi, private route: ActivatedRoute) {}

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

		this.submissionApi
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

@NgModule({
	declarations: [SubmissionsOverviewComponent],
	exports: [SubmissionsOverviewComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		TranslateModule,
		PaginatorModule
	]
})
export class SubmissionsOverviewComponentModule {}
