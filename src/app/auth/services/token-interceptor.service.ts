import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root"
})
export class TokenInterceptorService implements HttpInterceptor {

	constructor(private injector: Injector) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authService = this.injector.get(AuthService);
		const tokenizedReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${authService.getAccessToken()}`
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
			router.navigateByUrl("/login");
			return of(err.message);
		}

		return throwError(err);
	}
}
