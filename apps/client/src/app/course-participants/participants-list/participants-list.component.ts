import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DownloadService, ToastService } from "@student-mgmt-client/services";
import {
	ChipComponentModule,
	ConfirmDialog,
	ConfirmDialogData,
	IconComponentModule,
	Paginator,
	PaginatorModule,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/shared-ui";
import { CourseApi, CourseParticipantsApi, ParticipantDto } from "@student-mgmt/api-client";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import {
	ChangeRoleDialog,
	ChangeRoleDialogData
} from "../../course/dialogs/change-role/change-role.dialog";

class ParticipantsFilter {
	includeStudents = false;
	includeTutors = false;
	includeLecturers = false;
	username: string;
	groupName: string;
}

@Component({
	selector: "student-mgmt-participants-list",
	templateUrl: "./participants-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantsListComponent extends UnsubscribeOnDestroy implements OnInit {
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

	usernameFilterChangedSubject = new Subject<void>();

	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	courseRole = ParticipantDto.RoleEnum;

	constructor(
		private courseApi: CourseApi,
		private courseParticipantsApi: CourseParticipantsApi,
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

		this.courseParticipantsApi
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
						this.courseParticipantsApi
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

	exportToExcel(): void {
		this.downloadService.downloadFromApi(
			`export/${this.courseId}/participants`,
			`${this.courseId}-participants.xlsx`
		);
	}

	private refreshDataSource(): void {
		this.dataSource$.next(new MatTableDataSource(this.participants));
	}
}

@NgModule({
	declarations: [ParticipantsListComponent],
	exports: [ParticipantsListComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatMenuModule,
		MatTableModule,
		TranslateModule,
		ChipComponentModule,
		IconComponentModule,
		PaginatorModule
	]
})
export class ParticipantsListComponentModule {}
