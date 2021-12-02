import {
	AdmissionCriteriaDto,
	CourseDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto
} from "../../../api";
import { getSemester, getSemesterString } from "@student-mgmt-client/util-helper";
import { account, useAccount } from "../../support/auth";
import { Selector } from "../../support/elements";

const ADMISSION_RULE_HOMEWORK_OVERALL_50_PERCENT_ROUNDING_NEXT_INTEGER: OverallPercentRuleDto = {
	type: "REQUIRED_PERCENT_OVERALL",
	assignmentType: "HOMEWORK",
	requiredPercent: 50,
	achievedPercentRounding: {
		type: "UP_NEAREST_INTEGER"
	}
};

const ADMISSION_RULE_TESTAT_OVERALL_50_PERCENT_ROUNDING_NEXT_INTEGER: OverallPercentRuleDto = {
	type: "REQUIRED_PERCENT_OVERALL",
	assignmentType: "TESTAT",
	requiredPercent: 50,
	achievedPercentRounding: {
		type: "DECIMALS",
		decimals: 0
	}
};

const ADMISSION_RULE_INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES: IndividualPercentWithAllowedFailuresRuleDto =
	{
		type: "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES",
		assignmentType: "HOMEWORK",
		requiredPercent: 50,
		achievedPercentRounding: {
			type: "NONE"
		},
		allowedFailures: 2
	};

export const ADMISSION_CRITERIA_MOCK: AdmissionCriteriaDto = {
	rules: [
		ADMISSION_RULE_HOMEWORK_OVERALL_50_PERCENT_ROUNDING_NEXT_INTEGER,
		ADMISSION_RULE_TESTAT_OVERALL_50_PERCENT_ROUNDING_NEXT_INTEGER,
		ADMISSION_RULE_INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES
	]
};

export const NEW_COURSE: CourseDto = {
	id: "new-course-sose2021",
	shortname: "new-course",
	semester: "sose2021",
	title: "A New Course",
	isClosed: false,
	links: [
		{
			name: "Example URL #1",
			url: "http://example-url-2.com"
		},
		{
			name: "Example URL #2",
			url: "http://example-url-2.com"
		}
	],
	groupSettings: {
		allowGroups: true,
		nameSchema: "JAVA-",
		sizeMin: 2,
		sizeMax: 3,
		selfmanaged: true,
		autoJoinGroupOnCourseJoined: true,
		mergeGroupsOnAssignmentStarted: true
	},
	admissionCriteria: ADMISSION_CRITERIA_MOCK
};

function getTextInput(formControlName: string) {
	return cy.get(`input[formcontrolname='${formControlName}']`);
}

function getSelectInput(formControlName: string) {
	return cy.get(`mat-select[formcontrolname='${formControlName}']`);
}

const btnCreate = ".btn-create";

describe("Create Course", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/courses/create");
	});

	describe("Create Button", () => {
		it("Is disabled by default", () => {
			cy.get(btnCreate).should("be.disabled");
		});

		it("Adding shortname, semester and title -> Button is enabled (form valid)", () => {
			// Basic data should be default tab
			fillOutBasicDataForm();
		});
	});

	describe.only("Lecturer Settings", () => {
		const searchUserDialog = "#search-user-dialog";
		const btnAddLecturer = "#btn-add-lecturer";
		const lecturerUsername = "mAdmin";

		beforeEach(() => {
			fillOutBasicDataForm();
			cy.contains("Lehrende").click();
		});

		it("Adding a lecturer", () => {
			// Opening "Add Lecturer" should open user search dialog
			cy.get(btnAddLecturer).click();
			cy.get(searchUserDialog).should("exist");

			// Dialog should contain user "mAdmin", which will be selected
			cy.get(searchUserDialog).contains("tr", lecturerUsername).find(".mat-checkbox").click();

			// Clicking Ok should close dialog
			cy.get(".btn-ok").click();
			cy.get(searchUserDialog).should("not.exist");

			// Selected user should be listed as lecturer
			cy.get("input").first().should("have.value", lecturerUsername);

			// Clicking "Create" and "Confirm" should create course
			cy.get(btnCreate).click();
			cy.getBySelector(Selector.confirmBtn).click();

			// Should navigate to newly created course
			cy.url().should("contain", NEW_COURSE.id);
			cy.contains(NEW_COURSE.title);
		});
	});
});

function fillOutBasicDataForm(): void {
	cy.get("#basic-data").should("be.visible");

	// Enter shortname, semester and title
	getTextInput("shortname").type(NEW_COURSE.shortname);
	getSelectInput("semester")
		.click()
		.get(".mat-option")
		.contains(getSemesterString(NEW_COURSE.semester))
		.click();
	getTextInput("title").type(NEW_COURSE.title);

	// Create button should no longer be disabled
	cy.get(".btn-create").should("not.be.disabled");
}
