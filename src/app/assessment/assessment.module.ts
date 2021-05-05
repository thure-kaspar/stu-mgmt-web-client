import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { EvaluatorsFacade } from "./services/evaluators.facade";
import { AssessmentTargetComponent } from "./components/assessment-target/assessment-target.component";
import { AssessmentHeaderComponent } from "./components/assessment-header/assessment-header.component";
import { MarkerComponent } from "./components/marker/marker.component";

@NgModule({
	declarations: [AssessmentTargetComponent, AssessmentHeaderComponent, MarkerComponent],
	imports: [SharedModule, AssessmentRoutingModule],
	providers: [EvaluatorsFacade],
	exports: [AssessmentTargetComponent, AssessmentHeaderComponent, MarkerComponent]
})
export class AssessmentModule {}
