import { account, useAccount } from "../../support/auth";

describe("Registered Groups", () => {
	const courseId = "java-wise1920";
	const assignmentId = "f50b8474-1fb9-4d69-85a2-76648d0fd3f9";
	const assignmentName = "Test_Assignment 08 (Java) - GROUP - IN_REVIEW";
	const totalGroupCount = 3;

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(`/courses/${courseId}/assignments/${assignmentId}/assessments/registrations`);
	});

	it("Navigates to /courses/{courseId}/assignments/{assignmentId}/assessments/registrations", () => {
		cy.contains(assignmentName);
	});

	it("Displays all registered groups", () => {
		cy.get("table")
			.get("tr")
			.should("have.length", totalGroupCount + 1); // Add 1 for header
	});

	it("Filters by group", () => {
		cy.get(".filter").type("group 2");
		cy.get("table")
			.get("tr")
			.should("have.length", 1 + 1); // Add 1 for header
	});

	it("Filters by user", () => {
		cy.get(".filter").type("mustermann");
		cy.get("table")
			.get("tr")
			.should("have.length", 1 + 1); // Add 1 for header
	});
});
