import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ParticipantsListComparisonRoutingModule } from "./participants-list-comparison-routing.module";
import { ParticipantsListComparisonComponent } from "./participants-list-comparison/participants-list-comparison.component";

@NgModule({
	declarations: [ParticipantsListComparisonComponent],
	imports: [SharedModule, ParticipantsListComparisonRoutingModule]
})
export class ParticipantsListComparisonModule {}
