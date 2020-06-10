import { NgModule } from "@angular/core";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { SharedModule } from "../shared/shared.module";
import { AssessmentOverviewComponent } from "./assessment-overview/assessment-overview.component";


@NgModule({
	declarations: [AssessmentOverviewComponent],
	imports: [
		SharedModule,
		AssessmentRoutingModule
	]
})
export class AssessmentModule { }
