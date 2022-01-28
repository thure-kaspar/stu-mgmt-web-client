import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Create Assessment", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments/edit/new"
		);
	});

	it("Displays CreateAssessmentComponent", () => {
		cy.getBySelector(Selector.createAssessment.component).should("be.visible");
	});

	it("Selecting a group", () => {
		selectGroup();
	});

	it("Selecting a participant", () => {
		const participant = "mustermann";

		cy.getBySelector(Selector.createAssessment.searchParticipantButton).click();
		cy.getBySelector(Selector.searchParticipantDialog.component).should("be.visible");

		cy.getBySelector(Selector.searchParticipantDialog.nameTextField).type(participant);
		cy.getBySelector(Selector.searchParticipantDialog.usernameButton).should("have.length", 1);

		cy.getBySelector(Selector.searchParticipantDialog.usernameButton)
			.contains(participant)
			.click();
		cy.getBySelector(Selector.searchParticipantDialog.confirmButton).click();

		cy.getBySelector(Selector.assessmentTarget.participantName).contains(participant, {
			matchCase: false
		});
	});

	it("Add partial assessment", () => {
		addPartialAssessment();
	});

	it("Fill out form and submit -> Creates Assessment and navigates to it", () => {
		cy.getBySelector(Selector.createAssessment.createButton).should("be.disabled");
		cy.getBySelector(Selector.assessmentForm.achievedPointsTextField).clear().type("100");
		selectGroup();
		addPartialAssessment();
		cy.getBySelector(Selector.createAssessment.createButton).should("not.be.disabled").click();
		cy.url().should("contain", "/assessments/view/");
		cy.getBySelector(Selector.assessmentViewer.component).should("be.visible");
	});
});

function addPartialAssessment() {
	cy.getBySelector(Selector.assessmentForm.addPartialAssessmentButton)
		.getBySelector("addButton")
		.click();

	cy.getBySelector(Selector.assessmentForm.partialAssessmentTitleTextField).type("Aufgabe 1");
	cy.getBySelector(Selector.assessmentForm.partialAssessmentPointsTextField).type("5");
	cy.getBySelector(Selector.assessmentForm.partialAssessmentCommentTextField).type(
		"Lorem ipsum..."
	);

	cy.getBySelector(Selector.assessmentForm.addWarningMarkerButton).click();
	cy.getBySelector(Selector.editMarkerDialog.component).should("be.visible");
	cy.getBySelector(Selector.editMarkerDialog.saveButton).should("be.disabled");

	// TODO: First command is ignored (clear does not work)
	cy.getBySelector(Selector.editMarkerDialog.startLineNumberTextField).clear().type("1");
	cy.getBySelector(Selector.editMarkerDialog.endLineNumberTextField).clear().type("1");
	cy.getBySelector(Selector.editMarkerDialog.pointsTextField).type("-1");
	cy.getBySelector(Selector.editMarkerDialog.commentTextField).type("Lorem ipsum...");
	cy.getBySelector(Selector.editMarkerDialog.pathTextField).type("Main.java");

	cy.getBySelector(Selector.editMarkerDialog.saveButton).should("not.be.disabled").click();
}

/** Selects `Testgroup 2` as target for the assessment. */
function selectGroup() {
	const groupName = "Testgroup 2";

	cy.getBySelector(Selector.createAssessment.searchGroupButton).click();
	cy.getBySelector(Selector.registeredGroupsDialog.component).should("be.visible");

	cy.getBySelector(Selector.registeredGroupsDialog.groupNameTextField).type(groupName);
	cy.getBySelector(Selector.registeredGroupsDialog.nameButton).should("have.length", 1);

	cy.getBySelector(Selector.registeredGroupsDialog.nameButton).contains(groupName).click();
	cy.getBySelector(Selector.registeredGroupsDialog.confirmButton).click();

	cy.getBySelector(Selector.assessmentTarget.groupName).contains(groupName);
}
