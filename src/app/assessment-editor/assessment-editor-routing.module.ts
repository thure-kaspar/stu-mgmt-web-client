import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";

// courses/:courseId/assignments/:assignmentId/assessments/editor/
const routes: Routes = [
	{ path: "create", component: CreateAssessmentComponent, pathMatch: "full" },
	{ path: "edit/:assessmentId", component: EditAssessmentComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentEditorRoutingModule { }
