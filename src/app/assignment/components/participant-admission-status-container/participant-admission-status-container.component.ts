import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AdmissionRuleDto } from "../../../../../api";
import { CourseSelectors } from "../../../state/course";
import { ParticipantSelectors } from "../../../state/participant";

@Component({
	selector: "app-participant-admission-status-container",
	templateUrl: "./participant-admission-status-container.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusContainerComponent implements OnInit {
	admissionStatus$ = this.store.select(
		ParticipantSelectors.selectParticipantAdmissionStatusState
	);

	criteria$ = this.store
		.select(CourseSelectors.selectCourse)
		.pipe(map(course => course.admissionCriteria));

	vm$ = combineLatest([this.admissionStatus$, this.criteria$]).pipe(
		filter(([status, criteria]) => !!status.admissionStatus && !!criteria),
		map(([status, criteria]) =>
			criteria.rules.map((rule, index) => ({
				...rule,
				result: status.admissionStatus.results[index]
			}))
		)
	);

	ruleTypes = AdmissionRuleDto.TypeEnum;

	constructor(private store: Store) {}

	ngOnInit(): void {}
}
