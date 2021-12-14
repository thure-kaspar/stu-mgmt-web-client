import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import {
	ConfirmDialog,
	ConfirmDialogData,
	IconComponentModule,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/shared-ui";
import { getSemester } from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	AssignmentDto,
	AssignmentTemplateDto,
	CourseApi,
	CourseConfigApi,
	CourseConfigDto,
	CourseConfigUpdateDto,
	CourseDto,
	GroupSettingsUpdateDto
} from "@student-mgmt/api-client";
import { Subject } from "rxjs";
import { CourseSettingsModule } from "../course-settings/course-settings.module";
import {
	CreateAssignmentTemplateDialog,
	CreateAssignmentTemplateDialogData
} from "../course-settings/dialogs/create-assignment-template/create-assignment-template.dialog";
import {
	EditAssignmentTemplateDialog,
	EditAssignmentTemplateDialogData
} from "../course-settings/dialogs/edit-assignment-template/edit-assignment-template.dialog";
import { AdmissionCriteriaFormComponent } from "../course-settings/forms/admission-criteria-form/admission-criteria-form.component";
import { AssignmentTemplatesFormComponent } from "../course-settings/forms/assignment-templates-form/assignment-templates-form.component";
import { CourseFormComponent } from "../course-settings/forms/course-form/course-form.component";
import { GroupSettingsFormComponent } from "../course-settings/forms/group-settings-form/group-settings-form.component";

@Component({
	selector: "student-mgmt-course-edit",
	templateUrl: "./course-edit.component.html",
	styleUrls: ["./course-edit.component.scss"]
})
export class CourseEditComponent extends UnsubscribeOnDestroy implements OnInit {
	/** Form with the structure of a CourseCreateDto. */
	form: FormGroup;

	/** Index of the selected tab. */
	selectedIndex = 0;
	private tabs = [
		"basic-data",
		"group-settings",
		"secrets",
		"admission-criteria",
		"admission-from-previous-semester",
		"assignment-templates",
		"notifications"
	];

	stateEnum = AssignmentDto.StateEnum;
	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	@ViewChild(CourseFormComponent, { static: true }) courseForm: CourseFormComponent;
	@ViewChild(GroupSettingsFormComponent, { static: true })
	groupSettingsForm: GroupSettingsFormComponent;
	@ViewChild(AdmissionCriteriaFormComponent, { static: true })
	admissionCriteriaForm: AdmissionCriteriaFormComponent;
	@ViewChild(AssignmentTemplatesFormComponent, { static: true })
	assignmentTemplatesForm: AssignmentTemplatesFormComponent;

	courseId: string;
	course: CourseDto;
	courseConfig: CourseConfigDto;

