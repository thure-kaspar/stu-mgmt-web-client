import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";
import { CourseListComponent } from "./components/course-list/course-list.component";
import { CourseComponent } from "./components/course/course.component";
import { CourseRoutingModule } from "./course-routing.module";
import { ChangeRoleDialog } from "./dialogs/change-role/change-role.dialog";
import { JoinCourseDialog } from "./dialogs/join-course/join-course.dialog";
import { SearchCourseDialog } from "./dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "./dialogs/search-user/search-user.dialog";

@NgModule({
	declarations: [
		CourseListComponent,
		CourseComponent,
		ChangeRoleDialog,
		SearchCourseDialog,
		SearchUserDialog,
		JoinCourseDialog
	],
	imports: [SharedModule, TranslateModule.forChild({ extend: true }), CourseRoutingModule],
	providers: []
})
export class CourseModule {}
