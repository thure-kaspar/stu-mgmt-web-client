import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";

const routes: Routes = [
	{ path: "", component: AssessmentOverviewComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentRoutingModule { }
							