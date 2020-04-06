import { Component, OnInit, ViewChild } from "@angular/core";
import { UsersService, UserDto } from "../../../../../../api";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialogRef } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
	selector: "app-search-user",
	templateUrl: "./search-user.dialog.html",
	styleUrls: ["./search-user.dialog.scss"]
})
export class SearchUserDialog implements OnInit {

	users:  UserDto[] = [];
	userFilter: string;

	displayedColumns: string[] = ["select", "role", "username", "rzname", "email", "actions"];
	dataSource: MatTableDataSource<UserDto>;
	selection = new SelectionModel<UserDto>(true, []);
	
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(public dialogRef: MatDialogRef<SearchUserDialog, UserDto[]>,
				private userService: UsersService) { }

	ngOnInit(): void { }

	/** Closes the dialog without returning data. */
	onCancel(): void {
		this.dialogRef.close();
	}
	
	/** Closes the dialog and returns the selected users. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected);
	}

	/** Retrieves all users that match the specified filters and inserts them into the table. */
	searchUsers(): void { 
		this.userService.getAllUsers().subscribe( // TODO: Implement getUsersWithFilter in backend
			result => {
				this.users = result;
				this.dataSource = new MatTableDataSource(this.users);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}
	
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle(): void {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	private refreshDataSource(): void {
		this.dataSource = new MatTableDataSource(this.users);
	}

}
