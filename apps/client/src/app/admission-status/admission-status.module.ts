import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";
import { AdmissionStatusComponent } from "./components/admission-status/admission-status.component";
import { AdmissionRuleComponent } from "./components/admission-rule/admission-rule.component";
import { ChartsModule } from "../charts/charts.module";

@NgModule({
	declarations: [PointsOverviewComponent, AdmissionStatusComponent, AdmissionRuleComponent],
	imports: [SharedModule, AdmissionStatusRoutingModule, ChartsModule],
	exports: [AdmissionRuleComponent]
})
export class AdmissionStatusModule {}
