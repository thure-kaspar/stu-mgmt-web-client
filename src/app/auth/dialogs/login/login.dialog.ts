import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthControllerService, AuthenticationInfoDto } from "../../../../../api_auth";

@Component({
	selector: "app-login",
	templateUrl: "./login.dialog.html",
	styleUrls: ["./login.dialog.scss"]
})
export class LoginDialog implements OnInit {

	username = "user";
	password = "abcdefgh"
	errorMessage: string;

	constructor(private dialog: MatDialogRef<LoginDialog, AuthenticationInfoDto>,
				private auth: AuthControllerService) { }

	ngOnInit(): void {
	}

	onLogin(): void {
		this.auth.authenticate({ username: this.username, password: this.password }).subscribe(
			result => {
				this.dialog.close(result); // Return userinfo and token to calling component
			},
			error => {
				console.log(error);
				this.errorMessage = "Login failed.";
			}
		);
	}

}
