import { NgModule } from "@angular/core";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { AdmissionRuleComponentModule } from "./components/admission-rule/admission-rule.component";
import { AdmissionStatusComponentModule } from "./components/admission-status/admission-status.component";

@NgModule({
	declarations: [],
	imports: [AdmissionStatusRoutingModule, AdmissionStatusComponentModule],
	exports: [AdmissionRuleComponentModule]
})
export class AdmissionStatusModule {}
