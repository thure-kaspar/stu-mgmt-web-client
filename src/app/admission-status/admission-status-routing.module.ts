import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";
import { AdmissionStatusComponent } from "./components/admission-status/admission-status.component";

const routes: Routes = [
	{ path: "", component: AdmissionStatusComponent, pathMatch: "full" },
	{ path: "points", component: PointsOverviewComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdmissionStatusRoutingModule { }
