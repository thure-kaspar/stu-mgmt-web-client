import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssessmentViewerComponent } from "./assessment-viewer.component";

const routes: Routes = [{ path: "", component: AssessmentViewerComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssessmentViewerRoutingModule {}
