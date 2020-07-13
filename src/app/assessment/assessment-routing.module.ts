import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";
import { AssessmentAllocationOverviewComponent } from "./assessment-allocation-overview/assessment-allocation-overview.component";
import { CreatedAssessmentsComponent } from "./created-assessments/created-assessments.component";

const routes: Routes = [
	{ path: "create", component: CreateAssessmentComponent, pathMatch: "full" },
	{ path: ":assessmentId/edit", component: EditAssessmentComponent, pathMatch: "full" },
	{ path: "", component: AssessmentOverviewComponent, children: [
		{ path: "allocations", component: AssessmentAllocationOverviewComponent, pathMatch: "full" },
		{ path: "created", component: CreatedAssessmentsComponent },
		{ path: "**", redirectTo: "created" } ] 
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentRoutingModule { }
							