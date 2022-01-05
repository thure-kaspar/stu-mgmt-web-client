import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubmissionsOverviewComponent } from "./components/submissions-overview/submissions-overview.component";

// courses/:courseId/assignments/:assignmentId/submissions
const routes: Routes = [
	{
		path: "",
		component: SubmissionsOverviewComponent,
		pathMatch: "full"
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SubmissionRoutingModule {}
