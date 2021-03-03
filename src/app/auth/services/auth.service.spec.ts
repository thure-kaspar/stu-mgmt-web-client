import { async, TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { AuthenticationService, AuthCredentialsDto, AuthTokenDto } from "../../../../api";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

const authToken: AuthTokenDto = {
	accessToken: "xxx.yyy.zzz",
	email: "user.one@email.test",
	userId: "user_id_1",
	role: "USER"
};

const mock_AuthenticationService = () => ({
	login: jest.fn().mockImplementation(() => of(authToken)),
	register: jest.fn()
});

const mock_Router = () => ({
	navigate: jest.fn()
});

describe("AuthService", () => {
	let service: AuthService;
	let authenticationService: AuthenticationService;
	let router: Router;
	let authCredentials: AuthCredentialsDto;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{ provide: AuthenticationService, useFactory: mock_AuthenticationService },
				{ provide: Router, useFactory: mock_Router }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		// Mock window.localStorage
		(Storage.prototype.setItem = jest.fn()),
			(Storage.prototype.getItem = jest.fn().mockReturnValue(authToken));
		Storage.prototype.removeItem = jest.fn();
	}));

	beforeEach(() => {
		service = TestBed.inject(AuthService);
		authenticationService = TestBed.inject(AuthenticationService);
		router = TestBed.inject(Router);
		authCredentials = {
			email: "user.one@email.test",
			password: "testpassword"
		};
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("login", () => {
		it("Calls the AuthenticationService for login", async () => {
			await service.login(authCredentials);
			expect(authenticationService.login).toHaveBeenCalledWith(authCredentials);
		});

		it("Valid credentials -> Stores the received AuthToken", async () => {
			await service.login(authCredentials);
			expect(window.localStorage.setItem).toHaveBeenCalled();
		});

		it("Valid credentials -> Navigates the user", async () => {
			await service.login(authCredentials);
			expect(router.navigate).toHaveBeenCalled();
		});

		it("Invalid credentials -> Throws Error", async () => {
			authenticationService.login = jest.fn().mockImplementation(() => {
				throw new Error("Invalid credentials.");
			});

			try {
				await service.login(authCredentials);
				expect(true).toEqual(false);
			} catch (error) {
				expect(error).toBeTruthy();
			}
		});
	});

	describe("register", () => {
		it("Calls AuthenticationService for registration and returns the observable", () => {
			authenticationService.register = jest.fn().mockImplementation(() => of({})); // Mock register to return an (empty) observable
			const result = service.register(authCredentials);
			expect(authenticationService.register).toHaveBeenCalledWith(authCredentials);
			expect(result).toBeTruthy();
		});
	});

	describe("logout", () => {
		it("Removes the stored AuthToken", () => {
			service.logout();
			expect(window.localStorage.removeItem).toHaveBeenCalled();
		});

		it("Navigates the user to the login page", () => {
			service.logout();
			expect(router.navigate).toHaveBeenCalledWith(["/login"]);
		});
	});

	describe("isLoggedIn", () => {
		it("AuthToken in storage -> Returns true", () => {
			const result = service.isLoggedIn();
			expect(result).toEqual(true);
		});

		it("No AuthToken -> Returns false", () => {
			Storage.prototype.getItem = jest.fn().mockReturnValue(null);
			const result = service.isLoggedIn();
			expect(result).toEqual(false);
		});
	});

	describe("getAccessToken", () => {
		it("Retrieves the authToken from storage and returns accessToken", () => {
			const result = service.getAccessToken();
			expect(result).toEqual(authToken.accessToken);
		});
	});

	describe("getAuthToken", () => {
		it("Retrieves the authToken from storage", () => {
			const result = service.getAuthToken();
			expect(result).toEqual(authToken);
		});
	});
});
