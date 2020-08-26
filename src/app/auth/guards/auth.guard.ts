import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialog } from "../dialogs/login/login.dialog";
import { AuthenticationInfoDto } from "../../../../api_auth";

@Injectable({
	providedIn: "root"
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService,
				private dialog: MatDialog,
				private router: Router) { }

	async canActivate(): Promise<boolean> {
		if (!this.authService.isLoggedIn()) {
			const result = await this.dialog.open<LoginDialog, undefined, AuthenticationInfoDto>(LoginDialog).afterClosed().toPromise();
			if (result) {
				await this.authService.loginWithToken(result); // Attempt to authenticate user in StudentMgtm-Backend
				return true;
			} else {
				return false;
			}
		}
		
		return true;
	}

}
