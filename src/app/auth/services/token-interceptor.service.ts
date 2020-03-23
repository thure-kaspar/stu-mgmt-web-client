import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

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
		return next.handle(tokenizedReq);
	}
}
