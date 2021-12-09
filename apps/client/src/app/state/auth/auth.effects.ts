import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { AuthService } from "../../auth/services/auth.service";
import * as AuthActions from "./auth.actions";

@Injectable()
export class AuthEffects {
	logout$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(AuthActions.logout),
				tap(() => {
					localStorage.removeItem(this.authKey);
					this.router.navigateByUrl("courses");
				})
			),
		{ dispatch: false }
	);

	setCourses$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(AuthActions.setCourses),
				tap(action => {
					const user = AuthService.getUser();
					const accessToken = AuthService.getAccessToken();

					user.courses = action.courses;

					localStorage.setItem(
						this.authKey,
						JSON.stringify({
							user,
							accessToken
						})
					);
				})
			),
		{ dispatch: false }
	);

	private authKey = "auth";

	constructor(private actions$: Actions, private router: Router) {}
}
