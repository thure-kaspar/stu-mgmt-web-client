import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssignmentCreateComponent } from "./assignment-create.component";

// courses/:courseId/new-assignment/
const routes: Routes = [{ path: "", component: AssignmentCreateComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CreateAssignmentDialogRoutingModule {}
