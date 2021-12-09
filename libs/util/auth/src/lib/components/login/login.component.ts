import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
	errorMessage: string;

	constructor(private authService: AuthService, private router: Router) {}

	login(username: string): void {
		this.authService.devLogin(username).subscribe({
			next: user => {
				this.router.navigateByUrl("");
			},
			error: error => {
				console.log(error);
				this.errorMessage = error.error.message;
			}
		});
	}
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
	declarations: [LoginComponent],
	exports: [LoginComponent],
	imports: [CommonModule, MatFormFieldModule, MatCardModule, MatButtonModule]
})
export class LoginComponentModule {}
