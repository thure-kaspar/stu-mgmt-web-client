import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { ParticipantsOverviewComponent } from "./participants-overview/participants-overview.component";
import { ParticipantProfileComponent } from "./participant-profile/participant-profile.component";

const routes: Routes = [
	{ path: ":userId/profile", component: ParticipantProfileComponent },
	{ path: "", component: ParticipantsOverviewComponent, children: [
		{ path: "admission-status", loadChildren: () => import("../admission-status/admission-status.module").then(m => m.AdmissionStatusModule) },
		{ path: "compare-participants", loadChildren: () => import("../participants-list-comparison/participants-list-comparison.module").then(m => m.ParticipantsListComparisonModule) },
		{ path: "list", component: UserListComponent },
		{ path: "**", redirectTo: "list" }
	] }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseParticipantsRoutingModule { }
