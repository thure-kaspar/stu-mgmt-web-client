import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import {
	PointsOverviewTableProps,
	PointsOverviewTableUiComponentModule
} from "@student-mgmt-client/components";
import { DownloadService, ToastService } from "@student-mgmt-client/services";
import { TitleComponentModule } from "@student-mgmt-client/shared-ui";
import { getRouteParam, UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { AdmissionStatusApi } from "@student-mgmt/api-client";
import { Subject } from "rxjs";

@Component({
    selector: "student-mgmt-points-overview",
    templateUrl: "./points-overview.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PointsOverviewComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	props$ = new Subject<PointsOverviewTableProps>();

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
			next: pointsOverview => {
				this.props$.next({ courseId, pointsOverview });
			},
			error: error => {
				this.toast.apiError(error);
			}
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
		MatButtonModule,
		TranslateModule,
		TitleComponentModule,
		PointsOverviewTableUiComponentModule
	]
})
export class PointsOverviewComponentModule {}
