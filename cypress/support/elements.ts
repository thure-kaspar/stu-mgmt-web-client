/**
 * Object that contains selectors for DOM elements that might be interesting for testing.
 *
 * @example cy.get(Selector.assignments).should("have.length", 4) // Course should have 4 assignments
 */
export const Selector = {
	/** Confirm button inside the `ConfirmDialog`. */
	confirmBtn: "btn-confirm",
	/** Cancel button inside the `ConfirmDialog`. */
	cancelBtn: "btn-cancel",

	/** Assignment related selectors. */
	assignment: {
		/** Matches all assignment cards on the `/courses/{courseId}/assignments` page. */
		card: "assignment-card"
	},

	/** Course related selectors. */
	course: {
		sidebarCourseLink: "sidebar-course-link",
		courseListLink: "course-list-link",
		myGroupTab: "my-group-tab"
	},

	courseSettings: {
		tabs: {
			basicData: "basicDataTab",
			groupSettings: "groupSettingsTab",
			secrets: "secretsTab",
			admissionCriteria: "admissionCriteriaTab",
			assignmentTemplates: "assignmentTemplatesTab",
			admissionFromPreviousSemester: "admissionFromPreviousSemesterTab",
			lecturers: "lecturersTab"
		}
	},

	joinCourseDialog: {
		dialog: "join-course-dialog",
		errorMessage: "join-course-error"
	}
} as const;
