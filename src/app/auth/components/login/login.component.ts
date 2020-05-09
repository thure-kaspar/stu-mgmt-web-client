import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {

	email = "max.mustermann@test.com";
	password = "testpassword";
	errorMessage: string;

	constructor(private authService: AuthService) { }

	async login(): Promise<void> {
		const authCredentials = { email: this.email, password: this.password };
		await this.authService.login(authCredentials)
			.catch(error => {
				this.errorMessage = error;
			});
	}

}
