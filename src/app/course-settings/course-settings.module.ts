import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EditCourseComponent } from "./components/edit-course/edit-course.component";
import { CourseSettingsRoutingModule } from "./course-settings-routing.module";
import { CreateAssignmentTemplateDialog } from "./dialogs/create-assignment-template/create-assignment-template.dialog";
import { EditAssignmentTemplateDialog } from "./dialogs/edit-assignment-template/edit-assignment-template.dialog";
import { AdmissionCriteriaForm } from "./forms/admission-criteria-form/admission-criteria-form.component";
import { AdmissionFromPreviousSemesterFormComponent } from "./forms/admission-from-previous-semester-form/admission-from-previous-semester-form.component";
import { AssignmentTemplatesForm } from "./forms/assignment-templates-form/assignment-templates-form.component";
import { CourseForm } from "./forms/course-form/course-form.component";
import { GroupSettingsForm } from "./forms/group-settings-form/group-settings-form.component";

@NgModule({
	declarations: [
		CourseForm,
		AdmissionCriteriaForm,
		GroupSettingsForm,
		AssignmentTemplatesForm,
		EditCourseComponent,
		CreateAssignmentTemplateDialog,
		EditAssignmentTemplateDialog,
		AdmissionFromPreviousSemesterFormComponent
	],
	imports: [SharedModule, CourseSettingsRoutingModule],
	exports: [
		CourseForm,
		AdmissionCriteriaForm,
		GroupSettingsForm,
		AssignmentTemplatesForm,
		EditCourseComponent,
		CreateAssignmentTemplateDialog,
		EditAssignmentTemplateDialog
	]
})
export class CourseSettingsModule {}
