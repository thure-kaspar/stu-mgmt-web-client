import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthControllerService, AuthenticationInfoDto } from "../../../../../api_auth";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-login",
	templateUrl: "./login.dialog.html",
	styleUrls: ["./login.dialog.scss"]
})
export class LoginDialog extends UnsubscribeOnDestroy implements OnInit {

	username: string;
	password: string;
	errorMessage: string;

	loading = false;

	constructor(private dialog: MatDialogRef<LoginDialog, AuthenticationInfoDto>,
				private auth: AuthControllerService) { super(); }

	ngOnInit(): void {
	}

	onLogin(): void {
		this.loading = true;
		this.subs.sink = this.auth.authenticate({ username: this.username, password: this.password }).subscribe(
			result => {
				this.loading = false;
				this.dialog.close(result); // Return userinfo and token to calling component
			},
			error => {
				console.log(error);
				this.loading = false;
				
				switch(error.status) {
				case 0:
					this.errorMessage = "Error.ConnectionRefused";
					break;
				case 401:
					this.errorMessage = "Error.InvalidCredentials";
					break;
				default:
					this.errorMessage = "Login failed (Reason: Unknown).";
					break;
				}
			}
		);
	}

}
