import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentFormComponentModule } from "../assignment/forms/assignment-form/assignment-form.component";
import { AssignmentEditComponent } from "./assignment-edit.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [AssignmentEditComponent],
	imports: [
		// courses/:courseId/assignments/:assignmentId/edit
		RouterModule.forChild([
			{ path: "", component: AssignmentEditComponent, pathMatch: "full" }
		]),
		CommonModule,
		TranslateModule,
		MatCardModule,
		MatButtonModule,
		AssignmentFormComponentModule
	],
	providers: []
})
export class AssignmentEditModule {}
