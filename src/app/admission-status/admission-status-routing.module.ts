import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PointsOverviewComponent } from "./components/points-overview/points-overview.component";

const routes: Routes = [
	{ path: "", component: PointsOverviewComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdmissionStatusRoutingModule { }
