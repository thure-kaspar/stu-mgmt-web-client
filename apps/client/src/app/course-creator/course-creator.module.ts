import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CreateCourseComponent } from "./components/create-course/create-course.component";
import { CourseCreatorRoutingModule } from "./course-creator-routing.module";
import { CourseSettingsModule } from "../course-settings/course-settings.module";

@NgModule({
	declarations: [CreateCourseComponent],
	imports: [SharedModule, CourseCreatorRoutingModule, CourseSettingsModule]
})
export class CourseCreatorModule {}
