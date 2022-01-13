import { NgModule } from "@angular/core";
import { AdmissionCriteriaFormComponentModule } from "./forms/admission-criteria-form/admission-criteria-form.component";
import { AdmissionFromPreviousSemesterFormComponentModule } from "./forms/admission-from-previous-semester-form/admission-from-previous-semester-form.component";
import { CourseFormComponentModule } from "./forms/course-form/course-form.component";
import { GroupSettingsFormComponentModule } from "./forms/group-settings-form/group-settings-form.component";
import { NotificationSubscribersComponentModule } from "./forms/notification-subscribers/notification-subscribers.component";

const forms = [
	AdmissionCriteriaFormComponentModule,
	AdmissionFromPreviousSemesterFormComponentModule,
	CourseFormComponentModule,
	GroupSettingsFormComponentModule,
	NotificationSubscribersComponentModule
];

@NgModule({
	imports: forms,
	exports: forms
})
export class CourseSettingsModule {}
