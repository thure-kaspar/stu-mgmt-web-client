import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseListComponent } from "./course-list.component";

const routes: Routes = [{ path: "", component: CourseListComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseListRoutingModule {}
