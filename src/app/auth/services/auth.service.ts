import { Injectable } from "@angular/core";
import { AuthenticationService, AuthCredentialsDto, AuthTokenDto } from "../../../../api";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationInfoDto } from "../../../../api_auth";

@Injectable({
	providedIn: "root"
})
export class AuthService {

	private readonly studentMgmtTokenKey = "studentMgmtToken";
	private readonly extAuthTokenKey = "extAuthTokenKey";

	constructor(private authenticationService: AuthenticationService,
				private router: Router) { }

	/**
	 * Login to the StudentMgmt-Backend via the token provided by the external authentication system.
	 */
	async loginWithToken(authInfo: AuthenticationInfoDto): Promise<void> {
		const result = await this.authenticationService.loginWithToken({ token: authInfo.token.token}).toPromise()
			.catch(error => {
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message);
			});

		// If login was successful, store the received authentication token
		if (result) {
			localStorage.setItem(this.extAuthTokenKey, authInfo.token.token);
			localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(result));
			this.router.navigate(["/courses"]);
		}
	}

	/**
	 * Login to the StudentMgmt-Backend directly.
	 */
	async login(authCredentials: AuthCredentialsDto): Promise<void> {
		const result = await this.authenticationService.login(authCredentials).toPromise()
			.catch(error => { 
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message); 
			});

		// If login was successful, store the received authentication token
		if (result) {
			localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(result));
			this.router.navigate(["/courses"]);
		}
	}

	register(authCredentials: AuthCredentialsDto): Observable<any> {
		return this.authenticationService.register(authCredentials);
	}

	logout(): void {
		localStorage.removeItem(this.studentMgmtTokenKey);
		localStorage.removeItem(this.extAuthTokenKey);
		this.router.navigate(["/login"]);
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(this.studentMgmtTokenKey);
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	getAccessToken(): string {
		const token = this.getAuthToken()?.accessToken;
		return token ? `Bearer ${token}` : "";
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the external authentication system.
	 */
	getAccessTokenOfAuthSystem(): string {
		const token = localStorage.getItem(this.extAuthTokenKey);
		return token ? token : "";
	}

	/**
	 * Returns the stored AuthToken, containing information about the user's id, email, role and rights.
	 */
	getAuthToken(): AuthTokenDto {
		return localStorage.getItem(this.studentMgmtTokenKey) as unknown as AuthTokenDto;
	}
}