	assignmentTemplates$ = new Subject<AssignmentTemplateDto[]>();

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private courseConfigApi: CourseConfigApi,
		private courseApi: CourseApi,
		private dialog: MatDialog,
		private toast: ToastService
	) {
		super();

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
			})
		});
	}

	ngOnInit(): void {
		this.courseId = this.route.parent.snapshot.paramMap.get("courseId");
		this.subs.sink = this.courseConfigApi.getCourseConfig(this.courseId).subscribe(result => {
			{
				this.courseConfig = result;
				this.form.get("config").patchValue(this.courseConfig);

				// Insert admission criteria
				result.admissionCriteria?.rules?.forEach(rule =>
					this.admissionCriteriaForm.addRule(rule)
				);

				this.assignmentTemplates$.next(this.courseConfig.assignmentTemplates);
			}
		});

		this.subs.sink = this.courseApi.getCourseById(this.courseId).subscribe(result => {
			this.course = result;
			// Insert basic data
			this.courseForm.form.patchValue(this.course);

			if (this.course.links?.length > 0) {
				this.course.links.forEach(link => {
					this.courseForm.addLink(link);
				});
			}
		});

		this.subs.sink = this.route.fragment.subscribe(fragment => {
			if (!fragment) {
				this.router.navigate([], { fragment: "basic-data" });
			}
			this.selectedIndex = this.tabs.findIndex(tab => tab === fragment) ?? 0;
		});
	}

	tabChanged(index: number): void {
		this.router.navigate([], { fragment: this.tabs[index] });
	}

	saveBasicData(): void {
		const update: CourseDto = this.form.value;

		this.subs.sink = this.courseApi.updateCourse(update, this.courseId).subscribe({
			next: result => {
				this.form.patchValue(result);
				this.toast.success("Misc.BasicDate", "Message.Saved");
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	saveGroupsSettings(): void {
		const groupSettings: GroupSettingsUpdateDto = this.form.get("config.groupSettings").value;

		this.subs.sink = this.courseConfigApi
			.updateGroupSettings(groupSettings, this.courseId)
			.subscribe({
				next: result => {
					this.form.get("config.groupSettings").patchValue(result);
					this.toast.success("Domain.GroupSettings", "Message.Saved");
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	saveSecrets(): void {
		const secrets: CourseConfigUpdateDto = {
			password: this.form.get("config.password").value as string
		};

		this.subs.sink = this.courseConfigApi.updateCourseConfig(secrets, this.courseId).subscribe({
			next: result => {
				this.form.get("config").patchValue(result);
				this.toast.success("Misc.Secrets", "Message.Saved");
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	saveAdmissionCriteria(): void {
		const criteria: AdmissionCriteriaDto = this.form.get("config.admissionCriteria").value;

		this.subs.sink = this.courseConfigApi
			.updateAdmissionCriteria(criteria, this.courseId)
			.subscribe({
				next: result => {
					this.form.get("config.admissionCriteria").patchValue(result);
					this.toast.success("Domain.AdmissionCriteria", "Message.Saved");
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	openCreateAssignmentTemplateDialog(): void {
		const data: CreateAssignmentTemplateDialogData = {
			courseId: this.courseId,
			configId: this.courseConfig.id
		};
		this.subs.sink = this.dialog
			.open<
				CreateAssignmentTemplateDialog,
				CreateAssignmentTemplateDialogData,
				AssignmentTemplateDto
			>(CreateAssignmentTemplateDialog, { data })
			.afterClosed()
			.subscribe(template => {
				if (template) {
					this.courseConfig.assignmentTemplates.push(template);
					this.assignmentTemplates$.next(this.courseConfig.assignmentTemplates);
				}
			});
	}

	openEditAssignmentTemplateDialog(template: AssignmentTemplateDto): void {
		const data: EditAssignmentTemplateDialogData = {
			template: template,
			courseId: this.courseId
		};
		this.subs.sink = this.dialog
			.open<
				EditAssignmentTemplateDialog,
				EditAssignmentTemplateDialogData,
				AssignmentTemplateDto
			>(EditAssignmentTemplateDialog, { data })
			.afterClosed()
			.subscribe(update => {
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
					this.assignmentTemplates$.next(this.courseConfig.assignmentTemplates);
				}
			});
	}

	/**
	 * Calls the API to delete the given template.
	 * If removal was successful, the template will be removed from the courseConfig.assignmentTemplates.
	 */
	deleteAssignmentTemplate(template: AssignmentTemplateDto): void {
		const data: ConfirmDialogData = { params: [template.templateName] };
		this.subs.sink = this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.courseConfigApi
						.deleteAssignmentTemplate(this.courseId, template.id)
						.subscribe(
							deleted => {
								this.courseConfig.assignmentTemplates =
									this.courseConfig.assignmentTemplates.filter(
										t => t.id !== template.id
									);
								this.assignmentTemplates$.next(
									this.courseConfig.assignmentTemplates
								);
								this.toast.success("Domain.AssignmentTemplate", "Message.Deleted");
							},
							error => {
								this.toast.apiError(error);
							}
						);
				}
			});
	}
}

@NgModule({
	declarations: [CourseEditComponent],
	exports: [CourseEditComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatTabsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule,
		IconComponentModule,
		CourseSettingsModule
	]
})
export class CourseEditComponentModule {}
