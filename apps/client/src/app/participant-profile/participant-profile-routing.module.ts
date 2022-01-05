import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ParticipantAssessmentsComponent } from "./components/participant-assessments/participant-assessments.component";
import { ParticipantProfileComponent } from "./components/participant-profile/participant-profile.component";

const routes: Routes = [
	{
		path: "",
		component: ParticipantProfileComponent,
		children: [
			{ path: "", component: ParticipantAssessmentsComponent, pathMatch: "full" },
			{ path: "", redirectTo: "", pathMatch: "full" }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ParticipantProfileRoutingModule {}
