import { LayoutModule } from "@angular/cdk/layout";
import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { LOCALE_ID, NgModule } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AuthModule, AuthService } from "@student-mgmt-client/auth";
import { StateModule } from "@student-mgmt-client/state";
import { ApiModule, Configuration } from "@student-mgmt/api-client";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "./material/material.module";
import { NavigationComponentModule } from "./navigation/navigation.component";
import { SharedModule } from "./shared/shared.module";

registerLocaleData(localeDe, "de", localeDeExtra);

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent, HomeComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		ApiModule.forRoot(
			() =>
				new Configuration({
					basePath: window["__env"]["API_BASE_PATH"],
					accessToken: (): string => AuthService.getAccessToken()
				})
		),
		AppRoutingModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			positionClass: "toast-bottom-right",
			progressBar: true
		}),
		TranslateModule.forRoot({
			defaultLanguage: localStorage.getItem("language") ?? "de",
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		StateModule,
		SharedModule,
		MaterialModule,
		LayoutModule,
		AuthModule,
		NavigationComponentModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "fill" } }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
