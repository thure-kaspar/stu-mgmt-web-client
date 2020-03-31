import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../auth/services/auth.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, shareReplay, withLatestFrom, filter } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { Observable } from "rxjs";

@Component({
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent {

	@Output() onLanguageChange = new EventEmitter<string>();

	@ViewChild("drawer") drawer: MatSidenav;
	isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset])
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(private breakpointObserver: BreakpointObserver,
				private router: Router,
				private authService: AuthService) {
		router.events.pipe(
			withLatestFrom(this.isHandset$),
			filter(([a, b]) => b && a instanceof NavigationEnd)
		).subscribe(x => this.drawer.close());
	}

	setLanguage(lang: string) {
		this.onLanguageChange.emit(lang);
	}

	getUserId(): string {
		return this.authService.getAuthToken()?.userId ?? "";
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	logout(): void {
		return this.authService.logout();
	}

}
