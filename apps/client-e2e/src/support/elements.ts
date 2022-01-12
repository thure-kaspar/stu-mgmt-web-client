/**
 * Object that contains selectors for DOM elements that might be interesting for testing.
 *
 * @example cy.get(Selector.assignments).should("have.length", 4) // Course should have 4 assignments
 */
export const Selector = {
	confirmDialog: {
		component: "confirmDialogComponent",
		confirmButton: "btn-confirm",
		cancelButton: "btn-cancel"
	},

	/** Confirm button inside the `ConfirmDialog`. */
	confirmBtn: "btn-confirm",
	/** Cancel button inside the `ConfirmDialog`. */
	cancelBtn: "btn-cancel",

	openLoginDialogButton: "openLoginDialogButton",
	logoutButton: "logoutButton",

	loginDialog: {
		component: "loginDialog",
		usernameTextField: "usernameTextField",
		passwordTextField: "passwordTextField",
		loginButton: "loginButton",
		cancelButton: "cancelButton"
	},

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

	createdAssessments: {
		component: "createdAssessmentsComponent",
		createAssessmentButton: "createAssessmentButton",
		viewAssessmentButton: "viewAssessmentButton"
	},

	createAssessment: {
		component: "createAssessmentComponent",
		createButton: "createButton",
		searchGroupButton: "searchGroupButton",
		searchParticipantButton: "searchParticipantButton",
		noAssessmentTargetWarning: "noAssessmentTargetWarning"
	},

	editAssessment: {
		component: "editAssessmentComponent",
		saveButton: "saveButton",
		saveAsDraftButton: "saveAsDraftButton"
	},

	assessmentForm: {
		component: "assessmentFormComponent",
		partialAssessmentForm: "partialAssessmentForm",
		achievedPointsTextField: "achievedPointsTextField",
		draftOnlyToggle: "draftOnlyToggle",
		partialAssessmentTitleTextField: "partialAssessmentTitleTextField",
		partialAssessmentKeyTextField: "partialAssessmentKeyTextField",
		partialAssessmentPointsTextField: "partialAssessmentPointsTextField",
		partialAssessmentCommentTextField: "partialAssessmentCommentTextField",
		addWarningMarkerButton: "addWarningMarkerButton",
		editMarkerButton: "editMarkerButton",
		removeMarkerButton: "removeMarkerButton",
		removePartialAssessmentButton: "removePartialAssessmentButton",
		addPartialAssessmentButton: "addPartialAssessmentButton"
	},

	assessmentViewer: {
		component: "assessmentViewerComponent"
	},

	assessmentTarget: {
		groupName: "assessmentTargetGroupName",
		participantName: "assessmentTargetDisplayName"
	},

	editMarkerDialog: {
		component: "editMarkerDialog",
		pathTextField: "pathTextField",
		startLineNumberTextField: "startLineNumberTextField",
		endLineNumberTextField: "endLineNumberTextField",
		startColumnNumberTextField: "startColumnNumberTextField",
		endColumnNumberTextField: "endColumnNumberTextField",
		pointsTextField: "pointsTextField",
		commentTextField: "commentTextField",
		saveButton: "saveButton",
		cancelButton: "cancelButton"
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

	participantsList: {
		component: "participantsListComponent",
		usernameTextField: "usernameTextField",
		groupNameTextField: "groupNameTextField",
		userMenuButton: "userMenuButton",
		changeRoleButton: "changeRoleButton",
		removeParticipantButton: "removeParticipantButton",
		lecturerChip: "lecturerChip",
		tutorChip: "tutorChip",
		studentChip: "studentChip"
	},

	changeRoleDialog: {
		component: "changeRoleDialog",
		saveButton: "saveButton",
		cancelButton: "cancelButton"
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
		component: "groupDetailComponent",
		editGroupButton: "editGroupButton",
		leaveGroupButton: "leaveGroupButton",
		removeGroupButton: "removeGroupButton",
		addMemberButton: "addMemberButton"
	},

	groupCard: {
		component: "groupCardComponent",
		groupCardMenuButton: "groupCardMenuButton",
		addParticipantButton: "addParticipantButton",
		deleteGroupButton: "deleteGroupButton"
	},

	registeredGroupCard: {
		component: "registeredGroupCardComponent",
		groupCardMenuButton: "groupCardMenuButton",
		addParticipantButton: "addParticipantButton",
		removeRegistrationButton: "removeRegistrationButton"
	},

	registeredGroups: {
		component: "registeredGroupsComponent",
		registerGroupButton: "registerGroupButton",
		registerCurrentGroupsButton: "registerCurrentGroupsButton",
		UnregisterAllGroupsButton: "UnregisterAllGroupsButton",
		filterTextField: "filterTextField"
	},

	editGroupDialog: {
		component: "editGroupDialog",
		nameTextField: "nameTextField",
		passwordTextField: "passwordTextField",
		saveButton: "saveButton",
		cancelButton: "cancelButton"
	},

	searchParticipantDialog: {
		component: "searchParticipantDialog",
		nameTextField: "nameTextField",
		usernameButton: "usernameButton",
		confirmButton: "confirmButton",
		cancelButton: "cancelButton"
	},

	searchGroupDialog: {
		component: "searchGroupDialog",
		nameInputField: "nameInputField",
		nameButton: "nameButton",
		confirmButton: "confirmButton",
		cancelButton: "cancelButton"
	},

	personList: {
		component: "personListComponent",
		name: "personListName",
		removeParticipantButton: "removeParticipantButton"
	}
} as const;
