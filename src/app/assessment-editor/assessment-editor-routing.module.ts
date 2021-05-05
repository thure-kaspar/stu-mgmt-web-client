import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";

// courses/:courseId/assignments/:assignmentId/assessments/edit/
const routes: Routes = [
	{ path: "new", component: CreateAssessmentComponent, pathMatch: "full" },
	{ path: ":assessmentId", component: EditAssessmentComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentEditorRoutingModule {}
