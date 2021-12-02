import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
	AssignmentDto,
	CourseConfigApi,
	CourseCreateDto,
	CourseDto,
	CourseParticipantsApi,
	CourseApi,
	ParticipantDto,
	UserDto
} from "@student-mgmt/api-client";
import { getSemester } from "@student-mgmt-client/util-helper";
import { AdmissionCriteriaForm } from "../../../course-settings/forms/admission-criteria-form/admission-criteria-form.component";
import { AssignmentTemplatesForm } from "../../../course-settings/forms/assignment-templates-form/assignment-templates-form.component";
import { CourseForm } from "../../../course-settings/forms/course-form/course-form.component";
import { GroupSettingsForm } from "../../../course-settings/forms/group-settings-form/group-settings-form.component";
import { SearchCourseDialog } from "../../../course/dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "../../../course/dialogs/search-user/search-user.dialog";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Component({
	selector: "app-create-course",
	templateUrl: "./create-course.component.html",
	styleUrls: ["./create-course.component.scss"]
})
export class CreateCourseComponent implements OnInit {
	/** Form with the structure of a CourseCreateDto. */
	form: FormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	@ViewChild(CourseForm, { static: true }) courseForm: CourseForm;
	@ViewChild(GroupSettingsForm, { static: true }) groupSettingsForm: GroupSettingsForm;
	@ViewChild(AdmissionCriteriaForm, { static: true })
	admissionCriteriaForm: AdmissionCriteriaForm;
	@ViewChild(AssignmentTemplatesForm, { static: true })
	assignmentTemplatesForm: AssignmentTemplatesForm;

	constructor(
		private courseApi: CourseApi,
		private courseConfigApi: CourseConfigApi,
		private courseParticipantsApi: CourseParticipantsApi,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private snackbar: SnackbarService,
		private router: Router,
		private cdRef: ChangeDetectorRef
	) {
		this.form = this.fb.group({
			id: [null],
			shortname: [null, Validators.required],
			semester: [getSemester(new Date()), Validators.required],
			title: [null, Validators.required],
			isClosed: [false, Validators.required],
			links: this.fb.array([]),
			config: this.fb.group({
				password: [null],
				groupSettings: this.fb.group({
					allowGroups: [false, Validators.required],
					nameSchema: [null],
					sizeMin: [0, [Validators.required, Validators.min(0)]],
					sizeMax: [3, [Validators.required, Validators.min(0)]],
					selfmanaged: [false, Validators.required],
					autoJoinGroupOnCourseJoined: [false, Validators.required],
					mergeGroupsOnAssignmentStarted: [false, Validators.required]
				}),
				admissionCriteria: this.fb.group({
					rules: this.fb.array([])
				}),
				assignmentTemplates: this.fb.array([])
			}),
			lecturers: this.fb.array([])
		});
	}

	ngOnInit(): void {}

	createCourse(): void {
		const course: CourseCreateDto = this.form.value;
		const data: ConfirmDialogData = {
			params: [course.title, course.semester]
		};

		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(isConfirmed => {
				if (isConfirmed) {
					this.courseApi.createCourse(course).subscribe(
						result => {
							this.snackbar.openSuccessMessage("Course has been created!");
							this.router.navigateByUrl(`/courses/${result.id}`);
						},
						error => {
							console.log(error);
							this.snackbar.openErrorMessage();
						}
					);
				}
			});
	}

	/**
	 * Opens a dialog that allows the user to search and select a course.
	 * The selected course will be returned to this component and it's configuration will be loaded
	 * as a template for the creation of a new course.
	 */
	openSearchCourseDialog(): void {
		this.dialog
			.open<SearchCourseDialog, undefined, CourseDto[]>(SearchCourseDialog)
			.afterClosed()
			.subscribe(courses => {
				// Check if user selected a course (Dialog returns all selected courses)
				if (courses && courses[0]) {
					this.loadCourseTemplate(courses[0].id);
				}
			});
	}

	/**
	 * Fills the form with the basic data and configuration of the selected course.
	 */
	loadCourseTemplate(courseId: string): void {
		// Load basic course data
		this.courseApi.getCourseById(courseId).subscribe(course => this.form.patchValue(course));

		// Load course config
		this.courseConfigApi.getCourseConfig(courseId).subscribe(config => {
			this.form.get("config").patchValue(config);

			// Insert admission criteria
			//config.admissionCriteria?.criteria.forEach(c=> this.admissionCriteriaForm.addCriteria(c));

			// Insert assignment templates
			config.assignmentTemplates?.forEach(t =>
				this.assignmentTemplatesForm.addAssignmentTemplate(t)
			);
		});

		// Load lecturers
		this.getLecturers().clear();
		this.courseParticipantsApi
			.getUsersOfCourse(courseId, undefined, undefined, [ParticipantDto.RoleEnum.LECTURER])
			.subscribe(lecturers => {
				lecturers.forEach(lecturer =>
					this.getLecturers().push(
						this.fb.control(lecturer.username, Validators.required)
					)
				);
			});
	}

	/**
	 * Adds an additional input field for a lecturer.
	 */
	addLecturer(): void {
		this.dialog
			.open<SearchUserDialog, undefined, UserDto[]>(SearchUserDialog)
			.afterClosed()
			.subscribe(users => {
				const lecturer = users?.[0];

				if (lecturer) {
					// Insert username of returned user in the input field of the form
					this.getLecturers().push(
						this.fb.control(lecturer.username, Validators.required)
					);
					this.cdRef.detectChanges();
				}
			});
	}

	/**
	 * Removes the lecturer at the given position.
	 */
	removeLecturer(index: number): void {
		this.getLecturers().removeAt(index);
	}

	/**
	 * Helper method to retrieve the lecturer-FormArray of the form.
	 */
	getLecturers(): FormArray {
		return this.form.get("lecturers") as FormArray;
	}
}
