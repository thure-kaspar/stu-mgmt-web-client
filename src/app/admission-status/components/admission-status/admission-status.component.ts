import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import {
	AdmissionCriteriaDto,
	AdmissionStatusDto,
	AdmissionStatusService,
	CourseConfigService
} from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ToastService } from "../../../shared/services/toast.service";
import { DownloadService } from "../../../shared/services/download.service";

@Component({
	selector: "app-admission-status",
	templateUrl: "./admission-status.component.html",
	styleUrls: ["./admission-status.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionStatusComponent extends UnsubscribeOnDestroy implements OnInit {
	criteria$ = new Subject<AdmissionCriteriaDto>();
	dataSource$ = new BehaviorSubject(new MatTableDataSource<AdmissionStatusDto>([]));
	/** [name, hasAdmission, rule0, rule1, rule2, ...] */
	displayedColumns = ["displayName", "hasAdmission"];

	courseId: string;

	constructor(
		private admissionStatus: AdmissionStatusService,
		private courseConfig: CourseConfigService,
		private downloadService: DownloadService,
		private toast: ToastService,
		private route: ActivatedRoute
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);

		this.loadAdmissionCriteria();
		this.loadAdmissionStatus();
	}

	private loadAdmissionCriteria(): void {
		this.subs.sink = this.courseConfig.getAdmissionCriteria(this.courseId).subscribe({
			next: result => {
				this.displayedColumns = [
					...this.displayedColumns,
					...result.rules.map((rule, index) => "rule" + index),
					"spacer"
				];
				this.criteria$.next(result);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	private loadAdmissionStatus(): void {
		this.subs.sink = this.admissionStatus
			.getAdmissionStatusOfParticipants(this.courseId, "response")
			.subscribe({
				next: response => {
					this.dataSource$.next(new MatTableDataSource(response.body));
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	downloadCsv(): void {
		this.downloadService.downloadFromApi(
			`csv/courses/${this.courseId}/admission-status`,
			`${this.courseId}-admission-status.tsv`
		);
	}
}
