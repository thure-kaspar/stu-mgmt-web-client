import { NgModule } from "@angular/core";
import { ParticipantProfileRoutingModule } from "./participant-profile-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ParticipantProfileComponent } from "./components/participant-profile/participant-profile.component";
import { AdmissionStatusModule } from "../admission-status/admission-status.module";
import { ParticipantAssessmentsComponent } from "./components/participant-assessments/participant-assessments.component";
import { ParticipantAdmissionStatusComponent } from "./components/participant-admission-status/participant-admission-status.component";


@NgModule({
	declarations: [
		ParticipantProfileComponent, 
		ParticipantAssessmentsComponent, 
		ParticipantAdmissionStatusComponent
	],
	imports: [
		SharedModule,
		ParticipantProfileRoutingModule,
		AdmissionStatusModule
	]
})
export class ParticipantProfileModule { }
