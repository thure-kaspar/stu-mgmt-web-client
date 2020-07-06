import { NgModule } from "@angular/core";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { SharedModule } from "../shared/shared.module";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";
import { AssessmentForm } from "./forms/assessment-form/assessment-form.component";
import { AssessmentTargetPickerComponent } from "./assessment-target-picker/assessment-target-picker.component";
import { AssessmentAllocationComponent } from "./assessment-allocation/assessment-allocation.component";
import { AssessmentGroupPickerComponent } from "./assessment-group-picker/assessment-group-picker.component";
import { AssessmentUserPickerComponent } from "./assessment-user-picker/assessment-user-picker.component";
import { EvaluatorsFacade } from "./services/evaluators.facade";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";

@NgModule({
	declarations: [
		AssessmentOverviewComponent, 
		CreateAssessmentComponent, 
		AssessmentForm, 
		AssessmentTargetPickerComponent, 
		AssessmentAllocationComponent,
		AssessmentGroupPickerComponent, 
		AssessmentUserPickerComponent, 
		EditAssessmentComponent
	],
	imports: [
		SharedModule,
		AssessmentRoutingModule
	],
	providers: [EvaluatorsFacade]
})
export class AssessmentModule { }
