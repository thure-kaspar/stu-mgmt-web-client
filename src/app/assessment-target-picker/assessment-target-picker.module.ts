import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AssessmentAllocationComponent } from "./assessment-allocation/assessment-allocation.component";
import { AssessmentGroupPickerComponent } from "./assessment-group-picker/assessment-group-picker.component";
import { AssessmentTargetPickerComponent } from "./assessment-target-picker/assessment-target-picker.component";
import { AssessmentUserPickerComponent } from "./assessment-user-picker/assessment-user-picker.component";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [
		AssessmentTargetPickerComponent,
		AssessmentAllocationComponent,
		AssessmentGroupPickerComponent,
		AssessmentUserPickerComponent
	],
	imports: [SharedModule, RouterModule],
	exports: [
		AssessmentTargetPickerComponent,
		AssessmentAllocationComponent,
		AssessmentGroupPickerComponent,
		AssessmentUserPickerComponent
	]
})
export class AssessmentTargetPickerModule {}
