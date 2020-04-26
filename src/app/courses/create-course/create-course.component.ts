import { Component, OnInit } from "@angular/core";
import { CoursesService, CourseDto, UserDto, CourseConfigService, Rule, AssignmentTemplateDto, AssignmentDto, CourseCreateDto } from "../../../../api";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { SearchCourseDialog } from "../course/dialogs/search-course/search-course.dialog";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { SearchUserDialog } from "../course/dialogs/search-user/search-user.dialog";
import { Router } from "@angular/router";

@Component({
	selector: "app-create-course",
	templateUrl: "./create-course.component.html",
	styleUrls: ["./create-course.component.scss"]
})
export class CreateCourseComponent implements OnInit { // TODO: Refactor: Split into components

	/**
	 * Form with the structure of a CourseCreateDto.
	 */
	form: FormGroup;

	scopeEnum = Rule.ScopeEnum;
	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(private courseService: CoursesService,
				private courseConfigService: CourseConfigService,
				private fb: FormBuilder,
				private dialog: MatDialog,
				private snackbar: MatSnackBar,
				private router: Router) {

		this.form = this.fb.group({
			id: [null],
			shortname: [null, Validators.required],
			semester: ["sose2020", Validators.required], // TODO: Insert current semester automatically
			title: [null, Validators.required],
			isClosed: [false, Validators.required],
			link: [null],
			config: this.fb.group({
				password: [null] ,
				subscriptionUrl: [null],
				groupSettings: this.fb.group({
					allowGroups: [false, Validators.required],
					nameSchema: [null],
					sizeMin: [0, [Validators.required, Validators.min(0)]],
					sizeMax: [3, [Validators.required, Validators.min(0)]],
					selfmanaged: [false, Validators.required]
				}),
				admissionCriteria: this.fb.group({
					criteria: this.fb.array([])
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

		this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, { data }).afterClosed().subscribe(
			isConfirmed => {
				if (isConfirmed) {
					this.courseService.createCourse(course).subscribe(
						result => {
							this.snackbar.open("Course has been created!", "OK", { duration: 3000 });
							this.router.navigateByUrl(`/courses/${result.semester}/${result.shortname}`);
						},
						error => {
							console.log(error);
							this.snackbar.open("Failed", "OK", { duration: 3000 });
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
				config.admissionCriteria?.criteria.forEach(c=> this.addCriteria(c));

				// Insert assignment templates
				config.assignmentTemplates?.forEach(t => this.addAssignmentTemplate(t));
			}
		);

		// Load lecturers 
		this.getLecturers().clear();
		this.courseService.getUsersOfCourse(courseId).subscribe(
			users => {
				const lecturers = users.filter(u => u.courseRole === "LECTURER");// TODO: Use filter once implemented to avoid loading all users
				lecturers.forEach(lecturer => this.getLecturers().push(this.fb.control(lecturer.username, Validators.required)));
			}
		);
	}

	/**
	 * Adds an additional input field for a lecturer.
	 */
	addLecturer(): void {
		this.getLecturers().push(this.fb.control(null, Validators.required));
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

	/** Adds additional input fields to a admission criteria rule. */
	addCriteria(criteria?: Rule): void {
		this.getCriteria().push(this.fb.group({
			scope: [criteria?.scope || null, Validators.required],
			type: [criteria?.type || null, Validators.required],
			requiredPercent: [criteria?.requiredPercent || 50, [Validators.required, Validators.min(0), Validators.max(100)]]
		}));

		//console.log(this.form.get("admissionCriteria"));
	}

	/** Removes the criteria at the given position. */
	removeCriteria(index: number): void {
		this.getCriteria().removeAt(index);
	}

	/** Helper methods to retrieve the assignmentCriteria-formArray of the form. */
	getCriteria(): FormArray {
		return this.form.get("config.admissionCriteria.criteria") as FormArray;
	}

	addAssignmentTemplate(template?: AssignmentTemplateDto): void {
		this.getAssignmentTemplates().push(this.fb.group({
			templateName: [template?.templateName || "Unnamed template", Validators.required],
			name: [template?.name || null],
			state: [template?.state || null],
			type: [template?.type || null, Validators.required],
			collaboration: [template?.collaboration || null, Validators.required],
			points: [template?.points ||null],
			bonusPoints: [template?.bonusPoints || null],
			timespanDays: [template?.timespanDays || null]
		}));
	}

	removeAssignmentTemplate(index: number): void {
		this.getAssignmentTemplates().removeAt(index);
	}

	getAssignmentTemplates(): FormArray {
		return this.form.get("config.assignmentTemplates") as FormArray;
	}

	getAssignmentTemplateName(index: number): string {
		return this.form.get("config.assignmentTemplates." + index ).get("templateName").value as string;
	}

}
