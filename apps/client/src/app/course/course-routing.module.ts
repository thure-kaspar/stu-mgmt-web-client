import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseComponent } from "./components/course/course.component";

const routes: Routes = [
	{
		path: ":courseId",
		component: CourseComponent,
		children: [
			{
				path: "assignments",
				loadChildren: () =>
					import("../assignment/assignment.module").then(m => m.AssignmentModule)
			},
			{
				path: "groups",
				loadChildren: () => import("../group/group.module").then(m => m.GroupModule)
			},
			{
				path: "users",
				loadChildren: () =>
					import("../course-participants/course-participants.module").then(
						m => m.CourseParticipantsModule
					)
			},
			{
				path: "users/:userId",
				loadChildren: () =>
					import("../participant-profile/participant-profile.module").then(
						m => m.ParticipantProfileModule
					)
			},
			{
				path: "settings",
				loadChildren: () =>
					import("../course-settings/course-settings.module").then(
						m => m.CourseSettingsModule
					),
				pathMatch: "full"
			},
			{
				path: "about",
				loadChildren: () =>
					import("../course-about/course-about.module").then(m => m.CourseAboutModule)
			},
			{ path: "", pathMatch: "full", redirectTo: "assignments" }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseRoutingModule {}
