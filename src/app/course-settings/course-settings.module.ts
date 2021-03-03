import { NgModule } from "@angular/core";
import { CourseSettingsRoutingModule } from "./course-settings-routing.module";
import { CourseForm } from "./forms/course-form/course-form.component";
import { AdmissionCriteriaForm } from "./forms/admission-criteria-form/admission-criteria-form.component";
import { GroupSettingsForm } from "./forms/group-settings-form/group-settings-form.component";
import { AssignmentTemplatesForm } from "./forms/assignment-templates-form/assignment-templates-form.component";
import { EditCourseComponent } from "./components/edit-course/edit-course.component";
import { CreateAssignmentTemplateDialog } from "./dialogs/create-assignment-template/create-assignment-template.dialog";
import { EditAssignmentTemplateDialog } from "./dialogs/edit-assignment-template/edit-assignment-template.dialog";
import { SharedModule } from "../shared/shared.module";

@NgModule({
	declarations: [
		CourseForm,
		AdmissionCriteriaForm,
		GroupSettingsForm,
		AssignmentTemplatesForm,
		EditCourseComponent,
		CreateAssignmentTemplateDialog,
		EditAssignmentTemplateDialog
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
