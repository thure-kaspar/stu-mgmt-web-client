import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from "@student-mgmt-client/shared-ui";
import { MarkerDto, PartialAssessmentDto } from "@student-mgmt/api-client";
import { MarkerComponentModule } from "../../assessment/components/marker/marker.component";

@Component({
    selector: "student-mgmt-partial-assessment",
    templateUrl: "./partial-assessment.component.html",
    styleUrls: ["./partial-assessment.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PartialAssessmentComponent {
	@Input("partialAssessment") partial: PartialAssessmentDto;

	severityEnum = MarkerDto.SeverityEnum;
}

@NgModule({
	declarations: [PartialAssessmentComponent],
	exports: [PartialAssessmentComponent],
	imports: [CommonModule, TranslateModule, CardComponentModule, MarkerComponentModule]
})
export class PartialAssessmentComponentModule {}
