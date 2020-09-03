import { NgModule } from "@angular/core";
import { UserManagementRoutingModule } from "./user-management-routing.module";
import { UserManagementComponent } from "./components/user-management.component";
import { SharedModule } from "../shared/shared.module";
import { UpdateUserDialog } from "./dialogs/update-user/update-user.dialog";

@NgModule({
	declarations: [UserManagementComponent, UpdateUserDialog],
	imports: [
		SharedModule,
		UserManagementRoutingModule,
	]
})
export class UserManagementModule { }
