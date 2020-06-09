import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CoursesService, UserDto } from "../../../../../api";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChangeRoleDialog, ChangeRoleDialogData } from "../../dialogs/change-role/change-role.dialog";
import { ActivatedRoute } from "@angular/router";
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.component.html",
	styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {

	courseId: string;
	users: UserDto[];
	displayedColumns: string[] = ["actions", "role", "username", "email"];
	dataSource: MatTableDataSource<UserDto>;
	userFilter: string;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private courseService: CoursesService,
				private route: ActivatedRoute,
				public dialog: MatDialog,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseId = this.route.parent.snapshot.paramMap.get("courseId");

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
		this.dialog.open<ChangeRoleDialog, ChangeRoleDialogData, UserDto.CourseRoleEnum>(ChangeRoleDialog, {
			data: {
				courseId: this.courseId,
				user: user
			}
		}).afterClosed().subscribe(
			result => {
				// Update the user's role locally to avoid refetching data from server
				if (result) user.courseRole = result;
			},
			error => console.log(error)
		);
	}

	/**
	 * Opens the ConfirmDialog and proceeds with removal, if user confirms the action.
	 */
	openRemoveDialog(user: UserDto): void {
		// Open ConfirmDialog
		this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
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
								this.snackbar.openSuccessMessage("User has been removed successfully!");
							}
						},
						error => {
							console.log(error),
							this.snackbar.openErrorMessage("Failed to remove the user.");
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
