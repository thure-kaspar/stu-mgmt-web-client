import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthenticationApi, UserDto } from "@student-mgmt/api-client";
import { AuthActions, AuthSelectors } from "../../state/auth";

type StoredAuthState = { user: UserDto; accessToken: string };

@Injectable({ providedIn: "root" })
export class AuthService {
	user$ = this.store.select(AuthSelectors.selectUser);

	static readonly studentMgmtTokenKey = "studentMgmtToken";

	constructor(private authenticationApi: AuthenticationApi, private store: Store) {}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string {
		const authState = JSON.parse(
			localStorage.getItem(AuthService.studentMgmtTokenKey)
		) as StoredAuthState;
		return authState?.accessToken;
	}

	static getUser(): UserDto {
		const authState = JSON.parse(
			localStorage.getItem(AuthService.studentMgmtTokenKey)
		) as StoredAuthState;
		return authState?.user;
	}

	static setAuthState(state: StoredAuthState): void {
		localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(state));
	}

	/**
	 * **Only available when API is running in dev environment.**
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
				this.store.dispatch(AuthActions.loginSuccess(state));
			})
		);
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(AuthService.studentMgmtTokenKey);
	}
}
