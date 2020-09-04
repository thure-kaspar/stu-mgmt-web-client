import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { filter, map, take, timeoutWith } from "rxjs/operators";
import { ParticipantFacade } from "../services/participant.facade";
import { ToastService } from "../services/toast.service";

@Injectable({ providedIn: "root" })
export class TeachingStaffGuard implements CanActivate {

	constructor(
		private participantFacade: ParticipantFacade,
		private router: Router,
		private toast: ToastService
	) { }

	// TODO: Will always timeout
	canActivate(): boolean {
		return true;
		// return this.participantFacade.participant$.pipe(
		// 	filter(participant => !!participant),
		// 	map(participant => {
		// 		console.log(participant);
		// 		if (participant?.isTeachingStaffMember) {
		// 			return true;
		// 		} else {
		// 			this.toast.error("Error.NotATeachingStaffMember");
		// 			return false;
		// 		}
		// 	}),
		// 	take(1),
		// 	timeoutWith(2000, of(false)),
		// );
	}

}
