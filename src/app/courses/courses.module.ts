import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentModule } from "../assignment/assignment.module";
import { GroupModule } from "../group/group.module";
import { SharedModule } from "../shared/shared.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { CourseComponent } from "./course/course/course.component";
import { ChangeRoleDialog } from "./course/dialogs/change-role/change-role.dialog";
import { SearchCourseDialog } from "./course/dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "./course/dialogs/search-user/search-user.dialog";
import { UserListComponent } from "./course/user-list/user-list.component";
import { CoursesRoutingModule } from "./courses-routing.module";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { SemesterPipe } from "./pipes/semester.pipe";

@NgModule({
	declarations: [
		CourseListComponent, 
		SemesterPipe, 
		CourseComponent, 
		UserListComponent, 
		ChangeRoleDialog, 
		CreateCourseComponent, 
		SearchCourseDialog, 
		SearchUserDialog, 
	],
	imports: [
		SharedModule,
		TranslateModule.forChild({ extend: true }),
		CoursesRoutingModule,
		GroupModule,
		AssignmentModule
	]
})
export class CoursesModule { }
