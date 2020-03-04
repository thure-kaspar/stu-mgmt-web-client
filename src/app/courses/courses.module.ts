import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoursesRoutingModule } from "./courses-routing.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { MaterialModule } from "../material/material.module";
import { FormsModule } from "@angular/forms";
import { SemesterPipe } from "./pipes/semester.pipe";
import { CourseComponent } from "./course/course/course.component";


@NgModule({
	declarations: [CourseListComponent, SemesterPipe, CourseComponent],
	imports: [
		CommonModule,
		CoursesRoutingModule,
		MaterialModule,
		FormsModule
	]
})
export class CoursesModule { }
