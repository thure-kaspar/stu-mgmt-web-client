import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

describe("Edit Assessment", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments/edit/0d365334-6cb3-4ac5-b0fe-0b1a5aa1fbf4"
		);
	});

	it("Displays EditAssessmentComponent", () => {
		cy.getBySelector(Selector.editAssessment.component).should("be.visible");
	});

	it("Save as Draft -> Navigates to AssessmentViewerComponent", () => {
		cy.getBySelector(Selector.editAssessment.saveAsDraftButton).click();
		cy.url().should("contain", "/assessments/view/");
		cy.getBySelector(Selector.assessmentViewer.component).should("be.visible");
	});

	it("Save -> Navigates to AssessmentViewerComponent", () => {
		editAssessment();
		cy.getBySelector(Selector.editAssessment.component).within(_component => {
			cy.getBySelector(Selector.editAssessment.saveButton).click();
		});
		cy.url().should("contain", "/assessments/view/");
		cy.getBySelector(Selector.assessmentViewer.component).should("be.visible");
	});
});

describe("Convert Group Assessment to individual assessment", () => {
	before(() => {
		resetDemoDb();
	});

	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments/edit/0d365334-6cb3-4ac5-b0fe-0b1a5aa1fbf4"
		);
	});

	it("Creates assessment for each member and navigates to assessment overview", () => {
		cy.getBySelector(Selector.editAssessment.convertToIndividualAssessmentButton).click();
		cy.getBySelector(Selector.confirmDialog.component).should("be.visible");
		cy.getBySelector(Selector.confirmDialog.confirmButton).click();
		cy.getBySelector(Selector.createdAssessments.component).should("be.visible");
		cy.getBySelector(Selector.createdAssessments.viewAssessmentButton).should("have.length", 2);
	});
});

/**
 * Performs changes to the assessment:
 * - Changes achieved points
 * - Removes first marker of partial assessment
 * - adds new partial assessment
 */
function editAssessment() {
	// Change points
	cy.getBySelector(Selector.assessmentForm.achievedPointsTextField).clear().type("10");

	// Remove first marker
	cy.getBySelector(Selector.assessmentForm.removeMarkerButton).first().click();
	cy.getBySelector(Selector.confirmBtn).click();

	// Add new partial assessment
	cy.getBySelector(Selector.assessmentForm.addPartialAssessmentButton)
		.find("[data-test=addButton]")
		.click();

	cy.getBySelector(Selector.assessmentForm.partialAssessmentForm)
		.last()
		.within(_form => {
			cy.getBySelector(Selector.assessmentForm.partialAssessmentTitleTextField).type(
				"Aufgabe 1"
			);
			cy.getBySelector(Selector.assessmentForm.partialAssessmentPointsTextField).type("5");
			cy.getBySelector(Selector.assessmentForm.partialAssessmentCommentTextField).type(
				"Lorem ipsum..."
			);
			cy.getBySelector(Selector.assessmentForm.addWarningMarkerButton).click();
		});

	// Add marker to new partial assessment
	cy.getBySelector(Selector.editMarkerDialog.component).within(_editMarkerDialog => {
		cy.getBySelector(Selector.editMarkerDialog.saveButton).should("be.disabled");

		// TODO: First command is ignored (clear does not work)
		cy.getBySelector(Selector.editMarkerDialog.startLineNumberTextField).clear().type("1");
		cy.getBySelector(Selector.editMarkerDialog.endLineNumberTextField).clear().type("1");
		cy.getBySelector(Selector.editMarkerDialog.pointsTextField).type("-1");
		cy.getBySelector(Selector.editMarkerDialog.commentTextField).type("Lorem ipsum...");
		cy.getBySelector(Selector.editMarkerDialog.pathTextField).type("Main.java");

		cy.getBySelector(Selector.editMarkerDialog.saveButton).should("not.be.disabled").click();
	});
}
