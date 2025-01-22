import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { CourseFacade, DownloadService, ToastService } from "@student-mgmt-client/services";
import {
	ChipComponentModule,
	IconComponentModule,
	SimpleChipComponentModule,
	ThumbChipComponentModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssignmentSelectors } from "@student-mgmt-client/state";
import {
	nestedPropertyAccessor,
	RoundingMethod,
	UnsubscribeOnDestroy
} from "@student-mgmt-client/util-helper";
import {
	AdmissionCriteriaDto,
	AssessmentApi,
	AssessmentDto,
	AssignmentDto
} from "@student-mgmt/api-client";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, take } from "rxjs/operators";
import { ChartsModule } from "../../charts/charts.module";
import {
	VerticalBarChartData,
	VerticalBarChartOptions
} from "../../charts/components/vertical-bar-chart/vertical-bar-chart.component";

type AssessmentDtoExtended = AssessmentDto & {
	roundedPoints?: number;
	hasPassed?: boolean;
};

type AssessmentStatistics = {
	countPassed: number;
	countFailed: number;
	countNoPoints: number;
	highestScore: number;
	lowestScore: number;
	averageScore: number;
};

@Component({
    selector: "student-mgmt-created-assessments",
    templateUrl: "./created-assessments.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CreatedAssessmentsComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	assignmentId: string;
	displayedColumns: string[] = [
		"view",
		"isDraft",
		"hasPassed",
		"achievedPoints",
		"for",
		"creator.displayName",
		"creationDate",
		"lastUpdatedBy.displayName",
		"updateDate"
	];
	filter: string;
	dataSource = new MatTableDataSource<AssessmentDtoExtended>([]);
	statistics: AssessmentStatistics;
	requiredPoints: number | undefined;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	stateEnum = AssignmentDto.StateEnum;

	chartData: VerticalBarChartData;
	chartOptions = new VerticalBarChartOptions();

	loading$ = new BehaviorSubject(true);

	constructor(
		private courseFacade: CourseFacade,
		private assessmentApi: AssessmentApi,
		private downloadService: DownloadService,
		private route: ActivatedRoute,
		private toast: ToastService,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.loadAssessments();
	}

	loadAssessments(): void {
		this.subs.sink = combineLatest([
			this.assessmentApi.getAssessmentsForAssignment(this.courseId, this.assignmentId),
			this.store.select(AssignmentSelectors.selectAssignment(this.assignmentId)),
			this.courseFacade.course$
		])
			.pipe(
				filter(
					([assessments, assignment, course]) => !!assessments && !!assignment && !!course
				),
				take(1)
			)
			.subscribe({
				next: ([assessments, assignment, course]) => {
					const rule = course.admissionCriteria?.rules.find(
						r =>
							r.assignmentType === assignment.type &&
							r.type === "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES"
					);

					this.requiredPoints = this.getRequiredPointsForAssignment(
						assignment,
						course.admissionCriteria
					);

					if (rule) {
						const round = RoundingMethod(
							rule.achievedPercentRounding.type,
							rule.achievedPercentRounding.decimals
						);

						(assessments as AssessmentDtoExtended[]).forEach(assessment => {
							assessment.hasPassed = false;

							if (assessment.achievedPoints) {
								assessment.roundedPoints = round(assessment.achievedPoints);
								assessment.hasPassed =
									assessment.roundedPoints >= this.requiredPoints;
							}
						});
					}

					this.setDataSource(assessments);

					if (assessments.length > 0) {
						this.statistics = this._createStatistics(assessments);

						this.chartData = this._createChartData(
							assessments,
							assignment.points + (assignment.bonusPoints ?? 0)
						);

						if (this.requiredPoints) {
							this.setSemanticChartColors(this.requiredPoints);
						}
					}

					this.loading$.next(false);
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	private setDataSource(assessments: AssessmentDto[]): void {
		this.dataSource = new MatTableDataSource(assessments);
		this.dataSource.filterPredicate = (assessment, filter): boolean => {
			const _filter = filter.toLowerCase();
			return (
				assessment.group?.name.toLowerCase().includes(_filter) ||
				assessment.participant?.displayName.toLowerCase().includes(_filter) ||
				!!assessment.group?.members?.find(member =>
					member.displayName.toLowerCase().includes(_filter)
				)
			);
		};
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.dataSource.sortingDataAccessor = nestedPropertyAccessor;
	}

	_createStatistics(assessments: AssessmentDtoExtended[]): AssessmentStatistics {
		let countPassed = 0;
		let countFailed = 0;
		let countHasPoints = 0;
		let countNoPoints = 0;
		let highestScore = Number.MIN_VALUE;
		let lowestScore = Number.MAX_VALUE;
		let totalPoints = 0;

		for (const assessment of assessments) {
			if (assessment.hasPassed == true) countPassed++;
			if (assessment.hasPassed == false) countFailed++;
			if (!Number.isFinite(assessment.achievedPoints)) {
				countNoPoints++;
			} else {
				countHasPoints++;
				totalPoints += assessment.achievedPoints;
				highestScore = Math.max(highestScore, assessment.achievedPoints);
				lowestScore = Math.min(lowestScore, assessment.achievedPoints);
			}
		}

		let averageScore = totalPoints / countHasPoints;

		// Avoid displaying Number.MIN_VALUE etc. in UI
		if (assessments.length == countNoPoints) {
			highestScore = 0;
			lowestScore = 0;
			averageScore = 0;
		}

		return {
			countPassed,
			countFailed,
			countNoPoints,
			highestScore,
			lowestScore,
			averageScore
		};
	}

	/**
	 * Creates a histogram that contains `achievedPoints` and the count of their occurrence.
	 */
	_createChartData(
		assessments: AssessmentDtoExtended[],
		maxPoints: number
	): VerticalBarChartData {
		const data: VerticalBarChartData = [];
		const pointsToCountMap = new Map<number, number>();

		for (let points = 0; points <= maxPoints; points++) {
			pointsToCountMap.set(points, 0);
		}

		for (const assessment of assessments) {
			const score = assessment.roundedPoints ?? assessment.achievedPoints ?? -1; // -1 is used when assessment has no score
			pointsToCountMap.set(score, (pointsToCountMap.get(score) ?? 0) + 1);
		}

		const sorted = Array.from(pointsToCountMap).sort((a, b) => a[0] - b[0]);

		for (const [achievedPoints, count] of sorted) {
			data.push({
				name: achievedPoints.toString(),
				value: count
			});
		}

		return data;
	}

	/**
	 * Checks the course's admission criteria for an `INDIVIDUAL_PERCENT` rule that matches the type
	 * of this assignment.
	 * @return Number of required points or `undefined` if there is no matching rule.
	 */
	private getRequiredPointsForAssignment(
		assignment: AssignmentDto,
		admissionCriteria: AdmissionCriteriaDto
	): number | undefined {
		const rule = admissionCriteria?.rules.find(
			r =>
				r.assignmentType === assignment.type &&
				r.type === "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES"
		);

		if (rule) {
			return (assignment.points * rule.requiredPercent) / 100;
		}

		return undefined;
	}

	private setSemanticChartColors(requiredPoints: number): void {
		this.chartOptions.customColors = this.chartData.map(entry => ({
			name: entry.name,
			value: Number(entry.name) >= requiredPoints ? "var(--accent)" : "var(--primary)"
		}));
	}

	exportToExcel(): void {
		this.downloadService.downloadFromApi(
			`export/${this.courseId}/assessments?assignmentId=${this.assignmentId}`,
			`${this.courseId}-${this.assignmentId}-assessments.xlsx`
		);
	}
}

@NgModule({
	declarations: [CreatedAssessmentsComponent],
	exports: [CreatedAssessmentsComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatButtonModule,
		MatTableModule,
		MatSortModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		TranslateModule,
		ChartsModule,
		IconComponentModule,
		ChipComponentModule,
		SimpleChipComponentModule,
		ThumbChipComponentModule,
		TitleComponentModule
	]
})
export class CreatedAssessmentsComponentModule {}
