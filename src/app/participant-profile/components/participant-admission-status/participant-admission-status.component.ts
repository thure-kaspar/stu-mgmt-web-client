import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import {
	AdmissionCriteriaDto,
	AdmissionStatusDto,
	AdmissionStatusService,
	CourseConfigService,
	RuleCheckResult
} from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	selector: "app-participant-admission-status",
	templateUrl: "./participant-admission-status.component.html",
	styleUrls: ["./participant-admission-status.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusComponent extends UnsubscribeOnDestroy implements OnInit {
	admissionCriteria$ = new BehaviorSubject<AdmissionCriteriaDto>(undefined);

	status: AdmissionStatusDto;
	results: RuleCheckResult[];

	userId: string;
	courseId: string;

	constructor(
		private admissionStatusService: AdmissionStatusService,
		private courseConfigService: CourseConfigService,
		private route: ActivatedRoute,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.userId = getRouteParam("userId", this.route);
		this.courseId = getRouteParam("courseId", this.route);

		this.loadAdmissionCriteria();
		this.loadAdmissionStatus();
	}

	private loadAdmissionStatus(): void {
		this.subs.sink = this.admissionStatusService
			.getAdmissionStatusOfParticipant(this.courseId, this.userId)
			.subscribe({
				next: result => {
					this.status = result;
					this.results = result.results;
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	// TODO: Handle courses with no defined criteria ... for now we assume it exists
	private loadAdmissionCriteria(): void {
		this.subs.sink = this.courseConfigService.getAdmissionCriteria(this.courseId).subscribe({
			next: result => {
				this.admissionCriteria$.next(result);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}
}
