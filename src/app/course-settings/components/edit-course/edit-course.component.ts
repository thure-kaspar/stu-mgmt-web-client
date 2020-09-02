import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AssignmentDto, AssignmentTemplateDto, CourseConfigDto, CourseConfigService, CourseConfigUpdateDto, CourseDto, CoursesService } from "../../../../../api";
import { getSemester } from "../../../../../utils/helper";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { CreateAssignmentTemplateDialog, CreateAssignmentTemplateDialogData } from "../../dialogs/create-assignment-template/create-assignment-template.dialog";
import { EditAssignmentTemplateDialog, EditAssignmentTemplateDialogData } from "../../dialogs/edit-assignment-template/edit-assignment-template.dialog";
import { AdmissionCriteriaForm } from "../../forms/admission-criteria-form/admission-criteria-form.component";
import { AssignmentTemplatesForm } from "../../forms/assignment-templates-form/assignment-templates-form.component";
import { CourseForm } from "../../forms/course-form/course-form.component";
import { GroupSettingsForm } from "../../forms/group-settings-form/group-settings-form.component";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-edit-course",
	templateUrl: "./edit-course.component.html",
	styleUrls: ["./edit-course.component.scss"]
})
export class EditCourseComponent extends UnsubscribeOnDestroy implements OnInit {

	/** Form with the structure of a CourseCreateDto. */
	form: FormGroup;

	/** Index of the selected tab. */
	selectedIndex = 0;
	private tabs = ["basic-data", "group-settings", "secrets", "admission-criteria", "assignment-templates"];

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	@ViewChild(CourseForm, { static: true }) courseForm: CourseForm;
	@ViewChild(GroupSettingsForm, { static: true }) groupSettingsForm: GroupSettingsForm;
	@ViewChild(AdmissionCriteriaForm, { static: true }) admissionCriteriaForm: AdmissionCriteriaForm;
	@ViewChild(AssignmentTemplatesForm, { static: true }) assignmentTemplatesForm: AssignmentTemplatesForm;

	courseId: string;
	course: CourseDto;
	courseConfig: CourseConfigDto;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private courseConfigService: CourseConfigService,
		private courseService: CoursesService,
		private dialog: MatDialog,
		private snackbar: SnackbarService
	) {
		super();

		this.form = this.fb.group({
			id: [null],
			shortname: [null, Validators.required],
			semester: [getSemester(), Validators.required],
			title: [null, Validators.required],
			isClosed: [false, Validators.required],
			link: [null],
			config: this.fb.group({
				password: [null],
				subscriptionUrl: [null],
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
					criteria: this.fb.array([])
				}),
				assignmentTemplates: this.fb.array([])
			}),
			lecturers: this.fb.array([]),
		});
	}

	ngOnInit(): void {
		this.courseId = this.route.parent.snapshot.paramMap.get("courseId");
		this.subs.sink = this.courseConfigService.getCourseConfig(this.courseId).subscribe(
			result => {
				{
					this.courseConfig = result;
					this.form.get("config").patchValue(this.courseConfig);

					// Insert admission criteria
					//result.admissionCriteria?.criteria?.forEach(c => this.admissionCriteriaForm.addCriteria(c));
				}
			}
		);

		this.subs.sink = this.courseService.getCourseById(this.courseId).subscribe(
			result => {
				this.course = result;
				// Insert basic data
				this.courseForm.form.patchValue(this.course);
			}
		);

		this.subs.sink = this.route.fragment.subscribe(
			fragment => {
				this.selectedIndex = this.tabs.findIndex(tab => tab === fragment) ?? 0;
			}
		);
	}

	tabChanged(index: number): void {
		this.router.navigate([], { fragment: this.tabs[index] });
	}

	onSave(): void {
		const courseData = this.form.value;
		const groupSettings = this.form.get("config.groupSettings").value;
		const config: CourseConfigUpdateDto = {
			password: this.form.get("config.password").value,
			subscriptionUrl: this.form.get("config.subscriptionUrl").value
		};
		// const admissionCriteria: AdmissionCriteriaDto = {
		// 	criteria: this.admissionCriteriaForm.getCriteria().value
		// };

		// TODO: Display feedback / errors, Maybe split into seperate components
		this.courseService.updateCourse(courseData, this.courseId).subscribe();
		this.courseConfigService.updateCourseConfig(config, this.courseId).subscribe();
		this.courseConfigService.updateGroupSettings(groupSettings, this.courseId).subscribe();
		//this.courseConfigService.updateAdmissionCriteria(admissionCriteria, this.courseId).subscribe();
	}

	openCreateAssignmentTemplateDialog(): void {
		const data: CreateAssignmentTemplateDialogData = { courseId: this.courseId, configId: this.courseConfig.id };
		this.subs.sink = this.dialog.open<CreateAssignmentTemplateDialog, CreateAssignmentTemplateDialogData, AssignmentTemplateDto>(CreateAssignmentTemplateDialog, { data })
			.afterClosed().subscribe(
				template => {
					if (template) {
						this.courseConfig.assignmentTemplates.push(template);
					}
				}
			);
	}

	openEditAssignmentTemplateDialog(template: AssignmentTemplateDto): void {
		const data: EditAssignmentTemplateDialogData = { template: template, courseId: this.courseId };
		this.subs.sink = this.dialog.open<EditAssignmentTemplateDialog, EditAssignmentTemplateDialogData, AssignmentTemplateDto>(EditAssignmentTemplateDialog, { data })
			.afterClosed().subscribe(
				update => {
					if (update) {
						// Update local list by replacing the updated assignment
						const updatedList = this.courseConfig.assignmentTemplates.map(t => {
							if (t.id !== update.id) {
								return t;
							} else {
								return update;
							}
						});
						this.courseConfig.assignmentTemplates = updatedList;
					}
				}
			);
	}

	/**
	 * Calls the API to delete the given template. 
	 * If removal was successful, the template will be removed from the courseConfig.assignmentTemplates.
	 */
	deleteAssignmentTemplate(template: AssignmentTemplateDto): void {
		const data: ConfirmDialogData = { params: [template.templateName] };
		this.subs.sink = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data }).afterClosed().subscribe(
			confirmed => {
				if (confirmed) {
					this.courseConfigService.deleteAssignmentTemplate(this.courseId, template.id).subscribe(
						deleted => {
							this.snackbar.openSuccessMessage();
							this.courseConfig.assignmentTemplates = this.courseConfig.assignmentTemplates.filter(t => t.id !== template.id);
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

}
