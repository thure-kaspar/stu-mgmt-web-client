import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewEncapsulation
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LoginDialog } from "../auth/dialogs/login/login.dialog";
import { UnsubscribeOnDestroy } from "../shared/components/unsubscribe-on-destroy.component";
import { ThemeService } from "../shared/services/theme.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HomeComponent extends UnsubscribeOnDestroy implements OnInit {
	currentLanguage: string;

	constructor(
		readonly dialog: MatDialog,
		readonly themeService: ThemeService,
		readonly translate: TranslateService,
		private cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.currentLanguage = localStorage.getItem("language") ?? "de";
		console.log(this.currentLanguage);
		this.subs.sink = this.translate.onLangChange.subscribe(({ lang }) => {
			this.currentLanguage = lang;
		});
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialog);
	}

	setLanguage(lang: string): void {
		this.translate.use(lang);
		localStorage.setItem("language", lang);
	}
}
