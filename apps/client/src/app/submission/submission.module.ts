import { NgModule } from "@angular/core";
import { SubmissionsOverviewComponentModule } from "./components/submissions-overview/submissions-overview.component";
import { SubmissionRoutingModule } from "./submission-routing.module";

@NgModule({
	imports: [SubmissionRoutingModule, SubmissionsOverviewComponentModule]
})
export class SubmissionModule {}
