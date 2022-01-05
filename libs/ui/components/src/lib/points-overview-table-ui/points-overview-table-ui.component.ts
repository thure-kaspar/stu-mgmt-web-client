import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { matchesParticipant } from "@student-mgmt-client/util-helper";
import { AssignmentDto, PointsOverviewDto } from "@student-mgmt/api-client";
import { BehaviorSubject } from "rxjs";
import { createTableData, StudentResult } from "./create-table-data";

export type PointsOverviewTableProps = {
	pointsOverview: PointsOverviewDto;
	courseId: string;
};

@Component({
	selector: "student-mgmt-points-overview-table-ui",
	templateUrl: "./points-overview-table-ui.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsOverviewTableUiComponent {
	_assignments$ = new BehaviorSubject<AssignmentDto[]>([]);
	_props!: PointsOverviewTableProps;

	dataSource = new MatTableDataSource<StudentResult>([]);
	displayedColumns: string[] = [];

	@ViewChild(MatSort, { static: true }) sort!: MatSort;

	@Input() set props(p: PointsOverviewTableProps) {
		this._props = p;

		this.dataSource = new MatTableDataSource(createTableData(p.pointsOverview));
		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = ({ student }, filter): boolean =>
			matchesParticipant(filter.toLowerCase(), student);

		this.displayedColumns = [
			"displayName",
			"matrNr",
			"total",
			...p.pointsOverview.assignments.map(a => a.id),
			"spacer"
		];
	}
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatTableModule,
		MatSortModule,
		TranslateModule,
		MatFormFieldModule,
		MatInputModule
	],
	declarations: [PointsOverviewTableUiComponent],
	exports: [PointsOverviewTableUiComponent]
})
export class PointsOverviewTableUiComponentModule {}
