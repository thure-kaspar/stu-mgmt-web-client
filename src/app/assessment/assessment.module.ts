import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { EvaluatorsFacade } from "./services/evaluators.facade";
import { SelectedAssignmentFacade } from "./services/selected-assignment.facade";

@NgModule({
	declarations: [],
	imports: [
		SharedModule,
		AssessmentRoutingModule
	],
	providers: [EvaluatorsFacade, SelectedAssignmentFacade]
})
export class AssessmentModule { }
