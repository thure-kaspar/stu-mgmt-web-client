import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CoursesService, CourseConfigDto } from "../../../../api";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

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
				private snackbar: MatSnackBar) {

		this.form = this.fb.group({
			course: this.fb.group({
				id: [null,],
				shortname: [null, Validators.required],
				semester: [null, Validators.required],
				title: [null, Validators.required],
				isClosed: [null, Validators.required],
				password: [null],
				link: [null],
				allowGroups: [null, Validators.required],
				maxGroupSize: [null, Validators.required],
			}),
			lecturers: this.fb.array([this.fb.control(null)])
		});
	}

	ngOnInit(): void {
	}

	createCourse(): void {
		const config: CourseConfigDto = this.form.value;
		// TODO: Course creation with config not implemented in backend
	}

	/**
	 * Fills the form with the configuration of the selected course.
	 */
	loadCourseTemplate(courseId: string): void {
		this.courseService.getCourseConfig(courseId).subscribe(
			result => {
				this.form.patchValue(result);
				this.getLecturers().clear();
				result.lecturers.forEach(lec => {
					this.getLecturers().push(
						this.fb.control(lec.username)
					);
				});
			},
			error => {
				console.log(error);
				this.snackbar.open("Failed to load course config.", "OK", { duration: 3000 });
			}
		);
	}

	/**
	 * Adds an additional input field for a lecturer.
	 */
	addLecturer(): void {
		this.getLecturers().push(this.fb.control(null));
	}

	/**
	 * Helper method to retrieve the lecturer-FormArray of the form.
	 */
	getLecturers(): FormArray {
		return (this.form.get("lecturers") as FormArray);
	}

}
