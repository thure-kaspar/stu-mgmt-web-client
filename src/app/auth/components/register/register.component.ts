import { Component } from "@angular/core";
import { Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {

	registerForm = this.fb.group({
		email: ["", [Validators.required, Validators.email]],
		password: ["", Validators.required],
		passwordConfirm: ["", Validators.required]
	});

	errorMessage: Observable<string>;

	constructor(private fb: FormBuilder, 
				private authService: AuthService,
				private router: Router,
				private snackbar: MatSnackBar) { }

	register(): void {
		if (this.registerForm.valid) {
			const authCredentials = {
				email: this.getEmail().value,
				password: this.getPassword().value
			};

			this.authService.register(authCredentials).subscribe(
				result => {
					this.snackbar.open("Account created!", "OK", { duration: 3000 });
					this.router.navigate(["/login"]);
				},
				error => {
					console.log(error);
					this.snackbar.open("Failed to create account.", "OK", { duration: 3000 });
				}
			);
		}
	}

	getEmailErrorMessage(): string {
		return this.getEmail().hasError("required") ? "You must enter a value" :
			this.getEmail().hasError("email") ? "Not a valid email" : "";
	}

	getPasswordErrorMessage(): string {
		return "Password error message"; // TODO
	}

	getPasswordConfirmErrorMessage(): string {
		return "Password confirm error message"; // TODO
	}

	getEmail(): AbstractControl {
		return this.registerForm.get("email");
	}

	getPassword(): AbstractControl {
		return this.registerForm.get("password");
	}

	getPasswordConfirm(): AbstractControl {
		return this.registerForm.get("passwordConfirm");
	}

}

