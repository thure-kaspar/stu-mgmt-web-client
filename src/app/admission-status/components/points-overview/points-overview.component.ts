import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, BehaviorSubject } from "rxjs";
import { AdmissionStatusService, PointsOverviewDto, AssessmentsService, CsvService } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { MatTableDataSource } from "@angular/material/table";
import { ToastService } from "../../../shared/services/toast.service";
import { DownloadService } from "../../../shared/services/download.service";

@Component({
	selector: "app-points-overview",
	templateUrl: "./points-overview.component.html",
	styleUrls: ["./points-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsOverviewComponent extends UnsubscribeOnDestroy implements OnInit {

	overview$ = new Subject<PointsOverviewDto>();
	dataSource$ = new BehaviorSubject(new MatTableDataSource<any>([]));
	displayedColumns = ["username"];

	courseId: string;

	constructor(private admissionStatusService: AdmissionStatusService,
				private assessmentService: AssessmentsService,
				private downloadService: DownloadService,
				private route: ActivatedRoute,
				private router: Router,
				private toast: ToastService) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadPointsOverview(this.courseId);
	}

	private loadPointsOverview(courseId: string): void {
		this.subs.sink = this.admissionStatusService.getPointsOverview(courseId).subscribe({
			next: (overview) => {
				console.log("Overview:", overview);
				this.displayedColumns = ["username", "total", ...overview.assignments.map(a => a.id), "spacer"];

				const data = overview.results.map(result => {
					const studentResult = { student: result.student, total: 0 };
					overview.assignments.forEach((assignment, index) => {
						studentResult[assignment.id] = result.achievedPoints[index];
						studentResult.total += result.achievedPoints[index];
					});
					return studentResult;
				});

				this.dataSource$.next(new MatTableDataSource(data));
				this.overview$.next(overview);
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	goToAssessment(assignmentId: string, userId: string): void {
		this.subs.sink = this.assessmentService.getAssessmentsForAssignment(
			this.courseId, assignmentId, 
			undefined, undefined, undefined, undefined, 
			userId
		).subscribe(assessments => {
			if (assessments.length == 1) {
				this.router.navigate(["/courses", this.courseId, "assignments", assignmentId, "assessments", "view", assessments[0].id]);
			} else {
				this.toast.error("Failed to find the assessment.", "Not found");
			}
		});
	}

	downloadCsv(): void {
		this.downloadService.downloadFromApi(`csv/courses/${this.courseId}/admission-status/overview`, `${this.courseId}-assessments.csv`);
	}

}
