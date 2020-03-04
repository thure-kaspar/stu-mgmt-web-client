import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
	{ path: "courses", loadChildren: () => import("./courses/courses.module").then(m => m.CoursesModule) }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
