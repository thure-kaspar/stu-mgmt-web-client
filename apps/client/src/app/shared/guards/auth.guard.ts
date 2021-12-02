import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CanActivate } from "@angular/router";
import { LoginDialog } from "../../auth/dialogs/login/login.dialog";
import { AuthService } from "../../auth/services/auth.service";
import { take } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private dialog: MatDialog) {}

	async canActivate(): Promise<boolean> {
		const user = await this.authService.user$.pipe(take(1)).toPromise();
		if (user) {
			return true;
		} else {
			const loggedIn = await this.dialog
				.open<LoginDialog, undefined, boolean>(LoginDialog)
				.afterClosed()
				.toPromise();
			return loggedIn;
		}
	}
}
