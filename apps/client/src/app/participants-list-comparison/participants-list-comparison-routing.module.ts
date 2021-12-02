import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParticipantsListComparisonComponent } from "./participants-list-comparison/participants-list-comparison.component";

const routes: Routes = [{ path: "", component: ParticipantsListComparisonComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ParticipantsListComparisonRoutingModule {}
