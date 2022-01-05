import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Registered Groups", () => {
	const courseId = "java-wise1920";
	const assignmentId = "f50b8474-1fb9-4d69-85a2-76648d0fd3f9";
	const assignmentName = "Test_Assignment 08 (Java) - GROUP - IN_REVIEW";
	const totalGroupCount = 3;

	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(`/courses/${courseId}/assignments/${assignmentId}/assessments/registrations`);
	});

	it("Displays RegisteredGroupsComponent", () => {
		cy.contains(assignmentName);
		cy.getBySelector(Selector.registeredGroups.component).should("be.visible");
		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"have.length",
			totalGroupCount
		);
	});

	it("Filters by group name", () => {
		cy.getBySelector(Selector.registeredGroups.filterTextField).type("Testgroup 3");
		cy.getBySelector(Selector.registeredGroupCard.component).should("have.length", 1);
	});

	it("Filters by participant display name", () => {
		cy.getBySelector(Selector.registeredGroups.filterTextField).type("mustermann");
		cy.getBySelector(Selector.registeredGroupCard.component).should("have.length", 1);
	});

	it("Remove participant", () => {
		const deletedDisplayName = "Hans Peter"; // must be first user

		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"contain.text",
			deletedDisplayName
		);

		cy.getBySelector(Selector.personList.removeParticipantButton).first().click();
		cy.getBySelector(Selector.confirmDialog.component).should("be.visible");
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"not.contain.text",
			deletedDisplayName
		);
	});

	it("Add participant to group -> Adds participant", () => {
		const username = "jdoe";
		const displayName = "John Doe";

		cy.getBySelector(Selector.registeredGroupCard.groupCardMenuButton).first().click();
		cy.getBySelector(Selector.registeredGroupCard.addParticipantButton).click();
		cy.getBySelector(Selector.searchParticipantDialog.component).should("be.visible");
		cy.getBySelector(Selector.searchParticipantDialog.nameTextField).type(username);
		cy.getBySelector(Selector.searchParticipantDialog.usernameButton)
			.contains(username)
			.click();
		cy.getBySelector(Selector.searchParticipantDialog.confirmButton).click();
		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"contain.text",
			displayName
		);
	});

	it("Remove group", () => {
		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"have.length",
			totalGroupCount
		);

		cy.getBySelector(Selector.registeredGroupCard.groupCardMenuButton).first().click();
		cy.getBySelector(Selector.registeredGroupCard.removeRegistrationButton).click();
		cy.getBySelector(Selector.confirmDialog.component).should("be.visible");
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should(
			"have.length",
			totalGroupCount - 1
		);
	});

	it("Unregister all groups", () => {
		cy.getBySelector(Selector.registeredGroupCard.component).should("have.length.at.least", 1);

		cy.getBySelector(Selector.registeredGroups.UnregisterAllGroupsButton).click();
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should("not.exist");
	});

	it("Register Group", () => {
		cy.getBySelector(Selector.registeredGroups.UnregisterAllGroupsButton).click();
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should("not.exist");

		cy.getBySelector(Selector.registeredGroups.registerGroupButton).click();
		cy.getBySelector(Selector.searchGroupDialog.component).should("be.visible");
		cy.getBySelector(Selector.searchGroupDialog.nameButton).contains("Testgroup 1").click();
		cy.getBySelector(Selector.searchGroupDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component);
	});

	it("Register all groups", () => {
		cy.getBySelector(Selector.registeredGroups.UnregisterAllGroupsButton).click();
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should("not.exist");

		cy.getBySelector(Selector.registeredGroups.registerCurrentGroupsButton).click();
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();

		cy.getBySelector(Selector.registeredGroupCard.component).should("have.length", 2);
	});
});
