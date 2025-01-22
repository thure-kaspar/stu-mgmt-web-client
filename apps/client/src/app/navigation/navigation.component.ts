import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { LoginDialog } from "@student-mgmt-client/auth";
import { NavigationUiComponentModule } from "@student-mgmt-client/components";
import { ThemeService } from "@student-mgmt-client/services";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
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
		private dialog: MatDialog,
		private store: Store,
		private translate: TranslateService,
		private overlayContainer: OverlayContainer
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

	openLoginDialog(): void {
		this.dialog.open<LoginDialog, undefined, unknown>(LoginDialog);
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
	}
}

@NgModule({
	declarations: [NavigationComponent],
	exports: [NavigationComponent],
	imports: [CommonModule, NavigationUiComponentModule]
})
export class NavigationComponentModule {}
