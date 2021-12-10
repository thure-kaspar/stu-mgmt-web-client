import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
	{ path: "", component: HomeComponent, pathMatch: "full" },
	{
		path: "login",
		pathMatch: "full",
		loadChildren: () => import("@student-mgmt-client/auth").then(m => m.AuthModule)
	},
	{
		path: "courses",
		pathMatch: "full",
		loadChildren: () =>
			import("@student-mgmt-client/course-list").then(m => m.CourseListComponentModule)
	},
	{
		path: "new-course",
		pathMatch: "full",
		loadChildren: () =>
			import("./course-creator/course-creator.module").then(m => m.CourseCreatorModule)
	},
	{
		path: "courses",
		loadChildren: () => import("./course/course.module").then(m => m.CourseModule)
	},
	{
		path: "user/settings",
		loadChildren: () =>
			import("./user-settings/user-settings.module").then(m => m.UserSettingsModule)
	},
	{
		path: "admin/user-management",
		loadChildren: () =>
			import("./user-management/user-management.module").then(m => m.UserManagementModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: "always" })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
