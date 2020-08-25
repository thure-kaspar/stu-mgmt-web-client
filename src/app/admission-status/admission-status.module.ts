import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";

@NgModule({
	declarations: [
		PointsOverviewComponent
	],
	imports: [
		SharedModule,
		AdmissionStatusRoutingModule
	]
})
export class AdmissionStatusModule { }
