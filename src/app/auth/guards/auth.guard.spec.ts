import { TestBed, async } from "@angular/core/testing";
import { AuthGuard } from "./auth.guard";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

const mock_AuthService = () => ({
	isLoggedIn: jest.fn().mockReturnValue(true)
});

const mock_Router = () => ({
	navigateByUrl: jest.fn()
});

describe("AuthGuard", () => {

	let authGuard: AuthGuard;
	let authService: AuthService;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				{ provide: AuthService, useFactory: mock_AuthService },
				{ provide: Router, useFactory: mock_Router }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		authGuard = TestBed.inject(AuthGuard);
		authService = TestBed.inject(AuthService);
		router = TestBed.inject(Router);
	});

	it("Should be defined", () => {
		expect(authGuard).toBeDefined();
	});

	describe("canActivate", () => {
	
		it("User is logged in -> Returns true", () => {
			const result = authGuard.canActivate();
			expect(result).toEqual(true);
		});

		it("User is logged out -> Returns false", () => {
			authService.isLoggedIn = jest.fn().mockReturnValue(false);
			const result = authGuard.canActivate();
			expect(result).toEqual(false);
		});

		it("User is logged out -> Navigates to login", () => {
			authService.isLoggedIn = jest.fn().mockReturnValue(false);
			const result = authGuard.canActivate();
			expect(router.navigateByUrl).toBeCalledWith("/login");
		});
	
	});

});
