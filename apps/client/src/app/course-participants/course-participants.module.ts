import { NgModule } from "@angular/core";
import { CourseParticipantsRoutingModule } from "./course-participants-routing.module";
import { ParticipantsListComponentModule } from "./participants-list/participants-list.component";

@NgModule({
	imports: [CourseParticipantsRoutingModule, ParticipantsListComponentModule]
})
export class CourseParticipantsModule {}
