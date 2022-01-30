import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateMultipleAssessmentsComponent } from "./create-multiple-assessments.component";

const routes: Routes = [
	{ path: "", component: CreateMultipleAssessmentsComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CreateMultipleAssessmentRoutingModule {}
