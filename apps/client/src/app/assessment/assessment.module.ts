import { NgModule } from "@angular/core";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { AssessmentHeaderComponentModule } from "./components/assessment-header/assessment-header.component";
import { AssessmentTargetComponentModule } from "./components/assessment-target/assessment-target.component";
import { MarkerComponentModule } from "./components/marker/marker.component";
import { EvaluatorsFacade } from "./services/evaluators.facade";

@NgModule({
	declarations: [],
	imports: [
		AssessmentRoutingModule,
		AssessmentHeaderComponentModule,
		AssessmentTargetComponentModule,
		MarkerComponentModule
	],
	providers: [EvaluatorsFacade],
	exports: [
		AssessmentTargetComponentModule,
		AssessmentHeaderComponentModule,
		MarkerComponentModule
	]
})
export class AssessmentModule {}
