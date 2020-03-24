import { Injectable } from "@angular/core";
import { AuthenticationService, AuthCredentialsDto, AuthTokenDto } from "../../../../api";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class AuthService {

	private readonly authTokenKey = "authToken";

	constructor(private authenticationService: AuthenticationService,
				private router: Router) { }

	async login(authCredentials: AuthCredentialsDto): Promise<void> {
		const result = await this.authenticationService.login(authCredentials).toPromise()
			.catch(error => { 
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message); 
			});

		// If login was successful, store the received authentication token
		if (result) {
			localStorage.setItem(this.authTokenKey, JSON.stringify(result));
			this.router.navigate(["/courses"]);
		}
	}

	register(authCredentials: AuthCredentialsDto): Observable<any> {
		return this.authenticationService.register(authCredentials);
	}

	logout(): void {
		localStorage.removeItem(this.authTokenKey);
		this.router.navigate(["/login"]);
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(this.authTokenKey);
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be appended to the Authorization-header
	 * ("Bearer <Token>") to authenticate the user for requests to the server.
	 */
	getAccessToken(): string {
		return this.getAuthToken().accessToken;
	}

	/**
	 * Returns the stored AuthToken, containing information about the user's id, email, role and rights.
	 */
	getAuthToken(): AuthTokenDto {
		return localStorage.getItem(this.authTokenKey) as unknown as AuthTokenDto;
	}
}
