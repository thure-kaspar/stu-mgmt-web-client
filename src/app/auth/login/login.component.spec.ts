import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../services/auth.service";
import { of } from "rxjs";
import { AuthCredentialsDto } from "../../../../api";
import { NO_ERRORS_SCHEMA } from "@angular/core";

const authCredentials: AuthCredentialsDto = {
	email: "user.one@email.test",
	password: "testpassword"
};

const mock_AuthService = () => ({
	login: jest.fn().mockImplementation(() => new Promise<void>(null)) // Return empty promise
});

describe("LoginComponent", () => {

	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authService: AuthService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			providers: [
				{ provide: AuthService, useFactory: mock_AuthService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		authService = fixture.debugElement.injector.get(AuthService);
		component = fixture.componentInstance;
		component.email = authCredentials.email;
		component.password = authCredentials.password;
		component.errorMessage = null;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("login", () => {
	
		it("Calls AuthService for login", () => {
			component.login();
			expect(authService.login).toHaveBeenCalledWith(authCredentials);
		});

		it("Invalid credentials -> Shows error message", async () => {
			authService.login = jest.fn().mockRejectedValue(new Error("Invalid credentials"));
			await component.login();
			expect(component.errorMessage).toBeTruthy();
		});
	
	});

});
