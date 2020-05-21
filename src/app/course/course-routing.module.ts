import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseListComponent } from "./components/course-list/course-list.component";
import { CourseComponent } from "./components/course/course.component";
import { CreateCourseComponent } from "./components/create-course/create-course.component";
import { CourseMemberGuard } from "./guards/course-member.guard";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserListComponent } from "./components/user-list/user-list.component";
import { AssignmentListComponent } from "../assignment/components/assignment-list/assignment-list.component";

const routes: Routes = [
	{ path: ":courseId", component: CourseComponent, canActivate: [AuthGuard, CourseMemberGuard], children: [
		{ path: "assignments", component: AssignmentListComponent, pathMatch: "full" },
		{ path: "groups", loadChildren: () => import("../group/group.module").then(m => m.GroupModule) },
		{ path: "users", component: UserListComponent, pathMatch: "full" },
		{ path: "**", pathMatch: "full", redirectTo: "assignments" }
	] },
	{ path: "create", component: CreateCourseComponent, pathMatch: "full" },
	{ path: "", component: CourseListComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseRoutingModule { }
