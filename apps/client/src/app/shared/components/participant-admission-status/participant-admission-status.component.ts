import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AdmissionRuleDto, RoundingBehavior, RuleCheckResult } from "@student-mgmt/api-client";
import { CourseSelectors } from "../../../state/course";
import { State as ParticipantAdmissionStatusState } from "../../../state/participant/admission-status/admission-status.reducer";

@Component({
	selector: "app-participant-admission-status",
	templateUrl: "./participant-admission-status.component.html",
	styleUrls: ["./participant-admission-status.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusComponent implements OnInit {
	@Input() admissionStatus$: Observable<ParticipantAdmissionStatusState>;

	criteria$ = this.store
		.select(CourseSelectors.selectCourse)
		.pipe(map(course => course.admissionCriteria));

	noCriteriaError$ = this.criteria$.pipe(map(criteria => !(criteria?.rules?.length > 0)));

	vm$: Observable<
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
