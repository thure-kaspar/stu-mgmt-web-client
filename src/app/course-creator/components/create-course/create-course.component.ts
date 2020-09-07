import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AssignmentDto, CourseConfigService, CourseCreateDto, CourseDto, CourseParticipantsService, CoursesService, ParticipantDto, UserDto } from "../../../../../api";
import { getSemester } from "../../../../../utils/helper";
import { AdmissionCriteriaForm } from "../../../course-settings/forms/admission-criteria-form/admission-criteria-form.component";
import { AssignmentTemplatesForm } from "../../../course-settings/forms/assignment-templates-form/assignment-templates-form.component";
import { CourseForm } from "../../../course-settings/forms/course-form/course-form.component";
import { GroupSettingsForm } from "../../../course-settings/forms/group-settings-form/group-settings-form.component";
import { SearchCourseDialog } from "../../../course/dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "../../../course/dialogs/search-user/search-user.dialog";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
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
	@ViewChild(AdmissionCriteriaForm, { static: true }) admissionCriteriaForm: AdmissionCriteriaForm;
	@ViewChild(AssignmentTemplatesForm, { static: true }) assignmentTemplatesForm: AssignmentTemplatesForm;

	constructor(private courseService: CoursesService,
				private courseConfigService: CourseConfigService,
				private courseParticipantsService: CourseParticipantsService,
				private fb: FormBuilder,
				private dialog: MatDialog,
				private snackbar: SnackbarService,
				private router: Router) {

		this.form = this.fb.group({
			id: [null],
			shortname: [null, Validators.required],
			semester: [getSemester(), Validators.required],
			title: [null, Validators.required],
			isClosed: [false, Validators.required],
			links: this.fb.array([]),
			config: this.fb.group({
				password: [null] ,
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
			lecturers: this.fb.array([]),
		});
	}

	ngOnInit(): void {
	}

	createCourse(): void {
		const course: CourseCreateDto = this.form.value;
		const data: ConfirmDialogData = {
			params: [course.title, course.semester] 
		};

		this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data }).afterClosed().subscribe(
			isConfirmed => {
				if (isConfirmed) {
					this.courseService.createCourse(course).subscribe(
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
			}
		);
	}

	/**
	 * Opens a dialog that allows the user to search and select a course. 
	 * The selected course will be returned to this component and it's configuration will be loaded
	 * as a template for the creation of a new course.
	 */
	openSearchCourseDialog(): void {
		this.dialog.open<SearchCourseDialog, undefined, CourseDto[]>(SearchCourseDialog).afterClosed().subscribe(
			courses => {
				// Check if user selected a course (Dialog returns all selected courses)
				if (courses[0]) {
					this.loadCourseTemplate(courses[0].id);
				}
			}
		);
	}

	/**
	 * Opens the SearchUserDialog and inserts the username of the chosen user as as lecturer.
	 */
	openSearchUserDialog(index: number): void {
		this.dialog.open<SearchUserDialog, undefined, UserDto[]>(SearchUserDialog).afterClosed().subscribe(
			users => {
				if (users[0]) {
					// Insert username of returned user in the input field of the form
					this.getLecturers().at(index).setValue(users[0].username);
				}
			}
		);
	}

	/**
	 * Fills the form with the basic data and configuration of the selected course.
	 */
	loadCourseTemplate(courseId: string): void {
		// Load basic course data
		this.courseService.getCourseById(courseId).subscribe(
			course => this.form.patchValue(course)
		);

		// Load course config
		this.courseConfigService.getCourseConfig(courseId).subscribe(
			config => {
				this.form.get("config").patchValue(config);

				// Insert admission criteria
				//config.admissionCriteria?.criteria.forEach(c=> this.admissionCriteriaForm.addCriteria(c));

				// Insert assignment templates
				config.assignmentTemplates?.forEach(t => this.assignmentTemplatesForm.addAssignmentTemplate(t));
			}
		);

		// Load lecturers 
		this.getLecturers().clear();
		this.courseParticipantsService.getUsersOfCourse(courseId, undefined, undefined, [ParticipantDto.RoleEnum.LECTURER]).subscribe(
			lecturers => {
				lecturers.forEach(lecturer => this.getLecturers().push(this.fb.control(lecturer.username, Validators.required)));
			}
		);
	}

	/**
	 * Adds an additional input field for a lecturer.
	 */
	addLecturer(): void {
		this.getLecturers().push(this.fb.control(null, Validators.required));
		this.openSearchUserDialog(this.getLecturers().length - 1);
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
