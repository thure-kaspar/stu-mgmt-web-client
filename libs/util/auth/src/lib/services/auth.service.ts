import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthenticationApi, AuthResultDto, UserDto } from "@student-mgmt/api-client";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
	user$ = this.store.select(AuthSelectors.selectUser);

	static readonly authKey = "auth";

	constructor(private authenticationApi: AuthenticationApi, 
		private store: Store,
		private readonly router: Router
	) {}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string {
		const authState = JSON.parse(localStorage.getItem(AuthService.authKey)) as AuthResultDto;
		return authState?.accessToken;
	}

	static getUser(): UserDto {
		const authState = JSON.parse(localStorage.getItem(AuthService.authKey)) as AuthResultDto;
		return authState?.user;
	}

	static setAuthState(state: AuthResultDto): void {
		localStorage.setItem(this.authKey, JSON.stringify(state));
	}

	/**
	 * **Only available when API is running in dev environment. The username has to be a valid JWT in production.**
	 *
	 * Sets the `accessToken` to the given `username` and queries the API to check whether
	 * the given username is a valid test account. If successful, the user is logged in as the
	 * specified user.
	 */
	devLogin(username: string): Observable<UserDto> {
		AuthService.setAuthState({ accessToken: username, user: null });

		return this.authenticationApi.whoAmI().pipe(
			tap(user => {
				const state = { user, accessToken: username };
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

	addUserDataToStore(accessToken: string) {
		this.devLogin(accessToken).subscribe({
			error: error => {
				console.error(error);
			}
		});
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(AuthService.authKey);
	}
}
