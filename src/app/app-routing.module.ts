import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";

const routes: Routes = [
	{ path: "login", component: LoginComponent, pathMatch: "full" },
	{ path: "register", component: RegisterComponent, pathMatch: "full" },
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
	{ path: "courses", loadChildren: () => import("./courses/courses.module").then(m => m.CoursesModule) },
	{ path: "groups", loadChildren: () => import("./group/group.module").then(m => m.GroupModule) },
	{ path: "assignments", loadChildren: () => import("./assignment/assignment.module").then(m => m.AssignmentModule) }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
