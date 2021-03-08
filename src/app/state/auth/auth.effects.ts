import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AuthenticationService } from "../../../../api";
import { AuthenticationInfoDto } from "../../auth/auth-info.dto";
import { ToastService } from "../../shared/services/toast.service";
import * as AuthActions from "./auth.actions";

@Injectable()
export class AuthEffects {
	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.login),
			switchMap(({ username, password }) =>
				this.http.post(this.authUrl, { username, password }).pipe(
					switchMap((authInfo: AuthenticationInfoDto) => {
						return this.authApi.loginWithToken({ token: authInfo.token.token });
					}),
					map(token => {
						this.toast.success(token.user.displayName, "Common.Welcome");
						return AuthActions.loginSuccess({ token });
					}),
					catchError(error => {
						return of(AuthActions.loginFailure({ error: error.error }));
					})
				)
			)
		)
	);

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private authApi: AuthenticationService,
		private toast: ToastService,
		@Inject("SPARKY_AUTHENTICATE_URL") private authUrl: string
	) {}
}
