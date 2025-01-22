import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentTypeChipComponentModule } from "@student-mgmt-client/shared-ui";
import { AdmissionRuleDto } from "@student-mgmt/api-client";

@Component({
    selector: "student-mgmt-admission-rule-ui",
    templateUrl: "./admission-rule-ui.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AdmissionRuleUiComponent {
	@Input() rule!: AdmissionRuleDto;
	@Input() index!: number;

	ruleTypes = AdmissionRuleDto.TypeEnum;
}

@NgModule({
	imports: [CommonModule, TranslateModule, AssignmentTypeChipComponentModule],
	declarations: [AdmissionRuleUiComponent],
	exports: [AdmissionRuleUiComponent]
})
export class AdmissionRuleUiComponentModule {}
