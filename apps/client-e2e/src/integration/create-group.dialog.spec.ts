import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

const createGroupDialog = Selector.createGroupDialog;
const createGroupMultiple = Selector.createGroupMultiple;
const createGroupStudent = Selector.createGroupStudent;

describe("CreateGroupDialog", () => {
	before(() => {
		resetDemoDb();
	});

	describe("As Lecturer", () => {
		beforeEach(() => {
			useAccount(account.mgmtAdmin);
			cy.visit("/courses/java-wise1920/groups");
			cy.get(
				"[data-test=excludeEmptyGroupsCheckbox] > .mat-checkbox-layout > .mat-checkbox-inner-container"
			).click();
			cy.getBySelector(Selector.groupList.addGroupButton).click();
		});

		it("Should open the dialog", () => {
			cy.getBySelector(createGroupDialog.component).should("be.visible");
		});

		it("Create Group", () => {
			cy.getBySelector(createGroupDialog.createButton).should("be.disabled");
			cy.getBySelector(createGroupDialog.nameTextField).type("New Group");
			cy.getBySelector(createGroupDialog.createButton).should("not.be.disabled");

			cy.getBySelector(createGroupDialog.createButton).click();

			// Navigates to GroupDetailComponent
			cy.getBySelector(Selector.groupDetail.component).should("be.visible");
		});

		describe("Create Multiple", () => {
			beforeEach(() => {
				cy.contains("Mehrere").click();
			});

			it("Using list of group names", () => {
				cy.getBySelector(createGroupMultiple.component);
				cy.getBySelector(createGroupMultiple.groupNamesTextArea).type(
					"NewGroup-1\nNewGroup-2\nNewGroup-3"
				);

				cy.getBySelector(createGroupDialog.createButton).click();

				cy.contains("NewGroup-1");
				cy.contains("NewGroup-2");
				cy.contains("NewGroup-3");
			});

			it("Using prefix and count", () => {
				cy.get(".mat-slide-toggle-thumb").click();
				cy.getBySelector(createGroupMultiple.prefixTextField).type("JAVA-");
				cy.getBySelector(createGroupMultiple.countTextField).type("3");

				cy.getBySelector(createGroupDialog.createButton).click();

				cy.contains("JAVA-1");
				cy.contains("JAVA-2");
				cy.contains("JAVA-3");
			});
		});
	});

	describe("As Student", () => {
		beforeEach(() => {
			useAccount(account.student);
			cy.visit("/courses/java-wise1920/groups");
			cy.getBySelector(Selector.groupList.addGroupButton).click();

			// Must leave current group before creating new group
			cy.getBySelector(Selector.confirmBtn).click();
		});

		it("Create Group", () => {
			cy.getBySelector(createGroupStudent.component).should("be.visible");

			cy.getBySelector(createGroupStudent.nameTextField).type("MyNewGroup");

			cy.getBySelector(createGroupStudent.passwordTextField).type("123");

			cy.getBySelector(createGroupStudent.createButton).click();

			// Navigates to GroupDetailComponent
			cy.getBySelector(Selector.groupDetail.component).should("be.visible");
		});
	});
});
