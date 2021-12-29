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

	assignmentCreate: {
		component: "assignmentCreateComponent",
		createButton: "createButton"
	},

	assignmentForm: {
		assignmentFormComponent: "assignmentFormComponent",
		nameTextField: "nameTextField",
		pointsTextField: "pointsTextField",
		bonusPointsTextField: "bonusPointsTextField",
		typeOption: "typeOption",
		collaborationTypeOption: "collaborationTypeOption",
		stateOption: "stateOption",
		addLinkButton: "addLinkButton",
		linkNameTextField: "linkNameTextField",
		linkUrlTextField: "linkUrlTextField",
		addConfigButton: "addConfigButton",
		toolTextField: "toolTextField",
		configTextField: "configTextField"
	},

	/** Course related selectors. */
	course: {
		sidebarCourseLink: "sidebar-course-link",
		myGroupTab: "my-group-tab"
	},

	courseList: {
		component: "CourseListComponent",
		createCourseButton: "createCourseButton",
		semesterSelectBox: "semesterSelectBox",
		titleTextField: "titleTextField",
		linkToCourse: "linkToCourse"
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
		},
		basicData: {
			component: "CourseFormComponent",
			titleTextField: "titleTextField",
			idTextField: "idTextField",
			shortnameTextField: "shortnameTextField",
			semesterSelectBox: "semesterSelectBox",
			isClosedSelectBox: "isClosedSelectBox",
			addLinkButton: "addLinkButton",
			removeLinkButton: "removeLinkButton"
		}
	},

	joinCourseDialog: {
		dialog: "join-course-dialog",
		errorMessage: "join-course-error"
	},

	createGroupDialog: {
		component: "createGroupDialog",
		nameTextField: "nameTextField",
		passwordTextField: "passwordTextField",
		multipleTab: "multipleTab",
		createButton: "createButton",
		cancelButton: "cancelButton"
	},

	createGroupMultiple: {
		component: "createGroupMultipleComponent",
		groupNamesTextArea: "groupNamesTextArea",
		prefixTextField: "prefixTextField",
		countTextField: "countTextField"
	},

	createGroupStudent: {
		component: "createGroupStudentDialog",
		nameTextField: "nameTextField",
		passwordTextField: "passwordTextField",
		createButton: "createButton",
		cancelButton: "cancelButton"
	},

	groupList: {
		component: "groupListComponent",
		addGroupButton: "addGroupButton",
		excludeEmptyGroupsCheckbox: "excludeEmptyGroupsCheckbox"
	},

	groupDetail: {
		component: "groupDetailComponent"
	},

	groupCard: {
		component: "groupCardComponent"
	}
} as const;
