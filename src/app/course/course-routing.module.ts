import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseListComponent } from "./components/course-list/course-list.component";
import { CourseComponent } from "./components/course/course.component";
import { CreateCourseComponent } from "./create-course/create-course.component";

const routes: Routes = [
	{ path: ":semester/:name", component: CourseComponent, pathMatch: "full" },
	{ path: "create", component: CreateCourseComponent, pathMatch: "full" },
	{ path: "", component: CourseListComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseRoutingModule { }
