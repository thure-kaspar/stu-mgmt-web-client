import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { SubmissionsOverviewComponent } from "./components/submissions-overview/submissions-overview.component";
import { SubmissionRoutingModule } from "./submission-routing.module";

@NgModule({
	declarations: [SubmissionsOverviewComponent],
	imports: [SharedModule, SubmissionRoutingModule]
})
export class SubmissionModule {}
