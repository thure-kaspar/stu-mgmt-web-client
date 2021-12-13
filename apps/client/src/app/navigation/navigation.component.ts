import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	NgModule,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService, LoginDialog } from "@student-mgmt-client/auth";
import { CourseMembershipsFacade, ThemeService, ToastService } from "@student-mgmt-client/services";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { Observable } from "rxjs";
import { filter, map, shareReplay, withLatestFrom } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {
	user$ = this.store.select(AuthSelectors.selectUser);

	@Output() onLanguageChange = new EventEmitter<string>();

	@ViewChild("drawer") drawer: MatSidenav;
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe([Breakpoints.Small, Breakpoints.Handset])
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	_isDevelopmentEnv = !environment.production;

	constructor(
		public authService: AuthService,
		public courseMemberships: CourseMembershipsFacade,
		public theme: ThemeService,
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private overlayContainer: OverlayContainer,
		private dialog: MatDialog,
		private toast: ToastService,
		private store: Store
	) {
		this.router.events
			.pipe(
				withLatestFrom(this.isHandset$),
				filter(([a, b]) => b && a instanceof NavigationEnd)
			)
			.subscribe(x => this.drawer.close());
	}

	ngOnInit(): void {
		this.theme.theme$.subscribe(theme => this.onThemeChange(theme));
	}

	onThemeChange(theme: string): void {
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
		this.onLanguageChange.emit(lang);
	}

	openLoginDialog(): void {
		this.dialog.open<LoginDialog, undefined, unknown>(LoginDialog);
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
	}

	async copyJwtToClipboard(): Promise<void> {
		await navigator.clipboard.writeText(AuthService.getAccessToken());
		this.toast.success("Copied!");
	}
}

@NgModule({
	declarations: [NavigationComponent],
	exports: [NavigationComponent],
	imports: [
		CommonModule,
		MatToolbarModule,
		MatMenuModule,
		TranslateModule,
		IconComponentModule,
		MatSidenavModule,
		RouterModule,
		MatDividerModule,
		MatListModule,
		MatButtonModule
	]
})
export class NavigationComponentModule {}
