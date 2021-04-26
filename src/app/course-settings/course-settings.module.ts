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
import { NotificationSubscribersComponent } from "./forms/notification-subscribers/notification-subscribers.component";
import { NotificationSubscriberDialog } from "./dialogs/notification-subscriber/notification-subscriber.dialog";

@NgModule({
	declarations: [
		CourseForm,
		AdmissionCriteriaForm,
		GroupSettingsForm,
		AssignmentTemplatesForm,
		EditCourseComponent,
		CreateAssignmentTemplateDialog,
		EditAssignmentTemplateDialog,
		AdmissionFromPreviousSemesterFormComponent,
		NotificationSubscribersComponent,
		NotificationSubscriberDialog
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
