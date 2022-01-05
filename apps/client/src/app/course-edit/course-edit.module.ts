import { NgModule } from "@angular/core";
import { CourseEditRoutingModule } from "./course-edit-routing.module";
import { CourseEditComponentModule } from "./course-edit.component";

@NgModule({
	imports: [CourseEditRoutingModule, CourseEditComponentModule]
})
export class CourseEditModule {}
