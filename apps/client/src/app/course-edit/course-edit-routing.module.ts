import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseEditComponent } from "./course-edit.component";

const routes: Routes = [{ path: "", component: CourseEditComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseEditRoutingModule {}
