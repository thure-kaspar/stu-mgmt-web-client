import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from "@ngx-translate/core";

import { PersonListComponentModule, TitleComponentModule } from "@student-mgmt-client/shared-ui";
import { CreateMultipleAssessmentRoutingModule } from "./create-multiple-assessments-routing.module";
import { CreateMultipleAssessmentsComponent } from "./create-multiple-assessments.component";

@NgModule({
	imports: [
		CommonModule,
		CreateMultipleAssessmentRoutingModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatTabsModule,
		TranslateModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		TitleComponentModule,
		PersonListComponentModule
	],
	declarations: [CreateMultipleAssessmentsComponent],
	exports: [CreateMultipleAssessmentsComponent]
})
export class CreateMultipleAssessmentsComponentModule {}
