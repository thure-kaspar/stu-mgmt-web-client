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
import { AssessmentAllocationOverviewComponent } from "./assessment-allocation-overview/assessment-allocation-overview.component";
import { CreatedAssessmentsComponent } from "./created-assessments/created-assessments.component";
import { SelectedAssignmentFacade } from "./services/selected-assignment.facade";

@NgModule({
	declarations: [
		AssessmentOverviewComponent, 
		CreateAssessmentComponent, 
		AssessmentForm, 
		AssessmentTargetPickerComponent, 
		AssessmentAllocationComponent,
		AssessmentGroupPickerComponent, 
		AssessmentUserPickerComponent, 
		EditAssessmentComponent, 
		AssessmentAllocationOverviewComponent, 
		CreatedAssessmentsComponent
	],
	imports: [
		SharedModule,
		AssessmentRoutingModule
	],
	providers: [EvaluatorsFacade, SelectedAssignmentFacade]
})
export class AssessmentModule { }
