import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// courses/:courseId/assignments/:assignmentId/assessments/
const routes: Routes = [
	{
		path: "view/:assessmentId",
		loadChildren: () =>
			import("../assessment-viewer/assessment-viewer.module").then(
				m => m.AssessmentViewerModule
			)
	},
	{
		path: "",
		loadChildren: () =>
			import("../assessment-overview/assessment-overview.module").then(
				m => m.AssessmentOverviewModule
			)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentRoutingModule {}
