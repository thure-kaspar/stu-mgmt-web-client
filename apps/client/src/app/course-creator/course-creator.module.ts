import { NgModule } from "@angular/core";
import { CourseCreatorRoutingModule } from "./course-creator-routing.module";
import { CreateCourseComponentModule } from "./create-course.component";

@NgModule({
	imports: [CourseCreatorRoutingModule, CreateCourseComponentModule]
})
export class CourseCreatorModule {}
