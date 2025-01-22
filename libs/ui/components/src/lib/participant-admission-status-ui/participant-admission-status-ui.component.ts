import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ThumbChipComponentModule
} from "@student-mgmt-client/shared-ui";
import {
	AdmissionRuleDto,
	AdmissionStatusDto,
	RoundingBehavior,
	RuleCheckResult
} from "@student-mgmt/api-client";

export type AdmissionCriteriaWithResult = {
	result: RuleCheckResult;
	type: AdmissionRuleDto.TypeEnum;
	assignmentType: AdmissionRuleDto.AssignmentTypeEnum;
	requiredPercent: number;
	achievedPercentRounding: RoundingBehavior;
};

@Component({
    selector: "student-mgmt-participant-admission-status-ui",
    templateUrl: "./participant-admission-status-ui.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ParticipantAdmissionStatusUiComponent {
	@Input() isLoading!: boolean;
	@Input() admissionStatus?: AdmissionStatusDto | null;
	@Input() criteriaWithResult?: AdmissionCriteriaWithResult[] | null;
	@Input() noAdmissionCriteria?: boolean | null;

	ruleTypes = AdmissionRuleDto.TypeEnum;
}

@NgModule({
	declarations: [ParticipantAdmissionStatusUiComponent],
	exports: [ParticipantAdmissionStatusUiComponent],
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
export class ParticipantAdmissionStatusUiComponentModule {}
