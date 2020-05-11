import { NgModule } from "@angular/core";

import { GroupRoutingModule } from "./group-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CreateGroupDialog } from "./dialogs/create-group/create-group.dialog";
import { CreateGroupMultipleComponent } from "./dialogs/create-group/create-group-multiple/create-group-multiple.component";
import { GroupListComponent } from "./components/group-list/group-list.component";
import { TranslateModule } from "@ngx-translate/core";
import { JoinGroupDialog } from "./dialogs/join-group/join-group.dialog";
import { GroupDetailComponent } from "./components/group-detail/group-detail.component";

@NgModule({
	declarations: [
		CreateGroupDialog,
		CreateGroupMultipleComponent,
		GroupListComponent,
		JoinGroupDialog,
		GroupDetailComponent
	],
	imports: [
		SharedModule,
		GroupRoutingModule,
		TranslateModule.forChild({ extend: true }),
	],
	exports: [GroupListComponent]
})
export class GroupModule { }
