import { getSemesterString } from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	CourseDto,
	IndividualPercentWithAllowedFailuresRuleDto,
	OverallPercentRuleDto
} from "@student-mgmt/api-client";
import { resetDemoDb } from "../support/api";
import { account, useAccount } from "../support/auth";
import { Selector } from "../support/elements";

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

const btnCreate = ".btn-create";

const courseSettings = Selector.courseSettings;

function fillOutBasicDataForm(): void {
	cy.getBySelector(courseSettings.basicData.shortnameTextField).type(NEW_COURSE.shortname);
	cy.getBySelector(courseSettings.basicData.semesterSelectBox)
		.click()
		.get(".mat-option")
		.contains(getSemesterString(NEW_COURSE.semester))
		.click();
	cy.getBySelector(courseSettings.basicData.titleTextField).type(NEW_COURSE.title);

	// Create button should no longer be disabled
	cy.get(".btn-create").should("not.be.disabled");
}

describe("Create Course", () => {
	beforeEach(() => {
		useAccount(account.mgmtAdmin);
		cy.visit("/new-course");
	});

	describe("Basic Data", () => {
		it("Should display CourseFormComponent", () => {
			cy.getBySelector(courseSettings.basicData.component).should("be.visible");
		});

		it("Should fill out the form", () => {
			cy.getBySelector(courseSettings.basicData.idTextField).type(NEW_COURSE.id);
			cy.getBySelector(courseSettings.basicData.shortnameTextField).type(
				NEW_COURSE.shortname
			);
			cy.getBySelector(courseSettings.basicData.semesterSelectBox)
				.click()
				.get(".mat-option")
				.contains(getSemesterString(NEW_COURSE.semester))
				.click();
			cy.getBySelector(courseSettings.basicData.titleTextField).type(NEW_COURSE.title);
		});
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

	describe("Lecturer Settings", () => {
		beforeEach(() => {
			cy.contains("Lehrende").click();
		});

		it("Adding a lecturer", () => {
			addLecturer();
		});
	});

	describe("Course creation", () => {
		before(() => {
			resetDemoDb();
		});

		after(() => {
			resetDemoDb();
		});

		it("Should create course", () => {
			fillOutBasicDataForm();
			cy.contains("Lehrende").click();
			addLecturer();

			// Clicking "Create" and "Confirm" should create course
			cy.get(btnCreate).click();
			cy.getBySelector(Selector.confirmBtn).click();

			// Should navigate to newly created course
			cy.url().should("contain", NEW_COURSE.id);
			cy.contains(NEW_COURSE.title);
		});
	});
});

function addLecturer() {
	const searchUserDialog = "#search-user-dialog";
	const btnAddLecturer = "#btn-add-lecturer";
	const lecturerUsername = "mAdmin";

	cy.get(btnAddLecturer).click();
	cy.get(searchUserDialog).should("exist");

	// Dialog should contain user "mAdmin", which will be selected
	cy.get(searchUserDialog).contains("tr", lecturerUsername).find(".mat-checkbox").click();

	// Clicking Ok should close dialog
	cy.get(".btn-ok").click();
	cy.get(searchUserDialog).should("not.exist");

	// Selected user should be listed as lecturer
	cy.get("input").first().should("have.value", lecturerUsername);
}
