import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LoginComponent } from "../../../../../libs/util/auth/src/lib/components/login/login.component";
import { LoginDialog } from "./dialogs/login/login.dialog";
import { AdminGuard } from "./guards/admin.guard";
import { AuthGuard } from "./guards/auth.guard";
import { ErrorInterceptorService } from "./services/error-interceptor.service";

@NgModule({
	declarations: [LoginComponent, LoginDialog],
	imports: [CommonModule, RouterModule, TranslateModule, FormsModule, ReactiveFormsModule],
	providers: [
		AuthGuard,
		AdminGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
	]
})
export class AuthModule {}
