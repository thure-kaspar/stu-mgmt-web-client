import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CourseParticipantsService, CoursesService, ParticipantDto } from "../../../../api";
import {
	ChangeRoleDialog,
	ChangeRoleDialogData
} from "../../course/dialogs/change-role/change-role.dialog";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { Paginator } from "../../shared/paginator/paginator.component";
import { DownloadService } from "../../shared/services/download.service";
import { ToastService } from "../../shared/services/toast.service";

class ParticipantsFilter {
	includeStudents = false;
	includeTutors = false;
	includeLecturers = false;
	username: string;
	groupName: string;
}

@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.component.html",
	styleUrls: ["./user-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	private participants: ParticipantDto[];
	displayedColumns: string[] = [
		"actions",
		"role",
		"matrNr",
		"username",
		"displayName",
		"group",
		"spacer"
	];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<ParticipantDto>([]));
	filter = new ParticipantsFilter();

	usernameFilterChangedSubject = new Subject();

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	courseRole = ParticipantDto.RoleEnum;

	constructor(
		private courseService: CoursesService,
		private courseParticipantsService: CourseParticipantsService,
		private downloadService: DownloadService,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.parent.snapshot.paramMap.get("courseId");
		this.searchParticipants();

		// Subscribe to changes of username filter: Trigger search 500ms after user stopped typing
		this.subs.sink = this.usernameFilterChangedSubject
			.pipe(debounceTime(300))
			.subscribe(() => this.searchParticipants());
	}

	/**
	 * Requests course participants matching the filter from the API.
	 * @param [triggeredByPaginator=false] Should be used by the paginator, to avoid jumping back to the first page. Default: `false`.
	 */
	searchParticipants(triggeredByPaginator = false): void {
		const skip = triggeredByPaginator ? this.paginator.getSkip() : 0;
		const take = this.paginator.pageSize;

		const roles = [];
		if (this.filter.includeTutors) roles.push(ParticipantDto.RoleEnum.TUTOR);
		if (this.filter.includeLecturers) roles.push(ParticipantDto.RoleEnum.LECTURER);
		if (this.filter.includeStudents) roles.push(ParticipantDto.RoleEnum.STUDENT);

		this.courseParticipantsService
			.getUsersOfCourse(
				this.courseId,
				skip,
				take,
				roles,
				this.filter.username?.trim(),
				this.filter.groupName?.trim(),
				"response"
			)
			.subscribe(
				response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.participants = response.body;
					this.refreshDataSource();
				},
				error => console.log(error)
			);
	}

	openChangeRoleDialog(participant: ParticipantDto): void {
		this.dialog
			.open<ChangeRoleDialog, ChangeRoleDialogData, ParticipantDto.RoleEnum>(
				ChangeRoleDialog,
				{
					data: {
						courseId: this.courseId,
						participant: participant
					}
				}
			)
			.afterClosed()
			.subscribe(
				result => {
					// Update the user's role locally to avoid refetching data from server
					if (result) participant.role = result;
				},
				error => console.log(error)
			);
	}

	/**
	 * Opens the ConfirmDialog and proceeds with removal, if user confirms the action.
	 */
	openRemoveDialog(user: ParticipantDto): void {
		// Open ConfirmDialog
		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
				data: {
					params: [user.username, user.role]
				}
			})
			.afterClosed()
			.subscribe(
				isConfirmed => {
					// Check if user confirmed the action
					if (isConfirmed) {
						this.courseParticipantsService
							.removeUser(this.courseId, user.userId)
							.subscribe({
								next: () => {
									// Remove removed user from user list
									this.participants = this.participants.filter(
										u => u.username !== user.username
									);
									this.refreshDataSource();
									this.toast.success(user.displayName, "Message.Removed");
								},
								error: error => {
									this.toast.apiError(error);
								}
							});
					}
				},
				error => console.log(error)
			);
	}

	downloadCsv(): void {
		this.downloadService.downloadFromApi(
			`csv/courses/${this.courseId}/users`,
			`${this.courseId}-participant.tsv`
		);
	}

	private refreshDataSource(): void {
		this.dataSource$.next(new MatTableDataSource(this.participants));
	}
}
