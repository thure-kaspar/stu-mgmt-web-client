import { NgModule } from "@angular/core";
import { AssessmentEditorRoutingModule } from "./assessment-editor-routing.module";
import { CreateAssessmentComponentModule } from "./create-assessment/create-assessment.component";

@NgModule({
	imports: [AssessmentEditorRoutingModule, CreateAssessmentComponentModule]
})
export class AssessmentEditorModule {}
