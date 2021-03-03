import { TestBed, async } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AdminGuard } from "./admin.guard";
import { AuthTokenDto } from "../../../../api";

const mock_AuthService = () => ({
	getAuthToken: jest.fn()
});

const mock_Router = () => ({
	navigateByUrl: jest.fn()
});

describe("AuthGuard", () => {
	let adminGuard: AdminGuard;
	let authService: AuthService;
	let router: Router;
	let authToken: AuthTokenDto;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [
				AdminGuard,
				{ provide: AuthService, useFactory: mock_AuthService },
				{ provide: Router, useFactory: mock_Router }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		adminGuard = TestBed.inject(AdminGuard);
		authService = TestBed.inject(AuthService);
		router = TestBed.inject(Router);
		authToken = {
			accessToken: "xxx.yyy.zzz",
			email: "user.one@email.test",
			userId: "user_id_1",
			role: AuthTokenDto.RoleEnum.USER
		};
	});

	it("Should be defined", () => {
		expect(adminGuard).toBeDefined();
	});

	describe("canActivate", () => {
		describe("Allows", () => {
			it("User is MGMT_Admin -> Returns true", () => {
				authToken.role = AuthTokenDto.RoleEnum.MGTMADMIN;
				authService.getAuthToken = jest.fn().mockReturnValueOnce(authToken);

				const result = adminGuard.canActivate();
				expect(result).toEqual(true);
			});

			it("User is SYSTEM_ADMIN -> Returns true", () => {
				authToken.role = AuthTokenDto.RoleEnum.SYSTEMADMIN;
				authService.getAuthToken = jest.fn().mockReturnValueOnce(authToken);

				const result = adminGuard.canActivate();
				expect(result).toEqual(true);
			});
		});

		describe("Blocks", () => {
			it("User is USER -> Returns false and navigates to login", () => {
				authToken.role = AuthTokenDto.RoleEnum.USER;
				authService.getAuthToken = jest.fn().mockReturnValueOnce(authToken);

				const result = adminGuard.canActivate();
				expect(router.navigateByUrl).toHaveBeenCalledWith("/login");
				expect(result).toEqual(false);
			});

			it("User is not logged in -> Returns false and navigates to login", () => {
				authToken = null;
				authService.getAuthToken = jest.fn().mockReturnValueOnce(authToken);

				const result = adminGuard.canActivate();
				expect(router.navigateByUrl).toHaveBeenCalledWith("/login");
				expect(result).toEqual(false);
			});
		});
	});
});
