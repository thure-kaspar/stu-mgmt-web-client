import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { UserDto, UserService } from "../../../../../api";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { BehaviorSubject, Subject } from "rxjs";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { debounceTime } from "rxjs/operators";

class UserFilter {
	includeUsers = false;
	includeMgmtAdmins = false;
	includeSystemAdmins = false;
	includeAdminTools = false;
	username: string;
	displayName: string;
}

@Component({
	selector: "app-search-user",
	templateUrl: "./search-user.dialog.html",
	styleUrls: ["./search-user.dialog.scss"]
})
export class SearchUserDialog extends UnsubscribeOnDestroy implements OnInit {
	filter = new UserFilter();

	displayedColumns: string[] = ["select", "role", "username", "displayName", "email", "actions"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<UserDto>([]));
	selection = new SelectionModel<UserDto>(false, []);

	nameFilterChanged = new Subject();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		public dialogRef: MatDialogRef<SearchUserDialog, UserDto[]>,
		private userService: UserService
	) {
		super();
	}

	ngOnInit(): void {
		this.searchUsers();

		this.subs.sink = this.nameFilterChanged
			.pipe(debounceTime(300))
			.subscribe(() => this.searchUsers());
	}

	/** Closes the dialog without returning data. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/** Closes the dialog and returns the selected users. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected);
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
}
