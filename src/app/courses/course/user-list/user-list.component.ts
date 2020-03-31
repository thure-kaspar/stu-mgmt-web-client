import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CoursesService, UserDto } from "../../../../../api";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.component.html",
	styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {

	@Input() courseId: string;
	users: UserDto[];
	displayedColumns: string[] = ["role", "name", "actions"];
	dataSource: MatTableDataSource<UserDto>;
	userFilter: string;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private courseService: CoursesService,
				public dialog: MatDialog,
				private snackbar: MatSnackBar,
				private router: Router) { }

	ngOnInit(): void {
		this.courseService.getUsersOfCourse(this.courseId).subscribe(
			result => {
				this.users = result,
				this.dataSource = new MatTableDataSource(this.users);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

	applyFilter(): void {
		this.dataSource.filter = this.userFilter.trim().toLowerCase();
	
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	openChangeRoleDialog(user: UserDto): void {
		//this.dialog.open()
	}

	/**
	 * Opens the ConfirmDialog and proceeds with removal, if user confirms the action.
	 */
	openRemoveDialog(user: UserDto): void {
		// Open ConfirmDialog
		this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
			data: {
				params: [user.username, user.courseRole]
			}
		}).afterClosed().subscribe(
			isConfirmed => {
				// Check if user confirmed the action
				if (isConfirmed) {
					this.courseService.removeUser(this.courseId, user.id).subscribe(
						result => {
							if (result) {
								// Remove removed user from user list
								this.users = this.users.filter(u => u.username !== user.username);
								this.refreshDataSource();
								this.snackbar.open("User has been removed successfully.", "OK", { duration: 3000 });
							}
						},
						error => {
							console.log(error),
							this.snackbar.open("Failed to remove the user.", "OK", { duration: 3000 });
						}
					);
				}
			}, 
			error => console.log(error)
		);
	}

	private refreshDataSource(): void {
		this.dataSource = new MatTableDataSource(this.users);
	}

}
