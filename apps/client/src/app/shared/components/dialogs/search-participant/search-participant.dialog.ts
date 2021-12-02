import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CourseParticipantsApi, ParticipantDto } from "@student-mgmt/api-client";
import { Paginator } from "../../../paginator/paginator.component";
import { debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { UnsubscribeOnDestroy } from "../../unsubscribe-on-destroy.component";

class ParticipantsFilter {
	includeStudents = false;
	includeTutors = false;
	includeLecturers = false;
	username: string;
	groupName: string;
}

/**
 * Dialog that allows users to search for participants of a course.
 * @param courseId
 * @returns List of selected participants.
 */
@Component({
	selector: "app-search-participant",
	templateUrl: "./search-participant.dialog.html",
	styleUrls: ["./search-participant.dialog.scss"]
})
export class SearchParticipantDialog extends UnsubscribeOnDestroy implements OnInit {
	participants: ParticipantDto[];
	filter = new ParticipantsFilter();
	displayedColumns: string[] = ["select", "username", "displayName", "role"];
	dataSource: MatTableDataSource<ParticipantDto>;
	selection = new SelectionModel<ParticipantDto>(false, []);

	usernameFilterChangedSubject = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		private dialogRef: MatDialogRef<SearchParticipantDialog>,
		@Inject(MAT_DIALOG_DATA) private courseId: string,
		private courseParticipants: CourseParticipantsApi
	) {
		super();
	}

	ngOnInit(): void {
		this.searchParticipants();

		// Subscribe to changes of username filter: Trigger search 500ms after user stopped typing
		this.subs.sink = this.usernameFilterChangedSubject
			.pipe(debounceTime(300))
			.subscribe(() => this.searchParticipants());
	}

	/** Closes the dialog and returns `undefined`. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**Closes the dialog and returns the selected courses. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected);
	}

	searchParticipants(triggeredByPaginator = false): void {
		const skip = triggeredByPaginator ? this.paginator.getSkip() : 0;
		const take = this.paginator.pageSize;

		const roles = [];
		if (this.filter.includeTutors) roles.push(ParticipantDto.RoleEnum.TUTOR);
		if (this.filter.includeLecturers) roles.push(ParticipantDto.RoleEnum.LECTURER);
		if (this.filter.includeStudents) roles.push(ParticipantDto.RoleEnum.STUDENT);

		this.courseParticipants
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
					this.dataSource = new MatTableDataSource(response.body);
					this.paginator.setTotalCountFromHttp(response);
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
				},
				error => console.log(error)
			);
	}

	/** Selects the given row. Removes selection, if already selected. */
	select(row: ParticipantDto): void {
		if (this.selection.isSelected(row)) {
			this.selection.deselect(row);
		} else {
			this.selection.select(row);
		}
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle(): void {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}
}
