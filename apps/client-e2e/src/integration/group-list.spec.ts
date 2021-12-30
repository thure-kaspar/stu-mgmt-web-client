import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Group List", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses/java-wise1920/groups");
	});

	it("Displays GroupListComponent", () => {
		cy.getBySelector(Selector.groupList.component).should("be.visible");
	});

	it("Hides empty groups by default > Shows all groups when checkbox unchecked", () => {
		cy.getBySelector(Selector.groupCard.component).should("have.length", 2);

		toggleExcludeEmptyGroups();

		cy.getBySelector(Selector.groupCard.component).should("have.length", 3);
	});

	it("Displays closed groups", () => {
		cy.getBySelector(Selector.groupCard.component).should("have.length", 2);
		toggleExcludeEmptyGroups();
		toggleClosedGroups();
		cy.getBySelector(Selector.groupCard.component).should("have.length", 1);
	});

	it("Displays open groups", () => {
		toggleExcludeEmptyGroups();
		cy.getBySelector(Selector.groupCard.component).should("have.length", 3);
		toggleOpenGroups();
		cy.getBySelector(Selector.groupCard.component).should("have.length", 2);
	});

	describe("Group Card", () => {
		it("Adds participant ", () => {
			cy.getBySelector(Selector.groupCard.groupCardMenuButton).first().click();
			cy.getBySelector(Selector.groupCard.addParticipantButton).click();
			cy.getBySelector(Selector.searchParticipantDialog.component).contains("mAdmin").click();
			cy.getBySelector(Selector.searchParticipantDialog.confirmButton).click();
			cy.get(
				"student-mgmt-person-list.ng-star-inserted > .flex-col.gap-4 > :nth-child(3)"
			).should("exist"); // TODO: Find better assertion
		});

		it("Deletes group", () => {
			cy.getBySelector(Selector.groupCard.component).contains("Testgroup 1").should("exist");

			cy.getBySelector(Selector.groupCard.groupCardMenuButton).first().click();
			cy.getBySelector(Selector.groupCard.deleteGroupButton).click();
			cy.getBySelector(Selector.confirmDialog.component).should("be.visible");
			cy.getBySelector(Selector.confirmDialog.confirmButton).click();

			cy.getBySelector(Selector.groupCard.component)
				.contains("Testgroup 1")
				.should("not.exist");
		});
	});
});

function toggleOpenGroups() {
	cy.get("#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-label").click();
}

function toggleClosedGroups() {
	cy.get("#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-label").click();
}

function toggleExcludeEmptyGroups() {
	cy.get(
		"[data-test=excludeEmptyGroupsCheckbox] > .mat-checkbox-layout > .mat-checkbox-label"
	).click();
}
