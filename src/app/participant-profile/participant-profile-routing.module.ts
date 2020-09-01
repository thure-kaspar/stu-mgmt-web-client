import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParticipantProfileComponent } from "./components/participant-profile/participant-profile.component";
import { ParticipantAssessmentsComponent } from "./components/participant-assessments/participant-assessments.component";
import { ParticipantAdmissionStatusComponent } from "./components/participant-admission-status/participant-admission-status.component";

const routes: Routes = [
	{ path: "", component: ParticipantProfileComponent, children: [
		{ path: "admission-status", component: ParticipantAdmissionStatusComponent, pathMatch: "full" },
		{ path: "", component: ParticipantAssessmentsComponent, pathMatch: "full" },
		{ path: "", redirectTo: "", pathMatch: "full" }
	] }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ParticipantProfileRoutingModule { }
