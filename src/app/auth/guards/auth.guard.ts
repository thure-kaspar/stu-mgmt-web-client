import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CanActivate } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { AuthSelectors } from "../../state/auth";
import { LoginDialog } from "../dialogs/login/login.dialog";

@Injectable({
	providedIn: "root"
})
export class AuthGuard implements CanActivate {
	constructor(private dialog: MatDialog, private store: Store) {}

	canActivate(): Observable<boolean> {
		return this.store.select(AuthSelectors.selectAuthState).pipe(
			take(1),
			switchMap(authState => {
				if (authState.token.accessToken) {
					return of(true);
				} else {
					return this.dialog
						.open<LoginDialog, undefined, boolean>(LoginDialog)
						.afterClosed();
				}
			})
		);
	}
}
