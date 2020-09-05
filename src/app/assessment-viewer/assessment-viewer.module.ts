import { NgModule } from "@angular/core";
import { AssessmentViewerRoutingModule } from "./assessment-viewer-routing.module";
import { SharedModule } from "../shared/shared.module";
import { AssessmentViewerComponent } from "./components/assessment-viewer/assessment-viewer.component";
import { PartialAssessmentComponent } from "./components/partial-assessment/partial-assessment.component";
import { AssessmentModule } from "../assessment/assessment.module";

@NgModule({
	declarations: [AssessmentViewerComponent, PartialAssessmentComponent],
	imports: [
		SharedModule,
		AssessmentViewerRoutingModule,
		AssessmentModule
	]
})
export class AssessmentViewerModule { }
