import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login/login.component";
import { HomeComponent } from "./home/home.component";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
	{ path: "", component: HomeComponent, pathMatch: "full" },
	{ path: "login", component: LoginComponent, pathMatch: "full" },
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
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
