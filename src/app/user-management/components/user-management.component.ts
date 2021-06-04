import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { UserDto, UserService } from "../../../../api";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { Paginator } from "../../shared/paginator/paginator.component";
import { DialogService } from "../../shared/services/dialog.service";
import { ToastService } from "../../shared/services/toast.service";
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
	selector: "app-user-management",
	templateUrl: "./user-management.component.html",
	styleUrls: ["./user-management.component.scss"]
})
export class UserManagementComponent extends UnsubscribeOnDestroy implements OnInit {
	filter = new UserFilter();

	displayedColumns: string[] = ["actions", "role", "username", "displayName", "email"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<UserDto>([]));

	nameFilterChanged = new Subject();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		private userService: UserService,
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

		this.subs.sink = this.userService
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
					this.subs.sink = this.userService.deleteUser(user.id).subscribe({
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
