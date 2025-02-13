import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { AuthService, LoginDialog } from "@student-mgmt-client/auth";
import { NavigationUiComponentModule } from "@student-mgmt-client/components";
import { ThemeService } from "@student-mgmt-client/services";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
    selector: "student-mgmt-navigation",
    templateUrl: "./navigation.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NavigationComponent implements OnInit {
	user$ = this.store.select(AuthSelectors.selectUser);

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe([Breakpoints.Small, Breakpoints.Handset])
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(
		readonly themeService: ThemeService,
		private breakpointObserver: BreakpointObserver,
		private store: Store,
		private translate: TranslateService,
		private overlayContainer: OverlayContainer,
		private readonly oauthService: OAuthService,
		private readonly authService: AuthService
	) {}

	ngOnInit(): void {
		this.themeService.theme$.subscribe(theme => this.onThemeChange(theme));
	}

	private onThemeChange(theme: string): void {
		const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;

		if (theme === "dark") {
			overlayContainerClasses.remove("light");
		} else if (theme === "light") {
			overlayContainerClasses.remove("dark");
		} else {
			console.error("Unknown theme: " + theme);
		}

		overlayContainerClasses.add(theme);
	}

	setLanguage(lang: string): void {
		this.translate.use(lang);
		localStorage.setItem("language", lang);
	}

	login(): void {
		this.oauthService.initLoginFlow();
		// Timeout is needed for oauthService to get accessToken()
		// TOFIX: Timeout is not good enough. If you need to type out your pw on keycloak 3 ms are not enough time
		// you would need to wait until accessToken is available
		setTimeout(() => {
			this.authService.login(this.oauthService.getAccessToken()).subscribe({
				error: error => {
				console.error(error);
			}
		});
		}, 3)
	}

	logout(): void {
		this.authService.logout();
	}
}

@NgModule({
	declarations: [NavigationComponent],
	exports: [NavigationComponent],
	imports: [CommonModule, NavigationUiComponentModule]
})
export class NavigationComponentModule {}
