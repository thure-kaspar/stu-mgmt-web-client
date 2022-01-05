import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
	AdmissionCriteriaWithResult,
	ParticipantAdmissionStatusUiComponentModule
} from "@student-mgmt-client/components";
import { CourseSelectors } from "@student-mgmt-client/state";
import { AdmissionStatusDto } from "@student-mgmt/api-client";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

@Component({
	selector: "student-mgmt-participant-admission-status",
	templateUrl: "./participant-admission-status.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusComponent implements OnInit {
	@Input() admissionStatus$!: Observable<{
		admissionStatus: AdmissionStatusDto;
		isLoading: boolean;
	}>;

	criteria$ = this.store
		.select(CourseSelectors.selectCourse)
		.pipe(map(course => course!.admissionCriteria));

	noCriteriaError$ = this.criteria$.pipe(map(criteria => !(criteria?.rules?.length > 0)));

	criteriaWithResult$!: Observable<AdmissionCriteriaWithResult[]>;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.criteriaWithResult$ = combineLatest([this.admissionStatus$, this.criteria$]).pipe(
			filter(([status, criteria]) => !!status.admissionStatus && !!criteria),
			map(([status, criteria]) =>
				criteria.rules.map((rule, index) => ({
					...rule,
					result: status.admissionStatus.results[index]
				}))
			)
		);
	}
}

@NgModule({
	declarations: [ParticipantAdmissionStatusComponent],
	exports: [ParticipantAdmissionStatusComponent],
	imports: [CommonModule, ParticipantAdmissionStatusUiComponentModule]
})
export class ParticipantAdmissionStatusComponentModule {}
