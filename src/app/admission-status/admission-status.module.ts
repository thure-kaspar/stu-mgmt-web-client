import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";
import { AdmissionStatusComponent } from "./components/admission-status/admission-status.component";
import { AdmissionRuleComponent } from "./components/admission-rule/admission-rule.component";

@NgModule({
	declarations: [PointsOverviewComponent, AdmissionStatusComponent, AdmissionRuleComponent],
	imports: [SharedModule, AdmissionStatusRoutingModule],
	exports: [AdmissionRuleComponent]
})
export class AdmissionStatusModule {}
