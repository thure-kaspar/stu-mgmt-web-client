import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from "@student-mgmt-client/shared-ui";
import { MarkerDto, PartialAssessmentDto } from "@student-mgmt/api-client";
import { MarkerComponentModule } from "../../assessment/components/marker/marker.component";

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

@NgModule({
	declarations: [PartialAssessmentComponent],
	exports: [PartialAssessmentComponent],
	imports: [CommonModule, TranslateModule, CardComponentModule, MarkerComponentModule]
})
export class PartialAssessmentComponentModule {}
