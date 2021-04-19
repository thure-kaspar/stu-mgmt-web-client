import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthenticationService, AuthTokenDto } from "../../../../api";
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
						localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(token));
						return AuthActions.loginSuccess({ token });
					}),
					catchError(error => {
						return of(AuthActions.loginFailure({ error: error.error }));
					})
				)
			)
		)
	);

	logout$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(AuthActions.logout),
				tap(() => {
					localStorage.removeItem(this.studentMgmtTokenKey);
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
					const stored: AuthTokenDto = JSON.parse(
						localStorage.getItem(this.studentMgmtTokenKey)
					);
					stored.user.courses = action.courses;
					localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(stored));
				})
			),
		{ dispatch: false }
	);

	private studentMgmtTokenKey = "studentMgmtToken";

	constructor(
		private actions$: Actions,
		private store: Store,
		private http: HttpClient,
		private authApi: AuthenticationService,
		private router: Router,
		private toast: ToastService,
		@Inject("SPARKY_AUTHENTICATE_URL") private authUrl: string
	) {}
}
