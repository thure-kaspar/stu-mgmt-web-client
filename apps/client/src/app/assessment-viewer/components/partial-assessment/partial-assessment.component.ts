import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { MarkerDto, PartialAssessmentDto } from "@student-mgmt/api-client";

@Component({
	selector: "app-partial-assessment",
	templateUrl: "./partial-assessment.component.html",
	styleUrls: ["./partial-assessment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialAssessmentComponent implements OnInit {
	@Input("partialAssessment") partial: PartialAssessmentDto;

	severityEnum = MarkerDto.SeverityEnum;

	constructor() {}

	ngOnInit(): void {}
}
