import { NgModule } from "@angular/core";
import { AdmissionStatusModule } from "../admission-status/admission-status.module";
import { SharedModule } from "../shared/shared.module";
import { ParticipantAssessmentsComponent } from "./components/participant-assessments/participant-assessments.component";
import { ParticipantProfileComponent } from "./components/participant-profile/participant-profile.component";
import { ParticipantProfileRoutingModule } from "./participant-profile-routing.module";

@NgModule({
	declarations: [ParticipantProfileComponent, ParticipantAssessmentsComponent],
	imports: [SharedModule, ParticipantProfileRoutingModule, AdmissionStatusModule]
})
export class ParticipantProfileModule {}
