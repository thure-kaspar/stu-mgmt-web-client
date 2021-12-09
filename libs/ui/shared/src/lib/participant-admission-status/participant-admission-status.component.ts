import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import {
	AdmissionRuleDto,
	AdmissionStatusDto,
	RoundingBehavior,
	RuleCheckResult
} from "@student-mgmt/api-client";
import { CourseSelectors } from "@student-mgmt-client/state";

@Component({
	selector: "app-participant-admission-status",
	templateUrl: "./participant-admission-status.component.html",
	styleUrls: ["./participant-admission-status.component.scss"],
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

	vm$!: Observable<
		{
			result: RuleCheckResult;
			type: AdmissionRuleDto.TypeEnum;
			assignmentType: AdmissionRuleDto.AssignmentTypeEnum;
			requiredPercent: number;
			achievedPercentRounding: RoundingBehavior;
		}[]
	>;

	ruleTypes = AdmissionRuleDto.TypeEnum;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.vm$ = combineLatest([this.admissionStatus$, this.criteria$]).pipe(
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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ThumbChipComponentModule
} from "../..";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [ParticipantAdmissionStatusComponent],
	exports: [ParticipantAdmissionStatusComponent],
	imports: [
		CommonModule,
		CardComponentModule,
		AssignmentTypeChipComponentModule,
		TranslateModule,
		ThumbChipComponentModule,
		MatDividerModule,
		MatProgressSpinnerModule
	]
})
export class ParticipantAdmissionStatusComponentModule {}
