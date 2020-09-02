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
import { CourseRoutingModule } from "./course-routing.module";
import { JoinCourseDialog } from "./dialogs/join-course/join-course.dialog";
import { CourseFacade } from "./services/course.facade";
import { ParticipantFacade } from "./services/participant.facade";

@NgModule({
	declarations: [
		CourseListComponent, 
		CourseComponent, 
		ChangeRoleDialog, 
		SearchCourseDialog, 
		SearchUserDialog, 
		JoinCourseDialog, 
	],
	imports: [
		SharedModule,
		TranslateModule.forChild({ extend: true }),
		CourseRoutingModule,
		GroupModule,
		AssignmentModule
	],
	providers: [CourseFacade, ParticipantFacade]
})
export class CourseModule { }
