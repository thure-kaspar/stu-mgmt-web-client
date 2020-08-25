import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ApiModule, BASE_PATH } from "../../api";
import { ApiModule as AuthApiModule, BASE_PATH as AUTH_BASE_PATH } from "../../api_auth";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { MaterialModule } from "./material/material.module";
import { NavigationComponent } from "./navigation/navigation.component";
import { LayoutModule } from "@angular/cdk/layout";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { AssessmentModule } from "./assessment/assessment.module";
import { AssessmentEditorModule } from "./assessment-editor/assessment-editor.module";
import { AssessmentOverviewModule } from "./assessment-overview/assessment-overview.module";
import { AssessmentViewerModule } from "./assessment-viewer/assessment-viewer.module";
import { AdmissionStatusModule } from "./admission-status/admission-status.module";

registerLocaleData(localeDe, "de", localeDeExtra);

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
		AuthApiModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			positionClass: "toast-bottom-right"
		}),
		TranslateModule.forRoot({
			defaultLanguage: localStorage.getItem("language") ?? "en",
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		SharedModule,
		MaterialModule,
		LayoutModule,
		AuthModule,
		AssessmentModule,
		AssessmentEditorModule,
		AssessmentOverviewModule,
		AssessmentViewerModule,
		AdmissionStatusModule
	],
	providers: [
		{ provide: BASE_PATH, useValue: window["__env"]["API_BASE_PATH"] ?? environment.API_BASE_PATH },
		{ provide: AUTH_BASE_PATH, useValue: window["__env"]["API_BASE_PATH"] ?? environment.AUTH_BASE_PATH },
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "fill" }} // TODO: decide style
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
