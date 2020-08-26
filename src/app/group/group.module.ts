import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SharedModule } from "../shared/shared.module";
import { GroupDetailComponent } from "./components/group-detail/group-detail.component";
import { GroupListComponent } from "./components/group-list/group-list.component";
import { CreateGroupStudentDialog } from "./dialogs/create-group-student/create-group-student.dialog";
import { CreateGroupMultipleComponent } from "./dialogs/create-group/create-group-multiple/create-group-multiple.component";
import { CreateGroupDialog } from "./dialogs/create-group/create-group.dialog";
import { JoinGroupDialog } from "./dialogs/join-group/join-group.dialog";
import { GroupRoutingModule } from "./group-routing.module";
import { GroupCardComponent } from "./components/group-card/group-card.component";
import { EditGroupDialog } from "./dialogs/edit-group/edit-group.dialog";
import { GroupComponent } from "./group.component";
import { SearchGroupDialog } from "./dialogs/search-group/search-group.dialog";

@NgModule({
	declarations: [
		GroupComponent,
		CreateGroupDialog,
		CreateGroupMultipleComponent,
		CreateGroupStudentDialog,
		GroupListComponent,
		JoinGroupDialog,
		GroupDetailComponent,
		GroupCardComponent,
		EditGroupDialog,
		SearchGroupDialog,
	],
	imports: [
		SharedModule,
		GroupRoutingModule,
		TranslateModule.forChild({ extend: true }),
		InfiniteScrollModule
	],
	exports: [GroupListComponent]
})
export class GroupModule { }
