import { getSemester, getSemesterString } from "../../../utils/helper";
import { account, useAccount } from "../../support/auth";

describe("Course list", () => {
	const course = {
		courseId: "java-wise1920",
		name: "Programmierpraktikum I: Java"
	};

	const totalCourseCount = 4;

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses");
	});

	it("Filters courses by name", () => {
		cy.get(".course-filter-container #semester")
			.contains(getSemesterString(getSemester(new Date())))
			.click()
			.get("[data-option-all]")
			.click();

		cy.get(".table-container")
			.get("[data-course-title]")
			.should("have.length", totalCourseCount);

		cy.get(".course-filter-container").get("#title").type("java");
		cy.get("[data-course-title]").should("have.length", 3);
	});

	it("Filters courses by semester", () => {
		cy.get(".course-filter-container #semester")
			.contains(getSemesterString(getSemester(new Date())))
			.click()
			.get(".mat-option-text")
			.contains("SoSe 2020")
			.click();

		cy.get("[data-course-title]").should("have.length", 2);
	});

	it("User is member of course -> Clicking on course navigates to course", () => {
		cy.get(".course-filter-container #semester")
			.contains(getSemesterString(getSemester(new Date())))
			.click()
			.get("[data-option-all]")
			.click();

		cy.get("[data-course-title]").contains(course.name).click();
		cy.url().should("contain", course.courseId);
	});
});
