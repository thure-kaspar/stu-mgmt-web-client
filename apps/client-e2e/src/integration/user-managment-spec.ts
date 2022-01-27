import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("User Management", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/admin/user-management");
	});

	it("Displays UserManagementComponent", () => {
		cy.getBySelector(Selector.userManagement.component).should("be.visible");
	});

	it("Displays users", () => {
		cy.getBySelector(Selector.userManagement.userOptionsMenu).should(
			"have.length.greaterThan",
			1
		);
	});

	it("Filters users", () => {
		cy.getBySelector(Selector.userManagement.nameTextField).type("mustermann");
		cy.getBySelector(Selector.userManagement.userOptionsMenu).should("have.length", 1);
	});

	describe("Edit User", () => {
		before(() => {
			resetDemoDb();
		});

		it("Changes role from User to MGMT_ADMIN", () => {
			cy.get(".cdk-column-username")
				.contains("jdoe")
				.parent()
				.within(() => {
					cy.contains("USER");
					cy.getBySelector(Selector.userManagement.userOptionsMenu).first().click();
				});

			cy.getBySelector(Selector.userManagement.editButton).click();

			cy.getBySelector(Selector.updateUserDialog.component).should("be.visible");
			cy.get("#mat-radio-3 > .mat-radio-label > .mat-radio-label-content").click();
			cy.getBySelector(Selector.updateUserDialog.saveButton).click();

			cy.getBySelector(Selector.updateUserDialog.component).should("not.exist");

			cy.get(".cdk-column-username")
				.contains("jdoe")
				.parent()
				.within(() => {
					cy.contains("MGMT_ADMIN");
				});
		});
	});
});
