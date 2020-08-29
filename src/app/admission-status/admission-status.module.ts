import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";
import { AdmissionStatusComponent } from "./components/admission-status/admission-status.component";

@NgModule({
	declarations: [
		PointsOverviewComponent,
		AdmissionStatusComponent
	],
	imports: [
		SharedModule,
		AdmissionStatusRoutingModule
	]
})
export class AdmissionStatusModule { }
