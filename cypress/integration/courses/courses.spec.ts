import { getSemester, getSemesterString } from "../../../utils/helper";
import { account, useAccount } from "../../support/auth";

function clickOnCourseWithTitle(title: string): void {
	cy.get("[data-course-title]").contains(title).click();
}

/** Opens the "Semester" dropdown and select the "All" option. */
function setSemesterFilterToAll(): void {
	cy.get(".course-filter-container #semester").click().get("[data-option-all]").click();
}

describe("Course list", () => {
	const course = {
		courseId: "java-wise1920",
		title: "Programmierpraktikum I: Java"
	};

	const totalCourseCount = 4;

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses");
	});

	it("Filters courses by name", () => {
		setSemesterFilterToAll();

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

	describe("Clicking on a course", () => {
		it("User is member of course -> Clicking on course navigates to course", () => {
			setSemesterFilterToAll();

			// User clicks on course that he is member of
			clickOnCourseWithTitle(course.title);

			// Should navigate user to course page
			cy.url().should("contain", course.courseId);

			// Course page should display some information (assignments)
			cy.get("[data-assignment-name]").should("have.length.greaterThan", 0);
		});

		it.only("User is NOT a member | Course requires password -> Opens Join Dialog", () => {
			useAccount(account.notInCourse);
			setSemesterFilterToAll();
			clickOnCourseWithTitle(course.title);

			// Enables user to type in course password
			cy.get("input[type=password]").type("password");
		});
	});
});
