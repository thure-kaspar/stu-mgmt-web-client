import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

const assessmentsOverview = Selector.createdAssessments;

describe("Assessments Overview", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit(
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments"
		);
	});

	it("Displays AssessmentOverviewComponent", () => {
		cy.getBySelector(assessmentsOverview.component).should("be.visible");
	});

	it("Create Assessment navigates to CreateAssessmentComponent", () => {
		cy.getBySelector(assessmentsOverview.createAssessmentButton).click();
		cy.getBySelector(Selector.createAssessment.component).should("be.visible");
		cy.url().should(
			"contain",
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments/edit/new"
		);
	});

	it("View Assessment navigates to AssessmentViewerComponent", () => {
		cy.getBySelector(assessmentsOverview.viewAssessmentButton).click();
		cy.getBySelector(Selector.assessmentViewer.component).should("be.visible");
		cy.url().should(
			"contain",
			"/courses/java-wise1920/assignments/f50b8474-1fb9-4d69-85a2-76648d0fd3f9/assessments/view/0d365334-6cb3-4ac5-b0fe-0b1a5aa1fbf4"
		);
	});
});
