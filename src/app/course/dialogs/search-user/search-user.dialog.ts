import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { UserDto, UsersService } from "../../../../../api";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { BehaviorSubject } from "rxjs";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-search-user",
	templateUrl: "./search-user.dialog.html",
	styleUrls: ["./search-user.dialog.scss"]
})
export class SearchUserDialog extends UnsubscribeOnDestroy implements OnInit {

	users:  UserDto[] = [];
	userFilter: string;

	displayedColumns: string[] = ["select", "role", "username", "displayName", "email", "actions"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<UserDto>([]));
	selection = new SelectionModel<UserDto>(false, []);
	
	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(public dialogRef: MatDialogRef<SearchUserDialog, UserDto[]>,
				private userService: UsersService) { super(); }

	ngOnInit(): void {
		this.searchUsers();
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
		this.subs.sink = this.userService.getAllUsers("response").subscribe( // TODO: Implement filtering in backend
			response => {
				if (!triggeredByPaginator) this.paginator.goToFirstPage();
				this.paginator.setTotalCountFromHttp(response);
				this.dataSource$.next(new MatTableDataSource(response.body));
			},
			error => console.log(error)
		);
	}

}
