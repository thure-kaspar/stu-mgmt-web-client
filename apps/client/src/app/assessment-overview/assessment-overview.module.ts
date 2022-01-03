import { NgModule } from "@angular/core";
import { AssessmentOverviewRoutingModule } from "./assessment-overview-routing.module";
import { AssessmentOverviewComponentModule } from "./assessment-overview/assessment-overview.component";

@NgModule({
	imports: [AssessmentOverviewRoutingModule, AssessmentOverviewComponentModule]
})
export class AssessmentOverviewModule {}
