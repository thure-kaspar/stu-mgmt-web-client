import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { EvaluatorsFacade } from "./services/evaluators.facade";
import { AssessmentTargetComponent } from "./components/assessment-target/assessment-target.component";

@NgModule({
	declarations: [AssessmentTargetComponent],
	imports: [SharedModule, AssessmentRoutingModule],
	providers: [EvaluatorsFacade],
	exports: [AssessmentTargetComponent]
})
export class AssessmentModule {}
