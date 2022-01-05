import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, Inject, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import {
	IconComponentModule,
	Paginator,
	PaginatorModule,
	SearchParticipantDialog
} from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { GroupApi, GroupDto } from "@student-mgmt/api-client";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

class GroupFilter {
	name: string;
}

@Component({
	selector: "student-mgmt-search-group",
	templateUrl: "./search-group.dialog.html",
	styleUrls: ["./search-group.dialog.scss"]
	//changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SearchGroupDialog extends UnsubscribeOnDestroy implements OnInit {
	dataSource: MatTableDataSource<GroupDto>; //new BehaviorSubject(new ([]));
	displayedColumns = ["select", "name", "open"];
	selection = new SelectionModel<GroupDto>(false, []);

	filter = new GroupFilter();
	groupnameFilterChanged$ = new Subject<void>();

	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(
		private dialogRef: MatDialogRef<SearchParticipantDialog>,
		@Inject(MAT_DIALOG_DATA) public readonly courseId: string,
		private groupApi: GroupApi
	) {
		super();
	}

	ngOnInit(): void {
		this.searchGroups();

		// Subscribe to changes of username filter: Trigger search 500ms after user stopped typing
		this.subs.sink = this.groupnameFilterChanged$
			.pipe(debounceTime(300))
			.subscribe(() => this.searchGroups());
	}

	/** Closes the dialog and returns `undefined`. */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**Closes the dialog and returns the selected courses. */
	onConfirm(): void {
		this.dialogRef.close(this.selection.selected?.[0]);
	}

	searchGroups(triggeredByPaginator = false): void {
		const skip = triggeredByPaginator ? this.paginator.getSkip() : 0;
		const take = this.paginator.pageSize;

		this.subs.sink = this.groupApi
			.getGroupsOfCourse(
				this.courseId,
				skip,
				take,
				this.filter.name,
				undefined,
				undefined,
				undefined,
				"response"
			)
			.subscribe(response => {
				this.dataSource = new MatTableDataSource(response.body);
				this.paginator.setTotalCountFromHttp(response);
				if (!triggeredByPaginator) this.paginator.goToFirstPage();
			});
	}

	/** Selects the given row. Removes selection, if already selected. */
	select(row: GroupDto): void {
		if (this.selection.isSelected(row)) {
			this.selection.deselect(row);
		} else {
			this.selection.select(row);
		}
	}
}

@NgModule({
	declarations: [SearchGroupDialog],
	exports: [SearchGroupDialog],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatTableModule,
		TranslateModule,
		IconComponentModule,
		PaginatorModule
	]
})
export class SearchGroupDialogModule {}
