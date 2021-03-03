import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateCourseComponent } from "./components/create-course/create-course.component";

const routes: Routes = [{ path: "", component: CreateCourseComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseCreatorRoutingModule {}
