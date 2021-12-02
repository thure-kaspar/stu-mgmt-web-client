import { NgModule } from "@angular/core";

import { CourseAboutRoutingModule } from "./course-about-routing.module";
import { AboutComponent } from "./components/about/about.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
	declarations: [AboutComponent],
	imports: [SharedModule, CourseAboutRoutingModule]
})
export class CourseAboutModule {}
