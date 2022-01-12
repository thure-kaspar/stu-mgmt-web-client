import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Participants list", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses/java-wise1920/users");
	});

	it("Displays ParticipantsListComponent", () => {
		cy.getBySelector(Selector.participantsList.component).should("be.visible");
	});

	it("Displays participants", () => {
		// 7 Participants in this course
		cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 7);
	});

	it("Filters participants by name", () => {
		cy.getBySelector(Selector.participantsList.usernameTextField).type("mustermann");
		cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 1);
		cy.contains("Max Mustermann");
	});

	it("Filters participants by group", () => {
		cy.getBySelector(Selector.participantsList.groupNameTextField).type("Testgroup 1");
		// Group has 2 members
		cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 2);
	});

	describe("Filters by role", () => {
		it("Student", () => {
			cy.get(
				"#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-inner-container"
			).click();
			cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 4);
		});

		it("Tutor", () => {
			cy.get(
				"#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container"
			).click();
			cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 2);
		});

		it("Student", () => {
			cy.get(
				"#mat-checkbox-3 > .mat-checkbox-layout > .mat-checkbox-inner-container"
			).click();
			cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 1);
		});
	});

	describe("Change Role", () => {
		it("Promote Student to Tutor", () => {
			cy.getBySelector(Selector.participantsList.tutorChip).should("have.length", 2);

			cy.contains("Max Mustermann")
				.parent()
				.parent()
				.within(() => {
					cy.getBySelector(Selector.participantsList.userMenuButton).click();
				});

			cy.getBySelector(Selector.participantsList.changeRoleButton).click();

			cy.getBySelector(Selector.changeRoleDialog.component).should("be.visible");

			cy.get("#mat-radio-3 > .mat-radio-label > .mat-radio-label-content").click();
			cy.getBySelector(Selector.changeRoleDialog.saveButton).click();

			cy.getBySelector(Selector.changeRoleDialog.component).should("not.exist");
			cy.getBySelector(Selector.participantsList.tutorChip).should("have.length", 3);
		});
	});

	describe("Remove participant", () => {
		it("Remove participant", () => {
			cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 7);

			cy.getBySelector(Selector.participantsList.userMenuButton).last().click();
			cy.getBySelector(Selector.participantsList.removeParticipantButton).click();

			cy.getBySelector(Selector.confirmDialog.component).should("be.visible");
			cy.getBySelector(Selector.confirmDialog.confirmButton).click();

			cy.getBySelector(Selector.participantsList.userMenuButton).should("have.length", 6);
		});
	});
});
