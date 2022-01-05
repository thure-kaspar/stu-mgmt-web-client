import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TranslateModule } from "@ngx-translate/core";
import { CourseParticipantsApi, ParticipantDto } from "@student-mgmt/api-client";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { Paginator, PaginatorModule } from "../../paginator/paginator.component";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

class ParticipantsFilter {
	includeStudents = false;
	includeTutors = false;
	includeLecturers = false;
	username?: string;
	groupName?: string;
}

/**
 * Dialog that allows users to search for participants of a course.
 * @param courseId
 * @returns List of selected participants.
 */
@Component({
	selector: "student-mgmt-search-participant",
	templateUrl: "./search-participant.dialog.html",
	styleUrls: ["./search-participant.dialog.scss"]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SearchParticipantDialog extends UnsubscribeOnDestroy implements OnInit {
	participants!: ParticipantDto[];
	filter = new ParticipantsFilter();
	displayedColumns: string[] = ["select", "username", "displayName", "role"];
	dataSource!: MatTableDataSource<ParticipantDto>;
	selection = new SelectionModel<ParticipantDto>(false, []);

	usernameFilterChangedSubject = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator!: Paginator;

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

		const roles: ParticipantDto.RoleEnum[] = [];
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
			.subscribe({
				next: response => {
					this.dataSource = new MatTableDataSource(response.body!);
					this.paginator.setTotalCountFromHttp(response);
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
				},
				error: error => {
					console.log(error);
				}
			});
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

@NgModule({
	declarations: [SearchParticipantDialog],
	exports: [SearchParticipantDialog],
	imports: [
		CommonModule,
		TranslateModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCheckboxModule,
		MatTableModule,
		FormsModule,
		PaginatorModule
	]
})
export class SearchParticipantDialogModule {}
