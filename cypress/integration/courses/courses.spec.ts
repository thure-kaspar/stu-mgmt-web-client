import { getSemester, getSemesterString } from "../../../utils/helper";

describe("Registered Groups", () => {
	const courseName = "Programmierpraktikum I: Java";
	const courseId = "java-wise1920";
	const totalCourseCount = 4;

	beforeEach(() => {
		cy.request({
			method: "POST",
			url: "http://localhost:3000/auth/login",
			body: { email: "not.in.course@test.com", password: "no_pw_required" }
		}).then(resp => {
			window.localStorage.setItem("studentMgmtToken", JSON.stringify(resp.body));
		});
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

	it.only("Clicking on course navigates to course", () => {
		cy.get(".course-filter-container #semester")
			.contains(getSemesterString(getSemester(new Date())))
			.click()
			.get("[data-option-all]")
			.click();

		cy.get("[data-course-title]").contains(courseName).click();
		cy.get("input[type=password]").type("password");
		cy.get(".btn-join").click();
	});
});
