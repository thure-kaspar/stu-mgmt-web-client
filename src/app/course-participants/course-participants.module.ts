import { NgModule } from "@angular/core";
import { CourseParticipantsRoutingModule } from "./course-participants-routing.module";
import { UserListComponent } from "./user-list/user-list.component";
import { SharedModule } from "../shared/shared.module";
import { ParticipantsOverviewComponent } from "./participants-overview/participants-overview.component";

@NgModule({
	declarations: [
		UserListComponent,
		ParticipantsOverviewComponent, 
	],
	imports: [
		SharedModule,
		CourseParticipantsRoutingModule
	]
})
export class CourseParticipantsModule { }
