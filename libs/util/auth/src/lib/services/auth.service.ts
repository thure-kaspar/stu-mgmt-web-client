import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthenticationApi, AuthResultDto, UserDto } from "@student-mgmt/api-client";
import { Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { OAuthEvent, OAuthService } from "angular-oauth2-oidc";
import { ToastService } from "@student-mgmt-client/services";
import { toObservable } from '@angular/core/rxjs-interop';
import { EventType } from 'angular-oauth2-oidc';

@Injectable({ providedIn: "root" })
export class AuthService {
	user$ = this.store.select(AuthSelectors.selectUser);

	static readonly authKey = "auth";
	static oauthServiceStatic;

	constructor(private authenticationApi: AuthenticationApi, 
		private store: Store,
		private readonly oauthService: OAuthService,
		private readonly toast: ToastService
	) {
		AuthService.oauthServiceStatic = oauthService;
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string {
		const accessToken = AuthService.oauthServiceStatic.getAccessToken()
		if (!AuthService.oauthServiceStatic.hasValidAccessToken()) {
			const authState = JSON.parse(localStorage.getItem(AuthService.authKey)) as AuthResultDto;
			return authState?.accessToken;
		} else {
			return accessToken;
		}
		
	}

	static getUser(): UserDto {
		const authState = JSON.parse(localStorage.getItem(AuthService.authKey)) as AuthResultDto;
		return authState?.user;
	}

	static setAuthState(state: AuthResultDto): void {
		localStorage.setItem(this.authKey, JSON.stringify(state));
	}

	/**
	 * ** Username login is only available when API is running in dev environment. **
	 * ** The accessToken has to be a valid JWT in production. **
	 *
	 * In development:
	 * Sets the `accessToken` to the given `username` and queries the API to check whether
	 * the given username is a valid test account. If successful, the user is logged in as the
	 * specified user.
	 * 
	 * In production:
	 * Login via username will not be possible. The backend verifies the JWT for /auth/whoAmI. Therefore, accessToken has 
	 * to be a valid JWT. 
	 */
	updateUserData(accessToken: string): Observable<UserDto> {
		AuthService.setAuthState({ accessToken: accessToken, user: null });

		return this.authenticationApi.whoAmI().pipe(
			tap(user => {
				const state = { user, accessToken: accessToken };
				AuthService.setAuthState(state);
				this.store.dispatch(
					AuthActions.login({
						authResult: {
							user: state.user,
							accessToken: state.accessToken
						}
					})
				);
			})
		);
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
		if (this.oauthService.hasValidAccessToken()) {
			this.oauthService.logOut();
		}
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(AuthService.authKey);
	}
}
