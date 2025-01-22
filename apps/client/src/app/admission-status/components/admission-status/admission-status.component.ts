import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { DownloadService } from "@student-mgmt-client/services";
import {
	AssignmentTypeChipComponentModule,
	ThumbChipComponentModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import {
	AdmissionStatusActions,
	AdmissionStatusSelectors,
	CourseSelectors
} from "@student-mgmt-client/state";
import {
	getRouteParam,
	matchesParticipant,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	AdmissionRuleDto,
	AdmissionStatusDto
} from "@student-mgmt/api-client";
import { combineLatest } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { ChartsModule } from "../../../charts/charts.module";
import { VerticalBarChartData } from "../../../charts/components/vertical-bar-chart/vertical-bar-chart.component";
import { mapToRangeLabel, Range } from "../../../charts/range";
import { AdmissionRuleUiComponentModule } from "@student-mgmt-client/components";

type ChartData = {
	data: VerticalBarChartData;
	xAxisLabel: string;
	yAxisLabel: string;
	rule: AdmissionRuleDto;
};

type Statistic = { title: string; value: string | number };

@Component({
    selector: "student-mgmt-admission-status",
    templateUrl: "./admission-status.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AdmissionStatusComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	displayedColumns = [];

	criteria$ = this.store.select(CourseSelectors.selectCourse).pipe(
		filter(course => !!course),
		map(course => course.admissionCriteria),
		tap(criteria => {
			this.displayedColumns = [
				"displayName",
				"matrNr",
				"hasAdmission",
				"fulfillsAdmissionCriteria",
				"hasAdmissionFromPreviousSemester"
			];

			if (criteria?.rules) {
				this.displayedColumns.push(...criteria.rules.map((rule, index) => "rule" + index));
			}
		})
	);

	admissionStatusState$ = this.store
		.select(AdmissionStatusSelectors.selectAdmissionStatusState)
		.pipe(
			tap(state => {
				if (!state.data) return;

				this.dataSource = new MatTableDataSource(state.data);
				this.dataSource.sort = this.sort;
				this.dataSource.filterPredicate = (data, filter): boolean =>
					matchesParticipant(filter.toLowerCase(), data.participant);
			})
		);

	charts$ = combineLatest([this.criteria$, this.admissionStatusState$]).pipe(
		filter(([criteria, admissionStatusState]) => !!criteria && !!admissionStatusState.data),
		tap(([criteria, admissionStatusState]) => {
			this.overallStatistics = this.createStatistics(admissionStatusState.data);
			this.ruleStatistics = this.createAdmissionRuleStatistics(
				criteria,
				admissionStatusState.data
			);
		}),
		map(([criteria, admissionStatusState]) =>
			this.createChartData(criteria, admissionStatusState.data)
		)
	);

	overallStatistics: Statistic[];
	ruleStatistics: Statistic[][];

	dataSource = new MatTableDataSource<AdmissionStatusDto>([]);
	@ViewChild(MatSort) sort: MatSort;

	ruleType = AdmissionRuleDto.TypeEnum;

	constructor(
		private downloadService: DownloadService,
		private route: ActivatedRoute,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.store.dispatch(
			AdmissionStatusActions.loadAdmissionStatus({ courseId: this.courseId })
		);
	}

	createChartData(
		criteria: AdmissionCriteriaDto,
		admissionStatus: AdmissionStatusDto[]
	): ChartData[] {
		const charts: ChartData[] = [];

		criteria.rules.forEach((rule, index) => {
			if (rule.type === "REQUIRED_PERCENT_OVERALL") {
				charts.push({
					rule,
					data: this._createRequiredPercentOverallChart(index, admissionStatus),
					xAxisLabel: "Domain.Points",
					yAxisLabel: "Common.Count"
				});
			} else if (rule.type === "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES") {
				charts.push({
					rule,
					data: this._createIndividualPercentWithAllowedFailuresChart(
						index,
						admissionStatus
					),
					xAxisLabel: "Anzahl nicht bestandener Aufgaben",
					yAxisLabel: "Common.Count"
				});
			}
		});

		return charts;
	}

	_createRequiredPercentOverallChart(
		ruleIndex: number,
		admissionStatus: AdmissionStatusDto[]
	): VerticalBarChartData {
		const ranges: Range[] = [
			new Range(0, 0, "0"),
			new Range(1, 9),
			new Range(10, 19),
			new Range(20, 29),
			new Range(30, 39),
			new Range(40, 49),
			new Range(50, 59),
			new Range(60, 69),
			new Range(70, 79),
			new Range(80, 89),
			new Range(90, 99),
			new Range(100, 100, "100")
		];

		const counts = new Map<string, number>();
		ranges.forEach(range => counts.set(range.label, 0));

		for (const result of admissionStatus) {
			const rangeLabel = mapToRangeLabel(ranges, result.results[ruleIndex].achievedPercent);
			counts.set(rangeLabel, counts.get(rangeLabel) + 1);
		}

		return ranges.map(range => ({
			name: range.label + "%",
			value: counts.get(range.label)
		}));
	}

	_createIndividualPercentWithAllowedFailuresChart(
		ruleIndex: number,
		admissionStatus: AdmissionStatusDto[]
	): VerticalBarChartData {
		const ranges: Range[] = [
			new Range(0, 0, "0"),
			new Range(1, 1, "1"),
			new Range(2, 2, "2"),
			new Range(3, 3, "3"),
			new Range(4, 4, "4"),
			new Range(5, 5, "5+")
		];

		const counts = new Map<string, number>();
		ranges.forEach(range => counts.set(range.label, 0));

		for (const result of admissionStatus) {
			const rangeLabel = mapToRangeLabel(ranges, result.results[ruleIndex].achievedPoints);
			counts.set(rangeLabel, counts.get(rangeLabel) + 1);
		}

		return ranges.map(range => ({
			name: range.label,
			value: counts.get(range.label)
		}));
	}

	createStatistics(admissionStatus: AdmissionStatusDto[]): Statistic[] {
		const counts = {
			hasAdmission: 0,
			fulfillsAdmissionCriteria: 0,
			hasAdmissionFromPreviousSemester: 0
		};

		const translations = {
			hasAdmission: "Zulassungen",
			fulfillsAdmissionCriteria: "Kriterien erfüllt",
			hasAdmissionFromPreviousSemester: "Altzulassungen"
		};

		for (const result of admissionStatus) {
			if (result.hasAdmission) counts.hasAdmission++;
			if (result.fulfillsAdmissionCriteria) counts.hasAdmissionFromPreviousSemester++;
			if (result.hasAdmissionFromPreviousSemester) counts.hasAdmissionFromPreviousSemester++;
		}

		return Object.keys(counts).map(key => ({
			title: translations[key],
			value: `${counts[key]} (${(counts[key] / admissionStatus.length) * 100}%)`
		}));
	}

	createAdmissionRuleStatistics(
		criteria: AdmissionCriteriaDto,
		admissionStatus: AdmissionStatusDto[]
	): Statistic[][] {
		const allRuleStats: Statistic[][] = [];

		criteria.rules.map((rule, index) => {
			const ruleStats: Statistic[] = [];
			let passedRule = 0;
			let sumOfPercentages = 0;

			for (const result of admissionStatus) {
				if (result.results[index].passed) {
					passedRule++;
				}

				sumOfPercentages += result.results[index].achievedPercent;
			}

			ruleStats.push({
				title: "Bestanden",
				value: `${passedRule} (${(passedRule / admissionStatus.length) * 100}%)`
			});
			ruleStats.push({
				title: "Common.Average",
				value: (sumOfPercentages / admissionStatus.length).toFixed(1) + "%"
			});

			allRuleStats.push(ruleStats);
		});

		return allRuleStats;
	}

	exportToExcel(): void {
		this.downloadService.downloadFromApi(
			`export/${this.courseId}/admission-status`,
			`${this.courseId}-admission-status.xlsx`
		);
	}
}

@NgModule({
	declarations: [AdmissionStatusComponent],
	exports: [AdmissionStatusComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatButtonModule,
		MatTableModule,
		MatSortModule,
		MatTabsModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule,
		ChartsModule,
		AdmissionRuleUiComponentModule,
		AssignmentTypeChipComponentModule,
		ThumbChipComponentModule,
		TitleComponentModule
	]
})
export class AdmissionStatusComponentModule {}
