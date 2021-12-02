import { resetDemoDb } from "../../support/api";
import { account, useAccount } from "../../support/auth";
import { Selector } from "../../support/elements";
import { navigateToCourse } from "../../support/navigation";

const courseThatSuggestsJoiningAGroup = "java-wise1920";

function joinCourse(courseId: string): void {
	navigateToCourse(courseId);
	cy.get("input[type=password]").type("password");
	cy.get(".btn-join").click();
}

describe("Suggest Group Join", () => {
	beforeEach(() => {
		resetDemoDb();
	});

	describe("Course that suggests joining a group", () => {
		beforeEach(() => {
			useAccount(account.notInCourse);
			joinCourse(courseThatSuggestsJoiningAGroup);
		});

		it("User declines -> Dialog closes | NOOP ", () => {
			// User is not in a group initially
			cy.getBySelector(Selector.course.myGroupTab).should("not.exist");

			// User declines automatic group join
			cy.get(".confirm-dialog").getBySelector(Selector.cancelBtn).click();

			// Dialog should be closed
			cy.get(".confirm-dialog").should("not.exist");

			// User did not join a group
			cy.getBySelector(Selector.course.myGroupTab).should("not.exist");
		});

		it("User accepts -> User joins a group", () => {
			// User is not in a group initially
			cy.getBySelector(Selector.course.myGroupTab).should("not.exist");

			// User accepts automatic group join
			cy.get(".confirm-dialog").getBySelector(Selector.confirmBtn).click();

			// Dialog should be closed
			cy.get(".confirm-dialog").should("not.exist");

			// User joined a group
			cy.getBySelector(Selector.course.myGroupTab).should("exist");

			// Should inform user about his new group
			cy.get(".toast-info").should("contain.text", "Du wurdest automatisch der Gruppe");
		});
	});

	// TODO Ensure dialog does not open, if course has disabled this feature
});
