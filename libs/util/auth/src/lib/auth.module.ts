import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginDialogModule } from "./dialogs/login/login.dialog";
import { AdminGuard } from "./guards/admin.guard";
import { AuthGuard } from "./guards/auth.guard";
import { ErrorInterceptorService } from "./services/error-interceptor.service";

@NgModule({
	imports: [AuthRoutingModule, LoginDialogModule],
	providers: [
		AuthGuard,
		AdminGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
	]
})
export class AuthModule {}
