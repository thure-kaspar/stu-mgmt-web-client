import { Injectable } from "@angular/core";
import { AuthenticationService, AuthCredentialsDto, AuthTokenDto, UserDto } from "../../../../api";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { AuthenticationInfoDto } from "../../../../api_auth";

@Injectable({ providedIn: "root" })
export class AuthService {

	private userSubject = new BehaviorSubject<UserDto>(undefined);
	public user$ = this.userSubject.asObservable();

	static readonly studentMgmtTokenKey = "studentMgmtToken";
	static readonly extAuthTokenKey = "extAuthTokenKey";

	constructor(private authenticationService: AuthenticationService,
				private router: Router) {

		// Check if user still has a token from last login
		const authToken = this.getAuthToken();
		if (authToken) {
			this.userSubject.next(authToken.user);
		}
	}

	/**
	 * Login to the StudentMgmt-Backend via the token provided by the external authentication system.
	 */
	async loginWithToken(authInfo: AuthenticationInfoDto): Promise<void> {
		const authToken = await this.authenticationService.loginWithToken({ token: authInfo.token.token}).toPromise()
			.catch(error => {
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message);
			});

		// If login was successful, store the received authentication token
		if (authToken) {
			localStorage.setItem(AuthService.extAuthTokenKey, authInfo.token.token);
			localStorage.setItem(AuthService.studentMgmtTokenKey, JSON.stringify(authToken));
			this.userSubject.next(authToken.user);
			this.router.navigate(["/courses"]);
		}
	}

	/**
	 * Login to the StudentMgmt-Backend directly.
	 */
	async login(authCredentials: AuthCredentialsDto): Promise<void> {
		const authToken = await this.authenticationService.login(authCredentials).toPromise()
			.catch(error => { 
				// Rethrow the error, so calling component is able to display the error
				throw new Error(error.error.message); 
			});

		// If login was successful, store the received authentication token
		if (authToken) {
			localStorage.setItem(AuthService.studentMgmtTokenKey, JSON.stringify(authToken));
			this.userSubject.next(authToken.user);
			this.router.navigate(["/courses"]);
		}
	}

	register(authCredentials: AuthCredentialsDto): Observable<any> {
		return this.authenticationService.register(authCredentials);
	}

	logout(): void {
		localStorage.removeItem(AuthService.studentMgmtTokenKey);
		localStorage.removeItem(AuthService.extAuthTokenKey);
		this.userSubject.next(null);
		this.router.navigate(["/courses"]);
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(AuthService.studentMgmtTokenKey);
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	getAccessToken(): string {
		return AuthService.getAccessToken();
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the external authentication system.
	 */
	getAccessTokenOfAuthSystem(): string {
		return AuthService.getAccessTokenOfAuthSystem();
	}

	/**
	 * Returns the stored AuthToken, containing information about the user's id, email, role and rights.
	 */
	getAuthToken(): AuthTokenDto {
		return JSON.parse(localStorage.getItem(AuthService.studentMgmtTokenKey)) as AuthTokenDto;
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string {
		const authToken = JSON.parse(localStorage.getItem(AuthService.studentMgmtTokenKey)) as AuthTokenDto;
		return authToken?.accessToken;
	}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the external authentication system.
	 */
	static getAccessTokenOfAuthSystem(): string {
		return localStorage.getItem(AuthService.extAuthTokenKey);
	}

}
