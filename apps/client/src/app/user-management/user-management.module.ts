import { NgModule } from "@angular/core";
import { UserManagementComponentModule } from "./components/user-management.component";
import { UserManagementRoutingModule } from "./user-management-routing.module";

@NgModule({
	imports: [UserManagementRoutingModule, UserManagementComponentModule]
})
export class UserManagementModule {}
