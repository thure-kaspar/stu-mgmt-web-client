import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../../../../../apps/client/src/environments/environment";
import { AdmissionStatusEffects } from "./admission-status/admission-status.effects";
import { AssignmentEffects } from "./assignment/assignment.effects";
import { AuthEffects } from "./auth/auth.effects";
import { CourseEffects } from "./course/course.effects";
import { clearCourse, reducerMap } from "./meta.reducer";
import { ParticipantAdmissionStatusEffects } from "./participant/admission-status/admission-status.effects";
import { ParticipantAssessmentsEffects } from "./participant/assessments/assessments.effects";
import { ParticipantGroupsEffects } from "./participant/groups/groups.effects";
import { ParticipantEffects } from "./participant/participant.effects";

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot(reducerMap, {
			metaReducers: [clearCourse],
			runtimeChecks: {
				strictStateImmutability: !environment.production,
				strictActionImmutability: !environment.production,
				strictStateSerializability: !environment.production,
				strictActionSerializability: !environment.production,
				strictActionTypeUniqueness: !environment.production,
				strictActionWithinNgZone: false
			}
		}),
		StoreDevtoolsModule.instrument({
			maxAge: 25, // Retains last 25 states
			logOnly: environment.production // Restrict extension to log-only mode
		}),
		EffectsModule.forRoot(),
		EffectsModule.forFeature([
			AuthEffects,
			AssignmentEffects,
			ParticipantEffects,
			ParticipantAssessmentsEffects,
			ParticipantAdmissionStatusEffects,
			ParticipantGroupsEffects,
			CourseEffects,
			AdmissionStatusEffects
		])
	]
})
export class StateModule {}
