import { NgModule } from "@angular/core";
import { ParticipantsListComparisonRoutingModule } from "./participants-list-comparison-routing.module";
import { ParticipantsListComparisonComponentModule } from "./participants-list-comparison.component";

@NgModule({
	imports: [ParticipantsListComparisonRoutingModule, ParticipantsListComparisonComponentModule]
})
export class ParticipantsListComparisonModule {}
