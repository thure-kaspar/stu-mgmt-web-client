import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { CourseActions } from "@student-mgmt-client/state";
import { getSemester, UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	AssignmentDto,
	CourseApi,
	CourseConfigApi,
	CourseConfigDto,
	CourseConfigUpdateDto,
	CourseDto,
	GroupSettingsUpdateDto
} from "@student-mgmt/api-client";
import { CourseSettingsModule } from "../course-settings/course-settings.module";
import { AdmissionCriteriaFormComponent } from "../course-settings/forms/admission-criteria-form/admission-criteria-form.component";
import { CourseFormComponent } from "../course-settings/forms/course-form/course-form.component";
import { GroupSettingsFormComponent } from "../course-settings/forms/group-settings-form/group-settings-form.component";

@Component({
    selector: "student-mgmt-course-edit",
    templateUrl: "./course-edit.component.html",
    styleUrls: ["./course-edit.component.scss"],
    standalone: false
})
export class CourseEditComponent extends UnsubscribeOnDestroy implements OnInit {
	/** Form with the structure of a CourseCreateDto. */
	form: UntypedFormGroup;

	/** Index of the selected tab. */
	selectedIndex = 0;
	private tabs = [
		"basic-data",
		"group-settings",
		"secrets",
		"admission-criteria",
		"admission-from-previous-semester",
		"notifications"
	];

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

	courseId: string;
	course: CourseDto;
	courseConfig: CourseConfigDto;

	constructor(
		private fb: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private courseConfigApi: CourseConfigApi,
		private courseApi: CourseApi,
		private store: Store,
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
				})
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
				this.toast.success("Misc.BasicData", "Message.Saved");
				this.store.dispatch(CourseActions.loadCourse({ courseId: this.courseId }));
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
					this.store.dispatch(CourseActions.loadCourse({ courseId: this.courseId }));
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
				this.store.dispatch(CourseActions.loadCourse({ courseId: this.courseId }));
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
					this.store.dispatch(CourseActions.loadCourse({ courseId: this.courseId }));
				},
				error: error => {
					this.toast.apiError(error);
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
