import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// courses/:courseId/assignments/:assignmentId/assessments/
const routes: Routes = [
	{ path: "view/:assessmentId", loadChildren: () => import("../assessment-viewer/assessment-viewer.module").then(m => m.AssessmentViewerModule) },
	{ path: "editor", loadChildren: () => import("../assessment-editor/assessment-editor.module").then(m => m.AssessmentEditorModule) },
	{ path: "overview", loadChildren: () => import("../assessment-overview/assessment-overview.module").then(m => m.AssessmentOverviewModule) },
	{ path: "", redirectTo: "overview", pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentRoutingModule { }
							