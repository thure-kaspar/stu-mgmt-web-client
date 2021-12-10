import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "student-mgmt-client-root",
	templateUrl: "./app.component.html"
})
export class AppComponent {
	constructor(private translate: TranslateService) {}

	handleLanguageChange(lang: string): void {
		this.translate.use(lang);
		localStorage.setItem("language", lang);
	}
}
