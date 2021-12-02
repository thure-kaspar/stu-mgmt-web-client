import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCourseComponent } from "./components/edit-course/edit-course.component";

const routes: Routes = [{ path: "", component: EditCourseComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseSettingsRoutingModule {}
