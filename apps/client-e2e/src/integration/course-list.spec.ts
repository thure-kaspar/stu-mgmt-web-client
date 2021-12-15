import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

function clickOnCourseWithTitle(title: string): void {
	cy.getBySelector(Selector.courseList.linkToCourse).contains(title).click();
}

const totalCourseCount = 4;
const courseList = Selector.courseList;
const course = {
	courseId: "java-wise1920",
	title: "Programmierpraktikum I: Java"
};

describe("Course list", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses");
	});

	it("Displays CourseListComponent", () => {
		cy.getBySelector(courseList.component).should("be.visible");
	});

	it("Admin account -> Displays create course button", () => {
		cy.getBySelector(courseList.createCourseButton).should("be.visible");
	});

	it("Student account -> Does not display create course button", () => {
		useAccount(account.student);
		cy.visit("/courses");
		cy.getBySelector(courseList.createCourseButton).should("not.exist");
	});

	it("Displays all courses by default", () => {
		cy.getBySelector(courseList.linkToCourse).should("have.length", totalCourseCount);
	});

	it("Filters courses by name", () => {
		cy.getBySelector(courseList.titleTextField).type("java");
		cy.getBySelector(courseList.linkToCourse).should("have.length", 3);
	});

	it("Filters courses by semester", () => {
		cy.getBySelector(courseList.semesterSelectBox)
			.click()
			.get(".mat-option-text")
			.contains("SoSe 2020")
			.click();

		cy.getBySelector(courseList.linkToCourse).should("have.length", 2);
	});

	describe("Clicking on a course", () => {
		it("User is member of course -> Clicking on course navigates to course", () => {
			// User clicks on course that he is member of
			clickOnCourseWithTitle(course.title);

			// Should navigate user to course page
			cy.url().should("contain", course.courseId);

			// Course page should display some information (assignments)
			cy.getBySelector(Selector.assignment.card).should("have.length.greaterThan", 0);
		});

		it("User is NOT a member + Course requires password -> Opens Join Dialog", () => {
			useAccount(account.notInCourse);

			clickOnCourseWithTitle(course.title);

			// Enables user to type in course password
			cy.get("input[type=password]").type("password");
		});
	});
});
