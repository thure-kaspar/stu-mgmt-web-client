import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CoursesRoutingModule } from "./courses-routing.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SemesterPipe } from "./pipes/semester.pipe";
import { CourseComponent } from "./course/course/course.component";
import { AssignmentListComponent } from "./course/assignment-list/assignment-list.component";
import { UserListComponent } from "./course/user-list/user-list.component";
import { CreateAssignmentDialog } from "./course/dialogs/create-assignment/create-assignment.dialog";
import { MatNativeDateModule } from "@angular/material/core";
import { ChangeRoleDialog } from "./course/dialogs/change-role/change-role.dialog";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { SearchCourseDialog } from "./course/dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "./course/dialogs/search-user/search-user.dialog";
import { AssignmentForm } from "./forms/assignment-form/assignment-form.component";
import { EditAssignmentDialog } from "./course/dialogs/edit-assignment/edit-assignment.dialog";
import { GroupModule } from "../group/group.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
	declarations: [
		CourseListComponent, 
		SemesterPipe, 
		CourseComponent, 
		AssignmentListComponent, 
		UserListComponent, 
		CreateAssignmentDialog,
		ChangeRoleDialog, 
		CreateCourseComponent, 
		SearchCourseDialog, 
		SearchUserDialog, 
		AssignmentForm, 
		EditAssignmentDialog,
	],
	imports: [
		SharedModule,
		TranslateModule.forChild({ extend: true }),
		CoursesRoutingModule,
		GroupModule
	]
})
export class CoursesModule { }
