import { NgModule } from "@angular/core";

import { AssignmentRoutingModule } from "./assignment-routing.module";
import { AssignmentListComponent } from "./components/assignment-list/assignment-list.component";
import { SharedModule } from "../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { CreateAssignmentDialog } from "./dialogs/create-assignment/create-assignment.dialog";
import { EditAssignmentDialog } from "./dialogs/edit-assignment/edit-assignment.dialog";
import { AssignmentForm } from "./forms/assignment-form/assignment-form.component";
import { SearchAssignmentDialog } from "./dialogs/search-assignment/search-assignment.dialog";
import { AssignmentCardComponent } from "./components/assignment-card/assignment-card.component";


@NgModule({
	declarations: [
		AssignmentListComponent,
		CreateAssignmentDialog,
		EditAssignmentDialog,
		AssignmentForm,
		SearchAssignmentDialog,
		AssignmentCardComponent
	],
	imports: [
		SharedModule,
		TranslateModule.forChild({ extend: true }),
		AssignmentRoutingModule
	],
	exports: [AssignmentListComponent]
})
export class AssignmentModule { }
