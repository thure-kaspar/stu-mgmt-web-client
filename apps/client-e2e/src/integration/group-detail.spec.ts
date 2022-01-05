import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Group Detail", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses/java-wise1920/groups/b4f24e81-dfa4-4641-af80-8e34e02d9c4a");
	});

	it("Displays GroupDetailComponent", () => {
		cy.getBySelector(Selector.groupDetail.component).should("be.visible");
	});

	it("Change group name", () => {
		cy.getBySelector(Selector.groupDetail.editGroupButton).click();
		cy.getBySelector(Selector.editGroupDialog.component).should("be.visible");
		cy.getBySelector(Selector.editGroupDialog.nameTextField).clear().type("New Name");
		cy.getBySelector(Selector.editGroupDialog.saveButton).click();
		cy.contains("New Name").should("exist");
	});

	it("Adding participant", () => {
		cy.getBySelector(Selector.personList.name).should("have.length", 2);

		cy.getBySelector(Selector.groupDetail.addMemberButton).click();
		cy.getBySelector(Selector.searchParticipantDialog.component).should("be.visible");
		cy.getBySelector(Selector.searchParticipantDialog.usernameButton).contains("jdoe").click();
		cy.getBySelector(Selector.searchParticipantDialog.confirmButton).click();

		cy.getBySelector(Selector.personList.name).should("have.length", 3);
	});

	it("Remove group -> Removes group and navigates to group list", () => {
		cy.getBySelector(Selector.groupDetail.removeGroupButton).click();
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();
		cy.getBySelector(Selector.groupList.component).should("be.visible");
		cy.getBySelector(Selector.groupCard.component).should("have.length", 1);
	});

	describe("Requires additional DB reset", () => {
		before(() => {
			resetDemoDb();
		});

		it("Removing participant", () => {
			cy.getBySelector(Selector.personList.name).should("have.length", 2);
			cy.getBySelector(Selector.personList.removeParticipantButton).first().click();
			cy.getBySelector(Selector.confirmDialog.confirmButton).click();
			cy.getBySelector(Selector.personList.name).should("have.length", 1);
		});
	});
});
