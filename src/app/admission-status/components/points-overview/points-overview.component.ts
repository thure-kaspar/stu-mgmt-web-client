import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { AdmissionStatusService, ParticipantDto, PointsOverviewDto } from "../../../../../api";
import { getRouteParam, matchesParticipant } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { DownloadService } from "../../../shared/services/download.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	selector: "app-points-overview",
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
		private admissionStatusService: AdmissionStatusService,
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
		this.subs.sink = this.admissionStatusService.getPointsOverview(courseId).subscribe({
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
