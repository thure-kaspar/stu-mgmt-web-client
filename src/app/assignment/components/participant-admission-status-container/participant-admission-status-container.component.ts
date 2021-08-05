import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { ParticipantSelectors } from "../../../state/participant";

@Component({
	selector: "app-participant-admission-status-container",
	templateUrl: "./participant-admission-status-container.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAdmissionStatusContainerComponent {
	admissionStatus$ = this.store.select(
		ParticipantSelectors.selectParticipantAdmissionStatusState
	);

	constructor(private store: Store) {}
}
