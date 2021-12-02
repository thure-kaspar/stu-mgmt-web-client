import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";
import { AssignmentRoutingModule } from "./assignment-routing.module";
import { AssignmentCardComponent } from "./components/assignment-card/assignment-card.component";
import { AssignmentListComponent } from "./components/assignment-list/assignment-list.component";
import { ParticipantAdmissionStatusContainerComponent } from "./components/participant-admission-status-container/participant-admission-status-container.component";
import { CreateAssignmentDialog } from "./dialogs/create-assignment/create-assignment.dialog";
import { EditAssignmentDialog } from "./dialogs/edit-assignment/edit-assignment.dialog";
import { SearchAssignmentDialog } from "./dialogs/search-assignment/search-assignment.dialog";
import { AssignmentForm } from "./forms/assignment-form/assignment-form.component";

@NgModule({
	declarations: [
		AssignmentListComponent,
		CreateAssignmentDialog,
		EditAssignmentDialog,
		AssignmentForm,
		SearchAssignmentDialog,
		AssignmentCardComponent,
		ParticipantAdmissionStatusContainerComponent
	],
	imports: [SharedModule, TranslateModule.forChild({ extend: true }), AssignmentRoutingModule],
	exports: [AssignmentListComponent]
})
export class AssignmentModule {}
