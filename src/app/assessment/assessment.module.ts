import { NgModule } from "@angular/core";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { SharedModule } from "../shared/shared.module";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";
import { AssessmentForm } from "./forms/assessment-form/assessment-form.component";

@NgModule({
	declarations: [AssessmentOverviewComponent, CreateAssessmentComponent, AssessmentForm],
	imports: [
		SharedModule,
		AssessmentRoutingModule
	]
})
export class AssessmentModule { }
