import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class AuthService {

	// constructor(private authenticationService: AuthenticationService,
	// 	private router: Router) { }

	// async login(authCredentials: AuthCredentialsDto): Promise<void> {
	// 	const result = await this.authenticationService.login(authCredentials).toPromise()
	// 		.catch(error => { 
	// 			// Rethrow the error, so calling component is able to display the error
	// 			throw new Error(error.error.message); 
	// 		});

	// 	if (result) {
	// 		localStorage.setItem("authToken", JSON.stringify(result));
	// 		this.router.navigate(["/postings"]);
	// 	}
	// }

	// register(authCredentials: AuthCredentialsDto): Observable<any> {
	// 	return this.authenticationService.register(authCredentials);
	// }

	// logout(): void {
	// 	localStorage.removeItem("authToken");
	// 	this.router.navigate(["/login"]);
	// }

	// isLoggedIn(): boolean {
	// 	return !!localStorage.getItem("authToken");
	// }

	// /**
	//  * Returns the stored AccessToken (JWT), which can be appended to the Authorization-header
	//  * ("Bearer <Token>") to authenticate the user for requests to the server.
	//  */
	// getAccessToken(): string {
	// 	return (JSON.parse(localStorage.getItem("authToken")) as AuthTokenDto)?.accessToken;
	// }

	// /**
	//  * Returns the stored AuthToken, containing information about the user's id, email, role and rights.
	//  */
	// getAuthToken(): AuthTokenDto {
	// 	return JSON.parse(localStorage.getItem("authToken"));
	// }
}
