import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { LoginComponent } from "./auth/components/login/login.component";
import { RegisterComponent } from "./auth/components/register/register.component";

const routes: Routes = [
	{ path: "login", component: LoginComponent, pathMatch: "full" },
	{ path: "register", component: RegisterComponent, pathMatch: "full" },
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
	{ path: "courses", loadChildren: () => import("./course/course.module").then(m => m.CourseModule) },
	{ path: "" , redirectTo: "/courses", pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: "always" })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
