import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";
import { navigateToCourse } from "../support/navigation";

const courseThatRequiresPassword = {
	title: "Programmierpraktikum I: Java",
	courseId: "java-wise1920",
	password: "password"
};

const courseWithoutPassword = {
	title: "Programmierpraktikum I: Java",
	courseId: "java-sose2020"
};

const courseThatIsClosed = {
	title: "Programmierpraktikum I: Java",
	courseId: "java-wise1819"
};

describe("Join Course Dialog", () => {
	beforeEach(() => {
		resetDemoDb();
		useAccount(account.notInCourse);
	});

	describe("Course that requires password", () => {
		beforeEach(() => {
			navigateToCourse(courseThatRequiresPassword.courseId);
		});

		it("Incorrect password -> Displays error message", () => {
			cy.get("input[type=password]").type("incorrect_password");
			cy.get(".btn-join").click();
			cy.getBySelector(Selector.joinCourseDialog.errorMessage).should(
				"have.text",
				"Das angegebene Passwort ist nicht korrekt."
			);
		});
		it("Correct password -> User joins course", () => {
			cy.get("input[type=password]").type(courseThatRequiresPassword.password);
			cy.get(".btn-join").click();
			cy.getBySelector(Selector.assignment.card).should("have.length.above", 0);
		});
	});

	describe("Course that requires no password", () => {
		beforeEach(() => {
			resetDemoDb();
			navigateToCourse(courseWithoutPassword.courseId);
		});

		it("Allows user to enter course without password", () => {
			// Dialog should not show password input
			cy.get("input[type=password]").should("not.exist");

			// Dialog should display message saying that password is not required
			cy.getBySelector(Selector.joinCourseDialog.dialog).contains(
				"Kein Einschreibeschlüssel notwendig."
			);

			// Clicking on "Join" button should add user to course
			cy.get(".btn-join").click();

			// Should navigate user to assignments page and display them
			cy.url().should("contain", `/courses/${courseWithoutPassword.courseId}/assignments`);
			cy.getBySelector(Selector.assignment.card).should("have.length.above", 0);
		});
	});

	describe("Course that is closed", () => {
		beforeEach(() => {
			navigateToCourse(courseThatIsClosed.courseId);
		});

		it("Does not allow user to join", () => {
			// Dialog should display message saying that course is closed
			cy.getBySelector(Selector.joinCourseDialog.dialog).contains("CLOSED");

			// Dialog should not have a "Join" button
			cy.get(".btn-join").should("not.exist");

			// Clicking "Cancel" should navigate user back
			cy.get(".btn-cancel").click();
			cy.url().should("equal", "http://localhost:4200/courses");
		});
	});
});
