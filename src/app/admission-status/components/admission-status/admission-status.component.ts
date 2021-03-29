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
import { Store } from "@ngrx/store";
import { filter, map, tap } from "rxjs/operators";
import { AdmissionStatusDto, AdmissionStatusService } from "../../../../../api";
import { getRouteParam, matchesParticipant } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { DownloadService } from "../../../shared/services/download.service";
import { ToastService } from "../../../shared/services/toast.service";
import { CourseSelectors } from "../../../state/course";

@Component({
	selector: "app-admission-status",
	templateUrl: "./admission-status.component.html",
	styleUrls: ["./admission-status.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionStatusComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	displayedColumns = [
		"displayName",
		"matrNr",
		"hasAdmission",
		"fulfillsAdmissionCriteria",
		"hasAdmissionFromPreviousSemester"
	];
	criteria$ = this.store.select(CourseSelectors.selectCourse).pipe(
		filter(course => !!course),
		map(course => course.admissionCriteria),
		tap(criteria => {
			this.displayedColumns = [
				...this.displayedColumns,
				...criteria.rules.map((rule, index) => "rule" + index)
			];
		})
	);
	dataSource = new MatTableDataSource<AdmissionStatusDto>([]);
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private admissionStatus: AdmissionStatusService,
		private downloadService: DownloadService,
		private toast: ToastService,
		private route: ActivatedRoute,
		private store: Store,
		private cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadAdmissionStatus();
	}

	private loadAdmissionStatus(): void {
		this.subs.sink = this.admissionStatus
			.getAdmissionStatusOfParticipants(this.courseId, "response")
			.subscribe({
				next: response => {
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
