import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../environments/environment";
import { MaterialModule } from "../material/material.module";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginDialog } from "./dialogs/login/login.dialog";
import { AdminGuard } from "./guards/admin.guard";
import { AuthGuard } from "./guards/auth.guard";
import { TokenInterceptorService } from "./services/token-interceptor.service";

@NgModule({
	declarations: [LoginComponent, RegisterComponent, LoginDialog],
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		AuthGuard,
		AdminGuard,
		{
			provide: "SPARKY_AUTHENTICATE_URL",
			useValue:
				(window["__env"]["AUTH_BASE_PATH"] ?? environment.AUTH_BASE_PATH) +
				"/api/v1/authenticate"
		},
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
	]
})
export class AuthModule {}
