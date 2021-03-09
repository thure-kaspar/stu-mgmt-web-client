import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AuthCredentialsDto, AuthenticationService, AuthTokenDto } from "../../../../api";
import { AuthActions, AuthSelectors } from "../../state/auth";

@Injectable({ providedIn: "root" })
export class AuthService {
	user$ = this.store.select(AuthSelectors.selectUser);

	static readonly studentMgmtTokenKey = "studentMgmtToken";

	constructor(
		private authenticationService: AuthenticationService,
		private store: Store,
		private router: Router
	) {}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string {
		const authToken = JSON.parse(
			localStorage.getItem(AuthService.studentMgmtTokenKey)
		) as AuthTokenDto;
		return authToken?.accessToken;
	}

	/**
	 * Login to the StudentMgmt-Backend directly.
	 */
	async login(authCredentials: AuthCredentialsDto): Promise<void> {
		const authToken = await this.authenticationService
			.login(authCredentials)
			.toPromise()
			.catch(error => {
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message);
			});

		// If login was successful, store the received authentication token
		if (authToken) {
			this.store.dispatch(AuthActions.loginSuccess({ token: authToken }));
			localStorage.setItem(AuthService.studentMgmtTokenKey, JSON.stringify(authToken));
			this.router.navigate(["/courses"]);
		}
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

	/**
	 * Returns the stored AuthToken, containing information about the user's id, email, role and rights.
	 */
	getAuthToken(): AuthTokenDto {
		return JSON.parse(localStorage.getItem(AuthService.studentMgmtTokenKey)) as AuthTokenDto;
	}
}
