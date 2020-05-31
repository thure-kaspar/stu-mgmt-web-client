import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent {

	constructor(private translate: TranslateService) { }

	handleLanguageChange(lang: string): void {
		this.translate.use(lang);
		localStorage.setItem("language", lang);
	}
}
