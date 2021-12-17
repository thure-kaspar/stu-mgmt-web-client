import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { DialogService, ToastService } from "@student-mgmt-client/services";
import { IconComponentModule, Paginator, PaginatorModule } from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { UserApi, UserDto } from "@student-mgmt/api-client";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { UpdateUserDialog } from "../dialogs/update-user/update-user.dialog";

class UserFilter {
	includeUsers = false;
	includeMgmtAdmins = false;
	includeSystemAdmins = false;
	includeAdminTools = false;
	username: string;
	displayName: string;
}

@Component({
	selector: "student-mgmt-user-management",
	templateUrl: "./user-management.component.html",
	styleUrls: ["./user-management.component.scss"]
})
export class UserManagementComponent extends UnsubscribeOnDestroy implements OnInit {
	filter = new UserFilter();

	displayedColumns: string[] = ["actions", "role", "username", "displayName", "email"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<UserDto>([]));

	nameFilterChanged = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		private userApi: UserApi,
		private dialog: MatDialog,
		private dialogService: DialogService,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.searchUsers();

		this.subs.sink = this.nameFilterChanged
			.pipe(debounceTime(300))
			.subscribe(() => this.searchUsers());
	}

	/** Retrieves all users that match the specified filters and inserts them into the table. */
	searchUsers(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		const roles = [];
		if (this.filter.includeUsers) roles.push(UserDto.RoleEnum.USER);
		if (this.filter.includeMgmtAdmins) roles.push(UserDto.RoleEnum.MGMT_ADMIN);
		if (this.filter.includeSystemAdmins) roles.push(UserDto.RoleEnum.SYSTEM_ADMIN);
		if (this.filter.includeAdminTools) roles.push(UserDto.RoleEnum.ADMIN_TOOL);

		this.subs.sink = this.userApi
			.getUsers(skip, take, this.filter.username, this.filter.displayName, roles, "response")
			.subscribe(
				response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.dataSource$.next(new MatTableDataSource(response.body));
				},
				error => console.log(error)
			);
	}

	editUser(user: UserDto): void {
		this.subs.sink = this.dialog
			.open<UpdateUserDialog, UserDto, UserDto>(UpdateUserDialog, { data: user })
			.afterClosed()
			.subscribe(updated => {
				if (updated) {
					const users = this.dataSource$.getValue().data;
					const index = users.findIndex(u => u.id === user.id);
					users[index] = { ...users[index], ...updated };
					this.dataSource$.next(new MatTableDataSource(users));
				}
			});
	}

	removeUser(user: UserDto): void {
		this.subs.sink = this.dialogService
			.openConfirmDialog({
				title: "Action.Delete",
				params: [user.username]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.subs.sink = this.userApi.deleteUser(user.id).subscribe({
						next: () => {
							const users = this.dataSource$.getValue().data;
							const filteredUsers = users.filter(u => u.id !== user.id);
							this.paginator.totalCount--;
							this.toast.success(user.username, "Action.Removed");
							this.dataSource$.next(new MatTableDataSource(filteredUsers));
						},
						error: error => {
							this.toast.apiError(error);
						}
					});
				}
			});
	}
}

@NgModule({
	declarations: [UserManagementComponent],
	exports: [UserManagementComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatMenuModule,
		MatTableModule,
		IconComponentModule,
		TranslateModule,
		PaginatorModule
	]
})
export class UserManagementComponentModule {}
