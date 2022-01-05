import { NgModule } from "@angular/core";
import { GroupListComponentModule } from "./components/group-list/group-list.component";
import { GroupRoutingModule } from "./group-routing.module";

@NgModule({
	imports: [GroupRoutingModule, GroupListComponentModule]
})
export class GroupModule {}
