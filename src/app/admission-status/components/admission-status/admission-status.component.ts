import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import {
	AdmissionCriteriaDto,
	AdmissionStatusDto,
	AdmissionStatusService,
	CourseConfigService
} from "../../../../../api";
import { getRouteParam, matchesParticipant } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { DownloadService } from "../../../shared/services/download.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	selector: "app-admission-status",
	templateUrl: "./admission-status.component.html",
	styleUrls: ["./admission-status.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionStatusComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	/** [name, matrNr, hasAdmission, rule0, rule1, rule2, ...] */
	displayedColumns = ["displayName", "matrNr", "hasAdmission"];
	criteria$ = new Subject<AdmissionCriteriaDto>();
	dataSource = new MatTableDataSource<AdmissionStatusDto>([]);
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private admissionStatus: AdmissionStatusService,
		private courseConfig: CourseConfigService,
		private downloadService: DownloadService,
		private toast: ToastService,
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef
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
					console.log(response.body);
					this.dataSource = new MatTableDataSource(response.body);
					this.dataSource.sort = this.sort;
					this.dataSource.filterPredicate = (data, filter): boolean =>
						matchesParticipant(filter, data.participant);
					this.cdRef.detectChanges();
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
