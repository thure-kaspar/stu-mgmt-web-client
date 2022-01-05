import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { Store } from "@ngrx/store";
import { ParticipantAdmissionStatusComponentModule } from "../../../participant-admission-status/participant-admission-status.component";
import { ParticipantSelectors } from "@student-mgmt-client/state";

@Component({
	selector: "student-mgmt-participant-admission-status-container",
	templateUrl: "./participant-admission-status-container.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusContainerComponent {
	admissionStatus$ = this.store.select(
		ParticipantSelectors.selectParticipantAdmissionStatusState
	);

	constructor(private store: Store) {}
}

@NgModule({
	declarations: [ParticipantAdmissionStatusContainerComponent],
	exports: [ParticipantAdmissionStatusContainerComponent],
	imports: [CommonModule, ParticipantAdmissionStatusComponentModule]
})
export class ParticipantAdmissionStatusContainerComponentModule {}
