import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class TokenInterceptorService implements HttpInterceptor {

	constructor(private injector: Injector) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authService = this.injector.get(AuthService);

		// Decide which access token should be used
		let accessToken = "";
		if (req.url.includes(environment.API_BASE_PATH)) {
			accessToken = authService.getAccessToken();
		} else if (req.url.includes(environment.AUTH_BASE_PATH)) {
			accessToken = authService.getAccessTokenOfAuthSystem();
		}

		// Clone the request and assign authorization header
		const tokenizedReq = req.clone({
			setHeaders: {
				Authorization: accessToken
			}
		});
		
		return next.handle(tokenizedReq).pipe(catchError(x => this.handleAuthError(x)));
	}

	/**
	 * Invoked when user is not logged in or user's authentication token has expired.
	 */
	private handleAuthError(err: HttpErrorResponse): Observable<any> {
		const authService = this.injector.get(AuthService);
		const router = this.injector.get(Router);

		if (err.status === 401) {
			authService.logout();
			return of(err.message);
		}

		return throwError(err);
	}
}
