import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { CourseParticipantsService, CoursesService, UserDto } from "../../../../../api";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { Paginator } from "../../../shared/paginator/paginator.component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { ChangeRoleDialog, ChangeRoleDialogData } from "../../dialogs/change-role/change-role.dialog";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { debounceTime } from "rxjs/operators";

class ParticipantsFilter {
	includeStudents = false;
	includeTutors = false;
	includeLecturers = false;
	username: string;
}

@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.component.html",
	styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent extends UnsubscribeOnDestroy implements OnInit {

	courseId: string;
	users: UserDto[];
	displayedColumns: string[] = ["actions", "role", "username", "email"];
	dataSource: MatTableDataSource<UserDto>;
	filter = new ParticipantsFilter();

	usernameFilterChangedSubject = new Subject();

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	constructor(private courseService: CoursesService,
				private courseParticipantsService: CourseParticipantsService,
				private route: ActivatedRoute,
				public dialog: MatDialog,
				private snackbar: SnackbarService) { super(); }

	ngOnInit(): void {
		this.courseId = this.route.parent.snapshot.paramMap.get("courseId");
		this.searchParticipants();

		// Subscribe to changes of username filter: Trigger search 500ms after user stopped typing
		this.subs.sink = this.usernameFilterChangedSubject
			.pipe(debounceTime(500)).subscribe(() => 
				this.searchParticipants()
			);
	}

	/**
	 * Requests course participants matching the filter from the API.
	 * @param [triggeredByPaginator=false] Should be used by the paginator, to avoid jumping back to the first page. Default: `false`.
	 */
	searchParticipants(triggeredByPaginator = false): void {
		const skip = triggeredByPaginator ? this.paginator.getSkip() : 0;
		const take = this.paginator.pageSize;
		
		const roles = [];
		if (this.filter.includeTutors) roles.push(UserDto.CourseRoleEnum.TUTOR);
		if (this.filter.includeLecturers) roles.push(UserDto.CourseRoleEnum.LECTURER);
		if (this.filter.includeStudents) roles.push(UserDto.CourseRoleEnum.STUDENT);

		this.courseParticipantsService.getUsersOfCourse(
			this.courseId,
			skip,
			take,
			roles,
			this.filter.username
		).subscribe(
			result => {
				this.users = result,
				this.refreshDataSource();
				this.paginator.goToFirstPage();
			},
			error => console.log(error)
		);
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
					this.courseParticipantsService.removeUser(this.courseId, user.id).subscribe(
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
