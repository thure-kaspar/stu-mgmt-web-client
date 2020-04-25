import { Component, OnInit } from "@angular/core";
import { CoursesService, CourseConfigDto, CourseDto, UserDto } from "../../../../api";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { SearchCourseDialog } from "../course/dialogs/search-course/search-course.dialog";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { SearchUserDialog } from "../course/dialogs/search-user/search-user.dialog";

@Component({
	selector: "app-create-course",
	templateUrl: "./create-course.component.html",
	styleUrls: ["./create-course.component.scss"]
})
export class CreateCourseComponent implements OnInit {

	/**
	 * Form with the structure of a CourseConfigDto.
	 */
	form: FormGroup;

	constructor(private courseService: CoursesService,
				private fb: FormBuilder,
				private dialog: MatDialog,
				private snackbar: MatSnackBar) {

		this.form = this.fb.group({
			course: this.fb.group({
				id: [null,],
				shortname: [null, Validators.required],
				semester: ["sose2020", Validators.required],
				title: [null, Validators.required],
				isClosed: [false, Validators.required],
				password: [null],
				link: [null],
				allowGroups: [null, Validators.required],
				maxGroupSize: [null, Validators.required],
			}),
			configuration: this.fb.group({
				notificationUrl: [null]
			}),
			lecturers: this.fb.array([this.fb.control(null)])
		});
	}

	ngOnInit(): void {
		
	}

	createCourse(): void {
		const config: CourseConfigDto = this.form.value; // TODO: Course as parent object of form, instead of config

		const dialogData: ConfirmDialogData = {
			params: [] 
		};

		this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, { data: dialogData })
			.afterClosed().subscribe(
				isConfirmed => {
					if (isConfirmed) {
						// TODO: Course creation with config not implemented in backend
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
	 * Fills the form with the configuration of the selected course.
	 */
	loadCourseTemplate(courseId: string): void {
		// TODO: Reimplement with new api
		// this.courseService.getCourseConfig(courseId).subscribe(
		// 	result => {
		// 		this.form.patchValue(result);
		// 		this.getLecturers().clear();
		// 		result.lecturers.forEach(lec => {
		// 			this.getLecturers().push(
		// 				this.fb.control(lec.username)
		// 			);
		// 		});
		// 	},
		// 	error => {
		// 		console.log(error);
		// 		this.snackbar.open("Failed to load course config.", "OK", { duration: 3000 });
		// 	}
		// );
	}

	/**
	 * Adds an additional input field for a lecturer.
	 */
	addLecturer(): void {
		this.getLecturers().push(this.fb.control(null));
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
		return (this.form.get("lecturers") as FormArray);
	}

}
