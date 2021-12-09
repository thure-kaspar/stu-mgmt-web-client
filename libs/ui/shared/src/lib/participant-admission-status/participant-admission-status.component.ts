import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { CourseSelectors } from "@student-mgmt-client/state";
import {
	AdmissionRuleDto,
	AdmissionStatusDto,
	RoundingBehavior,
	RuleCheckResult
} from "@student-mgmt/api-client";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ThumbChipComponentModule } from "../thumb-chip/thumb-chip.component";
import { AssignmentTypeChipComponentModule } from "../assignment-type-chip/assignment-type-chip.component";
import { CardComponentModule } from "../card/card.component";

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

@NgModule({
	declarations: [ParticipantAdmissionStatusComponent],
	exports: [ParticipantAdmissionStatusComponent],
	imports: [
		CommonModule,
		CardComponentModule,
		AssignmentTypeChipComponentModule,
		ThumbChipComponentModule,
		TranslateModule,
		MatDividerModule,
		MatProgressSpinnerModule
	]
})
export class ParticipantAdmissionStatusComponentModule {}
