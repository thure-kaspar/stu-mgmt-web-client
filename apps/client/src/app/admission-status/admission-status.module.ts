import { NgModule } from "@angular/core";
import { AdmissionStatusRoutingModule } from "./admission-status-routing.module";
import { AdmissionStatusComponentModule } from "./components/admission-status/admission-status.component";

@NgModule({
	declarations: [],
	imports: [AdmissionStatusRoutingModule, AdmissionStatusComponentModule]
})
export class AdmissionStatusModule {}
