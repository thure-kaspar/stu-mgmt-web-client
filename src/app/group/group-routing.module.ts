import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GroupDetailComponent } from "./components/group-detail/group-detail.component";
import { GroupListComponent } from "./components/group-list/group-list.component";
import { GroupComponent } from "./group.component";

const routes: Routes = [
	{ path: "", component: GroupComponent, children: [
		{ path: ":groupId", component: GroupDetailComponent },
		{ path: "**", component: GroupListComponent }
	] }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GroupRoutingModule { }
