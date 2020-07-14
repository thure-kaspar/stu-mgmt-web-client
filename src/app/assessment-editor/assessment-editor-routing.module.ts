import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";


const routes: Routes = [
	{ path: "create", component: CreateAssessmentComponent, pathMatch: "full" },
	{ path: ":assessmentId/edit", component: EditAssessmentComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentEditorRoutingModule { }
