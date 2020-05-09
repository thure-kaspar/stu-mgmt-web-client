import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdminGuard } from "./guards/admin.guard";
import { LoginDialog } from "./dialogs/login/login.dialog";

@NgModule({
	declarations: [LoginComponent, RegisterComponent, LoginDialog],
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		AuthService, 
		AuthGuard,
		AdminGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
	]

})
export class AuthModule { }
