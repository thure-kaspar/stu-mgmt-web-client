import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

const form = Selector.assignmentForm;

describe("Assignment Creation", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses/java-wise1920/new-assignment");
	});

	it("Should navigate to AssignmentCreateComponent", () => {
		cy.getBySelector(Selector.assignmentCreate.component).should("be.visible");
	});

	it("Has correct default values", () => {
		cy.getBySelector(Selector.assignmentCreate.createButton).should("be.disabled");

		cy.getBySelector(form.typeOption)
			.first()
			.contains("Hausaufgabe")
			.parent()
			.should("have.class", "mat-radio-checked");

		cy.getBySelector(form.collaborationTypeOption)
			.first()
			.contains("Gruppenabgabe")
			.parent()
			.should("have.class", "mat-radio-checked");

		cy.getBySelector(form.stateOption)
			.contains("Laufend")
			.parent()
			.should("have.class", "mat-radio-checked");
	});

	it("Fill out the form", () => {
		fillOutForm();
	});

	describe("With Backend", () => {
		beforeEach(() => {
			resetDemoDb();
		});

		it("Create -> Navigates to AssignmentList", () => {
			fillOutForm();
			cy.getBySelector(Selector.assignmentCreate.createButton).click();
			cy.url().should("contain", "/courses/java-wise1920/assignments");
			cy.getBySelector(Selector.assignment.card).contains("New Assignment");
		});
	});
});

function fillOutForm() {
	cy.getBySelector(form.nameTextField).type("New Assignment");
	cy.getBySelector(form.pointsTextField).type("42");
	cy.getBySelector(form.bonusPointsTextField).type("0");

	cy.getBySelector(Selector.assignmentCreate.createButton).should("not.be.disabled");

	cy.getBySelector(form.addLinkButton).find("[data-test=addButton]").click();
	cy.getBySelector(form.linkNameTextField).type("My Link");
	cy.getBySelector(form.linkUrlTextField).type("http://example.url");

	cy.getBySelector(form.addConfigButton).find("[data-test=addButton]").click();
	cy.getBySelector(form.toolTextField).type("My Tool");
	cy.getBySelector(form.configTextField).type("My Config");
}
