import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	NgModule,
	OnInit,
	ViewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { Paginator, PaginatorModule } from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { AssignmentDto, AssignmentRegistrationApi, GroupDto } from "@student-mgmt/api-client";
import { debounceTime, firstValueFrom, Subject } from "rxjs";

export type RegisteredGroupsDialogData = {
	courseId: string;
	assignment: AssignmentDto;
};

@Component({
    selector: "student-mgmt-registered-groups",
    templateUrl: "./registered-groups.dialog.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class RegisteredGroupsDialog extends UnsubscribeOnDestroy implements OnInit {
	dataSource = new MatTableDataSource<GroupDto>([]);
	readonly selection = new SelectionModel<GroupDto>(false);
	groupNameFilterChanged$ = new Subject<string>();
	@ViewChild(Paginator, { static: true }) private paginator: Paginator;
	displayedColumns = ["select", "name", "members"];

	constructor(
		@Inject(MAT_DIALOG_DATA) readonly data: RegisteredGroupsDialogData,
		private readonly registrationApi: AssignmentRegistrationApi,
		private dialogRef: MatDialogRef<RegisteredGroupsDialog, GroupDto | undefined>,
		private cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		if (!this.data) {
			throw Error("Data was not passed to RegisteredGroupsDialog.");
		}

		this.searchRegisteredGroups();

		this.subs.sink = this.groupNameFilterChanged$
			.pipe(debounceTime(300))
			.subscribe(groupName => this.searchRegisteredGroups(groupName));
	}

	async searchRegisteredGroups(groupName?: string, triggeredByPaginator = false): Promise<void> {
		const [skip, take] = this.paginator.getSkipAndTake();

		const response = await firstValueFrom(
			this.registrationApi.getRegisteredGroups(
				this.data.courseId,
				this.data.assignment.id,
				skip,
				take,
				groupName?.length > 0 ? groupName : undefined,
				"response"
			)
		);

		if (!triggeredByPaginator) {
			this.paginator.goToFirstPage();
		}

		this.dataSource = new MatTableDataSource(response.body);
		this.paginator.setTotalCountFromHttp(response);
		if (!triggeredByPaginator) this.paginator.goToFirstPage();
		this.cdRef.detectChanges();
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
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		TranslateModule,
		PaginatorModule
	],
	declarations: [RegisteredGroupsDialog],
	exports: [RegisteredGroupsDialog]
})
export class RegisteredGroupsDialogModule {}
