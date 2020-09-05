import { NgModule } from "@angular/core";
import { AssessmentEditorRoutingModule } from "./assessment-editor-routing.module";
import { CreateAssessmentComponent } from "./create-assessment/create-assessment.component";
import { AssessmentForm } from "./forms/assessment-form/assessment-form.component";
import { EditAssessmentComponent } from "./edit-assessment/edit-assessment.component";
import { SharedModule } from "../shared/shared.module";
import { AssessmentTargetPickerModule } from "../assessment-target-picker/assessment-target-picker.module";
import { AssessmentModule } from "../assessment/assessment.module";

@NgModule({
	declarations: [
		CreateAssessmentComponent, 
		AssessmentForm, 
		EditAssessmentComponent,
	],
	imports: [
		SharedModule,
		AssessmentModule,
		AssessmentEditorRoutingModule,
		AssessmentTargetPickerModule
	]
})
export class AssessmentEditorModule { }
