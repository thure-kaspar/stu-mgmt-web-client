import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseListComponent } from "./components/course-list/course-list.component";
import { CourseComponent } from "./components/course/course.component";
import { CreateCourseComponent } from "./components/create-course/create-course.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { EditCourseComponent } from "./components/edit-course/edit-course.component";

const routes: Routes = [
	{ path: "create", component: CreateCourseComponent, pathMatch: "full" },
	{ path: ":courseId", component: CourseComponent, canActivate: [AuthGuard], children: [
		{ path: "assignments", loadChildren: () => import("../assignment/assignment.module").then(m => m.AssignmentModule), },
		{ path: "groups", loadChildren: () => import("../group/group.module").then(m => m.GroupModule) },
		{ path: "users", loadChildren: () => import("../course-participants/course-participants.module").then(m => m.CourseParticipantsModule) },
		{ path: "users/:userId", loadChildren: () => import("../participant-profile/participant-profile.module").then(m => m.ParticipantProfileModule) },
		{ path: "settings", component: EditCourseComponent, pathMatch: "full" },
		{ path: "", pathMatch: "full", redirectTo: "assignments" }
	] },
	{ path: "", component: CourseListComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CourseRoutingModule { }
