import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subject, BehaviorSubject } from "rxjs";
import { AdmissionCriteriaDto, AdmissionStatusDto, AdmissionStatusService, CourseConfigService } from "../../../../../api";
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

	dataSource$ = new BehaviorSubject(new MatTableDataSource<AdmissionStatusDto>([]));
	admissionCriteria$ = new BehaviorSubject<AdmissionCriteriaDto>(undefined);

	displayedColumns = ["hasAdmission"];

	userId: string;
	courseId: string;

	constructor(
		private admissionStatusService: AdmissionStatusService,
		private courseConfigService: CourseConfigService,
		private route: ActivatedRoute,
		private toast: ToastService,
	) { super(); }

	ngOnInit(): void {
		this.userId = getRouteParam("userId", this.route);
		this.courseId = getRouteParam("courseId", this.route);

		this.loadAdmissionCriteria();
		this.loadAdmissionStatus();
	}

	
	private loadAdmissionStatus(): void {
		this.subs.sink = this.admissionStatusService.getAdmissionStatusOfParticipant(this.courseId, this.userId).subscribe({
			next: (result) => {
				this.dataSource$.next(new MatTableDataSource([result]));
			},
			error: (error) => {
				this.toast.apiError(error);
			}
		});
	}
	
	// TODO: Handle courses with no defined criteria ... for now we assume it exists
	private loadAdmissionCriteria(): void {
		this.subs.sink = this.courseConfigService.getAdmissionCriteria(this.courseId).subscribe({
			next: (result) => {
				this.displayedColumns = [...this.displayedColumns, ...result.rules.map((rule, index) => "rule" + index), "spacer"];
				this.admissionCriteria$.next(result);
			},
			error: (error) => {
				this.toast.apiError(error);
			}
		});
	}

}
