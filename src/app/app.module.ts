import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ApiModule, BASE_PATH } from "../../api/typescript-angular-client-generated";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { NavigationComponent } from "./navigation/navigation.component";
import { LayoutModule } from "@angular/cdk/layout";
import { SharedModule } from "./shared/components/page-not-found/shared.module";

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
		SharedModule,
		MaterialModule,
		LayoutModule
	],
	providers: [{ provide: BASE_PATH, useValue: environment.API_BASE_PATH }],
	bootstrap: [AppComponent]
})
export class AppModule { }
