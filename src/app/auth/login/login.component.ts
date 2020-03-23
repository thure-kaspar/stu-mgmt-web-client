import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {

	email: string;
	password: string;
	errorMessage: string;

	constructor(private authService: AuthService) { }

	login(): void {
		const authCredentials = { email: this.email, password: this.password };
		this.authService.login(authCredentials)
			.catch(error => this.errorMessage = error);
	}

}
