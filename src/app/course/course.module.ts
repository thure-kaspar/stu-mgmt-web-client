import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentModule } from "../assignment/assignment.module";
import { GroupModule } from "../group/group.module";
import { SharedModule } from "../shared/shared.module";
import { CourseListComponent } from "./components/course-list/course-list.component";
import { CourseComponent } from "./components/course/course.component";
import { ChangeRoleDialog } from "./dialogs/change-role/change-role.dialog";
import { SearchCourseDialog } from "./dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "./dialogs/search-user/search-user.dialog";
import { UserListComponent } from "./components/user-list/user-list.component";
import { CourseRoutingModule } from "./course-routing.module";
import { CreateCourseComponent } from "./components/create-course/create-course.component";
import { SemesterPipe } from "./pipes/semester.pipe";
import { JoinCourseDialog } from "./dialogs/join-course/join-course.dialog";
import { CourseMemberGuard } from "./guards/course-member.guard";
import { CourseForm } from "./forms/course-form/course-form.component";
import { AdmissionCriteriaForm } from "./forms/admission-criteria-form/admission-criteria-form.component";
import { GroupSettingsForm } from "./forms/group-settings-form/group-settings-form.component";
import { AssignmentTemplatesForm } from "./forms/assignment-templates-form/assignment-templates-form.component";

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
		JoinCourseDialog, 
		CourseForm,
		AdmissionCriteriaForm, 
		GroupSettingsForm, 
		AssignmentTemplatesForm, 
	],
	imports: [
		SharedModule,
		TranslateModule.forChild({ extend: true }),
		CourseRoutingModule,
		GroupModule,
		AssignmentModule
	],
	providers: [CourseMemberGuard]
})
export class CourseModule { }
