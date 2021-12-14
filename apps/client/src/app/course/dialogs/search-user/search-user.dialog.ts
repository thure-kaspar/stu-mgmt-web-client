import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { Paginator, PaginatorModule, UnsubscribeOnDestroy } from "@student-mgmt-client/shared-ui";
import { UserApi, UserDto } from "@student-mgmt/api-client";
import { BehaviorSubject, Subject } from "rxjs";
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

	displayedColumns: string[] = ["select", "role", "username", "displayName", "email"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<UserDto>([]));
	selection = new SelectionModel<UserDto>(false, []);

	nameFilterChanged = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		public dialogRef: MatDialogRef<SearchUserDialog, UserDto[]>,
		private userApi: UserApi
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
}

@NgModule({
	declarations: [SearchUserDialog],
	exports: [SearchUserDialog],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatTableModule,
		TranslateModule,
		PaginatorModule
	]
})
export class SearchUserDialogModule {}
