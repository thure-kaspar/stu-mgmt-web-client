import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ApiModule, BASE_PATH } from "../../api";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { NavigationComponent } from "./navigation/navigation.component";
import { LayoutModule } from "@angular/cdk/layout";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [
		AppComponent,
		NavigationComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		ApiModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			defaultLanguage: "en",
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		SharedModule,
		MaterialModule,
		LayoutModule,
		AuthModule
	],
	providers: [{ provide: BASE_PATH, useValue: environment.API_BASE_PATH }],
	bootstrap: [AppComponent]
})
export class AppModule { }
