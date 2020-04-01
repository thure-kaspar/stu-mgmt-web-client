import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CoursesRoutingModule } from "./courses-routing.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SemesterPipe } from "./pipes/semester.pipe";
import { CourseComponent } from "./course/course/course.component";
import { AssignmentListComponent } from "./course/assignment-list/assignment-list.component";
import { GroupListComponent } from "./course/group-list/group-list.component";
import { UserListComponent } from "./course/user-list/user-list.component";
import { CreateAssignmentDialog } from "./course/dialogs/create-assignment/create-assignment.dialog";
import { CreateGroupDialog } from "./course/dialogs/create-group/create-group.dialog";
import { MatNativeDateModule } from "@angular/material/core";
import { ChangeRoleDialog } from "./course/dialogs/change-role/change-role.dialog";
import { CreateCourseComponent } from "./create-course/create-course.component";

@NgModule({
	declarations: [
		CourseListComponent, 
		SemesterPipe, 
		CourseComponent, 
		AssignmentListComponent, 
		GroupListComponent, 
		UserListComponent, 
		CreateAssignmentDialog, 
		CreateGroupDialog, 
		ChangeRoleDialog, 
		CreateCourseComponent,
	],
	imports: [
		TranslateModule.forChild({ extend: true }),
		CoursesRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule
	]
})
export class CoursesModule { }
