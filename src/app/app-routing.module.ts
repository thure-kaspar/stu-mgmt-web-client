import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login/login.component";
import { RegisterComponent } from "./auth/components/register/register.component";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
	{ path: "login", component: LoginComponent, pathMatch: "full" },
	{ path: "register", component: RegisterComponent, pathMatch: "full" },
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
	{
		path: "courses",
		loadChildren: () => import("./course/course.module").then(m => m.CourseModule)
	},
	{ path: "", redirectTo: "/courses", pathMatch: "full" },
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
