import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseListComponent } from "@student-mgmt-client/course-list";
import { CourseComponent } from "./components/course/course.component";
import { TeachingStaffGuard } from "../shared/guards/teaching-staff.guard";
import { AuthGuard } from "../shared/guards/auth.guard";

const routes: Routes = [
	{
		path: "create",
		loadChildren: () =>
			import("../course-creator/course-creator.module").then(m => m.CourseCreatorModule),
		pathMatch: "full"
	},
	{
		path: ":courseId",
		component: CourseComponent,
		canActivate: [AuthGuard],
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
				pathMatch: "full",
				canActivate: [TeachingStaffGuard]
			},
			{
				path: "about",
				loadChildren: () =>
					import("../course-about/course-about.module").then(m => m.CourseAboutModule)
			},
			{ path: "", pathMatch: "full", redirectTo: "assignments" }
		]
	},
	{ path: "", component: CourseListComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseRoutingModule {}
