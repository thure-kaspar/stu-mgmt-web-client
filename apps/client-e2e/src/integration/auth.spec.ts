import { Selector } from "../support/elements";

describe("Authentication", () => {
	describe("Login Dialog", () => {
		beforeEach(() => {
			cy.visit("/");
			cy.getBySelector(Selector.openLoginDialogButton).click();
		});

		it("Opens LoginDialog", () => {
			cy.getBySelector(Selector.loginDialog.component).should("be.visible");
		});

		it("Successful login (fake) -> Closes dialog and logs user in", () => {
			cy.intercept("/auth/login", {
				statusCode: 200,
				body: {
					user: {
						id: "abc6e1c0-6db0-4c35-8d97-07cc7173c34c",
						matrNr: 555555,
						email: null,
						username: "user",
						displayName: "user",
						role: "SYSTEM_ADMIN",
						courses: [
							{
								id: "java-wise1920",
								shortname: "java",
								semester: "wise1920",
								title: "Programmierpraktikum I: Java",
								isClosed: false,
								links: [
									{
										name: "Example URL",
										url: "http://example-url.com"
									}
								]
							}
						]
					},
					accessToken: "aaa.bbb.ccc"
				}
			}).as("login");

			cy.getBySelector(Selector.loginDialog.usernameTextField).type("user");
			cy.getBySelector(Selector.loginDialog.passwordTextField).type("my_password");
			cy.getBySelector(Selector.loginDialog.loginButton).click();

			cy.getBySelector(Selector.loginDialog.component).should("not.exist");
			cy.getBySelector(Selector.course.sidebarCourseLink).should("have.length", 1);
		});

		it("Invalid credentials -> Shows error", () => {
			cy.intercept("/auth/login", {
				statusCode: 401,
				body: {
					message: "Failed to authenticate with Sparkyservice.",
					sparkyError: {
						timestamp: "2022-01-10T16:06:36.185+0000",
						status: 401,
						error: "Unauthorized",
						message: "Unauthorized",
						path: "/api/v1/authenticate"
					}
				}
			}).as("login");

			cy.getBySelector(Selector.loginDialog.usernameTextField).type("user");
			cy.getBySelector(Selector.loginDialog.passwordTextField).type("my_password");
			cy.getBySelector(Selector.loginDialog.loginButton).click();

			cy.contains("Ungültiger Nutzername oder Passwort.");
		});
	});
});
