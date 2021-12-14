import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParticipantsListComponent } from "./participants-list/participants-list.component";
import { ParticipantsOverviewComponent } from "./participants-overview/participants-overview.component";

const routes: Routes = [
	{
		path: "",
		component: ParticipantsOverviewComponent,
		children: [
			{
				path: "admission-status",
				loadChildren: () =>
					import("../admission-status/admission-status.module").then(
						m => m.AdmissionStatusModule
					)
			},
			{
				path: "compare-participants",
				loadChildren: () =>
					import(
						"../participants-list-comparison/participants-list-comparison.module"
					).then(m => m.ParticipantsListComparisonModule)
			},
			{ path: "list", component: ParticipantsListComponent },
			{ path: "", pathMatch: "full", redirectTo: "list" }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseParticipantsRoutingModule {}
