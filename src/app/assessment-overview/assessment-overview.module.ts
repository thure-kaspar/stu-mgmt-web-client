import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AssessmentAllocationOverviewComponent } from "./assessment-allocation-overview/assessment-allocation-overview.component";
import { AssessmentOverviewRoutingModule } from "./assessment-overview-routing.module";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";
import { CreatedAssessmentsComponent } from "./created-assessments/created-assessments.component";
import { AssessmentTargetPickerModule } from "../assessment-target-picker/assessment-target-picker.module";


@NgModule({
	declarations: [
		AssessmentOverviewComponent, 
		AssessmentAllocationOverviewComponent, 
		CreatedAssessmentsComponent
	],
	imports: [
		SharedModule,
		AssessmentOverviewRoutingModule,
		AssessmentTargetPickerModule
	],
	exports: []
})
export class AssessmentOverviewModule { }
