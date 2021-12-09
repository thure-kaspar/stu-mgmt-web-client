import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../../../../libs/util/auth/src/lib/components/login/login.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
	{ path: "", component: HomeComponent, pathMatch: "full" },
	{ path: "login", component: LoginComponent, pathMatch: "full" },
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
