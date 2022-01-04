import { NgModule } from "@angular/core";
import { AssessmentOverviewRoutingModule } from "./assessment-overview-routing.module";
import { AssessmentOverviewComponentModule } from "./assessment-overview/assessment-overview.component";
import { RegisteredGroupsComponentModule } from "./registered-groups/registered-groups.component";

@NgModule({
	imports: [
		AssessmentOverviewRoutingModule,
		AssessmentOverviewComponentModule,
		RegisteredGroupsComponentModule
	]
})
export class AssessmentOverviewModule {}
