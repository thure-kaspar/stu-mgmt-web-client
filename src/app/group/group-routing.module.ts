import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GroupDetailComponent } from "./components/group-detail/group-detail.component";

const routes: Routes = [
	{ path: ":groupId", component: GroupDetailComponent, }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GroupRoutingModule { }
