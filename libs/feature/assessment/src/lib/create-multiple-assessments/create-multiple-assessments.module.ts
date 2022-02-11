import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import {
	PersonListComponentModule,
	SimpleChipComponentModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { CreateMultipleAssessmentRoutingModule } from "./create-multiple-assessments-routing.module";
import { CreateMultipleAssessmentsComponent } from "./create-multiple-assessments.component";

@NgModule({
	imports: [
		CommonModule,
		CreateMultipleAssessmentRoutingModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatTabsModule,
		MatCheckboxModule,
		TranslateModule,
		MatProgressSpinnerModule,
		TitleComponentModule,
		PersonListComponentModule,
		SimpleChipComponentModule,
		MatTooltipModule
	],
	declarations: [CreateMultipleAssessmentsComponent],
	exports: [CreateMultipleAssessmentsComponent]
})
export class CreateMultipleAssessmentsComponentModule {}
