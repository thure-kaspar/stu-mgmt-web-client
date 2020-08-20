import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { PartialAssessmentDto } from "../../../../../api";

@Component({
	selector: "app-partial-assessment",
	templateUrl: "./partial-assessment.component.html",
	styleUrls: ["./partial-assessment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialAssessmentComponent implements OnInit {

	@Input("partialAssessment") partial: PartialAssessmentDto;

	severityEnum = PartialAssessmentDto.SeverityEnum;

	constructor() { }

	ngOnInit(): void {
	}

}
