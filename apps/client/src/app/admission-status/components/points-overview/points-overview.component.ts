import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DownloadService, ToastService } from "@student-mgmt-client/services";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { getRouteParam, matchesParticipant } from "@student-mgmt-client/util-helper";
import { AdmissionStatusApi, ParticipantDto, PointsOverviewDto } from "@student-mgmt/api-client";
import { Subject } from "rxjs";

@Component({
	selector: "student-mgmt-points-overview",
	templateUrl: "./points-overview.component.html",
	styleUrls: ["./points-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsOverviewComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	overview$ = new Subject<PointsOverviewDto>();
	dataSource = new MatTableDataSource<any>([]);
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns = [];

	constructor(
		private admissionStatusApi: AdmissionStatusApi,
		private downloadService: DownloadService,
		private route: ActivatedRoute,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadPointsOverview(this.courseId);
	}

	loadPointsOverview(courseId: string): void {
		this.subs.sink = this.admissionStatusApi.getPointsOverview(courseId).subscribe({
			next: overview => {
				this.displayedColumns = [
					"displayName",
					"matrNr",
					"total",
					...overview.assignments.map(a => a.id),
					"spacer"
				];

				const data = this.createTableData(overview);

				const dataSource = new MatTableDataSource(data);
				dataSource.sort = this.sort;
				dataSource.filterPredicate = ({ student }, filter): boolean =>
					matchesParticipant(filter.toLowerCase(), student);

				this.dataSource = dataSource;
				this.overview$.next(overview);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	private createTableData(
		overview: PointsOverviewDto
	): { student: ParticipantDto; total: number }[] {
		return overview.results.map(result => {
			const studentResult = { student: result.student, total: 0 };
			overview.assignments.forEach((assignment, index) => {
				studentResult[assignment.id] = {
					achievedPoints: result.achievedPoints[index],
					achievedPointsPercent: (result.achievedPoints[index] / assignment.points) * 100,
					assessmentId: result.assessmentIds[index]
				};
				studentResult.total += result.achievedPoints[index];
			});
			return studentResult;
		});
	}

	exportToExcel(): void {
		this.downloadService.downloadFromApi(
			`export/${this.courseId}/points-overview`,
			`${this.courseId}-points-overview.xlsx`
		);
	}
}

@NgModule({
	declarations: [PointsOverviewComponent],
	exports: [PointsOverviewComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatButtonModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule
	]
})
export class PointsOverviewComponentModule {}
