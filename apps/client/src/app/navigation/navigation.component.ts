import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { NavigationEnd, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, shareReplay, withLatestFrom } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { AuthService } from "@student-mgmt-client/auth";
import { CourseMembershipsFacade, ThemeService, ToastService } from "@student-mgmt-client/services";

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
		const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) =>
			item.includes("-theme")
		);
		if (themeClassesToRemove.length) {
			overlayContainerClasses.remove(...themeClassesToRemove);
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
