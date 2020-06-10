import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssignmentListComponent } from "./components/assignment-list/assignment-list.component";

const routes: Routes = [
	{ path: ":assignmentId/assessments", loadChildren: () => import("../assessment/assessment.module").then(m => m.AssessmentModule)},
	{ path: "", component: AssignmentListComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssignmentRoutingModule { }
