import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { environment } from "../../environments/environment";
import * as fromAuth from "./auth/auth.reducer";
import { AuthEffects } from "./auth/auth.effects";

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		StoreModule.forRoot(
			{},
			{
				runtimeChecks: {
					strictStateImmutability: !environment.production,
					strictActionImmutability: !environment.production,
					strictStateSerializability: !environment.production,
					strictActionSerializability: !environment.production,
					strictActionTypeUniqueness: !environment.production,
					strictActionWithinNgZone: false
				}
			}
		),
		StoreDevtoolsModule.instrument({
			maxAge: 25, // Retains last 25 states
			logOnly: environment.production // Restrict extension to log-only mode
		}),
		EffectsModule.forRoot([]),
		EffectsModule.forFeature([AuthEffects]),
		StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer)
	]
})
export class StateModule {}
