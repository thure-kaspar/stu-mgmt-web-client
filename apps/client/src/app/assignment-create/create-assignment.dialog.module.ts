import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { AssignmentFormComponentModule } from "../assignment/forms/assignment-form/assignment-form.component";
import { CreateAssignmentDialogRoutingModule } from "./assignment-create-routing.module";
import { AssignmentCreateComponent } from "./assignment-create.component";

@NgModule({
	declarations: [AssignmentCreateComponent],
	exports: [AssignmentCreateComponent],
	imports: [
		CreateAssignmentDialogRoutingModule,
		CommonModule,
		MatCardModule,
		MatMenuModule,
		MatButtonModule,
		TranslateModule,
		IconComponentModule,
		AssignmentFormComponentModule
	]
})
export class CreateAssignmentDialogModule {}
