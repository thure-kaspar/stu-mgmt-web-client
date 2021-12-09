import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AuthenticationApi } from "@student-mgmt/api-client";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { ToastService } from "../../../shared/services/toast.service";
import { AuthActions } from "@student-mgmt-client/state";
import { AuthService } from "../../services/auth.service";

type LoginState = { isLoading: boolean; error?: string | null };

/**
 * Dialogs that allows the user to login to the Student-Management-System using the Sparkyservice as authentication provider.
 * @returns `True`, if user logged in successfully.
 */
@Component({
	selector: "app-login",
	templateUrl: "./login.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialog extends UnsubscribeOnDestroy {
	username: string;
	password: string;
	loginState$ = new BehaviorSubject<LoginState>({ isLoading: false });

	constructor(
		private dialogRef: MatDialogRef<LoginDialog, boolean>,
		private auth: AuthenticationApi,
		private store: Store,
		private toast: ToastService
	) {
		super();
	}

	async onLogin(): Promise<void> {
		const username = this.username.trim();
		const password = this.password.trim();

		this.loginState$.next({ isLoading: true });

		try {
			const authResult = await firstValueFrom(this.auth.login({ username, password }));
			AuthService.setAuthState(authResult);
			this.store.dispatch(AuthActions.login({ authResult }));
			this.toast.success(authResult.user.displayName, "Common.Welcome");
			this.dialogRef.close(true);
		} catch (error) {
			this.loginState$.next({ isLoading: false, error: this.getErrorMessage(error) });
		}
	}

	private getErrorMessage(error: HttpErrorResponse): string {
		switch (error.status) {
			case 0:
				return "Error.ConnectionRefused";
			case 401:
				return "Error.InvalidCredentials";
			default:
				return "Login failed (Reason: Unknown).";
		}
	}
}
