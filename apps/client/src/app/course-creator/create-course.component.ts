import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, NgModule, ViewChild } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import {
	ConfirmDialog,
	ConfirmDialogData,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { getSemester } from "@student-mgmt-client/util-helper";
import {
	AssignmentDto,
	CourseApi,
	CourseConfigApi,
	CourseCreateDto,
	CourseDto,
	CourseParticipantsApi,
	ParticipantDto,
	UserDto
} from "@student-mgmt/api-client";
import { CourseSettingsModule } from "../course-settings/course-settings.module";
import { AdmissionCriteriaFormComponent } from "../course-settings/forms/admission-criteria-form/admission-criteria-form.component";
import { CourseFormComponent } from "../course-settings/forms/course-form/course-form.component";
import { GroupSettingsFormComponent } from "../course-settings/forms/group-settings-form/group-settings-form.component";
import { SearchCourseDialog } from "../course/dialogs/search-course/search-course.dialog";
import { SearchUserDialog } from "../course/dialogs/search-user/search-user.dialog";

@Component({
    selector: "student-mgmt-create-course",
    templateUrl: "./create-course.component.html",
    styleUrls: ["./create-course.component.scss"],
    standalone: false
})
export class CreateCourseComponent {
	/** Form with the structure of a CourseCreateDto. */
	form: UntypedFormGroup;

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	@ViewChild(CourseFormComponent, { static: true }) courseForm: CourseFormComponent;

	@ViewChild(GroupSettingsFormComponent, { static: true })
	// eslint-disable-next-line indent
	groupSettingsForm: GroupSettingsFormComponent;

	@ViewChild(AdmissionCriteriaFormComponent, { static: true })
	// eslint-disable-next-line indent
	admissionCriteriaForm: AdmissionCriteriaFormComponent;

	constructor(
		private courseApi: CourseApi,
		private courseConfigApi: CourseConfigApi,
		private courseParticipantsApi: CourseParticipantsApi,
		private fb: UntypedFormBuilder,
		private dialog: MatDialog,
		private toast: ToastService,
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
				})
			}),
			lecturers: this.fb.array([])
		});
	}

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
							this.toast.success(course.title, "Message.Created");
							this.router.navigateByUrl(`/courses/${result.id}`);
						},
						error => {
							this.toast.apiError(error);
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

			// TODO
			// Insert admission criteria
			//config.admissionCriteria?.criteria.forEach(c=> this.admissionCriteriaForm.addCriteria(c));
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
	getLecturers(): UntypedFormArray {
		return this.form.get("lecturers") as UntypedFormArray;
	}
}

@NgModule({
	declarations: [CreateCourseComponent],
	exports: [CreateCourseComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDialogModule,
		MatCardModule,
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		TranslateModule,
		IconComponentModule,
		CourseSettingsModule
	]
})
export class CreateCourseComponentModule {}
